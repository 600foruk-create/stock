<div id="invoiceModal" class="modal">
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>🧾 Invoice</h3>
                <span class="close-modal" onclick="closeInvoiceModal()">&times;</span>
            </div>
            <div id="invoiceContent"></div>
            <div class="action-buttons" style="justify-content: center; margin-top: 1rem;">
                <button class="btn btn-primary" onclick="printInvoice()">🖨️ Print Invoice</button>
                <button class="btn btn-danger" onclick="closeInvoiceModal()">Close</button>
            </div>
        </div>
    </div>

    <div id="editOrderModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>✏️ Edit Order #<span id="editOrderId"></span></h3>
                <span class="close-modal" onclick="closeEditModal()">&times;</span>
            </div>
            <div id="editOrderForm"></div>
        </div>
    </div>

    <div id="addMainCategoryModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="mainCategoryModalTitle">➕ Add Brand</h3>
                <span class="close-modal" onclick="closeAddMainCategoryModal()">&times;</span>
            </div>
            <input type="hidden" id="editMainCategoryId">
            <div class="form-group">
                <label>Brand Name</label>
                <input type="text" id="mainCategoryName" class="form-control">
            </div>
            <div class="form-group">
                <label>Brand Code (e.g., 01)</label>
                <input type="text" id="mainCategoryCode" class="form-control" placeholder="01" maxlength="2">
            </div>
            <div class="form-group">
                <label>Brand Color</label>
                <input type="color" id="mainCategoryColor" class="form-control" value="#2196f3">
            </div>
            <div class="form-group">
                <label>Low Stock Limit</label>
                <input type="number" id="mainCategoryLowStock" class="form-control" value="10">
            </div>
            <button class="btn btn-success" onclick="saveMainCategory()" style="width:100%;">Save Brand</button>
        </div>
    </div>

    <div id="addSubCategoryModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="subCategoryModalTitle">➕ Add Size</h3>
                <span class="close-modal" onclick="closeAddSubCategoryModal()">&times;</span>
            </div>
            <input type="hidden" id="editSubCategoryId">
            <div class="form-group">
                <label>Brand</label>
                <select id="subCategoryMainSelect" class="form-control"></select>
            </div>
            <div class="form-group">
                <label>Size</label>
                <div class="input-group" style="display: flex; gap: 0.5rem;">
                    <input type="number" id="subCategoryName" class="form-control" step="0.1" min="0" placeholder="e.g., 4" style="flex: 2;">
                    <select id="subCategoryUnit" class="form-control" style="flex: 1;">
                        <option value="inch">Inch (" )</option>
                        <option value="mm">mm</option>
                    </select>
                </div>
            </div>
            <button class="btn btn-success" onclick="saveSubCategory()" style="width:100%;">Save Size</button>
        </div>
    </div>

    <div id="addItemModal" class="modal">
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3 id="itemModalTitle">➕ Add Item</h3>
                <span class="close-modal" onclick="closeAddItemModal()">&times;</span>
            </div>
            <input type="hidden" id="editItemId">
            <input type="hidden" id="itemMainId">
            <input type="hidden" id="itemSubId">
            <div class="form-group">
                <label>Length</label>
                <div class="input-group">
                    <input type="number" id="itemLength" class="form-control" value="13" step="0.1" min="0">
                    <span>ft</span>
                </div>
            </div>
            <div class="form-group">
                <label>Weight</label>
                <div class="input-group">
                    <input type="number" id="itemWeight" step="0.01" class="form-control">
                    <span>KG</span>
                </div>
            </div>
            <div class="form-group">
                <label>Opening Stock</label>
                <input type="number" id="itemStock" class="form-control" value="0" min="0">
            </div>
            <button class="btn btn-success" onclick="saveItem()" style="width:100%;">Save Item</button>
        </div>
    </div>

    <div id="customerModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="customerModalTitle">➕ Add Customer</h3>
                <span class="close-modal" onclick="closeCustomerModal()">&times;</span>
            </div>
            <input type="hidden" id="editCustomerId">
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="customerName" class="form-control">
            </div>
            <div class="form-group">
                <label>Address</label>
                <input type="text" id="customerAddress" class="form-control">
            </div>
            <div class="form-group">
                <label>Mobile</label>
                <input type="text" id="customerMobile" class="form-control">
            </div>
            <div class="form-group">
                <label>Unique ID</label>
                <input type="text" id="customerUniqueId" class="form-control" placeholder="Auto-generated">
            </div>
            <button class="btn btn-primary" onclick="saveCustomer()" style="width:100%;">Save Customer</button>
        </div>
    </div>

    <div id="addUserModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>➕ Add User</h3>
                <span class="close-modal" onclick="closeAddUserModal()">&times;</span>
            </div>
            <div class="form-group">
                <label>Full Name</label>
                <input type="text" id="newUserName" class="form-control">
            </div>
            <div class="form-group">
                <label>Username</label>
                <input type="text" id="newUserUsername" class="form-control">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="newUserPassword" class="form-control">
            </div>
            <div class="form-group">
                <label>Role</label>
                <select id="newUserRole" class="form-control">
                    <option value="admin">Admin</option>
                    <option value="manager">Manager</option>
                    <option value="data_entry">Data Entry</option>
                    <option value="viewer">Viewer</option>
                </select>
            </div>
            <button class="btn btn-success" onclick="saveNewUser()" style="width:100%;">Create User</button>
        </div>
    </div>

    <div id="quickAddBrandModal" class="modal">
        <div class="modal-content" style="max-width:400px;">
            <div class="modal-header">
                <h3>⚡ Quick Add Brand</h3>
                <span class="close-modal" onclick="closeQuickAddBrandModal()">&times;</span>
            </div>
            <div class="form-group">
                <label>Brand Name</label>
                <input type="text" id="quickBrandName" class="form-control">
            </div>
            <div class="form-group">
                <label>Brand Code</label>
                <input type="text" id="quickBrandCode" class="form-control" placeholder="01" maxlength="2">
            </div>
            <div class="form-group">
                <label>Brand Color</label>
                <input type="color" id="quickBrandColor" class="form-control" value="#2196f3">
            </div>
            <div class="form-group">
                <label>Low Stock Limit</label>
                <input type="number" id="quickBrandLowStock" class="form-control" value="10">
            </div>
            <button class="btn btn-success" onclick="saveQuickBrand()" style="width:100%;">Add Brand</button>
        </div>
    </div>

    <div id="quickAddSizeModal" class="modal">
        <div class="modal-content" style="max-width:400px;">
            <div class="modal-header">
                <h3>⚡ Quick Add Size</h3>
                <span class="close-modal" onclick="closeQuickAddSizeModal()">&times;</span>
            </div>
            <input type="hidden" id="quickSizeBrandId">
            <div class="form-group">
                <label>Brand</label>
                <input type="text" id="quickSizeBrandName" class="form-control" readonly>
            </div>
            <div class="form-group">
                <label>Size</label>
                <div class="input-group" style="display: flex; gap: 0.5rem;">
                    <input type="number" id="quickSizeName" class="form-control" step="0.1" style="flex: 2;">
                    <select id="quickSizeUnit" class="form-control" style="flex: 1;">
                        <option value="inch">Inch (" )</option>
                        <option value="mm">mm</option>
                    </select>
                </div>
            </div>
            <button class="btn btn-success" onclick="saveQuickSize()" style="width:100%;">Add Size</button>
        </div>
    </div>

    <div id="deleteOrderModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>🗑️ Delete Order #<span id="deleteOrderId"></span></h3>
                <span class="close-modal" onclick="closeDeleteModal()">&times;</span>
            </div>
            <div style="text-align:center; padding:1rem;">
                <p>Are you sure you want to delete this order?</p>
                <button class="btn btn-danger" onclick="confirmDeleteOrder()">Yes, Delete</button>
                <button class="btn" onclick="closeDeleteModal()">Cancel</button>
            </div>
        </div>
    </div>