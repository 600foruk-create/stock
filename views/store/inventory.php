<div class="store-inventory-container" style="padding: 1rem;">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 2rem;">
        <h2 style="color: var(--sky-600); margin:0;">📋 Store Inventory Hierarchy</h2>
        <button class="btn btn-primary" onclick="showAddStoreMain()">+ Add Main Brand</button>
    </div>

    <div id="storeInventoryList" class="inventory-tree">
        <!-- Tree content will be injected by refreshStoreInventory() in main.js -->
        <div style="text-align:center; padding:3rem; color:var(--gray-400);">
            <div class="spinner"></div>
            <p>Loading Store Inventory...</p>
        </div>
    </div>
</div>

<style>
/* Store Specific Tree Styles */
.inventory-tree {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.main-category {
    background: var(--gray-50);
    border: 1px solid var(--gray-200);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-category.expanded {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.category-header {
    background: white;
    padding: 1.25rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border-bottom: 1px solid transparent;
}

.main-category.expanded .category-header {
    border-bottom-color: var(--gray-200);
}

.category-title {
    display: flex;
    align-items: center;
    gap: 1.25rem;
}

.category-name {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--gray-800);
}

.category-stats {
    font-size: 0.85rem;
    color: var(--gray-500);
    background: var(--gray-100);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
}

.category-actions, .sub-actions, .item-actions {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.sub-category-container {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    display: none; /* Hidden by default */
}

.main-category.expanded .sub-category-container {
    display: flex;
}

.sub-category {
    background: white;
    border: 1px solid var(--gray-200);
    border-radius: 8px;
    overflow: hidden;
}

.sub-header {
    padding: 1rem 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    background: var(--sky-50);
}

.sub-name {
    font-weight: 600;
    color: var(--sky-900);
}

.sub-stats {
    font-size: 0.8rem;
    color: var(--sky-600);
}

.items-container {
    padding: 1rem;
    background: var(--gray-50);
    display: none;
}

.sub-category.expanded .items-container {
    display: block;
}

/* Action Buttons */
.btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.1rem;
    padding: 0.4rem;
    border-radius: 6px;
    transition: background 0.2s;
}

.btn-icon:hover {
    background: var(--gray-100);
}

.btn-icon-sm {
    font-size: 0.9rem;
    padding: 0.25rem;
}

.add-btn {
    background: var(--sky-600);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
}

.add-btn:hover {
    opacity: 0.9;
}

.add-btn-sm {
    padding: 0.3rem 0.75rem;
    font-size: 0.75rem;
}

.item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: transform 0.2s;
}

.item-row:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.item-name-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
}
</style>
