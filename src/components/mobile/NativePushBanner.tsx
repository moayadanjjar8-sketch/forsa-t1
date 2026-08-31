import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, X, ChevronRight, Sparkles, MapPin } from 'lucide-react';
import { Deal } from '../../types';

interface NativePushBannerProps {
  deal: Deal | null;
  onDismiss: () => void;
  onOpen: (deal: Deal) => void;
  platform: 'ios' | 'android';
}

export const NativePushBanner: React.FC<NativePushBannerProps> = ({
  deal,
  onDismiss,
  onOpen,
  platform
}) => {
  if (!deal) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -60, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
        className="absolute top-2 left-3 right-3 z-50 cursor-pointer"
        onClick={() => onOpen(deal)}
      >
        <div className={`p-3 rounded-2xl shadow-xl border backdrop-blur-md flex items-center gap-3 transition-all ${
          platform === 'ios'
            ? 'bg-slate-900/90 text-white border-slate-700/80 shadow-slate-950/40'
            : 'bg-white/95 text-slate-900 border-slate-200/90 shadow-slate-400/30'
        }`}>
          
          {/* App Icon / Merchant Logo */}
          <div className="relative shrink-0">
            <img
              src={deal.businessLogo || deal.imageUrl}
              alt={deal.businessName}
              className="w-10 h-10 rounded-xl object-cover border border-slate-700"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[9px] font-bold">
              <Radio className="w-2.5 h-2.5 animate-ping" />
            </span>
          </div>

          {/* Notification Body */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                platform === 'ios' ? 'text-amber-400' : 'text-amber-700'
              }`}>
                FORSA-T Radar • Now ({deal.radiusMeters}m away)
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss();
                }}
                className="p-1 rounded-full text-slate-400 hover:text-slate-200"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            
            <p className="text-xs font-bold truncate">
              {deal.discountPercentage}% OFF: {deal.title}
            </p>
            <p className={`text-[11px] truncate ${
              platform === 'ios' ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Tap to view &amp; claim instant voucher at {deal.businessName}
            </p>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
