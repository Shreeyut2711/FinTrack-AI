import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { Compass, Plus, Calendar, CheckCircle } from 'lucide-react';

export const LifePlannerPage: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const [plans, setPlans] = useState<any[]>([
    {
      _id: 'lp_1',
      title: 'Master Degree Abroad',
      eventType: 'higher_education',
      targetDate: '2027-08-01',
      estimatedOneTimeCost: 1500000,
      estimatedMonthlyCostChange: 20000,
      currentSavedAmount: 350000,
      monthlyContribution: 25000
    },
    {
      _id: 'lp_2',
      title: 'EV SUV Purchase',
      eventType: 'vehicle_purchase',
      targetDate: '2026-11-15',
      estimatedOneTimeCost: 400000,
      estimatedMonthlyCostChange: 12000,
      currentSavedAmount: 180000,
      monthlyContribution: 20000
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Life Transition Planner
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Plan major milestones: studying abroad, relocating, vehicle/home purchases & marriage
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map((p) => (
          <div key={p._id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">{p.title}</h3>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {p.eventType}
              </span>
            </div>

            <div className="text-xs space-y-1 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Estimated One-Time Cost:</span>
                <span className="font-bold">{formatCurrency(p.estimatedOneTimeCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Completion Date:</span>
                <span className="font-bold">{new Date(p.targetDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly Savings Allocated:</span>
                <span className="font-bold text-emerald-400">{formatCurrency(p.monthlyContribution)}/mo</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
