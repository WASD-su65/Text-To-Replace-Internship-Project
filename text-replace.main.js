(function() {
    'use strict';
    
    function initSidebar() {
        const btnToggle = document.getElementById('btnSidebarToggle');
        if (btnToggle) {
            btnToggle.addEventListener('click', function() {
                if (window.parent !== window) {
                    window.parent.postMessage({ type: 'toggleSidebar' }, '*');
                }
            });
        }
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        window.TextReplaceTheme.initTheme();
        window.TextReplaceTabs.initTabs();
        window.TextReplaceHistory.initHistory();
        window.TextReplaceFileUpload.initFileUpload();
        window.TextReplaceForm.initForm();
        window.TextReplaceAdmin.initAdmin();
        initSidebar();
        
        const adminTokenInput = document.getElementById('adminTokenInput');
        const btnAdminToggle = document.getElementById('btnAdminToggle');
        const tabAdmin = document.getElementById('tabAdmin');
        
        let isAdminEnabled = false;
        
        function updateAdminUI() {
            if (isAdminEnabled) {
                btnAdminToggle.textContent = 'Disable';
                btnAdminToggle.style.background = '#ef4444';
                tabAdmin.style.display = 'block';
            } else {
                btnAdminToggle.textContent = 'Enable';
                btnAdminToggle.style.background = '';
                tabAdmin.style.display = 'none';
            }
        }
        
        if (btnAdminToggle) {
            btnAdminToggle.addEventListener('click', async () => {
                if (isAdminEnabled) {
                    isAdminEnabled = false;
                    localStorage.removeItem('adminToken');
                    updateAdminUI();
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
                    adminTokenInput.value = '';
                    window.TextReplaceAdmin.resetAdminState();
                } else {
                    const token = adminTokenInput.value.trim();
                    if (!token) {
                        alert('กรุณาใส่ Admin Token');
                        return;
                    }
                    
                    try {
                        const response = await fetch('/text-replace/admin/storage-status', {
                            headers: { 'X-Admin-Token': token }
                        });
                        
                        if (response.ok) {
                            isAdminEnabled = true;
                            localStorage.setItem('adminToken', token);
                            updateAdminUI();
                            const adminControls = document.getElementById('adminControls');
                            if (adminControls) adminControls.style.display = 'block';
                            tabAdmin.click();
                        } else {
                            alert('Admin Token ไม่ถูกต้อง');
                        }
                    } catch (error) {
                        alert('เกิดข้อผิดพลาด: ' + error.message);
                    }
                }
            });
        }
        
        updateAdminUI();
    });
})();