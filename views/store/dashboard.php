<div class="store-dashboard">
    <h2 style="color: var(--sky-600); margin-bottom: 2rem; font-size: 2rem; font-weight: 800;">📈 Store Dashboard</h2>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
        <div style="background: var(--blue-50); border: 2px solid var(--blue-100); border-radius: 24px; padding: 1.5rem; text-align: center; box-shadow: var(--shadow-sm);">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🏷️</div>
            <h3 style="color: var(--blue-700); font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">Categories</h3>
            <p id="storeDashCatCount" style="font-size: 2.2rem; font-weight: 900; color: var(--blue-900); margin: 0;">0</p>
        </div>
        
        <div style="background: var(--green-50); border: 2px solid var(--green-100); border-radius: 24px; padding: 1.5rem; text-align: center; box-shadow: var(--shadow-sm);">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📦</div>
            <h3 style="color: var(--green-700); font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">Total Items</h3>
            <p id="storeDashItemCount" style="font-size: 2.2rem; font-weight: 900; color: var(--green-900); margin: 0;">0</p>
        </div>
        
        <div style="background: var(--orange-50); border: 2px solid var(--orange-100); border-radius: 24px; padding: 1.5rem; text-align: center; box-shadow: var(--shadow-sm);">
            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⚠️</div>
            <h3 style="color: var(--orange-700); font-size: 1rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.5rem;">Low Stock</h3>
            <p id="storeDashLowStock" style="font-size: 2.2rem; font-weight: 900; color: var(--orange-900); margin: 0;">0</p>
        </div>
    </div>

    <div class="card" style="background: white; border-radius: 20px; border: 1px solid var(--gray-200); padding: 2rem; box-shadow: var(--shadow-sm);">
        <h3 style="color: var(--gray-700); font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.8rem;">
            <i class="fas fa-history" style="color: var(--sky-500);"></i> Recent Activity
        </h3>
        <div id="storeRecentActivityLog" style="background: var(--gray-50); border-radius: 12px; padding: 1.5rem; min-height: 150px; border: 1px solid var(--gray-100);">
            <p style="text-align: center; color: var(--gray-400); margin-top: 2rem;">No recent records found.</p>
        </div>
    </div>
</div>
