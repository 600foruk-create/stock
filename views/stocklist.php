<div id="stockList" class="tab-content">
                    <div class="search-filter-bar no-print">
                        <div class="form-group">
                            <label>Search Brand or Size (e.g., 2m)</label>
                            <input type="text" id="stockSearch" class="form-control" placeholder="Search Brand / Size..." oninput="refreshStockList()">
                        </div>
                        <div class="form-group">
                            <label>From Date</label>
                            <input type="date" id="stockDateFrom" class="form-control" onchange="refreshStockList()">
                        </div>
                        <div class="form-group">
                            <label>To Date</label>
                            <input type="date" id="stockDateTo" class="form-control" onchange="refreshStockList()">
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-print" onclick="printStockList()">🖨️ Print</button>
                            <button class="btn btn-secondary" onclick="clearStockFilters()">🧹 Clear</button>
                        </div>
                    </div>
                    
                    <div id="printableStock">
                        <table class="print-table">
                            <thead>
                                <tr>
                                    <td>
                                        <div class="print-header-spacer"></div>
                                        <div class="print-header-content">
                                            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                                                <div id="printLogo" style="font-size: 2.5rem;">📦</div>
                                                <h1 id="printCompanyName" style="margin:0;">StockFlow</h1>
                                            </div>
                                            <p style="color:var(--gray-500); margin:0;">Complete Stock Report - <span id="printDate"></span></p>
                                            <hr style="margin: 1rem 0; border: 0; border-top: 1px solid var(--gray-200);">
                                        </div>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <h3 class="no-print" style="color:var(--sky-600); margin-bottom:1rem;">📦 Complete Stock</h3>
                                        <div class="stock-list-grid" id="stockListCards"></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>