import React, { useState } from 'react';
import { Mic, MicOff, X, Check, Loader2 } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { api } from '../../services/api';

interface VoiceInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (tx: any) => void;
}

export const VoiceInputModal: React.FC<VoiceInputModalProps> = ({ isOpen, onClose, onAddTransaction }) => {
  const { currencySymbol } = useCurrency();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [manualText, setManualText] = useState('');
  const [extractedData, setExtractedData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleStartVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use text entry fallback below.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setIsListening(false);
      processText(text);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processText = async (text: string) => {
    setLoading(true);
    try {
      // Parse voice text details
      const q = text.toLowerCase();
      const amountMatch = q.match(/(\d+(?:\.\d+)?)/);
      const amount = amountMatch ? parseFloat(amountMatch[1]) : 250;

      let type: 'income' | 'expense' = 'expense';
      if (q.includes('income') || q.includes('received') || q.includes('got') || q.includes('salary')) {
        type = 'income';
      }

      const catRes = await api.post('/ai/categorize', { description: text });
      const category = catRes.data.category || 'Food & Dining';

      setExtractedData({
        name: text.length > 30 ? text.slice(0, 30) + '...' : text,
        amount,
        type,
        category,
        paymentMethod: 'UPI',
        date: new Date().toISOString().slice(0, 10),
        description: `Voice logged: "${text}"`
      });
    } catch (err) {
      setExtractedData({
        name: text,
        amount: 250,
        type: 'expense',
        category: 'Food & Dining',
        paymentMethod: 'UPI',
        date: new Date().toISOString().slice(0, 10)
      });
    } finally {
      setLoading(false);
    }
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

        <h3 className="text-lg font-bold text-white mb-1">Voice Expense Entry</h3>
        <p className="text-xs text-slate-400 mb-6">
          Speak your transaction e.g., "Add an expense of 250 rupees for lunch today"
        </p>

        {/* Voice Trigger Button */}
        <div className="flex flex-col items-center justify-center mb-6">
          <button
            onClick={handleStartVoice}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition shadow-xl ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>
          <span className="text-xs font-semibold text-slate-300 mt-3">
            {isListening ? 'Listening...' : 'Tap Mic to Speak'}
          </span>
        </div>

        {/* Text Fallback Input */}
        <div className="mb-6">
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Text Entry Fallback</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="e.g. Spent 450 for Swiggy dinner"
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <button
              onClick={() => processText(manualText)}
              disabled={!manualText.trim()}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-400 disabled:opacity-40 transition"
            >
              Parse
            </button>
          </div>
        </div>

        {/* Confirmation Form */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-4 text-xs text-emerald-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Parsing transaction speech...</span>
          </div>
        )}

        {extractedData && !loading && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 mb-6 space-y-3">
            <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Extracted Transaction Details</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Confirmation</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500">Merchant / Name:</span>
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
                <span className="text-slate-500">Category:</span>
                <input
                  type="text"
                  value={extractedData.category}
                  onChange={(e) => setExtractedData({ ...extractedData, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs mt-0.5"
                />
              </div>
              <div>
                <span className="text-slate-500">Type:</span>
                <select
                  value={extractedData.type}
                  onChange={(e) => setExtractedData({ ...extractedData, type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs mt-0.5"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
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
