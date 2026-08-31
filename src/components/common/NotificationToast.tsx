import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, Clock, MapPin, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NotificationToast: React.FC = () => {
  const { activeLiveNotification, dismissLiveNotification, setViewMode, setMobileRole } = useApp();

  if (!activeLiveNotification) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="fixed top-20 right-6 z-50 max-w-md w-full bg-white/95 border border-slate-200 rounded-2xl p-4 shadow-xl backdrop-blur-xl text-slate-900"
      >
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-sky-50 text-sky-800 rounded-xl border border-sky-200 shrink-0">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                GEOFENCE PUSH DISPATCHED
              </span>
              <span className="text-[11px] font-mono text-slate-600 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 font-medium">
                <Clock className="w-3 h-3 text-emerald-600" />
                {(activeLiveNotification.latencyMs / 1000).toFixed(2)}s SLA
              </span>
            </div>

            <h4 className="text-sm font-bold text-slate-900 leading-tight mb-1">
              {activeLiveNotification.dealTitle}
            </h4>

            <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                {activeLiveNotification.targetRadiusM}m Radius
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-semibold">
                {activeLiveNotification.matchedUsersCount} local devices notified
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <button
                id="btn-toast-view-mobile"
                onClick={() => {
                  setViewMode('mobile');
                  setMobileRole('consumer');
                  dismissLiveNotification();
                }}
                className="text-xs font-semibold text-slate-900 hover:text-slate-700 flex items-center gap-1 transition-colors"
              >
                Open in Consumer App <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <button
            id="btn-toast-dismiss"
            onClick={dismissLiveNotification}
            className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
