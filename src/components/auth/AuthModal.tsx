import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Fingerprint, 
  Download, 
  Trash2, 
  CheckCircle2, 
  Mail, 
  Lock, 
  UserCheck, 
  ArrowRight,
  Sparkles,
  Smartphone,
  Building2,
  Shield
} from 'lucide-react';
import { UserRole } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    currentUser, 
    setCurrentUser, 
    switchRolePersona, 
    exportUserData, 
    deleteAccount, 
    allUsers,
    setViewMode
  } = useApp();

  const [activeTab, setActiveTab] = useState<'persona' | 'email_otp' | 'social_oauth' | 'gdpr_privacy'>('persona');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  if (!isOpen) return null;

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(0, 1);
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-digit-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered.length === 6 || entered === '123456') {
      setAuthSuccessMsg(`Authenticated successfully via Secure Email OTP! Welcome back, ${emailInput || 'User'}.`);
      setTimeout(() => {
        setAuthSuccessMsg(null);
        setOtpStep(false);
        onClose();
      }, 1200);
    }
  };

  const handleExportData = () => {
    const jsonStr = exportUserData(currentUser.id);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forsa-t-user-data-${currentUser.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteUserAccount = () => {
    deleteAccount(currentUser.id);
    setDeleteConfirmOpen(false);
    switchRolePersona('consumer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-xl relative text-slate-900 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <BrandLogo variant="radar" size="sm" />
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900">
                FORSA-T Authentication &amp; Account Center
              </h3>
              <p className="text-xs text-slate-500">
                PostgreSQL 16 Multi-Role RBAC &amp; App Store Compliance
              </p>
            </div>
          </div>
          <button 
            id="btn-close-auth-modal"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl my-4 border border-slate-200 text-xs">
          <button
            id="tab-auth-persona"
            onClick={() => setActiveTab('persona')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'persona' ? 'bg-slate-900 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Switch Persona
          </button>
          <button
            id="tab-auth-otp"
            onClick={() => setActiveTab('email_otp')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'email_otp' ? 'bg-slate-900 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Email + OTP
          </button>
          <button
            id="tab-auth-oauth"
            onClick={() => setActiveTab('social_oauth')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'social_oauth' ? 'bg-slate-900 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Google / Apple OAuth
          </button>
          <button
            id="tab-auth-gdpr"
            onClick={() => setActiveTab('gdpr_privacy')}
            className={`flex-1 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'gdpr_privacy' ? 'bg-slate-900 text-white shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            GDPR &amp; Privacy
          </button>
        </div>

        {authSuccessMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            {authSuccessMsg}
          </div>
        )}

        {/* Tab 1: Instant Persona Switcher */}
        {activeTab === 'persona' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 mb-2">
              Select any defined platform persona to test role-based data scoping and feature tiering:
            </p>

            {/* Consumer Persona */}
            <div 
              onClick={() => { switchRolePersona('consumer'); onClose(); }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                currentUser.role === 'consumer' 
                  ? 'bg-amber-50/80 border-amber-300 shadow-xs' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                  alt="Jordan" 
                  className="w-10 h-10 rounded-full object-cover border border-amber-300"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Jordan Taylor</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-50 text-sky-800 border border-sky-200 font-semibold">
                      Consumer
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Adelaide Resident • 3km Deal Radar • Follows 2 Cafés</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                  Select <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Business Growth Persona */}
            <div 
              onClick={() => { switchRolePersona('business_growth'); onClose(); }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                currentUser.role === 'business_growth' 
                  ? 'bg-amber-50/80 border-amber-300 shadow-xs' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80" 
                  alt="Amira" 
                  className="w-10 h-10 rounded-full object-cover border border-amber-300"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Amira Mansour</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-900 border border-amber-200 font-semibold">
                      Business (Growth Tier)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Amira's Café &amp; Roastery • ABN Verified • AI Insights</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                  Select <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Super Admin Persona */}
            <div 
              onClick={() => { switchRolePersona('super_admin'); onClose(); }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                currentUser.role === 'super_admin' 
                  ? 'bg-amber-50/80 border-amber-300 shadow-xs' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" 
                  alt="Salah" 
                  className="w-10 h-10 rounded-full object-cover border border-purple-300"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Salah Itekedk</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-50 text-purple-800 border border-purple-200 font-semibold">
                      Super Admin
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Platform Owner • Full PostGIS &amp; Stripe Management • Audit Log Access</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-900 flex items-center gap-1">
                  Select <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Email + OTP Auth */}
        {activeTab === 'email_otp' && (
          <div className="space-y-4">
            {!otpStep ? (
              <form 
                onSubmit={(e) => { e.preventDefault(); setOtpStep(true); }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address (AWS SES Transactional Dispatch)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      id="input-auth-email"
                      type="email"
                      required
                      placeholder="merchant@adelaide-business.com.au"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Password (Bcrypt / Argon2 Hashed)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      id="input-auth-password"
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>

                <button
                  id="btn-submit-send-otp"
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all shadow-xs mt-2 flex items-center justify-center gap-2"
                >
                  Send 6-Digit Email OTP <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center">
                  <div className="inline-flex p-3 bg-sky-50 text-sky-800 border border-sky-200 rounded-full mb-2">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Enter 6-Digit Verification Code</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    We sent a secure single-use token to <span className="text-slate-900 font-semibold">{emailInput || 'your email'}</span>
                  </p>
                </div>

                <div className="flex justify-center gap-2 my-4">
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-digit-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-11 h-12 text-center text-lg font-mono font-bold bg-white border border-slate-300 rounded-xl focus:border-slate-900 focus:outline-none text-slate-900"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <button 
                    type="button" 
                    onClick={() => setOtpStep(false)}
                    className="hover:text-slate-900"
                  >
                    ← Back to Email
                  </button>
                  <button 
                    type="button"
                    onClick={() => setOtpCode(['1','2','3','4','5','6'])}
                    className="text-amber-800 font-semibold hover:underline"
                  >
                    Auto-fill demo code (123456)
                  </button>
                </div>

                <button
                  id="btn-verify-otp"
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-all shadow-xs"
                >
                  Confirm &amp; Authenticate Session
                </button>
              </form>
            )}
          </div>
        )}

        {/* Tab 3: Google & Apple OAuth */}
        {activeTab === 'social_oauth' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 mb-3">
              Compliant OAuth2 single-tap sign in mandated by BOD 4 and Apple App Store Guideline 4.8:
            </p>

            <button
              id="btn-oauth-google"
              onClick={() => {
                setAuthSuccessMsg('Google OAuth2 session initialized. Profile token verified.');
                setTimeout(() => { setAuthSuccessMsg(null); onClose(); }, 1200);
              }}
              className="w-full py-3 bg-white text-slate-900 hover:bg-slate-50 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-3 border border-slate-300 shadow-xs"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Continue with Google
            </button>

            <button
              id="btn-oauth-apple"
              onClick={() => {
                setAuthSuccessMsg('Apple Sign-In authorization code exchanged. Secure Keychain token stored.');
                setTimeout(() => { setAuthSuccessMsg(null); onClose(); }, 1200);
              }}
              className="w-full py-3 bg-black hover:bg-slate-900 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-3 border border-slate-800 shadow-xs"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.59.69-1.12 1.83-.98 2.94 1.08.08 2.13-.53 2.79-1.28z"/>
              </svg>
              Sign in with Apple (Face ID Ready)
            </button>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Fingerprint className="w-4 h-4 text-sky-700" />
                Biometric Session Keychain: Active
              </span>
              <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">
                JWT Refresh Rotation
              </span>
            </div>
          </div>
        )}

        {/* Tab 4: GDPR & Account Deletion */}
        {activeTab === 'gdpr_privacy' && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Current Authenticated ID:</span>
                <span className="font-mono text-amber-900 font-semibold">{currentUser.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Assigned Role:</span>
                <span className="uppercase text-sky-800 font-semibold">{currentUser.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Data Location:</span>
                <span className="text-slate-500">AWS ap-southeast-2 (Sydney, AU)</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900">Self-Service Privacy Rights (BOD Section 14)</h4>
              
              <button
                id="btn-export-data-json"
                onClick={handleExportData}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-xl transition-all flex items-center justify-center gap-2 border border-slate-200"
              >
                <Download className="w-4 h-4 text-amber-700" />
                Export My Data (JSON Archive)
              </button>

              {!deleteConfirmOpen ? (
                <button
                  id="btn-open-delete-account"
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium rounded-xl transition-all flex items-center justify-center gap-2 border border-rose-200"
                >
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  Initiate In-App Account Deletion (App Store 5.1.1v)
                </button>
              ) : (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                  <p className="text-rose-900 font-medium leading-relaxed">
                    Confirm deletion of account <span className="font-bold">{currentUser.email}</span>? 
                    This will soft-delete your profile, unbind payment methods, and anonymize historical logs per retention policy.
                  </p>
                  <div className="flex gap-2">
                    <button
                      id="btn-confirm-delete-user"
                      onClick={handleDeleteUserAccount}
                      className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg transition-colors"
                    >
                      Yes, Permanently Delete
                    </button>
                    <button
                      id="btn-cancel-delete-user"
                      onClick={() => setDeleteConfirmOpen(false)}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Footer with Link to Standalone Registration */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Don't have an account?</span>
          <button
            id="btn-modal-open-register"
            onClick={() => {
              onClose();
              setViewMode('register');
            }}
            className="font-bold text-slate-900 hover:text-amber-800 flex items-center gap-1 transition-colors"
          >
            Create New Account <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
