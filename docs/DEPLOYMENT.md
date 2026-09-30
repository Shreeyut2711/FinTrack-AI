# FinTrack AI — Production Deployment Guide

This guide provides exact step-by-step instructions to deploy **FinTrack AI** to public production URLs across Vercel, Render/Railway, and MongoDB Atlas.

---

## 1. Database Setup: MongoDB Atlas
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (M0 Free Tier or M10 Dedicated).
3. Under **Database Access**, create a user (e.g. `fintrack_user`) with a strong password.
4. Under **Network Access**, add IP address `0.0.0.0/0` (Allow Access from Anywhere).
5. Copy your connection string:
   `mongodb+srv://fintrack_user:<PASSWORD>@cluster0.mongodb.net/fintrack?retryWrites=true&w=majority`

---

## 2. Node.js Backend Deployment (Render / Railway)
1. Push your monorepo repository to GitHub.
2. Sign in to [Render](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository and set Root Directory to `backend`.
4. Configure build settings:
   - **Environment**: Node
   - **Build Command**: `pnpm install && pnpm run build`
   - **Start Command**: `node dist/server.js`
5. Environment Variables:
   - `PORT`: `3001` (or Render assigned port)
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: Generate a secure 64-character random string.
   - `MONGO_URI`: Your MongoDB Atlas URI from Step 1.
   - `AI_SERVICE_URL`: Your Python AI Service URL from Step 3.

---

## 3. Python AI Engine Deployment (Render / Railway)
1. In Render, create another **New Web Service**.
2. Set Root Directory to `ai-service`.
3. Configure build settings:
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Environment Variables:
   - `AI_SERVICE_PORT`: Assigned by host.
   - `OPENAI_API_KEY`: (Optional) Your OpenAI API key for LLM chat.
   - `GEMINI_API_KEY`: (Optional) Your Google Gemini API key.

---

## 4. Frontend Deployment (Vercel)
1. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository.
3. Set **Framework Preset** to Vite.
4. Set **Root Directory** to `frontend`.
5. Environment Variables:
   - `VITE_API_URL`: Your deployed Render Node Backend URL (e.g., `https://fintrack-backend.onrender.com/api`).
6. Click **Deploy**. Vercel will build the frontend and provide your permanent public URL (e.g., `https://fintrack-ai.vercel.app`).
