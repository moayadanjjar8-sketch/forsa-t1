import React, { useState } from 'react';
import { SubscriptionPlanConfig, SubscriptionTier } from '../../types';
import { X, Plus, Trash2, CheckCircle, Sparkles, Zap, Shield } from 'lucide-react';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (plan: Omit<SubscriptionPlanConfig, 'id'>) => void;
}

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [tierKey, setTierKey] = useState<string>('growth');
  const [badge, setBadge] = useState('');
  const [description, setDescription] = useState('');
  const [priceMonthlyAud, setPriceMonthlyAud] = useState<number>(199);
  const [priceAnnualAud, setPriceAnnualAud] = useState<number>(1900);
  const [maxDealsPerMonth, setMaxDealsPerMonth] = useState<number | 'unlimited'>('unlimited');
  const [maxBranches, setMaxBranches] = useState<number | 'unlimited'>(5);
  const [maxRadiusMeters, setMaxRadiusMeters] = useState<number>(5000);
  const [priorityQueue, setPriorityQueue] = useState(true);
  const [aiSuggestionsEnabled, setAiSuggestionsEnabled] = useState(true);
  const [salesCommissionPercent, setSalesCommissionPercent] = useState(0);
  const [popular, setPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const [features, setFeatures] = useState<string[]>([
    'Unlimited flash deal drops during quiet hours',
    'Up to 5 branch location geofences included',
    'Sub-60s priority push dispatch queue',
    'AI Deal Performance & ROI analytics engine',
    '0% sales commission on all customer orders'
  ]);
  const [newFeatureText, setNewFeatureText] = useState('');

  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setFeatures(prev => [...prev, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreate({
      name: name.trim(),
      tierKey,
      badge: badge.trim() || undefined,
      description: description.trim() || `${name} tier for growing local businesses.`,
      priceMonthlyAud: Number(priceMonthlyAud),
      priceAnnualAud: Number(priceAnnualAud),
      maxDealsPerMonth,
      maxBranches,
      maxRadiusMeters: Number(maxRadiusMeters),
      priorityQueue,
      aiSuggestionsEnabled,
      salesCommissionPercent: Number(salesCommissionPercent),
      popular,
      isActive,
      features
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="admin-create-plan-modal"
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Create New Subscription Plan Tier</h2>
              <p className="text-xs text-slate-500 font-mono">Define custom commercial pricing &amp; geofence limits</p>
            </div>
          </div>
          <button
            id="close-create-plan-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-start">
          
          {/* Plan Name & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Plan Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Franchise Pro Tier"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Marketing Badge (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Regional Chains, VIP"
                value={badge}
                onChange={e => setBadge(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of target business persona and primary benefits..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Pricing Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Monthly Price (AUD $) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={priceMonthlyAud}
                onChange={e => setPriceMonthlyAud(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Annual Price (AUD $) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={priceAnnualAud}
                onChange={e => setPriceAnnualAud(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Deals / Month Limit
              </label>
              <select
                value={maxDealsPerMonth === 'unlimited' ? 'unlimited' : String(maxDealsPerMonth)}
                onChange={e => setMaxDealsPerMonth(e.target.value === 'unlimited' ? 'unlimited' : Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="10">10 Deals / mo</option>
                <option value="25">25 Deals / mo</option>
                <option value="unlimited">Unlimited Deals</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Max Locations
              </label>
              <select
                value={maxBranches === 'unlimited' ? 'unlimited' : String(maxBranches)}
                onChange={e => setMaxBranches(e.target.value === 'unlimited' ? 'unlimited' : Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="1">1 Location</option>
                <option value="3">3 Locations</option>
                <option value="5">5 Locations</option>
                <option value="unlimited">Unlimited Locations</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Geofence Radius
              </label>
              <select
                value={maxRadiusMeters}
                onChange={e => setMaxRadiusMeters(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value={2000}>2,000 m (2 km)</option>
                <option value={5000}>5,000 m (5 km)</option>
                <option value={10000}>10,000 m (10 km)</option>
              </select>
            </div>
          </div>

          {/* Features Checklist */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Included Plan Features ({features.length})
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto p-1">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="flex-1 text-slate-800">{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Feature */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Type feature bullet point..."
                value={newFeatureText}
                onChange={e => setNewFeatureText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors shrink-0"
              >
                Add
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-create-plan-btn"
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Plan Tier</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
