<div class="store-inventory">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2 style="color: var(--sky-600); margin: 0;">📋 Store Inventory</h2>
        <button class="add-btn" onclick="showAddStoreMain()">+ Add Main Category</button>
    </div>

    <div id="storeInventoryList">
        <div style="text-align:center; padding:2rem; color:var(--gray-500);">
            <div class="loader-spinner" style="margin: 0 auto 1rem;"></div>
            Loading Store Inventory...
        </div>
    </div>
</div>

<!-- Main Category Modal -->
<div id="storeMainModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="storeMainModalTitle">➕ Add Main Category</h2>
            <button class="close-btn" onclick="closeStoreMainModal()">&times;</button>
        </div>
        <div class="modal-body">
            <input type="hidden" id="editStoreMainId">
            <div class="form-group">
                <label>Category Name</label>
                <input type="text" id="storeMainName" placeholder="e.g. Mechanical Spare">
            </div>
            <div class="form-group">
                <label>Category Code</label>
                <input type="text" id="storeMainCode" placeholder="e.g. S-01">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-print" onclick="closeStoreMainModal()">Cancel</button>
            <button class="btn btn-primary" onclick="saveStoreMain()">Save Category</button>
        </div>
    </div>
</div>

<!-- Sub Category Modal -->
<div id="storeSubModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="storeSubModalTitle">➕ Add Sub Category</h2>
            <button class="close-btn" onclick="closeStoreSubModal()">&times;</button>
        </div>
        <div class="modal-body">
            <input type="hidden" id="editStoreSubId">
            <input type="hidden" id="storeSubMainId">
            <div class="form-group">
                <label>Sub Category Name</label>
                <input type="text" id="storeSubName" placeholder="e.g. Bearings">
            </div>
            <div class="form-group">
                <label>Sub Category Code (Auto)</label>
                <input type="text" id="storeSubCode" readonly style="background: var(--gray-100); cursor: not-allowed;">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-print" onclick="closeStoreSubModal()">Cancel</button>
            <button class="btn btn-primary" onclick="saveStoreSub()">Save Sub Category</button>
        </div>
    </div>
</div>

<!-- Store Item Modal -->
<div id="storeItemModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2 id="storeItemModalTitle">➕ Add Store Item</h2>
            <button class="close-btn" onclick="closeStoreItemModal()">&times;</button>
        </div>
        <div class="modal-body">
            <input type="hidden" id="editStoreItemId">
            <input type="hidden" id="storeItemSubId">
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label>Item Name</label>
                    <input type="text" id="storeItemName" placeholder="e.g. 6205 Bearing">
                </div>
                <div class="form-group">
                    <label>Item Code (Auto)</label>
                    <input type="text" id="storeItemCode" readonly style="background: var(--gray-100);">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="form-group">
                    <label>Opening Stock</label>
                    <input type="number" id="storeItemOpeningStock" value="0">
                </div>
                <div class="form-group">
                    <label>Low Stock Limit</label>
                    <input type="number" id="storeItemLowStock" value="10">
                </div>
            </div>

            <div class="form-group">
                <label>Notes</label>
                <textarea id="storeItemNotes" rows="3" placeholder="Additional details..."></textarea>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-print" onclick="closeStoreItemModal()">Cancel</button>
            <button class="btn btn-primary" onclick="saveStoreItem()">Save Item</button>
        </div>
    </div>
</div>
