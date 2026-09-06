import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  ArrowLeft, 
  PlusCircle, 
  FileText,
  AlertTriangle,
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';
import { ChangeAnalysis } from '../types';
import { exportAnalysisToPDF } from '../utils/pdfExport';

interface HistoryViewProps {
  analyses: ChangeAnalysis[];
  onSelectAnalysis: (analysis: ChangeAnalysis) => void;
  onDeleteAnalysis: (id: string) => void;
  onNewAnalysis: () => void;
  onBackToDashboard: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  analyses,
  onSelectAnalysis,
  onDeleteAnalysis,
  onNewAnalysis,
  onBackToDashboard
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [impactFilter, setImpactFilter] = useState('ALL');

  const filtered = analyses.filter(a => {
    const matchesSearch = 
      a.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.proposed_change.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.current_state.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesImpact = 
      impactFilter === 'ALL' ||
      (impactFilter === 'CRITICAL' && a.impact_classification.toUpperCase() === 'CRITICAL') ||
      (impactFilter === 'HIGH' && a.impact_classification.toUpperCase() === 'HIGH') ||
      (impactFilter === 'MODERATE' && a.impact_classification.toUpperCase() === 'MODERATE') ||
      (impactFilter === 'LOW' && (a.impact_classification.toUpperCase() === 'LOW' || a.impact_classification.toUpperCase() === 'MINIMAL'));

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
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToDashboard}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <History className="h-5 w-5 text-indigo-600" />
                Change Impact Assessment History
              </h1>
              <p className="text-xs text-slate-500">
                Archived assessments, blast radius evaluations, and exportable change reports.
              </p>
            </div>
          </div>

          <button
            onClick={onNewAnalysis}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Analysis</span>
          </button>
        </div>

        {/* Filters Toolbar */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search across all analyzed changes and requirements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <Filter className="h-4 w-4 text-slate-400" />
              <span>Classification:</span>
            </div>
            <select
              value={impactFilter}
              onChange={(e) => setImpactFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Classifications ({analyses.length})</option>
              <option value="CRITICAL">Critical Impact (81-100)</option>
              <option value="HIGH">High Impact (61-80)</option>
              <option value="MODERATE">Moderate Impact (41-60)</option>
              <option value="LOW">Low / Minimal Impact (0-40)</option>
            </select>
          </div>
        </div>

        {/* Results List */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No assessments found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No previous analyses match your search criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((analysis) => {
              const scoreClass = getScoreBadgeClass(analysis.overall_impact_score);
              const formattedDate = new Date(analysis.created_at || Date.now()).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <div 
                  key={analysis.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {formattedDate}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase ${scoreClass}`}>
                        {analysis.overall_impact_score}/100 • {analysis.impact_classification}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectAnalysis(analysis)}
                      className="text-left font-bold text-slate-900 hover:text-indigo-600 transition-colors text-sm line-clamp-1 block cursor-pointer"
                    >
                      {analysis.project_name}
                    </button>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {analysis.proposed_change}
                    </p>

                    <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 pt-1">
                      <span className="rounded bg-slate-50 border border-slate-200 px-2 py-0.5">
                        <strong>{analysis.risks?.length || 0}</strong> Risks
                      </span>
                      <span className="rounded bg-slate-50 border border-slate-200 px-2 py-0.5">
                        <strong>{analysis.dependencies?.length || 0}</strong> Deps
                      </span>
                      <span className="rounded bg-slate-50 border border-slate-200 px-2 py-0.5">
                        <strong>{analysis.regression_areas?.length || 0}</strong> Regression
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => onSelectAnalysis(analysis)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                    >
                      Open Assessment &rarr;
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => exportAnalysisToPDF(analysis)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition cursor-pointer"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteAnalysis(analysis.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                        title="Delete assessment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
