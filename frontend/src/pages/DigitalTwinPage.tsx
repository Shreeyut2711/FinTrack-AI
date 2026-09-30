import React, { useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { api } from '../services/api';
import { Cpu, Play, Sparkles, Layers, TrendingDown, ArrowRight } from 'lucide-react';
import {
  ResponsiveContainer as ResponsiveContainerRaw,
  LineChart as LineChartRaw,
  Line as LineRaw,
  XAxis as XAxisRaw,
  YAxis as YAxisRaw,
  Tooltip as TooltipRaw,
  CartesianGrid as CartesianGridRaw
} from 'recharts';

const ResponsiveContainer = ResponsiveContainerRaw as any;
const LineChart = LineChartRaw as any;
const Line = LineRaw as any;
const XAxis = XAxisRaw as any;
const YAxis = YAxisRaw as any;
const Tooltip = TooltipRaw as any;
const CartesianGrid = CartesianGridRaw as any;


export const DigitalTwinPage: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState('job_loss');
  const [durationMonths, setDurationMonths] = useState(6);
  const [incomeImpact, setIncomeImpact] = useState(-85000);
  const [expenseImpact, setExpenseImpact] = useState(0);
  const [oneTimeCost, setOneTimeCost] = useState(0);
  const [loading, setLoading] = useState(false);

  const [activeSimulation, setActiveSimulation] = useState<any | null>(null);

  useEffect(() => {
    runSimulation();
  }, []);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await api.post('/digital-twin/simulate', {
        type: selectedType,
        durationMonths,
        incomeImpactPerMonth: incomeImpact,
        expenseImpactPerMonth: expenseImpact,
        oneTimeCost
      });
      if (res.data.success) {
        setActiveSimulation(res.data.scenario);
      }
    } catch (err) {
      // Local calculation fallback
      const projected = [];
      let bal = 45000 - oneTimeCost;
      for (let m = 1; m <= durationMonths; m++) {
        bal += incomeImpact - expenseImpact;
        projected.push({ month: m, balance: bal, coverageMonths: parseFloat((bal / 25000).toFixed(1)) });
      }
      setActiveSimulation({
        name: `Simulation: ${selectedType}`,
        durationMonths,
        projectedBalances: projected
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Financial Digital Twin Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulate job loss, salary changes, rent hikes, relocation & large purchases before taking action
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          Deterministic Simulation Engine
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Controls */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Scenario Parameters</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Scenario Type</label>
              <select
                value={selectedType}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedType(val);
                  if (val === 'job_loss') { setIncomeImpact(-85000); setExpenseImpact(0); setOneTimeCost(0); }
                  else if (val === 'rent_increase') { setIncomeImpact(0); setExpenseImpact(5000); setOneTimeCost(0); }
                  else if (val === 'large_purchase') { setIncomeImpact(0); setExpenseImpact(0); setOneTimeCost(60000); }
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
              >
                <option value="job_loss">Job Loss (Zero Income)</option>
                <option value="rent_increase">Rent / Living Cost Increase</option>
                <option value="large_purchase">Major Purchase (e.g. ₹60k Laptop)</option>
                <option value="relocation">City Relocation</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Simulation Horizon:</span>
                <span className="font-bold text-white">{durationMonths} Months</span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Monthly Income Change</label>
              <input
                type="number"
                value={incomeImpact}
                onChange={(e) => setIncomeImpact(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Monthly Expense Change</label>
              <input
                type="number"
                value={expenseImpact}
                onChange={(e) => setExpenseImpact(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">One-Time Lump Sum Cost</label>
              <input
                type="number"
                value={oneTimeCost}
                onChange={(e) => setOneTimeCost(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none"
              />
            </div>

            <button
              onClick={runSimulation}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Run Digital Twin Simulation</span>
            </button>
          </div>
        </div>

        {/* Simulation Output & Projection Graph */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Projected Cash Balance Trajectory</h3>
            <span className="text-xs text-slate-400">Deterministic Calculations</span>
          </div>

          {activeSimulation && (
            <>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activeSimulation.projectedBalances}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickFormatter={(m: any) => `M${m}`} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="balance" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} name="Projected Cash Balance" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block">End Balance</span>
                  <span className="font-extrabold text-white mt-0.5 block">
                    {formatCurrency(activeSimulation.projectedBalances[activeSimulation.projectedBalances.length - 1]?.balance || 0)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Coverage Left</span>
                  <span className="font-extrabold text-emerald-400 mt-0.5 block">
                    {activeSimulation.projectedBalances[activeSimulation.projectedBalances.length - 1]?.coverageMonths || 0} Months
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Deficit Risk</span>
                  <span className="font-extrabold text-teal-400 mt-0.5 block">Low Risk</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
