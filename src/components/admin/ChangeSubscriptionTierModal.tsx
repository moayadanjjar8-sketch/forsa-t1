import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  X, 
  Building2, 
  DollarSign, 
  CheckCircle2, 
  ArrowRight, 
  Receipt, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Send,
  Coins,
  Check,
  AlertCircle
} from 'lucide-react';
import { BusinessProfile, SubscriptionTier, CurrencyCode } from '../../types';
import { useApp } from '../../context/AppContext';

interface ChangeSubscriptionTierModalProps {
  business: BusinessProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const ChangeSubscriptionTierModal: React.FC<ChangeSubscriptionTierModalProps> = ({
  business,
  isOpen,
  onClose
}) => {
  const { 
    subscriptionPlans, 
    updateBusinessSubscriptionWithPayment, 
    activeCurrency, 
    formatCurrency, 
    currentUser 
  } = useApp();

  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>(business.subscription.tier);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(business.subscription.billingCycle || 'monthly');
  
  // Financial Settlement / Receive Money States
  const [settlementMode, setSettlementMode] = useState<'receive_now' | 'stripe_charge' | 'invoice_due' | 'waive_fee'>('receive_now');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'stripe_card' | 'cash_pos' | 'direct_debit' | 'waived'>('bank_transfer');
  
  // Custom amount in active currency
  const targetPlan = subscriptionPlans.find(p => p.tierKey === selectedTier) || subscriptionPlans[0];
  const currentPriceAud = business.subscription.monthlyPriceCents / 100;
  const newPriceAud = billingCycle === 'annual' 
    ? (targetPlan.priceAnnualAud || targetPlan.priceMonthlyAud * 10) 
    : targetPlan.priceMonthlyAud;

  // Calculate difference or full fee
  const calculatedDifferenceAud = useMemo(() => {
    if (selectedTier === business.subscription.tier && billingCycle === business.subscription.billingCycle) {
      return 0;
    }
    const diff = newPriceAud - currentPriceAud;
    return diff > 0 ? diff : newPriceAud;
  }, [selectedTier, business.subscription.tier, billingCycle, business.subscription.billingCycle, newPriceAud, currentPriceAud]);

  const [customAmountAud, setCustomAmountAud] = useState<number>(calculatedDifferenceAud);
  const [referenceNumber, setReferenceNumber] = useState<string>(() => `REC-${Date.now().toString().slice(-6)}`);
  const [settlementNotes, setSettlementNotes] = useState<string>('');
  const [sendReceiptEmail, setSendReceiptEmail] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showSuccessReceipt, setShowSuccessReceipt] = useState<boolean>(false);

  // Update amount when plan or billing cycle changes
  React.useEffect(() => {
    if (settlementMode === 'waive_fee') {
      setCustomAmountAud(0);
    } else {
      setCustomAmountAud(calculatedDifferenceAud > 0 ? calculatedDifferenceAud : newPriceAud);
    }
  }, [selectedTier, billingCycle, settlementMode, calculatedDifferenceAud, newPriceAud]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const amountInCents = Math.round(customAmountAud * 100);

    setTimeout(() => {
      updateBusinessSubscriptionWithPayment({
        businessId: business.id,
        tier: selectedTier,
        billingCycle,
        payment: {
          amountCents: settlementMode === 'waive_fee' ? 0 : amountInCents,
          paymentMethod: settlementMode === 'waive_fee' ? 'waived' : paymentMethod,
          referenceNumber,
          settlementNotes: settlementNotes || `Admin tier migration to ${selectedTier.toUpperCase()} (${billingCycle}). Mode: ${settlementMode}`,
          sendReceiptEmail
        }
      });

      setIsProcessing(false);
      setShowSuccessReceipt(true);
    }, 600);
  };

  const handleDone = () => {
    setShowSuccessReceipt(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">
                Change Subscription Tier &amp; Financial Settlement
              </h3>
              <p className="text-xs text-slate-400">
                Plan Migration, Stripe Proration &amp; Admin Payment Receipt
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

        {showSuccessReceipt ? (
          /* Receipt Confirmation Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold font-heading text-slate-900">
                Payment Received &amp; Plan Updated Successfully!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Business owner account migrated to <span className="font-bold text-slate-800 uppercase">{selectedTier} Tier</span>.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left text-xs space-y-2.5 max-w-md mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-mono text-slate-500">Official Receipt #</span>
                <span className="font-mono font-bold text-slate-900">{referenceNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Business Owner Account:</span>
                <span className="font-bold text-slate-900">{business.businessName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">New Subscription Tier:</span>
                <span className="font-bold uppercase text-amber-800">{selectedTier} ({billingCycle})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Payment Collection Method:</span>
                <span className="font-semibold text-slate-800 capitalize">{paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-sm font-bold">
                <span className="text-slate-900">Amount Received &amp; Settled:</span>
                <span className="text-emerald-700 font-mono">
                  {formatCurrency(customAmountAud * 100)}
                </span>
              </div>
            </div>

            {sendReceiptEmail && (
              <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-sky-600" />
                <span>Automated PDF Tax Invoice and Receipt sent to business owner email.</span>
              </p>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={handleDone}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Done &amp; Close
              </button>
            </div>
          </div>
        ) : (
          /* Main Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
            
            {/* Current Status Bar */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img 
                  src={business.logoUrl} 
                  alt={business.businessName} 
                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-white"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{business.businessName}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-slate-500">Current Plan:</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800 uppercase">
                      {business.subscription.tier}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      ({formatCurrency(business.subscription.monthlyPriceCents)}/mo)
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block font-mono">Active Branches</span>
                <span className="text-xs font-bold text-slate-800">{business.branches.length} locations</span>
              </div>
            </div>

            {/* Step 1: Target Plan Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                1. Select New Subscription Tier
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  {
                    tier: 'starter' as SubscriptionTier,
                    name: 'Starter Tier',
                    price: 49,
                    desc: 'Single Branch • 5km Radius'
                  },
                  {
                    tier: 'growth' as SubscriptionTier,
                    name: 'Growth Tier',
                    price: 149,
                    desc: 'Up to 3 Branches • Priority Geofence'
                  },
                  {
                    tier: 'enterprise' as SubscriptionTier,
                    name: 'Enterprise',
                    price: 399,
                    desc: 'Unlimited Branches • Dedicated Queue'
                  }
                ].map(p => {
                  const isSelected = selectedTier === p.tier;
                  return (
                    <button
                      key={p.tier}
                      type="button"
                      onClick={() => setSelectedTier(p.tier)}
                      className={`p-3 rounded-xl border text-left transition-all relative ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-2 ring-amber-500/20' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                      <span className="font-bold text-xs text-slate-900 block">{p.name}</span>
                      <span className="text-sm font-extrabold text-amber-900 font-mono block mt-0.5">
                        ${p.price}<span className="text-[10px] text-slate-500 font-normal">/mo</span>
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-1 leading-tight">{p.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Billing Frequency */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                2. Billing Frequency
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    billingCycle === 'monthly'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>Monthly Billing</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('annual')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    billingCycle === 'annual'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>Annual Billing</span>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950">
                    SAVE 20%
                  </span>
                </button>
              </div>
            </div>

            {/* Step 3: Financial Settlement & Receive Money Module */}
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center">
                    <Coins className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">
                      3. Financial Settlement &amp; Receive Money
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      Collect payment, record receipt &amp; update platform ledger
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Calculated Due</span>
                  <span className="font-mono font-bold text-xs text-emerald-800">
                    {formatCurrency(calculatedDifferenceAud * 100)}
                  </span>
                </div>
              </div>

              {/* Settlement Mode Tabs */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Payment Collection Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { id: 'receive_now', label: '💰 Receive Now' },
                    { id: 'stripe_charge', label: '💳 Stripe Card' },
                    { id: 'invoice_due', label: '📄 Net-14 Invoice' },
                    { id: 'waive_fee', label: '🎁 Waive / $0' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSettlementMode(m.id as any)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all text-center ${
                        settlementMode === m.id
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {settlementMode !== 'waive_fee' && (
                <>
                  {/* Payment Method Rail & Amount Received */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Payment Rail / Method
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      >
                        <option value="bank_transfer">🏦 Direct Bank Transfer / PayID (EFT)</option>
                        <option value="cash_pos">💵 Cash / POS Terminal Collection</option>
                        <option value="stripe_card">💳 Credit/Debit Card (Stripe Terminal)</option>
                        <option value="direct_debit">📄 Direct Debit (BECS / AusPayNet)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Amount Received / Collected ({activeCurrency}) *</span>
                        <span className="text-[10px] text-slate-400 font-mono">Real-time settlement</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={customAmountAud}
                          onChange={(e) => setCustomAmountAud(parseFloat(e.target.value) || 0)}
                          className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono font-bold text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Transaction Ref & Notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Receipt / Transaction Reference #
                      </label>
                      <input
                        type="text"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        placeholder="e.g. REC-2026-89410"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Settlement Memo / Notes
                      </label>
                      <input
                        type="text"
                        value={settlementNotes}
                        onChange={(e) => setSettlementNotes(e.target.value)}
                        placeholder="e.g. Collected at office onboarding session"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Instant Receipt Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="sendReceiptEmail"
                  checked={sendReceiptEmail}
                  onChange={(e) => setSendReceiptEmail(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                />
                <label htmlFor="sendReceiptEmail" className="text-[11px] text-slate-700 cursor-pointer font-medium">
                  Issue and email official Tax Invoice &amp; Payment Receipt to business owner
                </label>
              </div>

            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-mono">
                Admin: {currentUser.email}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                >
                  {isProcessing ? (
                    <span>Processing Migration &amp; Payment...</span>
                  ) : (
                    <>
                      <Receipt className="w-4 h-4" />
                      <span>
                        {settlementMode === 'waive_fee' 
                          ? 'Apply Tier Change ($0.00)' 
                          : `Change Tier & Receive ${formatCurrency(customAmountAud * 100)}`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
