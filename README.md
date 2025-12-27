# 📄 PDF Toolkit — Browser-Based PDF Utilities

A **privacy-first, client-side PDF utility web application** that allows users to perform common PDF operations directly in their browser — without uploading files to any server.

🔐 No backend  
⚡ Fast, lightweight  
🌐 Hosted on GitHub Pages  

---

## ✨ Features

- 📉 Compress PDF (browser-based)
- 📎 Merge multiple PDFs
- 🖼️ Convert JPG / PNG images to a single PDF (max 30 pages)
- ✂️ Split PDF by page range
- 🔓 Remove password from PDF (with correct password)
- 🧭 Single shared header across all pages
- 🔁 Back navigation + Home navigation
- 📱 Fully responsive, centered UI
- 🧠 100% client-side processing

---

## 🧠 Core Idea

This project behaves like a **multi-page website**, but is technically a  
**Single Page Application (SPA)** built using **vanilla JavaScript**.

- One HTML file
- Same header on all pages
- Only page content changes dynamically
- No framework, no backend
- Fully compatible with GitHub Pages

---

## 🏗️ Architecture Overview

```
User Browser
│
├── UI (HTML + CSS)
├── Header (Shared across all pages)
├── Navigation Controller (JS)
├── PDF Processing
│ ├── pdf-lib (merge, split, unlock)
│ ├── jsPDF (images → PDF)
│ └── Web Worker (compression)
│
└── File Download (Blob API)
```

> All files stay inside the user’s browser memory  
> Nothing is uploaded to any server

---

## 📁 Project Structure

```
pdf-tools/
│
├── index.html → Main HTML entry point
├── style.css → Layout & centering styles
├── app.js → Navigation + logic
├── worker.js → PDF compression worker
└── README.md → Documentation
```

---

## 🧭 Navigation Logic

- Header is **identical on all pages**
- Clicking the **header title** → Home
- **Back button** → last visited page
- **Dropdown menu** → jump to any tool anytime
- Content below header updates dynamically

This creates a **true multi-page user experience** without page reloads.

---

## ⚙️ Technologies Used

| Technology | Purpose |
|---------|---------|
| HTML5 | Structure |
| CSS3 | Centered layout, responsive design |
| JavaScript (ES6) | SPA navigation & logic |
| pdf-lib | Merge, split, unlock PDFs |
| jsPDF | Images → PDF |
| Web Workers | Background compression |
| GitHub Pages | Hosting |

---

## 🔐 Privacy & Security

- ❌ No file uploads
- ❌ No analytics
- ❌ No tracking
- ❌ No storage

> All processing happens locally in the browser.

Safe to use for **confidential documents**.

---

## ⚠️ Known Limitations

- PDF compression is **approximate**, not exact size targeting
- Performance depends on device RAM
- Very large PDFs may be slow on mobile browsers
- Password removal works **only if password is known**
- Safari may struggle with large files

---

## 🚀 Deployment (GitHub Pages)

1. Create a GitHub repository
2. Add all project files
3. Go to **Settings → Pages**
4. Select `main` branch
5. Access site at:
```
https://astitva-sri.github.io/pdf_Tools/
```

---

## 🎯 Why This Project Is Valuable

This project demonstrates:

- Browser-based file processing
- Use of Web APIs (FileReader, Blob, Workers)
- SPA architecture without frameworks
- Clean UI/UX navigation design
- Privacy-first engineering mindset
  
---

## 🔮 Future Enhancements (Planned)

- Drag-and-drop reordering
- Add Dark Mode
- Page thumbnails preview
- Rotate / watermark PDFs
- Progressive Web App (PWA)
- WASM-based compression
- Accessibility improvements

---

## 👤 Author

- Astitva Srivastava
- Hosted using GitHub Pages
- Build over vibe coding 😉😅


