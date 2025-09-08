// QR Code Generator Web App
class QRCodeGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setupAutoGeneration();
        this.initializePresets();
    }

    initializeElements() {
        // QR Type elements
        this.qrTypeSelect = document.getElementById('qr-type');
        this.textInputGroup = document.getElementById('text-input-group');
        this.wifiInputGroup = document.getElementById('wifi-input-group');
        this.contactInputGroup = document.getElementById('contact-input-group');
        
        // Text input elements
        this.textInput = document.getElementById('qr-text');
        this.clearBtn = document.getElementById('clear-btn');
        this.charCount = document.querySelector('.char-count');
        
        // WiFi input elements
        this.wifiSsid = document.getElementById('wifi-ssid');
        this.wifiPassword = document.getElementById('wifi-password');
        this.wifiSecurity = document.getElementById('wifi-security');
        this.wifiHidden = document.getElementById('wifi-hidden');
        
        // Contact input elements
        this.contactName = document.getElementById('contact-name');
        this.contactPhone = document.getElementById('contact-phone');
        this.contactEmail = document.getElementById('contact-email');
        this.contactCompany = document.getElementById('contact-company');
        this.contactWebsite = document.getElementById('contact-website');
        
        // Style preset elements
        this.presetButtons = document.querySelectorAll('.preset-btn');
        
        // Basic option elements
        this.sizeSlider = document.getElementById('qr-size');
        this.foregroundColorInput = document.getElementById('foreground-color');
        this.backgroundColorInput = document.getElementById('background-color');
        this.rangeValue = document.querySelector('.range-value');
        
        // Advanced option elements
        this.advancedToggle = document.getElementById('advanced-toggle');
        this.advancedContent = document.getElementById('advanced-content');
        this.errorCorrectionSelect = document.getElementById('error-correction');
        this.borderWidthSlider = document.getElementById('border-width');
        this.moduleShapeSelect = document.getElementById('module-shape');
        this.gradientTypeSelect = document.getElementById('gradient-type');
        this.gradientColorGroup = document.getElementById('gradient-color-group');
        this.gradientColorInput = document.getElementById('gradient-color');
        this.logoOverlayInput = document.getElementById('logo-overlay');
        
        // Output elements
        this.qrContainer = document.getElementById('qr-container');
        this.qrActions = document.getElementById('qr-actions');
        this.downloadPngBtn = document.getElementById('download-png');
        this.downloadSvgBtn = document.getElementById('download-svg');
        this.copyBtn = document.getElementById('copy-qr');
        
        // Logo overlay
        this.logoImage = null;
    }

    bindEvents() {
        // QR Type change
        this.qrTypeSelect.addEventListener('change', () => this.switchQRType());
        
        // Clear button
        this.clearBtn.addEventListener('click', () => this.clearInput());
        
        // Character count update
        this.textInput.addEventListener('input', () => this.updateCharCount());
        
        // Size slider
        this.sizeSlider.addEventListener('input', () => this.updateSizeDisplay());
        
        // Border width slider
        this.borderWidthSlider.addEventListener('input', () => this.updateBorderWidthDisplay());
        
        // Gradient type change
        this.gradientTypeSelect.addEventListener('change', () => this.toggleGradientColor());
        
        // Logo overlay
        this.logoOverlayInput.addEventListener('change', (e) => this.handleLogoUpload(e));
        
        // Advanced toggle
        this.advancedToggle.addEventListener('click', () => this.toggleAdvanced());
        
        // Preset buttons
        this.presetButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.applyPreset(e.target.dataset.preset));
        });
        
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
        
        // WiFi input changes
        [this.wifiSsid, this.wifiPassword, this.wifiSecurity, this.wifiHidden].forEach(input => {
            input.addEventListener('input', generateWithDebounce);
            input.addEventListener('change', generateWithDebounce);
        });
        
        // Contact input changes
        [this.contactName, this.contactPhone, this.contactEmail, this.contactCompany, this.contactWebsite].forEach(input => {
            input.addEventListener('input', generateWithDebounce);
        });
        
        // Option changes
        [this.errorCorrectionSelect, this.sizeSlider, this.foregroundColorInput, this.backgroundColorInput, 
         this.borderWidthSlider, this.moduleShapeSelect, this.gradientTypeSelect, this.gradientColorInput].forEach(input => {
            input.addEventListener('input', generateWithDebounce);
            input.addEventListener('change', generateWithDebounce);
        });
    }

    initializePresets() {
        this.presets = {
            default: {
                foreground: '#000000',
                background: '#ffffff',
                size: 400,
                borderWidth: 4,
                moduleShape: 'square',
                gradientType: 'none',
                errorCorrection: 'MEDIUM'
            },
            minimal: {
                foreground: '#2d3748',
                background: '#ffffff',
                size: 300,
                borderWidth: 8,
                moduleShape: 'rounded',
                gradientType: 'none',
                errorCorrection: 'LOW'
            },
            colorful: {
                foreground: '#3b82f6',
                background: '#f0f9ff',
                size: 500,
                borderWidth: 6,
                moduleShape: 'rounded',
                gradientType: 'linear',
                gradientColor: '#ef4444',
                errorCorrection: 'MEDIUM'
            },
            dark: {
                foreground: '#ffffff',
                background: '#1a202c',
                size: 400,
                borderWidth: 4,
                moduleShape: 'square',
                gradientType: 'none',
                errorCorrection: 'HIGH'
            }
        };
    }

    switchQRType() {
        const type = this.qrTypeSelect.value;
        
        // Hide all input groups
        this.textInputGroup.style.display = 'none';
        this.wifiInputGroup.style.display = 'none';
        this.contactInputGroup.style.display = 'none';
        
        // Show selected input group
        switch(type) {
            case 'text':
                this.textInputGroup.style.display = 'block';
                break;
            case 'wifi':
                this.wifiInputGroup.style.display = 'block';
                break;
            case 'contact':
                this.contactInputGroup.style.display = 'block';
                break;
        }
        
        this.generateQRCode();
    }

    applyPreset(presetName) {
        const preset = this.presets[presetName];
        if (!preset) return;
        
        // Update active preset button
        this.presetButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-preset="${presetName}"]`).classList.add('active');
        
        // Apply preset values
        this.foregroundColorInput.value = preset.foreground;
        this.backgroundColorInput.value = preset.background;
        this.sizeSlider.value = preset.size;
        this.borderWidthSlider.value = preset.borderWidth;
        this.moduleShapeSelect.value = preset.moduleShape;
        this.gradientTypeSelect.value = preset.gradientType;
        this.errorCorrectionSelect.value = preset.errorCorrection;
        
        if (preset.gradientColor) {
            this.gradientColorInput.value = preset.gradientColor;
        }
        
        // Update displays
        this.updateSizeDisplay();
        this.updateBorderWidthDisplay();
        this.toggleGradientColor();
        
        this.generateQRCode();
    }

    toggleAdvanced() {
        const isExpanded = this.advancedContent.style.display !== 'none';
        this.advancedContent.style.display = isExpanded ? 'none' : 'block';
        this.advancedToggle.classList.toggle('expanded', !isExpanded);
    }

    toggleGradientColor() {
        const gradientType = this.gradientTypeSelect.value;
        this.gradientColorGroup.style.display = gradientType === 'none' ? 'none' : 'block';
    }

    handleLogoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.logoImage = e.target.result;
                this.generateQRCode();
            };
            reader.readAsDataURL(file);
        } else {
            this.logoImage = null;
            this.generateQRCode();
        }
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

    updateBorderWidthDisplay() {
        const borderWidth = this.borderWidthSlider.value;
        const borderValueElement = this.borderWidthSlider.parentElement.querySelector('.range-value');
        if (borderValueElement) {
            borderValueElement.textContent = `${borderWidth}px`;
        }
    }

    clearInput() {
        const type = this.qrTypeSelect.value;
        
        switch(type) {
            case 'text':
                this.textInput.value = '';
                this.updateCharCount();
                break;
            case 'wifi':
                this.wifiSsid.value = '';
                this.wifiPassword.value = '';
                this.wifiSecurity.value = 'WPA';
                this.wifiHidden.checked = false;
                break;
            case 'contact':
                this.contactName.value = '';
                this.contactPhone.value = '';
                this.contactEmail.value = '';
                this.contactCompany.value = '';
                this.contactWebsite.value = '';
                break;
        }
        
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
        const type = this.qrTypeSelect.value;
        let text = '';
        
        // Generate text based on type
        switch(type) {
            case 'text':
                text = this.textInput.value.trim();
                break;
            case 'wifi':
                text = this.generateWiFiString();
                break;
            case 'contact':
                text = this.generateContactString();
                break;
        }
        
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
            const borderWidth = parseInt(this.borderWidthSlider.value);
            const moduleShape = this.moduleShapeSelect.value;
            const gradientType = this.gradientTypeSelect.value;
            const gradientColor = this.gradientColorInput.value;
            
            // Generate QR code using the library
            const qr = qrcodegen.QrCode.encodeText(text, errorCorrection);
            
            // Create SVG with advanced styling
            const svg = this.createAdvancedSVG(qr, size, foregroundColor, backgroundColor, borderWidth, moduleShape, gradientType, gradientColor);
            
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

    generateWiFiString() {
        const ssid = this.wifiSsid.value.trim();
        const password = this.wifiPassword.value;
        const security = this.wifiSecurity.value;
        const hidden = this.wifiHidden.checked;
        
        if (!ssid) return '';
        
        let wifiString = `WIFI:T:${security};S:${ssid};`;
        
        if (password && security !== 'nopass') {
            wifiString += `P:${password};`;
        }
        
        if (hidden) {
            wifiString += 'H:true;';
        }
        
        wifiString += ';';
        return wifiString;
    }

    generateContactString() {
        const name = this.contactName.value.trim();
        const phone = this.contactPhone.value.trim();
        const email = this.contactEmail.value.trim();
        const company = this.contactCompany.value.trim();
        const website = this.contactWebsite.value.trim();
        
        if (!name && !phone && !email) return '';
        
        let vcard = 'BEGIN:VCARD\nVERSION:3.0\n';
        
        if (name) vcard += `FN:${name}\n`;
        if (phone) vcard += `TEL:${phone}\n`;
        if (email) vcard += `EMAIL:${email}\n`;
        if (company) vcard += `ORG:${company}\n`;
        if (website) vcard += `URL:${website}\n`;
        
        vcard += 'END:VCARD';
        return vcard;
    }

    getErrorCorrectionLevel() {
        const value = this.errorCorrectionSelect.value;
        return qrcodegen.QrCode.Ecc[value];
    }

    createAdvancedSVG(qr, size, foregroundColor, backgroundColor, borderWidth, moduleShape, gradientType, gradientColor) {
        const modulesPerSide = qr.size;
        const totalSize = modulesPerSide + borderWidth * 2;
        const moduleSize = size / totalSize;
        
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${totalSize} ${totalSize}">`;
        
        // Background
        svg += `<rect width="${totalSize}" height="${totalSize}" fill="${backgroundColor}"/>`;
        
        // Define gradients if needed
        if (gradientType !== 'none') {
            const gradientId = `gradient-${Date.now()}`;
            svg += `<defs>`;
            if (gradientType === 'linear') {
                svg += `<linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">`;
            } else {
                svg += `<radialGradient id="${gradientId}" cx="50%" cy="50%" r="50%">`;
            }
            svg += `<stop offset="0%" style="stop-color:${foregroundColor};stop-opacity:1" />`;
            svg += `<stop offset="100%" style="stop-color:${gradientColor};stop-opacity:1" />`;
            svg += `</${gradientType === 'linear' ? 'linearGradient' : 'radialGradient'}>`;
            svg += `</defs>`;
            
            foregroundColor = `url(#${gradientId})`;
        }
        
        // Draw modules
        for (let y = 0; y < modulesPerSide; y++) {
            for (let x = 0; x < modulesPerSide; x++) {
                if (qr.getModule(x, y)) {
                    const rectX = x + borderWidth;
                    const rectY = y + borderWidth;
                    
                    if (moduleShape === 'circle') {
                        svg += `<circle cx="${rectX + 0.5}" cy="${rectY + 0.5}" r="0.4" fill="${foregroundColor}"/>`;
                    } else if (moduleShape === 'rounded') {
                        svg += `<rect x="${rectX}" y="${rectY}" width="1" height="1" fill="${foregroundColor}" rx="0.2" ry="0.2"/>`;
                    } else {
                        svg += `<rect x="${rectX}" y="${rectY}" width="1" height="1" fill="${foregroundColor}"/>`;
                    }
                }
            }
        }
        
        // Add logo overlay if present
        if (this.logoImage) {
            const logoSize = Math.max(4, Math.floor(modulesPerSide * 0.2));
            const logoX = (totalSize - logoSize) / 2;
            const logoY = (totalSize - logoSize) / 2;
            
            svg += `<rect x="${logoX - 1}" y="${logoY - 1}" width="${logoSize + 2}" height="${logoSize + 2}" fill="${backgroundColor}" rx="2" ry="2"/>`;
            svg += `<image x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" href="${this.logoImage}" preserveAspectRatio="xMidYMid meet"/>`;
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