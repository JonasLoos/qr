# QR Code Generator Web App

A beautiful, modern, and easy-to-use web application for generating QR codes. Built with vanilla JavaScript and the Nayuki QR Code Generator Library.

## Features

- **Instant Generation**: Generate QR codes in real-time as you type
- **Customizable**: Adjust size, colors, and error correction levels
- **Multiple Formats**: Download as PNG or SVG
- **Copy to Clipboard**: Copy QR codes directly to your clipboard
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Modern UI**: Beautiful, clean interface with smooth animations

## Usage

1. Open `index.html` in your web browser
2. Enter text, URL, or any data you want to encode
3. Customize the QR code settings:
   - **Error Correction Level**: Choose from Low (7%), Medium (15%), Quartile (25%), or High (30%)
   - **Size**: Adjust from 200px to 800px
   - **Colors**: Customize foreground and background colors
4. The QR code generates automatically as you type
5. Download in PNG or SVG format, or copy to clipboard

## Files

- `index.html` - Main HTML structure
- `styles.css` - Modern CSS styling with responsive design
- `app.js` - JavaScript functionality and QR code generation
- `qrcode.js` - Nayuki QR Code Generator Library (JavaScript version)
- `qrcode.ts` - Nayuki QR Code Generator Library (TypeScript version)

## Technical Details

- Uses the Nayuki QR Code Generator Library for reliable QR code generation
- Supports all QR code versions (1-40) and error correction levels
- Generates SVG format for crisp, scalable QR codes
- Converts to PNG for download and clipboard operations
- Auto-generates QR codes with 500ms debounce for smooth user experience

## Browser Support

- Modern browsers with ES6+ support
- Canvas API for PNG generation
- Clipboard API for copy functionality (with fallback)

## License

This project uses the Nayuki QR Code Generator Library, which is licensed under the MIT License.

## Getting Started

Simply open `index.html` in your web browser. No build process or dependencies required!

For local development with a web server:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.
