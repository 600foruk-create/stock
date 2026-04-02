<div id="dataEntry" class="tab-content">
                    <div class="action-buttons">
                        <button class="btn btn-success" onclick="showProductionEntry()">🏭 Production (IN)</button>
                        <button class="btn btn-primary" onclick="showSaleEntry()">🛒 Sale (OUT)</button>
                        <button class="btn" onclick="showAdjustmentEntry()">⚖️ Adjustment (+/-)</button>
                    </div>
                    
                    <div id="productionForm" style="display: none; background: var(--gray-100); padding: 1.5rem; border-radius: 1rem; margin-bottom: 1rem;">
                        <h3 style="color: var(--sky-600); margin-bottom:1rem;">🏭 Production Entry</h3>
                        <div class="form-group">
                            <label>Date</label>
                            <input type="datetime-local" id="prodDate" class="form-control">
                        </div>
                        <div id="productionRows"></div>
                        <button class="btn btn-info" onclick="addProductionRow()">➕ Add Item</button>
                        <br><br>
                        <button class="btn btn-primary" onclick="saveProduction()">Save Production</button>
                        <button class="btn btn-danger" onclick="hideAllForms()">Cancel</button>
                    </div>
                    
                    <div id="saleForm" style="display: none; background: var(--gray-100); padding: 1.5rem; border-radius: 1rem; margin-bottom: 1rem;">
                        <h3 style="color: var(--sky-600); margin-bottom:1rem;">🛒 Sale Entry</h3>
                        <div class="form-group">
                            <label>Date</label>
                            <input type="datetime-local" id="saleDate" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>Customer</label>
                            <div id="saleCustomerWrapper"></div>
                        </div>
                        <div class="form-group">
                            <label>From Completed Order</label>
                            <select id="saleOrderSelect" class="form-control" onchange="loadCompletedOrderForSale()">
                                <option value="">-- Select Completed Order --</option>
                            </select>
                        </div>
                        <div id="saleRows"></div>
                        <button class="btn btn-info" onclick="addSaleRow()">➕ Add Manual Item</button>
                        <br><br>
                        <button class="btn btn-primary" onclick="saveSale()">Complete Sale</button>
                        <button class="btn btn-danger" onclick="hideAllForms()">Cancel</button>
                    </div>
                    
                    <div id="adjustmentForm" style="display: none; background: var(--gray-100); padding: 1.5rem; border-radius: 1rem; margin-bottom: 1rem;">
                        <h3 style="color: var(--sky-600); margin-bottom:1rem;">⚖️ Adjustment</h3>
                        <div class="form-group">
                            <label>Date</label>
                            <input type="datetime-local" id="adjDate" class="form-control">
                        </div>
                        <div id="adjustmentRows"></div>
                        <button class="btn btn-info" onclick="addAdjustmentRow()">➕ Add Item</button>
                        <br><br>
                        <button class="btn" onclick="saveAdjustment()">Save Adjustment</button>
                        <button class="btn btn-danger" onclick="hideAllForms()">Cancel</button>
                    </div>
                    
                    <h3 style="margin:1rem 0; color:var(--sky-600);">Recent Transactions</h3>
                    <div class="search-box">
                        <input type="text" id="transSearch" placeholder="Search..." onkeyup="filterTable('transTable', this.value)" style="width:100%; padding:0.5rem; border:1px solid var(--gray-300); border-radius:50px;">
                    </div>
                    <table class="data-table" id="transTable">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Brand</th>
                                <th>Product</th>
                                <th>Qty</th>
                                <th>Customer</th>
                            </tr>
                        </thead>
                        <tbody id="transactionsBody"></tbody>
                    </table>
                </div>