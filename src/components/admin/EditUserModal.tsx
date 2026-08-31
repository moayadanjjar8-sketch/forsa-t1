import React, { useState } from 'react';
import { UserProfile, UserRole, DealCategory } from '../../types';
import { X, User, Mail, Phone, MapPin, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface EditUserModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, updates: Partial<UserProfile>) => void;
}

const AVAILABLE_ROLES: { value: UserRole; label: string; description: string }[] = [
  { value: 'consumer', label: 'Consumer', description: 'Standard shopper discovering local flash deals & walking radius alerts' },
  { value: 'business_starter', label: 'Business Starter', description: 'Single location business owner (up to 10 deals/mo, 2km radius)' },
  { value: 'business_growth', label: 'Business Growth', description: 'Growing business owner (unlimited deals, 3 branches, 5km radius, AI insights)' },
  { value: 'business_enterprise', label: 'Business Enterprise', description: 'Chains & franchises (unlimited branches, 10km radius, custom geofences)' },
  { value: 'admin', label: 'Platform Admin', description: 'Moderator with deal approval and compliance review access' },
  { value: 'super_admin', label: 'Super Admin', description: 'Full access to system health, FX rates, subscriptions & user permissions' }
];

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [role, setRole] = useState<UserRole>(user.role);
  const [verified, setVerified] = useState(user.verified);
  const [status, setStatus] = useState<'active' | 'suspended'>(user.status || 'active');
  const [suburb, setSuburb] = useState(user.currentLocation?.suburb || 'Adelaide CBD');
  const [preferredRadiusM, setPreferredRadiusM] = useState(user.preferredRadiusM);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(user.id, {
      fullName,
      email,
      phone,
      role,
      verified,
      status,
      preferredRadiusM,
      currentLocation: {
        ...(user.currentLocation || { lat: -34.9285, lng: 138.6007, city: 'Adelaide', country: 'Australia' }),
        suburb
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="admin-edit-user-modal"
        className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
              {user.fullName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Edit User Profile</h2>
              <p className="text-xs text-slate-500 font-mono">ID: {user.id}</p>
            </div>
          </div>
          <button
            id="close-edit-user-modal-btn"
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
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
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
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+61 400 000 000"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Location / Suburb
              </label>
              <input
                type="text"
                value={suburb}
                onChange={e => setSuburb(e.target.value)}
                placeholder="e.g. Adelaide CBD"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* User Role Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Assigned Role &amp; Permissions
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

          {/* Preferred Radius Slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">
                Preferred Geofence Discovery Radius
              </label>
              <span className="text-xs font-mono font-bold text-amber-800">
                {(preferredRadiusM / 1000).toFixed(1)} km ({preferredRadiusM.toLocaleString()} m)
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
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>0.5 km (Hyperlocal)</span>
              <span>5.0 km</span>
              <span>10.0 km (Metro)</span>
            </div>
          </div>

          {/* Account Status & Verification Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Account Operational Status
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatus('active')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    status === 'active'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-2 ring-emerald-500/10'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setStatus('suspended')}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    status === 'suspended'
                      ? 'bg-rose-50 text-rose-800 border-rose-300 ring-2 ring-rose-500/10'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  Suspended
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Identity &amp; Phone Verification
              </label>
              <button
                type="button"
                onClick={() => setVerified(!verified)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all ${
                  verified
                    ? 'bg-sky-50 text-sky-800 border-sky-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {verified ? <Shield className="w-3.5 h-3.5 text-sky-600" /> : <AlertCircle className="w-3.5 h-3.5 text-slate-400" />}
                <span>{verified ? 'Verified Identity' : 'Unverified (Pending)'}</span>
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-user-profile-btn"
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-xs transition-colors"
            >
              Save User Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
