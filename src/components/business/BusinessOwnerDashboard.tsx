import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CreateDealModal } from './CreateDealModal';
import { EditDealModal } from './EditDealModal';
import { DealGeofenceMapModal } from './DealGeofenceMapModal';
import { InteractiveGeofenceMap } from './InteractiveGeofenceMap';
import { 
  Building2, 
  Plus, 
  Radio, 
  MapPin, 
  Percent, 
  Clock, 
  Users, 
  QrCode, 
  CheckCircle2, 
  Pause, 
  Play, 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  ChevronRight, 
  Eye, 
  ShieldCheck, 
  Activity, 
  Calendar, 
  CreditCard, 
  Settings, 
  Store,
  ExternalLink,
  Flame,
  BarChart3,
  Smartphone
} from 'lucide-react';
import { Deal, BusinessProfile, DealCategory } from '../../types';

export const BusinessOwnerDashboard: React.FC = () => {
  const { 
    businesses, 
    deals, 
    currentUser, 
    toggleDealStatus, 
    deleteDeal, 
    redeemDealWithQr, 
    formatCurrency, 
    activeCurrency,
    setViewMode,
    setMobileRole,
    language 
  } = useApp();

  // Active business selection (default to first or user's assigned business)
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>(businesses[0].id);
  const activeBusiness = businesses.find(b => b.id === selectedBusinessId) || businesses[0];

  // Active Tab
  const [activeTab, setActiveTab] = useState<'deals' | 'pos_scanner' | 'analytics' | 'branches' | 'subscription' | 'profile'>('deals');
  const [dealStatusFilter, setDealStatusFilter] = useState<'all' | 'active' | 'paused' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [inspectingDeal, setInspectingDeal] = useState<Deal | null>(null);

  // POS Scanner state
  const [posInputSeed, setPosInputSeed] = useState('');
  const [posRedeemMessage, setPosRedeemMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filter deals belonging to this business
  const businessDeals = deals.filter(d => d.businessId === activeBusiness.id);

  const filteredDeals = businessDeals.filter(deal => {
    if (dealStatusFilter !== 'all' && deal.status !== dealStatusFilter) return false;
    if (searchQuery && !deal.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Calculate live merchant stats
  const activeDealsCount = businessDeals.filter(d => d.status === 'active').length;
  const totalRedemptions = businessDeals.reduce((sum, d) => sum + d.currentRedemptionsCount, 0);
  const totalDispatched = businessDeals.reduce((sum, d) => sum + d.metrics.dispatchedCount, 0);
  const avgConversionRate = businessDeals.length > 0
    ? +(businessDeals.reduce((sum, d) => sum + d.metrics.conversionRate, 0) / businessDeals.length).toFixed(1)
    : 0;

  const handlePosRedeemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!posInputSeed.trim()) return;

    const matchedDeal = deals.find(d => 
      d.qrCodeSeed.toLowerCase() === posInputSeed.trim().toLowerCase() ||
      d.id.toLowerCase() === posInputSeed.trim().toLowerCase()
    );

    if (!matchedDeal) {
      setPosRedeemMessage({ type: 'error', text: 'Invalid QR Code seed or deal voucher not recognized.' });
      return;
    }

    const result = redeemDealWithQr(matchedDeal.id, 'Cashier Terminal 01');
    if (result.success) {
      setPosRedeemMessage({ 
        type: 'success', 
        text: `✓ Applied ${matchedDeal.discountPercentage}% OFF for ${matchedDeal.title}! Discount redeemed successfully.` 
      });
      setPosInputSeed('');
    } else {
      setPosRedeemMessage({ type: 'error', text: result.message });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner & Merchant Identity */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Merchant Profile details */}
        <div className="flex items-center gap-4">
          <img 
            src={activeBusiness.logoUrl} 
            alt={activeBusiness.businessName} 
            className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs" 
          />
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-heading font-bold text-slate-900">
                {activeBusiness.businessName}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                ABN {activeBusiness.abn} (Verified)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 uppercase">
                {activeBusiness.subscription.tier} Tier
              </span>
            </div>
            
            <p className="text-xs text-slate-500 flex items-center gap-3">
              <span>{activeBusiness.branches.length} Store Location(s)</span>
              <span>•</span>
              <span>Category: {activeBusiness.category.replace('_', ' ')}</span>
              <span>•</span>
              <span className="text-amber-700 font-semibold">{activeBusiness.followerCount} Radar Followers</span>
            </p>
          </div>
        </div>

        {/* Right: Business Switcher & Primary Action */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Switch Active Business dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500 font-medium hidden sm:inline">Store:</label>
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
            >
              {businesses.map(b => (
                <option key={b.id} value={b.id}>
                  {b.businessName} {b.approvalStatus === 'pending_review' ? '(Pending Review)' : ''}
                </option>
              ))}
            </select>
          </div>

          <button
            id="btn-create-flash-deal-main"
            onClick={() => setShowCreateModal(true)}
            disabled={activeBusiness.approvalStatus === 'pending_review' || activeBusiness.approvalStatus === 'rejected'}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-all ${
              activeBusiness.approvalStatus === 'pending_review' || activeBusiness.approvalStatus === 'rejected'
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950 hover:scale-102 active:scale-98'
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Flash Deal</span>
          </button>
        </div>

      </div>

      {/* COMPLIANCE & REVIEW NOTICE BANNER */}
      {activeBusiness.approvalStatus === 'pending_review' && (
        <div className="bg-amber-50 border border-amber-300 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-900 shrink-0 mt-0.5">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm text-amber-950">
                  Profile Application Under Review by Platform Administrators
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
                  Pending Verification
                </span>
              </div>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                Your Australian Business Number (ABN: {activeBusiness.abn}), ASIC incorporation records, and store location documents are being vetted by our compliance team (Admin / Super Admin) before your store joins the live consumer radar network.
              </p>
              {activeBusiness.verificationDocs && activeBusiness.verificationDocs.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-amber-200/80 text-[11px] text-amber-900 font-medium">
                  <span>Uploaded Docs:</span>
                  {activeBusiness.verificationDocs.map(doc => (
                    <span key={doc.id} className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-amber-950 font-mono">
                      ✓ {doc.title} ({doc.status})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => {
                setViewMode('admin');
              }}
              className="px-3.5 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Review as Admin</span>
            </button>
          </div>
        </div>
      )}

      {activeBusiness.approvalStatus === 'changes_requested' && (
        <div className="bg-orange-50 border border-orange-300 rounded-3xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-orange-100 text-orange-900 shrink-0 mt-0.5">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-sm text-orange-950">
                  Action Required: Additional Verification Requested
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-200 text-orange-900 uppercase">
                  Revisions Needed
                </span>
              </div>
              <p className="text-xs text-orange-900 mt-1 leading-relaxed">
                The platform administrator has requested updates before approving your storefront:
              </p>
              {activeBusiness.reviewNotes && (
                <div className="mt-2 p-2.5 bg-white rounded-xl border border-orange-200 text-xs font-medium text-orange-950">
                  &ldquo;{activeBusiness.reviewNotes}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeBusiness.approvalStatus === 'rejected' && (
        <div className="bg-rose-50 border border-rose-300 rounded-3xl p-5 shadow-xs flex items-start gap-3.5">
          <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-900 shrink-0 mt-0.5">
            <Trash2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm text-rose-950">
              Merchant Application Declined
            </h3>
            <p className="text-xs text-rose-900 mt-1">
              Reason: {activeBusiness.rejectionReason || 'ABN or document requirements not met.'}
            </p>
          </div>
        </div>
      )}

      {/* KPI Overview Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Active Geofences</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {activeDealsCount}
          </div>
          <p className="text-[11px] text-slate-400">Broadcasting live in Adelaide</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Nearby Shoppers Reached</span>
            <Radio className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono">
            {totalDispatched.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">Within 50m – 5km geofences</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Total In-Store Redemptions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono">
            {totalRedemptions}
          </div>
          <p className="text-[11px] text-emerald-600 font-medium">Avg conv: {avgConversionRate}%</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-semibold">Push Delivery SLA</span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">100%</span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            &lt;2.4s
          </div>
          <p className="text-[11px] text-slate-400">Sub-60s SLA guaranteed</p>
        </div>

      </div>

      {/* Main Navigation Subtabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('deals')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'deals'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5 text-amber-400" />
          <span>Deals &amp; Geofences ({businessDeals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pos_scanner')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'pos_scanner'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <QrCode className="w-3.5 h-3.5 text-amber-400" />
          <span>POS QR Terminal</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Performance &amp; ROI</span>
        </button>

        <button
          onClick={() => setActiveTab('branches')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'branches'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Store Branches ({activeBusiness.branches.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subscription')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'subscription'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Subscription &amp; Quota</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Store Settings</span>
        </button>
      </div>

      {/* TAB CONTENT 1: DEALS & GEOFENCES */}
      {activeTab === 'deals' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Filter & Search Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Status Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All Deals' },
                { id: 'active', label: 'Live Active' },
                { id: 'paused', label: 'Paused' },
                { id: 'expired', label: 'Expired' }
              ].map(pill => (
                <button
                  key={pill.id}
                  onClick={() => setDealStatusFilter(pill.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                    dealStatusFilter === pill.id
                      ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search deals by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 w-full sm:w-64"
              />
            </div>
          </div>

          {/* Deals Grid */}
          {filteredDeals.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Radio className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No deals match your criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Broadcast your first hyper-local discount to nearby pedestrians within 500m of your storefront.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold shadow-xs hover:bg-amber-600"
              >
                + Create Flash Deal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDeals.map(deal => (
                <div 
                  key={deal.id} 
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    {/* Card Cover Image */}
                    <div className="relative h-40">
                      <img src={deal.imageUrl} alt={deal.title} className="w-full h-full object-cover" />
                      
                      {/* Discount Badge */}
                      <div className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-extrabold px-2.5 py-1 rounded-lg shadow-sm">
                        {deal.discountPercentage}% OFF
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase shadow-sm ${
                          deal.status === 'active'
                            ? 'bg-emerald-500 text-white animate-pulse'
                            : deal.status === 'paused'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-slate-200'
                        }`}>
                          {deal.status}
                        </span>
                      </div>

                      {/* Geofence Radius Pill */}
                      <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-slate-700">
                        <Radio className="w-3.5 h-3.5 text-amber-400" />
                        <span>{deal.radiusMeters}m Geofence</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-heading font-bold text-sm text-slate-900 line-clamp-2">
                        {deal.title}
                      </h3>
                      
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {deal.description}
                      </p>

                      {/* Funnel Metrics Row */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 grid grid-cols-3 gap-2 text-center text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-semibold">Matched</span>
                          <span className="font-mono font-bold text-slate-800">{deal.metrics.dispatchedCount}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-semibold">Redeemed</span>
                          <span className="font-mono font-bold text-emerald-700">{deal.currentRedemptionsCount}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9px] uppercase font-semibold">Conv %</span>
                          <span className="font-mono font-bold text-sky-700">{deal.metrics.conversionRate}%</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                        <span>QR: {deal.qrCodeSeed}</span>
                        <span className="text-slate-600 font-medium">{deal.location?.suburb || 'Adelaide CBD'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                    
                    {/* View Geofence Map */}
                    <button
                      onClick={() => setInspectingDeal(deal)}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                      title="Inspect Radar & Funnel"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>Map Radar</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {/* Pause / Resume Button */}
                      <button
                        onClick={() => toggleDealStatus(deal.id)}
                        className={`p-1.5 rounded-xl border transition-colors ${
                          deal.status === 'active'
                            ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                        }`}
                        title={deal.status === 'active' ? 'Pause broadcast' : 'Resume broadcast'}
                      >
                        {deal.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => setEditingDeal(deal)}
                        className="p-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors"
                        title="Edit Deal"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => deleteDeal(deal.id)}
                        className="p-1.5 bg-white text-rose-600 border border-slate-200 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Delete Deal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT 2: POINT OF SALE (POS) QR SCANNER */}
      {activeTab === 'pos_scanner' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6 animate-in fade-in">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-sm">
              <QrCode className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-heading font-bold text-slate-900">
              In-Store Cashier Redemption Terminal
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Validate customer discount vouchers instantly at point of sale. Scan or enter the customer's voucher code.
            </p>
          </div>

          <form onSubmit={handlePosRedeemSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Enter Customer QR Code / Voucher Seed</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. FORSAT-AMIRA-12948"
                  value={posInputSeed}
                  onChange={(e) => setPosInputSeed(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 uppercase"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
                >
                  Verify &amp; Redeem
                </button>
              </div>
            </div>
          </form>

          {posRedeemMessage && (
            <div className={`p-4 rounded-2xl border text-xs font-semibold animate-in fade-in ${
              posRedeemMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}>
              {posRedeemMessage.text}
            </div>
          )}

          {/* Quick Click to Test Redeem Available Deals */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <span className="text-xs font-bold text-slate-700 block">Quick Test Redeem Active Deals:</span>
            <div className="space-y-2">
              {businessDeals.filter(d => d.status === 'active').map(d => (
                <div key={d.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">{d.title}</span>
                    <span className="font-mono text-amber-700 font-semibold">{d.qrCodeSeed}</span>
                  </div>
                  <button
                    onClick={() => {
                      const res = redeemDealWithQr(d.id, 'Cashier Direct Test');
                      if (res.success) {
                        setPosRedeemMessage({ type: 'success', text: `✓ Redeemed 1x ${d.discountPercentage}% OFF voucher!` });
                      }
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 rounded-lg text-xs font-bold shadow-2xs"
                  >
                    Redeem Voucher
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB CONTENT 3: PERFORMANCE & ROI */}
      {activeTab === 'analytics' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-lg font-heading font-bold text-slate-900">
              Geofenced Conversion &amp; ROI Analytics
            </h2>
            <p className="text-xs text-slate-500">
              Measure real foot-traffic generated by hyper-local push notifications vs subscription cost
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-semibold">Estimated Gross Revenue</span>
              <div className="text-2xl font-mono font-extrabold text-slate-900">
                {formatCurrency(totalRedemptions * 1800)}
              </div>
              <p className="text-[11px] text-emerald-700 font-medium">From {totalRedemptions} redeemed vouchers</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-semibold">Average Time to Redeem</span>
              <div className="text-2xl font-mono font-extrabold text-amber-700">
                14.2 min
              </div>
              <p className="text-[11px] text-slate-400">From notification push to counter scan</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-semibold">Return on Investment (ROI)</span>
              <div className="text-2xl font-mono font-extrabold text-emerald-700">
                18.4x
              </div>
              <p className="text-[11px] text-slate-400">Based on Growth tier subscription</p>
            </div>
          </div>

          {/* Performance by Radius Bucket */}
          <div className="border border-slate-200 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-800">Conversion Rate by Geofence Distance</h3>
            <div className="space-y-3">
              {[
                { label: '50m – 200m (Immediate Storefront)', conv: '34.2%', bar: 'w-5/6', color: 'bg-emerald-500' },
                { label: '250m – 500m (CBD Walking Core)', conv: '22.8%', bar: 'w-3/5', color: 'bg-amber-500' },
                { label: '1000m – 2000m (Outer City Limit)', conv: '11.5%', bar: 'w-1/3', color: 'bg-sky-500' },
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{item.label}</span>
                    <span className="font-mono text-slate-900">{item.conv}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={`${item.color} h-full ${item.bar} rounded-full`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: BRANCHES */}
      {activeTab === 'branches' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-lg font-heading font-bold text-slate-900">
              Store Branches &amp; Geofence Anchors
            </h2>
            <p className="text-xs text-slate-500">
              Locations where your geofences broadcast and where customers can redeem in-store
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBusiness.branches.map(branch => (
              <div key={branch.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                      <Store className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-slate-900">{branch.branchName}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    ACTIVE
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{branch.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{branch.openingHours}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 pt-1">
                    Coordinates: [{branch.lat.toFixed(4)}, {branch.lng.toFixed(4)}]
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: SUBSCRIPTION */}
      {activeTab === 'subscription' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-lg font-heading font-bold text-slate-900">
              Merchant Subscription &amp; Monthly Quotas
            </h2>
            <p className="text-xs text-slate-500">
              Manage your active billing cycle, deal broadcast quotas, and geofence distance limits
            </p>
          </div>

          <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 bg-amber-500 text-slate-950 rounded-full text-xs font-extrabold uppercase">
                {activeBusiness.subscription.tier} Plan
              </span>
              <h3 className="text-xl font-heading font-bold text-slate-100">
                15 Geofence Broadcasts / Month
              </h3>
              <p className="text-xs text-slate-400">
                Max geofence radius: 3,000m • Sub-60s Push SLA Guarantee • AI Copywriter Enabled
              </p>
            </div>

            <div className="text-right">
              <div className="text-2xl font-extrabold font-mono text-amber-400">
                {formatCurrency(activeBusiness.subscription.monthlyPriceCents / 100)}/mo
              </div>
              <span className="text-xs text-emerald-400 font-semibold block">Auto-renews monthly</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: STORE PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-lg font-heading font-bold text-slate-900">
              Store Profile &amp; ABN Verification
            </h2>
            <p className="text-xs text-slate-500">
              Merchant information shown on customer receipts and radar cards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Business Legal Name</label>
              <input
                type="text"
                disabled
                value={activeBusiness.businessName}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-medium text-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Australian Business Number (ABN)</label>
              <input
                type="text"
                disabled
                value={activeBusiness.abn}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 font-mono font-bold text-amber-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <CreateDealModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        business={activeBusiness}
      />

      <EditDealModal
        deal={editingDeal}
        isOpen={!!editingDeal}
        onClose={() => setEditingDeal(null)}
      />

      <DealGeofenceMapModal
        deal={inspectingDeal}
        isOpen={!!inspectingDeal}
        onClose={() => setInspectingDeal(null)}
      />

    </div>
  );
};
