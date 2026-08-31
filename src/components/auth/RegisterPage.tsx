import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Building2, 
  ShoppingBag, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  MapPin, 
  Sparkles, 
  Globe, 
  Store, 
  Tag, 
  Eye, 
  EyeOff, 
  KeyRound, 
  Check, 
  Smartphone,
  Fingerprint,
  Info,
  Clock,
  Compass
} from 'lucide-react';
import { DealCategory, SubscriptionTier } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

export const RegisterPage: React.FC = () => {
  const { 
    registerUser, 
    setViewMode, 
    setMobileRole, 
    language,
    t,
    isRtl
  } = useApp();

  // Registration Form State (Merchant is default on Web)
  const [accountType, setAccountType] = useState<'consumer' | 'business'>('business');
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [smsPhoneSent, setSmsPhoneSent] = useState(false);
  const [smsPhoneNumber, setSmsPhoneNumber] = useState('');
  
  // Credentials
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Business Specific
  const [businessName, setBusinessName] = useState('');
  const [abn, setAbn] = useState('51 824 753 556');
  const [abnVerified, setAbnVerified] = useState(true);
  const [businessCategory, setBusinessCategory] = useState<DealCategory>('cafe_coffee');
  const [businessAddress, setBusinessAddress] = useState('128 Rundle Mall, Adelaide SA 5000');
  const [website, setWebsite] = useState('https://mybusiness.com.au');
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('growth');

  // Consumer Specific
  const [consumerRadius, setConsumerRadius] = useState(3000);
  const [consumerSuburb, setConsumerSuburb] = useState('Adelaide CBD');
  const [selectedCategories, setSelectedCategories] = useState<DealCategory[]>([
    'cafe_coffee', 
    'restaurant_dining'
  ]);
  const [pushOptIn, setPushOptIn] = useState(true);

  // Verification & Terms
  const [otpCode, setOtpCode] = useState(['1', '2', '3', '4', '5', '6']);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(true);
  
  // Submission & Validation
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredUser, setRegisteredUser] = useState<any>(null);

  // Password Strength Calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: language === 'ar' ? 'فارغ' : 'None', color: 'bg-slate-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    if (score <= 1) return { score, label: language === 'ar' ? 'ضعيفة' : 'Weak', color: 'bg-rose-500' };
    if (score === 2 || score === 3) return { score, label: language === 'ar' ? 'جيدة' : 'Good', color: 'bg-amber-500' };
    return { score: 4, label: language === 'ar' ? 'قوية' : 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const toggleCategory = (cat: DealCategory) => {
    if (selectedCategories.includes(cat)) {
      if (selectedCategories.length > 1) {
        setSelectedCategories(selectedCategories.filter(c => c !== cat));
      }
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim()) {
      setErrorMessage(language === 'ar' ? 'يرجى إدخال الاسم الكامل.' : 'Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage(language === 'ar' ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage(language === 'ar' ? 'يجب أن تتكون كلمة المرور من 6 خانات على الأقل.' : 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(language === 'ar' ? 'كلمات المرور غير متطابقة.' : 'Passwords do not match.');
      return;
    }

    setStep(2);
  };

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (accountType === 'business') {
      if (!businessName.trim()) {
        setErrorMessage(language === 'ar' ? 'يرجى إدخال اسم المتجر التجاري.' : 'Please enter your Business Trading Name.');
        return;
      }
      if (!abn.trim()) {
        setErrorMessage(language === 'ar' ? 'يرجى تقديم رقم السجل التجاري (ABN).' : 'Please provide your Australian Business Number (ABN).');
        return;
      }
    }

    setStep(3);
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreedToTerms || !agreedToPrivacy) {
      setErrorMessage(language === 'ar' ? 'يجب الموافقة على شروط الاستخدام وسياسة الخصوصية.' : 'You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    const payload = {
      accountType,
      fullName,
      email,
      phone: phone || '+61 400 123 456',
      password,
      preferredRadiusM: consumerRadius,
      favouriteCategories: selectedCategories,
      suburb: accountType === 'consumer' ? consumerSuburb : 'Adelaide CBD',
      businessName,
      abn,
      businessCategory,
      businessAddress,
      subscriptionTier,
      website
    };

    const newUser = registerUser(payload);
    setRegisteredUser(newUser);
    setStep(4);
  };

  const handleSocialSignUp = (provider: 'Google' | 'Apple') => {
    const mockEmail = provider === 'Google' ? 'merchant.google@example.com' : 'merchant.apple@icloud.com';
    const mockName = provider === 'Google' ? (language === 'ar' ? 'مستخدم مسجل عبر جوجل' : 'Google Authenticated User') : (language === 'ar' ? 'مستخدم مسجل عبر أبل' : 'Apple Member');
    
    const payload = {
      accountType,
      fullName: fullName || mockName,
      email: email || mockEmail,
      phone: '+61 400 987 654',
      preferredRadiusM: 3000,
      favouriteCategories: ['cafe_coffee', 'restaurant_dining'] as DealCategory[],
      suburb: 'Adelaide CBD',
      businessName: accountType === 'business' ? (businessName || (language === 'ar' ? 'مقهى ومحمصة أديلايد' : 'Adelaide Artisan Roastery')) : undefined,
      abn: '51824753556',
      businessCategory: 'cafe_coffee' as DealCategory,
      subscriptionTier: 'growth' as SubscriptionTier
    };

    const newUser = registerUser(payload);
    setRegisteredUser(newUser);
    setStep(4);
  };

  const categoriesList: { id: DealCategory; label: string; icon: string }[] = [
    { id: 'cafe_coffee', label: t('mobileFilterCafe'), icon: '☕' },
    { id: 'restaurant_dining', label: t('mobileFilterRestaurant'), icon: '🍽️' },
    { id: 'retail_fashion', label: t('mobileFilterRetail'), icon: '🛍️' },
    { id: 'beauty_wellness', label: t('mobileFilterServices'), icon: '✨' },
    { id: 'entertainment_events', label: language === 'ar' ? 'فعاليات وترفيه' : 'Entertainment', icon: '🎟️' },
    { id: 'services_auto', label: language === 'ar' ? 'خدمات محلية' : 'Local Services', icon: '🔧' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Container */}
      <div className="max-w-5xl mx-auto">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200/80 mb-8">
          <button
            id="btn-back-to-home"
            onClick={() => setViewMode('marketing')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            {t('navHome')}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">
              {language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already registered?'}
            </span>
            <button
              id="btn-switch-to-login"
              onClick={() => {
                setViewMode('mobile');
                setMobileRole('business');
              }}
              className="text-xs font-bold text-slate-900 hover:text-amber-800 transition-colors"
            >
              {t('signInBtn')}
            </button>
          </div>
        </div>

        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10 flex flex-col items-center">
          <div className="mb-4">
            <BrandLogo 
              variant="full" 
              size="lg" 
              showTagline={true} 
              subLabel={accountType === 'business' ? 'MERCHANT' : 'RADAR'} 
            />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-xs font-semibold text-amber-900 shadow-xs mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>{t('heroBadge')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 tracking-tight">
            {accountType === 'business' 
              ? (language === 'ar' ? 'تسجيل حساب صاحب عمل جديد' : 'Register Your Business Owner Account')
              : (language === 'ar' ? 'تطبيق فرصتي للمتسوقين (للهواتف الذكية)' : 'FORSA-T Consumer Mobile App')}
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            {accountType === 'business' 
              ? (language === 'ar' ? 'انضم إلى شبكة أصحاب الأعمال في أديلايد لنشر عروض فورية واستقطاب الزبائن في أقل من 60 ثانية.' : 'Join Adelaide local business owners publishing geofenced flash deals delivered to nearby walk-ins in under 60 seconds.')
              : (language === 'ar' ? 'تطبيق المتسوقين مخصص للهواتف الذكية (iOS & Android) لتوفير رادار الموقع وتنبيهات العروض الحية.' : 'The FORSA-T consumer experience is strictly mobile-only (iOS & Android) for real-time GPS radar and instant push notifications.')}
          </p>
        </div>

        {/* Step 4: SUCCESS VIEW */}
        {step === 4 && (
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-xs text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-semibold">
                {language === 'ar' ? 'تم اكتمال التسجيل بنجاح ✓' : 'REGISTRATION COMPLETED ✓'}
              </span>
              <h2 className="text-2xl font-heading font-bold text-slate-900 mt-1">
                {language === 'ar' ? `مرحباً بك في فرصتي، ${fullName || 'شريكنا العزيز'}!` : `Welcome to FORSA-T, ${fullName || 'Member'}!`}
              </h2>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {language === 'ar' 
                  ? `تم تفعيل حسابك (${email}) بنجاح، وتأكيد السجل التجاري والبدء بفترة التجربة المجانية لمدة 14 يوماً.` 
                  : `Your account (${email}) is active with verified business registration and a 14-day zero-risk trial.`}
              </p>
            </div>

            {/* Account Summary Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-start text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">{language === 'ar' ? 'معرّف الحساب:' : 'Account ID:'}</span>
                <span className="font-mono font-semibold text-slate-900">{registeredUser?.id || 'usr_registered'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">{language === 'ar' ? 'نوع الحساب:' : 'Account Role:'}</span>
                <span className="font-semibold text-sky-800 uppercase">
                  {accountType === 'business' ? `${subscriptionTier} ${language === 'ar' ? 'صاحب عمل' : 'Business Owner'}` : (language === 'ar' ? 'متسوق' : 'Consumer')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">{language === 'ar' ? 'المنطقة:' : 'Primary Region:'}</span>
                <span className="text-slate-700">Adelaide CBD &amp; Metro</span>
              </div>
            </div>

            {/* Launch Buttons */}
            <div className="space-y-3 pt-2">
              <button
                id="btn-launch-registered-view"
                onClick={() => {
                  setViewMode('mobile');
                  setMobileRole(accountType === 'business' ? 'business' : 'consumer');
                }}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2"
              >
                {accountType === 'business' 
                  ? (language === 'ar' ? 'فتح لوحة تحكم صاحب العمل ونشر أول عرض' : 'Open Business Owner Dashboard') 
                  : (language === 'ar' ? 'فتح رادار العروض للمتسوقين' : 'Launch Consumer Deal Radar')}
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {/* Steps 1, 2, 3: MAIN REGISTRATION FLOW */}
        {step !== 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Multi-Step Form */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
              
              {/* Progress Stepper */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100 mb-6">
                {[
                  { num: 1, title: language === 'ar' ? 'البيانات الأساسية' : 'Credentials' },
                  { num: 2, title: accountType === 'business' ? (language === 'ar' ? 'ملف المتجر' : 'Business Profile') : (language === 'ar' ? 'التفضيلات' : 'Preferences') },
                  { num: 3, title: language === 'ar' ? 'التأكيد والأمان' : 'Verification' }
                ].map((s, idx) => (
                  <div key={s.num} className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step === s.num 
                        ? 'bg-slate-900 text-white' 
                        : step > s.num 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}>
                      {step > s.num ? '✓' : s.num}
                    </div>
                    <span className={`text-xs font-semibold hidden sm:inline ${
                      step === s.num ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {s.title}
                    </span>
                    {idx < 2 && <div className="w-8 h-0.5 bg-slate-100 hidden sm:block"></div>}
                  </div>
                ))}
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2 text-start">
                  <Info className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* STEP 1: ACCOUNT TYPE & BASIC CREDENTIALS */}
              {step === 1 && (
                <div>
                  
                  {/* Account Type Selector */}
                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono text-start">
                      {language === 'ar' ? 'اختر نوع الحساب' : 'Select Account Type'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      {/* Business Choice (Primary Web Portal) */}
                      <button
                        type="button"
                        id="btn-select-type-business"
                        onClick={() => setAccountType('business')}
                        className={`p-4 rounded-2xl border text-start transition-all relative ${
                          accountType === 'business'
                            ? 'bg-amber-50/70 border-amber-300 shadow-xs ring-1 ring-amber-300'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                            <Store className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-slate-900 block">
                              {language === 'ar' ? 'حساب صاحب عمل ومتجر' : 'Business Owner Registration'}
                            </span>
                            <span className="text-[10px] text-amber-800 font-semibold uppercase">
                              {language === 'ar' ? 'تجربة مجانية 14 يوماً' : 'Web & Mobile • 14-Day Free'}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600">
                          {language === 'ar' 
                            ? 'سجل نشاطك للبدء بنشر العروض الفورية، وإدارة القسائم، وتحليلات الذكاء الاصطناعي.'
                            : 'Register your business on web: deal publisher, proximity geofence & AI analytics.'}
                        </p>
                      </button>

                      {/* Consumer Choice (Mobile-Only Experience) */}
                      <button
                        type="button"
                        id="btn-select-type-consumer"
                        onClick={() => setAccountType('consumer')}
                        className={`p-4 rounded-2xl border text-start transition-all relative ${
                          accountType === 'consumer'
                            ? 'bg-sky-50/70 border-sky-300 shadow-xs ring-1 ring-sky-300'
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 rounded-xl bg-sky-100 text-sky-900">
                            <Smartphone className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-sm text-slate-900 block">
                              {language === 'ar' ? 'تطبيق المتسوقين' : 'Consumer Shopper App'}
                            </span>
                            <span className="text-[10px] text-sky-800 font-semibold uppercase">
                              {language === 'ar' ? 'للهواتف الذكية (iOS و Android)' : 'Mobile Only (iOS & Android)'}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600">
                          {language === 'ar'
                            ? 'يعمل تطبيق المتسوقين على الهواتف لتوفير رادار الموقع وتنبيهات العروض الحية.'
                            : 'Consumer deals operate strictly on mobile for GPS radar, camera QR scans & alerts.'}
                        </p>
                      </button>

                    </div>
                  </div>

                  {/* CONSUMER MOBILE-ONLY PORTAL */}
                  {accountType === 'consumer' && (
                    <div className="space-y-6 text-start">
                      
                      <div className="p-5 bg-sky-50/80 border border-sky-200 rounded-2xl">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-sky-100 text-sky-900 rounded-xl mt-0.5">
                            <Smartphone className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-heading font-bold text-base text-slate-900">
                              {language === 'ar' ? 'عروض المتسوقين متاحة حصرياً عبر الهواتف الذكية' : 'Consumer Deals are Exclusively on Mobile'}
                            </h3>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {language === 'ar'
                                ? 'لضمان الاستفادة من رادار الموقع الفوري وتلقي تنبيهات العروض اللحظية أثناء تجولك في المدينة، تم تصميم تطبيق المتسوقين خصيصاً لهواتف iOS و Android.'
                                : 'To support live GPS radar and guarantee instant push notifications when walking past discounted stores, the FORSA-T consumer app is built specifically for iOS and Android devices.'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Simulator Quick Launch */}
                      <div className="p-5 bg-white border-2 border-slate-900 rounded-2xl shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Compass className="w-5 h-5 text-amber-600 animate-spin-slow" />
                            <span className="font-heading font-bold text-sm text-slate-900">
                              {language === 'ar' ? 'تجربة تطبيق المتسوق في محاكي المتصفح' : 'Try Consumer Mobile App in Browser Simulator'}
                            </span>
                          </div>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                            {language === 'ar' ? 'محاكاة حية' : 'Live Demo'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          {language === 'ar' 
                            ? 'جرّب رادار العروض التفاعلي واستعراض القسائم ورموز QR في محاكي الهاتف مباشرة.' 
                            : 'Test the real-time Adelaide GPS Deal Radar, interactive category filters, and instant QR redemptions directly in our interactive mobile simulator.'}
                        </p>
                        <button
                          id="btn-launch-consumer-simulator"
                          onClick={() => {
                            setViewMode('mobile');
                            setMobileRole('consumer');
                          }}
                          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2"
                        >
                          <Smartphone className="w-4 h-4" />
                          <span>{t('heroMobileBtn')}</span>
                          <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                        </button>
                      </div>

                      {/* Switch to Merchant Option */}
                      <div className="pt-2 text-center">
                        <span className="text-xs text-slate-500">
                          {language === 'ar' ? 'هل أنت صاحب متجر وترغب بنشر عروضك؟ ' : 'Are you a local business owner looking to publish deals? '}
                        </span>
                        <button
                          type="button"
                          onClick={() => setAccountType('business')}
                          className="text-xs font-bold text-slate-900 hover:text-amber-800 underline transition-colors"
                        >
                          {language === 'ar' ? 'سجل حساب متجرك عبر الويب ←' : 'Register your Merchant Store on Web →'}
                        </button>
                      </div>

                    </div>
                  )}

                  {/* MERCHANT WEB REGISTRATION - STEP 1 */}
                  {accountType === 'business' && (
                    <form onSubmit={handleNextStep1} className="space-y-5 text-start">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          {language === 'ar' ? 'الاسم الكامل' : 'Full Name'} <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <User className={`w-4 h-4 absolute top-3 text-slate-400 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
                          <input
                            id="input-reg-fullname"
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder={language === 'ar' ? 'مثال: أميرة منصور' : 'e.g. Amira Mansour / Jordan Taylor'}
                            className={`w-full py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 ${
                              isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Email & Phone */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Mail className={`w-4 h-4 absolute top-3 text-slate-400 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
                            <input
                              id="input-reg-email"
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="name@business.com.au"
                              className={`w-full py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 ${
                                isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                              }`}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            {language === 'ar' ? 'رقم الهاتف المحمول' : 'Mobile Phone'}
                          </label>
                          <div className="relative">
                            <Phone className={`w-4 h-4 absolute top-3 text-slate-400 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
                            <input
                              id="input-reg-phone"
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+61 400 123 456"
                              className={`w-full py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 ${
                                isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Password & Confirmation */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            {language === 'ar' ? 'كلمة المرور' : 'Password'} <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <Lock className={`w-4 h-4 absolute top-3 text-slate-400 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
                            <input
                              id="input-reg-password"
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder={language === 'ar' ? '6 خانات على الأقل' : 'Min 6 characters'}
                              className={`w-full py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 ${
                                isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className={`absolute top-3 text-slate-400 hover:text-slate-600 ${isRtl ? 'left-3' : 'right-3'}`}
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>

                          {/* Password strength bar */}
                          {password && (
                            <div className="mt-1.5 flex items-center gap-2">
                              <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden flex gap-1">
                                <div className={`h-full flex-1 ${strength.score >= 1 ? strength.color : 'bg-slate-200'}`} />
                                <div className={`h-full flex-1 ${strength.score >= 2 ? strength.color : 'bg-slate-200'}`} />
                                <div className={`h-full flex-1 ${strength.score >= 3 ? strength.color : 'bg-slate-200'}`} />
                                <div className={`h-full flex-1 ${strength.score >= 4 ? strength.color : 'bg-slate-200'}`} />
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono">{strength.label}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            {language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'} <span className="text-rose-500">*</span>
                          </label>
                          <div className="relative">
                            <KeyRound className={`w-4 h-4 absolute top-3 text-slate-400 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
                            <input
                              id="input-reg-confirm-password"
                              type={showPassword ? 'text' : 'password'}
                              required
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder={language === 'ar' ? 'أعد كتابة كلمة المرور' : 'Repeat password'}
                              className={`w-full py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 ${
                                isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                              }`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Social Sign Up Options */}
                      <div className="pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                          <span>{language === 'ar' ? 'أو التسجيل السريع بنقرة واحدة:' : 'Or register with instant 1-tap OAuth2:'}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => handleSocialSignUp('Google')}
                            className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 shadow-xs transition-colors"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                            </svg>
                            Google
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSocialSignUp('Apple')}
                            className="py-2.5 px-3 bg-black hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.82 1.11-1.96.99-3.1-.96.04-2.12.64-2.8 1.44-.59.69-1.12 1.83-.98 2.94 1.08.08 2.13-.53 2.79-1.28z"/>
                            </svg>
                            Apple ID
                          </button>
                        </div>
                      </div>

                      {/* Step 1 Submit Button */}
                      <button
                        id="btn-next-step-1"
                        type="submit"
                        className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all shadow-xs flex items-center justify-center gap-2 mt-4"
                      >
                        {language === 'ar' ? 'المتابعة لبيانات المتجر والتحقق' : 'Continue to Business Profile'}
                        <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                      </button>

                    </form>
                  )}
                </div>
              )}

              {/* STEP 2: ROLE SPECIFIC CUSTOMIZATION */}
              {step === 2 && (
                <form onSubmit={handleNextStep2} className="space-y-5 text-start">
                  
                  {accountType === 'business' ? (
                    <>
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <div>
                          <h3 className="font-heading font-bold text-base text-slate-900">
                            {language === 'ar' ? 'بيانات المتجر ورقم السجل التجاري (ABN)' : 'Merchant Details & ABN Verification'}
                          </h3>
                          <p className="text-xs text-slate-500">
                            {language === 'ar' ? 'التحقق الآلي من السجل التجاري الأسترالي المعتمد' : 'Australian Business Register (ABR) automated validation'}
                          </p>
                        </div>
                      </div>

                      {/* Business Trading Name */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          {language === 'ar' ? 'اسم المتجر التجاري' : 'Business Trading Name'} <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <Store className={`w-4 h-4 absolute top-3 text-slate-400 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
                          <input
                            id="input-reg-bizname"
                            type="text"
                            required
                            value={businessName}
                            onChange={(e) => setBusinessName(e.target.value)}
                            placeholder={language === 'ar' ? 'مثال: محمصة ومقهى أميرة' : "e.g. Amira's Specialty Roastery"}
                            className={`w-full py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 ${
                              isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                            }`}
                          />
                        </div>
                      </div>

                      {/* ABN & Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-xs font-medium text-slate-700">
                              {language === 'ar' ? 'رقم السجل التجاري (ABN)' : 'Australian Business Number (ABN)'}
                            </label>
                            {abnVerified && (
                              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                                <CheckCircle2 className="w-3 h-3" /> {language === 'ar' ? 'نشط ومعتمد' : 'ABR Active'}
                              </span>
                            )}
                          </div>
                          <input
                            id="input-reg-abn"
                            type="text"
                            required
                            value={abn}
                            onChange={(e) => setAbn(e.target.value)}
                            placeholder="51 824 753 556"
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 font-mono focus:outline-none focus:border-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            {language === 'ar' ? 'تصنيف النشاط' : 'Industry Category'}
                          </label>
                          <select
                            id="select-reg-category"
                            value={businessCategory}
                            onChange={(e) => setBusinessCategory(e.target.value as DealCategory)}
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-slate-900"
                          >
                            <option value="cafe_coffee">{t('mobileFilterCafe')}</option>
                            <option value="restaurant_dining">{t('mobileFilterRestaurant')}</option>
                            <option value="retail_fashion">{t('mobileFilterRetail')}</option>
                            <option value="beauty_wellness">{t('mobileFilterServices')}</option>
                          </select>
                        </div>
                      </div>

                      {/* Primary Adelaide Branch Location */}
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          {language === 'ar' ? 'عنوان الفرع الرئيسي' : 'Primary Branch Address'}
                        </label>
                        <div className="relative">
                          <MapPin className={`w-4 h-4 absolute top-3 text-slate-400 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
                          <input
                            id="input-reg-address"
                            type="text"
                            value={businessAddress}
                            onChange={(e) => setBusinessAddress(e.target.value)}
                            placeholder="128 Rundle Mall, Adelaide SA 5000"
                            className={`w-full py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 ${
                              isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                            }`}
                          />
                        </div>
                      </div>

                      {/* Subscription Tier Selection */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
                          {language === 'ar' ? 'اختر الباقة (تجربة مجانية 14 يوماً)' : 'Select Plan (14-Day Free Trial)'}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {[
                            { id: 'starter', name: language === 'ar' ? 'باقة البداية' : 'Starter', price: '$0', desc: t('tierStarterDesc') },
                            { id: 'growth', name: language === 'ar' ? 'باقة النمو' : 'Growth', price: '$149/mo', desc: t('tierGrowthDesc') },
                            { id: 'enterprise', name: language === 'ar' ? 'المؤسسات' : 'Enterprise', price: '$499/mo', desc: t('tierEnterpriseDesc') }
                          ].map((tPlan) => (
                            <div
                              key={tPlan.id}
                              onClick={() => setSubscriptionTier(tPlan.id as SubscriptionTier)}
                              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                                subscriptionTier === tPlan.id
                                  ? 'bg-amber-50/80 border-amber-300 shadow-xs ring-1 ring-amber-300'
                                  : 'bg-white border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-xs text-slate-900">{tPlan.name}</span>
                                <span className="font-mono text-xs font-semibold text-slate-700">{tPlan.price}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 leading-tight">{tPlan.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {language === 'ar' ? '← السابق' : '← Back'}
                    </button>

                    <button
                      id="btn-next-step-2"
                      type="submit"
                      className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all shadow-xs flex items-center gap-2"
                    >
                      {language === 'ar' ? 'المتابعة للتأكيد' : 'Continue to Verification'}
                      <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                </form>
              )}

              {/* STEP 3: OTP VERIFICATION & LEGAL TERMS */}
              {step === 3 && (
                <form onSubmit={handleCompleteRegistration} className="space-y-5 text-start">
                  
                  <div className="text-center py-2">
                    <div className="w-12 h-12 bg-sky-50 text-sky-800 border border-sky-200 rounded-2xl flex items-center justify-center mx-auto mb-2">
                      <Mail className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-slate-900">
                      {language === 'ar' ? 'رمز التحقق والتأكيد (OTP)' : 'Security & Verification'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {language === 'ar' 
                        ? `تم إرسال رمز التحقق إلى بريدك الإلكتروني: ${email || 'بريدك الإلكتروني'}`
                        : `We sent a one-time verification token to ${email || 'your email'}`}
                    </p>
                  </div>

                  {/* OTP Digits */}
                  <div className="flex justify-center gap-2 py-2">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const newCode = [...otpCode];
                          newCode[idx] = e.target.value;
                          setOtpCode(newCode);
                        }}
                        className="w-10 h-12 text-center text-lg font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl focus:border-slate-900 focus:outline-none text-slate-900"
                      />
                    ))}
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setOtpCode(['1', '2', '3', '4', '5', '6'])}
                      className="text-xs font-semibold text-amber-800 hover:underline"
                    >
                      {language === 'ar' ? 'ملء رمز التجربة السريع (123456)' : 'Fill Demo Passcode (123456)'}
                    </button>
                  </div>

                  {/* Consents & Terms */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                    <label className="flex items-start gap-2.5 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="mt-0.5 rounded text-slate-900 focus:ring-slate-900"
                      />
                      <span>
                        {language === 'ar' ? 'أوافق على ' : 'I accept the '}
                        <strong className="text-slate-900">{language === 'ar' ? 'شروط وأحكام منصة فرصتي' : 'FORSA-T Terms of Service'}</strong>
                        {language === 'ar' ? ' وسياسة الاستخدام العادل وتوصيل العروض الفورية.' : ', Business Owner SLA, and Fair Deal Policy.'}
                      </span>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer text-slate-700">
                      <input
                        type="checkbox"
                        checked={agreedToPrivacy}
                        onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                        className="mt-0.5 rounded text-slate-900 focus:ring-slate-900"
                      />
                      <span>
                        {language === 'ar' ? 'أوافق على ' : 'I consent to the '}
                        <strong className="text-slate-900">{language === 'ar' ? 'سياسة الخصوصية وحماية البيانات' : 'Privacy Policy'}</strong>
                        {language === 'ar' ? ' (المتوافقة مع معايير حماية البيانات الأسترالية).' : ' (Australian Privacy Principles compliant).'}
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {language === 'ar' ? '← السابق' : '← Back'}
                    </button>

                    <button
                      id="btn-complete-registration"
                      type="submit"
                      className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all shadow-xs flex items-center gap-2"
                    >
                      {language === 'ar' ? 'إنشاء الحساب وبدء التجربة' : 'Create Account & Start Trial'}
                      <Check className="w-4 h-4 text-emerald-400" />
                    </button>
                  </div>

                </form>
              )}

            </div>

            {/* Right Column: Live Registration Preview & SLA Guarantee Card */}
            <div className="lg:col-span-5 space-y-4 text-start">
              
              {/* Live Preview Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold font-mono uppercase text-slate-400">
                    {language === 'ar' ? 'معاينة فورية للملف' : 'Live Profile Preview'}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-semibold rounded-full border border-emerald-200">
                    {language === 'ar' ? 'جاهز للتفعيل' : 'Ready to Provision'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-heading font-extrabold text-lg">
                    {fullName ? fullName.charAt(0).toUpperCase() : 'B'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      {businessName || fullName || (language === 'ar' ? 'حساب صاحب عمل جديد' : 'Local Business Owner Account')}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {email || 'owner@adelaidebusiness.com.au'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">{language === 'ar' ? 'اسم المتجر:' : 'Business:'}</span>
                    <span className="font-semibold text-slate-900">{businessName || (language === 'ar' ? 'اسم متجرك' : 'Your Trading Name')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{language === 'ar' ? 'السجل التجاري:' : 'ABN Verification:'}</span>
                    <span className="font-mono text-emerald-700 font-semibold">{abnVerified ? (language === 'ar' ? 'معتمد رسمياً ✓' : 'ABR Active ✓') : 'Auto-Validating'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">{language === 'ar' ? 'الباقة:' : 'Plan Tier:'}</span>
                    <span className="font-semibold text-amber-900 uppercase">
                      {subscriptionTier} ({language === 'ar' ? '14 يوماً مجاناً' : '14-Day Free'})
                    </span>
                  </div>
                </div>
              </div>

              {/* SLA & Security Trust Card */}
              <div className="p-5 bg-slate-100/80 border border-slate-200 rounded-3xl space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-sky-700" />
                  {language === 'ar' ? 'ضمانات الأداء والخدمة' : 'Service Guarantees'}
                </h4>

                <div className="space-y-2 text-slate-600">
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>{language === 'ar' ? 'تنبيهات فورية في أقل من 60 ثانية:' : 'Instant Alerts Dispatch (<60s):'}</strong> {language === 'ar' ? 'تصل العروض لهواتف المتسوقين القريبين فور نشرها.' : 'Deals reach nearby active shopper devices in under a minute.'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>{language === 'ar' ? 'حماية وأمان البيانات:' : 'Data Privacy & Security:'}</strong> {language === 'ar' ? 'التزام كامل بقوانين الخصوصية الأسترالية وحماية بيانات العملاء.' : 'Complying with Australian Privacy Principles.'}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span><strong>{language === 'ar' ? 'تجربة مجانية بلا مخاطرة لمدة 14 يوماً:' : '14-Day Zero-Risk Free Trial:'}</strong> {language === 'ar' ? 'إلغاء بنقرة واحدة في أي وقت دون أي التزام.' : 'Cancel anytime with 1-click self-service in your account settings.'}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
