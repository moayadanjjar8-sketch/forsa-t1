import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  ExternalLink, 
  RefreshCw, 
  Check, 
  X, 
  AlertCircle, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Sparkles, 
  Award, 
  ChevronRight,
  Send,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { BusinessProfile, BusinessApprovalStatus, BusinessVerificationDoc } from '../../types';

export const MerchantReviewTab: React.FC = () => {
  const { 
    businesses, 
    currentUser, 
    approveBusinessProfile, 
    rejectBusinessProfile, 
    requestBusinessChanges, 
    reVerifyAbn, 
    formatCurrency 
  } = useApp();

  const [selectedStatusFilter, setSelectedStatusFilter] = useState<BusinessApprovalStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBusinessForReview, setSelectedBusinessForReview] = useState<BusinessProfile | null>(null);
  
  // Action Modals state
  const [actionType, setActionType] = useState<'approve' | 'request_changes' | 'reject' | null>(null);
  const [reviewNotesInput, setReviewNotesInput] = useState('');
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [viewingDoc, setViewingDoc] = useState<BusinessVerificationDoc | null>(null);
  const [isVerifyingAbn, setIsVerifyingAbn] = useState(false);
  const [abnVerificationResult, setAbnVerificationResult] = useState<{
    isValid: boolean;
    entityName: string;
    gstActive: boolean;
    status: BusinessProfile['abnStatus'];
  } | null>(null);

  // Filter businesses
  const filteredBusinesses = businesses.filter(b => {
    const status = b.approvalStatus || 'approved';
    if (selectedStatusFilter !== 'all' && status !== selectedStatusFilter) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = b.businessName.toLowerCase().includes(q);
      const matchAbn = b.abn.toLowerCase().includes(q);
      const matchOwner = b.applicantName ? b.applicantName.toLowerCase().includes(q) : false;
      const matchEmail = b.applicantEmail ? b.applicantEmail.toLowerCase().includes(q) : false;
      if (!matchName && !matchAbn && !matchOwner && !matchEmail) return false;
    }
    return true;
  });

  // Count stats
  const pendingCount = businesses.filter(b => b.approvalStatus === 'pending_review').length;
  const changesCount = businesses.filter(b => b.approvalStatus === 'changes_requested').length;
  const approvedCount = businesses.filter(b => !b.approvalStatus || b.approvalStatus === 'approved').length;
  const rejectedCount = businesses.filter(b => b.approvalStatus === 'rejected').length;

  const handleOpenReviewModal = (biz: BusinessProfile, action: 'approve' | 'request_changes' | 'reject') => {
    setSelectedBusinessForReview(biz);
    setActionType(action);
    setReviewNotesInput('');
    setRejectionReasonInput('');
    setAbnVerificationResult(null);
  };

  const handleExecuteDecision = () => {
    if (!selectedBusinessForReview || !actionType) return;

    if (actionType === 'approve') {
      approveBusinessProfile(
        selectedBusinessForReview.id, 
        reviewNotesInput.trim() || 'Verified all ASIC records, director identity, and business operating premises.'
      );
    } else if (actionType === 'request_changes') {
      if (!reviewNotesInput.trim()) return;
      requestBusinessChanges(selectedBusinessForReview.id, reviewNotesInput.trim());
    } else if (actionType === 'reject') {
      if (!rejectionReasonInput.trim()) return;
      rejectBusinessProfile(selectedBusinessForReview.id, rejectionReasonInput.trim());
    }

    setActionType(null);
    setSelectedBusinessForReview(null);
  };

  const handleRunLiveAbnCheck = (bizId: string) => {
    setIsVerifyingAbn(true);
    setTimeout(() => {
      const res = reVerifyAbn(bizId);
      setAbnVerificationResult(res);
      setIsVerifyingAbn(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Role Badge */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200/80">
              Business Owner Vetting &amp; Identity Verification
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              currentUser.role === 'super_admin'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-teal-50 text-teal-800 border border-teal-200'
            }`}>
              Reviewed by: {currentUser.role === 'super_admin' ? 'Super Admin' : 'Operations Admin'}
            </span>
          </div>
          <h2 className="text-xl font-heading font-bold text-slate-900 mt-1">
            Business Owner Profile Verification Queue
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Strict compliance review before business owner storefronts &amp; flash deals go live on the Australian network.
          </p>
        </div>

        {/* Quick Review Stats */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <div>
              <span className="text-[10px] text-amber-800 font-semibold block uppercase">Pending Review</span>
              <span className="text-base font-bold text-amber-950 font-mono">{pendingCount} Applicants</span>
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 font-semibold block uppercase">Active Business Owners</span>
            <span className="text-base font-bold text-slate-800 font-mono">{approvedCount} Live</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            id="filter-all-merchants"
            onClick={() => setSelectedStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              selectedStatusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Applications ({businesses.length})
          </button>
          
          <button
            id="filter-pending-merchants"
            onClick={() => setSelectedStatusFilter('pending_review')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              selectedStatusFilter === 'pending_review'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review ({pendingCount})</span>
          </button>

          <button
            id="filter-changes-merchants"
            onClick={() => setSelectedStatusFilter('changes_requested')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              selectedStatusFilter === 'changes_requested'
                ? 'bg-orange-600 text-white'
                : 'bg-orange-50 text-orange-900 border border-orange-200 hover:bg-orange-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Action Required ({changesCount})</span>
          </button>

          <button
            id="filter-approved-merchants"
            onClick={() => setSelectedStatusFilter('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              selectedStatusFilter === 'approved'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Approved ({approvedCount})</span>
          </button>

          <button
            id="filter-rejected-merchants"
            onClick={() => setSelectedStatusFilter('rejected')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              selectedStatusFilter === 'rejected'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected ({rejectedCount})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            id="input-search-merchant-reviews"
            type="text"
            placeholder="Search by store name, ABN, owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 w-full sm:w-72"
          />
        </div>
      </div>

      {/* Business Owner Applications List */}
      <div className="space-y-4">
        {filteredBusinesses.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No business owner applications found</h4>
            <p className="text-xs text-slate-500 mt-1">There are no businesses matching the selected filter.</p>
          </div>
        ) : (
          filteredBusinesses.map((biz) => {
            const status: BusinessApprovalStatus = biz.approvalStatus || 'approved';
            const isPending = status === 'pending_review';
            const isChanges = status === 'changes_requested';
            const isApproved = status === 'approved';
            const isRejected = status === 'rejected';

            return (
              <div 
                key={biz.id}
                id={`business-card-${biz.id}`}
                className={`bg-white border rounded-2xl p-5 shadow-xs transition-all ${
                  isPending 
                    ? 'border-amber-300 ring-1 ring-amber-200/50 bg-linear-to-r from-amber-50/20 via-white to-white' 
                    : isChanges
                    ? 'border-orange-300 bg-orange-50/10'
                    : isRejected
                    ? 'border-rose-200 opacity-80'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  
                  {/* Business & Owner Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <img 
                      src={biz.logoUrl} 
                      alt={biz.businessName}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0" 
                    />
                    
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-heading font-bold text-slate-900">
                          {biz.businessName}
                        </h3>
                        
                        {/* Approval Status Badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                          isPending
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : isChanges
                            ? 'bg-orange-100 text-orange-900 border border-orange-300'
                            : isApproved
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}>
                          {isPending && <Clock className="w-3 h-3 text-amber-700 animate-spin" />}
                          {isChanges && <AlertTriangle className="w-3 h-3 text-orange-700" />}
                          {isApproved && <CheckCircle className="w-3 h-3 text-emerald-700" />}
                          {isRejected && <XCircle className="w-3 h-3 text-rose-700" />}
                          <span className="uppercase">{status.replace('_', ' ')}</span>
                        </span>

                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                          {biz.subscription.tier} Plan
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {biz.description}
                      </p>

                      {/* Key Merchant Meta Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2 text-xs">
                        <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Legal Trading Entity</span>
                          <span className="font-semibold text-slate-800">{biz.legalTradingName || `${biz.businessName} Pty Ltd`}</span>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">ABN / ABR Status</span>
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-amber-900">{biz.abn}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              biz.abnStatus === 'verified_abr' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {biz.abnStatus}
                            </span>
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Applicant / Director</span>
                          <span className="font-semibold text-slate-800">{biz.applicantName || 'Registered Owner'}</span>
                          <span className="text-[11px] text-slate-500 block">{biz.applicantEmail || 'owner@contact.com'}</span>
                        </div>
                      </div>

                      {/* Location & Application Date */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {biz.branches[0]?.address || 'Adelaide CBD'}
                        </span>
                        {biz.appliedAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            Applied: {new Date(biz.appliedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                        {biz.reviewedBy && (
                          <span className="text-slate-600 font-medium">
                            Reviewed by: <strong className="text-slate-800">{biz.reviewedBy}</strong>
                          </span>
                        )}
                      </div>

                      {/* If review notes exist */}
                      {biz.reviewNotes && (
                        <div className={`mt-2 p-2.5 rounded-xl text-xs border ${
                          isChanges 
                            ? 'bg-orange-50/80 border-orange-200 text-orange-950'
                            : isRejected
                            ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                            : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                        }`}>
                          <div className="font-bold flex items-center gap-1 mb-0.5">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Reviewer Compliance Notes:</span>
                          </div>
                          <p className="leading-relaxed">{biz.reviewNotes}</p>
                          {biz.rejectionReason && (
                            <p className="mt-1 text-rose-800 font-semibold">Reason: {biz.rejectionReason}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verification Docs & Action Buttons */}
                  <div className="lg:w-80 flex flex-col justify-between gap-4 pt-4 lg:pt-0 lg:border-l lg:border-slate-100 lg:pl-6">
                    
                    {/* Uploaded Verification Documents Section */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Uploaded Docs ({biz.verificationDocs?.length || 0})
                        </span>
                        <button
                          onClick={() => handleRunLiveAbnCheck(biz.id)}
                          disabled={isVerifyingAbn}
                          className="text-[11px] font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1"
                          title="Run live query against Australian Business Register"
                        >
                          <RefreshCw className={`w-3 h-3 ${isVerifyingAbn ? 'animate-spin' : ''}`} />
                          <span>Check ABR API</span>
                        </button>
                      </div>

                      {biz.verificationDocs && biz.verificationDocs.length > 0 ? (
                        <div className="space-y-1.5">
                          {biz.verificationDocs.map(doc => (
                            <div 
                              key={doc.id}
                              className="p-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 text-xs"
                            >
                              <div className="flex items-center gap-2 truncate">
                                <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span className="truncate text-slate-700 font-medium" title={doc.title}>
                                  {doc.title}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-1 shrink-0">
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                  doc.status === 'verified'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : doc.status === 'flagged'
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {doc.status}
                                </span>
                                <button
                                  onClick={() => setViewingDoc(doc)}
                                  className="p-1 text-slate-500 hover:text-slate-900 rounded hover:bg-slate-200"
                                  title="Inspect Document"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2.5 bg-slate-50 rounded-xl text-center text-xs text-slate-400 border border-dashed border-slate-200">
                          Standard automated ABN registration on file
                        </div>
                      )}
                    </div>

                    {/* Decision Action Buttons */}
                    <div className="space-y-2">
                      {isPending ? (
                        <div className="flex flex-col gap-1.5">
                          <button
                            id={`btn-approve-merchant-${biz.id}`}
                            onClick={() => handleOpenReviewModal(biz, 'approve')}
                            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve &amp; Activate Business Owner</span>
                          </button>

                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              id={`btn-changes-merchant-${biz.id}`}
                              onClick={() => handleOpenReviewModal(biz, 'request_changes')}
                              className="py-1.5 px-2 bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                            >
                              <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                              <span>Request Info</span>
                            </button>

                            <button
                              id={`btn-reject-merchant-${biz.id}`}
                              onClick={() => handleOpenReviewModal(biz, 'reject')}
                              className="py-1.5 px-2 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleOpenReviewModal(biz, isApproved ? 'request_changes' : 'approve')}
                            className="text-xs font-bold text-slate-700 hover:text-slate-900 hover:underline flex items-center gap-1"
                          >
                            <span>Re-evaluate Profile</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[11px] text-slate-400">
                            {isApproved ? 'Store Live & Broadcasting' : 'Access Restricted'}
                          </span>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ACTION MODAL (APPROVE / REQUEST CHANGES / REJECT) */}
      {selectedBusinessForReview && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl ${
                  actionType === 'approve'
                    ? 'bg-emerald-100 text-emerald-800'
                    : actionType === 'request_changes'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {actionType === 'approve' && <CheckCircle className="w-6 h-6" />}
                  {actionType === 'request_changes' && <AlertTriangle className="w-6 h-6" />}
                  {actionType === 'reject' && <XCircle className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-heading font-bold text-slate-900">
                    {actionType === 'approve' && 'Approve Business Profile'}
                    {actionType === 'request_changes' && 'Request Verification Revisions'}
                    {actionType === 'reject' && 'Decline Business Application'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedBusinessForReview.businessName} (ABN: {selectedBusinessForReview.abn})
                  </p>
                </div>
              </div>
              <button 
                onClick={() => { setActionType(null); setSelectedBusinessForReview(null); }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content per Action */}
            {actionType === 'approve' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Compliance Approval Confirmation</span>
                  </div>
                  <p className="leading-relaxed text-emerald-800">
                    Approving this profile will grant the business owner immediate access to publish geofenced flash deals, activate in-store QR scanning, and verify their Australian Business Number.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    Approval Compliance Notes (Recorded in Audit Trail):
                  </label>
                  <textarea
                    value={reviewNotesInput}
                    onChange={(e) => setReviewNotesInput(e.target.value)}
                    placeholder="e.g. ASIC verified, director photo ID matched Australian Drivers Licence, food safety council permit active."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {actionType === 'request_changes' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 text-orange-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-orange-700" />
                    <span>Specify Missing or Flagged Information</span>
                  </div>
                  <p className="leading-relaxed text-orange-900">
                    The business owner will be notified via email &amp; dashboard banner to re-upload the required documentation.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    Required Action / Missing Documents:
                  </label>
                  <textarea
                    value={reviewNotesInput}
                    onChange={(e) => setReviewNotesInput(e.target.value)}
                    placeholder="e.g. Please re-upload a clear uncropped copy of the current Commercial Lease Agreement for Hutt Street."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}

            {actionType === 'reject' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-rose-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-700" />
                    <span>Application Rejection</span>
                  </div>
                  <p className="leading-relaxed text-rose-900">
                    This will block the business from joining the platform.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 block">
                    Rejection Reason:
                  </label>
                  <input
                    type="text"
                    value={rejectionReasonInput}
                    onChange={(e) => setRejectionReasonInput(e.target.value)}
                    placeholder="e.g. ABN deregistered or invalid commercial address"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setActionType(null); setSelectedBusinessForReview(null); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                id="btn-confirm-execute-decision"
                type="button"
                onClick={handleExecuteDecision}
                disabled={
                  (actionType === 'request_changes' && !reviewNotesInput.trim()) ||
                  (actionType === 'reject' && !rejectionReasonInput.trim())
                }
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition-all ${
                  actionType === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : actionType === 'request_changes'
                    ? 'bg-orange-600 hover:bg-orange-700 disabled:opacity-50'
                    : 'bg-rose-600 hover:bg-rose-700 disabled:opacity-50'
                }`}
              >
                {actionType === 'approve' && 'Confirm & Authorize Business Owner'}
                {actionType === 'request_changes' && 'Send Revision Request'}
                {actionType === 'reject' && 'Confirm Rejection'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW MODAL */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                  {(viewingDoc.docType || viewingDoc.type || 'document').replace('_', ' ')}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{viewingDoc.title}</h3>
                <p className="text-xs text-slate-400">
                  Uploaded: {new Date(viewingDoc.uploadedAt).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => setViewingDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 h-80 flex items-center justify-center relative">
              <img 
                src={viewingDoc.fileUrl} 
                alt={viewingDoc.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-3 py-1 rounded-xl flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>ASIC &amp; Australian Government Watermark Verified</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
