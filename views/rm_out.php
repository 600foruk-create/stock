<div class="rm-transactions">

    
    <div class="form-card" style="margin-bottom: 2rem; background: transparent; box-shadow: none; border: none; padding: 0;">
        <!-- Segmented Control Style Toggles -->
        <div style="margin-bottom: 2rem; display: flex; background: var(--gray-100); padding: 5px; border-radius: 12px; max-width: 500px; border: 1px solid var(--gray-200);">
            <label style="flex: 1;">
                <input type="radio" name="rmOutMode" value="SINGLE" checked onclick="toggleRMOutMode()" style="display: none;">
                <div class="mode-toggle-btn active" id="modeBtn_SINGLE" onclick="setRMOutMode('SINGLE')" style="text-align:center; padding: 12px; border-radius: 10px; cursor: pointer; font-weight: 700; transition: 0.3s; font-size: 1rem;">
                    Single Item
                </div>
            </label>
            <label style="flex: 1;">
                <input type="radio" name="rmOutMode" value="FORMULA" onclick="toggleRMOutMode()" style="display: none;">
                <div class="mode-toggle-btn" id="modeBtn_FORMULA" onclick="setRMOutMode('FORMULA')" style="text-align:center; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: 700; transition: 0.3s; font-size: 0.95rem;">
                    Use Formula
                </div>
            </label>
        </div>

        <div class="settings-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; align-items: flex-end; background: #f8fafc; padding: 1.5rem; border-radius: 12px; border: 1px solid #e2e8f0;">
            <!-- Single Item Mode -->
            <div id="rmOutSingleGroup" class="form-group" style="margin-bottom: 0;">
                <label style="font-weight: 700; color: var(--gray-700); margin-bottom: 0.5rem; font-size: 0.9rem; display: block;">Select Raw Material</label>
                <select id="rmOutSelect" class="form-control" style="height: 48px; padding: 0.6rem 1rem; font-size: 1rem; border-radius: 8px; border: 2px solid #cbd5e1; width: 100%; background: white;"></select>
            </div>
            
            <!-- Formula Mode -->
            <div id="rmOutFormulaGroup" class="form-group" style="display: none; margin-bottom: 0;">
                <label style="font-weight: 700; color: var(--gray-700); margin-bottom: 0.5rem; font-size: 0.9rem; display: block;">Select Production Formula</label>
                <select id="rmOutFormulaSelect" class="form-control" onchange="previewFormulaUsage()" style="height: 48px; padding: 0.6rem 1rem; font-size: 1rem; border-radius: 8px; border: 2px solid var(--sky-500); width: 100%; background: white;"></select>
            </div>

            <div class="form-group" style="margin-bottom: 0;">
                <label id="rmOutQtyLabel" style="font-weight: 700; color: var(--gray-700); margin-bottom: 0.5rem; font-size: 0.9rem; display: block;">Quantity</label>
                <div class="input-group" style="display:flex; align-items:stretch; height: 48px; border: 2px solid #cbd5e1; border-radius: 8px; overflow: hidden; background: white;">
                    <input type="number" id="rmOutQty" class="form-control" style="border: none; padding: 0.6rem 1rem; font-size: 1rem; flex:1; height: 100%; border-right: 1px solid #e2e8f0;" placeholder="1" value="1" oninput="updateRMConversionHint('OUT')">
                    <select id="rmOutUnitSelect" class="form-control" style="border: none; width: 100px; padding: 0 0.5rem; font-size: 0.9rem; height: 100%; background: #f1f5f9; cursor: pointer; color: var(--gray-700); font-weight: 600;" onchange="updateRMConversionHint('OUT')">
                        <option value="Bags" selected>Bags</option>
                        <option value="KG">KG</option>
                        <option value="Grams">Grams</option>
                        <option value="Multiplier" style="display:none;">Batches</option>
                    </select>
                </div>
                <!-- Fixed Height Hint -->
                <div style="height: 1.2rem; margin-top: 0.3rem;">
                    <small id="rmOutConversionHint" style="color:var(--sky-600); font-weight:700; font-size: 0.85rem; display:block;"></small>
                </div>
            </div>
        </div>

        <div class="form-group" style="margin-top: 1rem;">
            <label style="font-weight: 700; color: var(--gray-700); margin-bottom: 0.3rem; font-size: 0.9rem;">Reference / Notes</label>
            <input type="text" id="rmOutNotes" class="form-control" style="padding: 0.6rem 1rem; font-size: 1rem; height: 48px; border-radius: 8px; border: 2px solid #cbd5e1; background: white;" placeholder="Batch #, Order ID...">
        </div>

        <div id="formulaPreview" style="display: none; margin-top: 1rem; padding: 0.8rem; background: var(--sky-50); border-radius: 8px; font-size: 0.85rem; color: var(--sky-800); border-left: 4px solid var(--sky-400); border: 1.5px solid var(--sky-200);"></div>

        <!-- NEW: Formula Editor moved OUTSIDE the grid to prevent layout shifts -->
        <div id="rmFormulaIngredientsEditor" style="display: none; margin-top: 1.5rem; padding: 1.2rem; background: #fffbff; border: 1px dashed var(--error); border-radius: 12px; box-shadow: var(--shadow-sm);">
            <h4 style="font-size: 0.85rem; color: var(--error); margin-bottom: 0.8rem; text-transform: uppercase; font-weight: 800; letter-spacing: 0.5px; border-bottom: 2px solid var(--error); display: inline-block; padding-bottom: 2px;">Edit Quantities for this Batch:</h4>
            <div id="rmFormulaIngredientsList" style="display: flex; flex-direction: column; gap: 0.8rem;"></div>
        </div>
        
        <div style="margin-top: 2rem; padding-bottom: 10px;">
            <button class="btn btn-primary" style="background: var(--sky-600); color: white !important; display: inline-block; width: auto; padding: 0.7rem 3rem; font-size: 1.1rem; font-weight: 700; border-radius: 8px; box-shadow: 0 4px 0 var(--sky-800); border: none; cursor: pointer; transition: 0.2s;" onclick="saveRMTransaction('OUT')">Save</button>
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
    background: var(--sky-600);
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    color: white;
}
.mode-toggle-btn:not(.active):hover {
    background: var(--gray-300);
}
.mode-toggle-btn:not(.active) {
    color: var(--gray-700);
}
</style>
