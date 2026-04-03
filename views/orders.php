<div id="orders" class="tab-content">
                    <div class="action-buttons">
                        <button class="btn btn-success" onclick="showNewOrderForm()">➕ New Order</button>
                    </div>
                    <div class="filter-buttons" style="margin:1rem 0;">
                        <button class="btn" onclick="filterOrders('all')">All</button>
                        <button class="btn" onclick="filterOrders('pending')">Pending</button>
                        <button class="btn" onclick="filterOrders('processing')">Processing</button>
                        <button class="btn" onclick="filterOrders('completed')">Completed</button>
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