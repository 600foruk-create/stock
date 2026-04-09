a
<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'db.php';
header('Content-Type: text/plain');

echo "DB CONNECTION: SUCCESS\n";
echo "DB NAME: " . $db_name . "\n\n";

echo "TABLES FOUND:\n";
$stmt = $conn->query("SHOW TABLES");
while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
    echo "- " . $row[0] . "\n";
}

echo "\nSCHEMA CHECK (items):\n";
try {
    $stmt = $conn->query("DESCRIBE items");
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $row['Field'] . " (" . $row['Type'] . ")\n";
    }
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage();
}

echo "\nDATA COUNT:\n";
$tables = ['items', 'main_categories', 'sub_categories', 'orders', 'transactions', 'audit_saved_reports'];
foreach ($tables as $t) {
    try {
        $count = $conn->query("SELECT COUNT(*) FROM $t")->fetchColumn();
        echo "$t: $count rows\n";
    } catch (Exception $e) {
        echo "$t: MISSING or ERROR (" . $e->getMessage() . ")\n";
    }
}
