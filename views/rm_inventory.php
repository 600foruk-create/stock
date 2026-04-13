<div class="rm-inventory">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
        <h2 style="color:var(--sky-600);">📋 Raw Materials Inventory</h2>
        <button class="btn btn-primary" onclick="showAddRMModal()">+ Add Raw Material</button>
    </div>
    <div class="table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th>RM Name</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Unit</th>
                    <th>Threshold</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="rmInventoryTable">
                <!-- Data populated via JS -->
            </tbody>
        </table>
    </div>
</div>
