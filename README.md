<div align="center">

# ⚡ CodePlayground.tools
### The Ultimate 100+ Online Compilers, IDEs & Full-Stack Developer Suite

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)](https://microsoft.github.io/monaco-editor/)
[![Express](https://img.shields.io/badge/Express-Node.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Neon Postgres](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

[🌐 Live Website](https://www.codeplayground.tools) • [📖 Documentation](#-architecture) • [🚀 API Docs](#-rest-api-reference) • [✨ Features](#-key-features)

</div>

---

## 🌟 Overview

**CodePlayground** is a high-performance, professional, browser-based online compiler suite featuring **100+ specialized IDEs** for Web Frameworks, Programming Languages, WASM Runtimes, Data Parsers, CSS Styling, Graphics, and DevOps Tools.

Built with **React 18**, **Monaco Editor (VS Code core)**, **Express**, and **Neon Serverless PostgreSQL**, CodePlayground delivers instant live typing execution, zero-latency sandboxing, multi-file React project exports, and search-engine-optimized landing hubs for every developer tool.

---

## ✨ Key Features

- **⚡ 100+ Specialized Compilers & IDEs**: Dedicated environments for React 18, Python 3 (Pyodide WASM), C++, Java, Rust, Go, SQL, HTML/CSS/JS, Vue 3 SFC, Svelte 5, TypeScript, WebAssembly, Regex, JSON, YAML, GraphQL, Docker Compose, and 85+ more.
- **⚛️ Multi-File React IDE**: Create complex React applications, upload local folder structures, manage component trees, preview live JSX transpilation via Babel CommonJS, and export complete projects as ZIP archives.
- **🐍 Pyodide WebAssembly Python 3 Studio**: Execute client-side Python scripts, data science routines (NumPy/Pandas), algorithms, and ASCII graphics directly in browser memory without server delays.
- **↔️ Precision Split-Pane Resizer**: Custom-engineered drag handles with hit targets, touch support, and context-aware resize cursors (`col-resize` / `row-resize`).
- **🗑️ One-Click Clear Code**: Instant code reset and clearing actions across all compiler shells with prompt protections.
- **🔍 Global Command Palette & Search (`Ctrl + K` / `Cmd + K`)**: Instant fuzzy search across all 100+ compilers filtered by categories.
- **🌐 Advanced SEO & Schema Graph Engine**: Every compiler page features dynamic metadata, OpenGraph cards, canonical URLs, search engine sitemaps (102 URLs), and Google `SoftwareApplication`, `FAQPage`, `BreadcrumbList`, and `HowTo` JSON-LD schemas.
- **☁️ Cloud Project Persistence & Share Links**: Backed by a high-throughput **Express API** and **Neon Serverless PostgreSQL** for cloud project serialization and short sharing URLs.

---

## 🏗️ Architecture

```mermaid
graph TD;
    User[Developer Browser] -->|HTTP / SPA Routing| Vercel[Vercel Frontend CDN]
    User -->|Code Editing| Monaco[Monaco VS Code Editor]
    User -->|Execution| Preview[Babel / WASM Sandboxed Execution]
    User -->|Share & Save| API[Express API on Render]
    API -->|SQL Queries| Neon[Neon Serverless Postgres DB]
```

### Stack Breakdown
| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite 6, Monaco Editor, TailwindCSS, Radix UI, Lucide Icons, Wouter |
| **Backend API** | Node.js, Express.js, TypeScript (`tsx`), CORS |
| **Database** | Neon Serverless PostgreSQL (`@neondatabase/serverless`) |
| **Deployment** | Vercel (Frontend SPA) & Render (Backend Web Service) |

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/zeeshan-ux-AI/codeplayground.tools.git
cd codeplayground.tools
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3001
DATABASE_URL=postgresql://neondb_owner:your_password@ep-your-db.us-east-2.aws.neon.tech/neondb?sslmode=require
VITE_API_URL=http://localhost:3001
```

### 3. Run Development Servers
```bash
# Run Frontend (Vite on http://localhost:5173)
npm run dev

# Run Express Backend (API on http://localhost:3001)
npm run dev:server
```

### 4. Build for Production
```bash
npm run build
```

---

## 📡 REST API Reference

### Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "status": "online",
  "service": "CodePlayground Production API",
  "database": "Neon Postgres (connected)",
  "timestamp": "2026-09-12T08:00:00.000Z"
}
```

### Share Project
```http
POST /api/projects/share
Content-Type: application/json
```
**Body:**
```json
{
  "name": "My React Component",
  "type": "react",
  "files": {
    "src/App.jsx": "export default function App() { return <h1>Hello World</h1>; }"
  }
}
```

### Fetch Shared Project
```http
GET /api/projects/:shareId
```

---

## 🤝 Contributing

Contributions are always welcome! Feel free to open an issue or submit a pull request for new compiler additions or feature updates.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AwesomeCompiler`)
3. Commit your Changes (`git commit -m 'Add AwesomeCompiler'`)
4. Push to the Branch (`git push origin feature/AwesomeCompiler`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">

Crafted with ❤️ by **[Zeeshan Khan](https://github.com/zeeshan-ux-AI)**

*CodePlayground.tools — Empowering Developers Worldwide*

</div>
