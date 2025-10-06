
function displayResults(data) {
    const resultsSection = document.getElementById('resultsSection');
    const resultSummary = document.getElementById('resultSummary');
    const fileDetails = document.getElementById('fileDetails');
    const errorList = document.getElementById('errorList');
    
    resultsSection.style.display = 'block';
    
    const summary = data.summary;
    const hasReplacements = data.results.successful.some(file => file.replacements > 0);
    
    resultSummary.innerHTML = `
        <div style="font-size: 18px; font-weight: 600; margin-bottom: 12px;">
            ${hasReplacements ? '✅' : '⚠️'} การแทนที่ข้อความเสร็จสิ้น
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px;">
            <div>
                <div style="font-size: 24px; font-weight: 700; color: var(--success-color);">${summary.successful}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">ไฟล์สำเร็จ</div>
            </div>
            <div>
                <div style="font-size: 24px; font-weight: 700; color: #ef4444;">${summary.failed}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">ไฟล์ล้มเหลว</div>
            </div>
            <div>
                <div style="font-size: 24px; font-weight: 700; color: var(--primary-color);">${getTotalReplacements(data.results)}</div>
                <div style="font-size: 12px; color: var(--text-secondary);">ครั้งที่แทนที่</div>
            </div>
        </div>
    `;
    
    displayFileDetails(data.results, fileDetails);
    
    if (data.results.failed.length > 0) {
        displayErrors(data.results.failed, errorList);
    } else {
        errorList.innerHTML = '';
    }
}

function displayFileDetails(results, container) {
    const allFiles = [...results.successful, ...results.failed];
    
    if (allFiles.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    const filesWithReplacements = results.successful.filter(f => f.replacements > 0);
    const filesWithoutMatches = results.successful.filter(f => f.replacements === 0);
    
    let html = '<div style="background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 8px; padding: 16px;">';
    html += '<h4 style="margin: 0 0 12px 0; color: var(--text-color);">รายละเอียดไฟล์</h4>';
    
    if (filesWithReplacements.length > 0) {
        html += '<div style="margin-bottom: 16px;">';
        html += '<div style="font-weight: 600; color: var(--success-color); margin-bottom: 8px;">✅ ไฟล์ที่แทนที่สำเร็จ:</div>';
        filesWithReplacements.forEach(file => {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; background: rgba(16,185,129,0.1); border-radius: 4px; margin-bottom: 4px;">
                    <span style="font-size: 14px; color: var(--text-color);">${escapeHtml(file.original_name)}</span>
                    <span style="font-size: 12px; color: var(--success-color); font-weight: 600;">${file.replacements} ครั้ง</span>
                </div>
            `;
        });
        html += '</div>';
    }
    
    if (filesWithoutMatches.length > 0) {
        html += '<div style="margin-bottom: 16px;">';
        html += '<div style="font-weight: 600; color: #f59e0b; margin-bottom: 8px;">⚠️ ไฟล์ที่ไม่พบคำที่ต้องการแทนที่:</div>';
        filesWithoutMatches.forEach(file => {
            html += `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 12px; background: rgba(245,158,11,0.1); border-radius: 4px; margin-bottom: 4px;">
                    <span style="font-size: 14px; color: var(--text-color);">${escapeHtml(file.original_name)}</span>
                    <span style="font-size: 12px; color: #f59e0b;">ไม่พบคำที่ค้นหา</span>
                </div>
            `;
        });
        html += '</div>';
    }
    
    html += '</div>';
    container.innerHTML = html;
}

function displayErrors(errors, container) {
    if (errors.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    let html = '<div class="error-list">';
    html += '<div class="error-title">❌ ไฟล์ที่ประมวลผลไม่สำเร็จ:</div>';
    html += '<ul>';
    
    errors.forEach(error => {
        html += `
            <li>
                <strong>${escapeHtml(error.original_name)}</strong>: 
                ${escapeHtml(error.error)}
            </li>
        `;
    });
    
    html += '</ul></div>';
    container.innerHTML = html;
}

function getTotalReplacements(results) {
    return results.successful.reduce((total, file) => total + (file.replacements || 0), 0);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}