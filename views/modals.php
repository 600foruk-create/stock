<div id="invoiceModal" class="modal">
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h3>📜 Order Details</h3>
                <span class="close-modal" onclick="closeInvoiceModal()">&times;</span>
            </div>
            <div class="modal-body" id="invoiceContent" style="padding:0;"></div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="printInvoice()">🖨️ Print Order Details</button>
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
                <div class="input-group" style="display: flex; gap: 0.5rem; align-items: center;">
                    <select id="itemLength" class="form-control" style="flex: 1;"></select>
                    <span>ft</span>
                    <button type="button" class="btn btn-sm btn-primary" onclick="promptNewLength('itemLength')" title="Add New Length" style="padding: 0 8px; font-size: 1.2rem; height: 38px;">+</button>
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
            <div class="form-group">
                <label>Low Stock Limit (Alert Threshold)</label>
                <input type="number" id="itemLowStock" class="form-control" placeholder="Leave empty for Brand default">
                <small style="color: var(--gray-500);">Sets a custom alert limit for this specific item.</small>
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
                <label>Province</label>
                <select id="customerProvinceSelect" class="form-control" onchange="updateCustomerDistrictSelect()"></select>
            </div>
            <div class="form-group">
                <label>District</label>
                <select id="customerDistrictSelect" class="form-control"></select>
            </div>
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
                <h3 id="userModalTitle">➕ Add User</h3>
                <span class="close-modal" onclick="closeAddUserModal()">&times;</span>
            </div>
            <input type="hidden" id="editUserId">
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
            <button id="userSaveBtn" class="btn btn-success" onclick="saveNewUser()" style="width:100%;">Create User</button>
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

    <div id="quickAddItemModal" class="modal">
        <div class="modal-content" style="max-width:400px;">
            <div class="modal-header">
                <h3 id="quickAddItemTitle">⚡ Quick Add Item</h3>
                <span class="close-modal" onclick="closeQuickAddItemModal()">&times;</span>
            </div>
            <input type="hidden" id="quickItemMainId">
            <input type="hidden" id="quickItemSubId">
            <div class="form-group">
                <label>Length (ft)</label>
                <div class="input-group" style="display: flex; gap: 0.5rem; align-items: center;">
                    <select id="quickItemLength" class="form-control" style="flex: 1;"></select>
                    <button type="button" class="btn btn-sm btn-primary" onclick="promptNewLength('quickItemLength')" title="Add New Length" style="padding: 0 8px; font-size: 1.2rem; height: 38px;">+</button>
                </div>
            </div>
            <div class="form-group">
                <label>Weight (kg)</label>
                <input type="number" id="quickItemWeight" class="form-control" step="0.01">
            </div>
            <div class="form-group">
                <label>Low Stock Limit</label>
                <input type="number" id="quickItemLowStock" class="form-control" placeholder="Optional">
            </div>
            <button class="btn btn-success" onclick="saveQuickItem()" style="width:100%;">Add Item</button>
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

    <div id="editTransactionModal" class="modal">
        <div class="modal-content" style="max-width: 400px;">
            <div class="modal-header">
                <h3>✏️ Edit Transaction</h3>
                <span class="close-modal" onclick="closeEditTransactionModal()">&times;</span>
            </div>
            <input type="hidden" id="editTransId">
            <div class="form-group">
                <label id="editTransInfo" style="font-weight: bold; color: var(--sky-600);"></label>
            </div>
            <div class="form-group">
                <label>Date</label>
                <input type="datetime-local" id="editTransDate" class="form-control">
            </div>
            <div class="form-group">
                <label id="editTransQtyLabel">Quantity</label>
                <input type="number" id="editTransQty" class="form-control">
            </div>
            <div class="form-group">
                <label>Notes</label>
                <textarea id="editTransNotes" class="form-control" rows="2"></textarea>
            </div>
            <button class="btn btn-primary" onclick="saveTransactionEdit()" style="width:100%;">Update Transaction</button>
        </div>
    </div>

    <div id="addCustProvinceModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="custProvinceModalTitle">➕ Add Province</h3>
                <span class="close-modal" onclick="closeAddCustProvinceModal()">&times;</span>
            </div>
            <input type="hidden" id="editCustProvinceId">
            <div class="form-group">
                <label>Province Name</label>
                <input type="text" id="custProvinceName" class="form-control" placeholder="e.g., KPK">
            </div>
            <button class="btn btn-success" onclick="saveCustProvince()" style="width:100%;">Save Province</button>
        </div>
    </div>

    <div id="addCustDistrictModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="custDistrictModalTitle">➕ Add District</h3>
                <span class="close-modal" onclick="closeAddCustDistrictModal()">&times;</span>
            </div>
            <input type="hidden" id="editCustDistrictId">
            <div class="form-group">
                <label>Province</label>
                <select id="custDistrictProvinceSelect" class="form-control"></select>
            </div>
            <div class="form-group">
                <label>District Name</label>
                <input type="text" id="custDistrictName" class="form-control" placeholder="e.g., Mardan">
            </div>
            <button class="btn btn-success" onclick="saveCustDistrict()" style="width:100%;">Save District</button>
        </div>
    </div>

    <!-- Raw Materials Modals -->
    <div id="addRMMainCategoryModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="rmMainCategoryModalTitle">➕ Add Main Category</h3>
                <span class="close-modal" onclick="closeAddRMMainCategoryModal()">&times;</span>
            </div>
            <input type="hidden" id="editRMMainCategoryId">
            <div class="form-group">
                <label>Category Name</label>
                <input type="text" id="rmMainCategoryName" class="form-control">
            </div>
            <div class="form-group">
                <label>Category Code (Manual, e.g., RM-01)</label>
                <input type="text" id="rmMainCategoryCode" class="form-control" placeholder="RM-01">
            </div>
            <button class="btn btn-success" onclick="saveRMMainCategory()" style="width:100%;">Save Main Category</button>
        </div>
    </div>

    <div id="addRMSubCategoryModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="rmSubCategoryModalTitle">➕ Add RM Sub-Category</h3>
                <span class="close-modal" onclick="closeAddRMSubCategoryModal()">&times;</span>
            </div>
            <input type="hidden" id="editRMSubCategoryId">
            <div class="form-group">
                <label>Main Category</label>
                <select id="rmSubCategoryMainSelect" class="form-control" disabled></select>
            </div>
            <div class="form-group">
                <label>Sub-Category Name</label>
                <input type="text" id="rmSubCategoryName" class="form-control">
            </div>
            <div class="form-group">
                <label>Auto-Generated Code</label>
                <input type="text" id="rmSubCategoryCode" class="form-control" readonly placeholder="Auto-gen">
            </div>
            <button class="btn btn-success" onclick="saveRMSubCategory()" style="width:100%;">Save Sub-Category</button>
        </div>
    </div>

    <div id="addRMItemModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="rmItemModalTitle">➕ Add RM Item</h3>
                <span class="close-modal" onclick="closeAddRMItemModal()">&times;</span>
            </div>
            <input type="hidden" id="editRMItemId">
            <input type="hidden" id="rmItemSubId">
            <div class="form-group">
                <label>Item Name</label>
                <input type="text" id="rmItemName" class="form-control">
            </div>
            <div class="form-group">
                <label>Auto-Generated Code</label>
                <input type="text" id="rmItemCode" class="form-control" readonly placeholder="Auto-gen">
            </div>
            <div class="form-group">
                <label>Unit</label>
                <div class="input-group" style="display:flex; gap:0.5rem;">
                    <select id="rmItemUnit" class="form-control"></select>
                    <button class="btn btn-primary" onclick="showManageRMUnitsModal()">⚙️</button>
                </div>
            </div>
            <div class="form-group">
                <label>Opening Stock</label>
                <div class="input-group" style="display:flex; gap:0.5rem;">
                    <input type="number" id="rmItemStock" step="0.001" class="form-control" value="0" style="flex:2;">
                    <select id="rmItemStockUnit" class="form-control" style="flex:1;">
                        <option value="Bags" selected>Bags</option>
                        <option value="KG">KG</option>
                        <option value="Grams">Grams</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label>KG per Bag (Multiplier)</label>
                <input type="number" id="rmItemKgPerBag" step="0.001" class="form-control" value="0" placeholder="e.g., 25.000">
                <small style="color: var(--gray-500);">Set to 25 or 50 for bags, 0 for loose items.</small>
            </div>
            <div class="form-group">
                <label>Low Stock Threshold</label>
                <div class="input-group" style="display:flex; gap:0.5rem;">
                    <input type="number" id="rmItemThreshold" step="0.001" class="form-control" value="0" style="flex:2;">
                    <select id="rmItemThresholdUnit" class="form-control" style="flex:1;">
                        <option value="Bags" selected>Bags</option>
                        <option value="KG">KG</option>
                    </select>
                </div>
            </div>
            <button class="btn btn-success" onclick="saveRMItem()" style="width:100%;">Save RM Item</button>
        </div>
    </div>

    <!-- Manage Units Modal -->
    <div id="manageRMUnitsModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>⚙️ Manage RM Units</h3>
                <span class="close-modal" onclick="closeManageRMUnitsModal()">&times;</span>
            </div>
            <div class="form-group">
                <label>Add New Unit</label>
                <div class="input-group" style="display:flex; gap:0.5rem;">
                    <input type="text" id="newRMUnitName" class="form-control" placeholder="e.g., kg">
                    <button class="btn btn-success" onclick="saveRMUnit()">Add</button>
                </div>
            </div>
            <div style="max-height: 200px; overflow-y: auto; margin-top: 1rem;">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Unit Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="rmUnitsListTable"></tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- RM Formula Modal -->
    <div id="addRMFormulaModal" class="modal">
        <div class="modal-content" style="max-width: 600px;">
            <div class="modal-header">
                <h3 id="rmFormulaModalTitle">➕ Add Production Formula</h3>
                <span class="close-modal" onclick="closeAddRMFormulaModal()">&times;</span>
            </div>
            <input type="hidden" id="editRMFormulaId">
            <div class="form-group">
                <label>Formula Name (e.g. Master Flex Batch)</label>
                <input type="text" id="rmFormulaName" class="form-control" placeholder="Enter name...">
            </div>
            
            <div style="margin-top: 1.5rem;">
                <label style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 0.5rem;">
                    <strong>Composition (Select Materials)</strong>
                    <button class="btn btn-sm btn-outline" onclick="addRMFormulaItemRow()">+ Add Item</button>
                </label>
                <div id="rmFormulaItemsContainer" style="max-height: 300px; overflow-y: auto; padding: 0.5rem; border: 1px solid var(--gray-200); border-radius: 6px;">
                    <!-- Rows will be added dynamically here -->
                </div>
            </div>
            
            <button class="btn btn-success" onclick="saveRMFormula()" style="width:100%; margin-top: 1.5rem;">Save Formula</button>
        </div>
    </div>
    
    <!-- Global Report Viewer Modal -->
    <div id="reportViewerModal" class="modal" style="display:none; position: fixed; z-index: 1100; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6); backdrop-filter: blur(4px);">
        <div class="modal-content" style="background-color: #fefefe; margin: 2% auto; padding: 0; border: none; width: 90%; max-width: 1000px; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); position: relative; animation: slideDown 0.3s ease-out;">
            <div class="modal-header" style="background: var(--sky-600); color: white; padding: 1.5rem 2rem; border-radius: 16px 16px 0 0; display: flex; justify-content: space-between; align-items: center;">
                <h2 id="reportViewerTitle" style="margin: 0; font-size: 1.5rem;">Report Details</h2>
                <div style="display: flex; gap: 0.8rem; align-items: center;">
                    <button class="btn btn-print no-print" onclick="printArchivedReport()" style="background: white; color: var(--sky-600); border: none; font-weight: 600;">🖨️ Print</button>
                    <button class="btn no-print" onclick="exportArchivedToExcel()" style="background: #16a34a; color: white; border: none; font-weight: 600;">📥 Excel</button>
                    <button class="btn no-print" onclick="exportArchivedToPdf()" style="background: #ea580c; color: white; border: none; font-weight: 600;">📄 PDF</button>
                    <span class="close no-print" onclick="closeReportViewer()" style="color: white; font-size: 2rem; cursor: pointer; margin-left: 1rem;">&times;</span>
                </div>
            </div>
            <div class="modal-body" style="padding: 2rem; max-height: 70vh; overflow-y: auto;">
                <div id="archivedReportContent">
                    <!-- Historical report data injected here -->
                </div>
            </div>
        </div>
    </div>

    <style>
    @keyframes slideDown {
        from { transform: translateY(-30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    .report-action-btn {
        padding: 0.5rem 0.8rem;
        border-radius: 6px;
        border: 1px solid var(--gray-200);
        background: white;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }
    .report-action-btn:hover {
        background: var(--gray-50);
        border-color: var(--sky-400);
    }
        background: #fef2f2;
        border-color: #f87171;
        color: #ef4444;
    }
    </style>
    <!-- Store Hierarchy Modals -->
    <div id="stMainModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="stMainModalTitle">➕ Add Main Category</h3>
                <span class="close-modal" onclick="document.getElementById('stMainModal').style.display='none'">&times;</span>
            </div>
            <input type="hidden" id="editStMainId">
            <div class="form-group">
                <label>Category Name</label>
                <input type="text" id="stMainName" class="form-control" placeholder="e.g., Electrical">
            </div>
            <div class="form-group">
                <label>Category Code (Manual, e.g., A-01)</label>
                <input type="text" id="stMainCode" class="form-control" placeholder="A-01">
            </div>
            <button class="btn btn-success" onclick="saveStMain()" style="width:100%;">Save Main Category</button>
        </div>
    </div>

    <div id="stSubModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="stSubModalTitle">➕ Add Sub Category</h3>
                <span class="close-modal" onclick="document.getElementById('stSubModal').style.display='none'">&times;</span>
            </div>
            <input type="hidden" id="editStSubId">
            <input type="hidden" id="stSubMainId">
            <div class="form-group">
                <label>Parent Main Category</label>
                <div id="stSubParentName" style="padding: 0.5rem; background: var(--gray-100); border-radius: 4px; font-weight: bold;"></div>
            </div>
            <div class="form-group">
                <label>Sub Category Name (e.g., Size / Brand)</label>
                <input type="text" id="stSubName" class="form-control" placeholder="e.g., 2 Inch / Canon">
            </div>
            <div class="form-group">
                <label>Auto-Generated Code</label>
                <input type="text" id="stSubCode" class="form-control" readonly placeholder="Auto-gen">
            </div>
            <button class="btn btn-success" onclick="saveStSub()" style="width:100%;">Save Sub Category</button>
        </div>
    </div>

    <div id="stItemModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="stItemModalTitle">➕ Add Store Item</h3>
                <span class="close-modal" onclick="document.getElementById('stItemModal').style.display='none'">&times;</span>
            </div>
            <input type="hidden" id="editStItemId">
            <input type="hidden" id="stItemSubId">
            <div class="form-group">
                <label>Parent Sub Category</label>
                <div id="stItemParentName" style="padding: 0.5rem; background: var(--gray-100); border-radius: 4px; font-weight: bold;"></div>
            </div>
            <div class="form-group">
                <label>Item Name</label>
                <input type="text" id="stItemName" class="form-control" placeholder="e.g., PVC Pipe 20ft">
            </div>
            <div class="form-group">
                <label>Auto-Generated Code</label>
                <input type="text" id="stItemCode" class="form-control" readonly placeholder="Auto-gen">
            </div>
            <div class="form-group">
                <label>Opening Stock</label>
                <input type="number" id="stItemOpening" class="form-control" value="0">
            </div>
            <div class="form-group">
                <label>Low Stock Limit</label>
                <input type="number" id="stItemLimit" class="form-control" value="5">
            </div>
            <button class="btn btn-success" onclick="saveStItem()" style="width:100%;">Save Item</button>
        </div>
    </div>
()" style="width:100%;">Save Item</button>
        </div>
    </div>
