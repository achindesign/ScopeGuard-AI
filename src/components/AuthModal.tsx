import React, { useState } from 'react';
import { ShieldAlert, X, LogIn, UserPlus, Sparkles, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Senior Business Analyst');
  const [organization, setOrganization] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      const payload = isSignUp 
        ? { email, full_name: fullName, role, organization }
        : { email };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Authentication failed');
      }

      const data = await res.json();
      onLoginSuccess(data.user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (demoEmail: string, demoName: string, demoRole: string) => {
    setEmail(demoEmail);
    setFullName(demoName);
    setRole(demoRole);
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, full_name: demoName, role: demoRole })
      });

      if (res.ok) {
        const data = await res.json();
        onLoginSuccess(data.user);
        onClose();
      } else {
        const err = await res.json();
        throw new Error(err.error || 'Authentication failed');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error logging in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
              <ShieldAlert className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isSignUp ? 'Create ScopeGuard Account' : 'Sign in to ScopeGuard AI'}
              </h3>
              <p className="text-xs text-slate-500">Enterprise Change Impact Workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-800">
            {errorMsg}
          </div>
        )}

        {/* Quick Demo Personas */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            1-Click Demo Accounts:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('alex.morgan@acme.com', 'Alex Morgan', 'Senior Business Analyst')}
              className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 text-xs transition cursor-pointer"
            >
              <div className="font-bold text-slate-900">Alex Morgan</div>
              <div className="text-[10px] text-slate-500">Lead Business Analyst</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('sarah.chen@fintech.com', 'Sarah Chen', 'Lead Solution Architect')}
              className="text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/20 text-xs transition cursor-pointer"
            >
              <div className="font-bold text-slate-900">Sarah Chen</div>
              <div className="text-[10px] text-slate-500">Solution Architect</div>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase">
            Or continue with email
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isSignUp && (
            <div>
              <label className="block font-bold text-slate-800 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Jordan Hayes"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-800 mb-1">Work Email Address</label>
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          {isSignUp && (
            <>
              <div>
                <label className="block font-bold text-slate-800 mb-1">Professional Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                >
                  <option value="Senior Business Analyst">Senior Business Analyst</option>
                  <option value="Product Manager / Owner">Product Manager / Owner</option>
                  <option value="Lead Solution Architect">Lead Solution Architect</option>
                  <option value="QA / Test Automation Lead">QA / Test Automation Lead</option>
                  <option value="Technical Project Manager">Technical Project Manager</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Organization / Department</label>
                <input
                  type="text"
                  placeholder="e.g. Digital Banking Solutions"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition cursor-pointer"
          >
            {isLoading ? 'Authenticating...' : (isSignUp ? 'Create Workspace Account' : 'Sign In')}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Need a new workspace?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Create Account
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
