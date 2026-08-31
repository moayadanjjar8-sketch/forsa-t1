import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Smartphone, 
  Volume2, 
  Bell, 
  Battery, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  Vibrate, 
  Check, 
  Radio, 
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

interface NativeSettingsTabProps {
  platform: 'ios' | 'android';
  onPlatformChange: (p: 'ios' | 'android') => void;
  onTriggerTestPush: () => void;
}

export const NativeSettingsTab: React.FC<NativeSettingsTabProps> = ({
  platform,
  onPlatformChange,
  onTriggerTestPush
}) => {
  const { language, t } = useApp();

  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [backgroundGeofence, setBackgroundGeofence] = useState(true);
  const [pushSound, setPushSound] = useState(true);
  const [batterySavingMode, setBatterySavingMode] = useState(false);
  const [selectedMockLocation, setSelectedMockLocation] = useState('rundle_mall');
  const [vibrateTested, setVibrateTested] = useState(false);

  const mockLocations = [
    { id: 'rundle_mall', name: 'Rundle Mall Center (Adelaide)', coords: '-34.9228, 138.6041', dealsCount: 6 },
    { id: 'north_terrace', name: 'North Terrace & University', coords: '-34.9205, 138.6062', dealsCount: 4 },
    { id: 'central_market', name: 'Adelaide Central Market / Gouger St', coords: '-34.9304, 138.5997', dealsCount: 8 },
    { id: 'hindley_st', name: 'Hindley Street Dining & Arts', coords: '-34.9234, 138.5956', dealsCount: 5 },
    { id: 'glenelg_beach', name: 'Jetty Road, Glenelg Beach', coords: '-34.9806, 138.5144', dealsCount: 3 },
  ];

  const handleTestHaptics = () => {
    // Trigger navigator vibrate if available
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([60, 40, 60]);
      } catch (e) {}
    }
    setVibrateTested(true);
    setTimeout(() => setVibrateTested(false), 1500);
  };

  return (
    <div className="space-y-4 animate-in fade-in text-left">
      
      {/* Device Architecture Card */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-600" />
              <span>Native Platform Target</span>
            </CardTitle>
            <Badge variant="native">{platform.toUpperCase()} Human UI</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onPlatformChange('ios')}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                platform === 'ios'
                  ? 'bg-slate-900 text-white border-slate-800 shadow-xs font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="text-xs block">Apple iOS</span>
                <span className="text-[10px] text-slate-400">Cupertino SF Pro</span>
              </div>
              {platform === 'ios' && <Check className="w-4 h-4 text-amber-400" />}
            </button>

            <button
              onClick={() => onPlatformChange('android')}
              className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                platform === 'android'
                  ? 'bg-slate-900 text-white border-slate-800 shadow-xs font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="text-xs block">Google Android</span>
                <span className="text-[10px] text-slate-400">Material 3 Expressive</span>
              </div>
              {platform === 'android' && <Check className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Simulated Adelaide GPS Locations */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Simulate Adelaide GPS Pin</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-2">
          {mockLocations.map(loc => (
            <button
              key={loc.id}
              onClick={() => setSelectedMockLocation(loc.id)}
              className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                selectedMockLocation === loc.id
                  ? 'bg-amber-50/80 border-amber-300 text-slate-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div>
                <span className="text-xs block">{loc.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">{loc.coords}</span>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded-full font-semibold">
                {loc.dealsCount} deals
              </span>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Hardware Toggles (Haptics, Push, Background GPS) */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-sky-600" />
            <span>React Native Device Hardware</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-3">
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-900 block">expo-haptics Feedback</span>
              <span className="text-[10px] text-slate-500 block">Vibrate on claim and pass scan</span>
            </div>
            <Switch checked={hapticsEnabled} onCheckedChange={setHapticsEnabled} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-900 block">Background PostGIS Geofencing</span>
              <span className="text-[10px] text-slate-500 block">Wake app when walking within 100m</span>
            </div>
            <Switch checked={backgroundGeofence} onCheckedChange={setBackgroundGeofence} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-slate-900 block">Push Notification Audio Chime</span>
              <span className="text-[10px] text-slate-500 block">Play native radar discovery tone</span>
            </div>
            <Switch checked={pushSound} onCheckedChange={setPushSound} />
          </div>

          <div className="pt-2 flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleTestHaptics}
              className="w-full text-xs rounded-xl gap-1.5"
            >
              <Vibrate className="w-3.5 h-3.5 text-amber-600" />
              <span>{vibrateTested ? 'Haptic Triggered ✓' : 'Test Haptic Pulse'}</span>
            </Button>

            <Button
              size="sm"
              variant="amber"
              onClick={onTriggerTestPush}
              className="w-full text-xs rounded-xl gap-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-slate-950" />
              <span>Test Push Chime</span>
            </Button>
          </div>

        </CardContent>
      </Card>

    </div>
  );
};
