<?php
// api/sync.php
ob_start(); // Buffer output to prevent accidental garbage from breaking JSON
require_once 'db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    if ($method === 'GET') {
        if ($action === 'get_all') {
            $data = [
                'users' => $conn->query("SELECT id, name, username, password, role FROM users")->fetchAll(PDO::FETCH_ASSOC),
                'mainCategories' => $conn->query("SELECT id, name, code, color, low_stock_limit AS lowStockLimit FROM main_categories")->fetchAll(PDO::FETCH_ASSOC),
                'subCategories' => $conn->query("SELECT id, main_id AS mainId, name FROM sub_categories")->fetchAll(PDO::FETCH_ASSOC),
                'items' => $conn->query("SELECT id, main_id AS mainId, sub_id AS subId, name, length, weight, stock FROM items")->fetchAll(PDO::FETCH_ASSOC),
                'customers' => $conn->query("SELECT id, unique_id AS uniqueId, name, address, mobile FROM customers")->fetchAll(PDO::FETCH_ASSOC),
                'orders' => $conn->query("SELECT o.id, o.date, o.customer_id AS customerId, o.status, o.total_qty AS totalQty, o.total_kg AS totalKg, c.name AS customerName FROM orders o LEFT JOIN customers c ON o.customer_id = c.id")->fetchAll(PDO::FETCH_ASSOC),
                'transactions' => $conn->query("SELECT t.id, t.date, t.type, t.main_id AS mainId, t.sub_id AS subId, t.item_id AS itemId, t.quantity, t.customer_id AS customerId, t.notes, mc.name AS mainName, sc.name AS subName, i.name AS itemName, c.name AS customer FROM transactions t LEFT JOIN main_categories mc ON t.main_id = mc.id LEFT JOIN sub_categories sc ON t.sub_id = sc.id LEFT JOIN items i ON t.item_id = i.id LEFT JOIN customers c ON t.customer_id = c.id ORDER BY t.date DESC")->fetchAll(PDO::FETCH_ASSOC),
                'settings' => $conn->query("SELECT id, category, `key`, value FROM settings")->fetchAll(PDO::FETCH_ASSOC),
                'rawMaterials' => $conn->query("SELECT id, name, category, unit, stock, threshold FROM raw_materials")->fetchAll(PDO::FETCH_ASSOC),
                'storeItems' => $conn->query("SELECT id, name, description, stock FROM store_items")->fetchAll(PDO::FETCH_ASSOC),
                'latestAudit' => $conn->query("SELECT item_id, godown_qty FROM audit_records ar1 WHERE id = (SELECT MAX(id) FROM audit_records ar2 WHERE ar2.item_id = ar1.item_id)")->fetchAll(PDO::FETCH_ASSOC),
            ];
            
            // Add order items to orders
            foreach ($data['orders'] as &$order) {
                $stmt = $conn->prepare("SELECT id, order_id AS orderId, item_id AS itemId, quantity, length, fulfilled FROM order_items WHERE order_id = ?");
                $stmt->execute([$order['id']]);
                $order['items'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
            
            echo json_encode(['status' => 'success', 'data' => $data]);
        }
    } 
    elseif ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if ($action === 'save_all') {
            // Simplified bulk sync for migration or full update
            // Note: In a production app, individual CRUD endpoints are better.
            // For now, we'll implement specific savers for critical modules.
            echo json_encode(['status' => 'error', 'message' => 'Please use specific save actions.']);
        }
        
        elseif ($action === 'save_item') {
            $item = $input['item'];
            if (isset($item['id']) && !empty($item['id'])) {
                $stmt = $conn->prepare("UPDATE items SET main_id = ?, sub_id = ?, name = ?, length = ?, weight = ?, stock = ? WHERE id = ?");
                $stmt->execute([$item['mainId'], $item['subId'], $item['name'] ?? '', $item['length'] ?? 13, $item['weight'] ?? 0, $item['stock'] ?? 0, $item['id']]);
            } else {
                $stmt = $conn->prepare("INSERT INTO items (main_id, sub_id, name, length, weight, stock) VALUES (?, ?, ?, ?, ?, ?)");
                $stmt->execute([$item['mainId'], $item['subId'], $item['name'] ?? '', $item['length'] ?? 13, $item['weight'] ?? 0, $item['stock'] ?? 0]);
                $item['id'] = $conn->lastInsertId();
            }
            echo json_encode(['status' => 'success', 'id' => $item['id']]);
        }

        elseif ($action === 'save_user') {
            $user = $input['user'];
            if (isset($user['id']) && !empty($user['id'])) {
                $stmt = $conn->prepare("UPDATE users SET name = ?, username = ?, password = ?, role = ? WHERE id = ?");
                $stmt->execute([$user['name'], $user['username'], $user['password'], $user['role'] ?? 'User', $user['id']]);
            } else {
                $stmt = $conn->prepare("INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)");
                $stmt->execute([$user['name'], $user['username'], $user['password'], $user['role'] ?? 'User']);
                $user['id'] = $conn->lastInsertId();
            }
            echo json_encode(['status' => 'success', 'id' => $user['id']]);
        }
        
        elseif ($action === 'delete_user') {
            $id = $input['id'] ?? $_GET['id'] ?? null;
            if ($id && $id != 1) { // Prevent deleting primary admin
                $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(['status' => 'success']);
            } else { echo json_encode(['status' => 'error', 'message' => 'Cannot delete this user']); }
        }

        elseif ($action === 'save_audit') {
            $auditRecords = $input['records'];
            $conn->beginTransaction();
            foreach ($auditRecords as $rec) {
                // Save audit history
                $stmt = $conn->prepare("INSERT INTO audit_records (item_id, system_qty, godown_qty, diff_qty) VALUES (?, ?, ?, ?)");
                $stmt->execute([$rec['itemId'], $rec['systemQty'], $rec['godownQty'], $rec['diffQty']]);
            }
            $conn->commit();
            echo json_encode(['status' => 'success']);
        }

        elseif ($action === 'save_category') {
            $cat = $input['category'];
            $type = $input['type']; // 'main' or 'sub'
            
            if ($type === 'main') {
                // AUTO-REPAIR: Ensure 'code' column exists
                try {
                    $res = $conn->query("SHOW COLUMNS FROM main_categories LIKE 'code'")->fetch();
                    if (!$res) {
                        $conn->exec("ALTER TABLE main_categories ADD COLUMN code VARCHAR(50) AFTER name");
                    }
                } catch(Exception $e) { /* ignore already exists error */ }

                if (isset($cat['id']) && !empty($cat['id'])) {
                    $stmt = $conn->prepare("UPDATE main_categories SET name = ?, code = ?, color = ?, low_stock_limit = ? WHERE id = ?");
                    $stmt->execute([$cat['name'], $cat['code'] ?? '', $cat['color'] ?? '#2196f3', $cat['lowStockLimit'] ?? 10, $cat['id']]);
                } else {
                    $stmt = $conn->prepare("INSERT INTO main_categories (name, code, color, low_stock_limit) VALUES (?, ?, ?, ?)");
                    $stmt->execute([$cat['name'], $cat['code'] ?? '', $cat['color'] ?? '#2196f3', $cat['lowStockLimit'] ?? 10]);
                    $cat['id'] = $conn->lastInsertId();
                }
            } else {
                if (isset($cat['id']) && !empty($cat['id'])) {
                    $stmt = $conn->prepare("UPDATE sub_categories SET name = ?, main_id = ? WHERE id = ?");
                    $stmt->execute([$cat['name'], $cat['mainId'], $cat['id']]);
                } else {
                    $stmt = $conn->prepare("INSERT INTO sub_categories (name, main_id) VALUES (?, ?)");
                    $stmt->execute([$cat['name'], $cat['mainId']]);
                    $cat['id'] = $conn->lastInsertId();
                }
            }
            echo json_encode(['status' => 'success', 'id' => $cat['id']]);
        }
        
        elseif ($action === 'save_settings') {
            $settings = $input['settings'];
            foreach ($settings as $key => $val) {
                $stmt = $conn->prepare("INSERT INTO settings (category, `key`, value) VALUES ('company', ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)");
                $stmt->execute([$key, $val]);
            }
            echo json_encode(['status' => 'success']);
        }
        
        elseif ($action === 'save_transaction') {
            $t = $input['transaction'];
            $conn->beginTransaction();
            try {
                // Insert transaction
                $stmt = $conn->prepare("INSERT INTO transactions (date, type, main_id, sub_id, item_id, quantity, customer_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
                // Frontend uses 'PRODUCTION', 'SALE', 'ADJUSTMENT'
                $type = $t['type'] === 'PRODUCTION' ? 'IN' : ($t['type'] === 'SALE' ? 'OUT' : 'ADJ');
                $stmt->execute([
                    $t['date'] ?? date('Y-m-d H:i:s'),
                    $type,
                    $t['mainId'],
                    $t['subId'],
                    $t['itemId'],
                    $t['quantity'],
                    $t['customerId'] ?? null,
                    $t['notes'] ?? ''
                ]);
                $tId = $conn->lastInsertId();

                // Update item stock
                if ($type === 'IN') {
                    $stmt = $conn->prepare("UPDATE items SET stock = stock + ? WHERE id = ?");
                } elseif ($type === 'OUT') {
                    $stmt = $conn->prepare("UPDATE items SET stock = stock - ? WHERE id = ?");
                } else { // ADJ
                    // For adjustments, quantity is already signed (e.g., -5 for removal)
                    $stmt = $conn->prepare("UPDATE items SET stock = stock + ? WHERE id = ?");
                }
                $stmt->execute([$t['quantity'], $t['itemId']]);
                
                $conn->commit();
                echo json_encode(['status' => 'success', 'id' => $tId]);
            } catch (Exception $e) {
                $conn->rollBack();
                throw $e;
            }
        }

        elseif ($action === 'save_order') {
            $o = $input['order'];
            $conn->beginTransaction();
            try {
                // Database Date Format Fix
                $dateVal = $o['date'] ?? date('Y-m-d H:i:s');
                $dateVal = str_replace('T', ' ', $dateVal); // Change datetime-local format to MySQL format

                if (isset($o['id']) && !empty($o['id'])) {
                    // Update existing order
                    $stmt = $conn->prepare("UPDATE orders SET date = ?, customer_id = ?, status = ?, total_qty = ?, total_kg = ? WHERE id = ?");
                    $stmt->execute([$dateVal, $o['customerId'], $o['status'], $o['totalQty'] ?? 0, $o['totalKg'] ?? 0, $o['id']]);
                    $orderId = $o['id'];
                    
                    // Delete existing items for full refresh (simple approach)
                    $conn->prepare("DELETE FROM order_items WHERE order_id = ?")->execute([$orderId]);
                } else {
                    // Insert new order
                    $stmt = $conn->prepare("INSERT INTO orders (date, customer_id, status, total_qty, total_kg) VALUES (?, ?, ?, ?, ?)");
                    $stmt->execute([$dateVal, $o['customerId'], $o['status'] ?? 'Pending', (int)($o['totalQty'] ?? 0), (float)($o['totalKg'] ?? 0)]);
                    $orderId = $conn->lastInsertId();
                }

                // Insert order items
                foreach ($o['items'] as $item) {
                    $stmt = $conn->prepare("INSERT INTO order_items (order_id, item_id, quantity, length, fulfilled) VALUES (?, ?, ?, ?, ?)");
                    $stmt->execute([$orderId, $item['itemId'], $item['quantity'], $item['length'] ?? 13, $item['fulfilled'] ?? 0]);
                }

                $conn->commit();
                echo json_encode(['status' => 'success', 'id' => $orderId]);
            } catch (Exception $e) {
                $conn->rollBack();
                throw $e;
            }
        }

        elseif ($action === 'save_customer') {
            $c = $input['customer'];
            if (isset($c['id']) && !empty($c['id'])) {
                $stmt = $conn->prepare("UPDATE customers SET unique_id = ?, name = ?, address = ?, mobile = ? WHERE id = ?");
                $stmt->execute([$c['uniqueId'], $c['name'], $c['address'] ?? '', $c['mobile'] ?? '', $c['id']]);
            } else {
                $stmt = $conn->prepare("INSERT INTO customers (unique_id, name, address, mobile) VALUES (?, ?, ?, ?)");
                $stmt->execute([$c['uniqueId'], $c['name'], $c['address'] ?? '', $c['mobile'] ?? '']);
                $c['id'] = $conn->lastInsertId();
            }
            echo json_encode(['status' => 'success', 'id' => $c['id']]);
        }

        elseif ($action === 'delete_customer') {
            $id = $_GET['id'] ?? $input['id'] ?? null;
            if ($id) {
                $stmt = $conn->prepare("DELETE FROM customers WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(['status' => 'success']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'No ID provided']);
            }
        }

        elseif ($action === 'delete_order') {
            $id = $input['id'] ?? $_GET['id'] ?? null;
            if ($id) {
                $conn->beginTransaction();
                try {
                    $conn->prepare("DELETE FROM order_items WHERE order_id = ?")->execute([$id]);
                    $conn->prepare("DELETE FROM orders WHERE id = ?")->execute([$id]);
                    $conn->commit();
                    echo json_encode(['status' => 'success']);
                } catch (Exception $e) {
                    $conn->rollBack();
                    throw $e;
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'No ID provided']);
            }
        }

        elseif ($action === 'delete_category') {
            $id = $input['id'] ?? $_GET['id'] ?? null;
            $type = $input['type'] ?? $_GET['type'] ?? 'main';
            if ($id) {
                if ($type === 'main') {
                    $stmt = $conn->prepare("DELETE FROM main_categories WHERE id = ?");
                } else {
                    $stmt = $conn->prepare("DELETE FROM sub_categories WHERE id = ?");
                }
                $stmt->execute([$id]);
                echo json_encode(['status' => 'success']);
            } else { echo json_encode(['status' => 'error', 'message' => 'No ID']); }
        }

        elseif ($action === 'delete_item') {
            $id = $input['id'] ?? $_GET['id'] ?? null;
            if ($id) {
                $stmt = $conn->prepare("DELETE FROM items WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(['status' => 'success']);
            } else { echo json_encode(['status' => 'error', 'message' => 'No ID']); }
        }

        elseif ($action === 'save_raw_material') {
            $rm = $input['material'];
            if (isset($rm['id']) && !empty($rm['id'])) {
                $stmt = $conn->prepare("UPDATE raw_materials SET name = ?, category = ?, unit = ?, stock = ?, threshold = ? WHERE id = ?");
                $stmt->execute([$rm['name'], $rm['category'] ?? '', $rm['unit'] ?? 'KG', $rm['stock'] ?? 0, $rm['threshold'] ?? 10, $rm['id']]);
            } else {
                $stmt = $conn->prepare("INSERT INTO raw_materials (name, category, unit, stock, threshold) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$rm['name'], $rm['category'] ?? '', $rm['unit'] ?? 'KG', $rm['stock'] ?? 0, $rm['threshold'] ?? 10]);
                $rm['id'] = $conn->lastInsertId();
            }
            echo json_encode(['status' => 'success', 'id' => $rm['id']]);
        }

        elseif ($action === 'save_store_item') {
            $si = $input['item'];
            if (isset($si['id']) && !empty($si['id'])) {
                $stmt = $conn->prepare("UPDATE store_items SET name = ?, description = ?, stock = ? WHERE id = ?");
                $stmt->execute([$si['name'], $si['description'] ?? '', $si['stock'] ?? 0, $si['id']]);
            } else {
                $stmt = $conn->prepare("INSERT INTO store_items (name, description, stock) VALUES (?, ?, ?)");
                $stmt->execute([$si['name'], $si['description'] ?? '', $si['stock'] ?? 0]);
                $si['id'] = $conn->lastInsertId();
            }
            echo json_encode(['status' => 'success', 'id' => $si['id']]);
        }

        elseif ($action === 'delete_transaction') {
            $id = $input['id'] ?? $_GET['id'] ?? null;
            if ($id) {
                // Delete transaction record only (per user request: "delet sy stok per asr na pary")
                $stmt = $conn->prepare("DELETE FROM transactions WHERE id = ?");
                $stmt->execute([$id]);
                echo json_encode(['status' => 'success']);
            } else { echo json_encode(['status' => 'error', 'message' => 'No ID provided']); }
        }

        elseif ($action === 'clear_all_transactions') {
            $conn->exec("DELETE FROM transactions");
            echo json_encode(['status' => 'success']);
        }

        elseif ($action === 'update_transaction') {
            $t = $input['transaction'];
            $conn->beginTransaction();
            try {
                // 1. Get old transaction to calculate diff
                $stmt = $conn->prepare("SELECT item_id, quantity, type FROM transactions WHERE id = ?");
                $stmt->execute([$t['id']]);
                $old = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($old) {
                    $diff = $t['quantity'] - $old['quantity'];
                    
                    // 2. Update transaction
                    $stmt = $conn->prepare("UPDATE transactions SET date = ?, quantity = ?, notes = ? WHERE id = ?");
                    $stmt->execute([$t['date'], $t['quantity'], $t['notes'] ?? '', $t['id']]);

                    // 3. Update stock by difference
                    // modifier: IN increases stock, OUT decreases stock, ADJ is signed already
                    $modifier = ($old['type'] === 'IN') ? 1 : (($old['type'] === 'OUT') ? -1 : 1);
                    $stockChange = $diff * $modifier;

                    $stmt = $conn->prepare("UPDATE items SET stock = stock + ? WHERE id = ?");
                    $stmt->execute([$stockChange, $old['item_id']]);
                }

                $conn->commit();
                echo json_encode(['status' => 'success']);
            } catch (Exception $e) {
                $conn->rollBack();
                throw $e;
            }
        }
        elseif ($action === 'adjust_stock' || $action === 'bulk_adjust_stock') {
            $adjustments = $action === 'adjust_stock' ? [$input['adjustment']] : $input['adjustments'];
            $conn->beginTransaction();
            try {
                foreach ($adjustments as $adj) {
                    $itemId = $adj['itemId'];
                    $diff = $adj['diff']; // The difference to add/subtract
                    $notes = $adj['notes'] ?? 'Audit Adjustment';
                    $date = date('Y-m-d H:i:s');

                    // 1. Update item stock
                    $stmt = $conn->prepare("UPDATE items SET stock = stock + ? WHERE id = ?");
                    $stmt->execute([$diff, $itemId]);

                    // 2. Insert transaction record
                    $stmt = $conn->prepare("INSERT INTO transactions (date, type, main_id, sub_id, item_id, quantity, notes) 
                                           SELECT ?, 'ADJ', main_id, sub_id, id, ?, ? FROM items WHERE id = ?");
                    $stmt->execute([$date, $diff, $notes, $itemId]);
                }
                $conn->commit();
                echo json_encode(['status' => 'success']);
            } catch (Exception $e) {
                $conn->rollBack();
                throw $e;
            }
        }
    }
} catch (Exception $e) {
    if (ob_get_level() > 0) ob_clean();
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
ob_end_flush();
?>
