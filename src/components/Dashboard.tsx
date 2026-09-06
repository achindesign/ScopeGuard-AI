import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  FileText, 
  ArrowUpRight, 
  Trash2, 
  Download, 
  AlertTriangle, 
  Layers, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import { ChangeAnalysis, UserProfile } from '../types';
import { PRESET_CHANGE_TEMPLATES } from '../data/samples';
import { exportAnalysisToPDF } from '../utils/pdfExport';

interface DashboardProps {
  analyses: ChangeAnalysis[];
  currentUser: UserProfile | null;
  onNewAnalysis: (prefill?: any) => void;
  onSelectAnalysis: (analysis: ChangeAnalysis) => void;
  onDeleteAnalysis: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  analyses,
  currentUser,
  onNewAnalysis,
  onSelectAnalysis,
  onDeleteAnalysis
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterImpact, setFilterImpact] = useState<string>('ALL');

  // Compute metrics
  const totalAnalyses = analyses.length;
  const avgScore = totalAnalyses > 0 
    ? Math.round(analyses.reduce((acc, a) => acc + a.overall_impact_score, 0) / totalAnalyses) 
    : 0;
  const highImpactCount = analyses.filter(a => a.overall_impact_score >= 61).length;
  const criticalRisksCount = analyses.reduce((acc, a) => {
    return acc + (a.risks?.filter(r => r.risk_level === 'Critical' || r.risk_level === 'High').length || 0);
  }, 0);

  // Filter analyses
  const filteredAnalyses = analyses.filter(a => {
    const matchesSearch = 
      a.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.proposed_change.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.current_state.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesImpact = 
      filterImpact === 'ALL' ||
      (filterImpact === 'HIGH' && a.overall_impact_score >= 61) ||
      (filterImpact === 'MODERATE' && a.overall_impact_score >= 41 && a.overall_impact_score < 61) ||
      (filterImpact === 'LOW' && a.overall_impact_score < 41);

    return matchesSearch && matchesImpact;
  });

  const getScoreBadgeClass = (score: number) => {
    if (score >= 81) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (score >= 61) return 'bg-orange-50 text-orange-700 border-orange-200';
    if (score >= 41) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header with Welcome & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">
              <ShieldCheck className="h-4 w-4" /> Change Impact Intelligence Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Welcome back{currentUser ? `, ${currentUser.full_name.split(' ')[0]}` : ''}.
            </h1>
            <p className="mt-1 text-sm text-slate-500 max-w-xl">
              Inspect proposed modifications across your system architecture, evaluate blast radiuses, and eliminate delivery surprises.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              id="dashboard-new-analysis-btn"
              onClick={() => onNewAnalysis()}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition cursor-pointer"
            >
              <PlusCircle className="h-5 w-5" />
              <span>+ Analyze New Change</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Total Analyses</span>
              <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <FileText className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
              {totalAnalyses}
            </div>
            <div className="mt-1 text-xs text-slate-500 flex items-center gap-1">
              <span>Change assessments created</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Average Impact Score</span>
              <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
              {avgScore}<span className="text-sm font-normal text-slate-400">/100</span>
            </div>
            <div className="mt-1 text-xs text-slate-500">
              {avgScore >= 60 ? 'High blast radius average' : 'Moderate overall complexity'}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">High / Critical Changes</span>
              <div className="h-8 w-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-rose-600">
              {highImpactCount}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              Requiring cross-team alignment
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Critical Risks Tracked</span>
              <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
              {criticalRisksCount}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              With actionable mitigations
            </div>
          </div>
        </div>

        {/* Quick-Start Preset Templates */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">
                Industry Change Scenarios (Quick-Start Templates)
              </h2>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Pre-populated real-world change requests
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {PRESET_CHANGE_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => onNewAnalysis(tpl)}
                className="group text-left rounded-xl border border-slate-200 p-4 hover:border-indigo-400 hover:bg-indigo-50/20 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 mb-1.5 transition-colors line-clamp-1">
                    {tpl.name}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {tpl.proposed_change}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-indigo-600">
                  <span>Load Scenario</span>
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Analyses Section */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Section Toolbar */}
          <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Change Analyses History</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage, review, or export previously analyzed change proposals.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search projects or changes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 pl-9 pr-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Impact Filter */}
              <div className="shrink-0">
                <select
                  value={filterImpact}
                  onChange={(e) => setFilterImpact(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:border-indigo-500 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Impacts</option>
                  <option value="HIGH">High / Critical (61-100)</option>
                  <option value="MODERATE">Moderate (41-60)</option>
                  <option value="LOW">Low (0-40)</option>
                </select>
              </div>
            </div>
          </div>

          {/* List or Table */}
          {filteredAnalyses.length === 0 ? (
            <div className="py-16 text-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No matching analyses found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {searchTerm ? 'Try adjusting your search query or filter settings.' : 'Start your first change impact assessment to populate the dashboard.'}
              </p>
              <button
                onClick={() => onNewAnalysis()}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 cursor-pointer"
              >
                <PlusCircle className="h-4 w-4" /> Create New Analysis
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Project / Analysis</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Impact Score</th>
                    <th className="py-3 px-4">Risks</th>
                    <th className="py-3 px-4">Dependencies</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAnalyses.map((a) => {
                    const scoreClass = getScoreBadgeClass(a.overall_impact_score);
                    const formattedDate = new Date(a.created_at || Date.now()).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    });

                    return (
                      <tr key={a.id} className="hover:bg-slate-50/60 transition-colors group">
                        <td className="py-4 px-4 sm:px-6">
                          <button
                            onClick={() => onSelectAnalysis(a)}
                            className="text-left font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer block"
                          >
                            {a.project_name}
                          </button>
                          <p className="text-[11px] text-slate-500 line-clamp-1 max-w-md mt-0.5">
                            {a.proposed_change}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-slate-500 whitespace-nowrap">
                          {formattedDate}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-bold ${scoreClass}`}>
                            <span>{a.overall_impact_score}/100</span>
                            <span className="text-[10px] font-medium uppercase">({a.impact_classification})</span>
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-700">
                            {a.risks?.length || 0}
                          </span>
                          <span className="text-slate-400 text-[11px]"> identified</span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="font-semibold text-slate-700">
                            {a.dependencies?.length || 0}
                          </span>
                          <span className="text-slate-400 text-[11px]"> mapped</span>
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                          <button
                            id={`view-analysis-${a.id}`}
                            onClick={() => onSelectAnalysis(a)}
                            className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition cursor-pointer"
                            title="Open full assessment"
                          >
                            View
                          </button>
                          <button
                            onClick={() => exportAnalysisToPDF(a)}
                            className="inline-flex items-center p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition cursor-pointer"
                            title="Export PDF report"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onDeleteAnalysis(a.id)}
                            className="inline-flex items-center p-1.5 rounded-md text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                            title="Delete analysis"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
