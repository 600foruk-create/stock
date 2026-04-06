// ==================== DATA STRUCTURES ====================
let users = [];
let currentUser = null;
let currentModule = 'finishGood';
let usedCompletedOrders = new Set();
let mainCategories = [
    { id: 1, name: 'Master Flex', color: '#2196f3', lowStockLimit: 10 },
    { id: 2, name: 'Eco Flex', color: '#4caf50', lowStockLimit: 10 }
];
let subCategories = [
    { id: 1, mainId: 1, name: '2"' },
    { id: 2, mainId: 1, name: '3"' },
    { id: 3, mainId: 2, name: '2"' },
    { id: 4, mainId: 2, name: '3"' }
];
let items = [
    { id: 1, mainId: 1, subId: 1, name: '', length: 13, weight: 2.0, stock: 25, minStock: 10 },
    { id: 2, mainId: 1, subId: 1, name: '', length: 13, weight: 2.5, stock: 15, minStock: 10 },
    { id: 3, mainId: 1, subId: 2, name: '', length: 13, weight: 2.0, stock: 8, minStock: 10 },
    { id: 4, mainId: 2, subId: 3, name: '', length: 13, weight: 1.5, stock: 30, minStock: 15 },
    { id: 5, mainId: 2, subId: 4, name: '', length: 13, weight: 2.0, stock: 5, minStock: 10 }
];
let customers = [];
let transactions = [];
let orders = [];
let rawMaterials = [];
let storeItems = [];
let auditSession = {}; // Correctly initialized global session
let auditRecords = [];

// Company Settings
let companySettings = {
    name: 'StockFlow',
    logo: '📦'
};

// Initialize App
async function initApp() {
    console.log('StockFlow: Initializing App...');
    // Load local session if any
    let savedUser = localStorage.getItem('stock_currentUser');
    if (savedUser) {
        try { currentUser = JSON.parse(savedUser); } catch (e) { }
    }

    let savedAudit = localStorage.getItem('stock_auditSession');
    if (savedAudit) {
        try { auditSession = JSON.parse(savedAudit); } catch (e) { }
    }

    // Fetch all data from SQL
    try {
        const response = await fetch('api/sync.php?action=get_all');
        const text = await response.text();
        let result;
        try {
            result = JSON.parse(text);
        } catch (parseError) {
            console.error('Invalid JSON from server:', text);
            throw new Error('Server returned invalid data format.');
        }
        
        if (result.status === 'success') {
            console.log('StockFlow: SQL Data loaded successfully.');
            const d = result.data;
            users = d.users || [];
            mainCategories = d.mainCategories || [];
            subCategories = d.subCategories || [];
            items = d.items || [];
            customers = d.customers || [];
            orders = d.orders || [];
            transactions = d.transactions || [];
            rawMaterials = d.rawMaterials || [];
            storeItems = d.storeItems || [];
            
            // Map settings
            if (d.settings) {
                d.settings.forEach(s => {
                    if (s.category === 'company') {
                        companySettings[s.key] = s.value;
                    }
                });
            }

            // Post-process transactions to match UI expectations
            transactions.forEach(t => {
                if (!t.productCode && t.itemId) {
                    let item = items.find(i => i.id === t.itemId);
                    let sub = subCategories.find(s => s.id === (item ? item.subId : t.subId));
                    let main = mainCategories.find(m => m.id === (item ? item.mainId : t.mainId));
                    if (item && sub && main) {
                        t.productCode = getProductCode(item, main, sub);
                        t.mainName = main.name;
                    }
                }
            });

            saveData(); // Sync to local backup
        } else {
            console.warn('StockFlow: SQL returned error state:', result.message);
            loadLegacyData();
        }
    } catch (e) {
        console.error('StockFlow: Init failed, using legacy data.', e);
        loadLegacyData();
    }

    updateCompanyDisplay();
    if (!currentUser) {
        showLogin();
    } else {
        hideLogin();
        // Force refresh all UI components with new SQL data
        refreshDashboard();
        refreshCategoriesView();
        refreshStockList();
        refreshOrdersList();
        refreshCustomersList();
        refreshTransactions();
        refreshUsersList();
        refreshLowStockReport();
        refreshAuditList();
    }
}

function loadLegacyData() {
    let savedCompany = localStorage.getItem('stock_company');
    if (savedCompany) companySettings = JSON.parse(savedCompany);
    users = JSON.parse(localStorage.getItem('stock_users')) || [
        { id: 1, name: 'Admin', username: 'admin', password: 'admin123', role: 'Admin' }
    ];
    mainCategories = JSON.parse(localStorage.getItem('stock_mainCat')) || [];
    subCategories = JSON.parse(localStorage.getItem('stock_subCat')) || [];
    items = JSON.parse(localStorage.getItem('stock_items')) || [];
    customers = JSON.parse(localStorage.getItem('stock_customers')) || [];
    orders = JSON.parse(localStorage.getItem('stock_orders')) || [];
}

// Call init on load
window.addEventListener('DOMContentLoaded', initApp);

// Auto-sync every 60 seconds to ensure life data across devices
setInterval(() => {
    if (currentUser) {
        console.log('StockFlow: Auto-syncing data...');
        initApp(); 
    }
}, 60000);

function updateCompanyDisplay() {
    document.title = `${companySettings.name} - Stock Manager`;
    document.getElementById('sidebarCompany').textContent = companySettings.name;
    document.getElementById('sidebarLogo').innerHTML = companySettings.logo || '📦';
    
    // Update Login Page if it exists
    const loginTitle = document.getElementById('loginTitle');
    if (loginTitle) {
        loginTitle.innerHTML = `${companySettings.logo || '📦'} ${companySettings.name}`;
    }

    // Update Settings Page inputs
    const nameInput = document.getElementById('companyNameInput');
    if (nameInput) nameInput.value = companySettings.name;
    
    const logoPreview = document.getElementById('logoPreview');
    if (logoPreview) logoPreview.innerHTML = companySettings.logo || '📦';

    // Update Print Headers
    const logoElements = document.querySelectorAll('.printLogo, #printLogo, #auditPrintLogo');
    logoElements.forEach(el => el.innerHTML = companySettings.logo || '📦');

    const nameElements = document.querySelectorAll('.printCompanyName, #printCompanyName, #auditPrintCompanyName');
    nameElements.forEach(el => el.textContent = companySettings.name);
}

function showCompanySettings() {
    switchModule('settings');
    setTimeout(() => {
        document.getElementById('companyNameInput').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function saveCompanySettings() {
    companySettings.name = document.getElementById('companyNameInput').value || 'StockFlow';
    fetch('api/sync.php?action=save_settings', {
        method: 'POST',
        body: JSON.stringify({ settings: { name: companySettings.name, logo: companySettings.logo } })
    });
    localStorage.setItem('stock_company', JSON.stringify(companySettings));
    updateCompanyDisplay();
    alert('Company settings saved!');
}

function handleLogoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            companySettings.logo = `<img src="${e.target.result}" style="width:100%; height:100%; border-radius:50%; object-fit:cover;">`;
            fetch('api/sync.php?action=save_settings', {
                method: 'POST',
                body: JSON.stringify({ settings: { name: companySettings.name, logo: companySettings.logo } })
            });
            localStorage.setItem('stock_company', JSON.stringify(companySettings));
            updateCompanyDisplay();
        };
        reader.readAsDataURL(file);
    }
}



function loadLocalData() {
    try {
        let savedOrders = localStorage.getItem('stock_orders');
        if (savedOrders) orders = JSON.parse(savedOrders);
        let savedCustomers = localStorage.getItem('stock_customers');
        if (savedCustomers) customers = JSON.parse(savedCustomers);
        let savedTransactions = localStorage.getItem('stock_transactions');
        if (savedTransactions) transactions = JSON.parse(savedTransactions);
        let savedItems = localStorage.getItem('stock_items');
        if (savedItems) items = JSON.parse(savedItems);
        let savedMainCat = localStorage.getItem('stock_mainCat');
        if (savedMainCat) mainCategories = JSON.parse(savedMainCat);
        let savedSubCat = localStorage.getItem('stock_subCat');
        if (savedSubCat) subCategories = JSON.parse(savedSubCat);
        let savedUsedOrders = localStorage.getItem('stock_usedOrders');
        if (savedUsedOrders) {
            try {
                usedCompletedOrders = new Set(JSON.parse(savedUsedOrders));
            } catch (e) { }
        }
    } catch (e) { }
}

function saveData() {
    localStorage.setItem('stock_orders', JSON.stringify(orders || []));
    localStorage.setItem('stock_customers', JSON.stringify(customers || []));
    localStorage.setItem('stock_transactions', JSON.stringify(transactions || []));
    localStorage.setItem('stock_items', JSON.stringify(items || []));
    localStorage.setItem('stock_mainCat', JSON.stringify(mainCategories || []));
    localStorage.setItem('stock_subCat', JSON.stringify(subCategories || []));
    localStorage.setItem('stock_usedOrders', JSON.stringify(Array.from(usedCompletedOrders || [])));
    localStorage.setItem('stock_company', JSON.stringify(companySettings));
    localStorage.setItem('stock_users', JSON.stringify(users || []));
    if (currentUser) {
        localStorage.setItem('stock_currentUser', JSON.stringify(currentUser));
    }
}

function saveAll() {
    saveData();
}

// Function to re-sequence all codes to fill gaps and maintain order
function resequenceCodes() {
    // Sort main categories to have a consistent base if they don't have codes
    sortMainCategories(mainCategories).forEach((main) => {
        let mainCode = main.code || String(main.id).padStart(2, '0');

        // Resequence SubCategories (Sizes) within this Brand
        let brandSubs = subCategories.filter(s => s.mainId === main.id);
        sortSubCategories(brandSubs).forEach((sub, subIndex) => {
            let newSubSeq = subIndex + 1;
            sub.code = mainCode + String(newSubSeq).padStart(3, '0');

            // Resequence Items within this Size
            let subItems = items.filter(i => i.subId === sub.id);
            sortItems(subItems).forEach((item, itemIndex) => {
                let newItemSeq = itemIndex + 1;
                item.code = sub.code + String(newItemSeq).padStart(4, '0');
            });
        });
    });
    saveAll();
}

function getProductCode(item, main, sub) {
    if (!item || !main || !sub) return 'N/A';
    let size = sub.name.replace(/[^0-9.]/g, '') || '0';
    return `${size}"×${item.length}' ${item.weight}KG ${main.name}`;
}

function sortMainCategories(cats) {
    return [...cats].sort((a, b) => a.name.localeCompare(b.name));
}

function sortSubCategories(subs) {
    return [...subs].sort((a, b) => {
        let numA = parseFloat(a.name.replace(/[^0-9.]/g, '')) || 0;
        let numB = parseFloat(b.name.replace(/[^0-9.]/g, '')) || 0;
        return numA - numB;
    });
}

function sortItems(itemsList) {
    return [...itemsList].sort((a, b) => {
        if (a.length !== b.length) return a.length - b.length;
        return (a.weight || 0) - (b.weight || 0);
    });
}

function switchModule(module) {
    currentModule = module;
    document.querySelectorAll('.menu-item').forEach((btn, index) => {
        btn.classList.remove('active');
        if (module === 'finishGood' && index === 0) btn.classList.add('active');
        if (module === 'rawMaterials' && index === 1) btn.classList.add('active');
        if (module === 'store' && index === 2) btn.classList.add('active');
        if (module === 'settings' && index === 3) btn.classList.add('active');
    });

    // Hide all main panels and tabs
    document.getElementById('finishGoodTabs').style.display = 'none';
    document.getElementById('settingsPanel').style.display = 'none';
    document.getElementById('rawMaterialsPanel').style.display = 'none';
    document.getElementById('storePanel').style.display = 'none';
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    if (module === 'finishGood') {
        document.getElementById('finishGoodTabs').style.display = 'flex';
        let activeTab = document.querySelector('.nav-tab.active');
        if (activeTab) {
            let tabNameText = activeTab.textContent.toLowerCase();
            let tabName = 'dashboard';
            if (tabNameText.includes('data entry')) tabName = 'dataEntry';
            else if (tabNameText.includes('orders')) tabName = 'orders';
            else if (tabNameText.includes('categories')) tabName = 'categories';
            else if (tabNameText.includes('customers')) tabName = 'customers';
            else if (tabNameText.includes('stock list')) tabName = 'stockList';
            else if (tabNameText.includes('audit')) tabName = 'audit';
            else if (tabNameText.includes('low stock')) tabName = 'lowStockReport';
            showTab(tabName);
        } else {
            showTab('dashboard');
        }
    } else if (module === 'settings') {
        document.getElementById('settingsPanel').style.display = 'block';
        refreshUsersList();
        refreshBrandLowStockSettings();
    } else if (module === 'rawMaterials') {
        document.getElementById('rawMaterialsPanel').style.display = 'block';
    } else if (module === 'store') {
        document.getElementById('storePanel').style.display = 'block';
    }
}

function togglePassword(fieldId) {
    let password = document.getElementById(fieldId);
    password.type = password.type === 'password' ? 'text' : 'password';
}

function login() {
    console.log('StockFlow: Login attempt...');
    let usernameInput = document.getElementById('username');
    let passwordInput = document.getElementById('password');
    let username = usernameInput ? usernameInput.value : '';
    let password = passwordInput ? passwordInput.value : '';

    if (!users || users.length === 0) {
        console.warn('StockFlow: No users loaded, trying legacy fallback...');
        loadLegacyData();
        if (!users || users.length === 0) {
            alert('Loading user data. Please try again in a moment or check your connection.');
            return;
        }
    }

    let user = users.find(u => u.username === username && u.password === password);
    console.log('StockFlow: Matching user found:', user ? 'Yes' : 'No');

    if (user) {
        currentUser = user;
        localStorage.setItem('stock_currentUser', JSON.stringify(user));
        loadLocalData();
        
        const loginPage = document.getElementById('loginPage');
        const appPage = document.getElementById('app');
        if (loginPage) loginPage.style.display = 'none';
        if (appPage) appPage.style.display = 'block';
        
        updateCompanyDisplay();
        refreshDashboard();
        refreshTransactions();
        refreshOrdersList();
        refreshCategoriesView();
        refreshStockList();
        refreshLowStockReport();
        refreshUsersList();
        refreshCustomersList();
        switchModule('finishGood');
    } else {
        alert('Invalid entry or account not found. Loaded Users: ' + (users ? users.length : 0));
    }
}

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && document.getElementById('loginPage').style.display !== 'none') {
        login();
    }
});

(function () {
    if (currentUser) {
        loadLocalData();
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        updateCompanyDisplay();
        refreshDashboard();
        refreshTransactions();
        refreshOrdersList();
        refreshCategoriesView();
        refreshStockList();
        refreshLowStockReport();
        refreshUsersList();
        refreshCustomersList();
        switchModule('finishGood');
    }
})();

function logout() {
    currentUser = null;
    localStorage.removeItem('stock_currentUser');
    showLogin();
}

function showLogin() {
    const loginPage = document.getElementById('loginPage');
    const appPage = document.getElementById('app');
    if (loginPage) loginPage.style.display = 'block';
    if (appPage) appPage.style.display = 'none';
}

function hideLogin() {
    const loginPage = document.getElementById('loginPage');
    const appPage = document.getElementById('app');
    if (loginPage) loginPage.style.display = 'none';
    if (appPage) appPage.style.display = 'block';
}

function formatDate(dateString) {
    if (!dateString) return '';
    let date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString().slice(0, 5);
}

function filterTable(tableId, searchText) {
    let table = document.getElementById(tableId);
    if (!table) return;
    let rows = table.getElementsByTagName('tr');
    searchText = searchText.toLowerCase();
    for (let i = 1; i < rows.length; i++) {
        let row = rows[i];
        if (row.cells.length < 2) continue;
        let text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchText) ? '' : 'none';
    }
}

function showTab(tabName) {
    if (currentModule !== 'finishGood') return;
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    
    // Find tab by name or case-insensitive search
    const tabElement = document.getElementById(tabName);
    if (tabElement) {
        tabElement.classList.add('active');
    }
    
    // Also update nav buttons active state
    document.querySelectorAll('.nav-tab').forEach(btn => {
        if (btn.getAttribute('onclick')?.includes(`'${tabName}'`)) {
            btn.classList.add('active');
        }
    });
    if (tabName === 'dashboard') refreshDashboard();
    if (tabName === 'orders') refreshOrdersList();
    if (tabName === 'dataEntry') {
        refreshTransactions();
        refreshCompletedOrderDropdown();
    }
    if (tabName === 'categories') refreshCategoriesView();
    if (tabName === 'customers') refreshCustomersList();
    if (tabName === 'stockList') refreshStockList();
    if (tabName === 'audit') refreshAuditList();
    if (tabName === 'lowStockReport') refreshLowStockReport();
}

// Customer Functions
function showAddCustomerModal() {
    document.getElementById('customerModalTitle').textContent = '➕ Add Customer';
    document.getElementById('editCustomerId').value = '';
    document.getElementById('customerName').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('customerMobile').value = '';
    document.getElementById('customerUniqueId').value = '';
    document.getElementById('customerModal').style.display = 'block';
}

function closeCustomerModal() {
    document.getElementById('customerModal').style.display = 'none';
}

async function saveCustomer() {
    let id = document.getElementById('editCustomerId').value;
    let name = document.getElementById('customerName').value.trim();
    let address = document.getElementById('customerAddress').value.trim();
    let mobile = document.getElementById('customerMobile').value.trim();
    let uniqueInput = document.getElementById('customerUniqueId').value.trim();

    if (!name) {
        alert('Please enter customer name');
        return;
    }

    let customerData = {
        name: name,
        address: address,
        mobile: mobile,
        uniqueId: uniqueInput || (id ? customers.find(c => c.id == id)?.uniqueId : 'CUST' + String(customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1).padStart(4, '0'))
    };
    if (id) customerData.id = parseInt(id);

    try {
        const response = await fetch('api/sync.php?action=save_customer', {
            method: 'POST',
            body: JSON.stringify({ customer: customerData })
        });
        const result = await response.json();
        if (result.status === 'success') {
            customerData.id = result.id;
            if (id) {
                let idx = customers.findIndex(c => c.id == id);
                if (idx !== -1) customers[idx] = customerData;
            } else {
                customers.push(customerData);
            }
            saveData();
            refreshCustomersList();
            closeCustomerModal();
            alert(id ? 'Customer updated successfully!' : 'Customer added successfully!');
        } else {
            alert('Error: ' + result.message);
        }
    } catch (e) {
        console.error('Customer save failed:', e);
        alert('Server error. Save failed.');
    }
}

function refreshCustomersList() {
    let container = document.getElementById('customersList');
    let html = '';
    if (customers.length === 0) {
        html = '<div style="text-align:center; padding:2rem; color:var(--gray-500);">No customers yet</div>';
    } else {
        customers.forEach(c => {
            html += `
                        <div style="background:var(--orange-100); padding:1rem; border-radius:0.8rem;">
                            <span style="background:var(--orange-500); color:white; padding:0.2rem 0.8rem; border-radius:50px; font-size:0.8rem;">${c.uniqueId}</span>
                            <h4 style="margin:0.5rem 0;">${c.name}</h4>
                            <div style="color:var(--gray-500); font-size:0.9rem;">📍 ${c.address || 'No address'}</div>
                            <div style="color:var(--gray-500); font-size:0.9rem;">📞 ${c.mobile || 'No mobile'}</div>
                            <div style="display:flex; gap:0.5rem; margin-top:1rem;">
                                <button class="btn btn-primary btn-sm" onclick="editCustomer(${c.id})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${c.id})">Delete</button>
                            </div>
                        </div>
                    `;
        });
    }
    container.innerHTML = html;
}

function filterCustomers() {
    let search = document.getElementById('customerSearch').value.toLowerCase();
    let container = document.getElementById('customersList');
    let filtered = customers.filter(c =>
        c.name.toLowerCase().includes(search) ||
        (c.address && c.address.toLowerCase().includes(search)) ||
        (c.mobile && c.mobile.toLowerCase().includes(search)) ||
        (c.uniqueId && c.uniqueId.toLowerCase().includes(search))
    );
    let html = '';
    if (filtered.length === 0) {
        html = '<div style="text-align:center; padding:2rem; color:var(--gray-500);">No matching customers</div>';
    } else {
        filtered.forEach(c => {
            html += `
                        <div style="background:var(--orange-100); padding:1rem; border-radius:0.8rem;">
                            <span style="background:var(--orange-500); color:white; padding:0.2rem 0.8rem; border-radius:50px;">${c.uniqueId}</span>
                            <h4 style="margin:0.5rem 0;">${c.name}</h4>
                            <div style="color:var(--gray-500);">📍 ${c.address || 'No address'}</div>
                            <div style="color:var(--gray-500);">📞 ${c.mobile || 'No mobile'}</div>
                            <div style="display:flex; gap:0.5rem; margin-top:1rem;">
                                <button class="btn btn-primary btn-sm" onclick="editCustomer(${c.id})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${c.id})">Delete</button>
                            </div>
                        </div>
                    `;
        });
    }
    container.innerHTML = html;
}

function editCustomer(id) {
    let customer = customers.find(c => c.id === id);
    if (customer) {
        document.getElementById('customerModalTitle').textContent = '✏️ Edit Customer';
        document.getElementById('editCustomerId').value = customer.id;
        document.getElementById('customerName').value = customer.name;
        document.getElementById('customerAddress').value = customer.address || '';
        document.getElementById('customerMobile').value = customer.mobile || '';
        document.getElementById('customerUniqueId').value = customer.uniqueId || '';
        document.getElementById('customerModal').style.display = 'block';
    }
}

async function deleteCustomer(id) {
    if (confirm('Are you sure?')) {
        try {
            const response = await fetch('api/sync.php?action=delete_customer', {
                method: 'POST',
                body: JSON.stringify({ id: id })
            });
            const result = await response.json();
            if (result.status === 'success') {
                customers = customers.filter(c => c.id !== id);
                saveData();
                refreshCustomersList();
                alert('Customer deleted.');
            } else {
                alert('Delete failed: ' + result.message);
            }
        } catch (e) {
            alert('Server error.');
        }
    }
}

// Brand Low Stock Settings
function refreshBrandLowStockSettings() {
    let container = document.getElementById('brandLowStockSettings');
    let html = '';
    sortMainCategories(mainCategories).forEach(brand => {
        html += `
                    <div class="brand-lowstock-card">
                        <div class="brand-lowstock-header">
                            <span class="brand-color-dot" style="background: ${brand.color};"></span>
                            <h4>${brand.name}</h4>
                        </div>
                        <div class="brand-lowstock-input">
                            <input type="number" id="brandLow_${brand.id}" value="${brand.lowStockLimit || 10}">
                            <button class="btn btn-primary btn-sm" onclick="updateBrandLowStock(${brand.id})">Update</button>
                        </div>
                    </div>
                `;
    });
    container.innerHTML = html;
}

async function updateBrandLowStock(brandId) {
    let input = document.getElementById(`brandLow_${brandId}`);
    let newLimit = parseInt(input.value);
    if (newLimit && newLimit > 0) {
        let brand = mainCategories.find(b => b.id === brandId);
        if (brand) {
            brand.lowStockLimit = newLimit;
            // Sync to server
            try {
                await fetch('api/sync.php?action=save_category', {
                    method: 'POST',
                    body: JSON.stringify({ type: 'main', category: brand })
                });
                
                items.forEach(item => {
                    if (item.mainId === brandId && !item.customMinStock) {
                        item.minStock = newLimit;
                    }
                });
                saveData();
                refreshDashboard();
                refreshStockList();
                refreshLowStockReport();
                alert(`${brand.name} limit updated to ${newLimit} and synced to server.`);
            } catch (e) {
                alert('Limit updated locally, but server sync failed.');
            }
        }
    } else {
        alert('Enter valid number');
    }
}

// Searchable Customer Dropdown
function createCustomerSearchable(placeholder, onSelect, initialValue = '') {
    const wrapper = document.createElement('div');
    wrapper.className = 'searchable-wrapper';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'searchable-input';
    input.placeholder = placeholder;
    input.value = initialValue;
    wrapper.appendChild(input);
    const dropdown = document.createElement('div');
    dropdown.className = 'searchable-dropdown';
    wrapper.appendChild(dropdown);
    let filteredCustomers = [];
    let selectedIndex = -1;

    function filterOptions(searchText) {
        searchText = searchText.toLowerCase();
        if (!searchText) {
            filteredCustomers = customers.slice(0, 10);
        } else {
            filteredCustomers = customers.filter(c =>
                c.name.toLowerCase().includes(searchText) ||
                (c.address && c.address.toLowerCase().includes(searchText)) ||
                (c.mobile && c.mobile.toLowerCase().includes(searchText)) ||
                (c.uniqueId && c.uniqueId.toLowerCase().includes(searchText))
            ).slice(0, 10);
        }
        renderDropdown();
    }

    function renderDropdown() {
        if (filteredCustomers.length === 0) {
            dropdown.innerHTML = '<div class="searchable-item">No customers found</div>';
        } else {
            dropdown.innerHTML = filteredCustomers.map((c, index) => `
                        <div class="searchable-item ${index === selectedIndex ? 'selected' : ''}" data-id="${c.id}" data-name="${c.name}" data-address="${c.address || ''}" data-mobile="${c.mobile || ''}" data-unique="${c.uniqueId}">
                            <strong>${c.name}</strong> <span class="customer-badge">${c.uniqueId}</span><br>
                            <small>${c.address || 'No address'} | ${c.mobile || 'No mobile'}</small>
                        </div>
                    `).join('');

            dropdown.querySelectorAll('.searchable-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    let name = item.dataset.name;
                    let id = item.dataset.id;
                    let unique = item.dataset.unique;
                    input.value = name + ' (' + unique + ')';
                    if (onSelect) onSelect({ id: parseInt(id), name, uniqueId: unique });
                    dropdown.classList.remove('show');
                });
            });
        }
    }

    input.addEventListener('input', () => {
        filterOptions(input.value);
        dropdown.classList.add('show');
        selectedIndex = -1;
    });
    input.addEventListener('focus', () => {
        filterOptions(input.value);
        dropdown.classList.add('show');
    });
    input.addEventListener('keydown', (e) => {
        if (!dropdown.classList.contains('show')) return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, filteredCustomers.length - 1);
                renderDropdown();
                break;
            case 'ArrowUp':
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                renderDropdown();
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && filteredCustomers[selectedIndex]) {
                    let c = filteredCustomers[selectedIndex];
                    input.value = c.name + ' (' + c.uniqueId + ')';
                    if (onSelect) onSelect(c);
                    dropdown.classList.remove('show');
                }
                break;
            case 'Escape':
                dropdown.classList.remove('show');
                break;
        }
    });
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
    return wrapper;
}

// Searchable Input with Quick Add
function createSearchableInput(placeholder, options, onSelect, disabled = false, quickAddType = null, quickAddData = null) {
    const wrapper = document.createElement('div');
    wrapper.className = 'searchable-wrapper';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'searchable-input';
    input.placeholder = placeholder;
    input.disabled = disabled;
    wrapper.appendChild(input);
    const dropdown = document.createElement('div');
    dropdown.className = 'searchable-dropdown';
    wrapper.appendChild(dropdown);
    let filteredOptions = [];
    let selectedIndex = -1;

    function filterOptions(searchText) {
        searchText = searchText.toLowerCase();
        if (!searchText) {
            filteredOptions = options.slice(0, 10);
        } else {
            filteredOptions = options.filter(opt =>
                opt.text.toLowerCase().includes(searchText) ||
                (opt.searchText && opt.searchText.toLowerCase().includes(searchText))
            ).slice(0, 10);
        }
        renderDropdown();
    }

    function renderDropdown() {
        let html = '';
        if (filteredOptions.length === 0) {
            html = '<div class="searchable-item">No results found</div>';
        } else {
            html = filteredOptions.map((opt, index) => `
                        <div class="searchable-item ${index === selectedIndex ? 'selected' : ''}" data-value="${opt.value}">
                            ${opt.text}
                            ${opt.stock !== undefined ? `<span style="float: right; color: ${opt.stock <= (opt.minStock || 10) ? '#ff5252' : '#4caf50'}; font-weight: bold;">Stock: ${opt.stock}</span>` : ''}
                        </div>
                    `).join('');
        }

        if (quickAddType) {
            html += `<div class="searchable-item quick-add-option" onclick="${quickAddType === 'brand' ? 'showQuickAddBrand()' : quickAddType === 'size' ? 'showQuickAddSize(' + quickAddData + ')' : ''}">
                        <span class="quick-add-icon">⚡</span> Quick Add New ${quickAddType === 'brand' ? 'Brand' : 'Size'}
                    </div>`;
        }

        dropdown.innerHTML = html;

        dropdown.querySelectorAll('.searchable-item:not(.quick-add-option)').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const value = item.dataset.value;
                const selectedOpt = filteredOptions.find(opt => opt.value == value);
                if (selectedOpt) {
                    input.value = selectedOpt.text;
                    if (onSelect) onSelect(selectedOpt);
                    dropdown.classList.remove('show');
                }
            });
        });
    }

    input.addEventListener('input', () => {
        filterOptions(input.value);
        dropdown.classList.add('show');
        selectedIndex = -1;
    });
    input.addEventListener('focus', () => {
        filterOptions(input.value);
        dropdown.classList.add('show');
    });
    input.addEventListener('keydown', (e) => {
        if (!dropdown.classList.contains('show')) return;
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, filteredOptions.length - 1);
                renderDropdown();
                break;
            case 'ArrowUp':
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                renderDropdown();
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && filteredOptions[selectedIndex]) {
                    const opt = filteredOptions[selectedIndex];
                    input.value = opt.text;
                    if (onSelect) onSelect(opt);
                    dropdown.classList.remove('show');
                }
                break;
            case 'Escape':
                dropdown.classList.remove('show');
                break;
        }
    });
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            dropdown.classList.remove('show');
        }
    });
    return wrapper;
}

// Quick Add Functions
function showQuickAddBrand() {
    document.getElementById('quickBrandName').value = '';
    document.getElementById('quickBrandCode').value = '';
    document.getElementById('quickBrandColor').value = '#2196f3';
    document.getElementById('quickBrandLowStock').value = '10';
    document.getElementById('quickAddBrandModal').style.display = 'block';
}

function closeQuickAddBrandModal() {
    document.getElementById('quickAddBrandModal').style.display = 'none';
}

async function saveQuickBrand() {
    let name = document.getElementById('quickBrandName').value;
    let code = document.getElementById('quickBrandCode').value;
    let color = document.getElementById('quickBrandColor').value;
    let lowStock = parseInt(document.getElementById('quickBrandLowStock').value) || 10;

    if (!name) {
        alert('Please enter brand name');
        return;
    }

    let catData = { name, color, lowStockLimit: lowStock };
    
    try {
        const response = await fetch('api/sync.php?action=save_category', {
            method: 'POST',
            body: JSON.stringify({ category: catData, type: 'main' })
        });
        const result = await response.json();
        if (result.status === 'success') {
            catData.id = result.id;
            catData.code = code || String(result.id).padStart(2, '0');
            mainCategories.push(catData);
            saveData();
            closeQuickAddBrandModal();
            refreshDashboard();
            refreshCategoriesView();
            refreshStockList();
            refreshLowStockReport();
            alert(`Brand "${name}" added!`);
        } else {
            alert('Error: ' + result.message);
        }
    } catch (e) {
        alert('Sync failed.');
    }
}

function showQuickAddSize(brandId) {
    let brand = mainCategories.find(m => m.id == brandId);
    if (!brand) return;

    document.getElementById('quickSizeBrandId').value = brandId;
    document.getElementById('quickSizeBrandName').value = brand.name;
    document.getElementById('quickSizeName').value = '';
    document.getElementById('quickSizeUnit').value = 'inch';
    document.getElementById('quickAddSizeModal').style.display = 'block';
}

function closeQuickAddSizeModal() {
    document.getElementById('quickAddSizeModal').style.display = 'none';
}

async function saveQuickSize() {
    let brandId = parseInt(document.getElementById('quickSizeBrandId').value);
    let sizeValue = document.getElementById('quickSizeName').value;
    let unit = document.getElementById('quickSizeUnit').value;

    if (!sizeValue) {
        alert('Please enter size');
        return;
    }

    let fullName = sizeValue + (unit === 'inch' ? '"' : 'mm');
    let subData = { name: fullName, mainId: brandId };

    try {
        const response = await fetch('api/sync.php?action=save_category', {
            method: 'POST',
            body: JSON.stringify({ category: subData, type: 'sub' })
        });
        const result = await response.json();
        if (result.status === 'success') {
            subData.id = result.id;
            // Generate code locally for now
            let main = mainCategories.find(m => m.id === brandId);
            let mainCode = (main && main.code) ? main.code : String(brandId).padStart(2, '0');
            let existingSubs = subCategories.filter(s => s.mainId === brandId);
            let maxSeq = 0;
            existingSubs.forEach(s => {
                if (s.code && typeof s.code === 'string') {
                    let seq = parseInt(s.code.slice(mainCode.length)) || 0;
                    if (seq > maxSeq) maxSeq = seq;
                }
            });
            subData.code = mainCode + String(maxSeq + 1).padStart(3, '0');
            
            subCategories.push(subData);
            saveData();
            closeQuickAddSizeModal();
            refreshCategoriesView();
            alert(`Size "${fullName}" added!`);
        } else {
            alert('Error: ' + result.message);
        }
    } catch (e) {
        alert('Sync failed.');
    }
}

// Collapse Functions
function toggleStatCard(card) {
    card.classList.toggle('expanded');
}

function toggleBrandCard(card) {
    card.classList.toggle('expanded');
}

function toggleLowBrandCard(card) {
    card.classList.toggle('expanded');
}

function toggleMainCategory(header) {
    const mainCategory = header.closest('.main-category');
    mainCategory.classList.toggle('expanded');
}

function toggleSubCategory(header) {
    const subCategory = header.closest('.sub-category');
    subCategory.classList.toggle('expanded');
}

// Dashboard Functions
function refreshDashboard() {
    let moduleItems = items;
    let totalItems = moduleItems.length;
    let totalStock = moduleItems.reduce((sum, i) => sum + (i.stock || 0), 0);
    let totalKg = moduleItems.reduce((sum, i) => sum + ((i.stock || 0) * (i.weight || 0)), 0);

    // Low stock items by brand
    let lowStockByBrand = {};
    moduleItems.forEach(item => {
        let main = mainCategories.find(m => m.id == item.mainId);
        let min = item.minStock || main?.lowStockLimit || 10;
        if (parseInt(item.stock) <= parseInt(min)) {
            if (main) {
                if (!lowStockByBrand[main.id]) {
                    lowStockByBrand[main.id] = { name: main.name, count: 0 };
                }
                lowStockByBrand[main.id].count++;
            }
        }
    });

    let lowStockHtml = '';
    for (let brandId in lowStockByBrand) {
        lowStockHtml += `<div class="stat-expand-item"><span>${lowStockByBrand[brandId].name}</span><span>${lowStockByBrand[brandId].count} items</span></div>`;
    }

    document.getElementById('dashboardStats').innerHTML = `
                <div class="stat-card" onclick="toggleStatCard(this)">
                    <h3>Total Items</h3>
                    <div class="number">${totalItems}</div>
                    <div class="stat-expand">
                        <div class="stat-expand-item"><span>Active Items</span><span>${totalItems}</span></div>
                    </div>
                </div>
                <div class="stat-card" onclick="toggleStatCard(this)">
                    <h3>Total Stock</h3>
                    <div class="number">${totalStock} PCS</div>
                    <div class="sub">${totalKg.toFixed(2)} KG</div>
                    <div class="stat-expand">
                        <div class="stat-expand-item"><span>Total Pieces</span><span>${totalStock}</span></div>
                        <div class="stat-expand-item"><span>Total Weight</span><span>${totalKg.toFixed(2)} KG</span></div>
                    </div>
                </div>
                <div class="stat-card" onclick="toggleStatCard(this)">
                    <h3>Low Stock</h3>
                    <div class="number">${moduleItems.filter(i => i.stock <= (i.minStock || 10)).length}</div>
                    <div class="stat-expand">
                        ${lowStockHtml || '<div class="stat-expand-item">No low stock items</div>'}
                    </div>
                </div>
            `;

    // Brand Cards with Collapse
    let brandCardsHtml = '';
    sortMainCategories(mainCategories).forEach(main => {
        let brandItems = items.filter(i => i.mainId == main.id);
        let totalBrandStock = brandItems.reduce((sum, i) => sum + (parseInt(i.stock) || 0), 0);
        let totalBrandKg = brandItems.reduce((sum, i) => sum + ((parseInt(i.stock) || 0) * (parseFloat(i.weight) || 0)), 0);

        let itemsHtml = '';
        sortItems(brandItems).forEach(item => {
            let sub = subCategories.find(s => s.id == item.subId);
            let sizeName = sub ? sub.name.replace(/[^0-9.]/g, '') : '?';
            itemsHtml += `
                        <div class="stock-item">
                            <div class="item-info">
                                <span class="item-size">${sizeName}"</span>
                                <span class="item-details">${item.length}ft / ${item.weight}KG</span>
                            </div>
                            <span class="item-qty">${item.stock || 0}</span>
                        </div>
                    `;
        });

        brandCardsHtml += `
                    <div class="brand-card" id="brandCard_${main.id}">
                        <div class="brand-header" style="background: ${main.color};" onclick="toggleBrandCard(document.getElementById('brandCard_${main.id}'))">
                            <h4>${main.name}</h4>
                            <span class="brand-total">${totalBrandStock} PCS | ${totalBrandKg.toFixed(2)} KG</span>
                        </div>
                        <div class="brand-body">
                            ${itemsHtml}
                        </div>
                    </div>
                `;
    });
    document.getElementById('brandStockCards').innerHTML = brandCardsHtml;

    // Pending orders quantities
    let orderedQtys = {};
    orders.filter(o => o.status === 'pending' || o.status === 'processing').forEach(order => {
        (order.items || []).forEach(item => {
            if (moduleItems.some(i => i.id === item.itemId)) {
                orderedQtys[item.itemId] = (orderedQtys[item.itemId] || 0) + (item.quantity || 0);
            }
        });
    });

    // Stock Comparison Table
    let comparisonRows = '';
    moduleItems.forEach(item => {
        let main = mainCategories.find(m => m.id === item.mainId);
        let sub = subCategories.find(s => s.id === item.subId);
        if (!main || !sub) return;

        let ordered = orderedQtys[item.id] || 0;
        let remaining = (item.stock || 0) - ordered;
        let size = sub.name.replace(/[^0-9.]/g, '');

        comparisonRows += `<tr>
                    <td><span style="color:${main.color};">${main.name}</span></td>
                    <td>${size}"</td>
                    <td>${item.length}ft / ${item.weight}KG</td>
                    <td>${item.stock || 0}</td>
                    <td>${ordered}</td>
                    <td style="color: ${remaining >= 0 ? '#16a34a' : '#dc2626'};">${remaining}</td>
                </tr>`;
    });
    document.getElementById('stockComparisonBody').innerHTML = comparisonRows;
}

function refreshStockList() {
    const search = (document.getElementById('stockSearch')?.value || '').toLowerCase();
    const fromDate = document.getElementById('stockDateFrom')?.value;
    const toDate = document.getElementById('stockDateTo')?.value;

    let orderedQtys = {};
    orders.filter(o => {
        const s = (o.status || '').toLowerCase();
        const isPending = s === 'pending' || s === 'processing';
        const inDateRange = (!fromDate || new Date(o.date) >= new Date(fromDate)) &&
                           (!toDate || new Date(o.date) <= new Date(toDate));
        return isPending && inDateRange;
    }).forEach(order => {
        (order.items || []).forEach(item => {
            orderedQtys[item.itemId] = (orderedQtys[item.itemId] || 0) + (parseInt(item.quantity) || 0);
        });
    });

    let brandCardsHtml = '';
    sortMainCategories(mainCategories).forEach(main => {
        const brandMatches = main.name.toLowerCase().includes(search);
        let brandItems = items.filter(i => i.mainId == main.id);
        let totalBrandStock = 0;
        let totalKg = 0;
        let totalInOrder = 0;

        let itemsHtml = '<table class="data-table" style="margin: 0; width: 100%; border-collapse: collapse; font-size: 0.95rem;">';
        itemsHtml += '<thead><tr>';
        itemsHtml += '<th style="padding: 0.8rem; border-bottom: 2px solid var(--gray-300); background: var(--gray-100);">Size</th>';
        itemsHtml += '<th style="padding: 0.8rem; border-bottom: 2px solid var(--gray-300); background: var(--gray-100);">Description</th>';
        itemsHtml += '<th style="padding: 0.8rem; border-bottom: 2px solid var(--gray-300); background: var(--gray-100); text-align: center;">Available</th>';
        itemsHtml += '<th style="padding: 0.8rem; border-bottom: 2px solid var(--gray-300); background: var(--gray-100); text-align: center;">In Order</th>';
        itemsHtml += '<th style="padding: 0.8rem; border-bottom: 2px solid var(--gray-300); background: var(--gray-100); text-align: center;">Result</th>';
        itemsHtml += '</tr></thead><tbody>';

        let hasVisibleItems = false;
        sortItems(brandItems).forEach(item => {
            let sub = subCategories.find(s => s.id == item.subId);
            let sizeName = sub ? sub.name.replace(/[^0-9.]/g, '') : '?';
            
            // Smart Search logic (e.g. "2m" matches 2" and Brand starting with M)
            const itemKey = (sizeName + main.name.charAt(0)).toLowerCase();
            const fullMatch = (main.name + " " + sizeName).toLowerCase();
            const isMatch = search === '' || brandMatches || sizeName.includes(search) || itemKey.includes(search) || fullMatch.includes(search);

            if (!isMatch) return;
            hasVisibleItems = true;

            let weightVal = parseFloat(item.weight) || 0;
            let desc = `${sizeName}"( ${weightVal.toFixed(1)} ) Kg`;
            let available = item.stock || 0;
            let inOrder = orderedQtys[item.id] || 0;
            let result = available - inOrder;

            totalBrandStock += available;
            totalKg += available * (item.weight || 0);
            totalInOrder += inOrder;

            let resColor = result === 0 ? 'var(--gray-500)' : (result < 0 ? '#ef4444' : 'var(--green-600)');
            let ioColor = inOrder === 0 ? 'var(--gray-500)' : '#dc2626';

            itemsHtml += `
                        <tr style="background: white;">
                            <td style="padding: 0.8rem; border-bottom: 1px solid var(--gray-200);"><strong>${sizeName}"</strong></td>
                            <td style="padding: 0.8rem; border-bottom: 1px solid var(--gray-200); color: var(--gray-700);">${desc}</td>
                            <td style="padding: 0.8rem; border-bottom: 1px solid var(--gray-200); text-align:center; font-weight:600; color:var(--orange-500);">${available}</td>
                            <td style="padding: 0.8rem; border-bottom: 1px solid var(--gray-200); text-align:center; font-weight:600; color:${ioColor};">${inOrder}</td>
                            <td style="padding: 0.8rem; border-bottom: 1px solid var(--gray-200); text-align:center; font-weight:700; color:${resColor};">${result}</td>
                        </tr>
                    `;
        });

        itemsHtml += '</tbody></table>';

        if (hasVisibleItems) {
            let totalResult = totalBrandStock - totalInOrder;
            brandCardsHtml += `
                        <div class="brand-card expanded" id="stockCard_${main.id}">
                            <div class="brand-header" style="background: ${main.color};" onclick="toggleBrandCard(document.getElementById('stockCard_${main.id}'))">
                                <h4>${main.name}</h4>
                                <span class="brand-total">Total: ${totalBrandStock} | Order: ${totalInOrder} | Res: ${totalResult}</span>
                            </div>
                            <div class="brand-body" style="padding:0;">
                                ${itemsHtml}
                            </div>
                        </div>
                    `;
        }
    });

    const listContainer = document.getElementById('stockListCards');
    if (listContainer) {
        listContainer.innerHTML = brandCardsHtml || '<div style="text-align:center; padding:3rem; color:var(--gray-500);">No items match your search or date range.</div>';
    }
}

function clearStockFilters() {
    document.getElementById('stockSearch').value = '';
    document.getElementById('stockDateFrom').value = '';
    document.getElementById('stockDateTo').value = '';
    refreshStockList();
}

function refreshAuditList() {
    const search = (document.getElementById('auditSearch')?.value || '').toLowerCase();
    const fromDate = document.getElementById('auditDateFrom')?.value;
    const toDate = document.getElementById('auditDateTo')?.value;
    const auditPrintDate = document.getElementById('auditPrintDate');
    if (auditPrintDate) auditPrintDate.textContent = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    // Calculate pending orders within date range
    let orderedQtys = {};
    orders.filter(o => {
        const s = (o.status || '').toLowerCase();
        const isPending = s === 'pending' || s === 'processing';
        const inDateRange = (!fromDate || new Date(o.date) >= new Date(fromDate)) &&
                           (!toDate || new Date(o.date) <= new Date(toDate));
        return isPending && inDateRange;
    }).forEach(order => {
        (order.items || []).forEach(item => {
            orderedQtys[item.itemId] = (orderedQtys[item.itemId] || 0) + (parseInt(item.quantity) || 0);
        });
    });

    let html = '';
    sortMainCategories(mainCategories).forEach(main => {
        let brandItems = items.filter(i => i.mainId == main.id);
        const brandMatches = main.name.toLowerCase().includes(search);
        
        // Group items by size
        let sizeGroups = {};
        brandItems.forEach(item => {
            let sub = subCategories.find(s => s.id == item.subId);
            let sizeName = sub ? sub.name.replace(/[^0-9.]/g, '') : '?';
            const isMatch = search === '' || brandMatches || sizeName.includes(search);
            if (!isMatch) return;

            if (!sizeGroups[sizeName]) sizeGroups[sizeName] = [];
            sizeGroups[sizeName].push(item);
        });

        let rowsHtml = '';
        let bSysPcs = 0, bSysKg = 0;
        
        // Sort sizes numerically
        const sortedSizes = Object.keys(sizeGroups).sort((a, b) => parseFloat(a) - parseFloat(b));

        sortedSizes.forEach(sizeName => {
            const group = sortItems(sizeGroups[sizeName]);
            group.forEach((item, index) => {
                let weightVal = parseFloat(item.weight) || 0;
                let systemPcs = parseInt(item.stock) || 0;
                let ordered = orderedQtys[item.id] || 0;
                let effectivePcs = systemPcs - ordered; // The stock that should be there
                let systemKg = (effectivePcs * weightVal).toFixed(2);
                
                // Load from persistence
                let godownPcs = auditSession[item.id] || "";
                let weightValNum = parseFloat(weightVal);
                let godownKg = godownPcs !== "" ? (parseInt(godownPcs) * weightValNum).toFixed(2) : "0.00";
                let diffPcs = godownPcs !== "" ? (parseInt(godownPcs) - effectivePcs) : 0;
                let diffKg = godownPcs !== "" ? (diffPcs * weightValNum).toFixed(2) : "0.00";
                let diffClass = diffPcs === 0 ? '' : (diffPcs > 0 ? 'diff-plus' : 'diff-minus');
                
                bSysPcs += effectivePcs;
                bSysKg += parseFloat(systemKg);

                rowsHtml += `
                    <tr id="auditRow_${item.id}" data-unit-weight="${weightVal}" data-brand-id="${main.id}">
                        ${index === 0 ? `<td rowspan="${group.length}" style="font-weight:700; background: var(--gray-50); font-size: 1.1rem; border-right: 2px solid var(--gray-300);">${sizeName}"</td>` : ''}
                        <td>${weightVal.toFixed(2)} KG</td>
                        <td style="color:${main.color}; font-weight:600;">${main.name}</td>
                        <td id="auditSysPcs_${item.id}" class="sys-pcs-val">${effectivePcs}</td>
                        <td id="auditSysKg_${item.id}" class="sys-kg-val">${systemKg}</td>
                        <td>
                            <input type="number" step="1" class="godown-input audit-input-${main.id}" 
                                   placeholder="0"
                                   value="${godownPcs}"
                                   oninput="calculateAuditRow(${item.id}, ${weightVal}, ${main.id})" 
                                   id="auditGodownPcs_${item.id}">
                        </td>
                        <td id="auditGodownKg_${item.id}" class="godown-kg-val">${godownKg}</td>
                        <td id="auditDiffPcs_${item.id}" class="diff-pcs-val ${diffClass}">${godownPcs !== "" ? (diffPcs > 0 ? '+' : '') + diffPcs : "0"}</td>
                        <td id="auditDiffKg_${item.id}" class="diff-kg-val ${diffClass}">${godownPcs !== "" ? (diffPcs > 0 ? '+' : '') + diffKg : "0.00"}</td>
                    </tr>
                `;
            });
        });

        if (rowsHtml) {
            html += `
                <div class="audit-group" style="margin-bottom: 2rem;">
                    <div class="audit-brand-header" style="background:${main.color};">
                        <span>${main.name} Audit</span>
                        <span style="font-size:0.85rem; font-weight:400;">Total Sizes: ${sortedSizes.length}</span>
                    </div>
                    <table class="audit-table">
                        <thead>
                            <tr>
                                <th rowspan="2">Size</th>
                                <th rowspan="2">KG/Pcs</th>
                                <th rowspan="2">Brand</th>
                                <th colspan="2" style="background: var(--sky-50);">Result Stock (System)</th>
                                <th colspan="2" style="background: var(--orange-50);">Godown Stock (Manual)</th>
                                <th colspan="2" style="background: var(--green-50);">Difference</th>
                            </tr>
                            <tr>
                                <th style="background: var(--sky-50);">Pieces</th>
                                <th style="background: var(--sky-50);">KG</th>
                                <th style="background: var(--orange-50);">Pieces</th>
                                <th style="background: var(--orange-50);">KG</th>
                                <th style="background: var(--green-50);">Pcs +/-</th>
                                <th style="background: var(--green-50);">KG +/-</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                        <tfoot>
                            <tr style="background: var(--gray-100); font-weight: 800;">
                                <td colspan="3" style="text-align: right; padding-right: 1.5rem;">${main.name} TOTAL:</td>
                                <td id="totalSysPcs_${main.id}">${bSysPcs}</td>
                                <td id="totalSysKg_${main.id}">${bSysKg.toFixed(2)}</td>
                                <td id="totalGodownPcs_${main.id}">0</td>
                                <td id="totalGodownKg_${main.id}">0.00</td>
                                <td id="totalDiffPcs_${main.id}">0</td>
                                <td id="totalDiffKg_${main.id}">0.00</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            `;
        }
    });

    const auditContainer = document.getElementById('auditListContainer');
    if (auditContainer) {
        auditContainer.innerHTML = html || '<p style="text-align:center; padding:3rem; color:var(--gray-500);">No brands or sizes found.</p>';
        
        // Safety: Initialize totals for visible brands only
        sortMainCategories(mainCategories).forEach(m => {
            const hasInput = document.querySelector(`.audit-input-${m.id}`);
            if (hasInput) updateBrandAuditTotals(m.id);
        });
    }
}

function calculateAuditRow(itemId, unitWeight, brandId) {
    const sysPcs = parseInt(document.getElementById(`auditSysPcs_${itemId}`).textContent) || 0;
    const godownPcsInput = document.getElementById(`auditGodownPcs_${itemId}`);
    const godownPcsStr = godownPcsInput.value;
    const godownPcs = parseInt(godownPcsStr) || 0;
    
    // Auto KG Calculation
    const godownKg = (godownPcs * unitWeight).toFixed(2);
    document.getElementById(`auditGodownKg_${itemId}`).textContent = godownKg;
    
    // Difference Calculation
    const diffPcs = godownPcs - sysPcs;
    const diffKg = (diffPcs * unitWeight).toFixed(2);
    
    const diffPcsEl = document.getElementById(`auditDiffPcs_${itemId}`);
    const diffKgEl = document.getElementById(`auditDiffKg_${itemId}`);
    
    // Save to persistence
    auditSession[itemId] = godownPcsStr;
    localStorage.setItem('stock_auditSession', JSON.stringify(auditSession));
    
    diffPcsEl.textContent = (diffPcs > 0 ? '+' : '') + diffPcs;
    diffKgEl.textContent = (diffPcs > 0 ? '+' : '') + diffKg;
    
    // Color coding
    diffPcsEl.className = diffPcs === 0 ? 'diff-pcs-val' : (diffPcs > 0 ? 'diff-pcs-val diff-plus' : 'diff-pcs-val diff-minus');
    diffKgEl.className = diffPcs === 0 ? 'diff-kg-val' : (diffPcs > 0 ? 'diff-kg-val diff-plus' : 'diff-kg-val diff-minus');

    // Update Brand Sub-totals
    updateBrandAuditTotals(brandId);
}

function updateBrandAuditTotals(brandId) {
    const brandGroup = document.querySelector(`.audit-input-${brandId}`)?.closest('.audit-group');
    if (!brandGroup) return;

    let sysTotalPcs = 0, sysTotalKg = 0;
    let godownTotalPcs = 0, godownTotalKg = 0;
    let diffTotalPcs = 0, diffTotalKg = 0;

    brandGroup.querySelectorAll('tbody tr').forEach(row => {
        const itemId = row.id.split('_')[1];
        const sysPcsEl = document.getElementById(`auditSysPcs_${itemId}`);
        const sysKgEl = document.getElementById(`auditSysKg_${itemId}`);
        const gdPcsEl = document.getElementById(`auditGodownPcs_${itemId}`);
        const gdKgEl = document.getElementById(`auditGodownKg_${itemId}`);
        const dPcsEl = document.getElementById(`auditDiffPcs_${itemId}`);
        const dKgEl = document.getElementById(`auditDiffKg_${itemId}`);

        if (sysPcsEl && gdPcsEl) {
            sysTotalPcs += parseInt(sysPcsEl.textContent) || 0;
            sysTotalKg += parseFloat(sysKgEl.textContent) || 0;
            godownTotalPcs += parseInt(gdPcsEl.value) || 0;
            godownTotalKg += parseFloat(gdKgEl.textContent) || 0;
            
            let dPcs = parseInt(dPcsEl.textContent.replace('+', '')) || 0;
            let dKg = parseFloat(dKgEl.textContent.replace('+', '')) || 0;
            diffTotalPcs += dPcs;
            diffTotalKg += dKg;
        }
    });

    const totSysPcs = document.getElementById(`totalSysPcs_${brandId}`);
    const totSysKg = document.getElementById(`totalSysKg_${brandId}`);
    const totGdPcs = document.getElementById(`totalGodownPcs_${brandId}`);
    const totGdKg = document.getElementById(`totalGodownKg_${brandId}`);
    const totDiffPcs = document.getElementById(`totalDiffPcs_${brandId}`);
    const totDiffKg = document.getElementById(`totalDiffKg_${brandId}`);

    if (totSysPcs) totSysPcs.textContent = sysTotalPcs;
    if (totSysKg) totSysKg.textContent = sysTotalKg.toFixed(2);
    if (totGdPcs) totGdPcs.textContent = godownTotalPcs;
    if (totGdKg) totGdKg.textContent = godownTotalKg.toFixed(2);
    
    if (totDiffPcs) {
        totDiffPcs.textContent = (diffTotalPcs > 0 ? '+' : '') + diffTotalPcs;
        totDiffPcs.className = diffTotalPcs === 0 ? '' : (diffTotalPcs > 0 ? 'diff-plus' : 'diff-minus');
    }
    if (totDiffKg) {
        totDiffKg.textContent = (diffTotalKg > 0 ? '+' : '') + diffTotalKg.toFixed(2);
        totDiffKg.className = diffTotalKg === 0 ? '' : (diffTotalKg > 0 ? 'diff-plus' : 'diff-minus');
    }
}

async function saveMonthlyAudit() {
    const inputs = document.querySelectorAll('.godown-input');
    let itemsToUpdate = [];
    let auditRecords = [];

    inputs.forEach(input => {
        const val = input.value.trim();
        if (val !== "" && val !== "0") {
            const itemId = parseInt(input.id.replace('auditGodownPcs_', ''));
            const newStock = parseInt(val) || 0;
            const sysStock = parseInt(document.getElementById(`auditSysPcs_${itemId}`).textContent) || 0;
            
            itemsToUpdate.push({ id: itemId, stock: newStock });
            auditRecords.push({
                itemId: itemId,
                systemQty: sysStock,
                godownQty: newStock,
                diffQty: newStock - sysStock
            });
        }
    });

    if (itemsToUpdate.length === 0) {
        alert('No godown counts entered to save.');
        return;
    }

    if (!confirm(`Are you sure you want to Save Audit and Update SQL for ${itemsToUpdate.length} items?`)) {
        return;
    }

    // Save to SQL
    try {
        const response = await fetch('api/sync.php?action=save_audit', {
            method: 'POST',
            body: JSON.stringify({ records: auditRecords })
        });
        const result = await response.json();
        
        if (result.status === 'success') {
            saveData(); // Sync local (backup)
            alert(`✅ Audit saved as a report!\nLive system stock was NOT changed.`);
            refreshAuditList();
        } else {
            alert('Error saving audit: ' + result.message);
        }
    } catch (e) {
        console.error('Audit save failed:', e);
        alert('Server connection failed. Audit not saved.');
    }
}

function resetAuditSession() {
    if (confirm('Clear ALL Godown Stock manual entries? This cannot be undone.')) {
        auditSession = {};
        localStorage.removeItem('stock_auditSession');
        refreshAuditList();
    }
}

function clearAuditFilters() {
    if (document.getElementById('auditSearch')) document.getElementById('auditSearch').value = '';
    if (document.getElementById('auditDateFrom')) document.getElementById('auditDateFrom').value = '';
    if (document.getElementById('auditDateTo')) document.getElementById('auditDateTo').value = '';
    refreshAuditList();
}

function refreshLowStockReport() {
    // Group low stock items by brand
    let lowByBrand = {};
    items.forEach(item => {
        let main = mainCategories.find(m => m.id === item.mainId);
        let min = item.minStock || main?.lowStockLimit || 10;
        if (item.stock <= min) {
            if (!lowByBrand[main.id]) {
                lowByBrand[main.id] = {
                    name: main.name,
                    color: main.color,
                    items: []
                };
            }
            lowByBrand[main.id].items.push(item);
        }
    });

    let lowCardsHtml = '';
    if (Object.keys(lowByBrand).length === 0) {
        lowCardsHtml = '<p style="text-align:center; color:var(--green-600);">✅ All items have sufficient stock</p>';
    } else {
        for (let brandId in lowByBrand) {
            let brand = lowByBrand[brandId];
            let itemsHtml = '';
            brand.items.forEach(item => {
                let sub = subCategories.find(s => s.id === item.subId);
                let min = item.minStock || mainCategories.find(m => m.id === item.mainId)?.lowStockLimit || 10;
                let stockPercent = (item.stock / min) * 100;
                let status = stockPercent <= 30 ? 'critical' : 'warning';
                let size = sub ? sub.name.replace(/[^0-9.]/g, '') : '?';

                itemsHtml += `
                            <div class="low-item ${status}">
                                <span>${size}" / ${item.length}ft / ${item.weight}KG</span>
                                <span><strong>${item.stock}</strong> / ${min}</span>
                            </div>
                        `;
            });

            lowCardsHtml += `
                        <div class="low-brand-card" id="lowCard_${brandId}">
                            <div class="low-brand-header" onclick="toggleLowBrandCard(document.getElementById('lowCard_${brandId}'))">
                                <h5 style="color:${brand.color};">${brand.name}</h5>
                                <span>${brand.items.length} items</span>
                            </div>
                            <div class="low-brand-body">
                                ${itemsHtml}
                            </div>
                        </div>
                    `;
        }
    }
    document.getElementById('lowStockCards').innerHTML = lowCardsHtml;
}

// Print Functions
function printStockList() {
    const company = companySettings.name || 'StockFlow';
    const logo = companySettings.logo || '📦';
    const date = new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.getElementById('printCompanyName').textContent = company;
    const printLogo = document.getElementById('printLogo');
    if (printLogo) printLogo.innerHTML = logo;
    document.getElementById('printDate').textContent = `Report Date: ${date}`;
    window.print();
}

function printLowStock() {
    window.print();
}

// Row Creation Functions
function addProductionRow() {
    const row = document.createElement('div');
    row.className = 'entry-row';
    const brandOptions = mainCategories.map(m => ({ value: m.id, text: m.name }));
    const brandWrapper = createSearchableInput('Brand...', brandOptions, (opt) => {
        row.dataset.brandId = opt.value;
        updateSizeDropdown(row, opt.value, 'production');
    }, false, 'brand');
    const sizeWrapper = createSearchableInput('Size...', [], null, true, null);
    const itemWrapper = createSearchableInput('Item...', [], null, true, null);

    const lengthInput = document.createElement('input');
    lengthInput.type = 'number';
    lengthInput.className = 'searchable-input';
    lengthInput.placeholder = 'Length';
    lengthInput.value = '13';

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.className = 'searchable-input';
    qtyInput.placeholder = 'Qty';
    qtyInput.min = '1';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-danger btn-sm';
    removeBtn.textContent = '✖';
    removeBtn.onclick = () => row.remove();

    row.appendChild(brandWrapper);
    row.appendChild(sizeWrapper);
    row.appendChild(itemWrapper);
    row.appendChild(lengthInput);
    row.appendChild(qtyInput);
    row.appendChild(removeBtn);

    document.getElementById('productionRows').appendChild(row);
}

function addSaleRow() {
    const row = document.createElement('div');
    row.className = 'entry-row';
    const brandOptions = mainCategories.map(m => ({ value: m.id, text: m.name }));
    const brandWrapper = createSearchableInput('Brand...', brandOptions, (opt) => {
        row.dataset.brandId = opt.value;
        updateSizeDropdown(row, opt.value, 'sale');
    }, false, 'brand');
    const sizeWrapper = createSearchableInput('Size...', [], null, true, null);
    const itemWrapper = createSearchableInput('Item...', [], null, true, null);

    const lengthInput = document.createElement('input');
    lengthInput.type = 'number';
    lengthInput.className = 'searchable-input';
    lengthInput.placeholder = 'Length';
    lengthInput.value = '13';

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.className = 'searchable-input';
    qtyInput.placeholder = 'Qty';
    qtyInput.min = '1';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-danger btn-sm';
    removeBtn.textContent = '✖';
    removeBtn.onclick = () => row.remove();

    row.appendChild(brandWrapper);
    row.appendChild(sizeWrapper);
    row.appendChild(itemWrapper);
    row.appendChild(lengthInput);
    row.appendChild(qtyInput);
    row.appendChild(removeBtn);

    document.getElementById('saleRows').appendChild(row);
}

function addAdjustmentRow() {
    const row = document.createElement('div');
    row.className = 'entry-row';
    const brandOptions = mainCategories.map(m => ({ value: m.id, text: m.name }));
    const brandWrapper = createSearchableInput('Brand...', brandOptions, (opt) => {
        row.dataset.brandId = opt.value;
        updateSizeDropdown(row, opt.value, 'adjustment');
    }, false, 'brand');
    const sizeWrapper = createSearchableInput('Size...', [], null, true, null);
    const itemWrapper = createSearchableInput('Item...', [], null, true, null);

    const lengthInput = document.createElement('input');
    lengthInput.type = 'number';
    lengthInput.className = 'searchable-input';
    lengthInput.placeholder = 'Length';
    lengthInput.value = '13';

    const typeSelect = document.createElement('select');
    typeSelect.className = 'searchable-input';
    typeSelect.innerHTML = `
                <option value="add">➕ Add</option>
                <option value="remove">➖ Remove</option>
            `;

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.className = 'searchable-input';
    qtyInput.placeholder = 'Qty';
    qtyInput.min = '1';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-danger btn-sm';
    removeBtn.textContent = '✖';
    removeBtn.onclick = () => row.remove();

    row.appendChild(brandWrapper);
    row.appendChild(sizeWrapper);
    row.appendChild(itemWrapper);
    row.appendChild(lengthInput);
    row.appendChild(typeSelect);
    row.appendChild(qtyInput);
    row.appendChild(removeBtn);

    document.getElementById('adjustmentRows').appendChild(row);
}

function addNewOrderRow() {
    const row = document.createElement('div');
    row.className = 'entry-row';
    const brandOptions = mainCategories.map(m => ({ value: m.id, text: m.name }));
    const brandWrapper = createSearchableInput('Brand...', brandOptions, (opt) => {
        row.dataset.brandId = opt.value;
        updateSizeDropdown(row, opt.value, 'order');
    }, false, 'brand');
    const sizeWrapper = createSearchableInput('Size...', [], null, true, null);
    const itemWrapper = createSearchableInput('Item...', [], null, true, null);

    const lengthInput = document.createElement('input');
    lengthInput.type = 'number';
    lengthInput.className = 'searchable-input';
    lengthInput.placeholder = 'Length';
    lengthInput.value = '13';

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.className = 'searchable-input';
    qtyInput.placeholder = 'Qty';
    qtyInput.min = '1';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-danger btn-sm';
    removeBtn.textContent = '✖';
    removeBtn.onclick = () => row.remove();

    row.appendChild(brandWrapper);
    row.appendChild(sizeWrapper);
    row.appendChild(itemWrapper);
    row.appendChild(lengthInput);
    row.appendChild(qtyInput);
    row.appendChild(removeBtn);

    document.getElementById('newOrderRows').appendChild(row);
}

function updateSizeDropdown(row, brandId, type) {
    const sizeWrapper = row.children[1];
    const itemWrapper = row.children[2];
    const sizeOptions = subCategories
        .filter(s => s.mainId == brandId)
        .map(s => ({ value: s.id, text: s.name }));

    const newSizeWrapper = createSearchableInput('Size...', sizeOptions, (opt) => {
        row.dataset.sizeId = opt.value;
        updateItemDropdown(row, brandId, opt.value, type);
    }, false, 'size', brandId);

    row.replaceChild(newSizeWrapper, sizeWrapper);
    const newItemWrapper = createSearchableInput('Item...', [], null, true, null);
    row.replaceChild(newItemWrapper, itemWrapper);
}

function updateItemDropdown(row, brandId, sizeId, type) {
    const itemWrapper = row.children[2];
    const lengthInput = row.children[3];

    const itemOptions = items
        .filter(i => i.mainId == brandId && i.subId == sizeId)
        .map(i => ({
            value: i.id,
            text: `${i.name || 'Item'} (${i.length}ft ${i.weight}KG)`,
            stock: i.stock || 0,
            minStock: i.minStock || mainCategories.find(m => m.id === brandId)?.lowStockLimit || 10,
            length: i.length,
            weight: i.weight,
            item: i
        }));

    const newItemWrapper = createSearchableInput('Item...', itemOptions, (opt) => {
        row.dataset.itemId = opt.value;
        row.dataset.itemName = opt.item.name;
        row.dataset.itemWeight = opt.item.weight;
        row.dataset.itemLength = opt.item.length;
        lengthInput.value = opt.item.length;
    }, false, null);
    row.replaceChild(newItemWrapper, itemWrapper);
}

// Save Functions
function showProductionEntry() {
    hideAllForms();
    document.getElementById('productionForm').style.display = 'block';
    let now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('prodDate').value = now.toISOString().slice(0, 16);
    document.getElementById('productionRows').innerHTML = '';
    addProductionRow();
}

function showSaleEntry() {
    hideAllForms();
    let wrapper = document.getElementById('saleCustomerWrapper');
    wrapper.innerHTML = '';
    let customerIdInput = document.createElement('input');
    customerIdInput.type = 'hidden';
    customerIdInput.id = 'saleCustomerId';
    wrapper.appendChild(customerIdInput);

    let customerSearch = createCustomerSearchable('Search customer...', (cust) => {
        document.getElementById('saleCustomerId').value = cust.id;
    });
    wrapper.appendChild(customerSearch);

    document.getElementById('saleForm').style.display = 'block';
    let now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('saleDate').value = now.toISOString().slice(0, 16);
    document.getElementById('saleRows').innerHTML = '';
    refreshCompletedOrderDropdown();
    addSaleRow();
}

function showAdjustmentEntry() {
    hideAllForms();
    document.getElementById('adjustmentForm').style.display = 'block';
    let now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('adjDate').value = now.toISOString().slice(0, 16);
    document.getElementById('adjustmentRows').innerHTML = '';
    addAdjustmentRow();
}

function showNewOrderForm() {
    let wrapper = document.getElementById('newCustomerWrapper');
    wrapper.innerHTML = '';
    let customerIdInput = document.createElement('input');
    customerIdInput.type = 'hidden';
    customerIdInput.id = 'newCustomerId';
    wrapper.appendChild(customerIdInput);

    let customerSearch = createCustomerSearchable('Search customer...', (cust) => {
        document.getElementById('newCustomerId').value = cust.id;
    });
    wrapper.appendChild(customerSearch);

    document.getElementById('newOrderForm').style.display = 'block';
    let now = new Date(); now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('orderDate').value = now.toISOString().slice(0, 16);
    document.getElementById('newOrderRows').innerHTML = '';
    addNewOrderRow();
}

function hideNewOrderForm() {
    document.getElementById('newOrderForm').style.display = 'none';
}

function hideAllForms() {
    document.getElementById('productionForm').style.display = 'none';
    document.getElementById('saleForm').style.display = 'none';
    document.getElementById('adjustmentForm').style.display = 'none';
}

async function saveProduction() {
    let rows = document.getElementById('productionRows').children;
    if (rows.length === 0) { alert('Add at least one item'); return; }
    let errors = [];
    let prodDate = document.getElementById('prodDate').value;

    for (let row of rows) {
        const itemId = row.dataset.itemId;
        const lengthInput = row.children[3];
        const qtyInput = row.children[4];
        const qty = parseInt(qtyInput ? qtyInput.value : 0);
        const length = parseInt(lengthInput ? lengthInput.value : 13);

        if (!itemId) { errors.push('Select item'); continue; }
        if (!qty || qty <= 0) { errors.push('Enter quantity'); continue; }
        let item = items.find(i => i.id == itemId);
        if (!item) { errors.push('Item not found'); continue; }

        if (length && length > 0) item.length = length;

        let main = mainCategories.find(m => m.id === item.mainId);
        let sub = subCategories.find(s => s.id === item.subId);

        let tData = {
            type: 'PRODUCTION',
            date: prodDate,
            mainId: item.mainId,
            subId: item.subId,
            itemId: itemId,
            quantity: qty,
            notes: 'Production'
        };

        try {
            const response = await fetch('api/sync.php?action=save_transaction', {
                method: 'POST',
                body: JSON.stringify({ transaction: tData })
            });
            const result = await response.json();
            if (result.status === 'success') {
                item.stock = (item.stock || 0) + qty;
                transactions.unshift({
                    id: result.id,
                    ...tData,
                    mainName: main ? main.name : '',
                    subName: sub ? sub.name : '',
                    productCode: getProductCode(item, main, sub),
                    itemName: item.name,
                    weight: item.weight,
                    length: item.length,
                    customer: 'Factory'
                });
            } else {
                errors.push(`Failed to save ${item.name}: ${result.message}`);
            }
        } catch (e) {
            errors.push(`Server error for ${item.name}`);
        }
    }

    if (errors.length > 0) alert('Errors:\n' + errors.join('\n'));
    saveData(); refreshTransactions(); refreshDashboard(); refreshStockList(); refreshLowStockReport(); hideAllForms();
    alert('Process complete.');
}

async function saveSale() {
    let customerId = document.getElementById('saleCustomerId').value;
    let customer = customers.find(c => c.id == customerId);
    if (!customer) { alert('Select customer'); return; }
    
    let customerName = customer.name + ' (' + customer.uniqueId + ')';
    let rows = document.getElementById('saleRows').children;
    if (rows.length === 0) { alert('Add at least one item'); return; }
    let errors = [];
    let saleDate = document.getElementById('saleDate').value;
    let selectedOrderId = document.getElementById('saleOrderSelect').value;

    for (let row of rows) {
        const itemId = row.dataset.itemId;
        const lengthInput = row.children[3];
        const qtyInput = row.children[4];
        const qty = parseInt(qtyInput ? qtyInput.value : 0);
        const length = parseInt(lengthInput ? lengthInput.value : 13);

        if (!itemId) { errors.push('Select item'); continue; }
        if (!qty || qty <= 0) { errors.push('Enter quantity'); continue; }
        let item = items.find(i => i.id == itemId);
        if (!item) { errors.push('Item not found'); continue; }

        if (length && length > 0) item.length = length;
        if (qty > (item.stock || 0)) {
            errors.push(`Insufficient stock for ${item.name}. Available: ${item.stock}`);
            continue;
        }

        let main = mainCategories.find(m => m.id === item.mainId);
        let sub = subCategories.find(s => s.id === item.subId);

        let tData = {
            type: 'SALE',
            date: saleDate,
            mainId: item.mainId,
            subId: item.subId,
            itemId: itemId,
            quantity: qty,
            customerId: customerId,
            notes: 'Sale'
        };

        try {
            const response = await fetch('api/sync.php?action=save_transaction', {
                method: 'POST',
                body: JSON.stringify({ transaction: tData })
            });
            const result = await response.json();
            if (result.status === 'success') {
                item.stock = (item.stock || 0) - qty;
                transactions.unshift({
                    id: result.id,
                    ...tData,
                    mainName: main ? main.name : '',
                    subName: sub ? sub.name : '',
                    productCode: getProductCode(item, main, sub),
                    itemName: item.name,
                    weight: item.weight,
                    length: item.length,
                    customer: customerName
                });
            } else {
                errors.push(`Failed to save ${item.name}: ${result.message}`);
            }
        } catch (e) {
            errors.push(`Server error for ${item.name}`);
        }
    }

    if (errors.length > 0) alert('Errors:\n' + errors.join('\n'));
    if (selectedOrderId) usedCompletedOrders.add(parseInt(selectedOrderId));
    
    saveData(); refreshTransactions(); refreshDashboard(); refreshStockList(); refreshLowStockReport(); hideAllForms(); refreshCompletedOrderDropdown();
    alert('Process complete.');
}

async function saveAdjustment() {
    let rows = document.getElementById('adjustmentRows').children;
    if (rows.length === 0) { alert('Add at least one item'); return; }
    let errors = [];
    let adjDate = document.getElementById('adjDate').value;

    for (let row of rows) {
        const itemId = row.dataset.itemId;
        const lengthInput = row.children[3];
        const typeSelect = row.children[4];
        const type = typeSelect ? typeSelect.value : 'add';
        const qtyInput = row.children[5];
        const qty = parseInt(qtyInput ? qtyInput.value : 0);
        const length = parseInt(lengthInput ? lengthInput.value : 13);

        if (!itemId) { errors.push('Select item'); continue; }
        if (!qty || qty <= 0) { errors.push('Enter quantity'); continue; }
        let item = items.find(i => i.id == itemId);
        if (!item) { errors.push('Item not found'); continue; }

        if (length && length > 0) item.length = length;
        if (type === 'remove' && qty > (item.stock || 0)) {
            errors.push(`Cannot remove ${qty} PCS. Available: ${item.stock}`);
            continue;
        }

        let main = mainCategories.find(m => m.id === item.mainId);
        let sub = subCategories.find(s => s.id === item.subId);
        let finalQty = type === 'add' ? qty : -qty;

        let tData = {
            type: 'ADJUSTMENT',
            date: adjDate,
            mainId: item.mainId,
            subId: item.subId,
            itemId: itemId,
            quantity: finalQty,
            notes: 'Adjustment'
        };

        try {
            const response = await fetch('api/sync.php?action=save_transaction', {
                method: 'POST',
                body: JSON.stringify({ transaction: tData })
            });
            const result = await response.json();
            if (result.status === 'success') {
                item.stock = (item.stock || 0) + finalQty;
                transactions.unshift({
                    id: result.id,
                    ...tData,
                    mainName: main ? main.name : '',
                    subName: sub ? sub.name : '',
                    productCode: getProductCode(item, main, sub),
                    itemName: item.name,
                    weight: item.weight,
                    length: item.length,
                    customer: 'Adjustment'
                });
            } else {
                errors.push(`Failed to save ${item.name}: ${result.message}`);
            }
        } catch (e) {
            errors.push(`Server error for ${item.name}`);
        }
    }

    if (errors.length > 0) alert('Errors:\n' + errors.join('\n'));
    saveData(); refreshTransactions(); refreshDashboard(); refreshStockList(); refreshLowStockReport(); hideAllForms();
    alert('Process complete.');
}

async function saveNewOrder() {
    let customerId = document.getElementById('newCustomerId').value;
    let customer = customers.find(c => c.id == customerId);
    if (!customer) { alert('Select customer'); return; }
    
    let customerName = customer.name + ' (' + customer.uniqueId + ')';
    let rows = document.getElementById('newOrderRows').children;
    let orderItems = [];
    let totalQty = 0; let totalKg = 0;
    
    for (let row of rows) {
        const itemId = row.dataset.itemId;
        const lengthInput = row.children[3];
        const qtyInput = row.children[4];
        const qty = parseInt(qtyInput ? qtyInput.value : 0);
        const length = parseInt(lengthInput ? lengthInput.value : 13);

        if (!itemId || !qty || qty <= 0) continue;
        let item = items.find(i => i.id == itemId);
        if (!item) continue;

        if (length && length > 0) item.length = length;

        let main = mainCategories.find(m => m.id === item.mainId);
        let sub = subCategories.find(s => s.id === item.subId);
        orderItems.push({
            itemId: itemId,
            mainId: item.mainId,
            subId: item.subId,
            mainName: main ? main.name : '',
            subName: sub ? sub.name : '',
            productCode: getProductCode(item, main, sub),
            itemName: item.name,
            weight: item.weight,
            length: item.length,
            quantity: qty,
            fulfilled: 0
        });
        totalQty += qty; totalKg += qty * (item.weight || 0);
    }
    if (orderItems.length === 0) { alert('Add at least one item'); return; }

    let orderData = {
        date: document.getElementById('orderDate').value,
        customerId: parseInt(customerId),
        items: orderItems,
        totalQty: totalQty,
        totalKg: totalKg,
        status: 'Pending'
    };

    try {
        const response = await fetch('api/sync.php?action=save_order', {
            method: 'POST',
            body: JSON.stringify({ order: orderData })
        });
        const result = await response.json();
        if (result.status === 'success') {
            orderData.id = result.id;
            orderData.customerName = customerName;
            orders.unshift(orderData);
            saveData();
            refreshOrdersList();
            hideNewOrderForm();
            refreshDashboard();
            refreshStockList();
            alert('Order created!');
        } else {
            alert('Error: ' + result.message);
        }
    } catch (e) {
        alert('Sync failed.');
    }
}

// Orders Functions
function refreshOrdersList(filter = 'all') {
    let html = '';
    let filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);
    if (filteredOrders.length === 0) {
        html = '<div style="text-align:center; padding:2rem;">No orders found</div>';
    } else {
        filteredOrders.forEach(order => {
            let statusColor = order.status === 'pending' ? '#ffb74d' : (order.status === 'processing' ? '#64b5f6' : '#4caf50');
            let itemsHtml = '';
            (order.items || []).forEach(item => {
                itemsHtml += `
                            <div class="order-item-row">
                                <span class="product-code">${item.productCode}</span>
                                <span>Qty: ${item.quantity} | Fulfilled: ${item.fulfilled || 0}</span>
                            </div>
                        `;
            });

            html += `
                        <div class="order-card" style="border-left-color: ${statusColor};">
                            <div class="order-header">
                                <span class="customer-name">${order.customerName}</span>
                                <span class="order-date">${formatDate(order.date)}</span>
                            </div>
                            <div class="order-items">
                                ${itemsHtml}
                            </div>
                            <div class="order-footer">
                                <span class="order-total">Total: ${order.totalQty} PCS | ${(order.totalKg || 0).toFixed(2)} KG</span>
                                <div class="order-actions">
                                    <button class="btn btn-primary btn-sm" onclick="editOrder(${order.id})">Edit</button>
                                    ${order.status !== 'completed' ? `<button class="btn btn-success btn-sm" onclick="completeOrder(${order.id})">Complete</button>` : ''}
                                    <button class="btn btn-print btn-sm" onclick="showInvoice(${order.id})">Invoice</button>
                                    <button class="btn btn-danger btn-sm" onclick="openDeleteModal(${order.id})">Delete</button>
                                </div>
                            </div>
                        </div>
                    `;
        });
    }
    document.getElementById('customerOrdersList').innerHTML = html;
}

function filterOrders(status) {
    refreshOrdersList(status);
}

function refreshCompletedOrderDropdown() {
    let select = document.getElementById('saleOrderSelect');
    if (!select) return;
    select.innerHTML = '<option value="">-- Select Completed Order --</option>';
    let completedOrders = orders.filter(o => o.status === 'completed' && !usedCompletedOrders.has(o.id));
    completedOrders.forEach(order => {
        let option = document.createElement('option');
        option.value = order.id;
        option.textContent = `${order.customerName} - ${formatDate(order.date)} (${order.totalQty} PCS)`;
        select.appendChild(option);
    });
}

function loadCompletedOrderForSale() {
    let orderId = document.getElementById('saleOrderSelect').value;
    if (!orderId) return;

    let order = orders.find(o => o.id == orderId);
    if (!order) return;

    document.getElementById('saleRows').innerHTML = '';

    let wrapper = document.getElementById('saleCustomerWrapper');
    wrapper.innerHTML = '';
    let customerIdInput = document.createElement('input');
    customerIdInput.type = 'hidden';
    customerIdInput.id = 'saleCustomerId';
    wrapper.appendChild(customerIdInput);

    let customer = customers.find(c => c.id === order.customerId);
    if (customer) {
        let customerSearch = createCustomerSearchable('Customer', (cust) => {
            document.getElementById('saleCustomerId').value = cust.id;
        }, customer.name + ' (' + customer.uniqueId + ')');
        wrapper.appendChild(customerSearch);
        document.getElementById('saleCustomerId').value = customer.id;
    } else {
        let customerSearch = createCustomerSearchable('Customer', (cust) => {
            document.getElementById('saleCustomerId').value = cust.id;
        }, '');
        wrapper.appendChild(customerSearch);
        document.getElementById('saleCustomerId').value = '';
    }

    (order.items || []).forEach(item => {
        let row = document.createElement('div');
        row.className = 'entry-row';

        let brand = mainCategories.find(m => m.id === item.mainId);
        let brandOptions = mainCategories.map(m => ({ value: m.id, text: m.name }));

        let brandWrapper = createSearchableInput('Brand...', brandOptions, (opt) => {
            row.dataset.brandId = opt.value;
            updateSizeDropdown(row, opt.value, 'sale');
        }, true, 'brand');
        brandWrapper.querySelector('input').value = brand ? brand.name : '';
        row.dataset.brandId = item.mainId;

        let sizeWrapper = createSearchableInput('Size...', [], null, true, null);
        let itemWrapper = createSearchableInput('Item...', [], null, true, null);
        itemWrapper.querySelector('input').value = (item.itemName || 'Item') + ' (' + item.length + 'ft ' + item.weight + 'KG)';
        row.dataset.itemId = item.itemId;

        let qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.className = 'searchable-input';
        qtyInput.placeholder = 'Qty';
        qtyInput.min = '1';
        qtyInput.value = item.quantity;

        let lengthInput = document.createElement('input');
        lengthInput.type = 'number';
        lengthInput.className = 'searchable-input';
        lengthInput.value = item.length || 13;
        lengthInput.disabled = true;

        let removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-danger btn-sm';
        removeBtn.textContent = '✖';
        removeBtn.onclick = () => row.remove();

        row.appendChild(brandWrapper);
        row.appendChild(sizeWrapper);
        row.appendChild(itemWrapper);
        row.appendChild(lengthInput);
        row.appendChild(qtyInput);
        row.appendChild(removeBtn);

        document.getElementById('saleRows').appendChild(row);
    });
}

async function completeOrder(orderId) {
    let order = orders.find(o => o.id === orderId);
    if (!order) return;

    let canComplete = true;
    let stockIssues = [];
    (order.items || []).forEach(item => {
        let invItem = items.find(i => i.id === item.itemId);
        if (!invItem) return;
        let remainingToFulfill = (item.quantity || 0) - (item.fulfilled || 0);
        if (remainingToFulfill > 0 && remainingToFulfill > (invItem.stock || 0)) {
            canComplete = false;
            stockIssues.push(`${item.productCode}: Need ${remainingToFulfill} but only ${invItem.stock || 0} available`);
        }
    });

    if (!canComplete) {
        alert('Cannot complete order:\n' + stockIssues.join('\n'));
        return;
    }

    if (!confirm(`Are you sure you want to complete Order #${orderId}? This will deduct stock and record sales.`)) return;

    for (let item of (order.items || [])) {
        let invItem = items.find(i => i.id === item.itemId);
        if (!invItem) continue;
        let remainingToFulfill = (item.quantity || 0) - (item.fulfilled || 0);
        if (remainingToFulfill > 0) {
            let tData = {
                type: 'SALE',
                date: new Date().toISOString().slice(0, 16),
                mainId: invItem.mainId,
                subId: invItem.subId,
                itemId: item.itemId,
                quantity: remainingToFulfill,
                customerId: order.customerId,
                notes: `Order #${orderId} Fulfillment`
            };

            try {
                const response = await fetch('api/sync.php?action=save_transaction', {
                    method: 'POST',
                    body: JSON.stringify({ transaction: tData })
                });
                const result = await response.json();
                if (result.status === 'success') {
                    invItem.stock = (invItem.stock || 0) - remainingToFulfill;
                    item.fulfilled = (item.fulfilled || 0) + remainingToFulfill;
                    transactions.unshift({
                        id: result.id,
                        ...tData,
                        mainName: mainCategories.find(m => m.id === invItem.mainId)?.name || '',
                        subName: subCategories.find(s => s.id === invItem.subId)?.name || '',
                        productCode: item.productCode,
                        itemName: invItem.name,
                        weight: invItem.weight,
                        length: invItem.length,
                        customer: order.customerName + ' (Order Complete)'
                    });
                }
            } catch (e) {
                console.error('Fulfillment save failed for item', item.itemId);
            }
        }
    }

    // Update order status on server
    order.status = 'Completed';
    try {
        await fetch('api/sync.php?action=save_order', {
            method: 'POST',
            body: JSON.stringify({ order: order })
        });
        saveData();
        refreshOrdersList();
        refreshDashboard();
        refreshStockList();
        refreshLowStockReport();
        refreshTransactions();
        alert(`Order #${orderId} completed successfully!`);
    } catch (e) {
        alert('Order status update failed on server, but stock was deducted.');
    }
}

function showInvoice(orderId) {
    let order = orders.find(o => o.id === orderId);
    if (!order) return;

    let customer = customers.find(c => c.id === order.customerId);

    let itemsHtml = '';
    (order.items || []).forEach(item => {
        itemsHtml += `<tr>
                    <td>${item.productCode}</td>
                    <td>${item.length || 13} ft</td>
                    <td>${item.weight} KG</td>
                    <td>${item.quantity}</td>
                    <td>${(item.weight * item.quantity).toFixed(2)} KG</td>
                </tr>`;
    });

    let invoiceHtml = `
                <div class="invoice">
                    <div class="invoice-header">
                        <h1>${companySettings.name}</h1>
                        <p>Invoice #${order.id}</p>
                    </div>
                    <div class="invoice-details">
                        <p><strong>Date:</strong> ${formatDate(order.date)}</p>
                        <p><strong>Customer:</strong> ${order.customerName}</p>
                        ${customer ? `<p><strong>Address:</strong> ${customer.address || 'N/A'}</p>` : ''}
                        ${customer ? `<p><strong>Mobile:</strong> ${customer.mobile || 'N/A'}</p>` : ''}
                    </div>
                    <table class="invoice-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Length</th>
                                <th>Weight/Unit</th>
                                <th>Quantity</th>
                                <th>Total Weight</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>
                    <div class="invoice-total">
                        Total Quantity: ${order.totalQty} PCS | Total Weight: ${(order.totalKg || 0).toFixed(2)} KG
                    </div>
                </div>
            `;

    document.getElementById('invoiceContent').innerHTML = invoiceHtml;
    document.getElementById('invoiceModal').style.display = 'block';
}

function closeInvoiceModal() {
    document.getElementById('invoiceModal').style.display = 'none';
}

function printInvoice() {
    let printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Invoice</title>');
    printWindow.document.write('<style>body { font-family: Arial; padding: 20px; } .invoice { max-width: 800px; margin: 0 auto; } .invoice-header { text-align: center; margin-bottom: 30px; } table { width: 100%; border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; text-align: left; } th { background-color: #f2f2f2; } .invoice-total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(document.querySelector('.invoice').outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function editOrder(orderId) {
    let order = orders.find(o => o.id === orderId);
    if (!order) return;

    let formHtml = `
                <div class="form-group">
                    <label>Date</label>
                    <input type="datetime-local" id="editOrderDate" class="form-control" value="${order.date}">
                </div>
                <h4>Order Items</h4>
                <div id="editOrderItems"></div>
                <button class="btn btn-info" onclick="addEditOrderRow()">➕ Add Item</button>
                <br><br>
                <button class="btn btn-primary" onclick="updateOrder(${order.id})">Update Order</button>
                <button class="btn btn-danger" onclick="closeEditModal()">Cancel</button>
            `;

    document.getElementById('editOrderForm').innerHTML = formHtml;
    document.getElementById('editOrderId').textContent = order.id;

    let container = document.getElementById('editOrderItems');
    (order.items || []).forEach(item => {
        let row = document.createElement('div');
        row.className = 'entry-row';

        let brand = mainCategories.find(m => m.id === item.mainId);
        let brandOptions = mainCategories.map(m => ({ value: m.id, text: m.name }));

        let brandWrapper = createSearchableInput('Brand...', brandOptions, (opt) => {
            row.dataset.brandId = opt.value;
            updateSizeDropdown(row, opt.value, 'edit');
        }, false, 'brand');
        brandWrapper.querySelector('input').value = brand ? brand.name : '';
        row.dataset.brandId = item.mainId;

        let sizeWrapper = createSearchableInput('Size...', [], null, true, null);
        let itemWrapper = createSearchableInput('Item...', [], null, true, null);

        let lengthInput = document.createElement('input');
        lengthInput.type = 'number';
        lengthInput.className = 'searchable-input';
        lengthInput.value = item.length || 13;
        lengthInput.min = '1';

        let qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.className = 'searchable-input';
        qtyInput.placeholder = 'Qty';
        qtyInput.min = '1';
        qtyInput.value = item.quantity;

        let removeBtn = document.createElement('button');
        removeBtn.className = 'btn btn-danger btn-sm';
        removeBtn.textContent = '✖';
        removeBtn.onclick = () => row.remove();

        row.appendChild(brandWrapper);
        row.appendChild(sizeWrapper);
        row.appendChild(itemWrapper);
        row.appendChild(lengthInput);
        row.appendChild(qtyInput);
        row.appendChild(removeBtn);

        container.appendChild(row);

        setTimeout(() => {
            let sizeOptions = subCategories.filter(s => s.mainId == item.mainId).map(s => ({ value: s.id, text: s.name }));
            let newSizeWrapper = createSearchableInput('Size...', sizeOptions, (opt) => {
                row.dataset.sizeId = opt.value;
                updateItemDropdown(row, item.mainId, opt.value, 'edit');
            }, false, 'size', item.mainId);
            newSizeWrapper.querySelector('input').value = item.subName || '';
            row.replaceChild(newSizeWrapper, sizeWrapper);

            setTimeout(() => {
                let itemOptions = items.filter(i => i.mainId == item.mainId && i.subId == item.subId).map(i => ({
                    value: i.id,
                    text: `${i.name || 'Item'} (${i.length}ft ${i.weight}KG)`,
                    stock: i.stock || 0,
                    length: i.length,
                    weight: i.weight,
                    item: i
                }));
                let newItemWrapper = createSearchableInput('Item...', itemOptions, (opt) => {
                    row.dataset.itemId = opt.value;
                    row.dataset.itemName = opt.item.name;
                    row.dataset.itemWeight = opt.item.weight;
                    row.dataset.itemLength = opt.item.length;
                    lengthInput.value = opt.item.length;
                }, false, null);
                newItemWrapper.querySelector('input').value = (item.itemName || 'Item') + ' (' + item.length + 'ft ' + item.weight + 'KG)';
                row.dataset.itemId = item.itemId;
                row.replaceChild(newItemWrapper, itemWrapper);
            }, 50);
        }, 50);
    });

    document.getElementById('editOrderModal').style.display = 'block';
}

function addEditOrderRow() {
    let container = document.getElementById('editOrderItems');
    const row = document.createElement('div');
    row.className = 'entry-row';
    const brandOptions = mainCategories.map(m => ({ value: m.id, text: m.name }));
    const brandWrapper = createSearchableInput('Brand...', brandOptions, (opt) => {
        row.dataset.brandId = opt.value;
        updateSizeDropdown(row, opt.value, 'edit');
    }, false, 'brand');
    const sizeWrapper = createSearchableInput('Size...', [], null, true, null);
    const itemWrapper = createSearchableInput('Item...', [], null, true, null);

    const lengthInput = document.createElement('input');
    lengthInput.type = 'number';
    lengthInput.className = 'searchable-input';
    lengthInput.placeholder = 'Length';
    lengthInput.value = '13';

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.className = 'searchable-input';
    qtyInput.placeholder = 'Qty';
    qtyInput.min = '1';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn btn-danger btn-sm';
    removeBtn.textContent = '✖';
    removeBtn.onclick = () => row.remove();

    row.appendChild(brandWrapper);
    row.appendChild(sizeWrapper);
    row.appendChild(itemWrapper);
    row.appendChild(lengthInput);
    row.appendChild(qtyInput);
    row.appendChild(removeBtn);

    container.appendChild(row);
}

async function updateOrder(orderId) {
    let order = orders.find(o => o.id === orderId);
    if (!order) return;

    let rows = document.getElementById('editOrderItems').children;
    let orderItems = [];
    let totalQty = 0; let totalKg = 0;

    for (let row of rows) {
        const itemId = row.dataset.itemId;
        const lengthInput = row.children[3];
        const qtyInput = row.children[4];
        const qty = parseInt(qtyInput ? qtyInput.value : 0);
        const length = parseInt(lengthInput ? lengthInput.value : 13);

        if (!itemId || !qty || qty <= 0) continue;
        let item = items.find(i => i.id == itemId);
        if (!item) continue;

        if (length && length > 0) item.length = length;

        let main = mainCategories.find(m => m.id === item.mainId);
        let sub = subCategories.find(s => s.id === item.subId);

        let existingItem = order.items.find(i => i.itemId == itemId);
        let fulfilled = existingItem ? existingItem.fulfilled || 0 : 0;

        orderItems.push({
            itemId: itemId,
            mainId: item.mainId,
            subId: item.subId,
            mainName: main ? main.name : '',
            subName: sub ? sub.name : '',
            productCode: getProductCode(item, main, sub),
            itemName: item.name,
            weight: item.weight,
            length: item.length,
            quantity: qty,
            fulfilled: fulfilled
        });
        totalQty += qty; totalKg += qty * (item.weight || 0);
    }

    if (orderItems.length === 0) { alert('Please add at least one item'); return; }

    let updatedData = {
        ...order,
        date: document.getElementById('editOrderDate').value,
        items: orderItems,
        totalQty: totalQty,
        totalKg: totalKg
    };

    try {
        const response = await fetch('api/sync.php?action=save_order', {
            method: 'POST',
            body: JSON.stringify({ order: updatedData })
        });
        const result = await response.json();
        if (result.status === 'success') {
            Object.assign(order, updatedData);
            saveData();
            refreshOrdersList();
            closeEditModal();
            alert('Order updated successfully!');
        } else {
            alert('Error: ' + result.message);
        }
    } catch (e) {
        alert('Sync failed.');
    }
}

function closeEditModal() {
    document.getElementById('editOrderModal').style.display = 'none';
}

function openDeleteModal(orderId) {
    document.getElementById('deleteOrderId').textContent = orderId;
    document.getElementById('deleteOrderModal').style.display = 'block';
}

function closeDeleteModal() {
    document.getElementById('deleteOrderModal').style.display = 'none';
}

async function confirmDeleteOrder() {
    let orderId = parseInt(document.getElementById('deleteOrderId').textContent);
    try {
        const response = await fetch('api/sync.php?action=delete_order', {
            method: 'POST',
            body: JSON.stringify({ id: orderId })
        });
        const result = await response.json();
        if (result.status === 'success') {
            orders = orders.filter(o => o.id !== orderId);
            saveData();
            closeDeleteModal();
            refreshOrdersList();
            refreshDashboard();
            refreshStockList();
            refreshLowStockReport();
            alert('Order deleted successfully!');
        } else {
            alert('Delete failed: ' + result.message);
        }
    } catch (e) {
        alert('Sync failed.');
    }
}

function refreshCategoriesView() {
    const currentExpandedMains = Array.from(document.querySelectorAll('.main-category.expanded')).map(el => el.id);
    const currentExpandedSubs = Array.from(document.querySelectorAll('.sub-category.expanded')).map(el => el.id);
    
    let html = '';
    sortMainCategories(mainCategories).forEach(main => {
        let mainSubs = subCategories.filter(s => s.mainId === main.id);
        let mainItems = items.filter(i => i.mainId === main.id);
        let totalStock = mainItems.reduce((sum, i) => sum + (i.stock || 0), 0);
        let mainCode = (main.code) ? main.code : String(main.id).padStart(2, '0');

        let subHtml = '';
        sortSubCategories(mainSubs).forEach(sub => {
            let subItems = items.filter(i => i.mainId === main.id && i.subId === sub.id);
            let subTotalStock = subItems.reduce((sum, i) => sum + (i.stock || 0), 0);
            let subCode = (sub.code) ? sub.code : (mainCode + String(sub.id).padStart(3, '0'));

            let itemsHtml = '';
            sortItems(subItems).forEach(item => {
                let itemCode = item.code || (subCode + String(item.id).padStart(4, '0'));
                itemsHtml += `
                            <div class="item-row">
                                <div class="item-info">
                                    <span class="item-name-badge">[${itemCode}] ${item.name || 'Item'}</span>
                                    <div class="item-specs">
                                        <span class="item-spec">${item.length} ft</span>
                                        <span class="item-spec">${item.weight} KG</span>
                                    </div>
                                </div>
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <span class="item-stock">${item.stock || 0}</span>
                                    <div class="item-actions">
                                        <button class="btn-icon btn-icon-sm" onclick="editItem(${item.id})" title="Edit">✏️</button>
                                        <button class="btn-icon btn-icon-sm" onclick="deleteItem(${item.id})" title="Delete">🗑️</button>
                                    </div>
                                </div>
                            </div>
                        `;
            });

            subHtml += `
                        <div class="sub-category" id="subCat_${sub.id}">
                            <div class="sub-header" onclick="toggleSubCategory(this)">
                                <div style="display: flex; align-items: center; gap: 1rem;">
                                    <span class="sub-name">[${subCode}] ${sub.name}</span>
                                    <span class="sub-stats">Total: ${subTotalStock} PCS</span>
                                </div>
                                <div class="sub-actions">
                                    <button class="btn-icon btn-icon-sm" onclick="editSubCategory(${sub.id}); event.stopPropagation();" title="Edit Size">✏️</button>
                                    <button class="btn-icon btn-icon-sm" onclick="deleteSubCategory(${sub.id}); event.stopPropagation();" title="Delete Size">🗑️</button>
                                    <button class="add-btn add-btn-sm" onclick="showAddItemModalFor(${main.id}, ${sub.id}); event.stopPropagation();">+ Add Item</button>
                                </div>
                            </div>
                            <div class="items-container">
                                ${itemsHtml || '<div style="color: var(--gray-500); text-align: center; padding: 1rem;">No items in this size</div>'}
                            </div>
                        </div>
                    `;
        });

        html += `
                    <div class="main-category" id="mainCat_${main.id}">
                        <div class="category-header" onclick="toggleMainCategory(this)">
                            <div class="category-title">
                                <span class="color-dot" style="background: ${main.color};"></span>
                                <span class="category-name">[${mainCode}] ${main.name}</span>
                                <span class="category-stats">Total Stock: ${totalStock} PCS</span>
                            </div>
                            <div class="category-actions">
                                <button class="btn-icon" onclick="editMainCategory(${main.id}); event.stopPropagation();" title="Edit Brand">✏️</button>
                                <button class="btn-icon" onclick="deleteMainCategory(${main.id}); event.stopPropagation();" title="Delete Brand">🗑️</button>
                                <button class="add-btn" onclick="showAddSubCategoryModalFor(${main.id}); event.stopPropagation();">+ Add Size</button>
                            </div>
                        </div>
                        <div class="sub-category-container">
                            ${subHtml || '<div style="color: var(--gray-500); text-align: center; padding: 2rem;">No sizes added yet. Click "Add Size" to create one.</div>'}
                        </div>
                    </div>
                `;
    });
    document.getElementById('categoriesContainer').innerHTML = html;

    currentExpandedMains.forEach(id => { let el = document.getElementById(id); if (el) el.classList.add('expanded'); });
    currentExpandedSubs.forEach(id => { let el = document.getElementById(id); if (el) el.classList.add('expanded'); });
}

function showAddSubCategoryModalFor(mainId) {
    let select = document.getElementById('subCategoryMainSelect');
    select.innerHTML = '';
    mainCategories.forEach(main => {
        let option = document.createElement('option');
        option.value = main.id;
        option.textContent = main.name;
        option.style.color = main.color;
        select.appendChild(option);
    });
    select.value = mainId;
    document.getElementById('subCategoryModalTitle').textContent = '➕ Add Size';
    document.getElementById('editSubCategoryId').value = '';
    document.getElementById('subCategoryName').value = '';
    document.getElementById('subCategoryUnit').value = 'inch';
    document.getElementById('addSubCategoryModal').style.display = 'block';
}

function showAddItemModalFor(mainId, subId) {
    document.getElementById('itemMainId').value = mainId;
    document.getElementById('itemSubId').value = subId;
    document.getElementById('itemModalTitle').textContent = '➕ Add Item';
    document.getElementById('editItemId').value = '';
    document.getElementById('itemLength').value = '13';
    document.getElementById('itemWeight').value = '';
    document.getElementById('itemStock').value = '0';
    document.getElementById('addItemModal').style.display = 'block';
}

// Main Category CRUD
function showAddMainCategoryModal() {
    document.getElementById('mainCategoryModalTitle').textContent = '➕ Add Brand';
    document.getElementById('editMainCategoryId').value = '';
    document.getElementById('mainCategoryName').value = '';
    document.getElementById('mainCategoryCode').value = '';
    document.getElementById('mainCategoryColor').value = '#2196f3';
    document.getElementById('mainCategoryLowStock').value = '10';
    document.getElementById('addMainCategoryModal').style.display = 'block';
}

function closeAddMainCategoryModal() {
    document.getElementById('addMainCategoryModal').style.display = 'none';
}

function editMainCategory(id) {
    let main = mainCategories.find(m => m.id === id);
    if (main) {
        document.getElementById('mainCategoryModalTitle').textContent = '✏️ Edit Brand';
        document.getElementById('editMainCategoryId').value = main.id;
        document.getElementById('mainCategoryName').value = main.name;
        document.getElementById('mainCategoryCode').value = main.code || '';
        document.getElementById('mainCategoryColor').value = main.color;
        document.getElementById('mainCategoryLowStock').value = main.lowStockLimit || 10;
        document.getElementById('addMainCategoryModal').style.display = 'block';
    }
}

async function deleteMainCategory(id) {
    let subCount = subCategories.filter(s => s.mainId === id).length;
    if (subCount > 0) {
        alert(`Cannot delete brand because it has ${subCount} size(s). Please delete all sizes first.`);
        return;
    }
    if (confirm('Are you sure you want to delete this brand?')) {
        try {
            const response = await fetch('api/sync.php?action=delete_category', {
                method: 'POST',
                body: JSON.stringify({ id: id, type: 'main' })
            });
            const result = await response.json();
            if (result.status === 'success') {
                items = items.filter(i => i.mainId !== id);
                mainCategories = mainCategories.filter(m => m.id !== id);
                saveData();
                refreshCategoriesView();
                refreshDashboard();
                refreshStockList();
                refreshLowStockReport();
                alert('Brand deleted!');
            } else { alert('Delete failed: ' + result.message); }
        } catch (e) { alert('Sync failed.'); }
    }
}

async function saveMainCategory() {
    let id = document.getElementById('editMainCategoryId').value;
    let name = document.getElementById('mainCategoryName').value;
    let code = document.getElementById('mainCategoryCode').value;
    let color = document.getElementById('mainCategoryColor').value;
    let lowStockLimit = parseInt(document.getElementById('mainCategoryLowStock').value) || 10;
    if (!name) { alert('Enter brand name'); return; }

    let catData = { id, name, color, lowStockLimit };
    try {
        const response = await fetch('api/sync.php?action=save_category', {
            method: 'POST',
            body: JSON.stringify({ type: 'main', category: catData })
        });
        const result = await response.json();
        
        if (result.status === 'success') {
            if (id) {
                let main = mainCategories.find(m => m.id == id);
                if (main) {
                    main.name = name; main.color = color; main.lowStockLimit = lowStockLimit;
                }
            } else {
                let newId = result.id;
                mainCategories.push({ id: newId, code: code || String(newId).padStart(2, '0'), name, color, lowStockLimit });
            }
            saveData();
            refreshCategoriesView();
            refreshDashboard();
            refreshStockList();
            refreshLowStockReport();
            closeAddMainCategoryModal();
            alert('Saved successfully!');
        }
    } catch (e) {
        alert('Error: Not saved to server.');
    }
}

// Sub Category CRUD
function showAddSubCategoryModal() {
    if (mainCategories.length === 0) { alert('Add a brand first!'); return; }
    let select = document.getElementById('subCategoryMainSelect');
    select.innerHTML = '';
    mainCategories.forEach(main => {
        let option = document.createElement('option');
        option.value = main.id;
        option.textContent = main.name;
        option.style.color = main.color;
        select.appendChild(option);
    });
    document.getElementById('subCategoryModalTitle').textContent = '➕ Add Size';
    document.getElementById('editSubCategoryId').value = '';
    document.getElementById('subCategoryName').value = '';
    document.getElementById('subCategoryUnit').value = 'inch';
    document.getElementById('addSubCategoryModal').style.display = 'block';
}

function closeAddSubCategoryModal() {
    document.getElementById('addSubCategoryModal').style.display = 'none';
}

function editSubCategory(id) {
    let sub = subCategories.find(s => s.id === id);
    if (sub) {
        let select = document.getElementById('subCategoryMainSelect');
        select.innerHTML = '';
        mainCategories.forEach(main => {
            let option = document.createElement('option');
            option.value = main.id;
            option.textContent = main.name;
            option.style.color = main.color;
            if (main.id === sub.mainId) option.selected = true;
            select.appendChild(option);
        });
        let sizeValue = parseFloat(sub.name) || sub.name.replace(/[^0-9.]/g, '');
        let unit = sub.name.includes('mm') ? 'mm' : 'inch';
        document.getElementById('subCategoryModalTitle').textContent = '✏️ Edit Size';
        document.getElementById('editSubCategoryId').value = sub.id;
        document.getElementById('subCategoryName').value = sizeValue;
        document.getElementById('subCategoryUnit').value = unit;
        document.getElementById('addSubCategoryModal').style.display = 'block';
    }
}

async function deleteSubCategory(id) {
    let itemCount = items.filter(i => i.subId === id).length;
    if (itemCount > 0) {
        alert(`Cannot delete size because it has ${itemCount} item(s). Please delete all items first.`);
        return;
    }
    if (confirm('Are you sure you want to delete this size?')) {
        try {
            const response = await fetch('api/sync.php?action=delete_category', {
                method: 'POST',
                body: JSON.stringify({ id: id, type: 'sub' })
            });
            const result = await response.json();
            if (result.status === 'success') {
                subCategories = subCategories.filter(s => s.id !== id);
                resequenceCodes();
                saveData();
                refreshCategoriesView();
                refreshDashboard();
                refreshStockList();
                refreshLowStockReport();
                alert('Size deleted!');
            } else { alert('Delete failed: ' + result.message); }
        } catch (e) { alert('Sync failed.'); }
    }
}

async function saveSubCategory() {
    let id = document.getElementById('editSubCategoryId').value;
    let mainId = parseInt(document.getElementById('subCategoryMainSelect').value);
    let sizeValue = document.getElementById('subCategoryName').value;
    let unit = document.getElementById('subCategoryUnit').value;
    if (!sizeValue) { alert('Enter size'); return; }
    let fullName = sizeValue + (unit === 'inch' ? '"' : 'mm');

    let catData = { id, mainId, name: fullName };
    try {
        const response = await fetch('api/sync.php?action=save_category', {
            method: 'POST',
            body: JSON.stringify({ type: 'sub', category: catData })
        });
        const result = await response.json();
        
        if (result.status === 'success') {
            const returnedId = parseInt(result.id);
            if (id) {
                let sub = subCategories.find(s => parseInt(s.id) === parseInt(id));
                if (sub) { sub.mainId = mainId; sub.name = fullName; }
            } else {
                subCategories.push({ id: returnedId, mainId, name: fullName });
            }
            resequenceCodes();
            saveData();
            refreshCategoriesView();
            refreshDashboard();
            refreshStockList();
            refreshLowStockReport();
            closeAddSubCategoryModal();
            alert('Saved successfully');
        }
    } catch (e) {
        alert('Error: Not saved to server');
    }
}

// Item CRUD (Simplified)
function showAddItemModal() {
    if (mainCategories.length === 0) { alert('Add a brand first!'); return; }
    if (subCategories.length === 0) { alert('Add a size first!'); return; }
    document.getElementById('itemModalTitle').textContent = '➕ Add Item';
    document.getElementById('editItemId').value = '';
    document.getElementById('itemLength').value = '13';
    document.getElementById('itemWeight').value = '';
    document.getElementById('itemStock').value = '0';
    document.getElementById('addItemModal').style.display = 'block';
}

function closeAddItemModal() {
    document.getElementById('addItemModal').style.display = 'none';
}

function editItem(id) {
    let item = items.find(i => i.id === id);
    if (item) {
        document.getElementById('itemModalTitle').textContent = '✏️ Edit Item';
        document.getElementById('editItemId').value = item.id;
        document.getElementById('itemMainId').value = item.mainId;
        document.getElementById('itemSubId').value = item.subId;
        document.getElementById('itemLength').value = item.length || 13;
        document.getElementById('itemWeight').value = item.weight || '';
        document.getElementById('itemStock').value = item.stock || 0;
        document.getElementById('addItemModal').style.display = 'block';
    }
}

async function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            const response = await fetch('api/sync.php?action=delete_item', {
                method: 'POST',
                body: JSON.stringify({ id: id })
            });
            const result = await response.json();
            if (result.status === 'success') {
                items = items.filter(i => i.id != id);
                resequenceCodes();
                saveData();
                refreshCategoriesView();
                refreshDashboard();
                refreshStockList();
                refreshLowStockReport();
                alert('Item deleted!');
            } else { alert('Delete failed: ' + result.message); }
        } catch (e) { alert('Sync failed.'); }
    }
}

async function saveItem() {
    let id = document.getElementById('editItemId').value;
    let mainId = parseInt(document.getElementById('itemMainId').value);
    let subId = parseInt(document.getElementById('itemSubId').value);
    let length = parseFloat(document.getElementById('itemLength').value) || 13;
    let weight = parseFloat(document.getElementById('itemWeight').value);
    let stock = parseInt(document.getElementById('itemStock').value) || 0;

    if (!mainId || !subId || !weight) {
        alert('Please fill all required fields (Weight is required)');
        return;
    }

    let main = mainCategories.find(m => m.id === mainId);
    let sub = subCategories.find(s => s.id === subId);
    let minStock = main ? main.lowStockLimit : 10;

    let itemData = { id, mainId, subId, length, weight, stock };

    try {
        const response = await fetch('api/sync.php?action=save_item', {
            method: 'POST',
            body: JSON.stringify({ item: itemData })
        });
        const result = await response.json();
        
        if (result.status === 'success') {
            if (id) {
                let item = items.find(i => i.id == id);
                if (item) {
                    item.mainId = mainId; item.subId = subId; item.length = length;
                    item.weight = weight; item.stock = stock; item.minStock = minStock;
                }
            } else {
                let newId = result.id;
                items.push({ id: newId, code: '', mainId, subId, name: '', length, weight, stock, minStock });
            }
            resequenceCodes();
            saveData();
            alert('Saved successfully!');
            closeAddItemModal();
            refreshCategoriesView();
            refreshDashboard();
            refreshStockList();
            refreshLowStockReport();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (e) {
        console.error('Save failed:', e);
        alert('Error: Server connection failed.');
    }
}

// User Management
function showAddUserModal() {
    document.getElementById('addUserModal').style.display = 'block';
}

function closeAddUserModal() {
    document.getElementById('addUserModal').style.display = 'none';
}

function saveNewUser() {
    let name = document.getElementById('newUserName').value;
    let username = document.getElementById('newUserUsername').value;
    let password = document.getElementById('newUserPassword').value;
    let role = document.getElementById('newUserRole').value;
    if (!name || !username || !password) { alert('Please fill all fields'); return; }
    let newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 2;
    users.push({ id: newId, name, username, password, role, permissions: [] });
    refreshUsersList();
    closeAddUserModal();
    alert('User created!');
}

function refreshUsersList() {
    let html = '';
    users.forEach(user => {
        html += `<tr>
                    <td style="padding:0.5rem;">${user.name}</td>
                    <td style="padding:0.5rem;">${user.username}</td>
                    <td style="padding:0.5rem;">${user.role}</td>
                    <td style="padding:0.5rem;">${user.id !== 1 ? '<button class="btn btn-danger btn-sm" onclick="deleteUser(' + user.id + ')">Delete</button>' : ''}</td>
                </tr>`;
    });
    document.getElementById('usersList').innerHTML = html;
}

function deleteUser(userId) {
    if (confirm('Are you sure?')) {
        users = users.filter(u => u.id !== userId);
        refreshUsersList();
    }
}

function refreshTransactions() {
    let rows = '';
    if (transactions.length === 0) {
        rows = '<tr><td colspan="6" style="text-align:center; padding:1rem;">No transactions yet</td></tr>';
    } else {
        transactions.slice(0, 20).forEach(t => {
            rows += `<tr>
                        <td style="padding:0.5rem;">${formatDate(t.date)}</td>
                        <td style="padding:0.5rem;">${t.type}</td>
                        <td style="padding:0.5rem;">${t.mainName}</td>
                        <td style="padding:0.5rem;">${t.productCode}</td>
                        <td style="padding:0.5rem;">${t.quantity}</td>
                        <td style="padding:0.5rem;">${t.customer}</td>
                    </tr>`;
        });
    }
    document.getElementById('transactionsBody').innerHTML = rows;
}

// Initialize
// document.addEventListener('DOMContentLoaded', function () {
//    // Combined in initApp() above
// });