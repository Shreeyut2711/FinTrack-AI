import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ENV } from './config/env';
import { connectDB } from './config/db';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';
import budgetRoutes from './routes/budgetRoutes';
import goalRoutes from './routes/goalRoutes';
import emergencyRoutes from './routes/emergencyRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import netWorthRoutes from './routes/netWorthRoutes';
import investmentRoutes from './routes/investmentRoutes';
import aiRoutes from './routes/aiRoutes';
import reportRoutes from './routes/reportRoutes';
import digitalTwinRoutes from './routes/digitalTwinRoutes';
import calendarRoutes from './routes/calendarRoutes';
import lifePlanRoutes from './routes/lifePlanRoutes';
import securityRoutes from './routes/securityRoutes';
import sharedFinanceRoutes from './routes/sharedFinanceRoutes';
import memoryRoutes from './routes/memoryRoutes';

const app = express();

// Security & Middlewares
app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'FinTrack Node Backend AI CFO Engine',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/emergency-fund', emergencyRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/net-worth', netWorthRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/digital-twin', digitalTwinRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/life-plans', lifePlanRoutes);
app.use('/api/security', securityRoutes);
app.use('/api/shared-finance', sharedFinanceRoutes);
app.use('/api/memory', memoryRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server & Connect Database
const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log(`🚀 FinTrack Node Backend running on port ${ENV.PORT}`);
  });
};

startServer();
