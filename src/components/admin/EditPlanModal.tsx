import React, { useState } from 'react';
import { SubscriptionPlanConfig, SubscriptionTier } from '../../types';
import { X, Plus, Trash2, CheckCircle, Sparkles, Zap, Shield, Building2, MapPin } from 'lucide-react';

interface EditPlanModalProps {
  plan: SubscriptionPlanConfig;
  isOpen: boolean;
  onClose: () => void;
  onSave: (planId: string, updates: Partial<SubscriptionPlanConfig>) => void;
}

export const EditPlanModal: React.FC<EditPlanModalProps> = ({
  plan,
  isOpen,
  onClose,
  onSave
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(plan.name);
  const [badge, setBadge] = useState(plan.badge || '');
  const [description, setDescription] = useState(plan.description);
  const [priceMonthlyAud, setPriceMonthlyAud] = useState(plan.priceMonthlyAud);
  const [priceAnnualAud, setPriceAnnualAud] = useState(plan.priceAnnualAud);
  const [maxDealsPerMonth, setMaxDealsPerMonth] = useState<number | 'unlimited'>(plan.maxDealsPerMonth);
  const [maxBranches, setMaxBranches] = useState<number | 'unlimited'>(plan.maxBranches);
  const [maxRadiusMeters, setMaxRadiusMeters] = useState<number>(plan.maxRadiusMeters);
  const [priorityQueue, setPriorityQueue] = useState(plan.priorityQueue);
  const [aiSuggestionsEnabled, setAiSuggestionsEnabled] = useState(plan.aiSuggestionsEnabled);
  const [salesCommissionPercent, setSalesCommissionPercent] = useState(plan.salesCommissionPercent || 0);
  const [popular, setPopular] = useState(plan.popular || false);
  const [isActive, setIsActive] = useState(plan.isActive);
  
  const [features, setFeatures] = useState<string[]>([...plan.features]);
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
    onSave(plan.id, {
      name,
      badge: badge.trim() || undefined,
      description,
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
        id="admin-edit-plan-modal"
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Configure Subscription Plan</h2>
              <p className="text-xs text-slate-500 font-mono">Tier Key: {plan.tierKey} • ID: {plan.id}</p>
            </div>
          </div>
          <button
            id="close-edit-plan-modal-btn"
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
                Plan Display Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Badge Label (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Most Popular, Single Location"
                value={badge}
                onChange={e => setBadge(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Plan Value Proposition &amp; Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Pricing Row: Monthly & Annual */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sales Commission %
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={salesCommissionPercent}
                  onChange={e => setSalesCommissionPercent(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-600 font-bold">0% Policy</span>
              </div>
            </div>
          </div>

          {/* Limits & Capability Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Max Deals */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Max Flash Deals / Month
              </label>
              <select
                value={maxDealsPerMonth === 'unlimited' ? 'unlimited' : String(maxDealsPerMonth)}
                onChange={e => setMaxDealsPerMonth(e.target.value === 'unlimited' ? 'unlimited' : Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="5">5 Deals / mo</option>
                <option value="10">10 Deals / mo (Starter)</option>
                <option value="25">25 Deals / mo</option>
                <option value="unlimited">Unlimited Flash Drops</option>
              </select>
            </div>

            {/* Max Branches */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Max Locations Included
              </label>
              <select
                value={maxBranches === 'unlimited' ? 'unlimited' : String(maxBranches)}
                onChange={e => setMaxBranches(e.target.value === 'unlimited' ? 'unlimited' : Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="1">1 Branch (Single Shop)</option>
                <option value="3">3 Branches (Growth)</option>
                <option value="5">5 Branches</option>
                <option value="unlimited">Unlimited Branches (Enterprise)</option>
              </select>
            </div>

            {/* Max Radius */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Max Geofence Radius
              </label>
              <select
                value={maxRadiusMeters}
                onChange={e => setMaxRadiusMeters(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value={2000}>2,000 m (2 km)</option>
                <option value={5000}>5,000 m (5 km)</option>
                <option value={10000}>10,000 m (10 km Metro)</option>
                <option value={20000}>20,000 m (20 km Regional)</option>
              </select>
            </div>

          </div>

          {/* Feature Checklist Editor */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Included Plan Feature Bullets ({features.length})
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto p-1">
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

            {/* Add New Feature Input */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                placeholder="Add new plan feature bullet point..."
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
                Add Feature
              </button>
            </div>
          </div>

          {/* Toggles: AI suggestions, Priority Queue, Popular, Active */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={priorityQueue}
                onChange={e => setPriorityQueue(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Priority Push Queue</span>
                <span className="text-[10px] text-slate-500">Guarantees sub-60s push delivery SLA</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={aiSuggestionsEnabled}
                onChange={e => setAiSuggestionsEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">AI Performance Reports</span>
                <span className="text-[10px] text-slate-500">Access to Claude/Gemini post-campaign ROI analytics</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={popular}
                onChange={e => setPopular(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Mark as &quot;Most Popular&quot;</span>
                <span className="text-[10px] text-slate-500">Displays highlighted amber border in marketing pricing table</span>
              </div>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">Plan Active in Catalogue</span>
                <span className="text-[10px] text-slate-500">Available for new business owner self-serve signup</span>
              </div>
            </label>

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
              id="save-plan-config-btn"
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-xs transition-colors"
            >
              Save Plan Configuration
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
