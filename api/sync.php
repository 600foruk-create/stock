<?php
// api/sync.php
require_once 'db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    if ($method === 'GET') {
        if ($action === 'get_all') {
            $data = [
                'users' => $conn->query("SELECT * FROM users")->fetchAll(PDO::FETCH_ASSOC),
                'mainCategories' => $conn->query("SELECT * FROM main_categories")->fetchAll(PDO::FETCH_ASSOC),
                'subCategories' => $conn->query("SELECT * FROM sub_categories")->fetchAll(PDO::FETCH_ASSOC),
                'items' => $conn->query("SELECT * FROM items")->fetchAll(PDO::FETCH_ASSOC),
                'customers' => $conn->query("SELECT * FROM customers")->fetchAll(PDO::FETCH_ASSOC),
                'orders' => $conn->query("SELECT * FROM orders")->fetchAll(PDO::FETCH_ASSOC),
                'transactions' => $conn->query("SELECT * FROM transactions")->fetchAll(PDO::FETCH_ASSOC),
                'settings' => $conn->query("SELECT * FROM settings")->fetchAll(PDO::FETCH_ASSOC),
                'rawMaterials' => $conn->query("SELECT * FROM raw_materials")->fetchAll(PDO::FETCH_ASSOC),
                'storeItems' => $conn->query("SELECT * FROM store_items")->fetchAll(PDO::FETCH_ASSOC),
            ];
            
            // Add order items to orders
            foreach ($data['orders'] as &$order) {
                $stmt = $conn->prepare("SELECT * FROM order_items WHERE order_id = ?");
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
                $stmt = $conn->prepare("UPDATE items SET main_id = ?, sub_id = ?, name = ?, weight = ?, stock = ? WHERE id = ?");
                $stmt->execute([$item['mainId'], $item['subId'], $item['name'] ?? '', $item['weight'] ?? 0, $item['stock'] ?? 0, $item['id']]);
            } else {
                $stmt = $conn->prepare("INSERT INTO items (main_id, sub_id, name, weight, stock) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$item['mainId'], $item['subId'], $item['name'] ?? '', $item['weight'] ?? 0, $item['stock'] ?? 0]);
                $item['id'] = $conn->lastInsertId();
            }
            echo json_encode(['status' => 'success', 'id' => $item['id']]);
        }

        elseif ($action === 'save_audit') {
            $auditRecords = $input['records'];
            $conn->beginTransaction();
            foreach ($auditRecords as $rec) {
                // Save audit history
                $stmt = $conn->prepare("INSERT INTO audit_records (item_id, system_qty, godown_qty, diff_qty) VALUES (?, ?, ?, ?)");
                $stmt->execute([$rec['itemId'], $rec['systemQty'], $rec['godownQty'], $rec['diffQty']]);
                
                // Update current stock
                $stmt = $conn->prepare("UPDATE items SET stock = ? WHERE id = ?");
                $stmt->execute([$rec['godownQty'], $rec['itemId']]);
            }
            $conn->commit();
            echo json_encode(['status' => 'success']);
        }

        elseif ($action === 'save_category') {
            $cat = $input['category'];
            $type = $input['type']; // 'main' or 'sub'
            
            if ($type === 'main') {
                if (isset($cat['id']) && !empty($cat['id'])) {
                    $stmt = $conn->prepare("UPDATE main_categories SET name = ?, color = ?, low_stock_limit = ? WHERE id = ?");
                    $stmt->execute([$cat['name'], $cat['color'] ?? '#2196f3', $cat['lowStockLimit'] ?? 10, $cat['id']]);
                } else {
                    $stmt = $conn->prepare("INSERT INTO main_categories (name, color, low_stock_limit) VALUES (?, ?, ?)");
                    $stmt->execute([$cat['name'], $cat['color'] ?? '#2196f3', $cat['lowStockLimit'] ?? 10]);
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
                if (isset($o['id']) && !empty($o['id'])) {
                    // Update existing order
                    $stmt = $conn->prepare("UPDATE orders SET date = ?, customer_id = ?, status = ?, total_qty = ?, total_kg = ? WHERE id = ?");
                    $stmt->execute([$o['date'], $o['customerId'], $o['status'], $o['totalQty'] ?? 0, $o['totalKg'] ?? 0, $o['id']]);
                    $orderId = $o['id'];
                    
                    // Delete existing items for full refresh (simple approach)
                    $conn->prepare("DELETE FROM order_items WHERE order_id = ?")->execute([$orderId]);
                } else {
                    // Insert new order
                    $stmt = $conn->prepare("INSERT INTO orders (date, customer_id, status, total_qty, total_kg) VALUES (?, ?, ?, ?, ?)");
                    $stmt->execute([$o['date'], $o['customerId'], $o['status'] ?? 'Pending', $o['totalQty'] ?? 0, $o['totalKg'] ?? 0]);
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
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
