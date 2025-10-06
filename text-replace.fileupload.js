(function() {
    'use strict';
    
    let selectedFiles = [];
    
    function initFileUpload() {
        const fileUploadArea = document.getElementById('fileUploadArea');
        const fileInput = document.getElementById('fileInput');
        
        if (!fileUploadArea || !fileInput) return;
        
        fileUploadArea.addEventListener('click', () => fileInput.click());
        fileUploadArea.addEventListener('dragover', handleDragOver);
        fileUploadArea.addEventListener('dragleave', handleDragLeave);
        fileUploadArea.addEventListener('drop', handleDrop);
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        document.getElementById('fileUploadArea').classList.add('dragover');
    }
    
    function handleDragLeave(e) {
        e.preventDefault();
        document.getElementById('fileUploadArea').classList.remove('dragover');
    }
    
    function handleDrop(e) {
        e.preventDefault();
        document.getElementById('fileUploadArea').classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files);
        addFiles(files);
    }
    
    function handleFileSelect(e) {
        const files = Array.from(e.target.files);
        addFiles(files);
    }
    
    function addFiles(files) {
        const validFiles = files.filter(file => {
            const ext = file.name.toLowerCase().split('.').pop();
            return ['docx', 'xlsx'].includes(ext) && file.size <= 10 * 1024 * 1024;
        });
        
        selectedFiles = [...selectedFiles, ...validFiles].slice(0, 50);
        updateFileList();
        window.TextReplaceForm.updateProcessButton();
    }
    
    function removeFile(index) {
        selectedFiles.splice(index, 1);
        updateFileList();
        window.TextReplaceForm.updateProcessButton();
    }
    
    function updateFileList() {
        const fileList = document.getElementById('fileList');
        if (!fileList) return;
        
        while (fileList.firstChild) {
            fileList.removeChild(fileList.firstChild);
        }
        
        selectedFiles.forEach((file, index) => {
            const ext = file.name.toLowerCase().split('.').pop();
            const icon = ext === 'docx' ? '📄' : '📊';
            
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            
            const iconSpan = document.createElement('span');
            iconSpan.className = 'file-icon';
            iconSpan.textContent = icon;
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'file-name';
            nameSpan.textContent = file.name;
            
            const sizeSpan = document.createElement('span');
            sizeSpan.className = 'file-size';
            sizeSpan.textContent = `(${(file.size / 1024).toFixed(1)} KB)`;
            
            fileInfo.appendChild(iconSpan);
            fileInfo.appendChild(nameSpan);
            fileInfo.appendChild(sizeSpan);
            
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.className = 'remove-btn';
            removeBtn.textContent = 'ลบ';
            removeBtn.addEventListener('click', () => removeFile(index));
            
            fileItem.appendChild(fileInfo);
            fileItem.appendChild(removeBtn);
            fileList.appendChild(fileItem);
        });
    }
    
    function getSelectedFiles() {
        return selectedFiles;
    }
    
    function clearFiles() {
        selectedFiles = [];
        updateFileList();
    }
    
    function clearAllFiles() {
        selectedFiles = [];
        updateFileList();
        const fileInput = document.getElementById('fileInput');
        if (fileInput) fileInput.value = '';
    }
    
    window.TextReplaceFileUpload = { 
        initFileUpload, 
        removeFile, 
        getSelectedFiles, 
        clearFiles,
        clearAllFiles,
        updateFileList
    };
})();