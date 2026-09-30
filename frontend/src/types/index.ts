export interface User {
  id: string;
  name: string;
  email: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  essentialMonthlyExpense: number;
}

export interface Transaction {
  _id: string;
  id?: string;
  name: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  subcategory?: string;
  paymentMethod: string;
  date: string;
  description?: string;
  isEssential?: boolean;
  isRecurring?: boolean;
}

export interface Budget {
  id: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentage: number;
  alertStatus: 'normal' | 'warning' | 'critical' | 'exceeded';
}

export interface SavingsGoalHistory {
  amount: number;
  type: 'contribution' | 'withdrawal';
  date: string;
  note?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  description?: string;
  category?: string;
  remainingAmount: number;
  progressPercentage: number;
  suggestedMonthlyContribution: number;
  history: SavingsGoalHistory[];
}

export interface EmergencyFundDetails {
  targetAmount: number;
  currentBalance: number;
  coverageMonthsTarget: number;
  essentialMonthlyExpense: number;
  calculatedCoverageMonths: number;
  progressPercentage: number;
  totalContributions: number;
  totalWithdrawals: number;
}

export interface EmergencyTransaction {
  _id: string;
  amount: number;
  type: 'contribution' | 'withdrawal';
  category: string;
  description: string;
  date: string;
  balanceAfter: number;
  monthsCoverageAfter: number;
}

export interface SubscriptionItem {
  _id: string;
  merchant: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  nextBillingDate: string;
  category: string;
  status: 'active' | 'paused' | 'cancelled';
}

export interface AssetLiabilityItem {
  _id: string;
  type: 'asset' | 'liability';
  name: string;
  category: string;
  value: number;
  notes?: string;
}

export interface InvestmentItem {
  _id: string;
  name: string;
  type: 'stocks' | 'mutual_fund' | 'sip' | 'real_estate' | 'crypto' | 'fd';
  investedAmount: number;
  currentValue: number;
  purchaseDate: string;
}
