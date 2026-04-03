                    <div class="settings-panel">
                        <div class="company-settings">
                            <h3>🏢 Company Settings</h3>
                            <div class="settings-grid">
                                <div>
                                    <div class="form-group">
                                        <label>Company Name</label>
                                        <input type="text" id="companyNameInput" class="form-control" value="StockFlow">
                                    </div>
                                    <div class="form-group">
                                        <label>Database Name</label>
                                        <input type="text" id="databaseNameInput" class="form-control" value="stockflow_db">
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