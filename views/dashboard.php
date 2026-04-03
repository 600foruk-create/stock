<div id="dashboard" class="tab-content active">
    <!-- Main Dashboard Container -->
    <div class="dashboard-container">
        
        <!-- Top Summary Cards -->
        <div class="summary-grid" id="dashboardStats">
            <!-- Dynamic Content via JS -->
        </div>

        <!-- Middle Section: Table + Chart -->
        <div class="middle-grid">
            <!-- LEFT: Stock vs Pending Table -->
            <div class="card">
                <div class="dashboard-header">
                    <div class="dashboard-title">
                        <i style="color: var(--primary);">📋</i>
                        <span>Stock vs Pending Orders</span>
                    </div>
                </div>
                <div style="overflow-x: auto;">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Brand</th>
                                <th>Size</th>
                                <th>Product</th>
                                <th>Stock</th>
                                <th>Pending</th>
                                <th>Remaining</th>
                            </tr>
                        </thead>
                        <tbody id="stockComparisonBody">
                            <!-- Dynamic Content -->
                        </tbody>
                    </table>
                </div>
                <a href="#" class="view-all" onclick="showTab('stockList'); return false;">View All ➔</a>
            </div>

            <!-- RIGHT: Stock Overview Chart -->
            <div class="card">
                <div class="dashboard-header">
                    <div class="dashboard-title">
                        <i style="color: var(--primary);">📈</i>
                        <span>Stock Overview</span>
                    </div>
                </div>
                <div class="chart-container">
                    <canvas id="stockOverviewChart"></canvas>
                </div>
                <div style="display: flex; gap: 1rem; margin-top: 1rem; justify-content: center; font-size: 0.8rem;">
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <span class="dot dot-success"></span> In Stock
                    </div>
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <span class="dot dot-warning"></span> Pending
                    </div>
                    <div style="display: flex; align-items: center; gap: 4px;">
                        <span class="dot dot-danger"></span> Low
                    </div>
                </div>
            </div>
        </div>

        <!-- Bottom Section: Full Width Table -->
        <div class="card" style="margin-top: 1rem;">
            <div class="dashboard-header">
                <div class="dashboard-title">
                    <i style="color: var(--primary);">🏢</i>
                    <span>Detailed Inventory Status</span>
                </div>
            </div>
            <div style="overflow-x: auto;">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Brand</th>
                            <th>Size</th>
                            <th>Product</th>
                            <th>Stock</th>
                            <th>Pending</th>
                            <th>Remaining</th>
                        </tr>
                    </thead>
                    <tbody id="fullStockComparisonBody">
                        <!-- Dynamic Content -->
                    </tbody>
                </table>
            </div>
        </div>

    </div>
</div>