<p align="center">
  <img src="https://img.shields.io/badge/ShopSense-AI%20Search-blueviolet?style=for-the-badge&logo=shopify&logoColor=white" alt="ShopSense Badge"/>
</p>

<h1 align="center">🛍️ ShopSense — AI Conversational Product Search</h1>

<p align="center">
  <strong>Find products by just describing what you want.</strong><br/>
  A premium, mobile-first shopping experience powered by conversational AI.
</p>

<p align="center">
  <a href="https://conversational-product-search-new-2.onrender.com"><img src="https://img.shields.io/badge/🚀%20Live%20Demo-onrender.com-4ADE80?style=for-the-badge" alt="Live Demo"/></a>
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node"/>
  <img src="https://img.shields.io/badge/Express-4.x-000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License"/>
</p>

---
  🔗 **Live:** [https://conversational-product-search-new-2.onrender.com](https://conversational-product-search-new-2.onrender.com)
## ✨ Features

| Feature | Description |
|---|---|
| 🎙️ **Voice Search** | Speak naturally — Web Speech API transcribes and searches in real-time |
| 🧊 **3D Product Viewer** | Interactive CSS 3D cube with drag-to-rotate and auto-spin |
| ❤️ **Smart Wishlist** | Persistent wishlist with `localStorage`, heart-burst particle animations |
| 👆 **Double-Tap to Like** | Instagram-style double-tap gesture on product cards |
| 🤖 **AI Chat Assistant** | Full-screen conversational chat drawer for natural language queries |
| 🔍 **Instant Search** | Real-time dropdown suggestions as you type |
| 🎉 **Checkout Confetti** | Canvas-based confetti celebration on successful purchase |
| 📤 **Native Share** | Web Share API integration for sharing products natively |
| 📳 **Haptic Feedback** | Subtle vibration feedback on all touch interactions |
| 🌙 **Glassmorphism UI** | Premium dark theme with animated orbs, star field, and frosted glass |

---

## 🖥️ Tech Stack

```
Frontend:  Vanilla HTML5 / CSS3 / JavaScript (ES6+)
Backend:   Node.js + Express.js
Styling:   Custom CSS with CSS Variables, Glassmorphism, CSS 3D Transforms
APIs:      Web Speech API, Web Share API, Vibration API
Storage:   localStorage (wishlist, search history)
Hosting:   Render (Free Tier)
```

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Run Locally

```bash
# Clone the repository
git clone https://github.com/varshanayak04/conversational-product-search-new.git
cd conversational-product-search-new/backend

# Install dependencies
npm install

# Start the server
node server.js
```

Open [http://localhost:4000](http://localhost:4000) in your browser.

> 💡 **Tip:** Use Chrome DevTools → Toggle Device Toolbar (Ctrl+Shift+M) and select iPhone 14 Pro for the best mobile experience.

---

## 📁 Project Structure

```
conversational-product-search-new/
├── backend/
│   ├── server.js            # Express server with API routes
│   ├── package.json         # Dependencies
│   └── public/
│       ├── index.html       # Main HTML with all UI components
│       ├── style.css        # Mobile-first responsive CSS
│       └── app.js           # Core app logic & premium features
└── README.md
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/categories` | List all product categories |
| `GET` | `/api/trending` | Get trending products |
| `GET` | `/api/products` | Get all products (supports `?category=`) |
| `POST` | `/api/search` | Conversational search (`{ query: "..." }`) |
| `POST` | `/api/recommend` | Get recommendations based on history |

---

## 📱 Mobile-First Design

ShopSense is built **mobile-first** with progressive enhancement:

- **Bottom Navigation Bar** — Home, Search, Wishlist, AI Chat tabs
- **Bottom-sheet Modals** — iOS-style slide-up product detail sheets  
- **Safe Area Support** — `env(safe-area-inset-bottom)` for notched phones
- **Touch Optimized** — 44px+ touch targets, swipe-friendly scrolling
- **Responsive Breakpoints** — Optimized layouts at 640px and 1024px

---

## 🎨 Design Philosophy

> *"An interface that feels responsive and alive encourages interaction."*

- **Dark Glassmorphism** — Frosted glass panels over animated gradient orbs
- **Animated Star Field** — Canvas-rendered particle background (50 on mobile, 120 on desktop)
- **Micro-Animations** — Fade-ins, scale transforms, shimmer skeletons
- **Premium Color Palette** — Purple (#7C3AED), Blue (#3B82F6), Pink (#EC4899)

---

## 🛡️ Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Server port |
| `NODE_ENV` | `development` | Environment mode |

---

## 🚢 Deployment

This app is deployed on **Render** as a Web Service.

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `node server.js` |

🔗 **Live:** [https://conversational-product-search-new-2.onrender.com](https://conversational-product-search-new-2.onrender.com)

---

## 👩‍💻 Author

**Varsha Nayak** — [@varshanayak04](https://github.com/varshanayak04)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ and ✨ by Varsha Nayak
</p>
