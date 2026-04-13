<div class="rm-transactions">
    <h2 style="color: var(--sky-600); margin-bottom: 2rem;">📥 Raw Material IN (Purchases / Stock)</h2>
    
    <div class="form-card" style="margin-bottom: 2rem; border-left: 4px solid var(--sky-500); background: #f0f7ff; box-shadow: var(--shadow-md);">
        <div class="settings-grid" style="gap: 0.8rem;">
            <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; color: var(--gray-700); margin-bottom: 0.3rem; font-size: 0.9rem;">Select Raw Material</label>
                <select id="rmInSelect" class="form-control" style="padding: 0.6rem 1rem; font-size: 1rem;"></select>
            </div>
            
            <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; color: var(--gray-700); margin-bottom: 0.3rem; font-size: 0.9rem;">Quantity & Unit</label>
                <div style="display:flex; gap: 0.5rem;">
                    <input type="number" id="rmInQty" class="form-control" style="padding: 0.6rem 1rem; font-size: 1rem; flex: 2;" placeholder="0.00">
                    <select id="rmInUnitSelect" class="form-control" style="padding: 0.6rem 1rem; font-size: 1rem; flex: 1;"></select>
                </div>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; color: var(--gray-700); margin-bottom: 0.3rem; font-size: 0.9rem;">Reference / Supplier Notes</label>
                <input type="text" id="rmInNotes" class="form-control" style="padding: 0.6rem 1rem; font-size: 1rem;" placeholder="Supplier Name, Invoice #, etc.">
            </div>
        </div>
        
        <div style="margin-top: 1.5rem;">
            <button class="btn btn-primary" style="background: var(--sky-600); height: 45px; font-size: 1.1rem; font-weight: 800; border-radius: 8px; box-shadow: 0 4px 0 var(--sky-800); padding: 0 2rem;" onclick="saveRMTransaction('IN')">CONFIRM STOCK RECEIPT 📥</button>
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
