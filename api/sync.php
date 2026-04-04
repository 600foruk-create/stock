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
                // Ensure value column can handle large data (auto-migration)
                $conn->exec("ALTER TABLE settings MODIFY COLUMN value MEDIUMTEXT");
                
                $stmt = $conn->prepare("INSERT INTO settings (category, `key`, value) VALUES ('company', ?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)");
                $stmt->execute([$key, $val]);
            }
            echo json_encode(['status' => 'success']);
        }
        
        // Add more specific actions as needed (categories, orders, etc.)
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
