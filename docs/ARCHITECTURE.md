# FinTrack AI — Architecture Specification

## 1. System Overview
FinTrack AI is a modern personal finance management monorepo application engineered with three decoupled micro-services:

```
                  ┌─────────────────────────────────┐
                  │   Vite + React 18 + TS Client   │
                  │   (Tailwind CSS, Recharts)     │
                  └────────────────┬────────────────┘
                                   │  HTTP / REST (JWT Auth)
                                   ▼
                  ┌─────────────────────────────────┐
                  │     Node.js Express Server      │
                  │   (TypeScript, JWT, Mongoose)   │
                  └────────┬───────────────┬────────┘
                           │               │
      Internal AI Protocol │               │ MongoDB Mongoose Driver
                           ▼               ▼
        ┌──────────────────────┐      ┌──────────────────────┐
        │  Python FastAPI AI   │      │    MongoDB Atlas     │
        │ (Pandas, LLM Provider│      │ (Persistent Storage) │
        │ & OCR Abstraction)   │      └──────────────────────┘
        └──────────────────────┘
```

## 2. Directory Hierarchy
- `frontend/`: Single Page Application (SPA) built with Vite, React 18, TypeScript, Tailwind CSS, Recharts, Lucide Icons, and React Router.
- `backend/`: Node.js Express server written in TypeScript with Mongoose schemas, JWT middleware, rate limiting, and REST controllers.
- `ai-service/`: Python 3.14 FastAPI engine powered by Pandas for financial analytics, rule-based auto-categorization, OCR receipt extraction, and LLM providers.
- `docs/`: Complete architectural blueprints, API documentation, and deployment guides.

## 3. Core Modules & Data Isolation
1. **Authentication**: JWT token-based authentication with bcrypt password hashing. User data is isolated per `userId`.
2. **Dashboard**: Real-time aggregated metrics (income, expenses, cash surplus, savings rate, category pie breakdown, cash flow area charts).
3. **Transaction Management**: Full CRUD transaction ledger supporting income, expense, and transfer records with custom categories.
4. **Budget Management**: Monthly spending caps with real-time progress indicators and utilization alerts at 70%, 90%, and 100%.
5. **Savings Goals**: Goal tracking with target deadline visualizer and suggested monthly contribution calculations.
6. **Emergency Fund Manager**: Independent module featuring target calculator (`Essential Monthly Costs × Coverage Months`), contribution/withdrawal ledger, pre-withdrawal impact analysis modal with explicit confirmation safeguards.
7. **AI Voice & OCR Integrations**: Web Speech API speech-to-text with confirmation workflow, and OCR receipt parser with auto-category suggestions.
8. **Subscriptions & Net Worth**: Recurring bill monitoring and assets minus liabilities net worth calculation.
