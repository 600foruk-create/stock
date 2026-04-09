<div id="reports" class="tab-content">
    <div class="search-filter-bar no-print">
        <div class="form-group" style="flex:2;">
            <label>Search Reports</label>
            <input type="text" id="reportSearch" class="form-control" placeholder="Filter by title or date..." oninput="refreshReportsList()">
        </div>
        <div class="btn-group">
            <button class="btn btn-secondary" onclick="refreshReportsList()">🔄 Refresh List</button>
        </div>
    </div>

    <!-- Reports List View -->
    <div id="reportsListSection">
        <div class="card">
            <div class="table-responsive">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Report Title</th>
                            <th style="text-align: center;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="reportsTableBody">
                        <tr>
                            <td colspan="3" style="text-align:center; padding: 2rem;">Loading reports...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Report Detail View (Hidden by default) -->
    <div id="reportDetailSection" style="display: none;">
        <div class="no-print" style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
            <button class="btn btn-secondary" onclick="backToReportsList()">⬅️ Back to List</button>
            <div class="btn-group">
                <button class="btn btn-print" onclick="window.print()">🖨️ Print Report</button>
                <button class="btn btn-success" id="exportExcelBtn">📊 Export to Excel</button>
                <button class="btn btn-danger" id="deleteReportBtn">🗑️ Delete Report</button>
            </div>
        </div>
        
        <div id="reportContentView" class="printable-report">
            <!-- Dynamically populated -->
        </div>
    </div>
</div>

<style>
    .printable-report {
        background: white;
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: var(--shadow-sm);
    }
    
    .report-meta {
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid var(--gray-200);
    }

    @media print {
        #reportsListSection, .no-print, .search-filter-bar {
            display: none !important;
        }
        #reportDetailSection {
            display: block !important;
        }
        .tab-content {
            padding: 0 !important;
        }
        .main-content {
            margin: 0 !important;
            padding: 0 !important;
        }
    }
</style>
