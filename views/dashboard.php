<div id="dashboard" class="tab-content active">
    
    <!-- New Pending Minus Table added from advanced reports -->
    <div class="pending-minus-table" style="background: #fee2e2; border-radius: 18px; padding: 1.2rem; border-left: 6px solid #dc2626; margin-bottom: 2rem;">
        <h3 style="margin-bottom:1rem; color:#dc2626;">⚠️ PENDING ORDERS - NEGATIVE STOCK IMPACT</h3>
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Brand</th>
                        <th>Product</th>
                        <th>Current Stock</th>
                        <th>Pending Orders</th>
                        <th>Would Be After Orders</th>
                    </tr>
                </thead>
                <tbody id="pendingNegativeBody">
                    <!-- Populated by JS -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- Original stats grid merged with new styles logic -->
    <div class="stats-grid" id="dashboardStats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <!-- Populated by js mimicking new logic -->
    </div>

    <!-- Charts block -->
    <div class="chart-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 2rem 0;">
        <div class="chart-card" style="background: white; border-radius: 24px; padding: 1.2rem; box-shadow: 0 8px 18px rgba(31, 70, 104, 0.06);">
            <canvas id="pieChart"></canvas>
        </div>
        <div class="chart-card" style="background: white; border-radius: 24px; padding: 1.2rem; box-shadow: 0 8px 18px rgba(31, 70, 104, 0.06);">
            <canvas id="barChart"></canvas>
        </div>
    </div>

    <!-- Original stock comparison block -->
    <div class="stock-comparison">
        <h3 style="margin: 1rem 0; color: var(--sky-600);">📊 Stock vs Pending Orders</h3>
        <div class="table-responsive">
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
                <tbody id="stockComparisonBody"></tbody>
            </table>
        </div>
    </div>
</div>