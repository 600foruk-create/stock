<div class="store-outwards" style="padding: 1rem;">
    <!-- OUTWARD FORM -->
    <div class="row" style="background: white; padding: 2.5rem; border-radius: 20px; border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm); margin-bottom: 2rem; display: flex; flex-wrap: wrap;">
        <div class="col-6" style="margin-bottom: 1.5rem;">
            <div class="form-group">
                <label style="font-weight: 700; color: #9b2c2c; font-size: 0.9rem;">Select Item</label>
                <select id="storeOutwardItemSelect" class="form-control select2" style="width: 100%;">
                    <!-- Populated by JS -->
                </select>
            </div>
        </div>
        <div class="col-6" style="margin-bottom: 1.5rem;">
            <div class="form-group">
                <label style="font-weight: 700; color: #9b2c2c; font-size: 0.9rem;">Quantity</label>
                <input type="number" id="storeOutwardQty" class="form-control" min="1" step="0.01">
            </div>
        </div>
        <div class="col-6" style="margin-bottom: 1.5rem;">
            <div class="form-group">
                <label style="font-weight: 700; color: #9b2c2c; font-size: 0.9rem;">Issued To (Person/Dept)</label>
                <input type="text" id="storeIssuedTo" class="form-control" list="listIssuedTo" placeholder="Select or type new...">
                <datalist id="listIssuedTo">
                    <option value="Factory Floor">
                    <option value="Warehouse A">
                    <option value="Maintenance Dept">
                    <option value="Main Office">
                </datalist>
            </div>
        </div>
        <div class="col-6" style="margin-bottom: 1.5rem;">
            <div class="form-group">
                <label style="font-weight: 700; color: #9b2c2c; font-size: 0.9rem;">Issued By (Staff)</label>
                <input type="text" id="storeIssuedBy" class="form-control" list="listIssuedBy" placeholder="Select or type new...">
                <datalist id="listIssuedBy">
                    <option value="Admin">
                    <option value="Store Manager">
                    <option value="Shift Supervisor">
                </datalist>
            </div>
        </div>
        <div class="col-6" style="margin-bottom: 1.5rem;">
            <div class="form-group">
                <label style="font-weight: 700; color: #9b2c2c; font-size: 0.9rem;">Purpose / Reason</label>
                <input type="text" id="storePurpose" class="form-control" list="listPurpose" placeholder="Select or type new...">
                <datalist id="listPurpose">
                    <option value="Production">
                    <option value="Repair & Maintenance">
                    <option value="Sampling">
                    <option value="Gift">
                    <option value="Internal Use">
                </datalist>
            </div>
        </div>
        <div class="col-6" style="margin-bottom: 1.5rem;">
            <div class="form-group">
                <label style="font-weight: 700; color: #9b2c2c; font-size: 0.9rem;">Remarks / Notes</label>
                <input type="text" id="storeIssueNotes" class="form-control" placeholder="Any details..." style="height: 38px; border-radius: 8px;">
            </div>
        </div>
        
        <div class="col-12" style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 2rem;">
            <button class="btn btn-outline-secondary" onclick="manageStoreListsModal()" style="border-radius: 10px; font-weight: 700; background: #f8fafc; color: #475569; border-color: #e2e8f0; padding: 10px 20px;">
                <i class="fas fa-cog"></i> Manage Selection Lists
            </button>
            <button class="btn btn-danger btn-lg" onclick="saveStoreOutward()" style="padding: 0.8rem 4rem; font-weight: 800; border-radius: 12px; box-shadow: 0 4px 20px rgba(220, 38, 38, 0.3); letter-spacing: 0.5px;">
                Record Outward Record
            </button>
        </div>
    </div>

    <!-- HISTORY SECTION -->
    <div class="card" style="background: white; padding: 2rem; border-radius: 20px; border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px;">
            <h3 style="color: var(--gray-800); margin: 0; font-weight: 800; display: flex; align-items: center; gap: 0.8rem;">
                <i class="fas fa-history" style="color: var(--red-500);"></i> Outward Records History
            </h3>
            <div style="display: flex; gap: 1rem; align-items: center;">
                <select id="outwardHistMonth" class="form-control" style="width: 140px; border-radius: 8px; font-weight: 600;">
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
                <select id="outwardHistYear" class="form-control" style="width: 100px; border-radius: 8px; font-weight: 600;">
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                </select>
                <button class="btn btn-danger" onclick="refreshStoreOutwardHistory()" style="border-radius: 8px; padding: 6px 15px; font-weight: 700;">Search</button>
                <button class="btn btn-outline-secondary" onclick="printStoreHistory('OUTWARD')" style="border-radius: 8px; padding: 6px 15px; font-weight: 700;">
                    <i class="fas fa-print"></i> Print
                </button>
            </div>
        </div>

        <div id="storeOutwardHistoryTableContainer" style="overflow-x: auto;">
            <table class="table" style="width: 100%; border-collapse: separate; border-spacing: 0 10px;">
                <thead style="background: #fff5f5;">
                    <tr style="color: #9b2c2c; font-weight: 700; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 1px;">
                        <th style="padding: 15px; border-radius: 10px 0 0 10px;">Date & Time</th>
                        <th style="padding: 15px;">Item Code</th>
                        <th style="padding: 15px;">Item Name</th>
                        <th style="padding: 15px; text-align: center;">Qty</th>
                        <th style="padding: 15px;">Issued To / By</th>
                        <th style="padding: 15px; text-align: right; border-radius: 0 10px 10px 0;">Actions</th>
                    </tr>
                </thead>
                <tbody id="storeOutwardHistoryBody">
                    <!-- History records here -->
                </tbody>
            </table>
        </div>
    </div>
</div>
