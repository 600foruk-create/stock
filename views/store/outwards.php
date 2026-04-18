<div class="store-outwards">
    <div class="card" style="background: white; padding: 2rem; border-radius: 12px; border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm);">
        <h2 style="color: var(--sky-600); margin-bottom: 2rem; font-size: 1.8rem; font-weight: 700; display: flex; align-items: center; gap: 0.8rem;">
            <i class="fas fa-file-export"></i> Store Outward / Issue Item
        </h2>
        
        <div class="row" style="background: #fff5f5; padding: 2rem; border-radius: 16px; border: 1px solid #fed7d7;">
            <div class="col-md-5">
                <div class="form-group">
                    <label style="font-weight: 700; color: #9b2c2c;">📦 Select Item</label>
                    <select id="storeOutwardItemSelect" class="form-control select2" style="width: 100%;">
                        <!-- Populated by JS -->
                    </select>
                </div>
            </div>
            <div class="col-md-2">
                <div class="form-group">
                    <label style="font-weight: 700; color: #9b2c2c;">🔢 Quantity</label>
                    <input type="number" id="storeOutwardQty" class="form-control" min="1" step="0.01">
                </div>
            </div>
            <div class="col-md-5">
                <div class="form-group">
                    <label style="font-weight: 700; color: #9b2c2c;">👤 Issued To</label>
                    <input type="text" id="storeIssuedTo" class="form-control" placeholder="Person or Department">
                </div>
            </div>
            <div class="col-md-12">
                <div class="form-group">
                    <label style="font-weight: 700; color: #9b2c2c;">📝 Reason / Purpose</label>
                    <textarea id="storeIssueReason" class="form-control" placeholder="Why is this item being issued?" rows="2"></textarea>
                </div>
            </div>
            <div class="col-12" style="margin-top: 1rem;">
                <button class="btn btn-danger btn-lg" onclick="saveStoreOutward()" style="padding: 0.8rem 2.5rem; font-weight: 700; border-radius: 12px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.2);">
                    📤 Issue Item Now
                </button>
            </div>
        </div>
    </div>
</div>
