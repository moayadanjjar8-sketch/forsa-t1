import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Radio, 
  MapPin, 
  Compass, 
  Navigation, 
  Layers, 
  Sparkles, 
  Store,
  ChevronRight,
  Flame
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Deal } from '../../types';
import { LeafletSatelliteMap } from '../common/LeafletSatelliteMap';

interface NativeMapRadarTabProps {
  onSelectDeal: (deal: Deal) => void;
}

export const NativeMapRadarTab: React.FC<NativeMapRadarTabProps> = ({
  onSelectDeal
}) => {
  const { deals, consumerSearchRadiusM, setConsumerSearchRadiusM, activeCurrency, language, t } = useApp();
  const [selectedPinDeal, setSelectedPinDeal] = useState<Deal | null>(deals[0] || null);

  const activeDeals = deals.filter(d => d.status === 'active');

  return (
    <div className="space-y-4 animate-in fade-in flex flex-col h-full">
      
      {/* Map Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="native">
            <Radio className="w-3 h-3 mr-1 text-amber-400 animate-pulse" />
            Satellite Live Radar
          </Badge>
          <span className="text-[11px] text-slate-500 font-mono">
            Adelaide CBD
          </span>
        </div>

        <span className="text-xs font-bold text-amber-800 font-mono">
          {consumerSearchRadiusM >= 1000 ? `${(consumerSearchRadiusM / 1000).toFixed(1)} km` : `${consumerSearchRadiusM}m`}
        </span>
      </div>

      {/* Interactive Leaflet Satellite Geofence Map Viewport */}
      <LeafletSatelliteMap
        centerLat={-34.9285}
        centerLng={138.6007}
        radiusMeters={consumerSearchRadiusM}
        onRadiusChange={setConsumerSearchRadiusM}
        deals={activeDeals}
        onSelectDeal={(deal) => {
          setSelectedPinDeal(deal);
          onSelectDeal(deal);
        }}
        selectedDealId={selectedPinDeal?.id}
        heightClass="h-72 sm:h-80"
        defaultTileMode="satellite_hybrid"
        showRadarSweep={true}
        showShopperGps={true}
        branchName="Adelaide Radar Hub"
      />

      {/* Radius Slider Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2 shadow-xs">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-amber-600" />
            <span>Adjust Spatial Geofence Range</span>
          </span>
          <span className="font-mono text-amber-800 font-bold">
            {consumerSearchRadiusM >= 1000 ? `${(consumerSearchRadiusM / 1000).toFixed(1)} km` : `${consumerSearchRadiusM}m`}
          </span>
        </div>
        <Slider
          value={consumerSearchRadiusM}
          min={50}
          max={5000}
          step={50}
          onValueChange={setConsumerSearchRadiusM}
        />
      </div>

      {/* Selected Deal Floating Preview Card */}
      {selectedPinDeal && (
        <div className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-xs flex items-center justify-between gap-3 text-left">
          <img
            src={selectedPinDeal.imageUrl}
            alt={selectedPinDeal.title}
            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-amber-700 uppercase">{selectedPinDeal.businessName}</span>
              <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded font-mono">
                {selectedPinDeal.discountPercentage}% OFF
              </span>
            </div>
            <h4 className="text-xs font-bold text-slate-900 truncate">
              {selectedPinDeal.title}
            </h4>
            <p className="text-[10px] text-slate-500 font-mono">
              Distance: {selectedPinDeal.radiusMeters}m away
            </p>
          </div>

          <Button
            size="sm"
            variant="default"
            onClick={() => onSelectDeal(selectedPinDeal)}
            className="rounded-xl shrink-0 text-xs px-3"
          >
            View
          </Button>
        </div>
      )}

    </div>
  );
};
