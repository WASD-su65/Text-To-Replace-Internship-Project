(function() {
    'use strict';
    
    function switchTab(tabName) {
        document.getElementById('replaceTab').classList.remove('active');
        document.getElementById('historyTab').classList.remove('active');
        const adminTab = document.getElementById('adminTab');
        if (adminTab) adminTab.classList.remove('active');
        
        document.getElementById('tabReplace').classList.remove('active');
        document.getElementById('tabHistory').classList.remove('active');
        const tabAdmin = document.getElementById('tabAdmin');
        if (tabAdmin) tabAdmin.classList.remove('active');
        
        if (tabName === 'replace') {
            document.getElementById('replaceTab').classList.add('active');
            document.getElementById('tabReplace').classList.add('active');
        } else if (tabName === 'history') {
            document.getElementById('historyTab').classList.add('active');
            document.getElementById('tabHistory').classList.add('active');
            window.TextReplaceHistory.loadHistory();
        } else if (tabName === 'admin' && adminTab) {
            adminTab.classList.add('active');
            tabAdmin.classList.add('active');
        }
    }
    
    function initTabs() {
        document.getElementById('tabReplace').addEventListener('click', function() {
            switchTab('replace');
        });
        
        document.getElementById('tabHistory').addEventListener('click', function() {
            switchTab('history');
        });
        
        const tabAdmin = document.getElementById('tabAdmin');
        if (tabAdmin) {
            tabAdmin.addEventListener('click', function() {
                switchTab('admin');
            });
        }
    }
    
    window.TextReplaceTabs = { initTabs, switchTab };
})();