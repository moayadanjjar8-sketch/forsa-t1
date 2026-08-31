import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { 
  Radio, 
  Layers, 
  MapPin, 
  Navigation, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Compass, 
  Sparkles, 
  Users, 
  Check, 
  ShieldCheck, 
  Eye, 
  Sliders,
  Flame,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Deal } from '../../types';

export type MapTileMode = 'satellite' | 'satellite_hybrid' | 'dark_radar' | 'streets';

export interface LeafletSatelliteMapProps {
  centerLat?: number;
  centerLng?: number;
  radiusMeters?: number;
  onRadiusChange?: (newRadius: number) => void;
  onCenterChange?: (lat: number, lng: number) => void;
  interactive?: boolean;
  deals?: Deal[];
  onSelectDeal?: (deal: Deal) => void;
  selectedDealId?: string;
  heightClass?: string;
  showRadarSweep?: boolean;
  defaultTileMode?: MapTileMode;
  showControls?: boolean;
  showShopperGps?: boolean;
  userLat?: number;
  userLng?: number;
  branchName?: string;
  address?: string;
  className?: string;
}

export const LeafletSatelliteMap: React.FC<LeafletSatelliteMapProps> = ({
  centerLat = -34.9285,
  centerLng = 138.6007,
  radiusMeters = 500,
  onRadiusChange,
  onCenterChange,
  interactive = true,
  deals = [],
  onSelectDeal,
  selectedDealId,
  heightClass = 'h-80',
  showRadarSweep = true,
  defaultTileMode = 'satellite_hybrid',
  showControls = true,
  showShopperGps = true,
  userLat = -34.9295,
  userLng = 138.6015,
  branchName = 'Store Branch Geofence',
  address = 'Adelaide CBD, South Australia',
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const overlayTileLayerRef = useRef<L.TileLayer | null>(null);
  const circleLayerRef = useRef<L.Circle | null>(null);
  const pulseCircleLayerRef = useRef<L.Circle | null>(null);
  const centerMarkerRef = useRef<L.Marker | null>(null);
  const userGpsMarkerRef = useRef<L.Marker | null>(null);
  const dealsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeTileMode, setActiveTileMode] = useState<MapTileMode>(defaultTileMode);
  const [isRadarActive, setIsRadarActive] = useState<boolean>(showRadarSweep);
  const [currentRadius, setCurrentRadius] = useState<number>(radiusMeters);
  const [activeCoords, setActiveCoords] = useState<{ lat: number; lng: number }>({ lat: centerLat, lng: centerLng });

  // Sync radius state when prop changes
  useEffect(() => {
    setCurrentRadius(radiusMeters);
  }, [radiusMeters]);

  // Sync coords when props change
  useEffect(() => {
    setActiveCoords({ lat: centerLat, lng: centerLng });
  }, [centerLat, centerLng]);

  // Estimated population in geofence
  const estimatedShoppers = useMemo(() => {
    const baseDensityPer100m = 8.2;
    const areaFactor = Math.PI * Math.pow(currentRadius / 100, 1.35);
    const count = Math.max(18, Math.round(areaFactor * baseDensityPer100m));
    return Math.min(count, 5200);
  }, [currentRadius]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix default Leaflet icon paths in bundler
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    });

    // Create Map
    const map = L.map(mapContainerRef.current, {
      center: [activeCoords.lat, activeCoords.lng],
      zoom: currentRadius > 2000 ? 14 : currentRadius > 1000 ? 15 : 16,
      zoomControl: false,
      attributionControl: false,
      dragging: interactive,
      touchZoom: interactive,
      scrollWheelZoom: interactive ? 'center' : false,
      doubleClickZoom: interactive
    });

    mapInstanceRef.current = map;

    // Create Layer Groups
    dealsLayerGroupRef.current = L.layerGroup().addTo(map);

    // Click handler on map to change center if interactive
    if (interactive && onCenterChange) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setActiveCoords({ lat, lng });
        onCenterChange(lat, lng);
      });
    }

    // Resize observer for seamless resizing
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base & Overlay Tile Layers when activeTileMode changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layers
    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
      baseTileLayerRef.current = null;
    }
    if (overlayTileLayerRef.current) {
      map.removeLayer(overlayTileLayerRef.current);
      overlayTileLayerRef.current = null;
    }

    if (activeTileMode === 'satellite') {
      // High-resolution Esri World Imagery (pure satellite photography)
      baseTileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: 'Esri, Maxar, Earthstar Geographics'
        }
      ).addTo(map);
    } else if (activeTileMode === 'satellite_hybrid') {
      // Satellite Base Layer
      baseTileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: 'Esri, Maxar, Earthstar Geographics'
        }
      ).addTo(map);

      // Boundaries & City/Street Reference Labels Overlay
      overlayTileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          pane: 'overlayPane'
        }
      ).addTo(map);
    } else if (activeTileMode === 'dark_radar') {
      // Carto Dark Matter (Night Radar Mode)
      baseTileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd',
          attribution: 'CartoDB'
        }
      ).addTo(map);
    } else {
      // Carto Voyager Streets (Clean Street View)
      baseTileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd',
          attribution: 'CartoDB'
        }
      ).addTo(map);
    }
  }, [activeTileMode]);

  // Update Geofence Circle & Center Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Center pulsing ring & fill
    if (circleLayerRef.current) {
      circleLayerRef.current.setLatLng([activeCoords.lat, activeCoords.lng]);
      circleLayerRef.current.setRadius(currentRadius);
    } else {
      circleLayerRef.current = L.circle([activeCoords.lat, activeCoords.lng], {
        radius: currentRadius,
        color: '#f59e0b',
        weight: 2.5,
        opacity: 0.9,
        fillColor: '#f59e0b',
        fillOpacity: 0.18,
        dashArray: '6, 6'
      }).addTo(map);
    }

    // 2. Pulse visual circle
    if (pulseCircleLayerRef.current) {
      pulseCircleLayerRef.current.setLatLng([activeCoords.lat, activeCoords.lng]);
      pulseCircleLayerRef.current.setRadius(Math.max(20, currentRadius * 0.45));
    } else {
      pulseCircleLayerRef.current = L.circle([activeCoords.lat, activeCoords.lng], {
        radius: Math.max(20, currentRadius * 0.45),
        color: '#fbbf24',
        weight: 1,
        opacity: 0.6,
        fillColor: '#fbbf24',
        fillOpacity: 0.08
      }).addTo(map);
    }

    // 3. Center Store/Branch Marker
    const storeIconHtml = `
      <div class="relative flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2">
        <div class="w-10 h-10 rounded-full bg-slate-950/90 border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-2xl ring-4 ring-amber-500/30">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div class="absolute -bottom-6 bg-slate-950/95 text-amber-300 border border-amber-500/40 text-[9px] font-mono px-2 py-0.5 rounded-md font-bold whitespace-nowrap shadow-md">
          ${branchName}
        </div>
      </div>
    `;

    const storeCustomIcon = L.divIcon({
      html: storeIconHtml,
      className: 'custom-store-pin',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    if (centerMarkerRef.current) {
      centerMarkerRef.current.setLatLng([activeCoords.lat, activeCoords.lng]);
      centerMarkerRef.current.setIcon(storeCustomIcon);
    } else {
      centerMarkerRef.current = L.marker([activeCoords.lat, activeCoords.lng], {
        icon: storeCustomIcon,
        draggable: interactive && Boolean(onCenterChange)
      }).addTo(map);

      if (interactive && onCenterChange) {
        centerMarkerRef.current.on('dragend', (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setActiveCoords({ lat: pos.lat, lng: pos.lng });
          onCenterChange(pos.lat, pos.lng);
        });
      }
    }
  }, [activeCoords, currentRadius, branchName, interactive, onCenterChange]);

  // Update Shopper GPS Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (showShopperGps) {
      const shopperGpsHtml = `
        <div class="relative flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2">
          <div class="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg border-2 border-white ring-4 ring-sky-400/40 animate-pulse">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="transform rotate-45">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
          </div>
          <div class="absolute -bottom-5 bg-sky-950/90 text-sky-200 border border-sky-400/40 text-[8px] font-mono px-1.5 py-0.2 rounded whitespace-nowrap shadow-xs">
            Live GPS (You)
          </div>
        </div>
      `;

      const gpsCustomIcon = L.divIcon({
        html: shopperGpsHtml,
        className: 'custom-gps-pin',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      if (userGpsMarkerRef.current) {
        userGpsMarkerRef.current.setLatLng([userLat, userLng]);
      } else {
        userGpsMarkerRef.current = L.marker([userLat, userLng], {
          icon: gpsCustomIcon
        }).addTo(map);
      }
    } else if (userGpsMarkerRef.current) {
      map.removeLayer(userGpsMarkerRef.current);
      userGpsMarkerRef.current = null;
    }
  }, [showShopperGps, userLat, userLng]);

  // Render Deal Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = dealsLayerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    deals.forEach((deal, idx) => {
      // Calculate realistic nearby coordinates if deal location not provided
      const dealLat = deal.branchLat || (activeCoords.lat + (idx % 2 === 0 ? 0.0025 * (idx + 1) : -0.0022 * (idx + 1)));
      const dealLng = deal.branchLng || (activeCoords.lng + (idx % 3 === 0 ? 0.003 * (idx + 1) : -0.0028 * (idx + 1)));
      const isSelected = selectedDealId === deal.id;

      const dealMarkerHtml = `
        <div class="relative flex flex-col items-center cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 active:scale-95 ${
          isSelected ? 'scale-115 z-30' : 'z-20'
        }">
          <div class="px-2 py-0.5 ${
            isSelected 
              ? 'bg-amber-400 text-slate-950 ring-2 ring-white font-black' 
              : deal.discountPercentage >= 40 
              ? 'bg-rose-500 text-white font-extrabold' 
              : 'bg-amber-500 text-slate-950 font-bold'
          } text-[10px] rounded-full shadow-lg border border-white/80 whitespace-nowrap">
            ${deal.discountPercentage}% OFF
          </div>
          <div class="w-8 h-8 rounded-full bg-slate-950 border-2 ${
            isSelected ? 'border-amber-400 ring-4 ring-amber-500/50' : 'border-white'
          } overflow-hidden shadow-xl mt-0.5">
            <img src="${deal.businessLogo || deal.imageUrl}" alt="${deal.businessName}" class="w-full h-full object-cover" />
          </div>
        </div>
      `;

      const dealIcon = L.divIcon({
        html: dealMarkerHtml,
        className: `custom-deal-pin-${deal.id}`,
        iconSize: [36, 42],
        iconAnchor: [18, 21]
      });

      const marker = L.marker([dealLat, dealLng], { icon: dealIcon });

      // Interactive Popup
      const popupHtml = `
        <div class="p-1 max-w-[220px] font-sans text-slate-900">
          <div class="flex items-center gap-1.5 mb-1">
            <span class="text-[10px] font-bold text-amber-800 uppercase tracking-wider">${deal.businessName}</span>
            <span class="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 text-[9px] font-bold">${deal.discountPercentage}% OFF</span>
          </div>
          <div class="text-xs font-bold text-slate-900 leading-tight mb-1">${deal.title}</div>
          <div class="text-[11px] text-slate-600 mb-2 line-clamp-2">${deal.description || ''}</div>
          <div class="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
            <span class="font-bold text-amber-800 font-mono">$${((deal.originalPriceCents * (1 - deal.discountPercentage/100))/100).toFixed(2)}</span>
            <span class="text-slate-500">${deal.distanceMeters ? `${deal.distanceMeters}m away` : 'Within Geofence'}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        className: 'custom-deal-leaflet-popup',
        closeButton: false,
        offset: [0, -16]
      });

      marker.on('click', () => {
        if (onSelectDeal) {
          onSelectDeal(deal);
        }
      });

      layerGroup.addLayer(marker);
    });
  }, [deals, selectedDealId, activeCoords, onSelectDeal]);

  // Recenter helper
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.setView([activeCoords.lat, activeCoords.lng], currentRadius > 2000 ? 14 : currentRadius > 1000 ? 15 : 16, {
      animate: true
    });
  };

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handlePresetRadius = (radius: number) => {
    setCurrentRadius(radius);
    if (onRadiusChange) {
      onRadiusChange(radius);
    }
  };

  return (
    <div className={`flex flex-col bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 text-slate-100 relative shadow-xl ${className}`}>
      
      {/* Top Map HUD Bar */}
      {showControls && (
        <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 z-10">
          
          {/* Status & Coordinates */}
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold font-mono text-emerald-400">
                Map
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700 hidden sm:inline">
                [{activeCoords.lat.toFixed(4)}, {activeCoords.lng.toFixed(4)}]
              </span>
            </div>
          </div>

          {/* Map Layer Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              id="map-mode-hybrid"
              onClick={() => setActiveTileMode('satellite_hybrid')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                activeTileMode === 'satellite_hybrid'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Esri Satellite Imagery with Street & City Names"
            >
              🛰️ Hybrid
            </button>

            <button
              type="button"
              id="map-mode-streets"
              onClick={() => setActiveTileMode('streets')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                activeTileMode === 'streets'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Clean Vector Streets"
            >
              🗺️ Streets
            </button>
          </div>

          {/* Shopper Density & Zoom Controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono font-bold text-amber-300">~{estimatedShoppers.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">in geofence</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleZoomIn}
                className="p-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="p-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleRecenter}
                className="p-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
                title="Recenter Map to Store"
              >
                <Compass className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Main Map Container */}
      <div className={`relative ${heightClass} w-full bg-slate-950 overflow-hidden`}>
        
        {/* Leaflet Map Div */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Animated Radar Sweep Overlay Beam (Optional) */}
        {isRadarActive && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden">
            <div 
              className="w-[420px] h-[420px] rounded-full border border-amber-400/20 animate-radar origin-center"
              style={{
                background: 'conic-gradient(from 0deg at 50% 50%, rgba(245, 158, 11, 0.25) 0deg, rgba(245, 158, 11, 0.05) 45deg, transparent 60deg, transparent 360deg)'
              }}
            />
          </div>
        )}

        {/* Floating Top-Left Status Pill */}
        <div className="absolute top-3 left-3 z-10 pointer-events-none flex flex-col gap-1.5">
          <span className="px-3 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md text-amber-300 text-[11px] font-mono border border-amber-500/40 flex items-center gap-2 shadow-lg">
            <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span> Geofence: <strong>{currentRadius >= 1000 ? `${(currentRadius / 1000).toFixed(1)} km` : `${currentRadius}m`}</strong></span>
          </span>
          <span className="px-2.5 py-0.5 rounded-lg bg-slate-950/75 backdrop-blur-xs text-slate-300 text-[10px] font-mono border border-slate-800">
            Push direct delivery
          </span>
        </div>

        {/* Floating Bottom-Right Radar Toggle & Compass */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsRadarActive(!isRadarActive)}
            className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1 backdrop-blur-md border transition-all ${
              isRadarActive 
                ? 'bg-amber-500/90 text-slate-950 border-amber-300 shadow-md' 
                : 'bg-slate-900/80 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>{isRadarActive ? 'Radar Sweep Active' : 'Radar Beam Off'}</span>
          </button>
        </div>

        {/* Instructions pill if interactive */}
        {interactive && onCenterChange && (
          <div className="absolute bottom-3 left-3 z-10 pointer-events-none hidden md:block">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-slate-400 text-[10px] border border-slate-800">
              💡 Drag center pin or click anywhere on satellite map to relocate geofence
            </span>
          </div>
        )}

      </div>

      {/* Bottom Radius Selector & Latency SLA Footer */}
      {interactive && onRadiusChange && (
        <div className="bg-slate-900/95 backdrop-blur-md px-4 py-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs z-10">
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Target Radius:</span>
            </span>
            <div className="flex items-center gap-1 flex-wrap">
              {[100, 250, 500, 1000, 2000, 5000].map(r => (
                <button
                  key={r}
                  type="button"
                  id={`btn-radius-preset-${r}`}
                  onClick={() => handlePresetRadius(r)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    currentRadius === r
                      ? 'bg-amber-500 text-slate-950 shadow-xs ring-1 ring-amber-300'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {r >= 1000 ? `${r/1000}km` : `${r}m`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 font-mono text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Active</span>
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
