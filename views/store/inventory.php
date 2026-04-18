<div class="store-inventory">
    <div class="card" style="background: white; padding: 2rem; border-radius: 12px; border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm);">
        <h2 style="color: var(--sky-600); margin-bottom: 1.5rem; font-size: 1.8rem; font-weight: 700;">🗂️ Store Inventory Structure</h2>
        
        <!-- Add Category Form -->
        <div class="form-grid" style="display: flex; flex-wrap: wrap; gap: 1.2rem; align-items: flex-end; margin-bottom: 2rem; background: var(--gray-50); padding: 1.5rem; border-radius: 12px; border: 1px solid var(--gray-200);">
            <div class="form-group" style="margin-bottom: 0; min-width: 250px;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 700; color: var(--gray-700);">Category Name</label>
                <input type="text" id="storeCatName" class="form-control" placeholder="e.g., General Store">
            </div>
            <div class="form-group" style="margin-bottom: 0; min-width: 200px;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 700; color: var(--gray-700);">Category Code (Manual)</label>
                <input type="text" id="storeCatCodeManual" class="form-control" placeholder="e.g., ST01">
            </div>
            <button class="btn btn-primary" onclick="addStoreCategory()" style="height: 42px; padding: 0 1.5rem;">➕ Add Category</button>
        </div>

        <div id="storeCategoriesContainer">
            <div style="text-align: center; padding: 3rem; color: var(--gray-400);">
                <i class="fas fa-spinner fa-spin fa-2x"></i>
                <p style="margin-top: 1rem;">Loading inventory structure...</p>
            </div>
        </div>
    </div>
</div>

