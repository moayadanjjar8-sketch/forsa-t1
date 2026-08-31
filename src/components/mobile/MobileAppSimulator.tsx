import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';
import { 
  Smartphone, 
  MapPin, 
  Search, 
  Filter, 
  Heart, 
  QrCode, 
  Clock, 
  Sparkles, 
  PlusCircle, 
  CheckCircle, 
  X, 
  Share2, 
  Compass, 
  Flame, 
  Camera, 
  BarChart2, 
  TrendingUp, 
  ShieldCheck, 
  Check, 
  Building2, 
  Layers, 
  ChevronRight,
  Sliders,
  DollarSign,
  Fingerprint,
  Zap,
  Radio,
  Code2,
  Bell,
  Wallet,
  Settings,
  Store,
  CheckCircle2,
  Maximize2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Sheet } from '../ui/sheet';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { Separator } from '../ui/separator';
import { NativePushBanner } from './NativePushBanner';
import { ReactNativeCodeModal } from './ReactNativeCodeModal';
import { NativeWalletTab } from './NativeWalletTab';
import { NativeMapRadarTab } from './NativeMapRadarTab';
import { NativeSettingsTab } from './NativeSettingsTab';
import { Deal, DealCategory } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

export const MobileAppSimulator: React.FC = () => {
  const {
    deals,
    businesses,
    currentUser,
    mobileDeviceType,
    setMobileDeviceType,
    mobileRole,
    setMobileRole,
    consumerSearchRadiusM,
    setConsumerSearchRadiusM,
    selectedCategoryFilter,
    setSelectedCategoryFilter,
    followedBusinessIds,
    toggleFollowBusiness,
    bookmarkedDealIds,
    toggleBookmarkDeal,
    publishNewDeal,
    redeemDealWithQr,
    generateAiReportForDeal,
    aiReports,
    activeCurrency,
    switchRolePersona,
    language,
    t,
    isRtl
  } = useApp();

  // Active Native Bottom Tab: 'feed' | 'map' | 'wallet' | 'merchant' | 'settings'
  const [activeTab, setActiveTab] = useState<'feed' | 'map' | 'wallet' | 'merchant' | 'settings'>('feed');
  
  // Platform: 'ios' | 'android'
  const [nativePlatform, setNativePlatform] = useState<'ios' | 'android'>('ios');

  // React Native Code Inspector Modal
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // Active push notification banner state
  const [activePushDeal, setActivePushDeal] = useState<Deal | null>(null);

  // Bottom Sheet states
  const [selectedDealDetail, setSelectedDealDetail] = useState<Deal | null>(null);
  const [showQrModal, setShowQrModal] = useState<Deal | null>(null);
  const [showCreateDealModal, setShowCreateDealModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showAiReportModal, setShowAiReportModal] = useState<string | null>(null);
  const [redemptionSuccessDeal, setRedemptionSuccessDeal] = useState<Deal | null>(null);

  // Active Merchant in business view
  const currentBusiness = businesses[0]; // Amira's Artisan Café default

  // New deal form state
  const [newDealTitle, setNewDealTitle] = useState('');
  const [newDealDesc, setNewDealDesc] = useState('');
  const [newDealDiscount, setNewDealDiscount] = useState<number>(30);
  const [newDealRadius, setNewDealRadius] = useState<number>(500);
  const [newDealCategory, setNewDealCategory] = useState<DealCategory>('cafe_coffee');
  const [newDealDurationHrs, setNewDealDurationHrs] = useState<number>(2);
  const [newDealImage, setNewDealImage] = useState('https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80');

  // Filtered deals for consumer
  const activeConsumerDeals = deals.filter(deal => {
    if (deal.status !== 'active') return false;
    if (selectedCategoryFilter !== 'all' && deal.businessCategory !== selectedCategoryFilter) return false;
    if (deal.radiusMeters > consumerSearchRadiusM) return false;
    return true;
  });

  const playHapticAudio = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch (e) {}
  };

  const handleRedeemClick = (deal: Deal) => {
    playHapticAudio();
    const result = redeemDealWithQr(deal.id, currentUser.fullName);
    if (result.success) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      setRedemptionSuccessDeal(result.deal || deal);
      setShowQrModal(null);
      setSelectedDealDetail(null);
      setTimeout(() => {
        setRedemptionSuccessDeal(null);
      }, 4500);
    }
  };

  const handleTriggerPushDemo = () => {
    playHapticAudio();
    const targetDeal = deals[0];
    setActivePushDeal(targetDeal);
    setTimeout(() => {
      setActivePushDeal(null);
    }, 6000);
  };

  const handlePublishDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDealTitle) return;

    publishNewDeal({
      businessId: currentBusiness.id,
      businessName: currentBusiness.businessName,
      businessLogo: currentBusiness.logoUrl,
      businessCategory: newDealCategory,
      branchIds: [currentBusiness.branches[0].id],
      title: newDealTitle,
      description: newDealDesc || (language === 'ar' ? 'عرض فوري حصري ومحدود في أديلايد.' : 'Flash discount available now in Adelaide CBD.'),
      discountPercentage: Number(newDealDiscount),
      originalPriceCents: 1500,
      discountedPriceCents: Math.round(1500 * (1 - newDealDiscount / 100)),
      radiusMeters: Number(newDealRadius),
      imageUrl: newDealImage,
      termsAndConditions: language === 'ar' ? 'صالح لدى كاشير المتجر. قسيمة واحدة لكل عميل.' : 'Valid at store counter. Limit 1 redemption per customer.',
      expiryTimestamp: new Date(Date.now() + newDealDurationHrs * 60 * 60 * 1000).toISOString(),
      targetMaxRedemptions: 50,
      location: {
        lat: currentBusiness.branches[0].lat,
        lng: currentBusiness.branches[0].lng,
        address: currentBusiness.branches[0].address,
        suburb: 'Adelaide CBD'
      }
    });

    setShowCreateDealModal(false);
    setNewDealTitle('');
    setNewDealDesc('');
    setActiveTab('feed');
  };

  const categoriesList = [
    { id: 'all', label: t('mobileFilterAll') },
    { id: 'cafe_coffee', label: `☕ ${t('mobileFilterCafe')}` },
    { id: 'restaurant_dining', label: `🍽️ ${t('mobileFilterRestaurant')}` },
    { id: 'retail_fashion', label: `👗 ${t('mobileFilterRetail')}` },
    { id: 'beauty_wellness', label: `🌿 ${t('mobileFilterServices')}` }
  ];

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 text-slate-900 flex flex-col items-center">
      
      {/* Top Device & Platform Controls Bar */}
      <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
        
        {/* Native Platform & Device Selector */}
        <div className="flex flex-wrap items-center gap-2">
          
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setNativePlatform('ios')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                nativePlatform === 'ios' ? 'bg-slate-950 text-amber-400 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              React Native iOS
            </button>
            <button
              onClick={() => setNativePlatform('android')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                nativePlatform === 'android' ? 'bg-slate-950 text-amber-400 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              React Native Android
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200">
            <button
              id="btn-device-iphone"
              onClick={() => setMobileDeviceType('iphone')}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                mobileDeviceType === 'iphone' ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200' : 'text-slate-500'
              }`}
            >
              {t('deviceIphone')}
            </button>
            <button
              id="btn-device-pixel"
              onClick={() => setMobileDeviceType('pixel')}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                mobileDeviceType === 'pixel' ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200' : 'text-slate-500'
              }`}
            >
              {t('devicePixel')}
            </button>
            <button
              id="btn-device-pwa"
              onClick={() => setMobileDeviceType('pwa_fullscreen')}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                mobileDeviceType === 'pwa_fullscreen' ? 'bg-white text-slate-900 shadow-xs font-bold border border-slate-200' : 'text-slate-500'
              }`}
            >
              Full Screen
            </button>
          </div>

        </div>

        {/* Right Action: Code Inspector + Role Persona */}
        <div className="flex items-center gap-2">
          
          <Button
            size="sm"
            variant="native"
            onClick={() => setIsCodeModalOpen(true)}
            className="rounded-2xl gap-1.5 text-xs font-mono"
          >
            <Code2 className="w-4 h-4 text-amber-400" />
            <span>RN + shadcn Code</span>
          </Button>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              id="btn-mobile-role-consumer"
              onClick={() => {
                setMobileRole('consumer');
                switchRolePersona('consumer');
                setActiveTab('feed');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                mobileRole === 'consumer' 
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Shopper App
            </button>
            <button
              id="btn-mobile-role-business"
              onClick={() => {
                setMobileRole('business');
                switchRolePersona('business_growth');
                setActiveTab('merchant');
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                mobileRole === 'business' 
                  ? 'bg-amber-500 text-slate-950 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Merchant POS
            </button>
          </div>

        </div>

      </div>

      {/* Main Simulated Phone Canvas (React Native Platform Shell) */}
      <div 
        className={`transition-all duration-300 relative ${
          mobileDeviceType === 'pwa_fullscreen'
            ? 'w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-4 shadow-xl'
            : 'w-[380px] sm:w-[410px] h-[830px] bg-slate-950 border-[10px] border-slate-800 rounded-[52px] shadow-2xl overflow-hidden flex flex-col'
        }`}
      >
        
        {/* Native Push Notification Toast */}
        <NativePushBanner
          deal={activePushDeal}
          onDismiss={() => setActivePushDeal(null)}
          onOpen={(deal) => {
            setActivePushDeal(null);
            setSelectedDealDetail(deal);
          }}
          platform={nativePlatform}
        />

        {/* iPhone Dynamic Island / Pixel Camera Punch */}
        {mobileDeviceType === 'iphone' && (
          <div className="w-28 h-6 bg-black rounded-full mx-auto mt-2 mb-1 flex items-center justify-between px-3 z-30 shrink-0 border border-slate-800/80">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[9px] text-slate-300 font-mono font-bold tracking-wider">
              FORSA-T
            </span>
          </div>
        )}
        {mobileDeviceType === 'pixel' && (
          <div className="w-3.5 h-3.5 bg-black rounded-full mx-auto mt-2 mb-1 z-30 shrink-0 border border-slate-800"></div>
        )}

        {/* Native Mobile Status & Location Header */}
        <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between text-xs shrink-0 select-none">
          <div className="flex items-center gap-2">
            <BrandLogo variant="sub" size="sm" />
            <span className="font-bold text-slate-900 font-mono text-[11px] truncate max-w-[150px]">
              {mobileRole === 'consumer' 
                ? (language === 'ar' ? '📍 وسط أديلايد' : '📍 Adelaide CBD') 
                : (language === 'ar' ? "☕ مقهى أميرة" : "☕ Amira's Roastery")}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerPushDemo}
              className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-mono font-bold flex items-center gap-1"
              title="Test Geofence Push Notification"
            >
              <Bell className="w-2.5 h-2.5 text-amber-700" />
              <span>Simulate Ping</span>
            </button>
            <Badge variant="outline" className="text-[10px] font-mono">
              {mobileRole === 'consumer' ? `${consumerSearchRadiusM}m` : 'POS Ready'}
            </Badge>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NATIVE SCROLLABLE BODY AREA */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-none bg-slate-50 text-left">
          
          {/* TAB 1: RADAR FEED (Consumer) */}
          {activeTab === 'feed' && (
            <div className="space-y-4 animate-in fade-in">
              
              {/* Radius Slider Bar */}
              <div className="p-3.5 bg-white rounded-3xl border border-slate-200 space-y-2 shadow-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-slate-700 flex items-center gap-1.5 font-bold">
                    <Compass className="w-3.5 h-3.5 text-amber-600" />
                    <span>PostGIS Geofence Filter:</span>
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

              {/* Category Filter Pills (shadcn styled) */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                {categoriesList.map(cat => (
                  <button
                    key={cat.id}
                    id={`filter-cat-${cat.id}`}
                    onClick={() => setSelectedCategoryFilter(cat.id as any)}
                    className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === cat.id
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Live Deals List with shadcn Cards */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="font-medium">Active Nearby Deals</span>
                  <span className="text-emerald-700 font-mono font-bold">
                    {activeConsumerDeals.length} deals in perimeter
                  </span>
                </div>

                {activeConsumerDeals.map(deal => {
                  const isFollowed = followedBusinessIds.includes(deal.businessId);
                  const isBookmarked = bookmarkedDealIds.includes(deal.id);
                  
                  return (
                    <div
                      key={deal.id}
                      className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-slate-300 transition-all shadow-xs flex flex-col text-left group"
                    >
                      {/* Deal Image & Top Badges */}
                      <div className="relative h-36 w-full overflow-hidden">
                        <img 
                          src={deal.imageUrl} 
                          alt={deal.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        
                        {/* Discount Tag */}
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md font-mono">
                          {deal.discountPercentage}% OFF
                        </div>

                        {/* Distance pill */}
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-white/95 text-slate-900 text-[10px] rounded-full backdrop-blur-xs border border-slate-200 flex items-center gap-1 font-mono font-bold shadow-xs">
                          <MapPin className="w-3 h-3 text-sky-600" />
                          {deal.radiusMeters}m away
                        </div>

                        {/* Ending soon badge */}
                        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-rose-600 text-white text-[10px] rounded-full flex items-center gap-1 font-mono font-bold shadow-xs">
                          <Flame className="w-3 h-3 text-amber-300 animate-bounce" />
                          <span>Ending in 90 mins</span>
                        </div>
                      </div>

                      {/* Deal Body */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 text-[11px] font-semibold">{deal.businessName}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleFollowBusiness(deal.businessId); }}
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                              isFollowed 
                                ? 'bg-amber-50 text-amber-900 border border-amber-200' 
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {isFollowed ? 'Following ✓' : '+ Follow'}
                          </button>
                        </div>

                        <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">
                          {deal.title}
                        </h4>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <div>
                            <span className="text-slate-400 text-[10px] block font-medium">Deal Price:</span>
                            <span className="font-bold text-amber-800 font-mono text-sm">
                              ${deal.discountedPriceCents ? (deal.discountedPriceCents / 100).toFixed(2) : '7.70'} {activeCurrency}
                            </span>
                          </div>

                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => setSelectedDealDetail(deal)}
                            className="rounded-xl px-3 text-xs gap-1 shadow-xs"
                          >
                            <span>Claim Voucher</span>
                            <QrCode className="w-3.5 h-3.5 text-amber-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: INTERACTIVE MAP RADAR */}
          {activeTab === 'map' && (
            <NativeMapRadarTab
              onSelectDeal={(deal) => setSelectedDealDetail(deal)}
            />
          )}

          {/* TAB 3: WALLET PASSBOOK */}
          {activeTab === 'wallet' && (
            <NativeWalletTab
              onSelectDeal={(deal) => setSelectedDealDetail(deal)}
              onRedeem={(deal) => handleRedeemClick(deal)}
            />
          )}

          {/* TAB 4: MERCHANT HUB (Business View) */}
          {activeTab === 'merchant' && (
            <div className="space-y-4 animate-in fade-in">
              
              {/* Merchant Quick Actions Banner */}
              <div className="p-4 bg-white rounded-3xl border border-slate-200 space-y-3 shadow-xs text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-sm text-slate-900">
                      {t('merchantDashboardTitle')}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono">
                      ABN: 53 004 085 616 • Adelaide CBD
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="amber"
                    onClick={() => setShowCreateDealModal(true)}
                    className="rounded-xl text-xs font-bold gap-1 shrink-0"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>60s Deal</span>
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowScannerModal(true)}
                    className="rounded-xl text-xs gap-1.5 font-bold"
                  >
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Scan Customer QR</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const firstDeal = deals.find(d => d.businessId === currentBusiness.id) || deals[0];
                      generateAiReportForDeal(firstDeal.id);
                      setShowAiReportModal(firstDeal.id);
                    }}
                    className="rounded-xl text-xs gap-1.5 font-bold text-amber-900"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>AI Deal Coach</span>
                  </Button>
                </div>
              </div>

              {/* Merchant Deals List */}
              <div className="space-y-3 text-left">
                <span className="text-slate-500 text-[11px] font-bold block">
                  Active Store Campaigns ({deals.filter(d => d.businessId === currentBusiness.id).length})
                </span>

                {deals.filter(d => d.businessId === currentBusiness.id).map(deal => (
                  <div
                    key={deal.id}
                    className="bg-white border border-slate-200 rounded-3xl p-3.5 shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900 truncate max-w-[200px]">{deal.title}</h4>
                      <Badge variant="native">{deal.discountPercentage}% OFF</Badge>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span>Redeemed: {deal.currentRedemptions} / {deal.targetMaxRedemptions}</span>
                      <span className="text-emerald-700 font-bold">${((deal.discountedPriceCents || 800) * deal.currentRedemptions / 100).toFixed(0)} Revenue</span>
                    </div>

                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, (deal.currentRedemptions / (deal.targetMaxRedemptions || 50)) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: SETTINGS & HARDWARE */}
          {activeTab === 'settings' && (
            <NativeSettingsTab
              platform={nativePlatform}
              onPlatformChange={setNativePlatform}
              onTriggerTestPush={handleTriggerPushDemo}
            />
          )}

        </div>

        {/* ========================================================================= */}
        {/* NATIVE BOTTOM NAVIGATION BAR (shadcn styled) */}
        {/* ========================================================================= */}
        <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shrink-0 flex items-center justify-around z-20">
          
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'feed' ? 'text-amber-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span className="text-[10px]">Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'map' ? 'text-amber-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="text-[10px]">Map</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'wallet' ? 'text-amber-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span className="text-[10px]">Passes</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('merchant');
              setMobileRole('business');
            }}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'merchant' ? 'text-amber-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Store className="w-4 h-4" />
            <span className="text-[10px]">Merchant</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'settings' ? 'text-amber-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="text-[10px]">Settings</span>
          </button>

        </div>

        {/* Native Home Bar Indicator (iOS) */}
        {nativePlatform === 'ios' && (
          <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto my-1.5 shrink-0" />
        )}

      </div>

      {/* ========================================================================= */}
      {/* SHADCN BOTTOM SHEET: DEAL DETAIL & REDEMPTION PASS */}
      {/* ========================================================================= */}
      <Sheet
        open={!!selectedDealDetail}
        onOpenChange={(open) => !open && setSelectedDealDetail(null)}
        title={selectedDealDetail?.title}
        description={`Instant Voucher • ${selectedDealDetail?.businessName}`}
      >
        {selectedDealDetail && (
          <div className="space-y-4 text-left">
            <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-200">
              <img
                src={selectedDealDetail.imageUrl}
                alt={selectedDealDetail.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-md">
                {selectedDealDetail.discountPercentage}% OFF
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-600 leading-relaxed">
                {selectedDealDetail.description}
              </p>
              
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Terms &amp; Conditions</span>
                <p className="text-[11px] text-slate-600">
                  {selectedDealDetail.termsAndConditions}
                </p>
              </div>
            </div>

            {/* Apple / Google Pass Barcode Box */}
            <div className="bg-slate-950 text-white p-4 rounded-3xl border border-slate-800 space-y-3 text-center">
              <span className="text-[10px] text-amber-400 font-mono uppercase font-bold tracking-wider">
                Cashier Point-of-Sale Code
              </span>
              <div className="w-24 h-24 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center">
                <QrCode className="w-full h-full text-slate-950" />
              </div>
              <div className="font-mono text-sm font-bold text-slate-200">
                {selectedDealDetail.qrCodeSeed}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setSelectedDealDetail(null)}
                className="w-full rounded-2xl"
              >
                Close
              </Button>
              <Button
                variant="amber"
                onClick={() => handleRedeemClick(selectedDealDetail)}
                className="w-full rounded-2xl font-bold"
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                Redeem In Store
              </Button>
            </div>
          </div>
        )}
      </Sheet>

      {/* ========================================================================= */}
      {/* SHADCN BOTTOM SHEET: SCANNER MODAL */}
      {/* ========================================================================= */}
      <Sheet
        open={showScannerModal}
        onOpenChange={setShowScannerModal}
        title="Point of Sale QR Scanner"
        description="Scan customer wallet pass to apply instant discount"
      >
        <div className="space-y-4 text-center">
          <div className="w-full h-56 bg-slate-950 rounded-3xl border-2 border-dashed border-emerald-500/50 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="w-40 h-40 border-2 border-emerald-400 rounded-2xl relative flex items-center justify-center animate-pulse">
              <div className="w-full h-0.5 bg-emerald-400 absolute top-1/2 animate-bounce" />
            </div>
            <span className="text-xs text-emerald-400 font-mono mt-3">
              Align Customer QR Code inside frame
            </span>
          </div>

          <Button
            variant="amber"
            onClick={() => {
              setShowScannerModal(false);
              handleRedeemClick(deals[0]);
            }}
            className="w-full rounded-2xl font-bold"
          >
            Simulate Successful Cashier Scan
          </Button>
        </div>
      </Sheet>

      {/* ========================================================================= */}
      {/* SHADCN BOTTOM SHEET: CREATE 60s FLASH DEAL */}
      {/* ========================================================================= */}
      <Sheet
        open={showCreateDealModal}
        onOpenChange={setShowCreateDealModal}
        title="Broadcast Flash Deal"
        description="Publish a PostGIS geofence discount in 60 seconds"
      >
        <form onSubmit={handlePublishDealSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1">Deal Title</label>
            <input
              type="text"
              required
              value={newDealTitle}
              onChange={(e) => setNewDealTitle(e.target.value)}
              placeholder="e.g., 40% Off Afternoon Cold Brews"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-bold">
              <span className="text-slate-800">Discount Rate:</span>
              <span className="font-mono text-amber-700">{newDealDiscount}%</span>
            </div>
            <Slider
              value={newDealDiscount}
              min={10}
              max={80}
              step={5}
              onValueChange={setNewDealDiscount}
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1 font-bold">
              <span className="text-slate-800">Geofence Radius:</span>
              <span className="font-mono text-amber-700">{newDealRadius}m</span>
            </div>
            <Slider
              value={newDealRadius}
              min={100}
              max={3000}
              step={100}
              onValueChange={setNewDealRadius}
            />
          </div>

          <Button type="submit" variant="amber" className="w-full rounded-2xl font-bold">
            🚀 Broadcast to Nearby Shoppers
          </Button>
        </form>
      </Sheet>

      {/* React Native Code Inspector Modal */}
      <ReactNativeCodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        currentTab={activeTab}
        role={mobileRole}
        platform={nativePlatform}
      />

    </div>
  );
};
