<div id="orders" class="tab-content">
                    <div class="action-buttons">
                        <button class="btn btn-success" onclick="showNewOrderForm()">➕ New Order</button>
                    </div>
                    <div class="filter-buttons" style="margin:1rem 0; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button class="btn btn-sm" onclick="filterOrders('all')">All</button>
                        <button class="btn btn-sm" onclick="filterOrders('pending')">Pending</button>
                        <button class="btn btn-sm" onclick="filterOrders('processing')">Processing</button>
                        <button class="btn btn-sm" onclick="filterOrders('completed')">Completed</button>
                    </div>

                    <div class="filter-bar" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; background: var(--gray-50); padding: 1rem; border-radius: 10px; border: 1px solid var(--gray-200);">
                        <input type="text" id="orderSearch" placeholder="Search Customer Name..." onkeyup="refreshOrdersList()" style="flex: 2; min-width: 200px; padding: 0.6rem; border: 1px solid var(--gray-300); border-radius: 8px;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 300px;">
                            <input type="date" id="orderDateFrom" onchange="refreshOrdersList()" style="padding: 0.6rem; border: 1px solid var(--gray-300); border-radius: 8px; flex: 1;">
                            <span style="color: var(--gray-500);">to</span>
                            <input type="date" id="orderDateTo" onchange="refreshOrdersList()" style="padding: 0.6rem; border: 1px solid var(--gray-300); border-radius: 8px; flex: 1;">
                        </div>
                        <button class="btn btn-warning" onclick="clearOrdersView()" style="white-space: nowrap;">🧹 Clear Screen</button>
                        <button class="btn btn-info" onclick="resetOrderFilters()" style="white-space: nowrap;">🔄 Reset</button>
                    </div>
                    
                    <div id="newOrderForm" style="display: none; background: var(--gray-100); padding: 1.5rem; border-radius: 1rem; margin-bottom: 1rem;">
                        <h3 style="color: var(--sky-600);">Create New Order</h3>
                        <div class="form-group">
                            <label>Date</label>
                            <input type="datetime-local" id="orderDate" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>Customer</label>
                            <div style="display:flex; gap:0.5rem; align-items:center;">
                                <div id="newCustomerWrapper" style="flex:1;"></div>
                                <button type="button" class="btn btn-success" onclick="showAddCustomerModal()" style="white-space: nowrap;">➕ Add New</button>
                            </div>
                        </div>
                        <div id="newOrderRows"></div>
                        <button class="btn btn-info" onclick="addNewOrderRow()">➕ Add Item</button>
                        <br><br>
                        <button class="btn btn-primary" onclick="saveNewOrder()">Save Order</button>
                        <button class="btn btn-danger" onclick="hideNewOrderForm()">Cancel</button>
                    </div>
                    
                    <div id="customerOrdersList"></div>
                </div>