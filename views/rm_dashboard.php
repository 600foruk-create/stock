<div class="rm-dashboard">
    <!-- Top Stats Grid: 2 Columns -->
    <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2rem;">
        <div class="stat-card" style="background: white; padding: 1.5rem; border-radius: 1.2rem; border-left: 5px solid var(--sky-500); box-shadow: var(--shadow-sm);">
            <div class="stat-label" style="color: var(--gray-500); font-weight: 600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Total RM Types</div>
            <div class="stat-value" id="rmTotalItems" style="font-size: 2.5rem; font-weight: 800; color: var(--gray-800); margin-top: 0.5rem;">0</div>
        </div>
        <div class="stat-card" style="background: white; padding: 1.5rem; border-radius: 1.2rem; border-left: 5px solid var(--primary); box-shadow: var(--shadow-sm);">
            <div class="stat-label" style="color: var(--gray-500); font-weight: 600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Total Bags in Stock</div>
            <div class="stat-value" id="rmTotalBags" style="font-size: 2.5rem; font-weight: 800; color: var(--primary); margin-top: 0.5rem;">0</div>
        </div>
        <div class="stat-card" style="background: white; padding: 1.5rem; border-radius: 1.2rem; border-left: 5px solid var(--error); box-shadow: var(--shadow-sm);">
            <div class="stat-label" style="color: var(--gray-500); font-weight: 600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Low Stock Alarms</div>
            <div class="stat-value" id="rmLowStockCount" style="font-size: 2.5rem; font-weight: 800; color: var(--error); margin-top: 0.5rem;">0</div>
        </div>
    </div>

    <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap: 1.5rem;">
        <!-- Detailed Inventory Summary: Cards Layout -->
        <div class="summary-section" style="background: white; padding: 1.5rem; border-radius: 1.5rem; box-shadow: var(--shadow-md); border: 1px solid var(--gray-100);">
            <h3 style="color: var(--gray-700); margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.6rem; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px;">
                📦 Current Inventory Details
            </h3>
            <div id="rmInventorySummary" style="max-height: 500px; overflow-y: auto; padding-right: 0.5rem;">
                <!-- Populated by JS with Cards -->
                <div style="text-align: center; padding: 3rem; color: var(--gray-400);">Loading inventory data...</div>
            </div>
        </div>

        <!-- Low Stock Alerts Panel -->
        <div class="alerts-section" style="background: white; padding: 1.5rem; border-radius: 1.5rem; box-shadow: var(--shadow-md); border: 1px solid var(--gray-100);">
             <h3 style="color: var(--error); margin-bottom: 1.2rem; display: flex; align-items: center; gap: 0.6rem; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px;">
                ⚠️ Low Stock Alerts
            </h3>
            <div id="rmLowStockAlerts" style="max-height: 500px; overflow-y: auto; padding-right: 0.5rem;">
                <!-- Populated by JS -->
                <div style="text-align: center; padding: 3rem; color: var(--gray-400);">No alerts found.</div>
            </div>
        </div>
    </div>
</div>
