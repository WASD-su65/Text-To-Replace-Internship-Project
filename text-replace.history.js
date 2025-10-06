(function() {
    'use strict';
    
    async function loadHistory() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;
        
        try {
            const response = await fetch('/text-replace/history');
            if (!response.ok) throw new Error('Failed to load history');
            
            const data = await response.json();
            const history = data.history || [];
            
            if (history.length === 0) {
                historyList.innerHTML = `
                    <div class="history-empty">
                        <div style="font-size: 48px; margin-bottom: 16px;">📄</div>
                        <div>ยังไม่มีประวัติการแก้ไข</div>
                        <div style="font-size: 12px; margin-top: 8px;">เริ่มแทนที่ข้อความเพื่อดูประวัติ</div>
                    </div>
                `;
                return;
            }
            
            historyList.innerHTML = history.map(item => `
                <div class="history-item">
                    <div class="history-header">
                        <div class="history-time">${item.timestamp}</div>
                        ${item.zip_available ? `
                            <a href="/text-replace/history/${item.zip_id}/download" 
                               class="btn" style="font-size: 12px; padding: 4px 8px;">
                                📥 ดาวน์โหลด
                            </a>
                        ` : `
                            <span style="font-size: 12px; color: var(--text-secondary);">⏰ หมดอายุ</span>
                        `}
                    </div>
                    <div class="history-details">
                        <strong>ค้นหา:</strong> "${escapeHtml(item.find_text)}" → <strong>แทนที่:</strong> "${escapeHtml(item.replace_text)}"
                        <span style="margin-left: 12px; padding: 4px 8px; background: rgba(16,185,129,0.1); border-radius: 4px; font-size: 12px; color: var(--success-color); font-weight: 600;">
                            [${createSummaryFromFields(item)}]
                        </span>
                    </div>
                    <div class="history-stats">
                        <span>📁 ${item.total_files} ไฟล์</span>
                        <span class="summary-badge" style="background: rgba(16,185,129,0.1); color: var(--success-color); padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">${item.summary || item.success_rate}</span>
                    </div>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Error loading history:', error);
            historyList.innerHTML = `
                <div class="history-empty">
                    <div style="color: #ef4444;">⚠️ ไม่สามารถโหลดประวัติได้</div>
                </div>
            `;
        }
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function createSummaryFromFields(item) {
        if (item.total_replacements !== undefined) {
            const result = [];
            if (item.total_replacements > 0) result.push(`${item.total_replacements}x`);
            if (item.files_with_matches > 0) result.push(`${item.files_with_matches}ok`);
            if (item.files_no_matches > 0) result.push(`${item.files_no_matches}no`);
            if (item.failed > 0) result.push(`${item.failed}err`);
            return result.length > 0 ? result.join('|') : 'none';
        }
        return item.success_rate || 'none';
    }
    
    function addToHistory(item) {
        loadHistory();
    }
    
    function clearHistory() {
        alert('ประวัติจะถูกลบอัตโนมัติหลังจาก 24 ชั่วโมง\nไม่สามารถลบด้วยตนเองได้เพื่อความปลอดภัย');
    }
    
    function initHistory() {
        const clearBtn = document.getElementById('btnClearHistory');
        if (clearBtn) {
            clearBtn.addEventListener('click', clearHistory);
        }
        loadHistory();
    }
    
    window.TextReplaceHistory = { initHistory, loadHistory, addToHistory, clearHistory };
})();