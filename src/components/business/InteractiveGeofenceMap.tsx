import React from 'react';
import { LeafletSatelliteMap } from '../common/LeafletSatelliteMap';
import { Deal } from '../../types';

interface InteractiveGeofenceMapProps {
  centerLat?: number;
  centerLng?: number;
  radiusMeters: number;
  onRadiusChange?: (radius: number) => void;
  onCenterChange?: (lat: number, lng: number) => void;
  branchName?: string;
  address?: string;
  interactive?: boolean;
  heightClass?: string;
  showShopperDots?: boolean;
  deals?: Deal[];
  onSelectDeal?: (deal: Deal) => void;
  selectedDealId?: string;
}

export const InteractiveGeofenceMap: React.FC<InteractiveGeofenceMapProps> = ({
  centerLat = -34.9285,
  centerLng = 138.6007,
  radiusMeters,
  onRadiusChange,
  onCenterChange,
  branchName = 'Adelaide CBD Flagship',
  address = '88 King William Street, Adelaide SA',
  interactive = true,
  heightClass = 'h-72',
  showShopperDots = true,
  deals = [],
  onSelectDeal,
  selectedDealId
}) => {
  return (
    <LeafletSatelliteMap
      centerLat={centerLat}
      centerLng={centerLng}
      radiusMeters={radiusMeters}
      onRadiusChange={onRadiusChange}
      onCenterChange={onCenterChange}
      branchName={branchName}
      address={address}
      interactive={interactive}
      heightClass={heightClass}
      showShopperGps={showShopperDots}
      deals={deals}
      onSelectDeal={onSelectDeal}
      selectedDealId={selectedDealId}
      defaultTileMode="satellite_hybrid"
      showRadarSweep={true}
      showControls={true}
    />
  );
};
