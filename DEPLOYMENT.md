# 🚀 CodePlayground Production Deployment Guide

This repository contains the complete frontend and backend infrastructure for **CodePlayground.tools**.

---

## 🏗️ Architecture Overview
- **Frontend**: React + TypeScript + Vite + Monaco Editor + TailwindCSS (Deployed on **Vercel**).
- **Backend API**: Express + Node.js + TypeScript (Deployed on **Render**).
- **Database**: **Neon Serverless PostgreSQL** (Real-time SQL database for storing & sharing code projects).

---

## 📁 1. Push to GitHub Repository
Run the following commands in your shell to push the code to your GitHub account:

```bash
# Rename branch to main
git branch -M main

# Add your GitHub remote repository
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/codeplayground-tools.git

# Push the codebase
git push -u origin main
```

---

## 🗄️ 2. Database Setup (Neon PostgreSQL)
1. Go to [Neon Console](https://console.neon.tech/) and create a new project.
2. Copy your connection string (`postgresql://username:password@ep-xxxxxx.us-east-2.aws.neon.tech/neondb?sslmode=require`).
3. The server automatically initializes the `projects` table upon startup!

---

## 🖥️ 3. Backend Deployment (Render)
1. Go to [Render Dashboard](https://dashboard.render.com/) -> **New Web Service**.
2. Connect your GitHub repository `codeplayground-tools`.
3. Configure the following build settings:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start`
4. Add Environment Variable:
   - `DATABASE_URL` = `<your_neon_postgres_connection_string>`
5. Deploy! Copy the live Render backend URL (e.g. `https://codeplayground-backend.onrender.com`).

---

## 🌐 4. Frontend Deployment (Vercel)
1. Go to [Vercel Dashboard](https://vercel.com/new) -> **Import Git Repository**.
2. Select `codeplayground-tools`.
3. Set Framework Preset to **Vite**.
4. Add Environment Variable:
   - `VITE_API_URL` = `https://codeplayground-backend.onrender.com`
5. Click **Deploy**. Vercel will automatically handle routing via `vercel.json`.

---

## 🔑 Automated Token Deployment Protocol
If you share your temporary **GitHub Personal Access Token (PAT)**, **Vercel Access Token**, and **Render API Key**:
1. The AI will automatically push the repository to GitHub.
2. Automatically create & deploy the backend service on Render connected to Neon DB.
3. Automatically deploy the frontend project on Vercel.
4. **Immediately sanitize & remove all token records** once deployment is complete.
