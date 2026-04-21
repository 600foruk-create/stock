<div class="store-inwards">
    <div class="card" style="background: white; padding: 2rem; border-radius: 12px; border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm);">
        <h2 style="color: var(--sky-600); margin-bottom: 2rem; font-size: 1.8rem; font-weight: 700; display: flex; align-items: center; gap: 0.8rem;">
            <i class="fas fa-file-import"></i> Store Inward Entry
        </h2>
        
        <div class="row" style="background: var(--gray-50); padding: 2rem; border-radius: 16px; border: 1px solid var(--gray-200);">
            <div class="col-md-4">
                <div class="form-group">
                    <label style="font-weight: 700; color: var(--gray-700);">📦 Select Item</label>
                    <select id="storeInwardItemSelect" class="form-control select2" style="width: 100%;">
                        <!-- Populated by JS -->
                    </select>
                </div>
            </div>
            <div class="col-md-3">
                <div class="form-group">
                    <label style="font-weight: 700; color: var(--gray-700);">🔢 Quantity</label>
                    <input type="number" id="storeInwardQty" class="form-control" value="1" min="1" step="0.01">
                </div>
            </div>
            <div class="col-md-5">
                <div class="form-group">
                    <label style="font-weight: 700; color: var(--gray-700);">🏭 Supplier / Source</label>
                    <input type="text" id="storeInwardSource" class="form-control" placeholder="Vendor name or Department">
                </div>
            </div>
            <div class="col-md-12" style="margin-top: 1rem;">
                <div class="form-group">
                    <label style="font-weight: 700; color: var(--gray-700);">📝 Remarks / Notes</label>
                    <textarea id="storeInwardNotes" class="form-control" rows="2" placeholder="Any additional details..."></textarea>
                </div>
            </div>
            <div class="col-12" style="margin-top: 1.5rem;">
                <button class="btn btn-primary btn-lg" onclick="saveStoreInward()" style="padding: 0.8rem 2.5rem; font-weight: 700; border-radius: 12px; box-shadow: 0 4px 12px rgba(12, 166, 242, 0.3);">
                    ✅ Record Inward Stock
                </button>
            </div>
        </div>
    </div>
</div>
