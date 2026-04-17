<?php
// api/store_inventory.php
header('Content-Type: application/json');
require_once 'db.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'get_all':
        try {
            // Get Mains
            $stmt = $conn->query("SELECT * FROM store_main_categories ORDER BY code ASC");
            $mains = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get Subs
            $stmt = $conn->query("SELECT * FROM store_sub_categories ORDER BY code ASC");
            $subs = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get Items
            $stmt = $conn->query("SELECT * FROM store_items_new ORDER BY code ASC");
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode([
                'mains' => $mains,
                'subs' => $subs,
                'items' => $items
            ]);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'save_main':
        $id = $_POST['id'] ?? null;
        $name = $_POST['name'] ?? '';
        $code = $_POST['code'] ?? '';

        if (!$name || !$code) {
            echo json_encode(['error' => 'Name and Code are required']);
            break;
        }

        try {
            if ($id) {
                // Update
                $stmt = $conn->prepare("UPDATE store_main_categories SET name = ?, code = ? WHERE id = ?");
                $stmt->execute([$name, $code, $id]);
                echo json_encode(['success' => true, 'message' => 'Main Category updated']);
            } else {
                // Check duplicate code
                $stmt = $conn->prepare("SELECT id FROM store_main_categories WHERE code = ?");
                $stmt->execute([$code]);
                if ($stmt->fetch()) {
                    echo json_encode(['error' => 'Duplicate code']);
                    break;
                }
                // Insert
                $stmt = $conn->prepare("INSERT INTO store_main_categories (name, code) VALUES (?, ?)");
                $stmt->execute([$name, $code]);
                echo json_encode(['success' => true, 'message' => 'Main Category added']);
            }
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'save_sub':
        $id = $_POST['id'] ?? null;
        $main_id = $_POST['main_id'] ?? null;
        $name = $_POST['name'] ?? '';

        if (!$name || !$main_id) {
            echo json_encode(['error' => 'Name and Main Category are required']);
            break;
        }

        try {
            if ($id) {
                $stmt = $conn->prepare("UPDATE store_sub_categories SET name = ? WHERE id = ?");
                $stmt->execute([$name, $id]);
                echo json_encode(['success' => true, 'message' => 'Sub Category updated']);
            } else {
                // Auto-generate code
                $mainStmt = $conn->prepare("SELECT code FROM store_main_categories WHERE id = ?");
                $mainStmt->execute([$main_id]);
                $main = $mainStmt->fetch(PDO::FETCH_ASSOC);
                if (!$main) { echo json_encode(['error' => 'Main category not found']); break; }
                
                $parentCode = $main['code'];
                $code = generateNextCode($conn, 'store_sub_categories', $parentCode, 3);
                
                $stmt = $conn->prepare("INSERT INTO store_sub_categories (main_id, name, code) VALUES (?, ?, ?)");
                $stmt->execute([$main_id, $name, $code]);
                echo json_encode(['success' => true, 'code' => $code]);
            }
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'save_item':
        $id = $_POST['id'] ?? null;
        $sub_id = $_POST['sub_id'] ?? null;
        $name = $_POST['name'] ?? '';
        $stock = $_POST['stock'] ?? 0;
        $desc = $_POST['description'] ?? '';

        if (!$name || !$sub_id) {
            echo json_encode(['error' => 'Name and Sub Category are required']);
            break;
        }

        try {
            if ($id) {
                $stmt = $conn->prepare("UPDATE store_items_new SET name = ?, stock = ?, description = ? WHERE id = ?");
                $stmt->execute([$name, $stock, $desc, $id]);
                echo json_encode(['success' => true, 'message' => 'Item updated']);
            } else {
                // Auto-generate code
                $subStmt = $conn->prepare("SELECT code FROM store_sub_categories WHERE id = ?");
                $subStmt->execute([$sub_id]);
                $sub = $subStmt->fetch(PDO::FETCH_ASSOC);
                if (!$sub) { echo json_encode(['error' => 'Sub category not found']); break; }
                
                $parentCode = $sub['code'];
                $code = generateNextCode($conn, 'store_items_new', $parentCode, 4);
                
                $stmt = $conn->prepare("INSERT INTO store_items_new (sub_id, name, code, stock, description) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$sub_id, $name, $code, $stock, $desc]);
                echo json_encode(['success' => true, 'code' => $code]);
            }
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'delete_main':
        $id = $_POST['id'] ?? null;
        try {
            $check = $conn->prepare("SELECT id FROM store_sub_categories WHERE main_id = ?");
            $check->execute([$id]);
            if ($check->fetch()) {
                echo json_encode(['error' => 'Cannot delete: Sub-categories exist']);
                break;
            }
            $stmt = $conn->prepare("DELETE FROM store_main_categories WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'delete_sub':
        $id = $_POST['id'] ?? null;
        try {
            $check = $conn->prepare("SELECT id FROM store_items_new WHERE sub_id = ?");
            $check->execute([$id]);
            if ($check->fetch()) {
                echo json_encode(['error' => 'Cannot delete: Items exist']);
                break;
            }
            $stmt = $conn->prepare("DELETE FROM store_sub_categories WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;

    case 'delete_item':
        $id = $_POST['id'] ?? null;
        try {
            $stmt = $conn->prepare("DELETE FROM store_items_new WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
        } catch (PDOException $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
        break;
}

function generateNextCode($conn, $table, $parentCode, $digits) {
    // Fetch all existing codes for this parent
    $stmt = $conn->prepare("SELECT code FROM $table WHERE code LIKE ?");
    $stmt->execute([$parentCode . '%']);
    $codes = $stmt->fetchAll(PDO::FETCH_COLUMN);

    $usedNumbers = [];
    foreach ($codes as $c) {
        $suffix = substr($c, strlen($parentCode));
        if (is_numeric($suffix)) {
            $usedNumbers[] = (int)$suffix;
        }
    }
    sort($usedNumbers);

    // Find first gap
    $nextNum = 1;
    foreach ($usedNumbers as $num) {
        if ($num == $nextNum) {
            $nextNum++;
        } elseif ($num > $nextNum) {
            break;
        }
    }

    return $parentCode . str_pad($nextNum, $digits, '0', STR_PAD_LEFT);
}
?>
