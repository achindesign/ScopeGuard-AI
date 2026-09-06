import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Download, 
  Printer, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles, 
  ArrowLeft, 
  Layers, 
  Database, 
  Cpu, 
  FileText, 
  Users, 
  CheckSquare, 
  ListChecks, 
  Eye, 
  Filter,
  Share2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { ChangeAnalysis, ImpactArea, ChecklistTask, AdditionalConsideration } from '../types';
import { exportAnalysisToPDF } from '../utils/pdfExport';

interface AnalysisResultsViewProps {
  analysis: ChangeAnalysis;
  onBackToDashboard: () => void;
  onReanalyze: (analysis: ChangeAnalysis) => void;
  onOpenWhatDidWeMiss: () => void;
  onToggleChecklistItem: (taskId: string, completed: boolean, phase: string) => void;
}

export const AnalysisResultsView: React.FC<AnalysisResultsViewProps> = ({
  analysis,
  onBackToDashboard,
  onReanalyze,
  onOpenWhatDidWeMiss,
  onToggleChecklistItem
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [matrixFilter, setMatrixFilter] = useState<string>('ALL');

  const score = analysis.overall_impact_score;
  const classification = analysis.impact_classification.toUpperCase();

  // Helper for Impact badge colors
  const getBadgeStyle = (level: string) => {
    const l = level?.toLowerCase() || '';
    if (l.includes('critical')) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (l.includes('high')) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (l.includes('medium') || l.includes('moderate')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (l.includes('low')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getEngagementBadge = (level: string) => {
    switch (level) {
      case 'Approve': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Collaborate': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Consult': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Checklist counts
  const allTasks = [
    ...(analysis.checklist?.before_implementation || []),
    ...(analysis.checklist?.during_development || []),
    ...(analysis.checklist?.before_release || [])
  ];
  const completedTasks = allTasks.filter(t => t.completed).length;

  const tabs = [
    { id: 'overview', label: 'Executive Summary', count: null },
    { id: 'matrix', label: 'Impact Matrix', count: analysis.impact_areas.length },
    { id: 'areas', label: '14 Impact Areas', count: analysis.impact_areas.length },
    { id: 'dependencies', label: 'Dependencies', count: analysis.dependencies.length },
    { id: 'risks', label: 'Risks & Mitigations', count: analysis.risks.length },
    { id: 'stakeholders', label: 'Stakeholders', count: analysis.stakeholders.length },
    { id: 'regression', label: 'Testing Scope', count: analysis.regression_areas.length },
    { id: 'documentation', label: 'Documentation', count: analysis.documentation_impacts.length },
    { id: 'questions', label: 'Open Questions', count: analysis.open_questions.length },
    { id: 'checklist', label: 'Checklist', count: `${completedTasks}/${allTasks.length}` },
    { id: 'considerations', label: 'What Did We Miss?', count: analysis.additional_considerations?.length || 0 }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Top Back & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Dashboard</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="results-what-did-we-miss-btn"
              onClick={onOpenWhatDidWeMiss}
              className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition shadow-sm cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-indigo-600" />
              <span>What Did We Miss?</span>
            </button>

            <button
              id="results-export-pdf-btn"
              onClick={() => exportAnalysisToPDF(analysis)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-sm cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Export PDF Report</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              title="Print assessment"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={() => onReanalyze(analysis)}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              title="Edit inputs and re-run assessment"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Re-analyze</span>
            </button>
          </div>
        </div>

        {/* Hero Impact Score Banner */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span>Change Impact Assessment</span>
                <span>•</span>
                <span>{new Date(analysis.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {analysis.project_name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                {analysis.executive_summary.change_overview}
              </p>
            </div>

            {/* Score & Gauge Block */}
            <div className="flex items-center gap-5 shrink-0 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-slate-900">
                  {score}
                  <span className="text-base text-slate-400 font-normal">/100</span>
                </div>
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  Impact Score
                </div>
              </div>

              <div className="h-10 w-px bg-slate-200" />

              <div>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${getBadgeStyle(classification)}`}>
                  {classification === 'CRITICAL' || classification === 'HIGH' ? (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}
                  {classification} IMPACT
                </span>
                <div className="text-[11px] text-slate-500 mt-1 max-w-[140px] leading-tight">
                  {score >= 60 ? 'Requires cross-functional review & regression coverage' : 'Standard sprint delivery cycle'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 bg-white rounded-t-xl px-2 overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    activeTab === tab.id 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Panels */}
        <div className="space-y-6">
          {/* 1. OVERVIEW & EXECUTIVE SUMMARY TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Executive Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Overall Assessment Statement */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <ShieldAlert className="h-4 w-4 text-indigo-600" />
                    Overall Impact Evaluation
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {analysis.executive_summary.overall_impact}
                  </p>

                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-900 block mb-2">
                      Key Areas Affected:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.executive_summary.key_areas_affected.map((area, i) => (
                        <span key={i} className="rounded-md bg-slate-100 border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-800">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Top Risks & Recommended Next Step */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700 mb-2">
                      <AlertTriangle className="h-4 w-4 text-rose-600" />
                      Top Identified Risks
                    </div>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {analysis.executive_summary.top_risks.map((risk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                          <span>{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-xl bg-indigo-50/80 border border-indigo-200 p-3.5 text-xs text-indigo-950">
                    <strong className="block font-bold text-indigo-900 mb-1">
                      Recommended Next Step:
                    </strong>
                    {analysis.executive_summary.recommended_next_step}
                  </div>
                </div>
              </div>

              {/* Current State vs Proposed Change Comparison Box */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs">
                  Change Specification Baseline
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Existing Requirement / Current State
                    </span>
                    <p className="text-slate-800 font-mono leading-relaxed">
                      {analysis.current_state}
                    </p>
                  </div>

                  <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-4">
                    <span className="font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                      Proposed Change
                    </span>
                    <p className="text-indigo-950 font-medium leading-relaxed">
                      {analysis.proposed_change}
                    </p>
                  </div>
                </div>

                {analysis.business_context && (
                  <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
                    <strong className="text-slate-800">Business & Architecture Context:</strong> {analysis.business_context}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. IMPACT MATRIX TAB */}
          {activeTab === 'matrix' && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Change Impact Matrix</h3>
                  <p className="text-xs text-slate-500">
                    Matrix breakdown across all 14 software and business delivery categories.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <select
                    value={matrixFilter}
                    onChange={(e) => setMatrixFilter(e.target.value)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
                  >
                    <option value="ALL">All Categories ({analysis.impact_areas.length})</option>
                    <option value="HIGH">High & Critical Impact Only</option>
                    <option value="MEDIUM">Medium Impact Only</option>
                    <option value="LOW">Low & None Impact Only</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4 sm:px-6">Impact Area Category</th>
                      <th className="py-3.5 px-4">Impact Level</th>
                      <th className="py-3.5 px-4">Risk Level</th>
                      <th className="py-3.5 px-4">Description & Technical Rationale</th>
                      <th className="py-3.5 px-4 sm:px-6">Recommended Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {analysis.impact_areas
                      .filter(ia => {
                        if (matrixFilter === 'HIGH') return ia.impact_level === 'High' || ia.impact_level === 'Critical';
                        if (matrixFilter === 'MEDIUM') return ia.impact_level === 'Medium' || ia.impact_level === 'Moderate';
                        if (matrixFilter === 'LOW') return ia.impact_level === 'Low' || ia.impact_level === 'None';
                        return true;
                      })
                      .map((ia) => (
                        <tr key={ia.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-4 px-4 sm:px-6 font-bold text-slate-900 whitespace-nowrap">
                            {ia.category}
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getBadgeStyle(ia.impact_level)}`}>
                              {ia.impact_level}
                            </span>
                          </td>
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getBadgeStyle(ia.risk_level || ia.impact_level)}`}>
                              {ia.risk_level || ia.impact_level}
                            </span>
                          </td>
                          <td className="py-4 px-4 max-w-sm text-slate-700 leading-relaxed">
                            <div className="font-medium text-slate-900">{ia.description}</div>
                            {ia.reason && (
                              <div className="text-[11px] text-slate-500 mt-1">
                                <span className="font-semibold text-slate-600">Why:</span> {ia.reason}
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-4 sm:px-6 text-indigo-900 font-medium max-w-xs leading-relaxed">
                            {ia.recommended_action}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. 14 DETAILED IMPACT AREAS TAB */}
          {activeTab === 'areas' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.impact_areas.map((ia) => (
                <div 
                  key={ia.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-slate-900">{ia.category}</h4>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold ${getBadgeStyle(ia.impact_level)}`}>
                        {ia.impact_level} Impact
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 leading-relaxed font-medium">
                      {ia.description}
                    </p>
                    {ia.reason && (
                      <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <span className="font-bold text-slate-700">Rationale:</span> {ia.reason}
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-xs text-indigo-900">
                    <span className="font-bold text-indigo-950 block mb-0.5">Action Item:</span>
                    {ia.recommended_action}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 4. DEPENDENCIES TAB */}
          {activeTab === 'dependencies' && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">System Dependencies & Integrations</h3>
                <p className="text-xs text-slate-500">
                  Components, services, and external integrations coupled to this change.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {analysis.dependencies.map((dep) => (
                  <div key={dep.id} className="p-5 hover:bg-slate-50/60 transition-colors space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{dep.dependency_name}</span>
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                          {dep.dependency_type}
                        </span>
                      </div>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getBadgeStyle(dep.impact_level)}`}>
                        {dep.impact_level} Impact
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">
                      {dep.description}
                    </p>

                    <div className="rounded-lg bg-amber-50/60 border border-amber-100 p-2.5 text-xs text-amber-900">
                      <span className="font-bold text-amber-950">Investigation Required: </span>
                      {dep.investigation_required}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. RISKS & MITIGATIONS TAB */}
          {activeTab === 'risks' && (
            <div className="space-y-4">
              {analysis.risks.map((risk) => (
                <div 
                  key={risk.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-rose-500" />
                      <h4 className="text-sm font-bold text-slate-900">{risk.title}</h4>
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                        {risk.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        Prob: <strong className="text-slate-800">{risk.probability}</strong> | Impact: <strong className="text-slate-800">{risk.impact}</strong>
                      </span>
                      <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getBadgeStyle(risk.risk_level)}`}>
                        {risk.risk_level} Risk
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">
                    {risk.description}
                  </p>

                  <div className="rounded-xl bg-emerald-50/80 border border-emerald-200 p-3 text-xs text-emerald-950">
                    <span className="font-bold text-emerald-900 block mb-0.5">Mitigation Strategy:</span>
                    {risk.mitigation}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 6. STAKEHOLDERS TAB */}
          {activeTab === 'stakeholders' && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">Stakeholder Engagement Matrix</h3>
                <p className="text-xs text-slate-500">
                  Parties impacted by this change and their recommended level of governance engagement.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {analysis.stakeholders.map((stk) => (
                  <div key={stk.id} className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm font-bold text-slate-900">{stk.stakeholder_name}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {stk.impact_reason}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${getEngagementBadge(stk.engagement_level)}`}>
                        {stk.engagement_level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. REGRESSION TESTING SCOPE TAB */}
          {activeTab === 'regression' && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">Regression Testing Scope & Coverage Areas</h3>
                <p className="text-xs text-slate-500">
                  Critical adjacent flows and test areas to safeguard against unintended side-effects.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {analysis.regression_areas.map((reg) => (
                  <div key={reg.id} className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-bold text-slate-900">{reg.test_area}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {reg.reason}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getBadgeStyle(reg.priority)}`}>
                        {reg.priority} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. DOCUMENTATION IMPACT TAB */}
          {activeTab === 'documentation' && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">Documentation Updates Required</h3>
                <p className="text-xs text-slate-500">
                  Specifications, API documentation, runbooks, and customer collateral needing revision.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {analysis.documentation_impacts.map((doc) => (
                  <div key={doc.id} className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm font-bold text-slate-900">{doc.document_type}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {doc.impact_description}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getBadgeStyle(doc.priority)}`}>
                        {doc.priority} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. OPEN QUESTIONS TAB */}
          {activeTab === 'questions' && (
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">Critical Open Discovery Questions</h3>
                <p className="text-xs text-slate-500">
                  Key questions business analysts and tech leads must resolve before sprint commitment.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                {analysis.open_questions.map((q, idx) => (
                  <div key={q.id} className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 max-w-2xl">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{q.question}</div>
                        <span className="inline-block mt-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Category: {q.category}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getBadgeStyle(q.priority)}`}>
                        {q.priority} Priority
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 10. CHECKLIST TAB */}
          {activeTab === 'checklist' && (
            <div className="space-y-6">
              {/* Checklist Progress Overview */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Change Execution Checklist</h3>
                  <p className="text-xs text-slate-500">
                    Track change readiness before implementation, during development, and before release.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-600 font-mono">
                    {completedTasks} of {allTasks.length} Completed
                  </span>
                  <div className="w-32 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 transition-all rounded-full"
                      style={{ width: `${allTasks.length > 0 ? (completedTasks / allTasks.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 3 Phases */}
              {[
                { key: 'before_implementation', label: 'Phase 1: Before Implementation (Analysis & Architecture)', tasks: analysis.checklist.before_implementation },
                { key: 'during_development', label: 'Phase 2: During Development (Build & Unit Validation)', tasks: analysis.checklist.during_development },
                { key: 'before_release', label: 'Phase 3: Before Release (Regression, Security & Rollout)', tasks: analysis.checklist.before_release }
              ].map((phaseSection) => (
                <div key={phaseSection.key} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                  <div className="bg-slate-50/80 px-5 py-3 border-b border-slate-200 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {phaseSection.label}
                  </div>

                  <div className="divide-y divide-slate-100">
                    {phaseSection.tasks.map((task) => (
                      <label
                        key={task.id}
                        className="p-4 flex items-start gap-3 hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) => onToggleChecklistItem(task.id, e.target.checked, phaseSection.key)}
                          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                        <span className={`text-xs sm:text-sm ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800 font-medium'}`}>
                          {task.task}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 11. WHAT DID WE MISS / ADDITIONAL CONSIDERATIONS TAB */}
          {activeTab === 'considerations' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1">
                    <Sparkles className="h-4 w-4" /> AI Deep-Dive Exploration
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Overlooked Impact Areas & Secondary Blindspots
                  </h3>
                  <p className="text-xs text-slate-600 max-w-xl mt-0.5">
                    Trigger our Senior Architect AI to search for subtle concurrency race conditions, data purge policies, edge cases, and hidden dependencies.
                  </p>
                </div>

                <button
                  onClick={onOpenWhatDidWeMiss}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-sm shrink-0 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Run "What Did We Miss?"</span>
                </button>
              </div>

              {(!analysis.additional_considerations || analysis.additional_considerations.length === 0) ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600 mb-3">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">No deep-dive considerations added yet</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    Click "Run What Did We Miss?" to ask ScopeGuard AI to uncover subtle edge cases or hidden technical dependencies.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {analysis.additional_considerations.map((item) => (
                    <div 
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-indigo-600" />
                          <h4 className="text-sm font-bold text-slate-900">{item.category}</h4>
                        </div>
                        <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${getBadgeStyle(item.severity)}`}>
                          {item.severity} Severity
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-900">
                        <span className="font-bold text-slate-800 block mb-0.5">Recommended Architect Action:</span>
                        {item.recommended_action}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
