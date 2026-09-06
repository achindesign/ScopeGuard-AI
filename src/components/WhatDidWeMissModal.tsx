import React, { useState } from 'react';
import { Sparkles, X, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { ChangeAnalysis } from '../types';

interface WhatDidWeMissModalProps {
  isOpen: boolean;
  analysis: ChangeAnalysis | null;
  onClose: () => void;
  onSuccess: (updatedAnalysis: ChangeAnalysis) => void;
}

export const WhatDidWeMissModal: React.FC<WhatDidWeMissModalProps> = ({
  isOpen,
  analysis,
  onClose,
  onSuccess
}) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !analysis) return null;

  const handleRun = async () => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/what-did-we-miss', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysis_id: analysis.id,
          custom_prompt: customPrompt.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to discover additional considerations');
      }

      const data = await response.json();
      onSuccess(data.analysis);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error running What Did We Miss analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">What Did We Miss?</h3>
              <p className="text-xs text-slate-500">Uncover subtle blindspots & architectural edge cases</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Content & Prompt */}
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 leading-relaxed">
            ScopeGuard AI will re-examine <strong>{analysis.project_name}</strong> to search for subtle technical blind spots, race conditions, edge-case failure modes, data lifecycle policies, and compliance considerations.
          </p>

          <div>
            <label className="block font-bold text-slate-800 mb-1.5">
              Specific Area to Investigate (Optional):
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Focus on GDPR right to be forgotten, mobile carrier SMS deliverability timeouts, and database optimistic locking."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none"
              disabled={isLoading}
            />
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-slate-600 space-y-1">
            <span className="font-semibold text-slate-800 block">Suggested Investigation Areas:</span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'Data Purge & Retention',
                'Concurrency & Mutex Locks',
                'Carrier Delivery Latency',
                'Third-Party SLA Failures',
                'Account Takeover Threat Modeling'
              ].map((suggestion, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCustomPrompt(suggestion)}
                  className="rounded bg-white border border-slate-200 px-2 py-1 text-[11px] text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition cursor-pointer"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="modal-run-deep-dive-btn"
            type="button"
            onClick={handleRun}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Analyzing Blindspots...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Discover Blindspots</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
