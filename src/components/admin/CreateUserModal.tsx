import React, { useState } from 'react';
import { UserProfile, UserRole, DealCategory } from '../../types';
import { X, UserPlus, Shield, CheckCircle } from 'lucide-react';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (userData: Partial<UserProfile>) => void;
}

const AVAILABLE_ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'consumer', label: 'Consumer', description: 'Local consumer discovering geofenced deals & flash discounts' },
  { value: 'business_starter', label: 'Business Starter', description: 'Single location shop/café on Starter plan' },
  { value: 'business_growth', label: 'Business Growth', description: 'Multi-branch business owner on Growth tier' },
  { value: 'business_enterprise', label: 'Business Enterprise', description: 'Regional enterprise chain or franchise' },
  { value: 'admin', label: 'Platform Admin', description: 'Operations manager for deal approval and monitoring' },
  { value: 'super_admin', label: 'Super Admin', description: 'Full system privileges & platform governance' }
];

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+61 4');
  const [role, setRole] = useState<UserRole>('consumer');
  const [suburb, setSuburb] = useState('Adelaide CBD');
  const [preferredRadiusM, setPreferredRadiusM] = useState(3000);
  const [verified, setVerified] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    onCreate({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      verified,
      preferredRadiusM,
      currentLocation: {
        lat: -34.9285,
        lng: 138.6007,
        suburb: suburb.trim() || 'Adelaide CBD',
        city: 'Adelaide',
        country: 'Australia'
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="admin-create-user-modal"
        className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Provision New User Account</h2>
              <p className="text-xs text-slate-500 font-mono">Create authenticated member or operator</p>
            </div>
          </div>
          <button
            id="close-create-user-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-start">
          
          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Chen"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="user@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Phone & Suburb */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+61 412 345 678"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Location / Suburb
              </label>
              <input
                type="text"
                value={suburb}
                onChange={e => setSuburb(e.target.value)}
                placeholder="e.g. Adelaide CBD (Rundle Mall)"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Account Role &amp; Access Tier
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_ROLES.map(r => (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  className={`p-2.5 rounded-xl text-start border transition-all ${
                    role === r.value
                      ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/10'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold text-slate-900">{r.label}</span>
                    {role === r.value && (
                      <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">{r.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Radius */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Default Geofence Discovery Radius
              </label>
              <span className="text-xs font-mono font-bold text-amber-800">
                {(preferredRadiusM / 1000).toFixed(1)} km
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={500}
              value={preferredRadiusM}
              onChange={e => setPreferredRadiusM(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />
          </div>

          {/* Verification Status */}
          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="create-user-verified"
              checked={verified}
              onChange={e => setVerified(e.target.checked)}
              className="w-4 h-4 rounded-md border-slate-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
            />
            <label htmlFor="create-user-verified" className="text-xs text-slate-700 font-medium cursor-pointer">
              Mark email &amp; phone as verified immediately (Skip OTP verification step)
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-create-user-btn"
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
