// ==================== DATA STRUCTURES ====================
let users = [
    { id: 1, name: 'Admin User', username: 'admin', password: 'admin123', role: 'admin', permissions: ['all'] }
];

let currentUser = null;
let currentModule = 'finishGood';
let usedCompletedOrders = new Set();

// Company Settings
let companySettings = {
    name: 'StockFlow',
    logo: '📦',
    databaseName: 'stockflow_db'
};

// Load saved settings
(function () {
    let savedUser = localStorage.getItem('stock_currentUser');
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
        } catch (e) { }
    }
    let savedCompany = localStorage.getItem('stock_company');
    if (savedCompany) {
        try {
            companySettings = JSON.parse(savedCompany);
        } catch (e) { }
    }
})();

function updateCompanyDisplay() {
    document.getElementById('sidebarCompany').textContent = companySettings.name;
    document.getElementById('sidebarLogo').innerHTML = companySettings.logo || '📦';
    document.getElementById('loginTitle').innerHTML = `📦 ${companySettings.name}`;
    document.getElementById('companyNameInput').value = companySettings.name;
    document.getElementById('databaseNameInput').value = companySettings.databaseName;
    document.getElementById('logoPreview').innerHTML = companySettings.logo || '📦';
}

function showCompanySettings() {
    switchModule('settings');
    setTimeout(() => {
        document.getElementById('companyNameInput').scrollIntoView({ behavior: 'smooth' });
    }, 100);
}

function saveCompanySettings() {
    companySettings.name = document.getElementById('companyNameInput').value || 'StockFlow';
    companySettings.databaseName = document.getElementById('databaseNameInput').value || 'stockflow_db';
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
            localStorage.setItem('stock_company', JSON.stringify(companySettings));
            updateCompanyDisplay();
        };
        reader.readAsDataURL(file);
    }
}

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
let transactionId = 1;
let orderId = 1;

function loadData() {
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
        if (transactions.length > 0) {
            transactionId = Math.max(...transactions.map(t => t.id)) + 1;
        }
        if (orders.length > 0) {
            orderId = Math.max(...orders.map(o => o.id)) + 1;
        }
    } catch (e) { }
}

function saveAll() {
    localStorage.setItem('stock_orders', JSON.stringify(orders));
    localStorage.setItem('stock_customers', JSON.stringify(customers));
    localStorage.setItem('stock_transactions', JSON.stringify(transactions));
    localStorage.setItem('stock_items', JSON.stringify(items));
    localStorage.setItem('stock_mainCat', JSON.stringify(mainCategories));
    localStorage.setItem('stock_subCat', JSON.stringify(subCategories));
    localStorage.setItem('stock_usedOrders', JSON.stringify(Array.from(usedCompletedOrders)));
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
    document.querySelectorAll('.menu-item').forEach(btn => btn.classList.remove('active'));

    if (module === 'finishGood') {
        document.querySelectorAll('.menu-item')[0].classList.add('active');
        document.getElementById('finishGoodTabs').style.display = 'flex';
        document.getElementById('settingsPanel').style.display = 'none';
        let activeTab = document.querySelector('.nav-tab.active');
        if (activeTab) {
            let tabName = activeTab.textContent.replace('📊', '').replace('📝', '').replace('📋', '').replace('🏷️', '').replace('👥', '').replace('📦', '').replace('⚠️', '').trim().toLowerCase();
            showTab(tabName);
        } else {
            showTab('dashboard');
        }
    } else {
        document.querySelectorAll('.menu-item')[1].classList.add('active');
        document.getElementById('finishGoodTabs').style.display = 'none';
        document.getElementById('settingsPanel').style.display = 'block';
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        refreshUsersList();
        refreshBrandLowStockSettings();
    }
}

function togglePassword(fieldId) {
    let password = document.getElementById(fieldId);
    password.type = password.type === 'password' ? 'text' : 'password';
}

function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('stock_currentUser', JSON.stringify(user));
        loadData();
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        // document.getElementById('usernameDisplay').textContent = username;
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
        alert('Invalid username or password!');
    }
}

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && document.getElementById('loginPage').style.display !== 'none') {
        login();
    }
});

(function () {
    if (currentUser) {
        loadData();
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        // document.getElementById('usernameDisplay').textContent = currentUser.username;
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
    document.getElementById('app').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
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
    document.getElementById(tabName).classList.add('active');
    if (tabName === 'dashboard') refreshDashboard();
    if (tabName === 'orders') refreshOrdersList();
    if (tabName === 'dataEntry') {
        refreshTransactions();
        refreshCompletedOrderDropdown();
    }
    if (tabName === 'categories') refreshCategoriesView();
    if (tabName === 'customers') refreshCustomersList();
    if (tabName === 'stockList') refreshStockList();
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

function saveCustomer() {
    let id = document.getElementById('editCustomerId').value;
    let name = document.getElementById('customerName').value.trim();
    let address = document.getElementById('customerAddress').value.trim();
    let mobile = document.getElementById('customerMobile').value.trim();
    let uniqueInput = document.getElementById('customerUniqueId').value.trim();

    if (!name) {
        alert('Please enter customer name');
        return;
    }

    if (id) {
        let customer = customers.find(c => c.id == id);
        if (customer) {
            customer.name = name;
            customer.address = address;
            customer.mobile = mobile;
            if (uniqueInput) customer.uniqueId = uniqueInput;
        }
        alert('Customer updated successfully!');
    } else {
        let newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
        let uniqueId = uniqueInput || 'CUST' + String(newId).padStart(4, '0');
        customers.push({
            id: newId,
            uniqueId: uniqueId,
            name: name,
            address: address,
            mobile: mobile
        });
        alert('Customer added successfully!');
    }
    saveAll();
    refreshCustomersList();
    closeCustomerModal();
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

function deleteCustomer(id) {
    if (confirm('Are you sure?')) {
        customers = customers.filter(c => c.id !== id);
        saveAll();
        refreshCustomersList();
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

function updateBrandLowStock(brandId) {
    let input = document.getElementById(`brandLow_${brandId}`);
    let newLimit = parseInt(input.value);
    if (newLimit && newLimit > 0) {
        let brand = mainCategories.find(b => b.id === brandId);
        if (brand) {
            brand.lowStockLimit = newLimit;
            items.forEach(item => {
                if (item.mainId === brandId && !item.customMinStock) {
                    item.minStock = newLimit;
                }
            });
            saveAll();
            refreshDashboard();
            refreshStockList();
            refreshLowStockReport();
            alert(`${brand.name} limit updated to ${newLimit}`);
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

function saveQuickBrand() {
    let name = document.getElementById('quickBrandName').value;
    let code = document.getElementById('quickBrandCode').value;
    let color = document.getElementById('quickBrandColor').value;
    let lowStock = parseInt(document.getElementById('quickBrandLowStock').value) || 10;

    if (!name) {
        alert('Please enter brand name');
        return;
    }

    let newId = mainCategories.length > 0 ? Math.max(...mainCategories.map(m => m.id)) + 1 : 1;
    mainCategories.push({ id: newId, code: code || String(newId).padStart(2, '0'), name, color, lowStockLimit: lowStock });

    saveAll();
    closeQuickAddBrandModal();
    refreshDashboard();
    refreshCategoriesView();
    refreshStockList();
    refreshLowStockReport();
    alert(`Brand "${name}" added!`);
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

function saveQuickSize() {
    let brandId = parseInt(document.getElementById('quickSizeBrandId').value);
    let sizeValue = document.getElementById('quickSizeName').value;
    let unit = document.getElementById('quickSizeUnit').value;

    if (!sizeValue) {
        alert('Please enter size');
        return;
    }

    let main = mainCategories.find(m => m.id === brandId);
    let mainCode = (main && main.code) ? main.code : String(brandId).padStart(2, '0');

    let fullName = sizeValue + (unit === 'inch' ? '"' : 'mm');
    let newId = subCategories.length > 0 ? Math.max(...subCategories.map(s => s.id)) + 1 : 1;

    let existingSubs = subCategories.filter(s => s.mainId === brandId);
    let maxSeq = 0;
    existingSubs.forEach(s => {
        if (s.code && typeof s.code === 'string') {
            let seq = parseInt(s.code.slice(mainCode.length)) || 0;
            if (seq > maxSeq) maxSeq = seq;
        }
    });
    let newCode = mainCode + String(maxSeq + 1).padStart(3, '0');

    subCategories.push({ id: newId, code: newCode, mainId: brandId, name: fullName });

    saveAll();
    closeQuickAddSizeModal();
    refreshCategoriesView();
    alert(`Size "${fullName}" added!`);
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
let stockChart = null;

function refreshDashboard() {
    let moduleItems = items;
    let totalItems = moduleItems.length;
    let totalStock = moduleItems.reduce((sum, i) => sum + (i.stock || 0), 0);
    let totalKg = moduleItems.reduce((sum, i) => sum + ((i.stock || 0) * (i.weight || 0)), 0);
    let lowStockCount = moduleItems.filter(i => {
        let main = mainCategories.find(m => m.id === i.mainId);
        let min = i.minStock || main?.lowStockLimit || 10;
        return i.stock <= min;
    }).length;

    // 1. Summary Cards
    document.getElementById('dashboardStats').innerHTML = `
        <div class="card summary-card">
            <div class="card-icon" style="background: #EFF6FF; color: #2563EB;">📦</div>
            <div class="card-info">
                <h3>Total Items</h3>
                <div class="value">${totalItems}</div>
            </div>
        </div>
        <div class="card summary-card">
            <div class="card-icon" style="background: #F0FDF4; color: #10B981;">📚</div>
            <div class="card-info">
                <h3>Total Stock</h3>
                <div class="value">${totalStock} PCS</div>
                <div class="subtext">${totalKg.toFixed(2)} KG</div>
            </div>
        </div>
        <div class="card summary-card">
            <div class="card-icon" style="background: #FFFBEB; color: #F59E0B;">⚠️</div>
            <div class="card-info">
                <h3>Low Stock</h3>
                <div class="value">${lowStockCount}</div>
            </div>
        </div>
    `;

    // 2. Pending orders quantities
    let orderedQtys = {};
    orders.filter(o => o.status === 'pending' || o.status === 'processing').forEach(order => {
        (order.items || []).forEach(item => {
            orderedQtys[item.itemId] = (orderedQtys[item.itemId] || 0) + (item.quantity || 0);
        });
    });

    // 3. Stock Comparison Table Rows
    let comparisonRows = '';
    moduleItems.forEach(item => {
        let main = mainCategories.find(m => m.id === item.mainId);
        let sub = subCategories.find(s => s.id === item.subId);
        if (!main || !sub) return;

        let ordered = orderedQtys[item.id] || 0;
        let remaining = (item.stock || 0) - ordered;
        let size = sub.name.replace(/[^0-9.]/g, '');

        let statusClass = remaining <= (item.minStock || 10) ? 'status-danger' : (remaining <= (item.minStock || 10) * 2 ? 'status-warning' : 'status-success');
        let statusDot = remaining <= (item.minStock || 10) ? 'dot-danger' : (remaining <= (item.minStock || 10) * 2 ? 'dot-warning' : 'dot-success');

        comparisonRows += `
            <tr>
                <td><span style="font-weight:600; color:var(--text-dark);">${main.name}</span></td>
                <td>${size}"</td>
                <td>${item.length}' / ${item.weight}KG</td>
                <td><span style="font-weight:600;">${item.stock || 0}</span></td>
                <td style="color:var(--text-light);">${ordered}</td>
                <td>
                    <span class="status-indicator ${statusClass}">
                        <span class="dot ${statusDot}"></span>
                        ${remaining}
                    </span>
                </td>
            </tr>
        `;
    });

    if (document.getElementById('stockComparisonBody')) {
        document.getElementById('stockComparisonBody').innerHTML = comparisonRows;
    }
    if (document.getElementById('fullStockComparisonBody')) {
        document.getElementById('fullStockComparisonBody').innerHTML = comparisonRows;
    }

    // 4. Initialize Chart
    initStockChart(moduleItems, orderedQtys);

    // Legacy Brand Cards refresh if still needed elsewhere
    let brandCardsHtml = '';
    sortMainCategories(mainCategories).forEach(main => {
        let brandItems = items.filter(i => i.mainId === main.id);
        let totalBrandStock = brandItems.reduce((sum, i) => sum + (i.stock || 0), 0);
        let totalBrandKg = brandItems.reduce((sum, i) => sum + ((i.stock || 0) * (i.weight || 0)), 0);

        let itemsHtml = '';
        sortItems(brandItems).forEach(item => {
            let sub = subCategories.find(s => s.id === item.subId);
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
    let brandContainer = document.getElementById('brandStockCards');
    if (brandContainer) brandContainer.innerHTML = brandCardsHtml;
}

function initStockChart(moduleItems, orderedQtys) {
    const canvas = document.getElementById('stockOverviewChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (stockChart) stockChart.destroy();

    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let baseStock = moduleItems.reduce((sum, i) => sum + (i.stock || 0), 0);
    let basePending = Object.values(orderedQtys).reduce((a, b) => a + b, 0);

    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'In Stock',
                    data: [baseStock * 0.8, baseStock * 0.85, baseStock * 0.75, baseStock * 0.9, baseStock * 0.82, baseStock * 0.95, baseStock],
                    borderColor: '#2563EB',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#2563EB'
                },
                {
                    label: 'Pending',
                    data: [basePending * 1.2, basePending * 0.9, basePending * 1.1, basePending * 0.8, basePending * 1.3, basePending * 1.0, basePending],
                    borderColor: '#F59E0B',
                    fill: false,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#F59E0B'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: '#F1F5F9' }, ticks: { color: '#6B7280', font: { size: 10 } } },
                x: { grid: { display: false }, ticks: { color: '#6B7280', font: { size: 10 } } }
            }
        }
    });
}

function refreshStockList() {
    let orderedQtys = {};
    orders.filter(o => o.status === 'pending' || o.status === 'processing').forEach(order => {
        (order.items || []).forEach(item => {
            orderedQtys[item.itemId] = (orderedQtys[item.itemId] || 0) + (item.quantity || 0);
        });
    });

    let brandCardsHtml = '';
    sortMainCategories(mainCategories).forEach(main => {
        let brandItems = items.filter(i => i.mainId === main.id);
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

        sortItems(brandItems).forEach(item => {
            let sub = subCategories.find(s => s.id === item.subId);
            let sizeName = sub ? sub.name.replace(/[^0-9.]/g, '') : '?';
            let desc = `${sizeName}"( ${(item.weight || 0).toFixed(1)} ) Kg`;

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

        if (brandItems.length === 0) {
            itemsHtml += '<tr><td colspan="5" style="text-align:center; padding: 1rem; color:var(--gray-500); background: white;">No items available in this brand</td></tr>';
        }
        itemsHtml += '</tbody></table>';

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
    });
    document.getElementById('stockListCards').innerHTML = brandCardsHtml;
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
    const company = localStorage.getItem('companyName') || 'StockFlow';
    const date = new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    document.getElementById('printCompanyName').textContent = company;
    document.getElementById('printDate').textContent = date;
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

function saveProduction() {
    let rows = document.getElementById('productionRows').children;
    if (rows.length === 0) { alert('Add at least one item'); return; }
    let saved = false; let errors = [];
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

        if (length && length > 0) {
            item.length = length;
        }

        let main = mainCategories.find(m => m.id === item.mainId);
        let sub = subCategories.find(s => s.id === item.subId);
        item.stock = (item.stock || 0) + qty;

        transactions.unshift({
            id: transactionId++,
            type: 'PRODUCTION',
            date: document.getElementById('prodDate').value,
            mainId: item.mainId,
            mainName: main ? main.name : '',
            subId: item.subId,
            subName: sub ? sub.name : '',
            itemId: itemId,
            itemName: item.name,
            productCode: getProductCode(item, main, sub),
            quantity: qty,
            weight: item.weight,
            length: item.length,
            customer: 'Factory'
        });
        saved = true;
    }
    if (errors.length > 0) { alert('Errors:\n' + errors.join('\n')); return; }
    if (!saved) { alert('No valid items'); return; }
    saveAll(); refreshTransactions(); refreshDashboard(); refreshStockList(); refreshLowStockReport(); hideAllForms();
    alert('Production saved!');
}

function saveSale() {
    let customerId = document.getElementById('saleCustomerId').value;
    let customerName = '';
    let customer = customers.find(c => c.id == customerId);
    if (customer) {
        customerName = customer.name + ' (' + customer.uniqueId + ')';
    } else {
        alert('Select customer');
        return;
    }
    let rows = document.getElementById('saleRows').children;
    if (rows.length === 0) { alert('Add at least one item'); return; }
    let saved = false; let errors = [];

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

        if (length && length > 0) {
            item.length = length;
        }

        if (qty > (item.stock || 0)) {
            errors.push(`Insufficient stock for ${item.name || 'Item'}. Available: ${item.stock || 0}`);
            continue;
        }
        let main = mainCategories.find(m => m.id === item.mainId);
        let sub = subCategories.find(s => s.id === item.subId);
        item.stock = (item.stock || 0) - qty;
        transactions.unshift({
            id: transactionId++,
            type: 'SALE',
            date: document.getElementById('saleDate').value,
            mainId: item.mainId,
            mainName: main ? main.name : '',
            subId: item.subId,
            subName: sub ? sub.name : '',
            itemId: itemId,
            itemName: item.name,
            productCode: getProductCode(item, main, sub),
            quantity: qty,
            weight: item.weight,
            length: item.length,
            customer: customerName
        });
        saved = true;
    }

    if (errors.length > 0) { alert('Errors:\n' + errors.join('\n')); return; }
    if (!saved) { alert('No valid items'); return; }

    if (selectedOrderId) {
        usedCompletedOrders.add(parseInt(selectedOrderId));
    }

    saveAll();
    refreshTransactions();
    refreshDashboard();
    refreshStockList();
    refreshLowStockReport();
    hideAllForms();
    refreshCompletedOrderDropdown();
    alert('Sale completed!');
}

function saveAdjustment() {
    let rows = document.getElementById('adjustmentRows').children;
    if (rows.length === 0) { alert('Add at least one item'); return; }
    let saved = false; let errors = [];
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

        if (length && length > 0) {
            item.length = length;
        }

        if (type === 'remove' && qty > (item.stock || 0)) {
            errors.push(`Cannot remove ${qty} PCS. Available: ${item.stock || 0}`);
            continue;
        }
        let main = mainCategories.find(m => m.id === item.mainId);
        let sub = subCategories.find(s => s.id === item.subId);
        if (type === 'add') {
            item.stock = (item.stock || 0) + qty;
        } else {
            item.stock = (item.stock || 0) - qty;
        }
        transactions.unshift({
            id: transactionId++,
            type: 'ADJUSTMENT',
            date: document.getElementById('adjDate').value,
            mainId: item.mainId,
            mainName: main ? main.name : '',
            subId: item.subId,
            subName: sub ? sub.name : '',
            itemId: itemId,
            itemName: item.name,
            productCode: getProductCode(item, main, sub),
            quantity: type === 'add' ? qty : -qty,
            weight: item.weight,
            length: item.length,
            customer: 'Adjustment'
        });
        saved = true;
    }
    if (errors.length > 0) { alert('Errors:\n' + errors.join('\n')); return; }
    if (!saved) { alert('No valid items'); return; }
    saveAll(); refreshTransactions(); refreshDashboard(); refreshStockList(); refreshLowStockReport(); hideAllForms();
    alert('Adjustment saved!');
}

function saveNewOrder() {
    let customerId = document.getElementById('newCustomerId').value;
    let customerName = '';
    let customer = customers.find(c => c.id == customerId);
    if (customer) {
        customerName = customer.name + ' (' + customer.uniqueId + ')';
    } else {
        alert('Select customer');
        return;
    }
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

        if (length && length > 0) {
            item.length = length;
        }

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
    orders.unshift({
        id: orderId++,
        date: document.getElementById('orderDate').value,
        customerName: customerName,
        customerId: parseInt(customerId),
        items: orderItems,
        totalQty: totalQty,
        totalKg: totalKg,
        status: 'pending'
    });
    saveAll(); refreshOrdersList(); hideNewOrderForm(); refreshDashboard(); refreshStockList();
    alert('Order created!');
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

function completeOrder(orderId) {
    let order = orders.find(o => o.id === orderId);
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
    (order.items || []).forEach(item => {
        let invItem = items.find(i => i.id === item.itemId);
        if (!invItem) return;
        let remainingToFulfill = (item.quantity || 0) - (item.fulfilled || 0);
        if (remainingToFulfill > 0) {
            invItem.stock = (invItem.stock || 0) - remainingToFulfill;
            item.fulfilled = (item.fulfilled || 0) + remainingToFulfill;
            transactions.unshift({
                id: transactionId++,
                type: 'SALE',
                date: new Date().toISOString().slice(0, 16),
                mainId: invItem.mainId,
                mainName: mainCategories.find(m => m.id === invItem.mainId)?.name || '',
                subId: invItem.subId,
                subName: subCategories.find(s => s.id === invItem.subId)?.name || '',
                itemId: item.itemId,
                itemName: invItem.name,
                productCode: item.productCode,
                quantity: remainingToFulfill,
                weight: invItem.weight,
                length: invItem.length,
                customer: order.customerName + ' (Order Complete)'
            });
        }
    });
    order.status = 'completed';
    saveAll();
    refreshOrdersList();
    refreshDashboard();
    refreshStockList();
    refreshLowStockReport();
    refreshTransactions();
    alert(`Order #${orderId} completed!`);
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

function updateOrder(orderId) {
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

        if (length && length > 0) {
            item.length = length;
        }

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

    if (orderItems.length === 0) {
        alert('Please add at least one item');
        return;
    }

    order.date = document.getElementById('editOrderDate').value;
    order.items = orderItems;
    order.totalQty = totalQty;
    order.totalKg = totalKg;

    saveAll();
    refreshOrdersList();
    closeEditModal();
    alert('Order updated successfully!');
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

function confirmDeleteOrder() {
    let orderId = parseInt(document.getElementById('deleteOrderId').textContent);
    orders = orders.filter(o => o.id !== orderId);
    saveAll(); closeDeleteModal(); refreshOrdersList(); refreshDashboard(); refreshStockList(); refreshLowStockReport();
    alert('Order deleted successfully!');
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

function deleteMainCategory(id) {
    let subCount = subCategories.filter(s => s.mainId === id).length;
    if (subCount > 0) {
        alert(`Cannot delete brand because it has ${subCount} size(s). Please delete all sizes first.`);
        return;
    }
    if (confirm('Are you sure you want to delete this brand?')) {
        items = items.filter(i => i.mainId !== id);
        mainCategories = mainCategories.filter(m => m.id !== id);
        saveAll();
        refreshCategoriesView();
        refreshDashboard();
        refreshStockList();
        refreshLowStockReport();
    }
}

function saveMainCategory() {
    let id = document.getElementById('editMainCategoryId').value;
    let name = document.getElementById('mainCategoryName').value;
    let code = document.getElementById('mainCategoryCode').value;
    let color = document.getElementById('mainCategoryColor').value;
    let lowStockLimit = parseInt(document.getElementById('mainCategoryLowStock').value) || 10;
    if (!name) { alert('Enter brand name'); return; }
    if (id) {
        let main = mainCategories.find(m => m.id == id);
        if (main) {
            main.name = name; main.color = color; main.lowStockLimit = lowStockLimit;
            if (code) main.code = code;
        }
        alert('Brand updated!');
    } else {
        let newId = mainCategories.length > 0 ? Math.max(...mainCategories.map(m => m.id)) + 1 : 1;
        mainCategories.push({ id: newId, code: code || String(newId).padStart(2, '0'), name, color, lowStockLimit });
        alert('Brand added!');
    }
    saveAll();
    refreshCategoriesView();
    refreshDashboard();
    refreshStockList();
    refreshLowStockReport();
    closeAddMainCategoryModal();
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

function deleteSubCategory(id) {
    let itemCount = items.filter(i => i.subId === id).length;
    if (itemCount > 0) {
        alert(`Cannot delete size because it has ${itemCount} item(s). Please delete all items first.`);
        return;
    }
    if (confirm('Are you sure you want to delete this size?')) {
        subCategories = subCategories.filter(s => s.id !== id);
        resequenceCodes();
        refreshCategoriesView();
        refreshDashboard();
        refreshStockList();
        refreshLowStockReport();
    }
}

function saveSubCategory() {
    let id = document.getElementById('editSubCategoryId').value;
    let mainId = parseInt(document.getElementById('subCategoryMainSelect').value);
    let sizeValue = document.getElementById('subCategoryName').value;
    let unit = document.getElementById('subCategoryUnit').value;
    if (!sizeValue) { alert('Enter size'); return; }
    let fullName = sizeValue + (unit === 'inch' ? '"' : 'mm');

    let main = mainCategories.find(m => m.id === mainId);
    let mainCode = (main && main.code) ? main.code : String(mainId).padStart(2, '0');

    if (id) {
        let sub = subCategories.find(s => s.id == id);
        if (sub) { sub.mainId = mainId; sub.name = fullName; }
        alert('Size updated!');
    } else {
        let newId = subCategories.length > 0 ? Math.max(...subCategories.map(s => s.id)) + 1 : 1;
        subCategories.push({ id: newId, code: '', mainId, name: fullName });
        resequenceCodes();
        alert('Size added!');
    }
    refreshCategoriesView();
    refreshDashboard();
    refreshStockList();
    refreshLowStockReport();
    closeAddSubCategoryModal();
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

function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        items = items.filter(i => i.id != id);
        resequenceCodes();
        refreshCategoriesView();
        refreshDashboard();
        refreshStockList();
        refreshLowStockReport();
    }
}

function saveItem() {
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

    let mainCode = (main && main.code) ? main.code : String(mainId).padStart(2, '0');
    let subCode = (sub && sub.code) ? sub.code : (mainCode + String(subId).padStart(3, '0'));

    if (id) {
        let item = items.find(i => i.id == id);
        if (item) {
            item.mainId = mainId;
            item.subId = subId;
            item.length = length;
            item.weight = weight;
            item.stock = stock;
            item.minStock = minStock;
        }
        alert('Item updated!');
    } else {
        let newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
        items.push({ id: newId, code: '', mainId, subId, name: '', length, weight, stock, minStock });
        resequenceCodes();
        alert('Item added!');
    }
    refreshCategoriesView();
    refreshDashboard();
    refreshStockList();
    refreshLowStockReport();
    closeAddItemModal();
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
    if (!name || !username || !password) { alert('Fill all fields'); return; }
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
document.addEventListener('DOMContentLoaded', function () {
    if (currentUser) {
        loadData();
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        document.getElementById('usernameDisplay').textContent = currentUser.username;
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
});