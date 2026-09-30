import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { Users, Plus, Shield, ArrowRightLeft } from 'lucide-react';

export const SharedFinancePage: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const [household, setHousehold] = useState({
    name: 'Family & Apartment Group',
    members: [
      { userId: 'u_1', name: 'You (Primary Admin)' },
      { userId: 'u_2', name: 'Sam (Roommate)' }
    ],
    sharedBudgets: [
      { category: 'Groceries & Household', amount: 15000 },
      { category: 'Electricity & Wifi', amount: 4500 }
    ],
    expenses: [
      { _id: 'se_1', title: 'Weekly Supermarket Grocery', amount: 3200, paidByName: 'You', splitBetweenCount: 2, date: '2026-09-26' },
      { _id: 'se_2', title: 'High-Speed Broadband Bill', amount: 1200, paidByName: 'Sam', splitBetweenCount: 2, date: '2026-09-24' }
    ]
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Shared Household Finance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Shared budgets, expense splitting & reimbursement tracking for families and roommates
          </p>
        </div>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">{household.name}</h3>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
            {household.members.length} Active Members
          </span>
        </div>

        <div className="space-y-2">
          {household.expenses.map((exp) => (
            <div key={exp._id} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
              <div>
                <div className="font-bold text-slate-100">{exp.title}</div>
                <div className="text-[10px] text-slate-500">Paid by {exp.paidByName} • Split 50/50</div>
              </div>
              <div className="font-extrabold text-white text-sm">
                {formatCurrency(exp.amount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
