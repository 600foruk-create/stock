<div class="rm-transactions">
    <h2 style="color: var(--error); margin-bottom: 1.5rem;">📤 Raw Material OUT (Consumption/Returns)</h2>
    <div class="form-card" style="margin-bottom: 2rem; border-left: 4px solid var(--error);">
        <div class="settings-grid">
            <div class="form-group">
                <label>Select Raw Material</label>
                <select id="rmOutSelect" class="form-control"></select>
            </div>
            <div class="form-group">
                <label>Quantity</label>
                <input type="number" id="rmOutQty" class="form-control" placeholder="0.00">
            </div>
            <div class="form-group">
                <label>Notes</label>
                <input type="text" id="rmOutNotes" class="form-control" placeholder="Consumption, damage, etc.">
            </div>
        </div>
        <button class="btn btn-primary" style="background: var(--error);" onclick="saveRMTransaction('OUT')">Save RM OUT</button>
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
            <tbody id="rmOutTable"></tbody>
        </table>
    </div>
</div>
