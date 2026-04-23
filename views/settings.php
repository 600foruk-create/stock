<div class="settings-container" style="display: flex; gap: 2rem; height: 100%; min-height: 600px;">
    <!-- Settings Sidebar -->
    <div class="settings-nav" style="width: 220px; flex-shrink: 0; background: var(--gray-50); border-radius: 20px; padding: 1.5rem; border: 1px solid var(--gray-200);">
        <h3 style="font-size: 0.8rem; color: var(--gray-400); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 1.5rem; font-weight: 800;">System Settings</h3>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <button class="settings-tab active" onclick="switchSettingsTab('companyTab', this)">Company Profile</button>
            <button class="settings-tab" onclick="switchSettingsTab('systemTab', this)">System Preferences</button>
            <button class="settings-tab" onclick="switchSettingsTab('usersTab', this)">User Management</button>
            <button class="settings-tab" onclick="switchSettingsTab('dataTab', this)">Database & Backup</button>
        </div>
    </div>

    <!-- Settings Content Area -->
    <div class="settings-content" style="flex: 1; background: white; border-radius: 24px; padding: 2rem; border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm); overflow-y: auto;">
        
        <!-- Tab 1: Company Profile -->
        <div id="companyTab" class="settings-section">
            <h2 style="color: var(--sky-600); font-weight: 800; margin-bottom: 2rem;">Company Profile</h2>
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 3rem;">
                <div>
                    <div class="form-group" style="margin-bottom: 2rem;">
                        <label style="font-weight: 700; color: var(--gray-600);">Business Name</label>
                        <input type="text" id="companyNameInput" class="form-control" style="border-radius: 12px; padding: 1rem;" placeholder="Enter Company Name">
                    </div>
                    <button class="btn" onclick="saveCompanySettings()" style="background: var(--sky-600); color: white; padding: 1rem 2rem; border-radius: 12px; font-weight: 700; width: 100%;">
                        Save Business Profile
                    </button>
                </div>
                <div style="text-align: center;">
                    <label style="font-weight: 700; color: var(--gray-600); display: block; margin-bottom: 1rem;">Business Logo</label>
                    <div class="logo-preview" id="logoPreview" onclick="document.getElementById('logoFile').click()" style="width: 150px; height: 150px; background: var(--gray-50); border: 2px dashed var(--gray-300); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; cursor: pointer; overflow: hidden; font-size: 3rem; color: var(--gray-300);">
                        <i class="fas fa-camera"></i>
                    </div>
                    <input type="file" id="logoFile" accept="image/*" style="display:none;" onchange="handleLogoUpload(event)">
                    <p style="font-size: 0.8rem; color: var(--gray-400);">Click to change logo</p>
                </div>
            </div>
        </div>

        <!-- Tab 2: System Preferences -->
        <div id="systemTab" class="settings-section" style="display: none;">
            <h2 style="color: var(--sky-600); font-weight: 800; margin-bottom: 2rem;">System Preferences</h2>
            <div style="max-width: 500px;">
                <div class="form-group" style="margin-bottom: 2rem;">
                    <label style="font-weight: 700; color: var(--gray-600);">System Date Format</label>
                    <select id="systemDateFormat" class="form-control" style="border-radius: 12px; padding: 1rem;" onchange="updateDateFormat()">
                        <option value="DD-MMM-YYYY">11-Apr-2026 (DD-MMM-YYYY)</option>
                        <option value="DD-MM-YYYY">11-04-2026 (DD-MM-YYYY)</option>
                        <option value="DD/MM/YYYY">11/04/2026 (DD/MM/YYYY)</option>
                        <option value="YYYY-MM-DD">2026-04-11 (YYYY-MM-DD)</option>
                    </select>
                    <p style="color: var(--gray-400); font-size: 0.8rem; margin-top: 0.8rem;">This format will be applied to all lists, reports, and printouts.</p>
                </div>

                <div class="form-group">
                    <label style="font-weight: 700; color: var(--gray-600);">Brand Low Stock Limits</label>
                    <div id="brandLowStockSettings" style="background: var(--gray-50); border-radius: 16px; padding: 1rem; border: 1px solid var(--gray-100); margin-top: 1rem;">
                        <!-- JS Dynamic content -->
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab 3: User Management -->
        <div id="usersTab" class="settings-section" style="display: none;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <h2 style="color: var(--sky-600); font-weight: 800; margin: 0;">User Management</h2>
                <button class="btn btn-primary" onclick="showAddUserModal()" style="border-radius: 12px;">Add New User</button>
            </div>
            <div style="background: var(--gray-50); border-radius: 16px; overflow: hidden; border: 1px solid var(--gray-200);">
                <table class="data-table" style="margin: 0;">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th style="text-align: right;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="usersList"></tbody>
                </table>
            </div>
        </div>

        <!-- Tab 4: Database & Backup -->
        <div id="dataTab" class="settings-section" style="display: none;">
            <h2 style="color: var(--sky-600); font-weight: 800; margin-bottom: 2rem;">Database & Backup</h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                <!-- Full SQL Backup -->
                <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 20px; padding: 1.5rem; text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem;">📀</div>
                    <h3 style="margin-bottom: 0.5rem; color: #0369a1;">Full System Backup</h3>
                    <p style="font-size: 0.85rem; color: #0c4a6e; margin-bottom: 1.5rem;">Download a complete SQL dump of your entire database.</p>
                    <button class="btn" onclick="window.location.href='api/backup.php'" style="background: #0ea5e9; color: white; width: 100%; border-radius: 10px; font-weight: 700;">Export SQL Backup</button>
                </div>

                <!-- Database Restore -->
                <div style="background: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 20px; padding: 1.5rem; text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem;">🔄</div>
                    <h3 style="margin-bottom: 0.5rem; color: #9d174d;">System Restore</h3>
                    <p style="font-size: 0.85rem; color: #831843; margin-bottom: 1.5rem;">Upload a previously saved SQL file to restore data.</p>
                    <button class="btn" onclick="document.getElementById('restoreFile').click()" style="background: #db2777; color: white; width: 100%; border-radius: 10px; font-weight: 700;">Restore from SQL</button>
                    <input type="file" id="restoreFile" accept=".sql" style="display:none;" onchange="handleRestore(event)">
                </div>

                <!-- CSV Export/Import -->
                <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 20px; padding: 1.5rem; text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem;">📊</div>
                    <h3 style="margin-bottom: 0.5rem; color: #15803d;">CSV Data Exchange</h3>
                    <p style="font-size: 0.85rem; color: #14532d; margin-bottom: 1rem;">Import or Export Items and Customers via CSV.</p>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn" onclick="exportData('items')" style="flex: 1; background: #22c55e; color: white; border-radius: 8px;">Export Items</button>
                        <button class="btn" onclick="document.getElementById('importItemsFile').click()" style="flex: 1; background: #eab308; color: white; border-radius: 8px;">Import Items</button>
                    </div>
                    <input type="file" id="importItemsFile" accept=".csv" style="display:none;" onchange="importData('items', event)">
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.settings-tab {
    padding: 1rem 1.2rem;
    border: none;
    background: transparent;
    border-radius: 12px;
    text-align: left;
    font-weight: 700;
    color: var(--gray-600);
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.95rem;
}
.settings-tab:hover {
    background: white;
    color: var(--sky-600);
}
.settings-tab.active {
    background: white;
    color: var(--sky-600);
    box-shadow: var(--shadow-sm);
}
</style>