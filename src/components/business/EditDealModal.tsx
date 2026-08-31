import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InteractiveGeofenceMap } from './InteractiveGeofenceMap';
import { 
  X, 
  Save, 
  MapPin, 
  Clock, 
  Percent, 
  Layers, 
  AlertCircle,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { Deal } from '../../types';

interface EditDealModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditDealModal: React.FC<EditDealModalProps> = ({
  deal,
  isOpen,
  onClose
}) => {
  const { updateDeal, deleteDeal, formatCurrency } = useApp();

  if (!isOpen || !deal) return null;

  const [title, setTitle] = useState(deal.title);
  const [description, setDescription] = useState(deal.description);
  const [discountPercent, setDiscountPercent] = useState(deal.discountPercentage);
  const [radiusMeters, setRadiusMeters] = useState(deal.radiusMeters);
  const [status, setStatus] = useState<Deal['status']>(deal.status);
  const [maxRedemptions, setMaxRedemptions] = useState(deal.targetMaxRedemptions || 50);
  const [terms, setTerms] = useState(deal.termsAndConditions || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDeal(deal.id, {
      title,
      description,
      discountPercentage: discountPercent,
      radiusMeters,
      status,
      targetMaxRedemptions: maxRedemptions,
      termsAndConditions: terms,
      discountedPriceCents: deal.originalPriceCents ? Math.round(deal.originalPriceCents * (1 - discountPercent / 100)) : undefined
    });
    onClose();
  };

  const handleDelete = () => {
    deleteDeal(deal.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-bold text-slate-900">
                Edit Deal Settings
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                ID: {deal.id} • {deal.businessName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form id="edit-deal-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Headline / Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Deal Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Deal['status'])}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 font-bold focus:outline-none"
              >
                <option value="active">Active (Broadcasting)</option>
                <option value="paused">Paused (Hidden)</option>
                <option value="expired">Expired</option>
                <option value="scheduled">Scheduled</option>
                <option value="moderation_flagged">Moderation Flagged</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Offer Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex justify-between">
                <span>Discount Percentage</span>
                <span className="font-bold text-amber-700 font-mono">{discountPercent}%</span>
              </label>
              <input
                type="range"
                min="5"
                max="80"
                step="5"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Max Redemptions Cap</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={maxRedemptions}
                onChange={(e) => setMaxRedemptions(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Interactive Map */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">Adjust Geofence Perimeter</label>
            <InteractiveGeofenceMap
              centerLat={deal.location?.lat || -34.9285}
              centerLng={deal.location?.lng || 138.6007}
              radiusMeters={radiusMeters}
              onRadiusChange={setRadiusMeters}
              branchName={deal.businessName}
              address={deal.location?.address || 'Adelaide CBD'}
              heightClass="h-56"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 block">Terms &amp; Conditions</label>
            <textarea
              rows={2}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none resize-none"
            />
          </div>

          {showDeleteConfirm && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between text-xs animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-900">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Permanently delete this deal and remove it from all shopper feeds?</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 bg-white text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-rose-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}

        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-3.5 py-2 text-xs font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            Delete Deal
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="edit-deal-form"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
