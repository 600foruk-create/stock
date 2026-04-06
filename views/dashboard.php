<div id="dashboard" class="tab-content active">
                    <div class="stats-grid" id="dashboardStats"></div>
                    <div class="brands-container" id="brandStockCards"></div>
                    <!-- New Charts Section: Side-by-Side -->
                    <div id="dashboardCharts" class="dashboard-section">
                        <h3>📊 Stock Analysis | اسٹاک کا تجزیہ</h3>
                        <div class="chart-main-wrapper" style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 2rem; align-items: start;">
                            <div class="chart-box">
                                <h4 style="margin-bottom: 1rem; color: var(--gray-500); font-size: 0.9rem;">Brand Comparison | برانڈز کا موازنہ</h4>
                                <canvas id="barChart" style="max-height: 300px;"></canvas>
                            </div>
                            <div class="chart-box">
                                <h4 style="margin-bottom: 1rem; color: var(--gray-500); font-size: 0.9rem;">Distribution | اسٹاک کی تقسیم</h4>
                                <canvas id="donutChart" style="max-height: 300px;"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- New Alerts Section -->
                    <div id="lowStockAlerts" class="dashboard-section">
                        <h3>⚠️ Critical Low Stock Alerts | کم اسٹاک کی الرٹس</h3>
                        <div class="alerts-grid" id="lowStockAlertsContainer"></div>
                    </div>
                </div>