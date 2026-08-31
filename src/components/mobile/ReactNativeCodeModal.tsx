import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Code2, Layers, Smartphone, Sparkles } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface ReactNativeCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: string;
  role: 'consumer' | 'business';
  platform: 'ios' | 'android';
}

export const ReactNativeCodeModal: React.FC<ReactNativeCodeModalProps> = ({
  isOpen,
  onClose,
  currentTab,
  role,
  platform
}) => {
  const [activeSnippetTab, setActiveSnippetTab] = useState<'screen' | 'geofence' | 'shadcn_config'>('screen');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getScreenSnippet = () => {
    return `// App.tsx (React Native with shadcn-ui)
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Platform, StatusBar } from 'react-native';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useGeofenceRadar } from '@/hooks/useGeofenceRadar';
import { DealCardItem } from '@/components/DealCardItem';

export default function MobileDealScreen() {
  const [searchRadius, setSearchRadius] = useState(500);
  const { deals, nearbyCount, userLocation, isRadarScanning } = useGeofenceRadar({
    radiusMeters: searchRadius,
    enablePostGIS: true,
  });

  const handleClaimDeal = async (dealId: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Open React Native BottomSheet modal with QR Pass
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="${platform === 'ios' ? 'dark-content' : 'light-content'}" />
      
      {/* Geofence Radar Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Adelaide CBD Radar</Text>
        <Badge variant="native">
          {deals.length} Active Deals
        </Badge>
      </View>

      {/* shadcn Native Radius Slider */}
      <Card style={styles.sliderCard}>
        <Text style={styles.label}>PostGIS Geofence Perimeter: {searchRadius}m</Text>
        <Slider
          value={searchRadius}
          min={50}
          max={5000}
          step={50}
          onValueChange={setSearchRadius}
        />
      </Card>

      {/* Native Scrollable Deal Feed */}
      <ScrollView contentContainerStyle={styles.feedScroll}>
        {deals.map(deal => (
          <DealCardItem
            key={deal.id}
            deal={deal}
            onClaim={() => handleClaimDeal(deal.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  sliderCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    borderRadius: 20,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
    fontWeight: '600',
  },
  feedScroll: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 14,
  },
});`;
  };

  const getGeofenceSnippet = () => {
    return `// hooks/useGeofenceRadar.ts (Expo Location + PostGIS REST)
import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const GEOFENCE_TASK_NAME = 'FORSAT_CBD_GEOFENCE_MONITOR';

export function useGeofenceRadar({ radiusMeters = 500, enablePostGIS = true }) {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [deals, setDeals] = useState([]);
  const [isRadarScanning, setIsRadarScanning] = useState(true);

  useEffect(() => {
    let subscription: Location.LocationSubscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 10, // Update every 10 meters
        },
        async (location) => {
          setUserLocation(location);
          
          // Query backend spatial index:
          // ST_DWithin(store.geog, ST_MakePoint(lng, lat), radius)
          const response = await fetch('/api/geofence/nearby-deals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              radiusMeters,
            }),
          });
          const data = await response.json();
          setDeals(data.deals || []);
          setIsRadarScanning(false);
        }
      );
    })();

    return () => {
      subscription?.remove();
    };
  }, [radiusMeters]);

  return { deals, userLocation, isRadarScanning };
}`;
  };

  const getShadcnConfigSnippet = () => {
    return `// components.json & shadcn-native tailwind setup
// npm i tailwindcss-react-native clsx tailwind-merge
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "css": "global.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}`;
  };

  const activeCode = 
    activeSnippetTab === 'screen' ? getScreenSnippet() :
    activeSnippetTab === 'geofence' ? getGeofenceSnippet() :
    getShadcnConfigSnippet();

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-base text-slate-100">
                  React Native + shadcn Architecture
                </h3>
                <Badge variant="native">
                  {platform.toUpperCase()} Native
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                Native Expo TypeScript components styled with shadcn primitives
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtabs & Copy action */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSnippetTab('screen')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeSnippetTab === 'screen'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              MobileScreen.tsx
            </button>
            <button
              onClick={() => setActiveSnippetTab('geofence')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeSnippetTab === 'geofence'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              useGeofenceRadar.ts
            </button>
            <button
              onClick={() => setActiveSnippetTab('shadcn_config')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeSnippetTab === 'shadcn_config'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              shadcn-native.json
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 gap-1.5 text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Code'}</span>
          </Button>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-y-auto font-mono text-xs text-amber-200 bg-slate-950/90 leading-relaxed scrollbar-thin">
          <pre className="whitespace-pre overflow-x-auto">
            {activeCode}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Expo SDK 52 • React Native 0.76 • shadcn/ui React 19</span>
          <Button size="sm" variant="secondary" onClick={onClose}>
            Close Inspector
          </Button>
        </div>

      </div>
    </div>
  );
};
