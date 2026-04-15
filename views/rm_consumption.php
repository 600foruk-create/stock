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
        <div style="background: white; padding: 1.5rem; border-radius: 16px; border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 1.2rem;">
            <div style="font-size: 2rem; background: #fff7ed; padding: 12px; border-radius: 12px; color: #ea580c;">🏗️</div>
            <div>
                <span style="font-size: 0.75rem; font-weight: 800; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.5px;">Latest FG Production</span>
                <div id="wipFGDate" style="font-size: 0.8rem; color: #ea580c; font-weight: 700; margin: 2px 0;">--</div>
                <div id="wipFGWeight" style="font-size: 1.5rem; font-weight: 900; color: var(--gray-800);">0.0 KG</div>
            </div>
        </div>

        <!-- Card 2: RM Issuance -->
        <div style="background: white; padding: 1.5rem; border-radius: 16px; border: 1px solid var(--gray-200); box-shadow: var(--shadow-sm); display: flex; align-items: center; gap: 1.2rem;">
            <div style="font-size: 2rem; background: var(--sky-50); padding: 12px; border-radius: 12px; color: var(--sky-600);">🥣</div>
            <div>
                <span style="font-size: 0.75rem; font-weight: 800; color: var(--gray-400); text-transform: uppercase; letter-spacing: 0.5px;">Latest RM Issuance</span>
                <div id="wipRMDate" style="font-size: 0.8rem; color: var(--sky-700); font-weight: 700; margin: 2px 0;">--</div>
                <div id="wipRMWeight" style="font-size: 1.5rem; font-weight: 900; color: var(--gray-800);">0.0 KG</div>
            </div>
        </div>

        <!-- Card 3: WIP GAP -->
        <div style="background: linear-gradient(135deg, var(--sky-600), var(--sky-700)); padding: 1.5rem; border-radius: 16px; color: white; box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.3); display: flex; align-items: center; gap: 1.2rem;">
            <div style="font-size: 2rem; background: rgba(255,255,255,0.2); padding: 12px; border-radius: 12px;">📊</div>
            <div>
                <span style="font-size: 0.75rem; font-weight: 800; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.5px;">Work in Process (WIP)</span>
                <div style="font-size: 0.8rem; font-weight: 700; margin: 2px 0; color: rgba(255,255,255,0.9);">Inbound - Outbound</div>
                <div id="wipGapTotal" style="font-size: 1.7rem; font-weight: 900; line-height: 1;">0.0 KG</div>
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
