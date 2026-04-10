<div id="reports" class="tab-content">
    <div class="search-filter-bar no-print">
        <h2 style="color: var(--sky-600); margin: 0;">📁 Reports Archive</h2>
        <p style="color: var(--gray-500); margin-top: 0.2rem;">Access and manage your saved historical audit reports.</p>
    </div>

    <div style="background: white; border-radius: 12px; border: 1px solid var(--gray-200); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); overflow: hidden;">
        <table class="data-table" style="margin-bottom: 0;">
            <thead style="background: var(--gray-50);">
                <tr>
                    <th style="padding: 1.2rem; text-align: left;">Report Title</th>
                    <th style="padding: 1.2rem; text-align: left;">Date Saved</th>
                    <th style="padding: 1.2rem; text-align: center;">Actions</th>
                </tr>
            </thead>
            <tbody id="archivedReportsBody">
                <!-- Data will be injected here -->
                <tr>
                    <td colspan="3" style="text-align: center; padding: 3rem; color: var(--gray-400);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">📂</div>
                        No archived reports found.
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>

<div id="reportViewerModal" class="modal" style="display:none; position: fixed; z-index: 1100; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6); backdrop-filter: blur(4px);">
    <div class="modal-content" style="background-color: #fefefe; margin: 2% auto; padding: 0; border: none; width: 90%; max-width: 1000px; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); position: relative; animation: slideDown 0.3s ease-out;">
        <div class="modal-header" style="background: var(--sky-600); color: white; padding: 1.5rem 2rem; border-radius: 16px 16px 0 0; display: flex; justify-content: space-between; align-items: center;">
            <h2 id="reportViewerTitle" style="margin: 0; font-size: 1.5rem;">Report Details</h2>
            <div style="display: flex; gap: 0.8rem; align-items: center;">
                <button class="btn btn-print no-print" onclick="printArchivedReport()" style="background: white; color: var(--sky-600); border: none; font-weight: 600;">🖨️ Print</button>
                <button class="btn no-print" onclick="exportArchivedToExcel()" style="background: #16a34a; color: white; border: none; font-weight: 600;">📥 Excel</button>
                <button class="btn no-print" onclick="exportArchivedToPdf()" style="background: #ea580c; color: white; border: none; font-weight: 600;">📄 PDF</button>
                <span class="close no-print" onclick="closeReportViewer()" style="color: white; font-size: 2rem; cursor: pointer; margin-left: 1rem;">&times;</span>
            </div>
        </div>
        <div class="modal-body" style="padding: 2rem; max-height: 70vh; overflow-y: auto;">
            <div id="archivedReportContent">
                <!-- Historical report data injected here -->
            </div>
        </div>
    </div>
</div>

<style>
@keyframes slideDown {
    from { transform: translateY(-30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
.report-action-btn {
    padding: 0.5rem 0.8rem;
    border-radius: 6px;
    border: 1px solid var(--gray-200);
    background: white;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 0.85rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
}
.report-action-btn:hover {
    background: var(--gray-50);
    border-color: var(--sky-400);
}
.report-action-btn.delete:hover {
    background: #fef2f2;
    border-color: #f87171;
    color: #ef4444;
}
</style>
