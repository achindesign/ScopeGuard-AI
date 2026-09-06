import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Layers, 
  FileText, 
  Plus, 
  X, 
  Check, 
  AlertCircle,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { AnalysisInputPayload } from '../types';
import { PRESET_CHANGE_TEMPLATES } from '../data/samples';

interface NewAnalysisWizardProps {
  initialPayload?: Partial<AnalysisInputPayload>;
  onRunAnalysis: (payload: AnalysisInputPayload) => void;
  onCancel: () => void;
}

export const NewAnalysisWizard: React.FC<NewAnalysisWizardProps> = ({
  initialPayload,
  onRunAnalysis,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [projectName, setProjectName] = useState(initialPayload?.project_name || '');
  const [currentState, setCurrentState] = useState(initialPayload?.current_state || '');
  const [proposedChange, setProposedChange] = useState(initialPayload?.proposed_change || '');
  const [businessContext, setBusinessContext] = useState(initialPayload?.business_context || '');
  const [dependencies, setDependencies] = useState<string[]>(initialPayload?.existing_dependencies || []);
  const [dependencyInput, setDependencyInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Update fields if initialPayload changes
  useEffect(() => {
    if (initialPayload) {
      if (initialPayload.project_name) setProjectName(initialPayload.project_name);
      if (initialPayload.current_state) setCurrentState(initialPayload.current_state);
      if (initialPayload.proposed_change) setProposedChange(initialPayload.proposed_change);
      if (initialPayload.business_context) setBusinessContext(initialPayload.business_context);
      if (initialPayload.existing_dependencies) setDependencies(initialPayload.existing_dependencies);
    }
  }, [initialPayload]);

  const handleAddDependency = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = dependencyInput.trim();
    if (trimmed && !dependencies.includes(trimmed)) {
      setDependencies([...dependencies, trimmed]);
      setDependencyInput('');
    }
  };

  const handleRemoveDependency = (depToRemove: string) => {
    setDependencies(dependencies.filter(d => d !== depToRemove));
  };

  const handleApplyTemplate = (tpl: typeof PRESET_CHANGE_TEMPLATES[0]) => {
    setProjectName(tpl.project_name);
    setCurrentState(tpl.current_state);
    setProposedChange(tpl.proposed_change);
    setBusinessContext(tpl.business_context);
    setDependencies(tpl.existing_dependencies);
    setErrorMsg('');
  };

  const handleNext = () => {
    setErrorMsg('');
    if (currentStep === 1) {
      if (!projectName.trim()) {
        setErrorMsg('Please enter a project or analysis name.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!currentState.trim()) {
        setErrorMsg('Please describe the current state or existing requirement.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!proposedChange.trim()) {
        setErrorMsg('Please describe the proposed change.');
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5) {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    setErrorMsg('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  const handleSubmit = () => {
    if (!projectName.trim() || !currentState.trim() || !proposedChange.trim()) {
      setErrorMsg('Please complete all required fields before running the analysis.');
      return;
    }

    onRunAnalysis({
      project_name: projectName.trim(),
      current_state: currentState.trim(),
      proposed_change: proposedChange.trim(),
      business_context: businessContext.trim() || undefined,
      existing_dependencies: dependencies.length > 0 ? dependencies : undefined
    });
  };

  const steps = [
    { num: 1, label: 'Project Info' },
    { num: 2, label: 'Current State' },
    { num: 3, label: 'Proposed Change' },
    { num: 4, label: 'Context & Deps' },
    { num: 5, label: 'Review & Analyze' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Top Stepper Navigation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Step {currentStep} of 5
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {currentStep === 1 && 'Project & Analysis Information'}
                {currentStep === 2 && 'Existing Requirement / Current State'}
                {currentStep === 3 && 'Proposed Change Details'}
                {currentStep === 4 && 'Business Context & Known Dependencies'}
                {currentStep === 5 && 'Review Scope & Run Analysis'}
              </h1>
            </div>
            <button
              onClick={onCancel}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              Cancel & Exit
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <button
                key={step.num}
                onClick={() => {
                  if (step.num < currentStep) setCurrentStep(step.num);
                }}
                disabled={step.num > currentStep}
                className={`h-2 flex-1 rounded-full transition-all cursor-pointer ${
                  step.num === currentStep
                    ? 'bg-indigo-600 ring-2 ring-indigo-200'
                    : step.num < currentStep
                    ? 'bg-indigo-400'
                    : 'bg-slate-200 cursor-not-allowed'
                }`}
                title={`Step ${step.num}: ${step.label}`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Card Body */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          {errorMsg && (
            <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs sm:text-sm text-rose-800 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Project Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Project or Analysis Title <span className="text-rose-500">*</span>
                </label>
                <input
                  id="wizard-project-name"
                  type="text"
                  placeholder="e.g., Customer Profile Management Enhancement"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                  autoFocus
                />
                <p className="mt-2 text-xs text-slate-500">
                  Give this change impact evaluation a descriptive name matching your ticket, epic, or change request.
                </p>
              </div>

              {/* Quick Preset Selector */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">
                  Or pick a pre-configured industry scenario:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {PRESET_CHANGE_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleApplyTemplate(tpl)}
                      className="text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition text-xs cursor-pointer group"
                    >
                      <div className="font-bold text-slate-900 group-hover:text-indigo-600">
                        {tpl.name}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {tpl.proposed_change}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Current State */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Existing Requirement / Current State <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="wizard-current-state"
                  rows={6}
                  placeholder="Example: Customers can update their registered email address through the profile management page. The updated email address is validated and synchronized with the CRM system."
                  value={currentState}
                  onChange={(e) => setCurrentState(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none leading-relaxed font-sans"
                  autoFocus
                />
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-600 space-y-1">
                <span className="font-semibold text-slate-800 block">Helpful Cues for Current State:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                  <li>What is the current business capability or user workflow?</li>
                  <li>How does the existing system validate and persist data?</li>
                  <li>Are there existing background jobs or third-party webhooks in place?</li>
                </ul>
              </div>
            </div>
          )}

          {/* STEP 3: Proposed Change */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Proposed Change Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="wizard-proposed-change"
                  rows={6}
                  placeholder="Example: Customers should also be able to update their registered mobile phone number through the profile management page with real-time SMS OTP verification."
                  value={proposedChange}
                  onChange={(e) => setProposedChange(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none leading-relaxed"
                  autoFocus
                />
              </div>

              <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-4 text-xs text-indigo-900 space-y-1">
                <span className="font-semibold text-indigo-950 block">Best Practice:</span>
                <p className="text-indigo-800">
                  Even if the stakeholder said "It's just adding a small field", describe the full expected user behavior. ScopeGuard AI will detect security, database, API, and downstream synchronization ramifications.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: Business Context & Dependencies */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Optional Business & Architectural Context
                </label>
                <textarea
                  id="wizard-business-context"
                  rows={3}
                  placeholder="Example: The application integrates with CRM, Identity Management, Notification Service, and Customer Data Platform."
                  value={businessContext}
                  onChange={(e) => setBusinessContext(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Mention relevant infrastructure, compliance frameworks (GDPR, PCI, HIPAA), or team dependencies.
                </p>
              </div>

              {/* Tag-based Dependencies */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Known Existing Dependencies (Optional)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    id="wizard-dep-input"
                    type="text"
                    placeholder="e.g. CRM API, Customer Database, OTP Service..."
                    value={dependencyInput}
                    onChange={(e) => setDependencyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDependency();
                      }
                    }}
                    className="flex-1 rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddDependency()}
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>

                {/* Dependency Tags */}
                {dependencies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {dependencies.map((dep, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
                      >
                        <span>{dep}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDependency(dep)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    No dependencies entered yet. The AI will also detect potential dependencies automatically.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
                    Project / Analysis
                  </span>
                  <div className="text-base font-bold text-slate-900">{projectName}</div>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Current State
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-mono">
                    {currentState}
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                    Proposed Change
                  </span>
                  <p className="text-xs font-semibold text-indigo-950 leading-relaxed">
                    {proposedChange}
                  </p>
                </div>

                {(businessContext || dependencies.length > 0) && (
                  <div className="border-t border-slate-200 pt-3 space-y-2 text-xs">
                    {businessContext && (
                      <div>
                        <span className="font-bold text-slate-600">Context:</span> {businessContext}
                      </div>
                    )}
                    {dependencies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="font-bold text-slate-600 mr-1">Dependencies:</span>
                        {dependencies.map((d, i) => (
                          <span key={i} className="rounded bg-white border border-slate-200 px-2 py-0.5 text-[11px] text-slate-700">
                            {d}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-indigo-50/80 border border-indigo-200 p-4 text-xs text-indigo-900 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-indigo-600 shrink-0" />
                <div>
                  <strong className="block font-bold">Ready to analyze across 14 dimensions:</strong>
                  Functional, Business Rules, Data Model, APIs, Integrations, Security, Risks, Stakeholders, Testing, and Open Questions.
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
            <button
              id="wizard-prev-btn"
              type="button"
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{currentStep === 1 ? 'Cancel' : 'Previous Step'}</span>
            </button>

            {currentStep < 5 ? (
              <button
                id="wizard-next-btn"
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                id="wizard-analyze-btn"
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 active:bg-indigo-800 transition cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Analyze Change Impact</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
