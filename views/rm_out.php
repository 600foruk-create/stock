<div class="rm-transactions">
    <h2 style="color: var(--error); margin-bottom: 2rem;">📤 Raw Material OUT (Consumption / Production)</h2>
    
    <div class="form-card" style="margin-bottom: 2rem; border-left: 4px solid var(--error); background: #fffdfd; box-shadow: var(--shadow-md);">
        <!-- Segmented Control Style Toggles -->
        <div style="margin-bottom: 2rem; display: flex; background: var(--gray-100); padding: 5px; border-radius: 12px; max-width: 500px; border: 1px solid var(--gray-200);">
            <label style="flex: 1;">
                <input type="radio" name="rmOutMode" value="SINGLE" checked onclick="toggleRMOutMode()" style="display: none;">
                <div class="mode-toggle-btn active" id="modeBtn_SINGLE" onclick="setRMOutMode('SINGLE')" style="text-align:center; padding: 12px; border-radius: 10px; cursor: pointer; font-weight: 700; transition: 0.3s; font-size: 1rem;">
                    📦 Single Item
                </div>
            </label>
            <label style="flex: 1;">
                <input type="radio" name="rmOutMode" value="FORMULA" onclick="toggleRMOutMode()" style="display: none;">
                <div class="mode-toggle-btn" id="modeBtn_FORMULA" onclick="setRMOutMode('FORMULA')" style="text-align:center; padding: 12px; border-radius: 10px; cursor: pointer; font-weight: 700; transition: 0.3s; font-size: 1rem;">
                    🧪 Use Formula
                </div>
            </label>
        </div>

        <div class="settings-grid" style="gap: 0.8rem;">
            <!-- Single Item Mode -->
            <div id="rmOutSingleGroup" class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; color: var(--gray-700); margin-bottom: 0.3rem; font-size: 0.9rem;">Select Raw Material</label>
                <select id="rmOutSelect" class="form-control" style="padding: 0.6rem 1rem; font-size: 1rem;"></select>
            </div>
            
            <!-- Formula Mode -->
            <div id="rmOutFormulaGroup" class="form-group" style="display: none; margin-bottom: 0;">
                <label style="font-weight: 700; color: var(--gray-700); margin-bottom: 0.3rem; font-size: 0.9rem;">Select Production Formula</label>
                <select id="rmOutFormulaSelect" class="form-control" onchange="previewFormulaUsage()" style="padding: 0.6rem 1rem; font-size: 1rem; border: 2px solid var(--sky-200);"></select>
                <div id="formulaPreview" style="margin-top: 0.5rem; padding: 0.6rem; background: var(--sky-50); border-radius: 6px; font-size: 0.85rem; color: var(--sky-800); border-left: 3px solid var(--sky-400);"></div>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
                <label id="rmOutQtyLabel" style="font-weight: 700; color: var(--gray-700); margin-bottom: 0.3rem; font-size: 0.9rem;">Quantity & Unit</label>
                <div style="display:flex; gap: 0.5rem;">
                    <input type="number" id="rmOutQty" class="form-control" style="padding: 0.6rem 1rem; font-size: 1rem; flex: 2;" placeholder="0.00" value="1">
                    <select id="rmOutUnitSelect" class="form-control" style="padding: 0.6rem 1rem; font-size: 1rem; flex: 1;"></select>
                </div>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; color: var(--gray-700); margin-bottom: 0.3rem; font-size: 0.9rem;">Reference / Notes</label>
                <input type="text" id="rmOutNotes" class="form-control" style="padding: 0.6rem 1rem; font-size: 1rem;" placeholder="Batch #, Order ID...">
            </div>
        </div>
        
        <div style="margin-top: 1.5rem;">
            <button class="btn btn-primary" style="background: var(--error); height: 45px; font-size: 1.1rem; font-weight: 800; border-radius: 8px; box-shadow: 0 4px 0 #b30000; padding: 0 2rem;" onclick="saveRMTransaction('OUT')">CONFIRM CONSUMPTION 📤</button>
        </div>
    </div>

    <div class="table-container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <h3 style="margin: 0; color: var(--gray-800);">Recent Consumption History</h3>
            <div style="display: flex; gap: 0.8rem;">
                <button class="btn" style="background: #27ae60; color: white; display: flex; align-items: center; gap: 5px;" onclick="exportRMOutToExcel()">
                    <span>📊 Export Excel</span>
                </button>
                <button class="btn btn-danger" style="display: flex; align-items: center; gap: 5px;" onclick="deleteAllRMOutHistory()">
                    <span>🗑️ Delete All</span>
                </button>
            </div>
        </div>
        <table class="data-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Material / Formula</th>
                    <th>Type</th>
                    <th>Qty / Multiplier</th>
                    <th>Notes</th>
                    <th style="width: 80px; text-align: center;">Action</th>
                </tr>
            </thead>
            <tbody id="rmOutTable"></tbody>
        </table>
    </div>
</div>

<style>
.mode-toggle-btn.active {
    background: white;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    color: var(--error);
}
.mode-toggle-btn:not(.active):hover {
    background: var(--gray-200);
}
</style>
