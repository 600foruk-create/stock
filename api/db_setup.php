<?php
// api/db_setup.php
require_once 'db.php';

try {
    $conn->exec("CREATE TABLE IF NOT EXISTS `store_main_categories` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `name` varchar(255) NOT NULL,
        `code` varchar(50) NOT NULL UNIQUE,
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    $conn->exec("CREATE TABLE IF NOT EXISTS `store_sub_categories` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `main_id` int(11) NOT NULL,
        `name` varchar(255) NOT NULL,
        `code` varchar(50) NOT NULL UNIQUE,
        PRIMARY KEY (`id`),
        FOREIGN KEY (`main_id`) REFERENCES `store_main_categories`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    // Modify existing store_items or recreate it
    $conn->exec("CREATE TABLE IF NOT EXISTS `store_items` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `sub_id` int(11) NOT NULL,
        `name` varchar(255) NOT NULL,
        `code` varchar(50) NOT NULL UNIQUE,
        `description` text DEFAULT NULL,
        `stock` decimal(15,3) DEFAULT 0,
        `low_stock_limit` decimal(15,3) DEFAULT 0,
        PRIMARY KEY (`id`),
        FOREIGN KEY (`sub_id`) REFERENCES `store_sub_categories`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;");

    echo "Database setup completed successfully.";
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
