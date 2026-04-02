<div id="customers" class="tab-content">
                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="showAddCustomerModal()">➕ Add Customer</button>
                    </div>
                    <input type="text" id="customerSearch" placeholder="Search customers..." onkeyup="filterCustomers()" style="width:100%; padding:0.5rem; border:1px solid var(--gray-300); border-radius:50px; margin:1rem 0;">
                    <div id="customersList" style="display:grid; grid-template-columns:repeat(auto-fill,minmax(250px,1fr)); gap:1rem;"></div>
                </div>