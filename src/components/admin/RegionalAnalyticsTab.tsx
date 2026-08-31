import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  TrendingUp, 
  Users, 
  Building2, 
  Zap, 
  DollarSign, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Compass, 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  Layers,
  ChevronRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface SuburbRegionData {
  id: string;
  name: string;
  stateOrCountry: string;
  zoneType: 'cbd' | 'coastal' | 'inner_metro' | 'suburban' | 'tech_corridor' | 'international';
  activeConsumers: number;
  registeredMerchants: number;
  liveDealsCount: number;
  monthlyRedemptions: number;
  conversionRate: number;
  monthlyVolumeCents: number;
  avgRadiusMeters: number;
  topCategory: string;
  peakHours: string;
  footTrafficIndex: 'High' | 'Very High' | 'Moderate' | 'Growing';
  growthRate: number;
}

export const RegionalAnalyticsTab: React.FC = () => {
  const { deals, businesses, allUsers, activeCurrency, formatCurrency } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('all');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('adelaide_cbd');

  // Comprehensive Region Data
  const regions: SuburbRegionData[] = useMemo(() => [
    {
      id: 'adelaide_cbd',
      name: 'Adelaide CBD & Rundle Mall',
      stateOrCountry: 'South Australia',
      zoneType: 'cbd',
      activeConsumers: 1840,
      registeredMerchants: businesses.filter(b => b.branches?.some(br => (br.address || br.branchName || '').toLowerCase().includes('adelaide') || (br.address || br.branchName || '').toLowerCase().includes('cbd'))).length || 8,
      liveDealsCount: deals.filter(d => (d.location?.suburb || d.location?.address || '').toLowerCase().includes('adelaide') || (d.location?.suburb || d.location?.address || '').toLowerCase().includes('cbd')).length || 6,
      monthlyRedemptions: 642,
      conversionRate: 19.4,
      monthlyVolumeCents: 489000,
      avgRadiusMeters: 550,
      topCategory: 'Café & Specialty Dining',
      peakHours: '11:30 AM – 2:30 PM & 5:00 PM – 8:00 PM',
      footTrafficIndex: 'Very High',
      growthRate: 28.5
    },
    {
      id: 'north_adelaide',
      name: 'North Adelaide & O\'Connell St',
      stateOrCountry: 'South Australia',
      zoneType: 'inner_metro',
      activeConsumers: 890,
      registeredMerchants: 4,
      liveDealsCount: 3,
      monthlyRedemptions: 284,
      conversionRate: 16.8,
      monthlyVolumeCents: 215000,
      avgRadiusMeters: 750,
      topCategory: 'Boutique Dining & Bakeries',
      peakHours: '8:00 AM – 11:30 AM & 6:00 PM – 9:00 PM',
      footTrafficIndex: 'High',
      growthRate: 18.2
    },
    {
      id: 'glenelg_beach',
      name: 'Glenelg Beach & Jetty Road',
      stateOrCountry: 'South Australia',
      zoneType: 'coastal',
      activeConsumers: 1250,
      registeredMerchants: businesses.filter(b => b.branches?.some(br => (br.address || br.branchName || '').toLowerCase().includes('glenelg'))).length || 3,
      liveDealsCount: deals.filter(d => (d.location?.suburb || d.location?.address || '').toLowerCase().includes('glenelg')).length || 2,
      monthlyRedemptions: 495,
      conversionRate: 21.2,
      monthlyVolumeCents: 378000,
      avgRadiusMeters: 900,
      topCategory: 'Seafood, Bars & Leisure',
      peakHours: '12:00 PM – 4:00 PM & 6:30 PM – 9:30 PM',
      footTrafficIndex: 'Very High',
      growthRate: 34.1
    },
    {
      id: 'norwood_parade',
      name: 'Norwood Parade & East End',
      stateOrCountry: 'South Australia',
      zoneType: 'inner_metro',
      activeConsumers: 920,
      registeredMerchants: businesses.filter(b => b.branches?.some(br => (br.address || br.branchName || '').toLowerCase().includes('norwood'))).length || 3,
      liveDealsCount: deals.filter(d => (d.location?.suburb || d.location?.address || '').toLowerCase().includes('norwood')).length || 3,
      monthlyRedemptions: 310,
      conversionRate: 17.5,
      monthlyVolumeCents: 245000,
      avgRadiusMeters: 650,
      topCategory: 'Fashion, Coffee & Homeware',
      peakHours: '10:00 AM – 3:00 PM',
      footTrafficIndex: 'High',
      growthRate: 15.8
    },
    {
      id: 'prospect_road',
      name: 'Prospect & Churchill Corridor',
      stateOrCountry: 'South Australia',
      zoneType: 'suburban',
      activeConsumers: 640,
      registeredMerchants: 2,
      liveDealsCount: 2,
      monthlyRedemptions: 178,
      conversionRate: 14.9,
      monthlyVolumeCents: 132000,
      avgRadiusMeters: 1200,
      topCategory: 'Artisan Eateries & Wellness',
      peakHours: '5:30 PM – 8:30 PM',
      footTrafficIndex: 'Moderate',
      growthRate: 22.0
    },
    {
      id: 'mawson_lakes',
      name: 'Mawson Lakes & Tech Precinct',
      stateOrCountry: 'South Australia',
      zoneType: 'tech_corridor',
      activeConsumers: 780,
      registeredMerchants: 3,
      liveDealsCount: 2,
      monthlyRedemptions: 240,
      conversionRate: 18.0,
      monthlyVolumeCents: 185000,
      avgRadiusMeters: 1000,
      topCategory: 'Fast-Casual & Coffee',
      peakHours: '8:00 AM – 10:00 AM & 12:00 PM – 2:00 PM',
      footTrafficIndex: 'High',
      growthRate: 19.4
    },
    {
      id: 'riyadh_olaya',
      name: 'Riyadh Al-Olaya & KAFD',
      stateOrCountry: 'Saudi Arabia (Global)',
      zoneType: 'international',
      activeConsumers: 2100,
      registeredMerchants: 5,
      liveDealsCount: 4,
      monthlyRedemptions: 812,
      conversionRate: 23.5,
      monthlyVolumeCents: 920000,
      avgRadiusMeters: 800,
      topCategory: 'Luxury Dining & Specialty Cafés',
      peakHours: '7:00 PM – 12:00 AM',
      footTrafficIndex: 'Very High',
      growthRate: 45.2
    },
    {
      id: 'dubai_marina',
      name: 'Dubai Marina & JBR',
      stateOrCountry: 'United Arab Emirates (Global)',
      zoneType: 'international',
      activeConsumers: 1750,
      registeredMerchants: 4,
      liveDealsCount: 3,
      monthlyRedemptions: 690,
      conversionRate: 22.1,
      monthlyVolumeCents: 810000,
      avgRadiusMeters: 850,
      topCategory: 'Hospitality & Retail',
      peakHours: '6:00 PM – 11:30 PM',
      footTrafficIndex: 'Very High',
      growthRate: 38.0
    }
  ], [businesses, deals]);

  // Aggregate stats
  const totals = useMemo(() => {
    const totalShoppers = regions.reduce((sum, r) => sum + r.activeConsumers, 0);
    const totalVolume = regions.reduce((sum, r) => sum + r.monthlyVolumeCents, 0);
    const totalRedemptions = regions.reduce((sum, r) => sum + r.monthlyRedemptions, 0);
    const avgConversion = (regions.reduce((sum, r) => sum + r.conversionRate, 0) / regions.length).toFixed(1);
    return { totalShoppers, totalVolume, totalRedemptions, avgConversion };
  }, [regions]);

  const filteredRegions = useMemo(() => {
    return regions.filter(region => {
      const matchesSearch = 
        region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        region.stateOrCountry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        region.topCategory.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesZone = 
        selectedZoneFilter === 'all' ? true :
        selectedZoneFilter === 'australia' ? region.stateOrCountry.includes('Australia') :
        selectedZoneFilter === 'international' ? region.zoneType === 'international' :
        region.zoneType === selectedZoneFilter;

      return matchesSearch && matchesZone;
    });
  }, [regions, searchQuery, selectedZoneFilter]);

  const activeRegion = regions.find(r => r.id === selectedRegionId) || regions[0];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200/80">
                Geographic Intelligence
              </span>
              <span className="text-xs text-slate-500 font-medium">South Australia &amp; Global Hubs</span>
            </div>
            <h2 className="text-xl font-heading font-bold text-slate-900 mt-1">
              Regional Performance &amp; Location Analytics
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor foot-traffic density, local business owner clusters, and coupon redemption conversion by suburb
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600">Active Settlement Currency:</span>
            <span className="px-3 py-1.5 bg-slate-100 rounded-xl text-xs font-mono font-bold text-slate-900 border border-slate-200">
              {activeCurrency}
            </span>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Regional Shoppers</span>
              <Users className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
              {totals.totalShoppers.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> Across {regions.length} tracked zones
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Monthly Deal Volume</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
              {formatCurrency(totals.totalVolume / 100)}
            </div>
            <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +26.4% avg monthly growth
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Total Redemptions</span>
              <Zap className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mt-1 font-mono">
              {totals.totalRedemptions.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-600 font-medium mt-1 block">
              In-store counter QR scans
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Avg Conversion Rate</span>
              <BarChart3 className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-700 mt-1 font-mono">
              {totals.avgConversion}%
            </div>
            <span className="text-[11px] text-slate-600 font-medium mt-1 block">
              Push notification to store redemption
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Region Directory & Filter Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          
          {/* Controls: Search & Zone Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                id="search-regions-input"
                type="text"
                placeholder="Search suburb, city, or top category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-thin text-xs">
              {[
                { id: 'all', label: 'All Regions' },
                { id: 'australia', label: 'South Australia' },
                { id: 'cbd', label: 'CBD' },
                { id: 'coastal', label: 'Coastal' },
                { id: 'international', label: 'Global' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedZoneFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                    selectedZoneFilter === f.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Regional Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase font-mono text-[11px]">
                  <th className="pb-3 px-3">Region &amp; Suburb</th>
                  <th className="pb-3 px-3">Businesses</th>
                  <th className="pb-3 px-3">Live Deals</th>
                  <th className="pb-3 px-3">Conversion</th>
                  <th className="pb-3 px-3">Monthly Volume</th>
                  <th className="pb-3 px-3">Foot Traffic</th>
                  <th className="pb-3 px-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegions.map(region => {
                  const isSelected = region.id === selectedRegionId;
                  return (
                    <tr 
                      key={region.id}
                      onClick={() => setSelectedRegionId(region.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-sky-50/70 font-medium' : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? 'text-sky-600' : 'text-slate-400'}`} />
                          <div>
                            <div className="font-bold text-slate-900">{region.name}</div>
                            <div className="text-slate-500 text-[11px]">{region.stateOrCountry}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        {region.registeredMerchants} stores
                      </td>
                      <td className="py-3 px-3 font-mono text-amber-800 font-semibold">
                        {region.liveDealsCount} active
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-700 font-bold">
                        {region.conversionRate}%
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-900 font-semibold">
                        {formatCurrency(region.monthlyVolumeCents / 100)}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          region.footTrafficIndex === 'Very High' 
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                            : region.footTrafficIndex === 'High'
                            ? 'bg-sky-50 text-sky-800 border border-sky-200/80'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {region.footTrafficIndex}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          id={`btn-select-region-${region.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRegionId(region.id);
                          }}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            isSelected 
                              ? 'bg-sky-600 text-white border-sky-600' 
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredRegions.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs">
              No regions match your search criteria.
            </div>
          )}
        </div>

        {/* Right Col: Deep Dive on Selected Region */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">
                Zone Spotlight
              </span>
              <h3 className="text-base font-heading font-bold text-slate-900">
                {activeRegion.name}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-mono">
              +{activeRegion.growthRate}% MoM
            </span>
          </div>

          {/* Region Key Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 block text-[11px]">Active Shoppers</span>
              <span className="text-base font-bold text-slate-900 font-mono mt-0.5 block">
                {activeRegion.activeConsumers.toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 block text-[11px]">Avg Geofence Radius</span>
              <span className="text-base font-bold text-amber-800 font-mono mt-0.5 block">
                {activeRegion.avgRadiusMeters} meters
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 block text-[11px]">Monthly Redemptions</span>
              <span className="text-base font-bold text-emerald-700 font-mono mt-0.5 block">
                {activeRegion.monthlyRedemptions} scans
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-slate-500 block text-[11px]">Conversion Rate</span>
              <span className="text-base font-bold text-sky-700 font-mono mt-0.5 block">
                {activeRegion.conversionRate}%
              </span>
            </div>
          </div>

          {/* Qualitative Insights */}
          <div className="space-y-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <ShoppingBag className="w-4 h-4 text-amber-700" />
                Dominant Local Category
              </div>
              <p className="text-slate-900 font-medium">{activeRegion.topCategory}</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Clock className="w-4 h-4 text-sky-700" />
                Peak Foot-Traffic Window
              </div>
              <p className="text-slate-900 font-medium">{activeRegion.peakHours}</p>
            </div>
          </div>

          {/* Regional Recommendations */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <Sparkles className="w-4 h-4 text-amber-700" />
              Regional Growth Opportunity
            </div>
            <p className="text-slate-700 leading-relaxed">
              Based on the {activeRegion.conversionRate}% conversion rate in {activeRegion.name}, business owner flash drops targeting lunch hours (500m radius) achieve 2.4x higher ROI than wide broadcast radius.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
