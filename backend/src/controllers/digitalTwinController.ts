import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import DigitalTwinScenario from '../models/DigitalTwinScenario';
import Transaction from '../models/Transaction';
import EmergencyFund from '../models/EmergencyFund';

const memoryScenarios: Map<string, any[]> = new Map();

export const runSimulation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { name, type, durationMonths, incomeImpactPerMonth, expenseImpactPerMonth, oneTimeCost } = req.body;

    // Fetch baseline data
    let txs: any[] = [];
    let ef: any = null;
    try {
      txs = await Transaction.find({ userId });
      ef = await EmergencyFund.findOne({ userId });
    } catch (dbErr) {}

    const totalIncome = txs.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0) || 85000;
    const totalExpenses = txs.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0) || 34200;
    const currentEF = ef ? ef.currentBalance : 45000;
    const essentialExp = ef ? ef.essentialMonthlyExpense : 25000;

    const baseMonthlyNet = totalIncome - totalExpenses;

    const dur = Number(durationMonths || 6);
    const incImp = Number(incomeImpactPerMonth || 0);
    const expImp = Number(expenseImpactPerMonth || 0);
    const oneTime = Number(oneTimeCost || 0);

    const projectedBalances = [];
    let runningBalance = currentEF - oneTime;

    for (let month = 1; month <= dur; month++) {
      const simulatedMonthlyIncome = Math.max(0, totalIncome + incImp);
      const simulatedMonthlyExpense = totalExpenses + expImp;
      const netMonthly = simulatedMonthlyIncome - simulatedMonthlyExpense;

      runningBalance += netMonthly;
      const coverageMonths = essentialExp > 0 ? parseFloat((runningBalance / essentialExp).toFixed(1)) : 0;

      projectedBalances.push({
        month,
        balance: Math.round(runningBalance),
        coverageMonths,
        netWorth: Math.round(runningBalance + 150000)
      });
    }

    const scenarioObj = {
      name: name || `Simulation: ${type || 'Custom Scenario'}`,
      type: type || 'job_loss',
      durationMonths: dur,
      incomeImpactPerMonth: incImp,
      expenseImpactPerMonth: expImp,
      oneTimeCost: oneTime,
      projectedBalances
    };

    try {
      const created = await DigitalTwinScenario.create({ userId, ...scenarioObj });
      return res.json({ success: true, scenario: created });
    } catch (dbErr) {
      const list = memoryScenarios.get(userId) || [];
      const item = { _id: `sim_${Date.now()}`, userId, ...scenarioObj };
      list.push(item);
      memoryScenarios.set(userId, list);
      return res.json({ success: true, scenario: item });
    }
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getScenarios = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    let list: any[] = [];
    try {
      list = await DigitalTwinScenario.find({ userId });
    } catch (dbErr) {
      list = memoryScenarios.get(userId) || [];
    }
    return res.json({ success: true, scenarios: list });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
