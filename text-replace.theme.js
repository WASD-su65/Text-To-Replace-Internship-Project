(function() {
    'use strict';
    
    function toggleTheme() {
        const html = document.documentElement;
        const btn = document.getElementById('btnTheme');
        const currentTheme = html.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        html.setAttribute('data-theme', newTheme);
        btn.textContent = newTheme === 'light' ? '🌙 Dark' : '☀️ Light';
        localStorage.setItem('theme', newTheme);
        
        if (window.parent !== window) {
            window.parent.postMessage({ type: 'themeChanged', theme: newTheme }, '*');
        }
    }
    
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        const themeBtn = document.getElementById('btnTheme');
        if (themeBtn) {
            themeBtn.textContent = savedTheme === 'light' ? '🌙 Dark' : '☀️ Light';
            themeBtn.addEventListener('click', toggleTheme);
        }
        
        window.addEventListener('message', function(e) {
            if (e.data.type === 'themeChanged') {
                const newTheme = e.data.theme;
                document.documentElement.setAttribute('data-theme', newTheme);
                if (themeBtn) {
                    themeBtn.textContent = newTheme === 'light' ? '🌙 Dark' : '☀️ Light';
                }
            }
        });
    }
    
    window.TextReplaceTheme = { initTheme, toggleTheme };
})();