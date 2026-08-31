export type Language = 'en' | 'ar';

export interface TranslationDictionary {
  // Common & Header
  brandName: string;
  brandSub: string;
  langEn: string;
  langAr: string;
  navMarketing: string;
  navRegister: string;
  navAdmin: string;
  navMobile: string;
  navDatabase: string;
  headerRegisterBtn: string;
  headerLiveRadar: string;
  headerActivePilot: string;
  
  // Hero & Marketing
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroRegisterBtn: string;
  heroMobileBtn: string;
  
  // Hero Stats Strip (Customer & Merchant Friendly)
  statAlertsTime: string;
  statAlertsLabel: string;
  statRadiusRange: string;
  statRadiusLabel: string;
  statAudienceCount: string;
  statAudienceLabel: string;
  
  // Radar Live Preview
  radarTitle: string;
  radarBadge: string;
  radarActiveOffer: string;
  radarOfferTitle: string;
  radarViewQr: string;
  radarMerchantCenter: string;
  
  // Interactive Calculator / ROI Simulator
  calcEyebrow: string;
  calcHeading: string;
  calcSubtitle: string;
  calcRadiusLabel: string;
  calcFootTrafficEstimate: string;
  calcFootTrafficDesc: string;
  calcEstimatedRedemptions: string;
  calcRedemptionsDesc: string;
  calcEstRevenue: string;
  calcEstRevenueDesc: string;
  calcLaunchTrialBtn: string;

  // Features / Value Propositions
  featuresEyebrow: string;
  featuresHeading: string;
  featuresSub: string;
  feat1Title: string;
  feat1Desc: string;
  feat2Title: string;
  feat2Desc: string;
  feat3Title: string;
  feat3Desc: string;
  feat4Title: string;
  feat4Desc: string;

  // Screen Showcases (Image + Description for Clients)
  screenShopperBadge: string;
  screenShopperTitle: string;
  screenShopperDesc: string;
  screenShopperPoint1Title: string;
  screenShopperPoint1Desc: string;
  screenShopperPoint2Title: string;
  screenShopperPoint2Desc: string;
  screenShopperPoint3Title: string;
  screenShopperPoint3Desc: string;

  screenScannerBadge: string;
  screenScannerTitle: string;
  screenScannerDesc: string;
  screenScannerPoint1Title: string;
  screenScannerPoint1Desc: string;
  screenScannerPoint2Title: string;
  screenScannerPoint2Desc: string;
  screenScannerPoint3Title: string;
  screenScannerPoint3Desc: string;

  screenMerchantBadge: string;
  screenMerchantTitle: string;
  screenMerchantDesc: string;
  screenMerchantPoint1Title: string;
  screenMerchantPoint1Desc: string;
  screenMerchantPoint2Title: string;
  screenMerchantPoint2Desc: string;
  screenMerchantPoint3Title: string;
  screenMerchantPoint3Desc: string;

  screenAdminBadge: string;
  screenAdminTitle: string;
  screenAdminDesc: string;
  screenAdminPoint1Title: string;
  screenAdminPoint1Desc: string;
  screenAdminPoint2Title: string;
  screenAdminPoint2Desc: string;
  screenAdminPoint3Title: string;
  screenAdminPoint3Desc: string;

  // How It Works
  howItWorksEyebrow: string;
  howItWorksHeading: string;
  step1Num: string;
  step1Title: string;
  step1Desc: string;
  step2Num: string;
  step2Title: string;
  step2Desc: string;
  step3Num: string;
  step3Title: string;
  step3Desc: string;

  // Pricing & Plans
  pricingEyebrow: string;
  pricingHeading: string;
  pricingSub: string;
  monthly: string;
  annual: string;
  annualDiscountBadge: string;
  popularBadge: string;
  perMonth: string;
  startFreeTrialBtn: string;
  tierStarter: string;
  tierStarterDesc: string;
  tierGrowth: string;
  tierGrowthDesc: string;
  tierEnterprise: string;
  tierEnterpriseDesc: string;

  // Mobile App Simulator
  mobileSimTitle: string;
  mobileSimDesc: string;
  consumerMode: string;
  merchantMode: string;
  deviceIphone: string;
  devicePixel: string;
  deviceFullscreen: string;
  
  // Consumer Mobile Interface
  mobileDiscoverTitle: string;
  mobileDiscoverSub: string;
  mobileSearchPlaceholder: string;
  mobileFilterAll: string;
  mobileFilterCafe: string;
  mobileFilterRestaurant: string;
  mobileFilterBakery: string;
  mobileFilterRetail: string;
  mobileFilterServices: string;
  mobileRadiusFilter: string;
  mobileClaimDealBtn: string;
  mobileClaimedBadge: string;
  mobileSavedBadge: string;
  mobileFollowMerchant: string;
  mobileFollowing: string;
  mobileQrVoucherTitle: string;
  mobileQrInstructions: string;
  mobileValidUntil: string;
  mobileOriginalPrice: string;
  mobileOfferPrice: string;
  mobileSavings: string;
  mobileDistanceM: string;
  mobileCloseBtn: string;
  
  // Merchant Mobile Interface
  merchantDashboardTitle: string;
  merchantActiveDeals: string;
  merchantNewDealBtn: string;
  merchantScanQrBtn: string;
  merchantCreateDealHeading: string;
  merchantDealTitleLabel: string;
  merchantDealDescLabel: string;
  merchantCategoryLabel: string;
  merchantDiscountLabel: string;
  merchantOriginalPriceLabel: string;
  merchantRadiusLabel: string;
  merchantQuantityLabel: string;
  merchantPublishBtn: string;
  merchantScannerTitle: string;
  merchantScanPrompt: string;
  merchantScanSuccess: string;
  merchantAiReportBtn: string;
  merchantAiReportTitle: string;

  // Registration Page
  regTitle: string;
  regSubtitle: string;
  regStep1: string;
  regStep2: string;
  regStep3: string;
  regFullName: string;
  regEmail: string;
  regPhone: string;
  regBizName: string;
  regAbn: string;
  regAbnHelp: string;
  regBizCategory: string;
  regBizAddress: string;
  regChoosePlan: string;
  regTrialCallout: string;
  regSubmitBtn: string;
  regSuccessTitle: string;
  regSuccessDesc: string;

  // Footer & Legal
  footerDesc: string;
  footerRights: string;
  footerPrivacy: string;
  footerTerms: string;
  footerCookies: string;
  footerSupport: string;
  footerAdelaide: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    brandName: 'FORSA-T',
    brandSub: 'Adelaide Pilot • Real-Time Deals',
    langEn: 'English',
    langAr: 'العربية',
    navMarketing: 'Marketing & Overview',
    navRegister: 'Business Owner Register',
    navAdmin: 'Admin Dashboard',
    navMobile: 'Consumer Mobile App',
    navDatabase: 'Database & Architecture',
    headerRegisterBtn: 'Business Owner Register',
    headerLiveRadar: 'Live Radar: Active',
    headerActivePilot: 'Adelaide Pilot • Real-Time Geofencing',

    heroBadge: 'Adelaide Pilot • Real-Time Flash Deals & Local Discovery',
    heroTitleLine1: 'Fill quiet store hours with',
    heroTitleHighlight: 'real-time local flash deals',
    heroTitleLine2: 'for nearby shoppers.',
    heroSubtitle: 'FORSA-T connects local Adelaide cafés, restaurants, and retailers with nearby customers. Publish limited-time offers to shoppers walking within minutes of your door with instant notifications and QR checkouts.',
    heroRegisterBtn: 'Business Owner Register (14-Day Free Trial)',
    heroMobileBtn: 'Launch Consumer Mobile App',

    statAlertsTime: '5,000+',
    statAlertsLabel: 'Business Owners',
    statRadiusRange: '500m–10km',
    statRadiusLabel: 'Walking Radar',
    statAudienceCount: '5,000+',
    statAudienceLabel: 'Active Business Owners',

    radarTitle: 'Live Adelaide CBD Radar',
    radarBadge: 'Live GPS Radar',
    radarActiveOffer: 'Current Featured Offer:',
    radarOfferTitle: '☕ 30% Off Specialty Flat Whites',
    radarViewQr: 'View Voucher',
    radarMerchantCenter: "Amira's Café",

    calcEyebrow: 'Interactive Value Calculator',
    calcHeading: 'Estimate your immediate walk-in foot traffic',
    calcSubtitle: 'Adjust the radar radius slider to simulate real-time consumer reach and estimated walk-in redemptions in metropolitan Adelaide:',
    calcRadiusLabel: 'Selected Radar Radius:',
    calcFootTrafficEstimate: 'Estimated Nearby Shoppers',
    calcFootTrafficDesc: 'Active smartphone users walking within your designated radius',
    calcEstimatedRedemptions: 'Estimated Walk-in Redemptions',
    calcRedemptionsDesc: 'Projected in-store voucher claims during the flash deal window',
    calcEstRevenue: 'Estimated Incremental Revenue',
    calcEstRevenueDesc: 'New gross sales generated during otherwise quiet business hours',
    calcLaunchTrialBtn: 'Start 14-Day Zero-Risk Trial',

    featuresEyebrow: 'Why Local Businesses Love FORSA-T',
    featuresHeading: 'Engineered for instant foot traffic & zero wasted inventory',
    featuresSub: 'Transform slow afternoons into profitable sales spikes with precision local targeting.',
    feat1Title: 'Instant Push Alerts (< 60s)',
    feat1Desc: 'Reach active shoppers nearby within seconds of publishing your flash offer.',
    feat2Title: 'Precision Walking Distance Radar',
    feat2Desc: 'Target customers within 50m to 5km walking or driving distance to maximize immediate footfall.',
    feat3Title: 'Fraud-Proof QR Redemptions',
    feat3Desc: 'Single-use cryptographic QR vouchers scanned instantly using any smartphone camera or POS terminal.',
    feat4Title: 'Smart AI Performance Insights',
    feat4Desc: 'Automated post-deal recommendations compare your sales against local category benchmarks to maximize margins.',

    // Screen Showcases (Image + Description for Clients)
    screenShopperBadge: 'Screen 01: Shopper Mobile Experience',
    screenShopperTitle: 'Live Proximity Radar & 1-Tap Mobile Deals',
    screenShopperDesc: 'Nearby customers discover your business within 50m–500m walking distance. The mobile app continuously updates local flash offers, showing exact distance, savings, and countdown timers.',
    screenShopperPoint1Title: 'Live GPS Walking Distance',
    screenShopperPoint1Desc: 'Displays exact walking time (e.g., "2 min walk • 150m") so shoppers can visit immediately.',
    screenShopperPoint2Title: 'Instant Push Alerts (<60s)',
    screenShopperPoint2Desc: 'Delivers high-priority notifications to nearby iOS & Android devices the moment you publish.',
    screenShopperPoint3Title: '1-Tap Voucher Claiming',
    screenShopperPoint3Desc: 'Customers reserve their discount with a single tap, generating a secure digital pass.',

    screenScannerBadge: 'Screen 02: In-Store Cashier POS',
    screenScannerTitle: '1-Second Camera QR Redemption',
    screenScannerDesc: 'No new hardware or expensive POS integrations required. Store staff simply scan the customer voucher using any smartphone, tablet, or webcam at the checkout counter.',
    screenScannerPoint1Title: 'Instant Cryptographic Validation',
    screenScannerPoint1Desc: 'Validates voucher authenticity in real-time, preventing double-redemption and counterfeit vouchers.',
    screenScannerPoint2Title: 'Zero Cashier Friction',
    screenScannerPoint2Desc: 'Green confirmation screen shows exact discounted price and bill total in under 1 second.',
    screenScannerPoint3Title: 'Automated Sales Logging',
    screenScannerPoint3Desc: 'Automatically logs redemption time, revenue, and customer traffic for your daily reports.',

    screenMerchantBadge: 'Screen 03: Business Owner Portal',
    screenMerchantTitle: '60-Second Flash Deal Publisher',
    screenMerchantDesc: 'A powerful yet intuitive portal built for busy business owners. Create and dispatch targeted flash promotions in under one minute whenever foot traffic is slow.',
    screenMerchantPoint1Title: 'Custom Discount & Duration Controls',
    screenMerchantPoint1Desc: 'Set custom discount rates (e.g. 30% OFF), active duration (e.g. 90 minutes), and maximum voucher caps.',
    screenMerchantPoint2Title: 'Precision Geofence Slider',
    screenMerchantPoint2Desc: 'Choose exactly how far your offer radiates—from storefront walk-bys (50m) to citywide districts (5km).',
    screenMerchantPoint3Title: 'Live Foot-Traffic & Revenue Analytics',
    screenMerchantPoint3Desc: 'Monitor real-time voucher claims, view walk-in numbers, and track gross revenue added to your business.',

    screenAdminBadge: 'Screen 04: Central Admin & Compliance Suite',
    screenAdminTitle: 'Citywide Platform Operations & Moderation',
    screenAdminDesc: 'A comprehensive central management suite that monitors platform health, verifies business owner credentials, enforces compliance, and tracks regional economic impact.',
    screenAdminPoint1Title: 'Australian ABN Business Verification',
    screenAdminPoint1Desc: 'Validates business owner Australian Business Numbers to ensure all participating vendors are legitimate registered businesses.',
    screenAdminPoint2Title: 'Live City Map & Deal Moderation',
    screenAdminPoint2Desc: 'Oversees all active flash deals across Adelaide CBD, ensuring quality, safety, and proper categorization.',
    screenAdminPoint3Title: 'Subscription & Financial Governance',
    screenAdminPoint3Desc: 'Manages recurring business owner plans, billing cycles, platform SLAs, and automated auditing logs.',

    howItWorksEyebrow: 'How It Works in 3 Simple Steps',
    howItWorksHeading: 'Turn Quiet Store Hours into Foot Traffic in Minutes',
    step1Num: '01',
    step1Title: 'Publish Flash Deal',
    step1Desc: 'Set your discount, voucher quantity, and walking radar radius (e.g. 500m around your storefront).',
    step2Num: '02',
    step2Title: 'Nearby Shoppers Get Alerted',
    step2Desc: 'Active customers walking nearby receive instant mobile push alerts with live walking directions.',
    step3Num: '03',
    step3Title: '1-Second In-Store QR Redemption',
    step3Desc: 'Shoppers present their digital pass at checkout. Scan the QR code with any phone or tablet in 1 second.',

    pricingEyebrow: 'Transparent Subscription Plans',
    pricingHeading: 'Simple, predictable plans for every local business',
    pricingSub: 'Start with a 14-day zero-risk trial. No lock-in contracts, cancel anytime.',
    monthly: 'Monthly Billing',
    annual: 'Annual Billing (Save 20%)',
    annualDiscountBadge: 'Save 20%',
    popularBadge: 'Most Popular',
    perMonth: '/ month',
    startFreeTrialBtn: 'Start 14-Day Free Trial',
    tierStarter: 'Starter',
    tierStarterDesc: 'Ideal for independent coffee shops, bakeries, and solo boutique retail.',
    tierGrowth: 'Growth',
    tierGrowthDesc: 'Designed for popular cafés, restaurants, and busy local retail shops.',
    tierEnterprise: 'Enterprise Multi-Branch',
    tierEnterpriseDesc: 'For restaurant groups, regional chains, and multi-location franchises.',

    mobileSimTitle: 'Mobile App Experience',
    mobileSimDesc: 'Explore how customers discover deals and how business owners scan vouchers in the native iOS/Android mobile app.',
    consumerMode: 'Customer Mode (Shopper)',
    merchantMode: 'Business Owner Mode (Store Manager)',
    deviceIphone: 'iPhone View',
    devicePixel: 'Pixel View',
    deviceFullscreen: 'Full Screen',

    mobileDiscoverTitle: 'Explore Nearby Deals',
    mobileDiscoverSub: 'Exclusive discounts within walking distance',
    mobileSearchPlaceholder: 'Search coffee, sushi, bakery, retail...',
    mobileFilterAll: 'All Offers',
    mobileFilterCafe: 'Café & Coffee',
    mobileFilterRestaurant: 'Restaurants',
    mobileFilterBakery: 'Bakery',
    mobileFilterRetail: 'Retail & Fashion',
    mobileFilterServices: 'Local Services',
    mobileRadiusFilter: 'Distance Radar',
    mobileClaimDealBtn: 'Claim & Get QR Voucher',
    mobileClaimedBadge: 'Voucher Claimed',
    mobileSavedBadge: 'Saved',
    mobileFollowMerchant: 'Follow Store',
    mobileFollowing: 'Following',
    mobileQrVoucherTitle: 'Present at Checkout',
    mobileQrInstructions: 'Show this single-use QR code to the cashier before ordering to redeem your discount.',
    mobileValidUntil: 'Offer expires in',
    mobileOriginalPrice: 'Original',
    mobileOfferPrice: 'Deal Price',
    mobileSavings: 'You Save',
    mobileDistanceM: 'away',
    mobileCloseBtn: 'Close',

    merchantDashboardTitle: 'Business Owner Storefront Manager',
    merchantActiveDeals: 'Active Flash Deals',
    merchantNewDealBtn: '+ Create Flash Deal',
    merchantScanQrBtn: 'Scan Customer QR',
    merchantCreateDealHeading: 'Create New 60-Minute Flash Deal',
    merchantDealTitleLabel: 'Deal Headline (e.g. ☕ 30% Off Afternoon Flat Whites)',
    merchantDealDescLabel: 'Deal Terms & Details',
    merchantCategoryLabel: 'Category',
    merchantDiscountLabel: 'Discount Percentage (%)',
    merchantOriginalPriceLabel: 'Original Price ($)',
    merchantRadiusLabel: 'Target Radar Radius (Walking Range)',
    merchantQuantityLabel: 'Max Vouchers (Inventory Cap)',
    merchantPublishBtn: 'Publish Deal & Send Live Alerts',
    merchantScannerTitle: 'POS QR Voucher Scanner',
    merchantScanPrompt: 'Scan customer smartphone QR voucher to verify discount:',
    merchantScanSuccess: 'Voucher Verified & Successfully Redeemed!',
    merchantAiReportBtn: 'View AI Performance Report',
    merchantAiReportTitle: 'Smart AI Deal Insights',

    regTitle: 'Join FORSA-T as a Verified Business Owner',
    regSubtitle: 'Reach nearby shoppers in Adelaide today with a 14-day zero-risk trial.',
    regStep1: 'Business Information',
    regStep2: 'Plan & Billing',
    regStep3: 'Confirmation',
    regFullName: 'Store Manager / Business Owner Name',
    regEmail: 'Business Email',
    regPhone: 'Contact Phone (+61...)',
    regBizName: 'Business / Trading Name',
    regAbn: 'Australian Business Number (ABN)',
    regAbnHelp: '11 digits. We verify this automatically via the Australian Business Register (ABR).',
    regBizCategory: 'Primary Business Category',
    regBizAddress: 'Storefront Physical Address',
    regChoosePlan: 'Select Subscription Plan',
    regTrialCallout: '14-Day Free Trial Included: No charge for the first 14 days. Cancel anytime with one click.',
    regSubmitBtn: 'Complete Registration & Start Free Trial',
    regSuccessTitle: 'Welcome to FORSA-T!',
    regSuccessDesc: 'Your business profile is active. You can now publish your first flash deal.',

    footerDesc: 'FORSA-T is Adelaide’s hyper-local real-time deal discovery platform, bringing customers and business owners together through instant proximity alerts.',
    footerRights: 'All rights reserved. Adelaide, South Australia.',
    footerPrivacy: 'Privacy Policy',
    footerTerms: 'Terms of Service',
    footerCookies: 'Cookie Preferences',
    footerSupport: 'Business Owner Support',
    footerAdelaide: 'Proudly Launching in Adelaide CBD & North Adelaide'
  },
  ar: {
    brandName: 'فرصتي',
    brandSub: 'إطلاق أديلايد التجريبي • عروض فورية',
    langEn: 'English',
    langAr: 'العربية',
    navMarketing: 'الرئيسية والمميزات',
    navRegister: 'تسجيل أصحاب الأعمال',
    navAdmin: 'لوحة تحكم الإدارة',
    navMobile: 'تطبيق الجوال للمتسوقين',
    navDatabase: 'قاعدة البيانات والموقع',
    headerRegisterBtn: 'تسجيل صاحب عمل جديد',
    headerLiveRadar: 'الرادار المباشر: نشط',
    headerActivePilot: 'أديلايد • تحديد الموقع الفوري والعروض الحية',

    heroBadge: 'إطلاق أديلايد التجريبي • عروض حصرية وتنبيهات فورية للمتسوقين',
    heroTitleLine1: 'حوّل أوقات الهدوء إلى',
    heroTitleHighlight: 'مبيعات فورية بعروض حصرية',
    heroTitleLine2: 'تصل للمتسوقين القريبين من متجرك.',
    heroSubtitle: 'منصة فرصتي تربط المقاهي والمطاعم والمتاجر المحلية بالمتسوقين المتواجدين بالقرب منها. انشر عروضاً سريعة ومحدودة للمتسوقين على بُعد دقائق من باب متجرك مع إشعارات مباشرة وخصومات عبر رمز QR.',
    heroRegisterBtn: 'تسجيل أصحاب الأعمال (تجربة مجانية 14 يوماً)',
    heroMobileBtn: 'فتح تطبيق الجوال للمتسوقين',

    statAlertsTime: '+5000',
    statAlertsLabel: 'أصحاب الأعمال',
    statRadiusRange: '500م – 10كم',
    statRadiusLabel: 'نطاق رادار المشاة',
    statAudienceCount: '+5,000',
    statAudienceLabel: 'صاحب عمل معتمد',

    radarTitle: 'رادار أديلايد المباشر (CBD)',
    radarBadge: 'رادار GPS فوري',
    radarActiveOffer: 'العرض النشط حالياً:',
    radarOfferTitle: '☕ خصم 30% على قهوة فلات وايت المختصة',
    radarViewQr: 'عرض القسيمة',
    radarMerchantCenter: 'مقهى أميرة',

    calcEyebrow: 'حاسبة القيمة والأرباح التفاعلية',
    calcHeading: 'قدّر عدد الزوار والمبيعات الفورية لمتجرك',
    calcSubtitle: 'حرّك شريط نطاق الرادار لاحتساب مدى وصول عرضك وتقدير عدد الزبائن الذين سيتوافدون على متجرك في أديلايد:',
    calcRadiusLabel: 'نطاق الرادار المحدد:',
    calcFootTrafficEstimate: 'المتسوقون القريبون المقدرون',
    calcFootTrafficDesc: 'مستخدمو الهواتف النشطون المتواجدون داخل النطاق الجغرافي لمتجرك',
    calcEstimatedRedemptions: 'الزيارات وعمليات الشراء المقدرة',
    calcRedemptionsDesc: 'عدد القسائم المتوقع استخدامها داخل المتجر خلال فترة العرض',
    calcEstRevenue: 'الإيرادات الإضافية المقدرة',
    calcEstRevenueDesc: 'مبيعات إضافية جديدة يتم تحقيقها في ساعات العمل الهادئة',
    calcLaunchTrialBtn: 'ابدأ التجربة المجانية لمدة 14 يوماً',

    featuresEyebrow: 'لماذا تفضل المتاجر منصة فرصتي؟',
    featuresHeading: 'مصممة لزيادة الإقبال الفوري وتقليل الهدر في المخزون',
    featuresSub: 'حوّل ساعات ما بعد الظهر الهادئة إلى فترات ذروة مربحة باستهداف المتسوقين القريبين بدقة.',
    feat1Title: 'إشعارات فورية فائقة السرعة (< 60 ثانية)',
    feat1Desc: 'تصل عروضك السريعة لهواتف المتسوقين القريبين في ثوانٍ معدودة من لحظة نشر العرض.',
    feat2Title: 'رادار دقيق لمسافات المشي',
    feat2Desc: 'استهدف الزبائن على بعد 50 متراً إلى 5 كيلومترات سيراً على الأقدام أو بالسيارة لضمان حضور فوري.',
    feat3Title: 'قسائم QR آمنة ومحمية من الاحتيال',
    feat3Desc: 'قسائم رقمية صالحة للاستخدام مرة واحدة فقط، يتم مسحها في ثوانٍ عبر كاميرا الهاتف أو جهاز نقطة البيع (POS).',
    feat4Title: 'تقارير ذكاء اصطناعي لتحسين الأداء',
    feat4Desc: 'تحليلات ذكية تقارن مبيعات عروضك مع متوسطات السوق المحلية لتعظيم هامش الربح والأسعار.',

    // Screen Showcases (Image + Description for Clients)
    screenShopperBadge: 'الشاشة 01: تجربة تطبيق الجوال للمتسوقين',
    screenShopperTitle: 'رادار حي لاستكشاف العروض القريبة بنقرة واحدة',
    screenShopperDesc: 'يكتشف المتسوقون القريبون متجرك وعروضك على مسافة مشي تبدأ من 50م وحتى 500م. يعرض التطبيق المسافة الفعلية، ومقدار التوفير المالي، وعداد الوقت المتبقي للعرض.',
    screenShopperPoint1Title: 'حساب مسافة المشي بالدقائق',
    screenShopperPoint1Desc: 'يعرض الوقت الدقيق للوصول مشياً (مثلاً: "دقيقتين سيراً • 150م") ليشجع الزبون على القدوم فوراً.',
    screenShopperPoint2Title: 'إشعارات فائقة السرعة (< 60 ثانية)',
    screenShopperPoint2Desc: 'تصل التنبيهات الفورية ذات الأولوية لأجهزة iOS و Android للمتواجدين بالقرب منك لحظة النشر.',
    screenShopperPoint3Title: 'حجز القسيمة بنقرة واحدة',
    screenShopperPoint3Desc: 'يحجز العميل قسيمة الخصم بلمسة واحدة ليحصل على بطاقة رقمية آمنة برمز QR.',

    screenScannerBadge: 'الشاشة 02: ماسح القسائم عند الصندوق (POS)',
    screenScannerTitle: 'مسح فوري لرمز QR خلال ثانية واحدة',
    screenScannerDesc: 'لا تحتاج لشراء أجهزة مكلفة أو برامج معقدة. يقوم موظف الصندوق بمسح رمز قسيمة الزبون عبر كاميرا أي هاتف ذكي، جهاز لوحي، أو شاشة الكاشير.',
    screenScannerPoint1Title: 'تحقق رقمي فوري ومنع التكرار',
    screenScannerPoint1Desc: 'يتأكد النظام فوراً من صلاحية القسيمة ويمنع استخدامها أكثر من مرة لضمان أمان العرض.',
    screenScannerPoint2Title: 'خدمة سريعة بدون أي تأخير',
    screenScannerPoint2Desc: 'تظهر شاشة تأكيد خضراء واضحة بالسعر المخفض وقيمة الحساب النهائي في أقل من ثانية.',
    screenScannerPoint3Title: 'تسجيل تلقائي للمبيعات والزيارات',
    screenScannerPoint3Desc: 'يقوم النظام بحفظ وقت الشراء، وقيمة المبيعات، وبيانات الإقبال في تقارير متجرك اليومية.',

    screenMerchantBadge: 'الشاشة 03: منصة أصحاب الأعمال والمتاجر',
    screenMerchantTitle: 'إنشاء ونشر عروض فورية في 60 ثانية',
    screenMerchantDesc: 'لوحة تحكم صممت خصيصاً لأصحاب الأعمال المشغولين. أنشئ عروضاً ترويجية سريعة وانشرها للمتسوقين القريبين في أقل من دقيقة خلال ساعات الركود.',
    screenMerchantPoint1Title: 'تحكم كامل بنسبة الخصم والمدة',
    screenMerchantPoint1Desc: 'حدد نسبة الخصم (مثلاً خصم 30%)، والمدة الزمنية (مثلاً 90 دقيقة)، والحد الأقصى لعدد القسائم.',
    screenMerchantPoint2Title: 'شريط رادار لتحديد مسافة الاستهداف',
    screenMerchantPoint2Desc: 'اختر بدقة نطاق وصول العرض الجغرافي، من مشاة الشارع أمام متجرك (50م) وحتى الحي بأكمله (5كم).',
    screenMerchantPoint3Title: 'تحليلات مباشرة للمبيعات والإقبال',
    screenMerchantPoint3Desc: 'تابع عدد القسائم المحجوزة لحظة بلحظة، وعدد الزوار الفعليين، والمبيعات الإضافية المحققة.',

    screenAdminBadge: 'الشاشة 04: لوحة الإدارة والرقابة المركزية',
    screenAdminTitle: 'متابعة عمليات المنصة والتراخيص على مستوى المدينة',
    screenAdminDesc: 'نظام إدارة مركزي متكامل يتابع أداء المنصة، ويعتمد أصحاب الأعمال المرخصين، ويضمن جودة العروض ومتابعة المؤشرات الاقتصادية للمدينة.',
    screenAdminPoint1Title: 'التحقق من السجل التجاري الأسترالي (ABN)',
    screenAdminPoint1Desc: 'التأكد من نظامية كل متجر وصاحب عمل مسجل وصلاحية سجله التجاري لضمان بيئة موثوقة وآمنة للمتسوقين.',
    screenAdminPoint2Title: 'خريطة حية للمدينة ومراجعة العروض',
    screenAdminPoint2Desc: 'متابعة العروض النشطة عبر خريطة أديلايد والتحقق من التزام المتاجر بأعلى معايير الجودة.',
    screenAdminPoint3Title: 'إدارة الاشتراكات والتقارير المالية',
    screenAdminPoint3Desc: 'متابعة اشتراكات أصحاب الأعمال الدورية، وسرعة إرسال الإشعارات، وسجلات التدقيق الرسمية.',

    howItWorksEyebrow: 'كيف تعمل المنصة في 3 خطوات بسيطة',
    howItWorksHeading: 'حوّل أوقات الركود إلى إقبال فوري للزبائن خلال دقائق',
    step1Num: '01',
    step1Title: 'أنشئ وانشر عرضك الفوري في 60 ثانية',
    step1Desc: 'حدد نسبة الخصم، والعدد الأقصى للقسائم، ونطاق رادار المشاة (مثلاً 500 متر حول متجرك).',
    step2Num: '02',
    step2Title: 'تنبيه فوري للمتسوقين القريبين',
    step2Desc: 'يتلقى المتسوقون القريبون إشعاراً فورياً على هواتفهم مع مسافة المشي المباشرة لمتجرك.',
    step3Num: '03',
    step3Title: 'مسح وتأكيد القسيمة في ثانية واحدة',
    step3Desc: 'يبرز العميل قسيمته الرقمية عند الصندوق، لتقوم بمسح رمز QR بأي هاتف أو جهاز لوحي بثانية واحدة.',

    pricingEyebrow: 'خطط اشتراك شفافة ومناسبة للجميع',
    pricingHeading: 'باقات واضحة بدون عقود ملزمة تناسب كل نشاط تجاري',
    pricingSub: 'ابدأ بتجربة مجانية كاملة لمدة 14 يوماً بدون أي التزام، ويمكنك الإلغاء في أي وقت.',
    monthly: 'الدفع الشهري',
    annual: 'الدفع السنوي (وفّر 20%)',
    annualDiscountBadge: 'توفير 20%',
    popularBadge: 'الأكثر طلباً',
    perMonth: '/ شهرياً',
    startFreeTrialBtn: 'ابدأ التجربة المجانية 14 يوماً',
    tierStarter: 'باقة البداية (Starter)',
    tierStarterDesc: 'مثالية للمقاهي الفردية، والمخابز، والمتاجر الصغيرة المستقلة.',
    tierGrowth: 'باقة النمو (Growth)',
    tierGrowthDesc: 'مصممة للمطاعم المزدحمة، والمقاهي الشهيرة، والمحلات التجارية النشطة.',
    tierEnterprise: 'باقة الفروع والمؤسسات (Enterprise)',
    tierEnterpriseDesc: 'لمجموعات المطاعم الكبرى، والسلاسل التجارية، والعلامات المتعددة الفروع.',

    mobileSimTitle: 'تجربة تطبيق الجوال للمتسوقين',
    mobileSimDesc: 'شاهد كيف يكتشف المتسوقون العروض القريبة وكيف يقوم أصحاب الأعمال بمسح قسائم الخصم عبر تطبيق الهواتف الذكية.',
    consumerMode: 'وضع المتسوق (الزبون)',
    merchantMode: 'وضع صاحب العمل (إدارة المتجر)',
    deviceIphone: 'هاتف iPhone',
    devicePixel: 'هاتف Pixel',
    deviceFullscreen: 'ملء الشاشة',

    mobileDiscoverTitle: 'استكشف العروض القريبة منك',
    mobileDiscoverSub: 'خصومات حصرية تبعد خطوات معدودة عن موقعك',
    mobileSearchPlaceholder: 'ابحث عن قهوة، مطعم، حلويات، ملابس...',
    mobileFilterAll: 'جميع العروض',
    mobileFilterCafe: 'مقاهي وقهوة',
    mobileFilterRestaurant: 'مطاعم ومأكولات',
    mobileFilterBakery: 'مخابز وحلويات',
    mobileFilterRetail: 'تسوق وأزياء',
    mobileFilterServices: 'خدمات محلية',
    mobileRadiusFilter: 'رادار المسافة',
    mobileClaimDealBtn: 'احصل على قسيمة الخصم (QR)',
    mobileClaimedBadge: 'تم تفعيل القسيمة',
    mobileSavedBadge: 'محفوظ',
    mobileFollowMerchant: 'متابعة المتجر',
    mobileFollowing: 'متابع للمتجر',
    mobileQrVoucherTitle: 'أظهر الرمز عند الدفع',
    mobileQrInstructions: 'أظهر هذا الرمز لموظف الصندوق قبل الطلب لتطبيق الخصم فوراً.',
    mobileValidUntil: 'ينتهي العرض خلال',
    mobileOriginalPrice: 'السعر الأصلي',
    mobileOfferPrice: 'سعر العرض',
    mobileSavings: 'قيمة التوفير',
    mobileDistanceM: 'يبعد عنك',
    mobileCloseBtn: 'إغلاق',

    merchantDashboardTitle: 'لوحة إدارة صاحب العمل',
    merchantActiveDeals: 'العروض الحية النشطة',
    merchantNewDealBtn: '+ إنشاء عرض فوري جديد',
    merchantScanQrBtn: 'مسح قسيمة الزبون (QR)',
    merchantCreateDealHeading: 'إنشاء عرض فوري جديد لمدة 60 دقيقة',
    merchantDealTitleLabel: 'عنوان العرض (مثال: ☕ خصم 30% على قهوة بعد الظهر)',
    merchantDealDescLabel: 'تفاصيل وشروط العرض',
    merchantCategoryLabel: 'تصنيف النشاط',
    merchantDiscountLabel: 'نسبة الخصم (%)',
    merchantOriginalPriceLabel: 'السعر الأصلي ($)',
    merchantRadiusLabel: 'نطاق رادار المتجر (مسافة المشي)',
    merchantQuantityLabel: 'الحد الأقصى للقسائم (المخزون المتاح)',
    merchantPublishBtn: 'نشر العرض وإرسال الإشعارات الفورية',
    merchantScannerTitle: 'ماسح قسائم نقطة البيع (POS)',
    merchantScanPrompt: 'امسح رمز QR من هاتف الزبون لتأكيد الخصم:',
    merchantScanSuccess: 'تم التحقق من القسيمة وتطبيق الخصم بنجاح!',
    merchantAiReportBtn: 'عرض تقرير الأداء الذكي',
    merchantAiReportTitle: 'تحليلات الذكاء الاصطناعي للعرض',

    regTitle: 'انضم كصاحب عمل معتمد على منصة فرصتي',
    regSubtitle: 'ابدأ بجذب المتسوقين القريبين منك في أديلايد اليوم مع تجربة مجانية كاملة لمدة 14 يوماً.',
    regStep1: 'معلومات المتجر',
    regStep2: 'الخطة والاشتراك',
    regStep3: 'التأكيد والتفعيل',
    regFullName: 'اسم مالك أو مدير المتجر',
    regEmail: 'البريد الإلكتروني للعمل',
    regPhone: 'رقم الهاتف للتواصل (+61...)',
    regBizName: 'الاسم التجاري للمتجر',
    regAbn: 'رقم السجل التجاري الأسترالي (ABN)',
    regAbnHelp: '11 رقماً. يتم التحقق منه تلقائياً عبر السجل التجاري الحكومي الأسترالي (ABR).',
    regBizCategory: 'تصنيف النشاط الرئيسي',
    regBizAddress: 'العنوان الفعلي لمتجرك',
    regChoosePlan: 'اختر باقة الاشتراك',
    regTrialCallout: 'تشمل تجربة مجانية لمدة 14 يوماً: لا توجد أي رسوم خلال أول أسبوعين، ويمكنك الإلغاء في أي وقت بنقرة واحدة.',
    regSubmitBtn: 'إتمام التسجيل وبدء التجربة المجانية',
    regSuccessTitle: 'أهلاً بك في منصة فرصتي!',
    regSuccessDesc: 'تم تفعيل حساب متجرك بنجاح. يمكنك الآن نشر أول عرض فوري للمتسوقين القريبين.',

    footerDesc: 'فرصتي هي منصة أديلايد الرائدة لاكتشاف العروض الفورية الحية، تجمع المتاجر وأصحاب الأعمال والمتسوقين عبر إشعارات القرب الجغرافي الفورية.',
    footerRights: 'جميع الحقوق محفوظة. أديلايد، جنوب أستراليا.',
    footerPrivacy: 'سياسة الخصوصية',
    footerTerms: 'شروط الخدمة',
    footerCookies: 'تفضيلات ملفات تعريف الارتباط',
    footerSupport: 'دعم أصحاب الأعمال والشركاء',
    footerAdelaide: 'نطلق بفخر في وسط أديلايد التجاري (CBD) وشمال أديلايد'
  }
};
