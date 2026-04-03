<div id="audit" class="tab-content">
    <div class="action-buttons no-print" style="margin-bottom: 2rem; display: flex; flex-wrap: wrap; gap: 1rem; align-items: flex-end; background: white; padding: 1.5rem; border-radius: 12px; box-shadow: var(--shadow-sm);">
        <div class="form-group" style="flex: 1; min-width: 180px; margin-bottom: 0;">
            <label style="font-size: 0.85rem; color: var(--gray-600); margin-bottom: 0.4rem; display: block;">Search Brand or Size</label>
            <input type="text" id="auditSearch" class="form-control" placeholder="Search..." oninput="refreshAuditList()">
        </div>
        <div class="form-group" style="margin-bottom: 0;">
            <label style="font-size: 0.85rem; color: var(--gray-600); margin-bottom: 0.4rem; display: block;">From Date</label>
            <input type="date" id="auditDateFrom" class="form-control" onchange="refreshAuditList()">
        </div>
        <div class="form-group" style="margin-bottom: 0;">
            <label style="font-size: 0.85rem; color: var(--gray-600); margin-bottom: 0.4rem; display: block;">To Date</label>
            <input type="date" id="auditDateTo" class="form-control" onchange="refreshAuditList()">
        </div>
        <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-print" onclick="window.print()">🖨️ Print Audit</button>
            <button class="btn btn-secondary" onclick="clearAuditFilters()">🧹 Clear</button>
        </div>
    </div>
    
    <div id="printableAudit">
        <div class="print-header">
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.5rem;">
                <div id="auditPrintLogo" style="font-size: 2.5rem;">📦</div>
                <h1 id="auditPrintCompanyName" style="margin:0;">StockFlow</h1>
            </div>
            <p style="color:var(--gray-500); margin:0;">Monthly Stock Audit Report - <span id="auditPrintDate"></span></p>
        </div>

        <div id="auditListContainer"></div>
    </div>
</div>

<style>
    .audit-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 2rem;
        background: white;
        font-size: 0.9rem;
    }
    .audit-table th {
        background: var(--gray-100);
        color: var(--gray-700);
        padding: 10px;
        border: 1px solid var(--gray-300);
        text-align: center;
        font-weight: 600;
    }
    .audit-table td {
        padding: 8px;
        border: 1px solid var(--gray-200);
        text-align: center;
    }
    .audit-brand-header {
        background: var(--sky-600);
        color: white;
        padding: 12px 20px;
        font-size: 1.1rem;
        font-weight: 600;
        border-radius: 8px 8px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .godown-input {
        width: 80px;
        padding: 5px;
        border: 2px solid var(--sky-200);
        border-radius: 4px;
        text-align: center;
        font-weight: bold;
        transition: all 0.2s;
    }
    .godown-input:focus {
        border-color: var(--sky-500);
        outline: none;
        box-shadow: 0 0 5px rgba(14, 165, 233, 0.2);
    }
    .diff-plus { color: var(--green-600); font-weight: bold; }
    .diff-minus { color: #ef4444; font-weight: bold; }
    
    @media print {
        .audit-brand-header {
            background: #f0f0f0 !important;
            color: black !important;
            border: 1px solid #000 !important;
            border-radius: 0 !important;
            -webkit-print-color-adjust: exact;
        }
        .audit-table th {
            background: #e0e0e0 !important;
            color: black !important;
            border: 1px solid #000 !important;
        }
        .audit-table td {
            border: 1px solid #000 !important;
        }
        .godown-input {
            border: none !important;
            background: transparent !important;
        }
    }
</style>
