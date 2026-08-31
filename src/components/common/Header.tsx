import React, { useState, useEffect, useRef } from 'react';
import { useApp, AppViewMode } from '../../context/AppContext';
import { 
  Building2, 
  Smartphone, 
  Globe, 
  UserPlus,
  ChevronDown, 
  CheckCircle, 
  MapPin,
  Flame,
  Layers,
  Menu,
  X,
  QrCode,
  Shield,
  Percent,
  Sliders,
  TrendingUp,
  LogIn,
  Store,
  Compass,
  CreditCard,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import { CurrencyCode } from '../../types';
import { BrandLogo } from './BrandLogo';

export const Header: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    currentUser, 
    activeCurrency, 
    setActiveCurrency, 
    systemHealth,
    mobileRole,
    setMobileRole,
    language,
    setLanguage,
    t,
    isRtl
  } = useApp();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSolutionsDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    if (viewMode !== 'marketing') {
      setViewMode('marketing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const navigateToMobileApp = (role: 'consumer' | 'business') => {
    setMobileRole(role);
    setViewMode('mobile');
    setSolutionsDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navigateToAdmin = () => {
    setViewMode('admin');
    setSolutionsDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navigateToBusinessPortal = () => {
    setViewMode('business_portal');
    setSolutionsDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const isAr = language === 'ar';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Left: Brand Logo & City Location */}
            <div className="flex items-center gap-6 shrink-0">
              <button 
                id="header-brand-logo-btn"
                onClick={() => { setViewMode('marketing'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
                title="FORSA-T - Real-Time Geofenced Deals"
              >
                <BrandLogo 
                  variant="horizontal" 
                  size="md" 
                  showTagline={false}
                  subLabel={isAr ? 'عروض حية' : 'RADAR'} 
                />
                
              </button>

              {/* Main Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">
                <button
                  id="nav-link-deals"
                  onClick={() => handleScrollToSection('live-radar')}
                  className={`px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors ${
                    viewMode === 'marketing' ? 'text-slate-900 font-semibold' : ''
                  }`}
                >
                  {isAr ? 'استكشف العروض' : 'Explore Deals'}
                </button>

                <button
                  id="nav-link-how-it-works"
                  onClick={() => handleScrollToSection('how-it-works')}
                  className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  {isAr ? 'كيف تعمل المنصة' : 'How It Works'}
                </button>

                <button
                  id="nav-link-for-business"
                  onClick={() => handleScrollToSection('for-business')}
                  className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  {isAr ? 'لأصحاب الأعمال' : 'For Businesses'}
                </button>

                <button
                  id="nav-link-pricing"
                  onClick={() => handleScrollToSection('pricing')}
                  className="px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  {isAr ? 'الباقات والأسعار' : 'Pricing'}
                </button>

                {/* Solutions & Apps Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    id="nav-dropdown-solutions-btn"
                    onClick={() => setSolutionsDropdownOpen(!solutionsDropdownOpen)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:text-slate-900 hover:bg-slate-50 transition-colors"
                  >
                    <span>{isAr ? 'المنتجات والتطبيقات' : 'Apps & Portals'}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${solutionsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {solutionsDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1.5 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1">
                      <div className="p-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {isAr ? 'بيئة العمل الميدانية' : 'Platform Ecosystem'}
                      </div>
                      
                      <button
                        onClick={navigateToBusinessPortal}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{isAr ? 'لوحة تحكم صاحب العمل' : 'Business Owner Deal Hub'}</span>
                            <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-bold">New</span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {isAr ? 'إنشاء وإدارة العروض وتحديد الرادار الجغرافي' : 'Create deals, map geofences & POS'}
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => navigateToMobileApp('consumer')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                          <Smartphone className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                            <span>{isAr ? 'تطبيق المتسوقين (PWA)' : 'Shopper Deal App'}</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-bold">50m-5km</span>
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {isAr ? 'رادار العروض القريبة والتنبيهات الموقعية' : 'Nearby radar, geofence deals & claims'}
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => navigateToMobileApp('business')}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                          <QrCode className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900">
                            {isAr ? 'تطبيق صاحب العمل والمسح السريع' : 'Business Owner POS & Scanner'}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {isAr ? 'مسح رمز QR وتأكيد الخصم المباشر' : 'Instant in-store QR code validation'}
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={navigateToAdmin}
                        className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-900">
                            {isAr ? 'بوابة العمليات والإدارة' : 'Operations & Admin Portal'}
                          </div>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {isAr ? 'لوحة تحكم المنصة والتحليلات الجغرافية' : 'Platform governance, SLA & analytics'}
                          </p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* Right: Actions, Auth & Navigation */}
            <div className="flex items-center gap-2.5">

              {/* Sign In Button */}
              <button
                id="btn-header-signin"
                onClick={() => setAuthModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
              </button>

              {/* Primary Call to Action: List Your Business */}
              <button
                id="btn-header-cta"
                onClick={() => setViewMode('register')}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span className="whitespace-nowrap">{isAr ? 'سجّل متجرك (مجاناً)' : 'List Your Business'}</span>
              </button>

              {/* User Avatar Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  id="btn-user-profile-menu"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-amber-400/50 transition-all focus:outline-none"
                  aria-label="User profile and settings"
                >
                  <img 
                    src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                    alt={currentUser.fullName}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200" 
                  />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="p-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.fullName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-md text-[10px] font-semibold uppercase font-mono">
                        {currentUser.role.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <button
                        onClick={() => { setViewMode('business_portal'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-800 font-bold bg-amber-50/70 hover:bg-amber-100/70 text-amber-950 rounded-xl transition-colors text-left"
                      >
                        <Store className="w-3.5 h-3.5 text-amber-700" />
                        <span>{isAr ? 'لوحة تحكم صاحب العمل' : 'Business Owner Deal Hub'}</span>
                      </button>

                      <button
                        onClick={() => { setViewMode('admin'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors text-left"
                      >
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{isAr ? 'لوحة التحكم الإدارية' : 'Admin Operations'}</span>
                      </button>

                      <button
                        onClick={() => { setMobileRole('business'); setViewMode('mobile'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors text-left"
                      >
                        <QrCode className="w-3.5 h-3.5 text-slate-400" />
                        <span>{isAr ? 'تطبيق صاحب العمل ومسح الكوبونات' : 'Business Owner POS Scanner'}</span>
                      </button>

                      <button
                        onClick={() => { setMobileRole('consumer'); setViewMode('mobile'); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors text-left"
                      >
                        <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{isAr ? 'تطبيق المتسوقين' : 'Shopper Deals App'}</span>
                      </button>

                      <button
                        onClick={() => { setAuthModalOpen(true); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors text-left"
                      >
                        <Shield className="w-3.5 h-3.5 text-slate-400" />
                        <span>{isAr ? 'إعدادات الحساب والأمان' : 'Account & Security Settings'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Toggle */}
              <button
                id="btn-mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer / Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2">
            <nav className="space-y-1">
              <button
                onClick={() => handleScrollToSection('live-radar')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-800 text-left"
              >
                <span>{isAr ? 'استكشف العروض الحية' : 'Explore Live Deals'}</span>
                <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">50m-5km</span>
              </button>

              <button
                onClick={() => handleScrollToSection('how-it-works')}
                className="w-full p-2.5 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-800 text-left"
              >
                {isAr ? 'كيف تعمل المنصة' : 'How It Works'}
              </button>

              <button
                onClick={() => handleScrollToSection('for-business')}
                className="w-full p-2.5 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-800 text-left"
              >
                {isAr ? 'لأصحاب الأعمال' : 'For Businesses'}
              </button>

              <button
                onClick={() => handleScrollToSection('pricing')}
                className="w-full p-2.5 rounded-xl hover:bg-slate-50 text-sm font-medium text-slate-800 text-left"
              >
                {isAr ? 'الباقات والأسعار' : 'Pricing & Plans'}
              </button>
            </nav>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
                {isAr ? 'التطبيقات وبوابات العمل' : 'Portals & Applications'}
              </p>

              <button
                onClick={navigateToBusinessPortal}
                className="w-full flex items-center gap-3 p-2 rounded-xl bg-amber-50/80 border border-amber-200 text-xs font-bold text-amber-950 text-left"
              >
                <Store className="w-4 h-4 text-amber-700" />
                <span>{isAr ? 'لوحة تحكم صاحب العمل' : 'Business Owner Deal Hub'}</span>
              </button>

              <button
                onClick={() => navigateToMobileApp('consumer')}
                className="w-full flex items-center gap-3 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-800 text-left"
              >
                <Smartphone className="w-4 h-4 text-sky-600" />
                <span>{isAr ? 'تطبيق المتسوقين ورادار الصفقات' : 'Shopper Radar App (Consumer)'}</span>
              </button>

              <button
                onClick={() => navigateToMobileApp('business')}
                className="w-full flex items-center gap-3 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-800 text-left"
              >
                <QrCode className="w-4 h-4 text-amber-600" />
                <span>{isAr ? 'تطبيق صاحب العمل ومسح القسائم' : 'Business Owner In-Store POS & QR Scanner'}</span>
              </button>

              <button
                onClick={navigateToAdmin}
                className="w-full flex items-center gap-3 p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-800 text-left"
              >
                <Building2 className="w-4 h-4 text-slate-700" />
                <span>{isAr ? 'لوحة الإدارة والعمليات المركزية' : 'Operations & Admin Management'}</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <select
                aria-label="Currency"
                value={activeCurrency}
                onChange={(e) => setActiveCurrency(e.target.value as CurrencyCode)}
                className="bg-slate-100 border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
              >
                <option value="AUD">AUD ($)</option>
                <option value="SGD">SGD (S$)</option>
                <option value="MYR">MYR (RM)</option>
                <option value="AED">AED (د.إ)</option>
                <option value="SAR">SAR (﷼)</option>
                <option value="USD">USD ($)</option>
              </select>

              <button
                onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-xs font-semibold text-center"
              >
                {isAr ? 'تسجيل الدخول' : 'Sign In'}
              </button>
            </div>
          </div>
        )}

      </header>

      {/* Auth & Account Management Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};

