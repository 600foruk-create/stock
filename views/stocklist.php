<div id="stockList" class="tab-content">
                    <div class="action-buttons no-print" style="margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end; background: white; padding: 1.5rem; border-radius: 12px; box-shadow: var(--shadow-sm);">
                        <div class="form-group" style="flex: 1; min-width: 200px; margin-bottom: 0;">
                            <label style="font-size: 0.85rem; color: var(--gray-600); margin-bottom: 0.4rem; display: block;">Search Brand or Size (e.g., 2m)</label>
                            <input type="text" id="stockSearch" class="form-control" placeholder="Search Brand / Size..." oninput="refreshStockList()">
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label style="font-size: 0.85rem; color: var(--gray-600); margin-bottom: 0.4rem; display: block;">From Date</label>
                            <input type="date" id="stockDateFrom" class="form-control" onchange="refreshStockList()">
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label style="font-size: 0.85rem; color: var(--gray-600); margin-bottom: 0.4rem; display: block;">To Date</label>
                            <input type="date" id="stockDateTo" class="form-control" onchange="refreshStockList()">
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-print" onclick="printStockList()">🖨️ Print</button>
                            <button class="btn btn-secondary" onclick="clearStockFilters()">🧹 Clear</button>
                        </div>
                    </div>
                    
                    <div id="printableStock">
                        <div class="print-header">
                            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                                <div id="printLogo" style="font-size: 2.5rem;">📦</div>
                                <h1 id="printCompanyName" style="margin:0;">StockFlow</h1>
                            </div>
                            <p style="color:var(--gray-500); margin:0;">Complete Stock Report - <span id="printDate"></span></p>
                        </div>
                        
                        <h3 class="no-print" style="color:var(--sky-600); margin-bottom:1rem;">📦 Complete Stock</h3>
                        <div class="stock-list-grid" id="stockListCards"></div>
                    </div>
                </div>