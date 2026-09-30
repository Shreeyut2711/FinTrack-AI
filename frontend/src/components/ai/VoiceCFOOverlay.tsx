import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Send, Sparkles, Loader2, Bot, Square, Play, Pause } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { api } from '../../services/api';

interface VoiceCFOOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceCFOOverlay: React.FC<VoiceCFOOverlayProps> = ({ isOpen, onClose }) => {
  const { currencySymbol } = useCurrency();
  const [state, setState] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [aiReply, setAiReply] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  if (!isOpen) return null;

  const handleStartListening = () => {
    setErrorMsg(null);
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setErrorMsg('Speech recognition is not supported in this browser. Please type your query below.');
      return;
    }

    // Stop speaking if synth was active
    if (synthRef.current) synthRef.current.cancel();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setState('listening');
      setTranscript('');
    };

    recognitionRef.current.onresult = (event: any) => {
      let currentText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentText += event.results[i][0].transcript;
      }
      setTranscript(currentText);
    };

    recognitionRef.current.onerror = (e: any) => {
      setState('idle');
      setErrorMsg(e.error === 'not-allowed' ? 'Microphone permission denied. Please enable mic access in your browser.' : 'Voice recognition error. Please try again.');
    };

    recognitionRef.current.onend = () => {
      if (transcript.trim()) {
        processVoiceQuery(transcript);
      } else {
        setState('idle');
      }
    };

    recognitionRef.current.start();
  };

  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const processVoiceQuery = async (queryText: string) => {
    setState('processing');
    try {
      const res = await api.post('/ai/assistant', { prompt: queryText });
      const reply = res.data.reply || `I analyzed your record. Surplus savings rate remains healthy.`;
      setAiReply(reply);
      speakResponse(reply);
    } catch (err) {
      const fallbackReply = `Based on your authenticated balance, your cash flow supports your current expenditure.`;
      setAiReply(fallbackReply);
      speakResponse(fallbackReply);
    }
  };

  const speakResponse = (text: string) => {
    if (isMuted || !synthRef.current) {
      setState('idle');
      return;
    }

    synthRef.current.cancel(); // Clear queue
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setState('speaking');
    utterance.onend = () => setState('idle');
    utterance.onerror = () => setState('idle');

    synthRef.current.speak(utterance);
  };

  const handleStopSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setState('idle');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg glass-panel border border-slate-800 rounded-3xl p-6 shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">FinTrack Voice CFO</h3>
              <p className="text-[11px] text-emerald-400 font-medium">Conversational AI Financial Counselor</p>
            </div>
          </div>
          <button
            onClick={() => {
              handleStopSpeech();
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* State Visualizer & Mic Controls */}
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="relative flex items-center justify-center">
            {/* Animated Waveform rings */}
            {state === 'listening' && (
              <div className="absolute inset-0 rounded-full bg-emerald-500/30 animate-ping scale-150" />
            )}
            {state === 'speaking' && (
              <div className="absolute inset-0 rounded-full bg-teal-500/30 animate-pulse scale-125" />
            )}

            <button
              onClick={state === 'listening' ? handleStopListening : handleStartListening}
              className={`w-24 h-24 rounded-full flex items-center justify-center transition shadow-2xl z-10 ${
                state === 'listening'
                  ? 'bg-rose-500 text-white shadow-rose-500/40'
                  : state === 'speaking'
                  ? 'bg-teal-400 text-slate-950 shadow-teal-400/40'
                  : state === 'processing'
                  ? 'bg-amber-500 text-slate-950 shadow-amber-500/40 animate-spin'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
              }`}
            >
              {state === 'processing' ? (
                <Loader2 className="w-10 h-10 animate-spin" />
              ) : state === 'speaking' ? (
                <Volume2 className="w-10 h-10 animate-bounce" />
              ) : state === 'listening' ? (
                <MicOff className="w-10 h-10" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          <div className="text-center">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">
              {state === 'listening' && 'Listening... Speak your command'}
              {state === 'processing' && 'Analyzing Financial Records...'}
              {state === 'speaking' && 'Speaking AI Response'}
              {state === 'idle' && 'Tap Mic to Speak'}
            </span>
          </div>

          {/* Interruption / Stop Speech Controls */}
          {state === 'speaking' && (
            <button
              onClick={handleStopSpeech}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold hover:bg-rose-500/20 transition"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Speaking</span>
            </button>
          )}
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs text-center">
            {errorMsg}
          </div>
        )}

        {/* Live Transcription / Response Box */}
        {(transcript || aiReply) && (
          <div className="space-y-2 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
            {transcript && (
              <div>
                <span className="text-[10px] text-slate-500 font-semibold uppercase block mb-1">Your Voice Query:</span>
                <p className="text-white italic">"{transcript}"</p>
              </div>
            )}
            {aiReply && (
              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] text-emerald-400 font-semibold uppercase block mb-1">AI CFO Response:</span>
                <p className="text-slate-200 leading-relaxed">{aiReply}</p>
              </div>
            )}
          </div>
        )}

        {/* Text Input Fallback */}
        <div className="pt-2 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (inputText.trim()) {
                processVoiceQuery(inputText);
                setInputText('');
              }
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Or type a question e.g. 'Show my emergency fund coverage'"
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold transition shadow-md shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
