import React from 'react';
import { 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Database, 
  Cpu, 
  FileCode2, 
  FileCheck2, 
  Users2, 
  Lock, 
  Workflow, 
  FileSpreadsheet, 
  Clock, 
  Activity,
  Layers,
  ChevronRight,
  Zap,
  HelpCircle
} from 'lucide-react';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onViewSample: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAnalysis,
  onViewSample
}) => {
  const impactCategories = [
    { name: 'Functional Requirements', desc: 'User stories, acceptance criteria, workflows', icon: FileCode2 },
    { name: 'Business Rules', desc: 'Validation constraints, edge cases, thresholds', icon: FileCheck2 },
    { name: 'User Experience / UI', desc: 'Component states, user flows, responsive design', icon: Activity },
    { name: 'Database / Data Model', desc: 'Schemas, unique indexes, column migrations', icon: Database },
    { name: 'APIs & Contracts', desc: 'Request/response payloads, backward compatibility', icon: Cpu },
    { name: 'System Integrations', desc: 'Downstream queues, CRM/CDP sync, webhooks', icon: Layers },
    { name: 'Security & Compliance', desc: 'PII handling, MFA, step-up auth, GDPR/TCPA', icon: Lock },
    { name: 'Business Processes', desc: 'Support playbooks, SOPs, manual escalations', icon: Workflow },
    { name: 'Reporting & Analytics', desc: 'Telemetry events, BI dashboards, metrics', icon: FileSpreadsheet },
    { name: 'Test Cases & QA', desc: 'Positive, negative, edge-case test matrices', icon: CheckCircle2 },
    { name: 'Regression Testing', desc: 'Adjacent workflows and shared service impact', icon: AlertTriangle },
    { name: 'Documentation Impact', desc: 'BRD, FRD, OpenAPI specs, customer FAQs', icon: FileCode2 },
    { name: 'Project Delivery Timeline', desc: 'Critical path risks, third-party vendor review', icon: Clock },
    { name: 'Operational Support', desc: 'SLA monitoring, carrier deliverability, alerts', icon: ShieldAlert }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/80 bg-white">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70 pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1.5 text-xs font-semibold text-indigo-900 shadow-sm mb-6">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>AI-Powered Change Impact Analyzer for BAs, PMs & Solution Architects</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Understand What Changes <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900">
              Before the Change Becomes a Problem.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            ScopeGuard AI analyzes proposed business and software changes to systematically identify impacted requirements, downstream systems, dependencies, risks, stakeholders, and regression testing areas.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <button
              id="hero-cta-analyze"
              onClick={onStartAnalysis}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:bg-indigo-800 cursor-pointer"
            >
              <span>Analyze a Change</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              id="hero-cta-sample"
              onClick={onViewSample}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>See Example Analysis</span>
            </button>
          </div>

          {/* Role pills */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 mr-1">Built for:</span>
            <span className="rounded bg-slate-100 px-2.5 py-1 text-slate-700 font-medium">Business Analysts</span>
            <span className="rounded bg-slate-100 px-2.5 py-1 text-slate-700 font-medium">Product Managers</span>
            <span className="rounded bg-slate-100 px-2.5 py-1 text-slate-700 font-medium">Solution Architects</span>
            <span className="rounded bg-slate-100 px-2.5 py-1 text-slate-700 font-medium">QA Engineers</span>
            <span className="rounded bg-slate-100 px-2.5 py-1 text-slate-700 font-medium">Project Managers</span>
          </div>
        </div>
      </section>

      {/* 2. PROBLEM SECTION: "It's Just a Small Change" */}
      <section className="py-16 md:py-24 bg-slate-900 text-white relative">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-400 mb-4">
              <AlertTriangle className="h-3.5 w-3.5" />
              The Hidden Complexity Trap
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              "It's Just a Small Change."
            </h2>
            <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              In software and enterprise projects, stakeholders frequently downplay scope. But even a single field or workflow adjustment can trigger a devastating blast radius across systems, integrations, business rules, data models, and testing pipelines.
            </p>
          </div>

          {/* Ripple Effect Grid */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-sm">
            {[
              'Business Rules & Edge Cases',
              'Database Schemas & Constraints',
              'API Contracts & Versions',
              'Downstream CRM/ERP Sync',
              'Security & Auth Tokens',
              'Regression Test Suites',
              'Customer Support SOPs',
              'Regulatory & Audit Mandates'
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-800/60 p-3.5 text-slate-200"
              >
                <div className="h-2 w-2 rounded-full bg-rose-500 shrink-0" />
                <span className="font-medium text-xs sm:text-sm">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-slate-400 text-sm">
            ScopeGuard AI helps engineering and product teams investigate ripple effects <strong className="text-white">before implementation begins</strong>.
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              How ScopeGuard AI Works
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              A structured 4-step framework designed specifically for analytical software delivery teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              {
                step: '01',
                title: 'Describe Current State',
                desc: 'Provide the existing functional requirement, architecture, or baseline behavior of the system.'
              },
              {
                step: '02',
                title: 'Describe Proposed Change',
                desc: 'Explain the desired modification, user story enhancement, or new feature capability.'
              },
              {
                step: '03',
                title: 'Analyze Impact',
                desc: 'AI systematically analyzes 14 dimensions: data, APIs, security, dependencies, risks, and questions.'
              },
              {
                step: '04',
                title: 'Make Better Decisions',
                desc: 'Review the Change Impact Assessment, export consulting-ready PDF, and execute the verified checklist.'
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="flex flex-col rounded-xl border border-slate-200 bg-slate-50/60 p-6 relative hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-indigo-600 font-mono">{item.step}</span>
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-bold">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. LIVE INTERACTIVE DEMO SECTION */}
      <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-800 mb-3">
              <Sparkles className="h-3.5 w-3.5" /> Interactive Demonstration
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              See ScopeGuard AI in Action
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              A classic real-world scenario: "Just adding a mobile phone number field to customer profile."
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {/* Demo Header */}
            <div className="border-b border-slate-200 bg-slate-900 px-6 py-4 text-white flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">Analysis Case Study</span>
                <h3 className="text-lg font-bold text-white">Customer Profile Management Enhancement</h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-rose-500/20 border border-rose-500/40 px-3 py-1 text-xs font-bold text-rose-300">
                  HIGH IMPACT — 72/100
                </div>
                <button
                  id="demo-open-full-btn"
                  onClick={onViewSample}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition cursor-pointer"
                >
                  <span>Open Full Assessment</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Demo Body Grid */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Input Context */}
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Existing Requirement / Current State
                  </span>
                  <p className="text-sm text-slate-800 font-mono leading-relaxed">
                    "Customers can update their registered email address through the profile page. The updated email address is validated and synchronized with the CRM system."
                  </p>
                </div>

                <div className="rounded-lg border border-indigo-200 bg-indigo-50/50 p-4">
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">
                    Proposed Change
                  </span>
                  <p className="text-sm text-indigo-950 font-medium leading-relaxed">
                    "Customers should also be able to update their registered mobile phone number through the profile management page."
                  </p>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <div className="font-semibold text-slate-700">Supporting Architecture:</div>
                  <div>Integrated with CRM, Identity Management, OTP SMS Gateway, CDP.</div>
                </div>
              </div>

              {/* Right Column: AI Impact Findings */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    AI Detected Ripple Effects:
                  </span>
                  <span className="text-xs font-semibold text-indigo-600">14 Categories Analyzed</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 rounded bg-white p-2 border border-slate-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    <span className="font-medium text-slate-800">Customer Database & Unique Index</span>
                  </div>
                  <div className="flex items-center gap-2 rounded bg-white p-2 border border-slate-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    <span className="font-medium text-slate-800">Downstream CRM Synchronization</span>
                  </div>
                  <div className="flex items-center gap-2 rounded bg-white p-2 border border-slate-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    <span className="font-medium text-slate-800">OTP SMS Verification & Rate Limits</span>
                  </div>
                  <div className="flex items-center gap-2 rounded bg-white p-2 border border-slate-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                    <span className="font-medium text-slate-800">Account Takeover & Step-Up Auth</span>
                  </div>
                  <div className="flex items-center gap-2 rounded bg-white p-2 border border-slate-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span className="font-medium text-slate-800">Customer Profile API Contracts</span>
                  </div>
                  <div className="flex items-center gap-2 rounded bg-white p-2 border border-slate-200">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span className="font-medium text-slate-800">Cross-Flow Regression Testing</span>
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Critical Risk Identified:</strong>
                    "Account takeover via unauthorized number reassignment without secondary email step-up verification."
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={onViewSample}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    View All 14 Impact Areas, Risks & Checklist &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 14 IMPACT AREAS COVERED */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              14 Exhaustive Impact Dimensions
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              ScopeGuard AI covers the complete software delivery lifecycle so nothing falls through the cracks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {impactCategories.map((cat, i) => {
              const IconComp = cat.icon;
              return (
                <div 
                  key={i} 
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex items-start gap-3"
                >
                  <div className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-700">
                    <IconComp className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">{cat.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{cat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA BANNER */}
      <section className="py-16 md:py-20 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Don't Let "Small Changes" Create Big Problems.
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Analyze your next change proposal in seconds. Uncover hidden risks, align stakeholders, and protect your delivery timeline.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="footer-cta-analyze"
              onClick={onStartAnalysis}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-7 py-3.5 text-base font-semibold text-white shadow-lg transition hover:bg-indigo-700 active:bg-indigo-800 cursor-pointer"
            >
              <span>Analyze Your Change</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              id="footer-cta-sample"
              onClick={onViewSample}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-base font-semibold text-slate-200 shadow-sm transition hover:bg-slate-800 hover:text-white cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Explore Demo Assessment</span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-slate-950 text-slate-500 text-xs border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldAlert className="h-4 w-4 text-indigo-400" />
            <span className="font-bold text-slate-300">ScopeGuard AI</span>
            <span>— Change Impact Analyzer</span>
          </div>
          <div>
            Built for Business Analysts, Product Managers, Solution Architects & QA Engineers.
          </div>
          <div>
            © {new Date().getFullYear()} ScopeGuard AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
