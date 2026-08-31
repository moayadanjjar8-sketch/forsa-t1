import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  QrCode, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Share2, 
  ShieldCheck, 
  Percent, 
  Download, 
  ExternalLink,
  ChevronRight,
  Flame,
  Check
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Deal } from '../../types';

interface NativeWalletTabProps {
  onSelectDeal: (deal: Deal) => void;
  onRedeem: (deal: Deal) => void;
}

export const NativeWalletTab: React.FC<NativeWalletTabProps> = ({
  onSelectDeal,
  onRedeem
}) => {
  const { deals, bookmarkedDealIds, formatCurrency, activeCurrency, language, t } = useApp();
  const [copiedSeed, setCopiedSeed] = useState<string | null>(null);

  // Claimed / Saved deals
  const savedDeals = deals.filter(d => bookmarkedDealIds.includes(d.id) || d.status === 'active').slice(0, 4);

  const handleCopySeed = (seed: string) => {
    navigator.clipboard.writeText(seed);
    setCopiedSeed(seed);
    setTimeout(() => setCopiedSeed(null), 2000);
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      
      {/* Wallet Header Banner */}
      <div className="bg-slate-950 text-white rounded-3xl p-4.5 border border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/20 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                {language === 'ar' ? 'المحفظة الذكية للقسائم' : 'Native Wallet Passbook'}
              </span>
            </div>
            <h3 className="text-base font-bold font-heading text-slate-100">
              {savedDeals.length} {language === 'ar' ? 'قسائم فورية جاهزة' : 'Active Pass Vouchers'}
            </h3>
          </div>
          <Badge variant="native">
            PKPass Ready
          </Badge>
        </div>
      </div>

      {/* Pass Cards List */}
      <div className="space-y-3">
        {savedDeals.map((deal, idx) => (
          <div
            key={deal.id}
            className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all text-left group"
          >
            {/* Top Pass Banner */}
            <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={deal.businessLogo || deal.imageUrl}
                  alt={deal.businessName}
                  className="w-7 h-7 rounded-lg object-cover border border-slate-700"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{deal.businessName}</h4>
                  <span className="text-[10px] text-slate-400">{deal.location?.suburb || 'Adelaide CBD'}</span>
                </div>
              </div>

              <div className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg text-xs font-extrabold font-mono">
                {deal.discountPercentage}% OFF
              </div>
            </div>

            {/* Cutout Notch Graphic (Authentic Pass feel) */}
            <div className="relative flex items-center justify-between px-4 py-1 bg-slate-50 border-y border-dashed border-slate-200">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                Voucher #{deal.id.slice(-6).toUpperCase()}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Verified Merchant
              </span>
            </div>

            {/* Pass Body */}
            <div className="p-4 space-y-3">
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-slate-900 leading-snug">
                  {deal.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {deal.termsAndConditions || 'Limit 1 per customer at store cashier.'}
                </p>
              </div>

              {/* Barcode & Code Seed */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-1 shadow-2xs">
                    <QrCode className="w-full h-full text-slate-900" />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Cashier Scan Seed</span>
                    <button
                      onClick={() => handleCopySeed(deal.qrCodeSeed)}
                      className="font-mono text-xs font-bold text-slate-900 hover:text-amber-600 transition-colors flex items-center gap-1"
                    >
                      <span>{deal.qrCodeSeed}</span>
                      {copiedSeed === deal.qrCodeSeed ? <Check className="w-3 h-3 text-emerald-600" /> : null}
                    </button>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="amber"
                  onClick={() => onRedeem(deal)}
                  className="rounded-xl px-3 py-1 text-xs shrink-0"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Redeem
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
