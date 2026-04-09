<div id="reports" class="tab-content">
    <div class="search-filter-bar no-print">
        <div class="form-group">
            <label>Search Reports</label>
            <input type="text" id="reportSearch" class="form-control" placeholder="Search by date or notes..." oninput="refreshReportsList()">
        </div>
        <div class="btn-group">
            <button class="btn btn-secondary" onclick="refreshReportsList()">🔄 Refresh List</button>
        </div>
    </div>

    <div class="reports-container">
        <div class="table-responsive">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Audit Date</th>
                        <th>Saved At</th>
                        <th>Total Items</th>
                        <th>Notes</th>
                        <th class="no-print">Actions</th>
                    </tr>
                </thead>
                <tbody id="reportsListBody">
                    <!-- Reports will be injected here -->
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Report Details Modal -->
<div id="reportDetailsModal" class="modal">
    <div class="modal-content" style="max-width: 1000px; width: 95%;">
        <div class="modal-header">
            <h2 id="reportModalTitle">Audit Report Details</h2>
            <span class="close-modal" onclick="closeModal('reportDetailsModal')">&times;</span>
        </div>
        <div class="modal-body">
            <div class="btn-group no-print" style="margin-bottom: 1rem;">
                <button class="btn btn-primary" onclick="exportCurrentReportExcel()">📊 Export to Excel</button>
                <button class="btn btn-save" onclick="exportCurrentReportPDF()">🖨️ Print / PDF</button>
            </div>
            
            <div id="reportDetailContent" class="printable-report">
                <!-- Report details will be injected here -->
            </div>
        </div>
    </div>
</div>

<style>
    .reports-container {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-sm);
    }
    .report-action-btn {
        padding: 0.3rem 0.8rem;
        font-size: 0.8rem;
        margin-right: 0.3rem;
    }
    
    @media print {
        .modal {
            position: static !important;
            display: block !important;
            background: none !important;
            padding: 0 !important;
        }
        .modal-content {
            margin: 0 !important;
            width: 100% !important;
            max-width: none !important;
            box-shadow: none !important;
            border: none !important;
        }
        .close-modal, .modal-header .btn-group, .no-print {
            display: none !important;
        }
        .printable-report {
            display: block !important;
        }
    }
</style>
