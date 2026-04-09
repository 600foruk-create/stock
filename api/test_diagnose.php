<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$_GET['action'] = 'get_all';
$_SERVER['REQUEST_METHOD'] = 'GET';

echo "--- TESTING SYNC.PHP ---\n";
include 'sync.php';
echo "\n--- TEST COMPLETE ---";
