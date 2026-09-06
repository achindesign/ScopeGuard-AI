import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

const ANALYSIS_STEPS = [
  'Understanding current state and baseline requirements...',
  'Deconstructing proposed change scope and user expectations...',
  'Evaluating 14 impact areas across architecture and business rules...',
  'Mapping internal system dependencies and external integration contracts...',
  'Calculating overall Change Impact Score and risk matrix...',
  'Identifying impacted stakeholders and required engagement levels...',
  'Generating regression testing scope and QA coverage areas...',
  'Synthesizing Change Impact Assessment report and action checklist...'
];

export const AnalysisLoadingScreen: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(100, Math.round(((activeStep + 1) / ANALYSIS_STEPS.length) * 100));

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-1">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            ScopeGuard AI Analyzing Impact
          </h2>
          <p className="text-xs text-slate-400">
            Evaluating architectural blast radius, risks, dependencies, and testing scope.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Assessing Ripple Effects
            </span>
            <span className="text-slate-400 font-mono">{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step-by-Step Checklist */}
        <div className="space-y-2.5 pt-2">
          {ANALYSIS_STEPS.map((stepText, idx) => {
            const isDone = idx < activeStep;
            const isCurrent = idx === activeStep;

            return (
              <div 
                key={idx}
                className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                  isDone 
                    ? 'text-slate-300 font-medium' 
                    : isCurrent 
                    ? 'text-indigo-300 font-semibold scale-[1.01]' 
                    : 'text-slate-600 opacity-60'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="h-4 w-4 text-indigo-400 animate-spin shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border border-slate-700 shrink-0" />
                )}
                <span>{stepText}</span>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-center pt-2 text-[11px] text-slate-500 border-t border-slate-800">
          Powered by ScopeGuard AI & Gemini 3.7 Flash
        </div>
      </div>
    </div>
  );
};
