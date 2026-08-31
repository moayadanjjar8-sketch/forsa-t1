import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SubscriptionPlanConfig, BusinessProfile, SubscriptionTier, SubscriptionPaymentRecord } from '../../types';
import { 
  CreditCard, 
  Check, 
  DollarSign, 
  TrendingUp, 
  Building2, 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle,
  Clock,
  ArrowRight,
  Zap,
  ExternalLink,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import { EditPlanModal } from './EditPlanModal';
import { CreatePlanModal } from './CreatePlanModal';
import { ChangeSubscriptionTierModal } from './ChangeSubscriptionTierModal';

export const SubscriptionPlansTab: React.FC = () => {
  const { 
    subscriptionPlans, 
    subscriptionPayments,
    businesses, 
    activeCurrency, 
    formatCurrency, 
    updateSubscriptionPlan, 
    createSubscriptionPlan, 
    deleteSubscriptionPlan 
  } = useApp();

  const [activeSubView, setActiveSubView] = useState<'tiers' | 'subscribers' | 'settlements'>('tiers');
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlanConfig | null>(null);
  const [isCreatePlanModalOpen, setIsCreatePlanModalOpen] = useState(false);
  const [selectedBusinessForChange, setSelectedBusinessForChange] = useState<BusinessProfile | null>(null);

  // MRR and ARR math
  const totalMrrCents = useMemo(() => {
    return businesses.reduce((acc, b) => 
      acc + (b.subscription.status === 'active' ? b.subscription.monthlyPriceCents : 0), 0
    );
  }, [businesses]);

  const totalArrCents = totalMrrCents * 12;
  const activeSubscribersCount = businesses.filter(b => b.subscription.status === 'active').length;
  const arpuCents = activeSubscribersCount > 0 ? Math.round(totalMrrCents / activeSubscribersCount) : 0;

  // Total collected money
  const totalCollectedCents = useMemo(() => {
    return subscriptionPayments.reduce((acc, p) => p.status === 'paid' ? acc + p.amountCents : acc, 0);
  }, [subscriptionPayments]);

  // Subscriber count per plan
  const subscriberCountByTier = useMemo(() => {
    const counts: Record<string, number> = {};
    businesses.forEach(b => {
      const tier = b.subscription.tier;
      counts[tier] = (counts[tier] || 0) + 1;
    });
    return counts;
  }, [businesses]);

  return (
    <div id="admin-subscription-plans-tab" className="space-y-6">
      
      {/* Top Financial Stat Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Monthly Recurring Revenue (MRR)</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {formatCurrency(totalMrrCents)}
          </div>
          <span className="text-[11px] text-emerald-700 font-bold block mt-1">
            +18.4% MoM organic growth
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Annualized Run Rate (ARR)</span>
            <TrendingUp className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {formatCurrency(totalArrCents)}
          </div>
          <span className="text-[11px] text-slate-500 font-mono block mt-1">
            Contracted &amp; projected ARR
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Active Subscribers</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-900 font-mono">
            {activeSubscribersCount} / {businesses.length}
          </div>
          <span className="text-[11px] text-slate-500 font-mono block mt-1">
            100% active paid accounts
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider font-mono">Settled Collections</span>
            <Receipt className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-extrabold text-purple-900 font-mono">
            {formatCurrency(totalCollectedCents)}
          </div>
          <span className="text-[11px] text-slate-500 font-mono block mt-1">
            {subscriptionPayments.length} recorded payments
          </span>
        </div>

      </div>

      {/* Sub-View Switcher & Add Plan Button */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 flex-wrap gap-1">
          <button
            id="sub-view-tiers-btn"
            onClick={() => setActiveSubView('tiers')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubView === 'tiers'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Plan Tiers Catalogue ({subscriptionPlans.length})
          </button>
          <button
            id="sub-view-subscribers-btn"
            onClick={() => setActiveSubView('subscribers')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubView === 'subscribers'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Business Subscribers ({businesses.length})
          </button>
          <button
            id="sub-view-settlements-btn"
            onClick={() => setActiveSubView('settlements')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubView === 'settlements'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Settlement &amp; Payment Ledger ({subscriptionPayments.length})
          </button>
        </div>

        {activeSubView === 'tiers' && (
          <button
            id="admin-create-plan-tier-btn"
            onClick={() => setIsCreatePlanModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Plan Tier</span>
          </button>
        )}

      </div>

      {/* VIEW 1: Plan Tiers Catalogue */}
      {activeSubView === 'tiers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {subscriptionPlans.map(plan => {
            const subscribers = subscriberCountByTier[plan.tierKey] || 0;
            const isPopular = plan.popular;
            const displayMonthly = formatCurrency(plan.priceMonthlyAud * 100);
            const displayAnnual = formatCurrency(plan.priceAnnualAud * 100);

            return (
              <div
                key={plan.id}
                className={`relative bg-white rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                  isPopular
                    ? 'border-2 border-amber-500 shadow-md ring-4 ring-amber-500/10'
                    : 'border-slate-200 shadow-xs'
                }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-3 inset-x-0 flex justify-center">
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-3 py-0.5 rounded-full shadow-2xs font-mono">
                      MOST POPULAR TIER
                    </span>
                  </div>
                )}

                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-heading">{plan.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{plan.description}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold font-mono">
                      {subscribers} {subscribers === 1 ? 'Subscriber' : 'Subscribers'}
                    </span>
                  </div>

                  {/* Pricing Display */}
                  <div className="my-4 p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-slate-900 font-mono">
                        {displayMonthly}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">/ month (AUD)</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 font-mono">
                      Or {displayAnnual} billed annually (Save ~20%)
                    </div>
                  </div>

                  {/* Platform Resource Allocations */}
                  <div className="space-y-2 mb-6">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Platform Quotas
                    </div>
                    
                    <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100">
                      <span className="text-slate-600">Storefront Locations:</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {plan.maxBranches === 99 ? 'Unlimited' : `${plan.maxBranches} Branch`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100">
                      <span className="text-slate-600">Active Deals Concurrency:</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {plan.maxActiveDeals === 99 ? 'Unlimited' : `${plan.maxActiveDeals} Deals`}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100">
                      <span className="text-slate-600">Geofence Broadcast Radius:</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {(plan.geofenceRadiusMeters / 1000).toFixed(0)} km Max
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs py-1 border-b border-slate-100">
                      <span className="text-slate-600">AI Deal Suggestions:</span>
                      <span className={`font-bold font-mono ${plan.hasAiSuggestions ? 'text-emerald-700' : 'text-slate-400'}`}>
                        {plan.hasAiSuggestions ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs py-1">
                      <span className="text-slate-600">Geofence Priority Queue:</span>
                      <span className={`font-bold font-mono ${plan.hasPriorityGeofence ? 'text-amber-700' : 'text-slate-400'}`}>
                        {plan.hasPriorityGeofence ? 'Priority Low-Latency' : 'Standard Queue'}
                      </span>
                    </div>
                  </div>

                  {/* Features Bullet List */}
                  <div className="space-y-2 mb-6">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                      Included Capabilities
                    </div>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setEditingPlan(plan)}
                    className="flex-1 py-2 px-3 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Plan Config</span>
                  </button>
                  
                  {plan.tierKey !== 'starter' && plan.tierKey !== 'growth' && plan.tierKey !== 'enterprise' && (
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${plan.name}"?`)) {
                          deleteSubscriptionPlan(plan.id);
                        }
                      }}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200 hover:border-rose-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: Active Business Subscribers Table */}
      {activeSubView === 'subscribers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Active Business Owner Plan Allocations &amp; Stripe Customers
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Live Stripe Billing Sync
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-mono">
                <tr>
                  <th className="py-3 px-4 text-start font-bold uppercase">Business Owner</th>
                  <th className="py-3 px-4 text-start font-bold uppercase">ABN &amp; Legal Name</th>
                  <th className="py-3 px-4 text-start font-bold uppercase">Current Tier</th>
                  <th className="py-3 px-4 text-start font-bold uppercase">Billing Cycle</th>
                  <th className="py-3 px-4 text-start font-bold uppercase">Monthly Price</th>
                  <th className="py-3 px-4 text-start font-bold uppercase">Stripe Customer</th>
                  <th className="py-3 px-4 text-end font-bold uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {businesses.map(biz => {
                  const sub = biz.subscription;
                  const formattedMonthly = formatCurrency(sub.monthlyPriceCents);

                  return (
                    <tr key={biz.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Merchant Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={biz.logoUrl} 
                            alt={biz.businessName} 
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{biz.businessName}</span>
                            <span className="text-[10px] text-slate-500 font-medium capitalize">{biz.category.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </td>

                      {/* ABN & Legal */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <span className="font-bold text-amber-900 block">{biz.abn}</span>
                        <span className="text-[10px] text-slate-500">{biz.legalTradingName}</span>
                      </td>

                      {/* Tier Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase font-mono ${
                          sub.tier === 'enterprise' 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : sub.tier === 'growth'
                            ? 'bg-sky-100 text-sky-900 border border-sky-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}>
                          {sub.tier}
                        </span>
                      </td>

                      {/* Billing Cycle */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <span className="capitalize font-medium text-slate-800">{sub.billingCycle}</span>
                        <span className="text-[10px] text-slate-400 block">
                          Next: {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                        </span>
                      </td>

                      {/* Monthly Price */}
                      <td className="py-3.5 px-4 font-mono text-xs font-extrabold text-slate-900">
                        {formattedMonthly}
                      </td>

                      {/* Stripe Customer */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        <span>{sub.stripeCustomerId}</span>
                        <span className="text-[10px] text-slate-400 block">{sub.stripeSubscriptionId}</span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-end">
                        <button
                          onClick={() => setSelectedBusinessForChange(biz)}
                          className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 rounded-xl transition-all"
                        >
                          Change Tier &amp; Settle
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: Payment Settlement & Financial Ledger */}
      {activeSubView === 'settlements' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Subscription Financial Settlement &amp; Money Received Ledger
              </h3>
              <p className="text-xs text-slate-500">
                Live transactional log of cash, EFT, POS, and Stripe tier migration payments
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold font-mono">
              Total Settled: {formatCurrency(totalCollectedCents)}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 font-mono">
                <tr>
                  <th className="py-3 px-4 text-start font-bold uppercase">Receipt Ref</th>
                  <th className="py-3 px-4 text-start font-bold uppercase">Business Owner</th>
                  <th className="py-3 px-4 text-start font-bold uppercase">Plan Tier</th>
                  <th className="py-3 px-4 text-start font-bold uppercase">Payment Rail</th>
                  <th className="py-3 px-4 text-start font-bold uppercase">Amount Settled</th>
                  <th className="py-3 px-4 text-start font-bold uppercase">Status</th>
                  <th className="py-3 px-4 text-start font-bold uppercase">Audited By Admin</th>
                  <th className="py-3 px-4 text-end font-bold uppercase">Date &amp; Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscriptionPayments.map(p => {
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {p.referenceNumber}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {p.businessName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="uppercase font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                          {p.tier} ({p.billingCycle})
                        </span>
                      </td>
                      <td className="py-3.5 px-4 capitalize text-slate-600 font-medium">
                        {p.paymentMethod.replace('_', ' ')}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-extrabold text-emerald-700">
                        {formatCurrency(p.amountCents)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          p.status === 'paid' 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : p.status === 'waived'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {p.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {p.recordedByAdminEmail}
                      </td>
                      <td className="py-3.5 px-4 text-end font-mono text-[11px] text-slate-400">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Change Subscription & Financial Settlement Modal */}
      {selectedBusinessForChange && (
        <ChangeSubscriptionTierModal
          business={selectedBusinessForChange}
          isOpen={!!selectedBusinessForChange}
          onClose={() => setSelectedBusinessForChange(null)}
        />
      )}

      {/* Edit Plan Modal */}
      {editingPlan && (
        <EditPlanModal
          plan={editingPlan}
          isOpen={true}
          onClose={() => setEditingPlan(null)}
          onSave={updateSubscriptionPlan}
        />
      )}

      {/* Create Plan Modal */}
      <CreatePlanModal
        isOpen={isCreatePlanModalOpen}
        onClose={() => setIsCreatePlanModalOpen(false)}
        onCreate={createSubscriptionPlan}
      />

    </div>
  );
};
