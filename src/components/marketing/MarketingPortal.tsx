import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Zap, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Smartphone, 
  ArrowRight, 
  CheckCircle, 
  Building2, 
  Users, 
  Sliders, 
  TrendingUp, 
  Globe, 
  Clock, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Mail, 
  Phone, 
  QrCode, 
  Compass,
  Star,
  DollarSign,
  Laptop,
  CheckCircle2,
  Tag,
  Store,
  Flame,
  Percent,
  Calculator,
  Award,
  ExternalLink,
  Shield,
  Activity,
  Layers
} from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../../data/mockData';
import { SubscriptionTier, DealCategory } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { LeafletSatelliteMap } from '../common/LeafletSatelliteMap';

import heroCafeImg from '../../assets/images/hero_adelaide_cafe_1787881959768.jpg';
import shopperCityImg from '../../assets/images/shopper_city_radar_1787881980187.jpg';
import clientMobileAppImg from '../../assets/images/client_mobile_app_mockup_1787882348314.jpg';
import merchantScanImg from '../../assets/images/merchant_qr_scan_1787881996628.jpg';
import clientMerchantPosImg from '../../assets/images/client_merchant_pos_mockup_1787882363183.jpg';
import adminDashboardImg from '../../assets/images/admin_dashboard_screen_1787927772829.jpg';

export const MarketingPortal: React.FC = () => {
  const { 
    setViewMode, 
    setMobileRole, 
    activeCurrency,
    language,
    t,
    isRtl,
    deals,
    businesses
  } = useApp();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [activeFaqId, setActiveFaqId] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<'merchant' | 'shopper'>('merchant');
  const [selectedRadius, setSelectedRadius] = useState<number>(500);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [claimedDealId, setClaimedDealId] = useState<string | null>(null);
  const [showSatelliteRadar, setShowSatelliteRadar] = useState<boolean>(true);

  // Legal Modal
  const [showLegalModal, setShowLegalModal] = useState<'privacy' | 'terms' | null>(null);

  // Sample Interactive Radar Deals
  const sampleDeals = [
    {
      id: 'sample-1',
      titleEn: 'Flat White & Fresh Artisan Croissant',
      titleAr: 'قهوة فلات وايت مع كرواسون فرنسي طازج',
      businessEn: 'Grenfell Roasters & Bakery',
      businessAr: 'مخبز ومحمصة جرينفيل',
      category: 'cafe',
      distanceM: 520,
      walkingTime: '6 min walk',
      walkingTimeAr: '6 دقائق مشياً',
      discountPct: 40,
      originalPrice: 12.50,
      dealPrice: 7.50,
      remainingMinutes: 48,
      vouchersLeft: 6,
      badge: 'Flash Deal'
    },
    {
      id: 'sample-2',
      titleEn: 'Wood-Fired Margherita & Craft Soda',
      titleAr: 'بيتزا مارغريتا على الحطب مع مشروب حرفي',
      businessEn: 'Grote St Osteria',
      businessAr: 'مطعم ومخبز شارع غروت',
      category: 'dining',
      distanceM: 950,
      walkingTime: '11 min walk',
      walkingTimeAr: '11 دقيقة مشياً',
      discountPct: 35,
      originalPrice: 24.00,
      dealPrice: 15.60,
      remainingMinutes: 72,
      vouchersLeft: 4,
      badge: 'Lunch Special'
    },
    {
      id: 'sample-3',
      titleEn: 'Designer Linen Summer Shirt',
      titleAr: 'قميص كتان صيفي من أحدث التشكيلات',
      businessEn: 'Rundle Mall Apparel Co.',
      businessAr: 'متجر أزياء راندل مول',
      category: 'retail',
      distanceM: 1400,
      walkingTime: '15 min walk',
      walkingTimeAr: '15 دقيقة مشياً',
      discountPct: 50,
      originalPrice: 89.00,
      dealPrice: 44.50,
      remainingMinutes: 110,
      vouchersLeft: 8,
      badge: 'Exclusive'
    },
    {
      id: 'sample-4',
      titleEn: 'Express Precision Haircut & Styling',
      titleAr: 'قص شعر احترافي سريع مع تصفيف كامل',
      businessEn: 'Flinders St Grooming Lounge',
      businessAr: 'صالون شارع فلندرز للرجال',
      category: 'services',
      distanceM: 2800,
      walkingTime: '5 min drive',
      walkingTimeAr: '5 دقائق بالسيارة',
      discountPct: 30,
      originalPrice: 50.00,
      dealPrice: 35.00,
      remainingMinutes: 95,
      vouchersLeft: 3,
      badge: 'Afternoon Slot'
    }
  ];

  const filteredDeals = sampleDeals.filter(deal => {
    const matchCategory = selectedCategory === 'all' || deal.category === selectedCategory;
    const matchDistance = deal.distanceM <= selectedRadius;
    return matchCategory && matchDistance;
  });

  const faqsEn = [
    {
      q: 'How does FORSA-T deliver deals to customers in under 60 seconds?',
      a: 'Our smart real-time proximity engine calculates active smartphone users located near your business the moment you publish a deal. Instant push notifications are dispatched directly to nearby iOS and Android phones within seconds.'
    },
    {
      q: 'How do customers redeem the flash discounts in my store?',
      a: 'Customers simply tap "Claim Voucher" on their mobile app to generate a secure, single-use QR code. They present this code at your checkout counter, where your cashier scans it using any mobile phone or tablet to verify the discount in 1 second.'
    },
    {
      q: 'Does the business owner need special hardware or expensive POS integrations?',
      a: 'No special hardware is required! Store staff can use any existing smartphone, tablet, or web browser to scan customer QR vouchers in 1 second. Zero setup complexity.'
    },
    {
      q: 'How does the 14-day free trial work for business owners?',
      a: 'You can register your store, verify your business details (ABN), and publish unlimited flash deals with full proximity targeting. No upfront payment is required, and you can cancel anytime with a single click.'
    },
    {
      q: 'Can store owners choose which hours and distances to target?',
      a: 'Yes! You have 100% control over the deal duration (e.g. 60–90 minutes during slow afternoons), the discount percentage, the maximum voucher cap, and the walking distance radius (from 50m up to 5km).'
    },
    {
      q: 'Do you take any commission from our store sales?',
      a: 'Zero percent (0%). Unlike marketplace aggregators that deduct 20% to 35% from your hard-earned revenue, FORSA-T operates on a flat, transparent monthly subscription. You keep 100% of every sale.'
    }
  ];

  const faqsAr = [
    {
      q: 'كيف تصل العروض للمتسوقين القريبين في أقل من 60 ثانية؟',
      a: 'تعتمد المنصة على محرك رادار ذكي يحدد هواتف المتسوقين المتواجدين بالقرب من متجرك لحظة نشر العرض، ويرسل تنبيهاً فورياً ومباشراً على هواتفهم عبر نظامي iOS و Android.'
    },
    {
      q: 'كيف يقوم الزبائن باستخدام قسائم الخصم داخل المتجر؟',
      a: 'يقوم الزبون بالضغط على "احصل على القسيمة" داخل التطبيق ليظهر له رمز QR آمن وصالح لمرة واحدة. يظهره لموظف الصندوق في المتجر ليقوم بمسحه وتطبيق الخصم فوراً خلال ثانية واحدة.'
    },
    {
      q: 'هل يحتاج المتجر لشراء أجهزة خاصة أو برامج نقاط بيع معقدة؟',
      a: 'لا، لا يحتاج المتجر لأي أجهزة إضافية. يمكن لموظف الصندوق مسح قسيمة الزبون باستخدام كاميرا أي هاتف ذكي أو جهاز لوحي متوفر بالمتجر خلال ثانية واحدة وبدون أي تعقيد.'
    },
    {
      q: 'كيف تعمل التجربة المجانية لمدة 14 يوماً لأصحاب المتاجر؟',
      a: 'يمكنك تسجيل متجرك وتأكيد بيانات السجل التجاري (ABN) والبدء بنشر عروض فورية واستقطاب الزبائن فوراً بدون أي رسوم مسبقة، مع إمكانية الإلغاء في أي وقت بنقرة واحدة.'
    },
    {
      q: 'هل يمكن لصاحب المتجر التحكم في أوقات العرض ومسافة الاستهداف؟',
      a: 'نعم بكل تأكيد! يمكنك تحديد مدة العرض (مثلاً 60 إلى 90 دقيقة في أوقات الهدوء)، ونسبة الخصم، والحد الأقصى لعدد القسائم، والمسافة الجغرافية حول متجرك من 50 متراً وحتى 5 كيلومترات.'
    },
    {
      q: 'هل تأخذ المنصة أي نسبة عمولة من مبيعات المتجر؟',
      a: 'نسبة العمولة صفر بالمئة (0%). على عكس تطبيقات التوصيل التي تقتطع 20% إلى 35% من أرباحك، تعمل منصة فرصتي باشتراك شهري ثابت وشفاف، وجميع أرباح المبيعات تعود لك بالكامل.'
    }
  ];

  const faqs = language === 'ar' ? faqsAr : faqsEn;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-amber-500/20 selection:text-amber-900 font-sans">
      
      {/* 1. Announcement Banner */}
      <div className="bg-slate-900 text-white text-xs py-2.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-amber-400">
              {language === 'ar' ? 'أديلايد، أستراليا:' : 'Adelaide CBD Pilot:'}
            </span>
            <span className="text-slate-300">
              {language === 'ar' 
                ? 'محرك الرادار الجغرافي نشط الآن • تسجيل أصحاب الأعمال متاح مع تجربة 14 يوماً مجاناً' 
                : 'Real-time proximity radar active • Business owner registration open with 14-day free trial'}
            </span>
          </div>

          <button
            onClick={() => setViewMode('register')}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>{language === 'ar' ? 'سجل نشاطك التجاري الآن' : 'Claim Free Trial'}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            
            {/* Left Column: Core Value Pitch */}
            <div className="lg:col-span-7 space-y-6 text-start">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full    text-xs font-bold ">
                
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                {language === 'ar' ? (
                  <>
                    حوّل ساعات الهدوء إلى <span className="text-amber-600">إقبال فوري</span> وزيادة في أرباح متجرك
                  </>
                ) : (
                  <>
                    Turn Quiet Hours into <span className="text-amber-600">Walk-In Traffic</span> — Automatically                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                {language === 'ar'
                  ? 'منصة العروض الجغرافية الفورية التي تمكّن أكثر من 5000 صاحب عمل من الوصول للمتسوقين والمارة في نطاق 500م إلى 10كم. انشر عروضك المخصصة مع صفر بالمئة عمولة مبيعات.'
                  : 'Forsa-T is the hyper-local flash deals engine connecting 5,000+ business owners with shoppers already nearby. Set your radius anywhere from 500m to 10km, launch a proximity discount in seconds, and keep 100% of every sale — 0% commission, always.'}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  id="btn-hero-start-trial"
                  onClick={() => setViewMode('register')}
                  className="px-7 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all text-sm group"
                >
                  <Building2 className="w-4 h-4" />
                  <span>{language === 'ar' ? 'ابدأ تجربة أصحاب الأعمال المجانية (14 يوماً)' : 'Start 14-Day Business Owner Free Trial'}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  id="btn-hero-explore-mobile"
                  onClick={() => {
                    setViewMode('mobile');
                    setMobileRole('consumer');
                  }}
                  className="px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all text-sm shadow-xs"
                >
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ar' ? 'تجربة تطبيق الجوال للمتسوقين' : 'Try it on Mobile App'}</span>
                </button>
              </div>

              {/* 4 Trust & Metric Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-start">
                  <div className="text-amber-600 font-mono text-xl sm:text-2xl font-extrabold" dir="ltr">5,000+</div>
                  <div className="text-slate-600 text-xs font-medium mt-0.5">
                    {language === 'ar' ? 'أصحاب الأعمال' : 'Business Owners'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-start">
                  <div className="text-emerald-700 font-mono text-xl sm:text-2xl font-extrabold" dir="ltr">500m-10k</div>
                  <div className="text-slate-600 text-xs font-medium mt-0.5">
                    {language === 'ar' ? 'نطاق رادار المشاة' : 'Walking Radar'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-start">
                  <div className="text-slate-900 font-mono text-xl sm:text-2xl font-extrabold" dir="ltr">0%</div>
                  <div className="text-slate-600 text-xs font-medium mt-0.5">
                    {language === 'ar' ? 'عمولة المبيعات' : 'Sales Commission'}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 text-start">
                  <div className="text-sky-700 font-mono text-xl sm:text-2xl font-extrabold" dir="ltr">Live</div>
                  <div className="text-slate-600 text-xs font-medium mt-0.5">
                    {language === 'ar' ? 'مسح QR بالصندوق' : 'Real Time Notification'}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Live Deal Radar Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 text-start relative overflow-hidden">
                
                {/* Radar Sweep Effect */}
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-amber-500/10 blur-2xl pointer-events-none"></div>

                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                      <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '12s' }} />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-white">
                        {language === 'ar' ? 'رادار أديلايد الحي' : 'Adelaide Live Radar'}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {language === 'ar' ? '4 عروض نشطة في نطاق 300م' : '4 active deals within 300m'}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>LIVE</span>
                  </span>
                </div>

                {/* Simulated Floating Deal Card */}
                <div className="mt-4 bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950 inline-block mb-1">
                        40% OFF FLASH DEAL
                      </span>
                      <h5 className="font-bold text-sm text-white">
                        {language === 'ar' ? 'قهوة فلات وايت + كرواسون فرنسي' : 'Flat White & Fresh Butter Croissant'}
                      </h5>
                      <p className="text-xs text-slate-400">
                        {language === 'ar' ? 'مخبز ومحمصة جرينفيل • شارع جرينفيل' : 'Grenfell Roasters • Grenfell St, Adelaide'}
                      </p>
                    </div>

                    <div className="text-end shrink-0">
                      <div className="text-xs text-slate-400 line-through font-mono">$12.50</div>
                      <div className="text-base font-extrabold text-amber-400 font-mono">$7.50</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-slate-700/60 font-mono">
                    <div className="flex items-center gap-1 text-emerald-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? '140م (دقيقتان مشياً)' : '140m (2 min walk)'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>48m : 12s left</span>
                    </div>
                  </div>

                  {claimedDealId === 'sample-1' ? (
                    <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-lg text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>{language === 'ar' ? 'تم حجز القسيمة بنجاح!' : 'Voucher Pass Activated!'}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-mono">QR Code #FORSA-8942 Ready at Checkout</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => setClaimedDealId('sample-1')}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'احصل على قسيمة الخصم فوراً' : 'Claim 1-Tap Voucher Pass'}</span>
                    </button>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{language === 'ar' ? 'قسائم صالحة للاستخدام لمرة واحدة فقط' : 'Single-use cryptographic QR security'}</span>
                  <span className="text-slate-300 font-medium">{language === 'ar' ? 'تحديث فوري' : 'Real-time GPS sync'}</span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Interactive Deal Radar & Category Sampler */}
      <section id="live-radar" className="py-16 lg:py-20 bg-slate-100/70 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider font-mono">
              {language === 'ar' ? 'رادار العروض التفاعلي' : 'INTERACTIVE PROXIMITY RADAR'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
              {language === 'ar' ? 'استكشف كيف يرى المتسوقون عروض متاجرك لحظياً' : 'Experience How Walkers Discover Real-Time Deals'}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              {language === 'ar'
                ? 'جرّب تغيير مسافة الرادار أو التصنيف وشاهد كيف تظهر العروض الجغرافية للمارة في وسط المدينة.'
                : 'Select your walking distance or store category to test how pedestrian deals appear in Adelaide CBD.'}
            </p>
          </div>

          {/* Radar Control Filters */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Walking Radius Filter */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
                  {language === 'ar' ? 'نطاق الرادار:' : 'Walking Radius:'}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { val: 500, label: '500m' },
                    { val: 1000, label: '1km' },
                    { val: 2000, label: '2km' },
                    { val: 5000, label: '5km' },
                    { val: 10000, label: '10km' }
                  ].map((r) => (
                    <button
                      key={r.val}
                      onClick={() => setSelectedRadius(r.val)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedRadius === r.val
                          ? 'bg-amber-500 text-slate-950 shadow-2xs font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode & Category Filter */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-start md:justify-end flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowSatelliteRadar(!showSatelliteRadar)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    showSatelliteRadar
                      ? 'bg-slate-950 text-amber-300 border border-amber-400/50 shadow-xs'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-amber-400" />
                  <span>{showSatelliteRadar ? (language === 'ar' ? 'عرض القمر الصناعي (مفعل)' : 'Satellite Map (Active)') : (language === 'ar' ? 'عرض القمر الصناعي' : 'Show Satellite Map')}</span>
                </button>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'all', labelEn: 'All Deals', labelAr: 'الكل' },
                    { id: 'cafe', labelEn: 'Cafes', labelAr: 'المقاهي' },
                    { id: 'dining', labelEn: 'Dining', labelAr: 'المطاعم' },
                    { id: 'retail', labelEn: 'Retail', labelAr: 'الأزياء' }
                  ].map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedCategory === c.id
                          ? 'bg-slate-900 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {language === 'ar' ? c.labelAr : c.labelEn}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Interactive Leaflet Satellite Geofence Map */}
          {showSatelliteRadar && (
            <div className="mb-8">
              <LeafletSatelliteMap
                centerLat={-34.9285}
                centerLng={138.6007}
                radiusMeters={selectedRadius}
                onRadiusChange={(r) => setSelectedRadius(r)}
                deals={deals}
                heightClass="h-80 sm:h-96"
                defaultTileMode="satellite_hybrid"
                showRadarSweep={true}
                showShopperGps={true}
                branchName="Adelaide CBD Proximity Cluster"
              />
            </div>
          )}

          {/* Deals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredDeals.map((deal) => {
              const isClaimed = claimedDealId === deal.id;
              return (
                <div
                  key={deal.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-4 flex flex-col justify-between text-start group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-amber-100 text-amber-900 font-mono">
                        {deal.discountPct}% OFF
                      </span>
                      <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{language === 'ar' ? deal.walkingTimeAr : deal.walkingTime}</span>
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-sm text-slate-900 line-clamp-2">
                      {language === 'ar' ? deal.titleAr : deal.titleEn}
                    </h4>

                    <p className="text-xs text-slate-500 font-medium">
                      {language === 'ar' ? deal.businessAr : deal.businessEn}
                    </p>

                    <div className="pt-2 flex items-baseline justify-between border-t border-slate-100 font-mono">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-slate-900">${deal.dealPrice.toFixed(2)}</span>
                        <span className="text-xs text-slate-400 line-through">${deal.originalPrice.toFixed(2)}</span>
                      </div>
                      <span className="text-[10px] text-amber-700 font-bold">
                        {deal.vouchersLeft} {language === 'ar' ? 'متبقية' : 'left'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    {isClaimed ? (
                      <div className="py-2 px-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1 border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{language === 'ar' ? 'تم الحجز • رمز جاهز' : 'Voucher Ready'}</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setClaimedDealId(deal.id)}
                        className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>{language === 'ar' ? 'احصل على القسيمة' : 'Claim Voucher'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setViewMode('mobile');
                setMobileRole('consumer');
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-slate-950 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-2xs transition-colors"
            >
              <Smartphone className="w-4 h-4 text-amber-600" />
              <span>{language === 'ar' ? 'فتح المحاكي الكامل لتطبيق الجوال' : 'Open Full Mobile Radar Simulator'}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. Dual Perspective: For Merchants vs For Shoppers */}
      <section id="for-business" className="py-16 lg:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider font-mono">
              {language === 'ar' ? 'قيمة متبادلة للطرفين' : 'A CONNECTED MARKETPLACE'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
              {language === 'ar' ? 'حل متكامل صُمم لخدمة أصحاب المتاجر والمتسوقين' : 'Engineered for Local Store Owners & City Walkers'}
            </h2>

            {/* Persona Switcher Tabs */}
            <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 mt-6">
              <button
                onClick={() => setActiveTab('merchant')}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'merchant'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>{language === 'ar' ? 'لأصحاب المتاجر والمقاهي' : 'For Store & Cafe Owners'}</span>
              </button>
              <button
                onClick={() => setActiveTab('shopper')}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'shopper'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ar' ? 'للمتسوقين ورواد المدينة' : 'For City Shoppers & Diners'}</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Merchant Features */}
          {activeTab === 'merchant' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {language === 'ar' ? 'القضاء على ساعات الركود' : 'Eliminate Quiet Afternoon Slumps'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'ar'
                    ? 'هل تمر بساعات هدوء بين 2:30 و 4:30 عصراً؟ أطلق عرضاً سريعاً لمدة 60 دقيقة واملأ طاولاتك بالزبائن دون أي تأخير.'
                    : 'Turn empty tables and quiet retail counters into instant revenue by triggering targeted 60-to-90 minute flash offers.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {language === 'ar' ? '0% عمولة • الأرباح كلها لك' : '0% Sales Commission'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'ar'
                    ? 'لا نقتطع 25% أو 30% من قيمة مبيعاتك كباقي المنصات. اشتراك شهري ثابت وشفاف، وجميع مبيعاتك تدخل حسابك بالكامل.'
                    : 'Unlike delivery and coupon apps that take up to 35% of your bill, FORSA-T charges a flat monthly fee. Keep 100% of your earnings.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {language === 'ar' ? 'بدون أي أجهزة أو برامج معقدة' : 'Zero Hardware Investments'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'ar'
                    ? 'لا حاجة لشراء ماسحات ضوئية باهظة. يقوم موظف الصندوق بمسح رمز QR للزبون عبر أي هاتف ذكي أو جهاز لوحي خلال ثانية واحدة.'
                    : 'No POS hardware overhauls required. Cashiers scan one-time customer QR vouchers using any existing phone or tablet camera.'}
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Shopper Features */}
          {activeTab === 'shopper' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {language === 'ar' ? 'عروض على مسافة خطوات منك' : 'True Walking-Distance Deals'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'ar'
                    ? 'شاهد فقط العروض المتواجدة على مسافة دقيقتين إلى 5 دقائق مشياً من مكان تواجدك الحالي، دون إعلانات مزعجة لأماكن بعيدة.'
                    : 'Discover exclusive discounts within a 2-to-5 minute walk from your current GPS location in Adelaide CBD.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {language === 'ar' ? 'حجز بنقرة واحدة بدون طباعة' : '1-Tap Voucher Redemption'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'ar'
                    ? 'احصل على قسيمة الخصم فوراً عبر هاتفك برمز QR آمن، وأظهره للكاشير عند الدفع للحصول على التخفيض مباشرة.'
                    : 'Claim digital pass instantly on iOS or Android. Present the single-use QR pass at checkout for immediate instant savings.'}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {language === 'ar' ? 'متاجر ومقاهي موثوقة ومختارة' : 'Curated Local Favorites'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {language === 'ar'
                    ? 'جميع المتاجر المشاركة موثقة رسمياً برقم السجل التجاري ABN لضمان أعلى جودة للمنتجات والمشروبات والمأكولات.'
                    : 'Every participating boutique, coffee shop, and restaurant is ABN-verified for quality and reliability.'}
                </p>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 5. 3-Step How It Works (Photographic & Crisp) */}
      <section id="how-it-works" className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider font-mono">
              {t('howItWorksEyebrow')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
              {t('howItWorksHeading')}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              {language === 'ar'
                ? 'ثلاث خطوات بسيطة تبدأ بنشر العرض وتنتهي بإقبال الزبائن والدفع عند الصندوق.'
                : 'A seamless, friction-free loop connecting store supply with walking consumer demand.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-start group hover:border-amber-400 transition-colors">
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={heroCafeImg} 
                  alt="Business owner setting deal" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent"></div>
                <span className="absolute bottom-3 start-3 font-mono text-xs font-bold text-slate-950 bg-amber-400 px-3 py-1 rounded-md shadow-xs">
                  {language === 'ar' ? 'الخطوة 01' : 'STEP 01'}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 mb-2">{t('step1Title')}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t('step1Desc')}</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-start group hover:border-amber-400 transition-colors">
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={shopperCityImg} 
                  alt="Shoppers receiving proximity alerts" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent"></div>
                <span className="absolute bottom-3 start-3 font-mono text-xs font-bold text-slate-950 bg-amber-400 px-3 py-1 rounded-md shadow-xs">
                  {language === 'ar' ? 'الخطوة 02' : 'STEP 02'}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 mb-2">{t('step2Title')}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t('step2Desc')}</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-start group hover:border-amber-400 transition-colors">
              <div className="relative h-48 w-full overflow-hidden">
                <img 
                  src={merchantScanImg} 
                  alt="In-store QR checkout scan" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent"></div>
                <span className="absolute bottom-3 start-3 font-mono text-xs font-bold text-slate-950 bg-amber-400 px-3 py-1 rounded-md shadow-xs">
                  {language === 'ar' ? 'الخطوة 03' : 'STEP 03'}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 mb-2">{t('step3Title')}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t('step3Desc')}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Transparent Pricing Section */}
      <section id="pricing" className="py-16 lg:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider font-mono">
              {t('pricingEyebrow')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
              {t('pricingHeading')}
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              {t('pricingSub')}
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 mt-6">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('monthly')}
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{t('annual')}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                  {t('annualDiscountBadge')}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isPopular = plan.popular;
              const displayPrice = billingCycle === 'annual' 
                ? `$${Math.round(plan.priceAnnualAud / 12)}` 
                : `$${plan.priceMonthlyAud}`;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl p-7 text-start flex flex-col justify-between transition-all ${
                    isPopular
                      ? 'bg-white border-2 border-amber-500 shadow-md ring-4 ring-amber-500/10'
                      : 'bg-white border border-slate-200 shadow-xs'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 inset-x-0 flex justify-center">
                      <span className="bg-amber-500 text-slate-950 text-xs font-bold px-3 py-0.5 rounded-full shadow-xs">
                        {t('popularBadge')}
                      </span>
                    </div>
                  )}

                  <div>
                    <h3 className="font-heading text-lg font-bold text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-600 mt-1 min-h-[32px]">{plan.description}</p>

                    <div className="my-6 pb-6 border-b border-slate-100">
                      <div className="flex items-baseline gap-1">
                        <span className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900">{displayPrice}</span>
                        <span className="text-xs font-medium text-slate-500 font-mono">
                          {activeCurrency} {t('perMonth')}
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-bold mt-1 block">
                        {language === 'ar' ? '0% عمولة على المبيعات • كل الأرباح لك' : '0% sales commissions • 100% business profit'}
                      </span>
                    </div>

                    <ul className="space-y-3 text-xs text-slate-700 mb-8">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setViewMode('register')}
                    className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isPopular
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>{t('startFreeTrialBtn')}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </section>
      {/* 6. Pilot Business Owner Testimonials / Social Proof */}
      <section className="py-16 lg:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider font-mono">
              {language === 'ar' ? 'قصص نجاح الشركاء' : 'REAL RESULTS FROM THE ADELAIDE PILOT'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
              {language === 'ar' ? 'ماذا يقول أصحاب الأعمال عن تجربة منصة فرصتي؟' : 'Proven Results in Adelaide Commercial Pilot'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  {language === 'ar'
                    ? '"ساعات الهدوء بين 2:30 و 4:00 عصراً كانت تكلفنا الكثير. الآن نطلق عرضاً بنطاق 200م ونستقبل أكثر من 20 زبوناً يومياً!"'
                    : '"Our 2:30 PM slump used to mean empty bar stools. Triggering a 200m walking radius flash deal consistently fills 18-24 seats within 30 minutes."'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-xs">
                  GR
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Marcus Vance</h4>
                  <p className="text-[11px] text-slate-500">Grenfell St Specialty Roasters</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  {language === 'ar'
                    ? '"الماسح الضوئي سريع جداً عند الصندوق، والأهم أننا لا ندفع 30% عمولات لتطبيقات التوصيل. مبيعاتنا تعود لنا بالكامل."'
                    : '"The 1-second cashier camera scan has zero friction at checkout. Best of all: 0% sales commission means our margin stays intact."'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-xs">
                  RM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Sarah Jenkins</h4>
                  <p className="text-[11px] text-slate-500">Rundle Mall Apparel Co.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                  {language === 'ar'
                    ? '"التجربة المجانية لمدة 14 يوماً مكنتنا من اختبار المنصة دون أي مخاطرة. ضاعفنا زبائن الغداء في الأيام الممطرة بنسبة 45%."'
                    : '"The 14-day free trial allowed us to verify footfall lift risk-free. On slow rainy Tuesdays, a 300m deal brings in 30+ extra walk-ins."'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-900 font-bold flex items-center justify-center text-xs">
                  GO
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Domenico Rossi</h4>
                  <p className="text-[11px] text-slate-500">Grote St Italian Trattoria</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 9. FAQ Section */}
      <section id="faq" className="py-16 bg-white border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider font-mono">
              {language === 'ar' ? 'الأسئلة الشائعة' : 'FREQUENTLY ASKED QUESTIONS'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
              {language === 'ar' ? 'كل ما يهمك معرفته عن إطلاق منصة فرصتي' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaqId === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs"
                >
                  <button
                    onClick={() => setActiveFaqId(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-start flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-slate-900 hover:bg-slate-50/80 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 text-start">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. High-Impact Final Call to Action */}
      <section className="py-20 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'انضم للإطلاق التجاري في أديلايد' : 'Join the Adelaide Commercial Pilot'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
            {language === 'ar' 
              ? 'جاهز لملء ساعات الركود بالزبائن وزيادة أرباحك؟' 
              : 'Ready to Fill Slow Hours & Multiply Foot Traffic?'}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {language === 'ar'
              ? 'سجل متجرك اليوم واستفد من تجربة مجانية كاملة لمدة 14 يوماً بدون أي رسوم مسبقة أو شروط معقدة. انشر أول عرض فوري خلال 60 ثانية.'
              : 'Onboard your business today and activate your 14-day zero-risk trial. Publish your first proximity deal in 60 seconds.'}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setViewMode('register')}
              className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-xs transition-all text-sm flex items-center justify-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>{t('heroRegisterBtn')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>

            <button
              onClick={() => {
                setViewMode('mobile');
                setMobileRole('consumer');
              }}
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>{t('heroMobileBtn')}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 pt-2">
            {language === 'ar' 
              ? 'لا يتطلب بطاقة ائتمان مسبقة • إلغاء بنقرة واحدة في أي وقت • متوافق مع معايير ABN الأسترالية'
              : 'No credit card required for trial • Cancel anytime with 1-click • Australian Business Standard (ABN) Compliant'}
          </p>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div className="flex items-center gap-4">
              <BrandLogo 
                variant="horizontal" 
                size="md" 
                theme="dark"
                showTagline={true} 
                subLabel="OFFICIAL" 
              />
              <div className="hidden sm:block border-l border-slate-800 pl-4 text-start">
                <span className="text-[11px] text-slate-400 block font-semibold">
                  Hyper-Local Geofenced Commerce Infrastructure
                </span>
                <span className="text-[10px] text-slate-600 font-mono">
                  Adelaide CBD, South Australia • Australia
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-300 font-medium">
              <button 
                onClick={() => setShowLegalModal('privacy')}
                className="hover:text-amber-400 transition-colors"
              >
                {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </button>
              <button 
                onClick={() => setShowLegalModal('terms')}
                className="hover:text-amber-400 transition-colors"
              >
                {language === 'ar' ? 'شروط الاستخدام' : 'Terms of Service'}
              </button>
              <button 
                onClick={() => setViewMode('register')}
                className="text-amber-400 hover:text-amber-300 font-semibold"
              >
                {language === 'ar' ? 'تسجيل أصحاب الأعمال' : 'Business Owner Portal'}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>
              © {new Date().getFullYear()} FORSA-T. {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300">Operational & Online in Adelaide (ACST)</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Legal Privacy / Terms Modal */}
      {showLegalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 text-start space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-base text-slate-900">
                {showLegalModal === 'privacy' 
                  ? (language === 'ar' ? 'سياسة الخصوصية وأمان البيانات' : 'Privacy Policy & Data Protection') 
                  : (language === 'ar' ? 'شروط الخدمة والاتفاق التجاري' : 'Terms of Service & Commercial Agreement')}
              </h3>
              <button 
                onClick={() => setShowLegalModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2.5 max-h-60 overflow-y-auto leading-relaxed">
              {showLegalModal === 'privacy' ? (
                <>
                  <p><strong>1. Geolocation Privacy:</strong> User GPS coordinates are processed exclusively in real-time memory for distance calculation (50m–500m) and are never stored or sold to third parties.</p>
                  <p><strong>2. Cryptographic Security:</strong> All QR vouchers utilize single-use tokens expiring within their specified countdown window to prevent fraud.</p>
                  <p><strong>3. Business Verification:</strong> Australian Business Numbers (ABN) are cross-referenced with public ASIC registry databases.</p>
                </>
              ) : (
                <>
                  <p><strong>1. Business Owner Subscription:</strong> 14-day zero-cost trial. Post-trial billing is billed monthly or annually as selected with 0% sales commissions.</p>
                  <p><strong>2. In-Store Honor:</strong> Participating business owners agree to honor active, unredeemed QR vouchers presented during their designated time window.</p>
                  <p><strong>3. Cancellation:</strong> Subscriptions can be canceled at any time with immediate effect.</p>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-end">
              <button
                onClick={() => setShowLegalModal(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
