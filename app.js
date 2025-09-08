// QR Code Generator Web App
class QRCodeGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setupAutoGeneration();
    }

    initializeElements() {
        // Input elements
        this.textInput = document.getElementById('qr-text');
        this.errorCorrectionSelect = document.getElementById('error-correction');
        this.sizeSlider = document.getElementById('qr-size');
        this.foregroundColorInput = document.getElementById('foreground-color');
        this.backgroundColorInput = document.getElementById('background-color');
        
        // Action elements
        this.clearBtn = document.getElementById('clear-btn');
        this.charCount = document.querySelector('.char-count');
        
        // Output elements
        this.qrContainer = document.getElementById('qr-container');
        this.qrActions = document.getElementById('qr-actions');
        this.downloadPngBtn = document.getElementById('download-png');
        this.downloadSvgBtn = document.getElementById('download-svg');
        this.copyBtn = document.getElementById('copy-qr');
        
        // Range value display
        this.rangeValue = document.querySelector('.range-value');
    }

    bindEvents() {
        // Clear button
        this.clearBtn.addEventListener('click', () => this.clearInput());
        
        // Character count update
        this.textInput.addEventListener('input', () => this.updateCharCount());
        
        // Size slider
        this.sizeSlider.addEventListener('input', () => this.updateSizeDisplay());
        
        // Download buttons
        this.downloadPngBtn.addEventListener('click', () => this.downloadQRCode('png'));
        this.downloadSvgBtn.addEventListener('click', () => this.downloadQRCode('svg'));
        
        // Copy button
        this.copyBtn.addEventListener('click', () => this.copyQRCode());
        
        // Enter key to clear
        this.textInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearInput();
            }
        });
    }

    setupAutoGeneration() {
        // Auto-generate QR code on any input change (with debounce)
        let timeout;
        
        const generateWithDebounce = () => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                this.generateQRCode();
            }, 300);
        };
        
        // Text input changes
        this.textInput.addEventListener('input', generateWithDebounce);
        
        // Option changes
        this.errorCorrectionSelect.addEventListener('change', generateWithDebounce);
        this.sizeSlider.addEventListener('input', generateWithDebounce);
        this.foregroundColorInput.addEventListener('change', generateWithDebounce);
        this.backgroundColorInput.addEventListener('change', generateWithDebounce);
    }

    updateCharCount() {
        const count = this.textInput.value.length;
        this.charCount.textContent = `${count} characters`;
        
        // Update character count color based on length
        if (count > 1000) {
            this.charCount.style.color = 'var(--error-color)';
        } else if (count > 500) {
            this.charCount.style.color = '#f59e0b';
        } else {
            this.charCount.style.color = 'var(--text-tertiary)';
        }
    }

    updateSizeDisplay() {
        const size = this.sizeSlider.value;
        this.rangeValue.textContent = `${size}px`;
    }

    clearInput() {
        this.textInput.value = '';
        this.updateCharCount();
        this.clearQRCode();
    }

    clearQRCode() {
        this.qrContainer.innerHTML = `
            <div class="qr-placeholder">
                <i class="fas fa-qrcode"></i>
                <p>Your QR code will appear here</p>
            </div>
        `;
        this.qrActions.style.display = 'none';
    }

    generateQRCode() {
        const text = this.textInput.value.trim();
        
        if (!text) {
            this.clearQRCode();
            return;
        }

        try {
            // Show loading state
            this.showLoading();
            
            // Get options
            const errorCorrection = this.getErrorCorrectionLevel();
            const size = parseInt(this.sizeSlider.value);
            const foregroundColor = this.foregroundColorInput.value;
            const backgroundColor = this.backgroundColorInput.value;
            
            // Generate QR code using the library
            const qr = qrcodegen.QrCode.encodeText(text, errorCorrection);
            
            // Create SVG
            const svg = this.createSVG(qr, size, foregroundColor, backgroundColor);
            
            // Display QR code
            this.displayQRCode(svg);
            
            // Show success animation
            this.qrContainer.classList.add('success-animation');
            setTimeout(() => {
                this.qrContainer.classList.remove('success-animation');
            }, 600);
            
        } catch (error) {
            this.showError('Failed to generate QR code: ' + error.message);
        }
    }

    getErrorCorrectionLevel() {
        const value = this.errorCorrectionSelect.value;
        return qrcodegen.QrCode.Ecc[value];
    }

    createSVG(qr, size, foregroundColor, backgroundColor) {
        const border = 4;
        const modulesPerSide = qr.size;
        const totalSize = modulesPerSide + border * 2;
        const moduleSize = size / totalSize;
        
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${totalSize} ${totalSize}">`;
        svg += `<rect width="${totalSize}" height="${totalSize}" fill="${backgroundColor}"/>`;
        
        for (let y = 0; y < modulesPerSide; y++) {
            for (let x = 0; x < modulesPerSide; x++) {
                if (qr.getModule(x, y)) {
                    const rectX = x + border;
                    const rectY = y + border;
                    svg += `<rect x="${rectX}" y="${rectY}" width="1" height="1" fill="${foregroundColor}"/>`;
                }
            }
        }
        
        svg += '</svg>';
        return svg;
    }

    displayQRCode(svg) {
        this.qrContainer.innerHTML = svg;
        this.qrActions.style.display = 'flex';
    }

    showLoading() {
        this.qrContainer.innerHTML = `
            <div class="qr-placeholder">
                <div class="loading"></div>
                <p>Generating...</p>
            </div>
        `;
    }

    showError(message) {
        this.qrContainer.innerHTML = `
            <div class="qr-placeholder">
                <i class="fas fa-exclamation-triangle" style="color: var(--error-color);"></i>
                <p style="color: var(--error-color);">${message}</p>
            </div>
        `;
        this.qrActions.style.display = 'none';
    }

    downloadQRCode(format) {
        const svg = this.qrContainer.querySelector('svg');
        if (!svg) {
            this.showError('No QR code to download');
            return;
        }

        if (format === 'svg') {
            this.downloadSVG(svg);
        } else if (format === 'png') {
            this.downloadPNG(svg);
        }
    }

    downloadSVG(svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        const downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = `qrcode-${Date.now()}.svg`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
    }

    downloadPNG(svg) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = parseInt(this.sizeSlider.value);
        
        canvas.width = size;
        canvas.height = size;
        
        const img = new Image();
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        img.onload = () => {
            ctx.fillStyle = this.backgroundColorInput.value;
            ctx.fillRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);
            
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = `qrcode-${Date.now()}.png`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(url);
                URL.revokeObjectURL(svgUrl);
            });
        };
        
        img.src = svgUrl;
    }

    async copyQRCode() {
        const svg = this.qrContainer.querySelector('svg');
        if (!svg) {
            this.showError('No QR code to copy');
            return;
        }

        try {
            // Convert SVG to PNG for copying
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const size = parseInt(this.sizeSlider.value);
            
            canvas.width = size;
            canvas.height = size;
            
            const img = new Image();
            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const svgUrl = URL.createObjectURL(svgBlob);
            
            img.onload = () => {
                ctx.fillStyle = this.backgroundColorInput.value;
                ctx.fillRect(0, 0, size, size);
                ctx.drawImage(img, 0, 0, size, size);
                
                canvas.toBlob(async (blob) => {
                    try {
                        await navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ]);
                        this.showCopySuccess();
                    } catch (error) {
                        this.showError('Failed to copy QR code to clipboard');
                    }
                    URL.revokeObjectURL(svgUrl);
                });
            };
            
            img.src = svgUrl;
        } catch (error) {
            this.showError('Copy to clipboard not supported in this browser');
        }
    }

    showCopySuccess() {
        const originalText = this.copyBtn.innerHTML;
        this.copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        this.copyBtn.style.background = 'var(--success-color)';
        
        setTimeout(() => {
            this.copyBtn.innerHTML = originalText;
            this.copyBtn.style.background = 'var(--accent-color)';
        }, 2000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QRCodeGenerator();
});

// Add some example text on load
document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('qr-text');
    if (!textInput.value) {
        textInput.value = 'https://example.com';
        textInput.dispatchEvent(new Event('input'));
    }
});