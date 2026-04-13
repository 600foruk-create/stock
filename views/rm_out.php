<div class="rm-transactions">
    <h2 style="color: var(--error); margin-bottom: 1.5rem;">📤 Raw Material OUT (Consumption / Production)</h2>
    
    <div class="form-card" style="margin-bottom: 2rem; border-left: 4px solid var(--error); background: #fff5f5;">
        <div style="margin-bottom: 1.5rem; display: flex; gap: 2rem; font-weight: 600;">
            <label style="cursor: pointer;"><input type="radio" name="rmOutMode" value="SINGLE" checked onclick="toggleRMOutMode()"> Single Item</label>
            <label style="cursor: pointer;"><input type="radio" name="rmOutMode" value="FORMULA" onclick="toggleRMOutMode()"> Use Production Formula</label>
        </div>

        <div class="settings-grid">
            <!-- Single Item Mode -->
            <div id="rmOutSingleGroup" class="form-group">
                <label>Select Raw Material</label>
                <select id="rmOutSelect" class="form-control"></select>
            </div>
            
            <!-- Formula Mode -->
            <div id="rmOutFormulaGroup" class="form-group" style="display: none;">
                <label>Select Formula</label>
                <select id="rmOutFormulaSelect" class="form-control" onchange="previewFormulaUsage()"></select>
                <div id="formulaPreview" style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--gray-600);"></div>
            </div>

            <div class="form-group">
                <label id="rmOutQtyLabel">Quantity (Kg/Bags/etc.)</label>
                <input type="number" id="rmOutQty" class="form-control" placeholder="0.00" value="1">
            </div>

            <div class="form-group">
                <label>Reference / Notes</label>
                <input type="text" id="rmOutNotes" class="form-control" placeholder="Consumption Batch #, Order ID, etc.">
            </div>
        </div>
        
        <div style="margin-top: 1rem;">
            <button class="btn btn-primary" style="background: var(--error); width: 200px;" onclick="saveRMTransaction('OUT')">Confirm RM OUT</button>
        </div>
    </div>

    <div class="table-container">
        <h3>Recent Consumption History</h3>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Material / Formula</th>
                    <th>Type</th>
                    <th>Quantity/Multiplier</th>
                    <th>Notes</th>
                </tr>
            </thead>
            <tbody id="rmOutTable"></tbody>
        </table>
    </div>
</div>
