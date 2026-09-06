import React, { useState, useEffect } from 'react';
import { User, X, Check, Building2, Briefcase, Mail, Shield, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  currentUser: UserProfile | null;
  onClose: () => void;
  onUpdateProfile: (updated: UserProfile) => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onUpdateProfile,
  onLogout
}) => {
  const [fullName, setFullName] = useState(currentUser?.full_name || '');
  const [role, setRole] = useState(currentUser?.role || 'Senior Business Analyst');
  const [organization, setOrganization] = useState(currentUser?.organization || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Synchronize state whenever the modal opens or the currentUser changes
  useEffect(() => {
    if (currentUser && isOpen) {
      setFullName(currentUser.full_name || '');
      setRole(currentUser.role || 'Senior Business Analyst');
      setOrganization(currentUser.organization || '');
      setIsSaved(false);
    }
  }, [currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUser.id
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
          role,
          organization: organization.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        onUpdateProfile(data.user);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const avatarInitial = (currentUser.full_name || currentUser.email || 'U').trim().charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white shadow-sm">
              {avatarInitial}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">User Profile</h3>
              <p className="text-xs text-slate-500 font-medium">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 cursor-pointer transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isSaved && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Profile details updated successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Professional Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
            >
              <option value="Senior Business Analyst">Senior Business Analyst</option>
              <option value="Lead Solution Architect">Lead Solution Architect</option>
              <option value="Product Manager / Product Owner">Product Manager / Product Owner</option>
              <option value="QA & Test Automation Lead">QA & Test Automation Lead</option>
              <option value="Technical Project Manager">Technical Project Manager</option>
              <option value="Technology Consultant">Technology Consultant</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Organization / Enterprise</label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="e.g. Acme Enterprise"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition cursor-pointer"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
