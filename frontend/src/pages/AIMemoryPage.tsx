import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Brain, Trash2, Plus, Sparkles } from 'lucide-react';

export const AIMemoryPage: React.FC = () => {
  const [memories, setMemories] = useState<any[]>([
    { _id: 'm_1', key: 'Career Goal', value: "Saving for a Master's degree in AI & Data Science", category: 'goal_note' },
    { _id: 'm_2', key: 'Risk Preference', value: 'Prefers conservative 6-month emergency fund buffer before investing', category: 'preference' }
  ]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const res = await api.get('/memory');
      if (res.data.success && res.data.memories.length > 0) {
        setMemories(res.data.memories);
      }
    } catch (err) {}
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey || !newValue) return;
    try {
      await api.post('/memory', { key: newKey, value: newValue });
      fetchMemories();
    } catch (err) {
      setMemories((prev) => [...prev, { _id: `m_${Date.now()}`, key: newKey, value: newValue, category: 'general' }]);
    } finally {
      setNewKey('');
      setNewValue('');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/memory/${id}`);
      setMemories((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      setMemories((prev) => prev.filter((m) => m._id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Unified AI Financial Memory
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          User-controlled preferences & strategic priorities remembered by your AI CFO
        </p>
      </div>

      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="font-bold text-sm text-white">Save Custom Preference / Priority</h3>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Key (e.g. Priority)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none sm:w-48"
          />
          <input
            type="text"
            placeholder="Value (e.g. Saving for higher education)"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
          >
            Save Memory
          </button>
        </form>
      </div>

      <div className="space-y-2">
        {memories.map((m) => (
          <div key={m._id} className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-emerald-400">{m.key}</div>
              <p className="text-slate-200 mt-0.5">{m.value}</p>
            </div>
            <button
              onClick={() => handleDelete(m._id)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
