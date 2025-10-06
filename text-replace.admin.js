(function() {
    'use strict';
    
    let adminToken = null;
    let isAdminMode = false;
    
    async function checkAdminAccess() {
        const token = localStorage.getItem('adminToken');
        if (!token) return false;
        
        try {
            const response = await fetch('/text-replace/admin/storage-status', {
                headers: { 'X-Admin-Token': token }
            });
            
            if (response.ok) {
                adminToken = token;
                isAdminMode = true;
                return true;
            }
        } catch (error) {
        }
        
        return false;
    }
    

    
    async function loadAdminHistory() {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            resetAdminState();
            return;
        }
        
        adminToken = token;
        isAdminMode = true;
        
        const adminHistoryList = document.getElementById('adminHistoryList');
        if (!adminHistoryList) return;
        
        try {
            const response = await fetch('/text-replace/history');
            if (!response.ok) throw new Error('Failed to load history');
            
            const data = await response.json();
            const history = data.history || [];
            
            if (history.length === 0) {
                adminHistoryList.innerHTML = `
                    <div class="history-empty">
                        <div style="font-size: 48px; margin-bottom: 16px;">📄</div>
                        <div>ไม่มีประวัติ</div>
                    </div>
                `;
                return;
            }
            
            adminHistoryList.innerHTML = history.map(item => `
                <div class="admin-history-item" data-id="${item.id}">
                    <input type="checkbox" class="admin-checkbox" data-id="${item.id}">
                    <div class="admin-item-content">
                        <div class="history-header">
                            <div class="history-time">${item.timestamp}</div>
                            <div class="admin-item-actions">
                                ${item.zip_available ? `
                                    <a href="/text-replace/history/${item.zip_id}/download" 
                                       class="btn" style="font-size: 12px; padding: 4px 8px;">
                                        📥 ดาวน์โหลด
                                    </a>
                                ` : `
                                    <span style="font-size: 12px; color: var(--text-secondary);">⏰ หมดอายุ</span>
                                `}
                                <button class="btn btn-danger" style="font-size: 12px; padding: 4px 8px;" 
                                        onclick="deleteSingleRecord(${item.id})">
                                    🗑️ ลบ
                                </button>
                            </div>
                        </div>
                        <div class="history-details">
                            <strong>ค้นหา:</strong> "${escapeHtml(item.find_text)}" → <strong>แทนที่:</strong> "${escapeHtml(item.replace_text)}"
                        </div>
                        <div class="history-stats">
                            <span>📁 ${item.total_files} ไฟล์</span>
                            <span>✅ ${item.successful} สำเร็จ</span>
                            <span>❌ ${item.failed} ล้มเหลว</span>
                            <span>📊 ${item.success_rate}</span>
                        </div>
                    </div>
                </div>
            `).join('');
            
            document.querySelectorAll('.admin-checkbox').forEach(checkbox => {
                checkbox.addEventListener('change', updateDeleteButton);
            });
            
        } catch (error) {
            console.error('Error loading admin history:', error);
            adminHistoryList.innerHTML = `
                <div class="history-empty">
                    <div style="color: #ef4444;">⚠️ ไม่สามารถโหลดประวัติได้</div>
                </div>
            `;
        }
    }
    
    async function loadStorageStatus() {
        const token = localStorage.getItem('adminToken');
        if (!token) return;
        
        adminToken = token;
        isAdminMode = true;
        
        try {
            const response = await fetch('/text-replace/admin/storage-status', {
                headers: {
                    'X-Admin-Token': adminToken
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const storageStatus = document.getElementById('storageStatus');
                const storageInfo = document.getElementById('storageInfo');
                
                if (storageStatus && storageInfo) {
                    storageStatus.style.display = 'block';
                    storageInfo.innerHTML = `
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                            <div style="text-align: center;">
                                <div style="font-size: 18px; font-weight: bold;">${data.total_records}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">ประวัติทั้งหมด</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 18px; font-weight: bold;">${data.available_files}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">ไฟล์ที่ใช้ได้</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 18px; font-weight: bold;">${data.expired_files}</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">ไฟล์หมดอายุ</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 18px; font-weight: bold;">${data.disk_usage.usage_percent}%</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">พื้นที่ใช้แล้ว</div>
                            </div>
                        </div>
                        <div style="margin-top: 15px; font-size: 12px; color: var(--text-secondary);">
                            เก็บไฟล์: ${data.file_retention_days} วัน | เก็บประวัติ: ${data.history_retention_days} วัน
                        </div>
                    `;
                }
            }
        } catch (error) {
            console.error('Error loading storage status:', error);
        }
    }
    
    function updateDeleteButton() {
        const checkboxes = document.querySelectorAll('.admin-checkbox:checked');
        const deleteBtn = document.getElementById('btnDeleteSelected');
        
        if (deleteBtn) {
            deleteBtn.disabled = checkboxes.length === 0;
            deleteBtn.textContent = checkboxes.length > 0 ? 
                `🗑️ ลบที่เลือก (${checkboxes.length})` : 
                '🗑️ ลบที่เลือก';
        }
        
        document.querySelectorAll('.admin-history-item').forEach(item => {
            const checkbox = item.querySelector('.admin-checkbox');
            if (checkbox && checkbox.checked) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }
    
    async function deleteSelectedRecords() {
        if (!isAdminMode || !adminToken) {
            alert('กรุณาเข้าสู่ระบบ Admin ก่อน');
            return;
        }
        
        const checkboxes = document.querySelectorAll('.admin-checkbox:checked');
        const ids = Array.from(checkboxes).map(cb => parseInt(cb.dataset.id));
        
        if (ids.length === 0) {
            alert('กรุณาเลือกรายการที่ต้องการลบ');
            return;
        }
        
        if (!confirm(`คุณต้องการลบประวัติ ${ids.length} รายการหรือไม่?`)) {
            return;
        }
        
        try {
            const formData = new FormData();
            ids.forEach(id => formData.append('record_ids', id));
            
            const response = await fetch('/text-replace/admin/delete-selected', {
                method: 'POST',
                headers: {
                    'X-Admin-Token': adminToken
                },
                body: formData
            });
            
            if (response.ok) {
                const result = await response.json();
                alert(`ลบสำเร็จ ${result.deleted_count} รายการ`);
                loadAdminHistory();
                loadStorageStatus();
            } else {
                const error = await response.json();
                alert('เกิดข้อผิดพลาด: ' + (error.detail || error.error));
            }
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
        }
    }
    
    async function deleteSingleRecord(id) {
        if (!isAdminMode || !adminToken) {
            alert('กรุณาเข้าสู่ระบบ Admin ก่อน');
            return;
        }
        
        if (!confirm('คุณต้องการลบประวัตินี้หรือไม่?')) {
            return;
        }
        
        try {
            const formData = new FormData();
            formData.append('record_ids', id);
            
            const response = await fetch('/text-replace/admin/delete-selected', {
                method: 'POST',
                headers: {
                    'X-Admin-Token': adminToken
                },
                body: formData
            });
            
            if (response.ok) {
                alert('ลบสำเร็จ');
                loadAdminHistory();
                loadStorageStatus();
            } else {
                const error = await response.json();
                alert('เกิดข้อผิดพลาด: ' + (error.detail || error.error));
            }
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
        }
    }
    
    function selectAllCheckboxes() {
        document.querySelectorAll('.admin-checkbox').forEach(cb => {
            cb.checked = true;
        });
        updateDeleteButton();
    }
    
    function deselectAllCheckboxes() {
        document.querySelectorAll('.admin-checkbox').forEach(cb => {
            cb.checked = false;
        });
        updateDeleteButton();
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function resetAdminState() {
        adminToken = null;
        isAdminMode = false;
        const adminHistoryList = document.getElementById('adminHistoryList');
        if (adminHistoryList) {
            adminHistoryList.innerHTML = `
                <div class="history-empty">
                    <div style="font-size: 48px; margin-bottom: 16px;">🔒</div>
                    <div>กรุณาเข้าสู่ระบบ Admin ก่อน</div>
                </div>
            `;
        }
        const storageStatus = document.getElementById('storageStatus');
        if (storageStatus) storageStatus.style.display = 'none';
        const adminControls = document.getElementById('adminControls');
        if (adminControls) adminControls.style.display = 'none';
    }
    
    function initAdmin() {
        checkAdminAccess();
        
        const btnRefreshAdmin = document.getElementById('btnRefreshAdmin');
        const btnSelectAll = document.getElementById('btnSelectAll');
        const btnDeselectAll = document.getElementById('btnDeselectAll');
        const btnDeleteSelected = document.getElementById('btnDeleteSelected');
        
        if (btnRefreshAdmin) {
            btnRefreshAdmin.addEventListener('click', () => {
                loadAdminHistory();
                loadStorageStatus();
            });
        }
        
        if (btnSelectAll) {
            btnSelectAll.addEventListener('click', selectAllCheckboxes);
        }
        
        if (btnDeselectAll) {
            btnDeselectAll.addEventListener('click', deselectAllCheckboxes);
        }
        
        if (btnDeleteSelected) {
            btnDeleteSelected.addEventListener('click', deleteSelectedRecords);
        }
        
        const tabAdmin = document.getElementById('tabAdmin');
        if (tabAdmin) {
            tabAdmin.addEventListener('click', () => {
                loadAdminHistory();
                loadStorageStatus();
            });
        }
    }
    
    window.deleteSingleRecord = deleteSingleRecord;
    
    window.TextReplaceAdmin = { 
        initAdmin, 
        loadAdminHistory, 
        loadStorageStatus,
        checkAdminAccess,
        resetAdminState
    };
})();