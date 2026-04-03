<div id="stockList" class="tab-content">
                    <div class="action-buttons no-print">
                        <button class="btn btn-print" onclick="printStockList()">🖨️ Print Stock List</button>
                    </div>
                    
                    <div id="printableStock">
                        <div class="print-header">
                            <h1 id="printCompanyName">StockFlow</h1>
                            <p>Complete Stock Report - <span id="printDate"></span></p>
                        </div>
                        
                        <h3 class="no-print" style="color:var(--sky-600); margin-bottom:1rem;">📦 Complete Stock</h3>
                        <div class="stock-list-grid" id="stockListCards"></div>
                    </div>
                </div>