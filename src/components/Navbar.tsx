import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  Sparkles, 
  User, 
  LogOut, 
  LogIn, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'dashboard' | 'new-analysis' | 'results' | 'history';
  onNavigate: (view: 'landing' | 'dashboard' | 'new-analysis' | 'results' | 'history') => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
  onLogout: () => void;
  onLoadSample: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onOpenAuth,
  onOpenProfile,
  onLogout,
  onLoadSample
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button 
            id="nav-logo-btn"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-90 cursor-pointer"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm ring-1 ring-slate-800">
              <ShieldAlert className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                ScopeGuard <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-xs font-semibold text-indigo-800">AI</span>
              </span>
              <span className="hidden sm:block text-[11px] font-medium text-slate-500 -mt-0.5">
                Change Impact Analyzer
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              id="nav-link-dashboard"
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="h-4 w-4 text-slate-500" />
              Dashboard
            </button>
            <button
              id="nav-link-new"
              onClick={() => onNavigate('new-analysis')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'new-analysis'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="h-4 w-4 text-indigo-600" />
              New Analysis
            </button>
            <button
              id="nav-link-history"
              onClick={() => onNavigate('history')}
              className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'history'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <History className="h-4 w-4 text-slate-500" />
              History
            </button>
          </nav>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* Sample Demo Button */}
          <button
            id="nav-sample-demo-btn"
            onClick={onLoadSample}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            title="Explore an instant pre-calculated customer profile change assessment"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Try Sample Analysis
          </button>

          {/* Primary CTA */}
          <button
            id="nav-cta-analyze"
            onClick={() => onNavigate('new-analysis')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700 active:bg-indigo-800 cursor-pointer"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden xs:inline">Analyze Change</span>
            <span className="xs:hidden">Analyze</span>
          </button>

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
              <button
                id="nav-user-profile-btn"
                onClick={onOpenProfile}
                className="flex items-center gap-2 rounded-full p-1 text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title={`${currentUser.full_name} (${currentUser.role || 'BA'})`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  {currentUser.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden lg:block text-left text-xs">
                  <div className="font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                    {currentUser.full_name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate max-w-[120px]">
                    {currentUser.role || 'Business Analyst'}
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <button
              id="nav-login-btn"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <LogIn className="h-4 w-4 text-slate-500" />
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden border-t border-slate-200 bg-slate-50/70 px-4 py-2 justify-around text-xs">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`flex items-center gap-1 py-1 font-medium ${currentView === 'dashboard' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
        >
          <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
        </button>
        <button
          onClick={() => onNavigate('new-analysis')}
          className={`flex items-center gap-1 py-1 font-medium ${currentView === 'new-analysis' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
        >
          <PlusCircle className="h-3.5 w-3.5" /> New Analysis
        </button>
        <button
          onClick={() => onNavigate('history')}
          className={`flex items-center gap-1 py-1 font-medium ${currentView === 'history' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}
        >
          <History className="h-3.5 w-3.5" /> History
        </button>
        <button
          onClick={onLoadSample}
          className="flex items-center gap-1 py-1 font-medium text-amber-600"
        >
          <Sparkles className="h-3.5 w-3.5" /> Sample
        </button>
      </div>
    </header>
  );
};
