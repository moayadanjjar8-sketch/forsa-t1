import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  ShieldCheck, 
  CreditCard, 
  TrendingUp, 
  Sliders, 
  Activity, 
  FileText, 
  Users, 
  MapPin, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Zap, 
  RefreshCw, 
  Search, 
  Filter, 
  Eye, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  BarChart3,
  DollarSign,
  Compass,
  ArrowUpRight,
  Lock,
  Globe,
  Radio,
  ShoppingBag,
  Menu,
  X,
  Server,
  Layers,
  Plus,
  Trash2,
  Edit3,
  Pause,
  Play
} from 'lucide-react';
import { Deal, BusinessProfile, SubscriptionTier, DealCategory } from '../../types';
import { UserManagementTab } from './UserManagementTab';
import { CurrencyManagementTab } from './CurrencyManagementTab';
import { SubscriptionPlansTab } from './SubscriptionPlansTab';
import { RegionalAnalyticsTab } from './RegionalAnalyticsTab';
import { RolesPermissionsTab } from './RolesPermissionsTab';
import { MerchantReviewTab } from './MerchantReviewTab';
import { OverrideAbnModal } from './OverrideAbnModal';
import { ChangeSubscriptionTierModal } from './ChangeSubscriptionTierModal';
import { CreateDealModal } from '../business/CreateDealModal';
import { EditDealModal } from '../business/EditDealModal';
import { DealGeofenceMapModal } from '../business/DealGeofenceMapModal';

export const AdminDashboard: React.FC = () => {
  const { 
    deals, 
    businesses, 
    allUsers, 
    auditLogs, 
    utmRecords, 
    pushDispatches, 
    systemHealth, 
    updateAbnStatus, 
    updateBusinessSubscription,
    toggleDealStatus,
    deleteDeal,
    activeCurrency,
    currencies,
    subscriptionPlans,
    formatCurrency,
    currentUser,
    switchRolePersona
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'merchant_review' | 'regions' | 'roles' | 'users' | 'currency' | 'subscriptions' | 'deals' | 'businesses' | 'category_rules' | 'audit_logs'
  >('overview');
  
  const [dealSearchQuery, setDealSearchQuery] = useState('');
  const [dealStatusFilter, setDealStatusFilter] = useState<'all' | 'active' | 'paused' | 'expired' | 'moderation_flagged'>('all');
  const [businessSearchQuery, setBusinessSearchQuery] = useState('');
  const [selectedDealForModal, setSelectedDealForModal] = useState<Deal | null>(null);
  const [adminCreateDealOpen, setAdminCreateDealOpen] = useState(false);
  const [adminEditDeal, setAdminEditDeal] = useState<Deal | null>(null);
  const [adminRadarDeal, setAdminRadarDeal] = useState<Deal | null>(null);
  const [selectedBizForAbnOverride, setSelectedBizForAbnOverride] = useState<BusinessProfile | null>(null);
  const [selectedBizForTierChange, setSelectedBizForTierChange] = useState<BusinessProfile | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const pendingReviewCount = businesses.filter(b => b.approvalStatus === 'pending_review').length;
  const isSuperAdmin = currentUser.role === 'super_admin';

  // Financial calculations
  const totalMrrCents = businesses.reduce((acc, b) => acc + (b.subscription.status === 'active' ? b.subscription.monthlyPriceCents : 0), 0);
  const formattedMrr = formatCurrency(totalMrrCents / 100);
  const totalRedemptions = deals.reduce((acc, d) => acc + d.currentRedemptionsCount, 0);
  const avgPlatformConversion = +(deals.reduce((acc, d) => acc + d.metrics.conversionRate, 0) / Math.max(1, deals.length)).toFixed(1);

  const filteredDeals = deals.filter(d => {
    if (dealStatusFilter !== 'all' && d.status !== dealStatusFilter) return false;
    if (dealSearchQuery && !d.title.toLowerCase().includes(dealSearchQuery.toLowerCase()) && !d.businessName.toLowerCase().includes(dealSearchQuery.toLowerCase())) return false;
    return true;
  });

  const filteredBusinesses = businesses.filter(b => 
    b.businessName.toLowerCase().includes(businessSearchQuery.toLowerCase()) ||
    b.abn.includes(businessSearchQuery)
  );

  // Navigation Items grouped logically
  const navGroups = [
    {
      group: 'Governance & Vetting',
      items: [
        { id: 'merchant_review', label: 'Business Owner Review Queue', icon: ShieldCheck, badge: pendingReviewCount > 0 ? `${pendingReviewCount} Pending` : null },
        { id: 'businesses', label: 'Business Owners & ABN', icon: Building2, badge: `${businesses.length}` },
        { id: 'deals', label: 'Deals Moderation', icon: Zap, badge: `${deals.length}` },
        { id: 'users', label: 'User Management', icon: Users, badge: `${allUsers.length}` },
        { id: 'roles', label: 'Roles & Permissions', icon: Lock, badge: null },
      ]
    },
    {
      group: 'Analytics & Regions',
      items: [
        { id: 'overview', label: 'Executive Summary', icon: Activity, badge: null },
        { id: 'regions', label: 'Regions & Analytics', icon: Globe, badge: 'Active' },
      ]
    },
    {
      group: 'Monetization & Plans (Root)',
      items: [
        { id: 'subscriptions', label: 'Plans & MRR', icon: CreditCard, badge: isSuperAdmin ? `${subscriptionPlans.length}` : 'Super Admin' },
        { id: 'currency', label: 'Currencies & FX', icon: DollarSign, badge: isSuperAdmin ? `${currencies.length}` : 'Super Admin' },
      ]
    },
    {
      group: 'System & Security',
      items: [
        { id: 'category_rules', label: 'Category & Radius Rules', icon: Sliders, badge: null },
        { id: 'audit_logs', label: 'Security & Audit Logs', icon: FileText, badge: `${auditLogs.length}` }
      ]
    }
  ];

  const currentTabTitle = navGroups.flatMap(g => g.items).find(i => i.id === activeAdminTab)?.label || 'Executive Summary';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Top Banner / Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8 shadow-xs sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle Button */}
            <button
              id="admin-sidebar-mobile-toggle"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              aria-label="Toggle Navigation Sidebar"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                  isSuperAdmin 
                    ? 'bg-rose-50 text-rose-900 border border-rose-200' 
                    : 'bg-teal-50 text-teal-900 border border-teal-200'
                }`}>
                  {isSuperAdmin ? 'Platform Super Admin (Root Access)' : 'Operations Admin (Verification Officer)'}
                </span>
                <span className="hidden sm:inline text-xs text-slate-400 font-medium">/</span>
                <span className="hidden sm:inline text-xs text-slate-500 font-medium">{currentTabTitle}</span>
              </div>
              <h1 className="text-xl font-heading font-bold text-slate-900 mt-0.5">
                Forsa-T Platform Operations &amp; Intelligence
              </h1>
            </div>
          </div>

          {/* Role Persona Switcher & Operational Indicators */}
          <div className="flex items-center gap-3 flex-wrap">
            
            {/* Direct Super Admin vs Admin Toggle Button */}
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1 text-xs">
              <span className="text-[11px] font-semibold text-slate-500 px-2 hidden sm:inline">Role View:</span>
              <button
                id="btn-switch-to-super-admin"
                onClick={() => switchRolePersona('super_admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isSuperAdmin 
                    ? 'bg-white text-rose-900 shadow-xs border border-slate-200' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Super Admin
              </button>
              
            </div>

            {/* SLA indicator */}
            <div className="hidden xl:flex items-center gap-3 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs">
        
              <div className="text-left">
                <span className="text-[10px] text-slate-500 block font-medium">Currency</span>
                <span className="text-xs font-bold text-sky-700 font-mono">
                  {activeCurrency}
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        <div className="flex flex-col lg:flex-row gap-6">

          {/* BACKDROP FOR MOBILE SIDEBAR */}
          {isMobileSidebarOpen && (
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}

          {/* VERTICAL SIDEBAR NAVIGATION */}
          <aside className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 p-4 transition-transform duration-200 ease-in-out shadow-xl lg:shadow-none
            lg:static lg:block lg:w-64 xl:w-72 lg:shrink-0 lg:bg-white lg:border lg:border-slate-200 lg:rounded-2xl lg:p-4 lg:self-start lg:sticky lg:top-20
            ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            {/* Mobile Header Inside Drawer */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 lg:hidden">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs shadow-xs">
                  FT
                </div>
                <span className="font-heading font-bold text-sm text-slate-900">Admin Control</span>
              </div>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {navGroups.map((group, gIdx) => (
                <div key={gIdx} className="space-y-1">
                  <div className="px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    {group.group}
                  </div>
                  <div className="space-y-0.5">
                    {group.items.map(item => {
                      const IconComponent = item.icon;
                      const isActive = activeAdminTab === item.id;
                      return (
                        <button
                          key={item.id}
                          id={`admin-sidebar-tab-${item.id}`}
                          onClick={() => {
                            setActiveAdminTab(item.id as any);
                            setIsMobileSidebarOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                            isActive
                              ? 'bg-slate-900 text-white shadow-xs font-semibold'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                              isActive
                                ? 'bg-slate-800 text-amber-300 border border-slate-700'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar System Telemetry Footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    PostGIS Engine
                  </span>
                  <span className="font-mono font-bold text-slate-800">v16.2</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[10px]">
                  <span>Push Latency</span>
                  <span className="font-mono text-emerald-700 font-semibold">&lt; 60s SLA</span>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0 space-y-6">

        {/* TAB 1: EXECUTIVE SUMMARY / OVERVIEW */}
        {activeAdminTab === 'overview' && (
          <div className="space-y-6">
            
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Monthly Recurring Revenue</span>
                  <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200/80">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">{formattedMrr}</div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 mt-2 font-medium">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +24.5% vs last month from business owner plans
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Pending Review</span>
                  <div className="p-2 bg-amber-50 text-amber-800 rounded-xl border border-amber-200/80">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
                  {pendingReviewCount} Businesses
                </div>
                <div className="text-xs text-amber-700 mt-2 font-semibold flex items-center justify-between">
                  <span>Awaiting profile approval</span>
                  <button 
                    onClick={() => setActiveAdminTab('merchant_review')}
                    className="hover:underline font-bold text-amber-800"
                  >
                    Review &rarr;
                  </button>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Total In-Store Redemptions</span>
                  <div className="p-2 bg-purple-50 text-purple-700 rounded-xl border border-purple-200/80">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">{totalRedemptions}</div>
                <div className="text-xs text-sky-700 mt-2 font-medium">
                  {avgPlatformConversion}% Average Deal Conversion
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Active Shoppers &amp; Users</span>
                  <div className="p-2 bg-sky-50 text-sky-700 rounded-xl border border-sky-200/80">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-2 font-mono">
                  {allUsers.length}
                </div>
                <div className="text-xs text-slate-500 mt-2 font-medium">
                  {allUsers.filter(u => u.status === 'active').length} Active in last 24 hours
                </div>
              </div>

            </div>

            {/* Quick Actions & Live Geofence Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Cols: Live Geofence Broadcasts */}
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-heading font-bold text-base text-slate-900">
                      Recent Geofenced Push Dispatches
                    </h3>
                    <p className="text-xs text-slate-500">Real-time localized customer notifications</p>
                  </div>
                  <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 font-medium flex items-center gap-1.5">
                    <Radio className="w-3 h-3 animate-pulse text-emerald-600" />
                    Live Queue
                  </span>
                </div>

                <div className="space-y-3">
                  {pushDispatches.map(record => (
                    <div key={record.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                          {record.deliveryProvider}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">{record.dealTitle}</h4>
                          <p className="text-[11px] text-slate-500">{record.businessName} • Radius: {record.targetRadiusM}m</p>
                        </div>
                      </div>
                      <div className="text-right font-mono text-xs">
                        <span className="text-emerald-700 font-bold block">
                          {(record.latencyMs / 1000).toFixed(2)}s Delivery
                        </span>
                        <span className="text-slate-500 text-[10px]">
                          {record.matchedUsersCount} shoppers in range
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Col: ABN Pending Actions */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-heading font-bold text-base text-slate-900">
                      Business Owner Vetting Queue
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                      {pendingReviewCount} Pending
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">
                    Australian Business Number compliance &amp; profile reviews
                  </p>

                  <div className="space-y-3">
                    {businesses.slice(0, 4).map(biz => (
                      <div key={biz.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800">{biz.businessName}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            biz.approvalStatus === 'approved' || !biz.approvalStatus
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                              : biz.approvalStatus === 'pending_review'
                              ? 'bg-amber-50 text-amber-900 border border-amber-200/80'
                              : 'bg-rose-50 text-rose-800 border border-rose-200/80'
                          }`}>
                            {(biz.approvalStatus || 'approved').replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                        <div className="text-slate-600 flex items-center justify-between mt-1">
                          <span>ABN: {biz.abn}</span>
                          <button
                            id={`btn-review-quick-${biz.id}`}
                            onClick={() => setActiveAdminTab('merchant_review')}
                            className="text-amber-700 hover:text-amber-800 font-semibold"
                          >
                            Review Profile &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Vetting by Admin/Super Admin</span>
                  <button
                    onClick={() => setActiveAdminTab('merchant_review')}
                    className="font-bold text-amber-800 hover:text-amber-900 hover:underline"
                  >
                    Open Review Center &rarr;
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB: BUSINESS OWNER REVIEW QUEUE */}
        {activeAdminTab === 'merchant_review' && (
          <MerchantReviewTab />
        )}

        {/* TAB 2: REGIONAL ANALYTICS */}
        {activeAdminTab === 'regions' && (
          <RegionalAnalyticsTab />
        )}

        {/* TAB 3: ROLES & PERMISSIONS MATRIX */}
        {activeAdminTab === 'roles' && (
          <RolesPermissionsTab />
        )}

        {/* TAB 4: USERS & ROLES DIRECTORY */}
        {activeAdminTab === 'users' && (
          <UserManagementTab />
        )}

        {/* TAB 5: CURRENCY & FX RATES */}
        {activeAdminTab === 'currency' && (
          <CurrencyManagementTab />
        )}

        {/* TAB 6: SUBSCRIPTION PLANS & BILLING */}
        {activeAdminTab === 'subscriptions' && (
          <SubscriptionPlansTab />
        )}

        {/* TAB 7: DEALS MODERATION */}
        {activeAdminTab === 'deals' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-heading font-bold text-slate-900">
                  Deals Moderation &amp; Dispatch Registry
                </h3>
                <p className="text-xs text-slate-500">
                  Inspect active promotions, verify discount accuracy, review conversion funnels, and moderate geofences
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  id="btn-admin-provision-deal"
                  onClick={() => setAdminCreateDealOpen(true)}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Provision Platform Deal</span>
                </button>

                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="input-search-deals"
                    type="text"
                    placeholder="Filter by title or business owner..."
                    value={dealSearchQuery}
                    onChange={(e) => setDealSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 w-56"
                  />
                </div>
              </div>
            </div>

            {/* Status Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Statuses' },
                { id: 'active', label: 'Live Active' },
                { id: 'paused', label: 'Paused' },
                { id: 'moderation_flagged', label: 'Flagged' },
                { id: 'expired', label: 'Expired' }
              ].map(chip => (
                <button
                  key={chip.id}
                  onClick={() => setDealStatusFilter(chip.id as any)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                    dealStatusFilter === chip.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-mono uppercase text-[11px]">
                    <th className="pb-3 px-3">Deal &amp; Business Owner</th>
                    <th className="pb-3 px-3">Category</th>
                    <th className="pb-3 px-3">Radius</th>
                    <th className="pb-3 px-3">Discount</th>
                    <th className="pb-3 px-3">Redemptions</th>
                    <th className="pb-3 px-3">Conversion</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDeals.map(deal => (
                    <tr key={deal.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{deal.title}</div>
                        <div className="text-slate-500 text-[11px]">{deal.businessName} • {deal.location?.suburb || deal.location?.address || 'Adelaide CBD'}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                          {deal.businessCategory.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-amber-700 font-semibold">
                        {deal.radiusMeters}m
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-700 font-mono">
                        {deal.discountPercentage}% OFF
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        {deal.currentRedemptionsCount} / {deal.targetMaxRedemptions || '∞'}
                      </td>
                      <td className="py-3 px-3 font-mono text-sky-700 font-semibold">
                        {deal.metrics.conversionRate}%
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          deal.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                            : deal.status === 'paused'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                            : 'bg-rose-50 text-rose-800 border border-rose-200/80'
                        }`}>
                          {deal.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`btn-inspect-radar-${deal.id}`}
                            onClick={() => setAdminRadarDeal(deal)}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1"
                            title="Inspect PostGIS Geofence Radar"
                          >
                            <MapPin className="w-3.5 h-3.5 text-amber-600" />
                            <span>Radar Map</span>
                          </button>

                          <button
                            onClick={() => toggleDealStatus(deal.id)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              deal.status === 'active'
                                ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            }`}
                            title={deal.status === 'active' ? 'Pause broadcast' : 'Activate broadcast'}
                          >
                            {deal.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          </button>

                          <button
                            onClick={() => setAdminEditDeal(deal)}
                            className="p-1.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Deal"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => deleteDeal(deal.id)}
                            className="p-1.5 bg-white text-rose-600 border border-slate-200 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete / Revoke Deal"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 8: BUSINESS DIRECTORY & ABN */}
        {activeAdminTab === 'businesses' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-heading font-bold text-slate-900">
                  Business Owner Directory &amp; Profiles
                </h3>
                <p className="text-xs text-slate-500">
                  Manage registered store profiles, branch locations, and active subscription tiers
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  id="input-search-businesses"
                  type="text"
                  placeholder="Search by name or ABN..."
                  value={businessSearchQuery}
                  onChange={(e) => setBusinessSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 w-64"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBusinesses.map(biz => (
                <div key={biz.id} className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <img 
                          src={biz.logoUrl} 
                          alt={biz.businessName} 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200" 
                        />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{biz.businessName}</h4>
                          <span className="text-[11px] text-slate-500 font-medium">{biz.category.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        biz.subscription.tier === 'enterprise' 
                          ? 'bg-purple-50 text-purple-800 border border-purple-200/80'
                          : biz.subscription.tier === 'growth'
                          ? 'bg-amber-50 text-amber-900 border border-amber-200/80'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {biz.subscription.tier.toUpperCase()} TIER
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">{biz.description}</p>

                    <div className="bg-slate-50 rounded-lg p-2.5 text-xs space-y-1.5 border border-slate-200/80">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Australian Business Number (ABN):</span>
                        <span className="font-mono text-amber-800 font-semibold">{biz.abn}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Verification Status:</span>
                        <span className="text-emerald-700 font-semibold">{biz.abnStatus.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Store Locations:</span>
                        <span className="text-slate-800 font-medium">{biz.branches.length} branches</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex gap-2">
                      <button
                        id={`btn-toggle-abn-${biz.id}`}
                        onClick={() => setSelectedBizForAbnOverride(biz)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-amber-800 rounded-lg border border-slate-200 font-medium shadow-xs hover:border-amber-300 transition-colors"
                      >
                        Override ABN
                      </button>
                      <button
                        id={`btn-upgrade-tier-${biz.id}`}
                        onClick={() => setSelectedBizForTierChange(biz)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-50 text-sky-800 rounded-lg border border-slate-200 font-medium shadow-xs hover:border-sky-300 transition-colors"
                      >
                        Change Tier
                      </button>
                    </div>
                    <span className="font-mono text-slate-600 font-semibold">
                      {formatCurrency(biz.subscription.monthlyPriceCents / 100)}/mo
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 10: CATEGORY & RADIUS RULES */}
        {activeAdminTab === 'category_rules' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-heading font-bold text-slate-900">
                Category Taxonomy &amp; Geofence Broadcast Steps
              </h3>
              <p className="text-xs text-slate-500">
                Standardized radius tiers and conversion benchmarks enforced across the platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-sky-600" />
                  Geofence Radius Step Options
                </h4>
                <p className="text-slate-600">
                  Business owners choose from standardized distance tiers to target high-intent foot traffic:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    '50m (Ultra Hyper-Local / In-Mall)', 
                    '200m (Immediate Walk-in)', 
                    '500m (Neighborhood CBD)', 
                    '1,000m (Sub-Suburb 1km)', 
                    '3,000m (Metro Area 3km)', 
                    '5,000m (Max Expansion 5km)'
                  ].map((r, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-800 rounded-lg font-mono font-medium shadow-xs">
                      {r}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-amber-600" />
                  Active Category Conversion Benchmarks
                </h4>
                <p className="text-slate-600">
                  Target conversion baselines across core commercial verticals:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Café & Specialty Coffee', benchmark: '17.2%' },
                    { name: 'Restaurants & Dining', benchmark: '14.8%' },
                    { name: 'Retail & Designer Fashion', benchmark: '11.5%' },
                    { name: 'Beauty & Wellness Spa', benchmark: '18.6%' },
                    { name: 'Entertainment & Events', benchmark: '13.0%' },
                    { name: 'Automotive & Services', benchmark: '9.4%' },
                  ].map((c, i) => (
                    <div key={i} className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="font-semibold text-slate-800 block">{c.name}</span>
                      <span className="text-[10px] text-sky-700 font-mono font-medium">Target Conv: {c.benchmark}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 11: AUDIT LOGS */}
        {activeAdminTab === 'audit_logs' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-heading font-bold text-slate-900">
                Platform Security &amp; Activity Audit Trail
              </h3>
              <p className="text-xs text-slate-500">
                Compliance event log capturing administrator actions, tier changes, and verification overrides
              </p>
            </div>

            <div className="space-y-3">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`w-2 h-2 rounded-full ${
                        log.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}></span>
                      <span className="font-bold text-slate-800">{log.action}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600 font-medium">
                        {log.targetEntity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-slate-600">{log.details}</p>
                  </div>

                  <div className="text-right text-[11px] font-mono text-slate-500 shrink-0">
                    <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                    <div className="text-slate-600">{log.adminEmail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

          </main>
        </div>

      </div>

      {/* Deal Funnel Inspection Modal */}
      {selectedDealForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Deal Funnel &amp; Performance Telemetry
              </h3>
              <button 
                onClick={() => setSelectedDealForModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <div className="font-bold text-sm text-slate-900">{selectedDealForModal.title}</div>
              <div className="text-slate-500">{selectedDealForModal.businessName} • Radius: {selectedDealForModal.radiusMeters}m</div>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Dispatched Alerts:</span>
                <span className="text-sm font-bold text-slate-900">{selectedDealForModal.metrics.dispatchedCount}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Delivered to Device:</span>
                <span className="text-sm font-bold text-emerald-700">{selectedDealForModal.metrics.deliveredCount}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">Deal Card Views:</span>
                <span className="text-sm font-bold text-sky-700">{selectedDealForModal.metrics.viewsCount}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 block text-[10px]">In-Store Redemptions:</span>
                <span className="text-sm font-bold text-amber-700">{selectedDealForModal.currentRedemptionsCount}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
              <span className="font-bold block mb-1">Conversion Rate: {selectedDealForModal.metrics.conversionRate}%</span>
              <span className="text-[11px] text-slate-600">
                Average duration from notification receipt to in-store QR redemption: {selectedDealForModal.metrics.avgTimeToRedeemMinutes} minutes.
              </span>
            </div>

            <button
              onClick={() => setSelectedDealForModal(null)}
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-xs transition-colors"
            >
              Close Performance View
            </button>
          </div>
        </div>
      )}

      {/* Admin Create Deal Modal */}
      <CreateDealModal
        isOpen={adminCreateDealOpen}
        onClose={() => setAdminCreateDealOpen(false)}
        business={businesses[0]}
      />

      {/* Admin Edit Deal Modal */}
      <EditDealModal
        deal={adminEditDeal}
        isOpen={!!adminEditDeal}
        onClose={() => setAdminEditDeal(null)}
      />

      {/* Admin PostGIS Geofence Radar Inspector */}
      <DealGeofenceMapModal
        deal={adminRadarDeal}
        isOpen={!!adminRadarDeal}
        onClose={() => setAdminRadarDeal(null)}
      />

      {/* Admin Override ABN Form Modal */}
      {selectedBizForAbnOverride && (
        <OverrideAbnModal
          business={selectedBizForAbnOverride}
          isOpen={!!selectedBizForAbnOverride}
          onClose={() => setSelectedBizForAbnOverride(null)}
        />
      )}

      {/* Admin Change Tier & Financial Settlement Modal */}
      {selectedBizForTierChange && (
        <ChangeSubscriptionTierModal
          business={selectedBizForTierChange}
          isOpen={!!selectedBizForTierChange}
          onClose={() => setSelectedBizForTierChange(null)}
        />
      )}

    </div>
  );
};
