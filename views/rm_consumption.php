<div class="rm-consumption">
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; gap: 1rem; flex-wrap: wrap;">
        <div>
            <h2 style="color: var(--sky-600); margin: 0;">🔄 PR vs RM Consumption</h2>
            <p style="color: var(--gray-500); margin-top: 4px;">Real-time comparison of Production vs Raw Material Usage.</p>
        </div>
    </div>

    <!-- WIP Summary Dashboard -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem;">
        <!-- Card 1: FG Production -->
        <div style="background: white; padding: 1.5rem; border-radius: 16px; border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm); display: flex; align-items: center; justify-content: center; text-align: center;">
            <div>
                <span style="font-size: 0.8rem; font-weight: 800; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 8px;">Latest FG Production</span>
                <div id="wipFGWeight" style="font-size: 2.2rem; font-weight: 900; color: var(--gray-800);">0.0 KG</div>
            </div>
        </div>

        <!-- Card 2: RM Issuance -->
        <div style="background: white; padding: 1.5rem; border-radius: 16px; border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm); display: flex; align-items: center; justify-content: center; text-align: center;">
            <div>
                <span style="font-size: 0.8rem; font-weight: 800; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 8px;">Latest RM Issuance</span>
                <div id="wipRMWeight" style="font-size: 2.2rem; font-weight: 900; color: var(--gray-800);">0.0 KG</div>
            </div>
        </div>

        <!-- Card 3: WIP GAP -->
        <div style="background: white; padding: 1.5rem; border-radius: 16px; border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm); display: flex; align-items: center; justify-content: center; text-align: center;">
            <div>
                <span style="font-size: 0.8rem; font-weight: 800; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.8px; display: block; margin-bottom: 8px;">Work In Process</span>
                <div id="wipGapTotal" style="font-size: 2.2rem; font-weight: 900; color: var(--gray-800);">0.0 KG</div>
            </div>
        </div>
    </div>

    <div class="table-container" style="display: none;"> <!-- Keep original table hidden or optional for now as requested for specific boxes -->
        <table class="data-table">
            <thead>
                <tr>
                    <th>FG Item Produced</th>
                    <th>Expected RM Usage</th>
                    <th>Actual RM Usage</th>
                    <th>Variance (%)</th>
                </tr>
            </thead>
            <tbody id="rmConsumptionTable"></tbody>
        </table>
    </div>
</div>
