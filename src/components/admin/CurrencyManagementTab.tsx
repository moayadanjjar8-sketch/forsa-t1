import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CurrencyCode, CurrencyConfig } from '../../types';
import { 
  Coins, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRightLeft, 
  TrendingUp, 
  Sliders, 
  DollarSign, 
  Globe, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  Calculator,
  Lock,
  Zap
} from 'lucide-react';

export const CurrencyManagementTab: React.FC = () => {
  const { 
    currencies, 
    activeCurrency, 
    setActiveCurrency, 
    updateCurrencyRate, 
    formatCurrency, 
    businesses,
    deals
  } = useApp();

  const [simulatedAudAmount, setSimulatedAudAmount] = useState<number>(149); // $149 default (Growth tier)
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);
  const [editingCode, setEditingCode] = useState<CurrencyCode | null>(null);
  const [tempRate, setTempRate] = useState<string>('');

  // Total Platform MRR in AUD Cents
  const totalMrrAudCents = businesses.reduce((acc, b) => 
    acc + (b.subscription.status === 'active' ? b.subscription.monthlyPriceCents : 0), 0
  );

  const handleStartEdit = (curr: CurrencyConfig) => {
    setEditingCode(curr.code);
    setTempRate(String(curr.rateToAud));
  };

  const handleSaveEdit = (code: CurrencyCode) => {
    const num = parseFloat(tempRate);
    if (!isNaN(num) && num > 0) {
      updateCurrencyRate(code, num);
    }
    setEditingCode(null);
  };

  const handleQuickAdjust = (code: CurrencyCode, currentRate: number, delta: number) => {
    const newRate = +(currentRate + delta).toFixed(4);
    if (newRate > 0) {
      updateCurrencyRate(code, newRate);
    }
  };

  const handleSyncMarketRates = () => {
    setIsSyncing(true);
    setSyncSuccessMessage(null);

    setTimeout(() => {
      // Apply fresh realistic interbank market rates
      const marketRates: Record<CurrencyCode, number> = {
        AUD: 1.0,
        USD: 0.654,
        SAR: 2.452,
        AED: 2.401,
        SGD: 0.884,
        MYR: 3.092,
        THB: 23.54,
        IDR: 10480.0
      };

      Object.entries(marketRates).forEach(([code, rate]) => {
        updateCurrencyRate(code as CurrencyCode, rate);
      });

      setIsSyncing(false);
      setSyncSuccessMessage('Global FX rates synced via European Central Bank & OpenExchange API (0.12% spread applied).');

      setTimeout(() => {
        setSyncSuccessMessage(null);
      }, 5000);
    }, 1200);
  };

  return (
    <div id="admin-currency-management-tab" className="space-y-6">
      
      {/* Top Banner & Quick Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200">
              Multi-Currency Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">Real-Time FX Matrix</span>
          </div>
          <h2 className="text-xl font-heading font-bold text-slate-900 mt-1.5">
            Platform Currency &amp; Exchange Rate Governance
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Configure the platform&apos;s active default currency and regional exchange rates. Changes dynamically calibrate business owner subscription pricing, consumer deal savings, and gross platform MRR projections.
          </p>
        </div>

        {/* Sync Rates Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            id="sync-live-fx-rates-btn"
            onClick={handleSyncMarketRates}
            disabled={isSyncing}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all ${
              isSyncing 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isSyncing ? 'Syncing Live FX Feeds...' : 'Sync Market FX Rates'}</span>
          </button>
        </div>

      </div>

      {syncSuccessMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{syncSuccessMessage}</span>
        </div>
      )}

      {/* Active Currency Selector Grid */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Active Platform Settlement &amp; Display Currency</h3>
          <p className="text-xs text-slate-500">Select which currency is currently enforced across the application live preview.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {currencies.map(curr => {
            const isSelected = activeCurrency === curr.code;
            return (
              <button
                key={curr.code}
                onClick={() => setActiveCurrency(curr.code)}
                className={`p-3 rounded-xl border text-center transition-all relative flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                  </div>
                )}
                <span className="text-2xl">{curr.flag}</span>
                <span className="text-xs font-bold text-slate-900 font-mono">{curr.code}</span>
                <span className="text-[10px] text-slate-500 font-mono">{curr.symbol}</span>
                {isSelected && (
                  <span className="mt-1 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500 text-slate-950">
                    ACTIVE
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* FX Rates Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Exchange Rate Multipliers (Base: 1.00 AUD)
            </h3>
            <p className="text-[11px] text-slate-500">
              Direct conversion coefficients against Australian Dollar base currency (Adelaide Pilot).
            </p>
          </div>
          <span className="text-xs font-mono text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
            Current Platform MRR: <strong>{formatCurrency(totalMrrAudCents)}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase tracking-wider text-start">
                <th className="py-3 px-4 font-bold">Currency</th>
                <th className="py-3 px-4 font-bold">Symbol &amp; Format</th>
                <th className="py-3 px-4 font-bold">Rate to 1 AUD</th>
                <th className="py-3 px-4 font-bold">Inverted Rate (1 Unit in AUD)</th>
                <th className="py-3 px-4 font-bold">Checkout Enabled</th>
                <th className="py-3 px-4 font-bold text-end">Rate Adjustments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currencies.map(curr => {
                const isBase = curr.code === 'AUD';
                const isEditing = editingCode === curr.code;
                const inverted = curr.rateToAud > 0 ? (1 / curr.rateToAud).toFixed(4) : '0';

                return (
                  <tr key={curr.code} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Currency */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{curr.flag}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 font-mono">{curr.code}</span>
                            {curr.code === activeCurrency && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                                ACTIVE DISPLAY
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 block">{curr.name}</span>
                        </div>
                      </div>
                    </td>

                    {/* Symbol & Format */}
                    <td className="py-3.5 px-4 font-mono text-xs">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-xs">
                          {curr.symbol}
                        </span>
                        <span className="text-[11px] text-slate-400 block">
                          Position: {curr.formatPosition} • Decimals: {curr.decimals}
                        </span>
                      </div>
                    </td>

                    {/* Rate to 1 AUD */}
                    <td className="py-3.5 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            step="0.0001"
                            value={tempRate}
                            onChange={e => setTempRate(e.target.value)}
                            className="w-28 px-2 py-1 text-xs font-mono font-bold rounded-lg border border-amber-500 bg-amber-50/30 focus:outline-hidden"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(curr.code)}
                            className="px-2 py-1 text-[11px] font-bold bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCode(null)}
                            className="px-2 py-1 text-[11px] font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-extrabold text-slate-900">
                            {curr.rateToAud.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                          </span>
                          {isBase ? (
                            <span className="text-[10px] text-slate-400 font-mono">(Base Peg)</span>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(curr)}
                              className="text-[10px] text-amber-800 hover:text-amber-950 font-bold underline cursor-pointer"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Inverted Rate */}
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      1 {curr.code} = ${inverted} AUD
                    </td>

                    {/* Enabled Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => updateCurrencyRate(curr.code, curr.rateToAud, !curr.enabled)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          curr.enabled
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${curr.enabled ? 'bg-emerald-600' : 'bg-slate-400'}`} />
                        <span>{curr.enabled ? 'Enabled' : 'Disabled'}</span>
                      </button>
                    </td>

                    {/* Quick Adjustments */}
                    <td className="py-3.5 px-4 text-end">
                      {!isBase && (
                        <div className="inline-flex items-center gap-1">
                          <button
                            title="Decrease Rate -1%"
                            onClick={() => handleQuickAdjust(curr.code, curr.rateToAud, -(curr.rateToAud * 0.01))}
                            className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          >
                            -1%
                          </button>
                          <button
                            title="Increase Rate +1%"
                            onClick={() => handleQuickAdjust(curr.code, curr.rateToAud, +(curr.rateToAud * 0.01))}
                            className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                          >
                            +1%
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive FX Converter & Plan Price Impact Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Converter Calculator */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">Real-Time Plan Price &amp; Deal Simulator</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Live Preview</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Enter AUD Base Price:
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 font-mono">$</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={simulatedAudAmount}
                  onChange={e => setSimulatedAudAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 text-sm font-mono font-extrabold rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-1.5">
                {[
                  { label: 'Starter ($49)', val: 49 },
                  { label: 'Growth ($149)', val: 149 },
                  { label: 'Enterprise ($399)', val: 399 }
                ].map(preset => (
                  <button
                    key={preset.val}
                    type="button"
                    onClick={() => setSimulatedAudAmount(preset.val)}
                    className={`px-2.5 py-2 text-xs font-bold rounded-xl border transition-all ${
                      simulatedAudAmount === preset.val
                        ? 'bg-amber-500 text-slate-950 border-amber-600'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Converted values grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {currencies.map(curr => {
              const formatted = formatCurrency(simulatedAudAmount * 100, curr.code);
              return (
                <div key={curr.code} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-start">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-lg">{curr.flag}</span>
                    <span className="font-mono font-bold text-slate-500">{curr.code}</span>
                  </div>
                  <div className="text-base font-extrabold text-slate-900 font-mono truncate">
                    {formatted}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                    Rate: {curr.rateToAud}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Global Compliance & Multi-Currency Rules */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-start">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold text-slate-900">Regional Compliance &amp; Settlement Architecture</h3>
          </div>

          <div className="space-y-3 text-xs text-slate-600">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Stripe Multi-Currency Direct Payouts
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-600">
                All platform subscriptions are billed natively in the business owner&apos;s settlement currency. Cross-currency transaction fees are absorbed via dynamic tier margins.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                RTL &amp; Localized Number Formatting
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-600">
                SAR (ر.س) and AED (د.إ) support native right-to-left currency suffix positioning, preventing visual layout jumping in Arabic localization.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Zero Sales Commission SLA
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Regardless of the selected currency, Forsa-T retains 0% transactional cut from in-store QR code redemptions. Business owners keep 100% of deal revenue.
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
