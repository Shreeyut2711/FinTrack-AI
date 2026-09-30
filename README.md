# FinTrack AI — Modern Production Personal Finance Platform

FinTrack AI is a complete, AI-powered personal finance management SaaS platform built with React 18, Vite, TypeScript, Tailwind CSS, Node.js Express, Python FastAPI, and MongoDB Atlas.

![FinTrack AI](https://img.shields.io/badge/Status-Production%20Ready-emerald)
![Tech](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20FastAPI%20%7C%20MongoDB-blue)

## Features & Modules

- 📊 **Real-Time Financial Dashboard**: Total income, expenses, cash surplus, savings rate, category pie chart, cash flow area trend, date filters.
- 💳 **Transaction Ledger**: Complete CRUD transactions supporting income, expense, and transfer records with custom categories, search, filtering, and pagination.
- 🎯 **Monthly Budget Caps**: Spent vs remaining caps with dynamic progress bars and notifications at 70%, 90%, and 100%.
- 🚀 **Savings Goal Planner**: Target deadline tracking with calculated monthly contribution recommendations.
- 🛡️ **Emergency Fund Manager**: Independent module featuring target calculator (`Essential Monthly Costs × Coverage Months`), contribution/withdrawal ledger, pre-withdrawal impact analysis modal with explicit confirmation safeguards.
- 🤖 **FinTrack AI Assistant**: Conversational AI assistant giving data-driven insights using deterministic financial calculations.
- 🎙️ **Voice Entry & OCR Scanner**: Web Speech API voice command parser and OCR receipt scanner abstraction with confirmation workflows.
- 🔄 **Subscriptions & Net Worth**: Recurring bill monitoring and assets minus liabilities net worth calculator.
- 📈 **Investment & Calculators**: Portfolio tracker, SIP return calculator, and EMI loan calculator.

---

## Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Recharts, Lucide Icons, React Router.
- **Backend**: Node.js, Express.js, TypeScript, Mongoose, JWT authentication, bcryptjs, Helmet, Express Rate Limit.
- **AI Engine**: Python 3.14, FastAPI, Pandas, Uvicorn, OpenAI & Gemini LLM abstraction.
- **Database**: MongoDB Atlas / Mongoose (with hybrid in-memory store fallback for instant out-of-the-box local execution).

---

## Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
cd fintrack

# Install backend dependencies
cd backend && pnpm install

# Install frontend dependencies
cd ../frontend && pnpm install

# Install Python AI dependencies
cd ../ai-service && pip install -r requirements.txt
```

### 2. Run Services
```bash
# Terminal 1: Run Node.js Backend (Port 3001)
cd backend && pnpm dev

# Terminal 2: Run Python AI Service (Port 5000)
cd ai-service && python main.py

# Terminal 3: Run Vite React Frontend (Port 3000)
cd frontend && pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Demo credentials: `demo@fintrack.ai` / `demo123`.

---

## Deployment Architecture

Refer to [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full hosting instructions on Vercel, Render/Railway, and MongoDB Atlas.
