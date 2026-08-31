import React, { useState } from 'react';
import { 
  ShieldCheck, 
  X, 
  Building2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  HelpCircle, 
  Lock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { BusinessProfile, AbnVerificationStatus } from '../../types';
import { useApp } from '../../context/AppContext';

interface OverrideAbnModalProps {
  business: BusinessProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const OverrideAbnModal: React.FC<OverrideAbnModalProps> = ({
  business,
  isOpen,
  onClose
}) => {
  const { updateAbnOverride, currentUser } = useApp();

  const [abnNumber, setAbnNumber] = useState(business.abn || '');
  const [legalTradingName, setLegalTradingName] = useState(business.legalTradingName || business.businessName);
  const [status, setStatus] = useState<AbnVerificationStatus>(business.abnStatus || 'manual_override');
  const [justification, setJustification] = useState('');
  const [documentType, setDocumentType] = useState('asic_extract');
  const [markAsApproved, setMarkAsApproved] = useState(business.approvalStatus !== 'approved');
  const [isVerifyingAbr, setIsVerifyingAbr] = useState(false);
  const [abrLookupResult, setAbrLookupResult] = useState<{
    success: boolean;
    entityName: string;
    gstRegistered: boolean;
    entityType: string;
    status: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Format ABN with spaces (e.g. 53 004 085 616)
  const formatAbnInput = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 2) return raw;
    if (raw.length <= 5) return `${raw.slice(0, 2)} ${raw.slice(2)}`;
    if (raw.length <= 8) return `${raw.slice(0, 2)} ${raw.slice(2, 5)} ${raw.slice(5)}`;
    return `${raw.slice(0, 2)} ${raw.slice(2, 5)} ${raw.slice(5, 8)} ${raw.slice(8)}`;
  };

  const handleAbnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAbnInput(e.target.value);
    setAbnNumber(formatted);
    setAbrLookupResult(null);
  };

  const handleSimulateAbrLookup = () => {
    const cleanDigits = abnNumber.replace(/\s+/g, '');
    if (cleanDigits.length < 11) {
      alert('Please enter a valid 11-digit Australian Business Number (ABN).');
      return;
    }

    setIsVerifyingAbr(true);
    setTimeout(() => {
      setIsVerifyingAbr(false);
      setAbrLookupResult({
        success: true,
        entityName: `${business.businessName.toUpperCase()} PTY LTD`,
        gstRegistered: true,
        entityType: 'Australian Private Company',
        status: 'Active (ABR Registered)'
      });
      setLegalTradingName(`${business.businessName} Pty Ltd`);
      setStatus('verified_abr');
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!justification.trim() && status === 'manual_override') {
      alert('Please enter a justification or compliance review note for this manual override.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      updateAbnOverride({
        businessId: business.id,
        abn: abnNumber || business.abn,
        abnStatus: status,
        legalTradingName,
        justification: justification || `ABR verification status updated to ${status}. Document basis: ${documentType}`,
        markAsApproved
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const quickJustifications = [
    'ASIC Certificate of Registration and Director ID verified.',
    'Commercial lease agreement and utility bill verified.',
    'City of Adelaide food business permit verified.',
    'Manual review approved by senior compliance officer.'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Admin ABN Override &amp; Verification
              </h3>
              <p className="text-xs text-slate-400">
                Compliance Officer Manual Verification &amp; Registry Match
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Business Preview Bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={business.logoUrl} 
              alt={business.businessName} 
              className="w-9 h-9 rounded-lg object-cover border border-slate-200 bg-white"
            />
            <div>
              <h4 className="font-bold text-xs text-slate-900">{business.businessName}</h4>
              <span className="text-[11px] text-slate-500 capitalize">{business.category.replace('_', ' ')}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">Current Status</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {business.abnStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* ABN Input & ABR Lookup */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
              <span>Australian Business Number (ABN) *</span>
              <span className="text-[11px] text-slate-500 font-normal font-mono">11 Digits</span>
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={abnNumber}
                  onChange={handleAbnChange}
                  placeholder="53 004 085 616"
                  maxLength={14}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold text-sm tracking-wider focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleSimulateAbrLookup}
                disabled={isVerifyingAbr}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200 flex items-center gap-1.5 shrink-0 transition-colors"
              >
                {isVerifyingAbr ? (
                  <span className="animate-spin text-xs">⏳</span>
                ) : (
                  <Search className="w-3.5 h-3.5 text-slate-600" />
                )}
                <span>ABR Lookup</span>
              </button>
            </div>

            {/* ABR Result Box */}
            {abrLookupResult && (
              <div className="mt-2.5 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-950 space-y-1 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Australian Business Register (ABR) Match Verified</span>
                </div>
                <p className="font-mono text-xs font-bold text-emerald-900">{abrLookupResult.entityName}</p>
                <div className="flex justify-between text-emerald-800/90 text-[10px]">
                  <span>GST: {abrLookupResult.gstRegistered ? 'Active & Registered' : 'Not Registered'}</span>
                  <span>{abrLookupResult.entityType}</span>
                </div>
              </div>
            )}
          </div>

          {/* Legal Trading Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Registered Legal Entity / Trading Name
            </label>
            <input
              type="text"
              value={legalTradingName}
              onChange={(e) => setLegalTradingName(e.target.value)}
              placeholder="e.g. Amira Artisan Roasters Pty Ltd"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Verification Status Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Verification Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AbnVerificationStatus)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="verified_abr">✅ VERIFIED_ABR (Automated Match)</option>
                <option value="manual_override">🛡️ MANUAL_OVERRIDE (Admin Approved)</option>
                <option value="pending">⏳ PENDING (Awaiting Review)</option>
                <option value="flagged">⚠️ FLAGGED (Suspicious / Inactive)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Verification Document Basis
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              >
                <option value="asic_extract">ASIC Company Extract / Certificate</option>
                <option value="commercial_lease">Commercial Lease / Tenancy</option>
                <option value="council_permit">City Council Food / Trading Permit</option>
                <option value="director_id">Director 100-Point ID Check</option>
                <option value="executive_clearance">Executive Officer Clearance</option>
              </select>
            </div>
          </div>

          {/* Override Justification / Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Compliance Justification / Audit Notes *
            </label>
            <textarea
              rows={2}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="Provide reason for this manual override, legal verification check, or status alteration..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />

            {/* Quick Justification Chips */}
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {quickJustifications.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setJustification(q)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-600 transition-colors"
                >
                  + {q}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-Approve Storefront Checkbox */}
          <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl flex items-start gap-2.5">
            <input
              type="checkbox"
              id="markAsApproved"
              checked={markAsApproved}
              onChange={(e) => setMarkAsApproved(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
            />
            <label htmlFor="markAsApproved" className="text-xs text-slate-800 cursor-pointer">
              <span className="font-bold text-amber-950 block">Synchronize Storefront Approval</span>
              <span className="text-[11px] text-slate-600">
                Grant immediate permission for this business owner to publish geofenced deals and broadcast to nearby shoppers.
              </span>
            </label>
          </div>

          {/* Auditor Audit Stamp */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Audited by: {currentUser.email}</span>
            </div>
            <span>PostgreSQL 16 Audit Ledger</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
            >
              {isSubmitting ? (
                <span>Saving Override...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Apply ABN Override</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
