import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { Upload, FileText, Check, Loader2 } from 'lucide-react';

export const DocumentIntelligencePage: React.FC = () => {
  const { formatCurrency } = useCurrency();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [extracted, setExtracted] = useState<any | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setLoading(true);
      setTimeout(() => {
        setExtracted({
          merchant: 'Supermarket Store',
          amount: 2450,
          date: new Date().toISOString().slice(0, 10),
          category: 'Shopping',
          items: [
            { name: 'Household Items', price: 1450 },
            { name: 'Pantry Supplies', price: 1000 }
          ]
        });
        setLoading(false);
      }, 1200);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Financial Document Intelligence
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Upload bank statements, salary slips, bills & receipts for automated OCR data extraction
        </p>
      </div>

      <label className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition group">
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2 group-hover:scale-110 transition">
          <Upload className="w-8 h-8" />
        </div>
        <span className="text-sm font-semibold text-slate-200">
          {file ? file.name : 'Upload Financial Document or Statement'}
        </span>
        <span className="text-xs text-slate-500 mt-1">PDF, PNG, JPG up to 10MB</span>
        <input type="file" onChange={handleFile} className="hidden" />
      </label>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-6 text-xs text-emerald-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Extracting structured data from document...</span>
        </div>
      )}

      {extracted && !loading && (
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Extracted Document Records</h3>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
              Review Before Import
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500">Merchant / Issuer:</span>
              <input
                type="text"
                value={extracted.merchant}
                onChange={(e) => setExtracted({ ...extracted, merchant: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white mt-1"
              />
            </div>
            <div>
              <span className="text-slate-500">Amount:</span>
              <input
                type="number"
                value={extracted.amount}
                onChange={(e) => setExtracted({ ...extracted, amount: parseFloat(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-white mt-1"
              />
            </div>
          </div>

          <button
            onClick={() => alert('Document transactions imported successfully!')}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
          >
            Confirm & Import to Ledger
          </button>
        </div>
      )}
    </div>
  );
};
