                    <div class="settings-panel">
                        <div class="company-settings">
                            <h3>🏢 Company Settings</h3>
                            <div class="settings-grid">
                                <div>
                                    <div class="form-group">
                                        <label>Company Name</label>
                                        <input type="text" id="companyNameInput" class="form-control" value="StockFlow">
                                    </div>
                                    <button class="btn btn-primary" onclick="saveCompanySettings()">Save Settings</button>
                                </div>
                                <div class="logo-upload">
                                    <div class="logo-preview" id="logoPreview" onclick="document.getElementById('logoFile').click()">📦</div>
                                    <input type="file" id="logoFile" accept="image/*" style="display:none;" onchange="handleLogoUpload(event)">
                                    <p style="color:var(--gray-500); font-size:0.8rem;">Click to upload logo</p>
                                </div>
                            </div>
                        </div>
                        <h3 style="color:var(--sky-600); margin:1rem 0;">Brand Low Stock Limits</h3>
                        <div class="brands-lowstock-container" id="brandLowStockSettings"></div>

                        <h3 style="color:var(--sky-600); margin:2rem 0 1rem;">💾 Data Management & Backup</h3>
                        <div class="settings-card" style="background:white; padding:1.5rem; border-radius:1rem; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom:2rem;">
                            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">
                                <div class="data-mgmt-item" style="border:1px solid #e5e7eb; padding:1rem; border-radius:0.8rem; text-align:center;">
                                    <p style="font-weight:600; margin-bottom:0.5rem;">Database</p>
                                    <div style="display:flex; gap:0.5rem;">
                                        <button class="btn btn-primary" onclick="window.location.href='api/backup.php'" style="flex:1;">📀 Backup</button>
                                        <button class="btn btn-danger" onclick="document.getElementById('restoreFile').click()" style="flex:1;">🔄 Restore</button>
                                    </div>
                                    <input type="file" id="restoreFile" accept=".sql" style="display:none;" onchange="handleRestore(event)">
                                </div>
                                <div class="data-mgmt-item" style="border:1px solid #e5e7eb; padding:1rem; border-radius:0.8rem; text-align:center;">
                                    <p style="font-weight:600; margin-bottom:0.5rem;">Items & Stock</p>
                                    <div style="display:flex; gap:0.5rem;">
                                        <button class="btn btn-success" onclick="exportData('items')" style="flex:1;">📊 Export</button>
                                        <button class="btn btn-warning" onclick="document.getElementById('importItemsFile').click()" style="flex:1;">📥 Import</button>
                                    </div>
                                </div>
                                <div class="data-mgmt-item" style="border:1px solid #e5e7eb; padding:1rem; border-radius:0.8rem; text-align:center;">
                                    <p style="font-weight:600; margin-bottom:0.5rem;">Customers</p>
                                    <div style="display:flex; gap:0.5rem;">
                                        <button class="btn btn-success" onclick="exportData('customers')" style="flex:1;">📊 Export</button>
                                        <button class="btn btn-warning" onclick="document.getElementById('importCustomersFile').click()" style="flex:1;">📥 Import</button>
                                    </div>
                                </div>
                            </div>
                            <input type="file" id="importItemsFile" accept=".csv" style="display:none;" onchange="importData('items', event)">
                            <input type="file" id="importCustomersFile" accept=".csv" style="display:none;" onchange="importData('customers', event)">
                        </div>
                        <h3 style="color:var(--sky-600); margin:2rem 0 1rem;">User Management</h3>
                        <button class="btn btn-success" onclick="showAddUserModal()">➕ Add User</button>
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="usersList"></tbody>
                        </table>
                    </div>