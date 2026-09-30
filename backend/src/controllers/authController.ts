import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import EmergencyFund from '../models/EmergencyFund';
import { ENV } from '../config/env';
import { AuthRequest } from '../middleware/auth';

// Hybrid in-memory store for fallback if DB is unconfigured
const memoryUsers = new Map<string, any>();

// Seed default demo user in memory fallback
const seedDemoUser = () => {
  if (!memoryUsers.has('demo_user_id')) {
    memoryUsers.set('demo_user_id', {
      _id: 'demo_user_id',
      id: 'demo_user_id',
      name: 'Demo User',
      email: 'demo@fintrack.ai',
      passwordHash: bcrypt.hashSync('demo123', 10),
      currency: 'INR',
      currencySymbol: '₹',
      timezone: 'Asia/Kolkata',
      essentialMonthlyExpense: 25000,
      createdAt: new Date()
    });
  }
};
seedDemoUser();

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, currency, timezone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Name, email and password are required' });
    }

    const emailLower = email.toLowerCase().trim();
    const passwordHash = await bcrypt.hash(password, 10);
    const symbolMap: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
    const currencySymbol = symbolMap[currency || 'INR'] || '₹';

    let userObj: any;

    try {
      const existingUser = await User.findOne({ email: emailLower });
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'User with this email already exists' });
      }

      const newUser = await User.create({
        name,
        email: emailLower,
        passwordHash,
        currency: currency || 'INR',
        currencySymbol,
        timezone: timezone || 'Asia/Kolkata',
        essentialMonthlyExpense: 25000
      });

      // Initialize default Emergency Fund for user
      await EmergencyFund.create({
        userId: newUser._id.toString(),
        targetAmount: 150000,
        currentBalance: 45000,
        coverageMonths: 6,
        essentialMonthlyExpense: 25000
      });

      userObj = {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        currency: newUser.currency,
        currencySymbol: newUser.currencySymbol,
        timezone: newUser.timezone,
        essentialMonthlyExpense: newUser.essentialMonthlyExpense
      };
    } catch (dbErr) {
      // Fallback in-memory registration
      const newId = `user_${Date.now()}`;
      userObj = {
        id: newId,
        name,
        email: emailLower,
        passwordHash,
        currency: currency || 'INR',
        currencySymbol,
        timezone: timezone || 'Asia/Kolkata',
        essentialMonthlyExpense: 25000,
        createdAt: new Date()
      };
      memoryUsers.set(newId, userObj);
    }

    const token = jwt.sign({ id: userObj.id, email: userObj.email }, ENV.JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: userObj.id,
        name: userObj.name,
        email: userObj.email,
        currency: userObj.currency,
        currencySymbol: userObj.currencySymbol,
        timezone: userObj.timezone,
        essentialMonthlyExpense: userObj.essentialMonthlyExpense
      }
    });

  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const emailLower = email.toLowerCase().trim();
    let userObj: any = null;

    try {
      const user = await User.findOne({ email: emailLower });
      if (user) {
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (isValid) {
          userObj = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            currency: user.currency,
            currencySymbol: user.currencySymbol,
            timezone: user.timezone,
            essentialMonthlyExpense: user.essentialMonthlyExpense
          };
        }
      }
    } catch (dbErr) {
      // DB check failed or unconfigured, check memory store
    }

    if (!userObj) {
      // Check memory store for demo or local accounts
      for (const [id, u] of memoryUsers.entries()) {
        if (u.email === emailLower && bcrypt.compareSync(password, u.passwordHash)) {
          userObj = {
            id,
            name: u.name,
            email: u.email,
            currency: u.currency,
            currencySymbol: u.currencySymbol,
            timezone: u.timezone,
            essentialMonthlyExpense: u.essentialMonthlyExpense
          };
          break;
        }
      }
    }

    if (!userObj) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: userObj.id, email: userObj.email }, ENV.JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      token,
      user: userObj
    });

  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Login failed' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    let userObj: any = null;

    try {
      const user = await User.findById(userId);
      if (user) {
        userObj = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          currency: user.currency,
          currencySymbol: user.currencySymbol,
          timezone: user.timezone,
          essentialMonthlyExpense: user.essentialMonthlyExpense
        };
      }
    } catch (dbErr) {}

    if (!userObj && memoryUsers.has(userId!)) {
      const u = memoryUsers.get(userId!);
      userObj = {
        id: u.id || userId,
        name: u.name,
        email: u.email,
        currency: u.currency,
        currencySymbol: u.currencySymbol,
        timezone: u.timezone,
        essentialMonthlyExpense: u.essentialMonthlyExpense
      };
    }

    if (!userObj) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }

    return res.json({ success: true, user: userObj });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateSettings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { name, currency, timezone, essentialMonthlyExpense } = req.body;
    const symbolMap: Record<string, string> = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
    const currencySymbol = symbolMap[currency || 'INR'] || '₹';

    try {
      const updated = await User.findByIdAndUpdate(
        userId,
        {
          ...(name && { name }),
          ...(currency && { currency, currencySymbol }),
          ...(timezone && { timezone }),
          ...(essentialMonthlyExpense !== undefined && { essentialMonthlyExpense })
        },
        { new: true }
      );
      if (updated) {
        return res.json({
          success: true,
          user: {
            id: updated._id.toString(),
            name: updated.name,
            email: updated.email,
            currency: updated.currency,
            currencySymbol: updated.currencySymbol,
            timezone: updated.timezone,
            essentialMonthlyExpense: updated.essentialMonthlyExpense
          }
        });
      }
    } catch (dbErr) {}

    if (memoryUsers.has(userId!)) {
      const u = memoryUsers.get(userId!);
      if (name) u.name = name;
      if (currency) { u.currency = currency; u.currencySymbol = currencySymbol; }
      if (timezone) u.timezone = timezone;
      if (essentialMonthlyExpense !== undefined) u.essentialMonthlyExpense = essentialMonthlyExpense;
      memoryUsers.set(userId!, u);
      return res.json({ success: true, user: u });
    }

    return res.status(404).json({ success: false, error: 'User not found' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
