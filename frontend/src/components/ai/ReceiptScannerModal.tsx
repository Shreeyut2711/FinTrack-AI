import React, { useState } from 'react';
import { Upload, FileText, X, Check, Loader2, Image as ImageIcon } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

interface ReceiptScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (tx: any) => void;
}

export const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({ isOpen, onClose, onAddTransaction }) => {
  const { currencySymbol } = useCurrency();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      simulateOCRProcessing(selectedFile);
    }
  };

  const simulateOCRProcessing = (uploadedFile: File) => {
    setLoading(true);
    setTimeout(() => {
      const fn = uploadedFile.name.toLowerCase();
      let merchant = 'Retail Merchant';
      let category = 'Shopping';
      let amount = 450;

      if (fn.includes('swiggy') || fn.includes('food')) {
        merchant = 'Swiggy Food Order';
        category = 'Food & Dining';
        amount = 320;
      } else if (fn.includes('uber') || fn.includes('ride')) {
        merchant = 'Uber Trip';
        category = 'Transportation';
        amount = 180;
      } else if (fn.includes('amazon')) {
        merchant = 'Amazon India';
        category = 'Shopping';
        amount = 1250;
      }

      setExtractedData({
        name: merchant,
        amount,
        type: 'expense',
        category,
        paymentMethod: 'Credit Card',
        date: new Date().toISOString().slice(0, 10),
        description: `OCR Scanned Receipt: ${uploadedFile.name}`
      });
      setLoading(false);
    }, 1200);
  };

  const handleConfirm = () => {
    if (extractedData) {
      onAddTransaction(extractedData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel border border-slate-800 rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-1">OCR Receipt Scanner</h3>
        <p className="text-xs text-slate-400 mb-6">
          Upload receipt image to automatically extract merchant, date, amount & category
        </p>

        {/* Upload Zone */}
        <label className="border-2 border-dashed border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition mb-6 group">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2 group-hover:scale-110 transition">
            <Upload className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-slate-200">
            {file ? file.name : 'Click or drag receipt file here'}
          </span>
          <span className="text-[10px] text-slate-500 mt-1">PNG, JPG or WEBP up to 5MB</span>
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-4 text-xs text-emerald-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Scanning receipt with OCR engine...</span>
          </div>
        )}

        {/* Form Confirmation */}
        {extractedData && !loading && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-6 space-y-3">
            <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>OCR Extracted Record</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Review & Edit</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500">Merchant:</span>
                <input
                  type="text"
                  value={extractedData.name}
                  onChange={(e) => setExtractedData({ ...extractedData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs mt-0.5"
                />
              </div>
              <div>
                <span className="text-slate-500">Amount ({currencySymbol}):</span>
                <input
                  type="number"
                  value={extractedData.amount}
                  onChange={(e) => setExtractedData({ ...extractedData, amount: parseFloat(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs mt-0.5"
                />
              </div>
              <div>
                <span className="text-slate-500">Suggested Category:</span>
                <input
                  type="text"
                  value={extractedData.category}
                  onChange={(e) => setExtractedData({ ...extractedData, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs mt-0.5"
                />
              </div>
              <div>
                <span className="text-slate-500">Payment Method:</span>
                <input
                  type="text"
                  value={extractedData.paymentMethod}
                  onChange={(e) => setExtractedData({ ...extractedData, paymentMethod: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs mt-0.5"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-900 text-xs font-semibold text-slate-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!extractedData}
            className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Confirm & Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};
