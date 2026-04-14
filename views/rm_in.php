<div class="rm-transactions">

    
    <div class="form-card" style="margin-bottom: 2rem; background: transparent; box-shadow: none; border: none; padding: 0;">
        <div class="settings-grid" style="gap: 0.8rem;">
            <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; color: var(--gray-700); margin-bottom: 0.3rem; font-size: 0.9rem;">Select Raw Material</label>
                <select id="rmInSelect" class="form-control" style="padding: 0.6rem 1rem; font-size: 1rem;"></select>
            </div>
            
            <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; color: var(--gray-700); margin-bottom: 0.3rem; font-size: 0.9rem;">Quantity Received</label>
                <div class="input-group" style="display:flex; gap:0.5rem; align-items:center;">
                    <input type="number" id="rmInQty" class="form-control" style="padding: 0.6rem 1rem; font-size: 1rem; flex:2;" placeholder="0.00" oninput="updateRMConversionHint('IN')">
                    <select id="rmInUnitSelect" class="form-control" style="flex:1; padding: 0.6rem; font-size: 0.9rem;" onchange="updateRMConversionHint('IN')">
                        <option value="KG">KG</option>
                        <option value="Bags">Bags</option>
                        <option value="Grams">Grams</option>
                    </select>
                </div>
                <small id="rmInConversionHint" style="color:var(--sky-600); font-weight:600; margin-top:0.2rem; display:block; height:1rem;"></small>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; color: var(--gray-700); margin-bottom: 0.3rem; font-size: 0.9rem;">Reference / Supplier Notes</label>
                <input type="text" id="rmInNotes" class="form-control" style="padding: 0.6rem 1rem; font-size: 1rem;" placeholder="Supplier Name, Invoice #, etc.">
            </div>
        </div>
        
        <div style="margin-top: 2rem; padding-bottom: 10px;">
            <button class="btn btn-primary" style="background: var(--sky-600); color: white !important; display: inline-block; width: auto; padding: 0.6rem 2.5rem; font-size: 1rem; font-weight: 700; border-radius: 8px; box-shadow: 0 4px 0 var(--sky-800); cursor: pointer; transition: 0.2s;" onclick="saveRMTransaction('IN')">Save</button>
        </div>
    </div>

    <div class="table-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3 style="margin: 0; color: var(--gray-800);">Recent Purchase History</h3>
            <div style="display: flex; gap: 0.8rem;">
                <button class="btn" style="background: #27ae60; color: white; display: flex; align-items: center; gap: 5px;" onclick="exportRMInToExcel()">
                    <span>📊 Export Excel</span>
                </button>
                <button class="btn btn-danger" style="display: flex; align-items: center; gap: 5px;" onclick="deleteAllRMInHistory()">
                    <span>🗑️ Delete All</span>
                </button>
            </div>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Material</th>
                    <th>Type</th>
                    <th>Quantity Received</th>
                    <th>Notes</th>
                    <th style="width: 80px; text-align: center;">Action</th>
                </tr>
            </thead>
            <tbody id="rmInTable"></tbody>
        </table>
    </div>
</div>
