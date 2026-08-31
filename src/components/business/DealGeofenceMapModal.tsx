import React from 'react';
import { useApp } from '../../context/AppContext';
import { InteractiveGeofenceMap } from './InteractiveGeofenceMap';
import { 
  X, 
  MapPin, 
  Clock, 
  Radio, 
  QrCode, 
  Users, 
  Eye, 
  CheckCircle2, 
  TrendingUp, 
  Share2,
  DollarSign,
  Activity,
  Layers
} from 'lucide-react';
import { Deal } from '../../types';

interface DealGeofenceMapModalProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onRedeemTest?: () => void;
}

export const DealGeofenceMapModal: React.FC<DealGeofenceMapModalProps> = ({
  deal,
  isOpen,
  onClose,
  onRedeemTest
}) => {
  const { formatCurrency, redeemDealWithQr } = useApp();

  if (!isOpen || !deal) return null;

  const handleQuickRedeem = () => {
    if (onRedeemTest) {
      onRedeemTest();
    } else {
      redeemDealWithQr(deal.id, 'Walk-in Test Shopper');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-heading font-bold text-slate-900">
                  {deal.title}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  deal.status === 'active' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {deal.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {deal.businessName} • Radius: {deal.radiusMeters}m • Seed: {deal.qrCodeSeed}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Main Map & Live Radar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-600" />
                Live PostGIS Geofence Perimeter ({deal.radiusMeters}m)
              </span>
              <span className="text-xs font-mono text-slate-500">
                Lat: {deal.location?.lat.toFixed(4)}, Lng: {deal.location?.lng.toFixed(4)}
              </span>
            </div>

            <InteractiveGeofenceMap
              centerLat={deal.location?.lat || -34.9285}
              centerLng={deal.location?.lng || 138.6007}
              radiusMeters={deal.radiusMeters}
              branchName={deal.businessName}
              address={deal.location?.address || 'Adelaide CBD'}
              heightClass="h-72"
              interactive={false}
            />
          </div>

          {/* Conversion Funnel Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center space-y-1">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Dispatched</span>
              <div className="text-base font-extrabold text-slate-900 font-mono">
                {deal.metrics.dispatchedCount.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">matched devices</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center space-y-1">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Delivered</span>
              <div className="text-base font-extrabold text-emerald-700 font-mono">
                {deal.metrics.deliveredCount.toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">&lt;60s SLA</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center space-y-1">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">Views / Taps</span>
              <div className="text-base font-extrabold text-sky-700 font-mono">
                {deal.metrics.viewsCount.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">in-app cards</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center space-y-1">
              <span className="text-[10px] text-slate-500 font-semibold uppercase block">QR Scans</span>
              <div className="text-base font-extrabold text-amber-700 font-mono">
                {deal.metrics.qrScansCount.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">at register</span>
            </div>

            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-center space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-emerald-800 font-bold uppercase block">Redeemed</span>
              <div className="text-base font-extrabold text-emerald-900 font-mono">
                {deal.currentRedemptionsCount}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold">
                {deal.metrics.conversionRate}% conv
              </span>
            </div>

          </div>

          {/* QR Code & In-Store Redemption Box */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <QrCode className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-slate-100">Point of Sale QR Verification Seed</h3>
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                Customers present this encrypted QR barcode at checkout. The cashier scans or enters the code to apply the {deal.discountPercentage}% discount.
              </p>
              <div className="font-mono text-amber-300 font-bold text-sm bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 inline-block">
                {deal.qrCodeSeed}
              </div>
            </div>

            {/* Quick Test Redeem Button for POS simulation */}
            <button
              onClick={handleQuickRedeem}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-lg transition-transform active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Simulate In-Store Redemption
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
