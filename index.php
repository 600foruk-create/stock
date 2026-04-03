<?php
// Main Entry Point
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>StockFlow - Modern Stock Manager</title>
    <!-- Modular CSS included here -->
    <link rel="stylesheet" href="assets/css/style.css?v=<?= time(); ?>">
</head>
<body>
    <!-- Login Page -->
    <?php include 'views/login.php'; ?>

    <!-- Main App -->
    <div id="app" style="display: none;">
        <div class="app-wrapper">
            <!-- Sidebar -->
            <aside class="sidebar">
                <div class="sidebar-header">
                    <div class="company-logo" id="sidebarLogo" onclick="showCompanySettings()">📦</div>
                    <div class="company-name" id="sidebarCompany" onclick="showCompanySettings()">StockFlow</div>
                </div>
                <div class="sidebar-menu">
                    <button class="menu-item active" onclick="switchModule('finishGood')"><i>📊</i> Finish Good</button>
                    <button class="menu-item" onclick="switchModule('rawMaterials')"><i>🏗️</i> Raw Materials</button>
                    <button class="menu-item" onclick="switchModule('store')"><i>🏬</i> Store</button>
                    <button class="menu-item" onclick="switchModule('settings')"><i>⚙️</i> Settings</button>
                </div>
                <div class="sidebar-footer">
                    <button class="logout-btn" onclick="logout()"><i>🚪</i> Logout</button>
                </div>
            </aside>

            <!-- Main Content -->
            <main class="main-content">
                <!-- Navigation Tabs -->
                <div class="nav-tabs" id="finishGoodTabs">
                    <button class="nav-tab active" onclick="showTab('dashboard')">📊 Dashboard</button>
                    <button class="nav-tab" onclick="showTab('dataEntry')">📝 Data Entry</button>
                    <button class="nav-tab" onclick="showTab('orders')">📋 Orders</button>
                    <button class="nav-tab" onclick="showTab('categories')">🏷️ Categories</button>
                    <button class="nav-tab" onclick="showTab('customers')">👥 Customers</button>
                    <button class="nav-tab" onclick="showTab('stockList')">📦 Stock List</button>
                    <button class="nav-tab" onclick="showTab('lowStockReport')">⚠️ Low Stock</button>
                </div>

                <!-- Modular Tab Content Includes -->
                <?php include 'views/dashboard.php'; ?>
                <?php include 'views/dataentry.php'; ?>
                <?php include 'views/orders.php'; ?>
                <?php include 'views/categories.php'; ?>
                <?php include 'views/customers.php'; ?>
                <?php include 'views/stocklist.php'; ?>
                <?php include 'views/lowstockreport.php'; ?>

                <!-- New Modules Placeholders -->
                <div id="rawMaterialsPanel" style="display: none; padding: 2rem; text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🏗️</div>
                    <h2 style="color: var(--sky-600);">Raw Materials</h2>
                    <p style="color: var(--gray-500);">Module coming soon. Here you can manage your inventory of raw materials.</p>
                </div>

                <div id="storePanel" style="display: none; padding: 2rem; text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🏬</div>
                    <h2 style="color: var(--sky-600);">Store</h2>
                    <p style="color: var(--gray-500);">Module coming soon. Manage your internal store and non-product inventory here.</p>
                </div>

                <!-- Settings Block -->
                <div id="settingsPanel" style="display: none;">
                    <?php include 'views/settings.php'; ?>
                </div>

            </main>
        </div>
    </div>

    <!-- Modals Include -->
    <?php include 'views/modals.php'; ?>

    <!-- Modular JS Included here -->
    <script src="assets/js/main.js?v=<?= time(); ?>"></script>
</body>
</html>
