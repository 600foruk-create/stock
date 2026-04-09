// Sidecar for Historical Audit Reports
if (typeof window.auditReports === 'undefined') window.auditReports = [];
if (typeof window.currentViewingReport === 'undefined') window.currentViewingReport = null;

// Function to fetch reports from API
async function fetchAuditReports() {
    try {
        const res = await fetch('api/sync.php?action=get_all');
        const json = await res.json();
        if (json.status === 'success') {
            window.auditReports = json.data.auditReports || [];
            if (window.refreshReportsList) window.refreshReportsList();
        }
    } catch (e) { console.error("Error fetching reports:", e); }
}

// Global functions for the reports module
window.savePermanentAuditReport = function() {
    let reportDate = document.getElementById('auditDateTo')?.value || new Date().toISOString().split('T')[0];
    let itemsToSave = [];
    
    // items and auditSession are global from main.js
    if (typeof items === 'undefined') return;

    items.forEach(item => {
        let godownPcs = auditSession[item.id];
        if (godownPcs !== undefined && godownPcs !== "") {
            let weightVal = parseFloat(item.weight) || 0;
            let systemPcs = parseInt(item.stock) || 0;
            itemsToSave.push({
                itemId: item.id,
                systemQty: systemPcs,
                godownQty: parseInt(godownPcs),
                weight: weightVal,
                length: item.length || 13,
                mainId: item.mainId,
                subId: item.subId
            });
        }
    });

    if (itemsToSave.length === 0) {
        if(window.showToast) showToast("No audit data to save!", "error");
        else alert("No audit data to save!");
        return;
    }

    if (!confirm(`Save this audit as a permanent historical report for ${reportDate}?`)) return;

    syncData('save_audit_report', { 
        report: { date: reportDate, notes: "" },
        items: itemsToSave
    }).then(res => {
        if (res.status === 'success') {
            if(window.showToast) showToast("Audit report saved successfully!");
            else alert("Audit report saved successfully!");
            fetchAuditReports(); // Reload lists
        }
    });
};

window.refreshReportsList = function() {
    const searchVal = (document.getElementById('reportSearch')?.value || '').toLowerCase();
    const body = document.getElementById('reportsListBody');
    if (!body) return;

    let html = '';
    window.auditReports.filter(r => 
        (r.audit_date || '').includes(searchVal) || (r.notes || '').toLowerCase().includes(searchVal)
    ).forEach(report => {
        html += `
            <tr>
                <td style="padding: 1rem; border-bottom: 1px solid var(--gray-100);"><strong>${report.audit_date}</strong></td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--gray-100);">${new Date(report.created_at).toLocaleString()}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--gray-100);">${report.total_items} items</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--gray-100);">${report.notes || '-'}</td>
                <td style="padding: 1rem; border-bottom: 1px solid var(--gray-100);" class="no-print">
                    <button class="btn btn-primary report-action-btn" onclick="viewReportDetails(${report.id})">👁️ View</button>
                    <button class="btn btn-danger report-action-btn" onclick="deleteReport(${report.id})">🗑️ Delete</button>
                </td>
            </tr>
        `;
    });
    body.innerHTML = html || '<tr><td colspan="5" style="text-align:center; padding:2rem;">No reports found</td></tr>';
};

window.viewReportDetails = function(id) {
    const report = window.auditReports.find(r => r.id == id);
    if (!report) return;
    window.currentViewingReport = report;
    
    document.getElementById('reportModalTitle').textContent = `Audit Report Details - ${report.audit_date}`;
    let html = `
        <div style="margin-bottom: 1rem; overflow-x: auto;">
            <table class="audit-table" id="reportDetailsTable" style="width:100%; border-collapse:collapse; background: white; font-size: 0.9rem;">
                <thead>
                    <tr>
                        <th style="border:1px solid #ddd; padding:10px; background:#f8f9fa; text-align: left;">Brand/Size</th>
                        <th style="border:1px solid #ddd; padding:10px; background:#f8f9fa;">Weight</th>
                        <th style="border:1px solid #ddd; padding:10px; background:#f8f9fa;">Length</th>
                        <th style="border:1px solid #ddd; padding:10px; background:#f8f9fa;">System (Pcs)</th>
                        <th style="border:1px solid #ddd; padding:10px; background:#f8f9fa;">Godown (Pcs)</th>
                        <th style="border:1px solid #ddd; padding:10px; background:#f8f9fa;">Difference</th>
                    </tr>
                </thead>
                <tbody>
    `;

    report.items.forEach(item => {
        let diff = item.godown_qty - item.system_qty;
        let diffClass = diff === 0 ? '' : (diff > 0 ? 'diff-plus' : 'diff-minus');
        html += `
            <tr>
                <td style="border:1px solid #ddd; padding:8px; text-align:left;"><strong>${item.mainName}</strong> - ${item.subName || '?'}</td>
                <td style="border:1px solid #ddd; padding:8px; text-align:center;">${item.weight} KG</td>
                <td style="border:1px solid #ddd; padding:8px; text-align:center;">${item.length} ft</td>
                <td style="border:1px solid #ddd; padding:8px; text-align:center;">${item.system_qty}</td>
                <td style="border:1px solid #ddd; padding:8px; text-align:center; font-weight:700;">${item.godown_qty}</td>
                <td style="border:1px solid #ddd; padding:8px; text-align:center; color:${diff >= 0 ? '#16a34a' : '#ef4444'}; font-weight:bold;">${(diff > 0 ? '+' : '') + diff}</td>
            </tr>
        `;
    });

    html += `</tbody></table></div>`;
    document.getElementById('reportDetailContent').innerHTML = html;
    if(window.openModal) openModal('reportDetailsModal');
    else document.getElementById('reportDetailsModal').style.display = 'block';
};

window.deleteReport = function(id) {
    if (!confirm("Are you sure you want to delete this historical report? This action cannot be undone.")) return;
    syncData('delete_audit_report', { id: id }).then(res => {
        if (res.status === 'success') {
            if(window.showToast) showToast("Report deleted");
            fetchAuditReports();
        }
    });
};

window.exportCurrentReportExcel = function() {
    if (!window.currentViewingReport) return;
    const table = document.getElementById('reportDetailsTable');
    let html = table.outerHTML;
    
    let finalHtml = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta charset="UTF-8">
            <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Audit Report</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
            <style>
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #000; padding: 5px; text-align: center; }
                th { background-color: #eee; }
                .diff-plus { color: green; }
                .diff-minus { color: red; }
            </style>
        </head>
        <body>
            <h2>Audit Report - ${window.currentViewingReport.audit_date}</h2>
            ${html}
        </body>
        </html>
    `;

    let blob = new Blob([finalHtml], { type: 'application/vnd.ms-excel' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = `Audit_Report_${window.currentViewingReport.audit_date}.xls`;
    a.click();
};

window.exportCurrentReportPDF = function() {
    window.print();
};

// Auto-fetch on load
document.addEventListener('DOMContentLoaded', () => {
    fetchAuditReports();
});
setTimeout(fetchAuditReports, 1000); // Fail-safe fallback for dynamic loading
