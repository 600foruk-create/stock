<div class="rm-transactions">
    <h2 style="color: var(--sky-600); margin-bottom: 1.5rem;">📥 Raw Material IN (Purchases/Stock)</h2>
    <div class="form-card" style="margin-bottom: 2rem;">
        <div class="settings-grid">
            <div class="form-group">
                <label>Select Raw Material</label>
                <select id="rmInSelect" class="form-control"></select>
            </div>
            <div class="form-group">
                <label>Quantity</label>
                <input type="number" id="rmInQty" class="form-control" placeholder="0.00">
            </div>
            <div class="form-group">
                <label>Notes</label>
                <input type="text" id="rmInNotes" class="form-control" placeholder="Reference, Supplier, etc.">
            </div>
        </div>
        <button class="btn btn-primary" onclick="saveRMTransaction('IN')">Save RM IN</button>
    </div>
    <div class="table-container">
        <h3>History</h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Material</th>
                    <th>Quantity</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody id="rmInTable"></tbody>
        </table>
    </div>
</div>
