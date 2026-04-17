<?php // views/store/inventory.php ?>
<div id="store_inventory" class="tab-content">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <h2 style="color: var(--blue-600); margin: 0;">📋 Store Inventory</h2>
        <div class="action-buttons" style="margin: 0;">
            <button class="btn btn-primary" onclick="showAddStMainModal()">➕ Add Main Category</button>
        </div>
    </div>
    
    <div id="storeInventoryContainer" class="inventory-container">
        <!-- Dynamically populated by refreshStoreInventory() -->
    </div>
</div>
