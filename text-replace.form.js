(function() {
    'use strict';
    
    function initForm() {
        const form = document.getElementById('textReplaceForm');
        const findText = document.getElementById('findText');
        const replaceText = document.getElementById('replaceText');
        
        if (!form || !findText || !replaceText) return;
        
        findText.addEventListener('input', updateProcessButton);
        replaceText.addEventListener('input', updateProcessButton);
        
        form.addEventListener('submit', handleFormSubmit);
    }
    
    function updateProcessButton() {
        const findText = document.getElementById('findText')?.value.trim() || '';
        const replaceText = document.getElementById('replaceText')?.value.trim() || '';
        const processBtn = document.getElementById('processBtn');
        const selectedFiles = window.TextReplaceFileUpload.getSelectedFiles();
        
        if (processBtn) {
            processBtn.disabled = !findText || !replaceText || selectedFiles.length === 0;
        }
    }
    
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const findText = document.getElementById('findText').value.trim();
        const replaceText = document.getElementById('replaceText').value.trim();
        const selectedFiles = window.TextReplaceFileUpload.getSelectedFiles();
        
        if (!findText || !replaceText || selectedFiles.length === 0) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }
        
        const progressSection = document.getElementById('progressSection');
        const resultsSection = document.getElementById('resultsSection');
        const processBtn = document.getElementById('processBtn');
        
        if (progressSection) progressSection.style.display = 'block';
        if (resultsSection) resultsSection.style.display = 'none';
        if (processBtn) {
            processBtn.disabled = true;
            processBtn.classList.add('processing');
        }
        
        try {
            const formData = new FormData();
            formData.append('find_text', findText);
            formData.append('replace_text', replaceText);
            
            selectedFiles.forEach(file => {
                formData.append('files', file);
            });
            
            const response = await fetch('/text-replace/process', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'เกิดข้อผิดพลาด');
            }
            
            const result = await response.json();
            showResults(result);
            
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
        } finally {
            if (progressSection) progressSection.style.display = 'none';
            if (processBtn) {
                processBtn.disabled = false;
                processBtn.classList.remove('processing');
            }
        }
    }
    
    function showResults(result) {
        displayResults(result);
        
        const resultSummary = document.getElementById('resultSummary');
        if (resultSummary && result.summary.successful > 0) {
            const downloadDiv = document.createElement('div');
            downloadDiv.style.cssText = 'margin-top: 16px; text-align: center;';
            
            const downloadLink = document.createElement('a');
            downloadLink.href = `/text-replace/download/${result.zip_id}`;
            downloadLink.className = 'download-btn';
            downloadLink.textContent = 'ดาวน์โหลดไฟล์ที่แก้ไขแล้ว';
            
            downloadDiv.appendChild(downloadLink);
            resultSummary.appendChild(downloadDiv);
        }
        
        if (window.TextReplaceHistory && window.TextReplaceHistory.addToHistory) {
            window.TextReplaceHistory.addToHistory({});
        }
        
        window.TextReplaceFileUpload.clearAllFiles();
        document.getElementById('findText').value = '';
        document.getElementById('replaceText').value = '';
        updateProcessButton();
    }
    
    window.TextReplaceForm = { initForm, updateProcessButton };
})();