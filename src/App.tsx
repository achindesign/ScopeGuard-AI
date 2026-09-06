import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { NewAnalysisWizard } from './components/NewAnalysisWizard';
import { AnalysisLoadingScreen } from './components/AnalysisLoadingScreen';
import { AnalysisResultsView } from './components/AnalysisResultsView';
import { HistoryView } from './components/HistoryView';
import { WhatDidWeMissModal } from './components/WhatDidWeMissModal';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { ChangeAnalysis, UserProfile, AnalysisInputPayload } from './types';
import { 
  SAMPLE_ANALYSIS_CUSTOMER_PROFILE, 
  SAMPLE_ANALYSIS_PAYMENT_GATEWAY, 
  SAMPLE_ANALYSIS_SSO, 
  SAMPLE_ANALYSIS_TELEHEALTH 
} from './data/samples';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'new-analysis' | 'results' | 'history'>('landing');
  const [analyses, setAnalyses] = useState<ChangeAnalysis[]>([
    SAMPLE_ANALYSIS_CUSTOMER_PROFILE,
    SAMPLE_ANALYSIS_PAYMENT_GATEWAY,
    SAMPLE_ANALYSIS_SSO,
    SAMPLE_ANALYSIS_TELEHEALTH
  ]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<ChangeAnalysis | null>(SAMPLE_ANALYSIS_CUSTOMER_PROFILE);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('scopeguard_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      id: 'usr-guest-001',
      email: 'alex.morgan@acme.com',
      full_name: 'Alex Morgan',
      role: 'Senior Business Analyst',
      organization: 'Acme Enterprises',
      created_at: new Date().toISOString()
    };
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWhatDidWeMissOpen, setIsWhatDidWeMissOpen] = useState(false);
  const [wizardPrefill, setWizardPrefill] = useState<Partial<AnalysisInputPayload> | undefined>(undefined);

  const handleUpdateCurrentUser = (user: UserProfile | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('scopeguard_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('scopeguard_current_user');
    }
  };

  // Fetch initial data from server
  useEffect(() => {
    async function initData() {
      try {
        const savedUserStr = localStorage.getItem('scopeguard_current_user');
        const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;

        const userRes = await fetch('/api/auth/me', {
          headers: savedUser?.id ? { 'x-user-id': savedUser.id } : {}
        });
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.user) {
            handleUpdateCurrentUser(userData.user);
          }
        }

        const analysesRes = await fetch('/api/analyses', {
          headers: savedUser?.id ? { 'x-user-id': savedUser.id } : {}
        });
        if (analysesRes.ok) {
          const analysesData = await analysesRes.json();
          if (analysesData.analyses && analysesData.analyses.length > 0) {
            setAnalyses(analysesData.analyses);
          }
        }
      } catch (err) {
        console.warn("Using local in-memory fallback state:", err);
      }
    }
    initData();
  }, []);

  // Run AI Impact Analysis
  const handleRunAnalysis = async (payload: AnalysisInputPayload) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser?.id || 'usr-guest-001'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to analyze change');
      }

      const data = await res.json();
      const newAnalysis = data.analysis;

      setAnalyses(prev => [newAnalysis, ...prev]);
      setSelectedAnalysis(newAnalysis);
      setCurrentView('results');
    } catch (err: any) {
      console.error("Analysis execution error:", err);
      alert("Error generating analysis: " + (err.message || 'Server error. Please try again.'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle Checklist Task Item
  const handleToggleChecklistItem = async (taskId: string, completed: boolean, phase: string) => {
    if (!selectedAnalysis) return;

    // Optimistic UI update
    const updatedSelected = { ...selectedAnalysis };
    const phaseKey = phase as keyof typeof updatedSelected.checklist;
    if (updatedSelected.checklist && updatedSelected.checklist[phaseKey]) {
      updatedSelected.checklist[phaseKey] = updatedSelected.checklist[phaseKey].map(t => 
        t.id === taskId ? { ...t, completed } : t
      );
    }
    setSelectedAnalysis(updatedSelected);

    setAnalyses(prev => prev.map(a => a.id === selectedAnalysis.id ? updatedSelected : a));

    // Call server to persist
    try {
      await fetch(`/api/analyses/${selectedAnalysis.id}/checklist`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, completed, phase })
      });
    } catch (err) {
      console.error("Failed to persist checklist state:", err);
    }
  };

  // Delete an analysis
  const handleDeleteAnalysis = async (id: string) => {
    if (!confirm('Are you sure you want to delete this change impact assessment?')) return;

    setAnalyses(prev => prev.filter(a => a.id !== id));
    if (selectedAnalysis?.id === id) {
      setSelectedAnalysis(null);
      setCurrentView('dashboard');
    }

    try {
      await fetch(`/api/analyses/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error("Error deleting analysis:", err);
    }
  };

  // Load sample analysis (Demo Mode)
  const handleLoadSample = () => {
    setSelectedAnalysis(SAMPLE_ANALYSIS_CUSTOMER_PROFILE);
    setCurrentView('results');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogout={() => {
          handleUpdateCurrentUser(null);
          setCurrentView('landing');
        }}
        onLoadSample={handleLoadSample}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {isAnalyzing ? (
          <AnalysisLoadingScreen />
        ) : (
          <>
            {currentView === 'landing' && (
              <LandingPage
                onStartAnalysis={() => {
                  setWizardPrefill(undefined);
                  setCurrentView('new-analysis');
                }}
                onViewSample={handleLoadSample}
              />
            )}

            {currentView === 'dashboard' && (
              <Dashboard
                analyses={analyses}
                currentUser={currentUser}
                onNewAnalysis={(prefill) => {
                  setWizardPrefill(prefill);
                  setCurrentView('new-analysis');
                }}
                onSelectAnalysis={(a) => {
                  setSelectedAnalysis(a);
                  setCurrentView('results');
                }}
                onDeleteAnalysis={handleDeleteAnalysis}
              />
            )}

            {currentView === 'new-analysis' && (
              <NewAnalysisWizard
                initialPayload={wizardPrefill}
                onRunAnalysis={handleRunAnalysis}
                onCancel={() => setCurrentView(analyses.length > 0 ? 'dashboard' : 'landing')}
              />
            )}

            {currentView === 'results' && selectedAnalysis && (
              <AnalysisResultsView
                analysis={selectedAnalysis}
                onBackToDashboard={() => setCurrentView('dashboard')}
                onReanalyze={(a) => {
                  setWizardPrefill({
                    project_name: a.project_name,
                    current_state: a.current_state,
                    proposed_change: a.proposed_change,
                    business_context: a.business_context,
                    existing_dependencies: a.existing_dependencies
                  });
                  setCurrentView('new-analysis');
                }}
                onOpenWhatDidWeMiss={() => setIsWhatDidWeMissOpen(true)}
                onToggleChecklistItem={handleToggleChecklistItem}
              />
            )}

            {currentView === 'history' && (
              <HistoryView
                analyses={analyses}
                onSelectAnalysis={(a) => {
                  setSelectedAnalysis(a);
                  setCurrentView('results');
                }}
                onDeleteAnalysis={handleDeleteAnalysis}
                onNewAnalysis={() => {
                  setWizardPrefill(undefined);
                  setCurrentView('new-analysis');
                }}
                onBackToDashboard={() => setCurrentView('dashboard')}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <WhatDidWeMissModal
        isOpen={isWhatDidWeMissOpen}
        analysis={selectedAnalysis}
        onClose={() => setIsWhatDidWeMissOpen(false)}
        onSuccess={(updated) => {
          setSelectedAnalysis(updated);
          setAnalyses(prev => prev.map(a => a.id === updated.id ? updated : a));
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          handleUpdateCurrentUser(user);
          setCurrentView('dashboard');
        }}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        currentUser={currentUser}
        onClose={() => setIsProfileModalOpen(false)}
        onUpdateProfile={(user) => handleUpdateCurrentUser(user)}
        onLogout={() => {
          handleUpdateCurrentUser(null);
          setCurrentView('landing');
        }}
      />
    </div>
  );
}
