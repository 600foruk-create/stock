<div id="stockList" class="tab-content">
                    <div class="action-buttons no-print">
                        <button class="btn btn-print" onclick="printStockList()">🖨️ Print Stock List</button>
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