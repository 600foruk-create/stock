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
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- Export Libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>
</head>
<body>
    <!-- Login Page -->
    <?php include 'views/login.php'; ?>

    <!-- Main App -->
    <div id="app" style="display: none;">
        <div class="app-wrapper">
            <!-- Sidebar -->
            <aside class="sidebar no-print">
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
                <div class="nav-tabs no-print" id="finishGoodTabs">
                    <button class="nav-tab active" onclick="showTab('dashboard')">Dashboard</button>
                    <button class="nav-tab" onclick="showTab('dataEntry')">Production IN</button>
                    <button class="nav-tab" onclick="showTab('orders')">Orders</button>
                    <button class="nav-tab" onclick="showTab('categories')">Inventory</button>
                    <button class="nav-tab" onclick="showTab('customers')">Customers</button>
                    <button class="nav-tab" onclick="showTab('stockList')">Stock List</button>
                    <button class="nav-tab" onclick="showTab('audit')">Monthly Audit</button>
                    <button class="nav-tab" onclick="showTab('lowStockReport')">Low Stock</button>
                    <button class="nav-tab" onclick="showTab('reports')">Reports Archive</button>
                </div>

                <div class="nav-tabs no-print" id="rawMaterialsTabs" style="display: none;">
                    <button class="nav-tab active" onclick="showTab('rm_dashboard')">Dashboard</button>
                    <button class="nav-tab" onclick="showTab('rm_in')">RM IN</button>
                    <button class="nav-tab" onclick="showTab('rm_out')">RM OUT</button>
                    <button class="nav-tab" onclick="showTab('rm_formulas')">Formulas</button>
                    <button class="nav-tab" onclick="showTab('rm_inventory')">RM Inventory</button>
                    <button class="nav-tab" onclick="showTab('rm_balance')">Inventory Balance</button>
                    <button class="nav-tab" onclick="showTab('rm_audit')">Monthly Audit</button>
                    <button class="nav-tab" onclick="showTab('rm_reports')">Reports</button>
                    <button class="nav-tab" onclick="showTab('rm_consumption')">PR vs RM Consumption</button>
                </div>

                <!-- Modular Tab Content Includes -->
                <?php include 'views/dashboard.php'; ?>
                <?php include 'views/dataentry.php'; ?>
                <?php include 'views/orders.php'; ?>
                <?php include 'views/categories.php'; ?>
                <?php include 'views/reports.php'; ?>
                <?php include 'views/customers.php'; ?>
                <?php include 'views/stocklist.php'; ?>
                <?php include 'views/monthlyaudit.php'; ?>
                <?php include 'views/lowstockreport.php'; ?>

                <!-- Raw Materials Module Views -->
                <!-- Raw Materials Module Views -->
                <div id="rm_dashboard" class="tab-content"><?php include 'views/rm_dashboard.php'; ?></div>
                <div id="rm_in" class="tab-content"><?php include 'views/rm_in.php'; ?></div>
                <div id="rm_out" class="tab-content"><?php include 'views/rm_out.php'; ?></div>
                <div id="rm_formulas" class="tab-content"><?php include 'views/rm_formulas.php'; ?></div>
                <div id="rm_inventory" class="tab-content"><?php include 'views/rm_inventory.php'; ?></div>
                <div id="rm_balance" class="tab-content"><?php include 'views/rm_balance.php'; ?></div>
                <div id="rm_audit" class="tab-content"><?php include 'views/rm_audit.php'; ?></div>
                <div id="rm_reports" class="tab-content"><?php include 'views/rm_reports.php'; ?></div>
                <div id="rm_consumption" class="tab-content"><?php include 'views/rm_consumption.php'; ?></div>

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
