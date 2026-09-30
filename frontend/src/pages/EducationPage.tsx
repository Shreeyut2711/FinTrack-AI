import React from 'react';
import { BookOpen, CheckCircle, Award } from 'lucide-react';

export const EducationPage: React.FC = () => {
  const lessons = [
    { title: 'The 50/30/20 Budgeting Rule', category: 'Budgeting', duration: '3 min read', desc: 'How to divide income into Needs (50%), Wants (30%), and Savings/Debt (20%).' },
    { title: 'Building a 6-Month Emergency Buffer', category: 'Safety Net', duration: '4 min read', desc: 'Why liquid emergency capital prevents high-interest debt during job transitions.' },
    { title: 'Power of Compound Interest in SIPs', category: 'Investing', duration: '5 min read', desc: 'How monthly index fund investments grow exponentially over 10+ years.' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Adaptive Financial Education
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Contextual bite-sized lessons & budgeting guides tailored to your active financial behavior
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {lessons.map((l, idx) => (
          <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {l.category}
              </span>
              <span className="text-[10px] text-slate-500">{l.duration}</span>
            </div>
            <h3 className="font-bold text-sm text-white">{l.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{l.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
