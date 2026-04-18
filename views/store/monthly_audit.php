<div class="store-monthly-audit">
    <div class="card" style="background: white; padding: 2rem; border-radius: 12px; border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm);">
        <h2 style="color: var(--sky-600); margin-bottom: 0.5rem; font-size: 1.8rem; font-weight: 700;">📅 Store Physical Audit</h2>
        <p style="color: var(--gray-500); margin-bottom: 2rem;">Enter manually counted quantities for each item. The system will calculate discrepancies automatically.</p>
        
        <div id="storeAuditItemsList" style="overflow-x: auto;">
            <!-- Populated by JS -->
        </div>
        
        <div style="margin-top: 2rem; display: flex; justify-content: flex-end; gap: 1rem;">
            <button class="btn btn-secondary" onclick="refreshStoreAuditTable()">
                <i class="fas fa-redo"></i> Reset Table
            </button>
            <button class="btn btn-primary btn-lg" onclick="saveStoreAuditReport()" style="padding: 0.8rem 2.5rem; font-weight: 700; border-radius: 12px; box-shadow: 0 4px 12px rgba(12, 166, 242, 0.3);">
                <i class="fas fa-save"></i> Save & Archive Audit
            </button>
        </div>
    </div>
</div>
