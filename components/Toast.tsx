'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const isSuccess = t.type === 'success';
        const isError = t.type === 'error';

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-xl border shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
              isSuccess
                ? 'bg-slate-900 text-parchment border-gold/40'
                : isError
                ? 'bg-red-950 text-red-100 border-red-800'
                : 'bg-slate-800 text-slate-100 border-slate-700'
            }`}
          >
            <div className="flex items-start gap-3">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-gold shrink-0 mt-0.5" />}
              {isError && <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />}
              <span className="text-xs font-mono font-medium leading-relaxed">{t.message}</span>
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              className="text-slate-400 hover:text-white transition-colors shrink-0"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
