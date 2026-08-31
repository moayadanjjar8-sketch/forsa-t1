import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  BusinessProfile, 
  Deal, 
  AuditLog, 
  UtmCampaignRecord, 
  PushNotificationRecord, 
  AiDealPerformanceReport, 
  DealCategory, 
  CurrencyCode, 
  SubscriptionTier,
  UserRole,
  CurrencyConfig,
  SubscriptionPlanConfig,
  SubscriptionPaymentRecord,
  AbnOverrideParams,
  SubscriptionChangeParams
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_BUSINESSES, 
  INITIAL_DEALS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_UTM_RECORDS, 
  INITIAL_PUSH_DISPATCHES,
  INITIAL_AI_REPORTS,
  CATEGORY_BENCHMARKS,
  INITIAL_CURRENCIES,
  SUBSCRIPTION_PLANS,
  INITIAL_SUBSCRIPTION_PAYMENTS
} from '../data/mockData';
import { Language, translations, TranslationDictionary } from '../i18n/translations';

export type AppViewMode = 'marketing' | 'mobile' | 'admin' | 'database_arch' | 'register' | 'business_portal';

export interface RegisterPayload {
  accountType: 'consumer' | 'business';
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  // Consumer specific
  preferredRadiusM?: number;
  favouriteCategories?: DealCategory[];
  suburb?: string;
  // Business specific
  businessName?: string;
  abn?: string;
  businessCategory?: DealCategory;
  businessAddress?: string;
  subscriptionTier?: SubscriptionTier;
  website?: string;
}

interface AppContextType {
  // i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  isRtl: boolean;
  dir: 'rtl' | 'ltr';
  t: (key: keyof TranslationDictionary) => string;

  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  allUsers: UserProfile[];
  businesses: BusinessProfile[];
  deals: Deal[];
  auditLogs: AuditLog[];
  utmRecords: UtmCampaignRecord[];
  pushDispatches: PushNotificationRecord[];
  aiReports: Record<string, AiDealPerformanceReport>;
  
  // Mobile device simulation states
  mobileDeviceType: 'iphone' | 'pixel' | 'pwa_fullscreen';
  setMobileDeviceType: (dev: 'iphone' | 'pixel' | 'pwa_fullscreen') => void;
  mobileRole: 'consumer' | 'business';
  setMobileRole: (role: 'consumer' | 'business') => void;
  
  // Active consumer filter states
  consumerSearchRadiusM: number;
  setConsumerSearchRadiusM: (radius: number) => void;
  selectedCategoryFilter: DealCategory | 'all';
  setSelectedCategoryFilter: (cat: DealCategory | 'all') => void;
  followedBusinessIds: string[];
  toggleFollowBusiness: (bizId: string) => void;
  bookmarkedDealIds: string[];
  toggleBookmarkDeal: (dealId: string) => void;
  
  // Platform configuration settings & Currencies
  activeCurrency: CurrencyCode;
  setActiveCurrency: (cur: CurrencyCode) => void;
  currencies: CurrencyConfig[];
  setCurrencies: React.Dispatch<React.SetStateAction<CurrencyConfig[]>>;
  updateCurrencyRate: (code: CurrencyCode, rateToAud: number, enabled?: boolean) => void;
  formatCurrency: (amountInAudCents: number, targetCurrency?: CurrencyCode) => string;

  // Subscription Plans
  subscriptionPlans: SubscriptionPlanConfig[];
  setSubscriptionPlans: React.Dispatch<React.SetStateAction<SubscriptionPlanConfig[]>>;
  updateSubscriptionPlan: (planId: string, updates: Partial<SubscriptionPlanConfig>) => void;
  createSubscriptionPlan: (plan: Omit<SubscriptionPlanConfig, 'id'>) => SubscriptionPlanConfig;
  deleteSubscriptionPlan: (planId: string) => void;
  subscriptionPayments: SubscriptionPaymentRecord[];

  // User Management
  updateUser: (userId: string, updates: Partial<UserProfile>) => void;
  createUser: (userData: Partial<UserProfile>) => UserProfile;
  toggleUserStatus: (userId: string) => void;

  systemHealth: {
    redisStreamsQueueLength: number;
    postGisQueryAvgMs: number;
    pushNotificationSlaCompliance: number; // e.g. 99.8%
    activeConcurrentUsers: number;
    cpuLoadPercentage: number;
  };
  
  // Operations & Actions
  registerUser: (payload: RegisterPayload) => UserProfile;
  publishNewDeal: (deal: Omit<Deal, 'id' | 'qrCodeSeed' | 'metrics' | 'currentRedemptionsCount' | 'status' | 'publishTimestamp'>) => Deal;
  updateDeal: (dealId: string, updates: Partial<Deal>) => void;
  deleteDeal: (dealId: string) => void;
  toggleDealStatus: (dealId: string, newStatus?: Deal['status']) => void;
  redeemDealWithQr: (dealId: string, consumerId?: string) => { success: boolean; message: string; deal?: Deal };
  generateAiReportForDeal: (dealId: string) => AiDealPerformanceReport;
  updateBusinessSubscription: (businessId: string, tier: SubscriptionTier, billingCycle: 'monthly' | 'annual') => void;
  updateBusinessSubscriptionWithPayment: (params: SubscriptionChangeParams) => void;
  updateAbnStatus: (businessId: string, status: BusinessProfile['abnStatus']) => void;
  updateAbnOverride: (params: AbnOverrideParams) => void;
  reviewBusinessProfile: (businessId: string, decision: 'approved' | 'rejected' | 'changes_requested', reviewNotes: string, rejectionReason?: string) => void;
  approveBusinessProfile: (businessId: string, notes?: string) => void;
  rejectBusinessProfile: (businessId: string, reason: string) => void;
  requestBusinessChanges: (businessId: string, notes: string) => void;
  reVerifyAbn: (businessId: string) => { isValid: boolean; entityName: string; gstActive: boolean; status: BusinessProfile['abnStatus'] };
  switchRolePersona: (role: UserRole) => void;
  exportUserData: (userId: string) => string;
  deleteAccount: (userId: string) => boolean;
  addUtmClick: (utmId: string, actionType: 'signup' | 'trial' | 'paid') => void;
  
  // Live notification banner/toast
  activeLiveNotification: PushNotificationRecord | null;
  dismissLiveNotification: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('forsat_lang');
    return saved === 'ar' ? 'ar' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('forsat_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const isRtl = language === 'ar';
  const dir = isRtl ? 'rtl' : 'ltr';

  const t = (key: keyof TranslationDictionary): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || String(key);
  };

  const [viewMode, setViewMode] = useState<AppViewMode>('marketing');
  const [allUsers, setAllUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]); // Jordan (Consumer)
  const [businesses, setBusinesses] = useState<BusinessProfile[]>(INITIAL_BUSINESSES);
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [utmRecords, setUtmRecords] = useState<UtmCampaignRecord[]>(INITIAL_UTM_RECORDS);
  const [pushDispatches, setPushDispatches] = useState<PushNotificationRecord[]>(INITIAL_PUSH_DISPATCHES);
  const [aiReports, setAiReports] = useState<Record<string, AiDealPerformanceReport>>(INITIAL_AI_REPORTS);
  
  // Mobile Simulator state
  const [mobileDeviceType, setMobileDeviceType] = useState<'iphone' | 'pixel' | 'pwa_fullscreen'>('iphone');
  const [mobileRole, setMobileRole] = useState<'consumer' | 'business'>('consumer');
  
  // Consumer interaction state
  const [consumerSearchRadiusM, setConsumerSearchRadiusM] = useState<number>(3000);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<DealCategory | 'all'>('all');
  const [followedBusinessIds, setFollowedBusinessIds] = useState<string[]>(['biz_amira_cafe', 'biz_king_william_bistro']);
  const [bookmarkedDealIds, setBookmarkedDealIds] = useState<string[]>(['deal_amira_afternoon_coffee']);
  
  // Currency & Platform settings
  const [currencies, setCurrencies] = useState<CurrencyConfig[]>(INITIAL_CURRENCIES);
  const [activeCurrency, setActiveCurrencyState] = useState<CurrencyCode>('AUD');
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlanConfig[]>(SUBSCRIPTION_PLANS);
  const [subscriptionPayments, setSubscriptionPayments] = useState<SubscriptionPaymentRecord[]>(INITIAL_SUBSCRIPTION_PAYMENTS);
  const [activeLiveNotification, setActiveLiveNotification] = useState<PushNotificationRecord | null>(null);

  const setActiveCurrency = (cur: CurrencyCode) => {
    setActiveCurrencyState(cur);
    setAuditLogs(prev => [
      {
        id: `audit_cur_${Date.now()}`,
        adminEmail: currentUser.email,
        action: 'Default Platform Currency Switched',
        targetEntity: 'currency_rule',
        targetId: cur,
        details: `Platform operational display and settlement currency changed to ${cur}.`,
        timestamp: new Date().toISOString(),
        status: 'info'
      },
      ...prev
    ]);
  };

  const updateCurrencyRate = (code: CurrencyCode, rateToAud: number, enabled?: boolean) => {
    setCurrencies(prev => prev.map(c => {
      if (c.code === code) {
        return {
          ...c,
          rateToAud: Math.max(0.0001, rateToAud),
          enabled: enabled !== undefined ? enabled : c.enabled
        };
      }
      return c;
    }));

    setAuditLogs(prev => [
      {
        id: `audit_fx_${Date.now()}`,
        adminEmail: currentUser.email,
        action: 'FX Exchange Rate Overridden',
        targetEntity: 'currency_rate',
        targetId: code,
        details: `Rate for 1 AUD set to ${rateToAud} ${code}. Enabled: ${enabled !== undefined ? enabled : true}.`,
        timestamp: new Date().toISOString(),
        status: 'success'
      },
      ...prev
    ]);
  };

  const formatCurrency = (amountInAudCents: number, targetCurrency?: CurrencyCode): string => {
    const curCode = targetCurrency || activeCurrency;
    const curConfig = currencies.find(c => c.code === curCode) || currencies[0];
    const amountAud = amountInAudCents / 100;
    const converted = amountAud * curConfig.rateToAud;
    
    const formattedNum = curConfig.decimals > 0
      ? converted.toLocaleString('en-US', { minimumFractionDigits: curConfig.decimals, maximumFractionDigits: curConfig.decimals })
      : Math.round(converted).toLocaleString('en-US');

    if (curConfig.formatPosition === 'suffix') {
      return `${formattedNum} ${curConfig.symbol}`;
    }
    return `${curConfig.symbol}${formattedNum}`;
  };

  // User Management Handlers
  const updateUser = (userId: string, updates: Partial<UserProfile>) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const updated = { ...u, ...updates };
        if (currentUser.id === userId) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));

    setAuditLogs(prev => [
      {
        id: `audit_u_${Date.now()}`,
        adminEmail: currentUser.email,
        action: 'User Account Profile Modified',
        targetEntity: 'user',
        targetId: userId,
        details: `Admin modified fields: ${Object.keys(updates).join(', ')}.`,
        timestamp: new Date().toISOString(),
        status: 'success'
      },
      ...prev
    ]);
  };

  const createUser = (userData: Partial<UserProfile>): UserProfile => {
    const newUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const role: UserRole = userData.role || 'consumer';
    
    const newUser: UserProfile = {
      id: newUserId,
      email: userData.email || `user_${Date.now()}@example.com`,
      fullName: userData.fullName || 'New User',
      role: role,
      status: 'active',
      phone: userData.phone || '+61 400 000 000',
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      authProvider: userData.authProvider || 'email_otp',
      verified: userData.verified !== undefined ? userData.verified : true,
      preferredRadiusM: userData.preferredRadiusM || 3000,
      favouriteCategories: userData.favouriteCategories || ['cafe_coffee', 'restaurant_dining'],
      followedBusinesses: [],
      currentLocation: userData.currentLocation || {
        lat: -34.9285,
        lng: 138.6007,
        suburb: 'Adelaide CBD',
        city: 'Adelaide',
        country: 'Australia'
      },
      pushNotificationEnabled: true,
      biometricsEnabled: true,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    setAllUsers(prev => [newUser, ...prev]);

    setAuditLogs(prev => [
      {
        id: `audit_u_create_${Date.now()}`,
        adminEmail: currentUser.email,
        action: 'New User Manually Provisioned by Admin',
        targetEntity: 'user',
        targetId: newUserId,
        details: `Created user ${newUser.fullName} (${newUser.email}) with role ${newUser.role}.`,
        timestamp: new Date().toISOString(),
        status: 'success'
      },
      ...prev
    ]);

    return newUser;
  };

  const toggleUserStatus = (userId: string) => {
    setAllUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'suspended' ? 'active' : 'suspended';
        const updated = { ...u, status: nextStatus };
        if (currentUser.id === userId) {
          setCurrentUser(updated);
        }
        return updated;
      }
      return u;
    }));

    const targetUser = allUsers.find(u => u.id === userId);
    const newStatus = targetUser?.status === 'suspended' ? 'active' : 'suspended';

    setAuditLogs(prev => [
      {
        id: `audit_u_stat_${Date.now()}`,
        adminEmail: currentUser.email,
        action: `User Account ${newStatus === 'suspended' ? 'Suspended / Banned' : 'Reactivated'}`,
        targetEntity: 'user',
        targetId: userId,
        details: `User status changed to ${newStatus}. Access policies updated immediately.`,
        timestamp: new Date().toISOString(),
        status: newStatus === 'suspended' ? 'warning' : 'success'
      },
      ...prev
    ]);
  };

  // Subscription Plan Management Handlers
  const updateSubscriptionPlan = (planId: string, updates: Partial<SubscriptionPlanConfig>) => {
    setSubscriptionPlans(prev => prev.map(p => {
      if (p.id === planId) {
        return { ...p, ...updates };
      }
      return p;
    }));

    setAuditLogs(prev => [
      {
        id: `audit_plan_up_${Date.now()}`,
        adminEmail: currentUser.email,
        action: 'Subscription Plan Terms Configured',
        targetEntity: 'subscription_plan',
        targetId: planId,
        details: `Updated plan properties: ${Object.keys(updates).join(', ')}.`,
        timestamp: new Date().toISOString(),
        status: 'success'
      },
      ...prev
    ]);
  };

  const createSubscriptionPlan = (plan: Omit<SubscriptionPlanConfig, 'id'>): SubscriptionPlanConfig => {
    const newPlanId = `plan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newPlan: SubscriptionPlanConfig = {
      ...plan,
      id: newPlanId
    };

    setSubscriptionPlans(prev => [...prev, newPlan]);

    setAuditLogs(prev => [
      {
        id: `audit_plan_cr_${Date.now()}`,
        adminEmail: currentUser.email,
        action: 'New Subscription Plan Tier Created',
        targetEntity: 'subscription_plan',
        targetId: newPlanId,
        details: `Created tier "${newPlan.name}" at $${newPlan.priceMonthlyAud}/mo.`,
        timestamp: new Date().toISOString(),
        status: 'success'
      },
      ...prev
    ]);

    return newPlan;
  };

  const deleteSubscriptionPlan = (planId: string) => {
    setSubscriptionPlans(prev => prev.filter(p => p.id !== planId));
    setAuditLogs(prev => [
      {
        id: `audit_plan_del_${Date.now()}`,
        adminEmail: currentUser.email,
        action: 'Subscription Plan Tier Deprecated / Removed',
        targetEntity: 'subscription_plan',
        targetId: planId,
        details: `Plan ID ${planId} was removed from catalogue. Existing subscribers grandfathered.`,
        timestamp: new Date().toISOString(),
        status: 'warning'
      },
      ...prev
    ]);
  };
  
  const [systemHealth, setSystemHealth] = useState({
    redisStreamsQueueLength: 14,
    postGisQueryAvgMs: 18.4,
    pushNotificationSlaCompliance: 99.85,
    activeConcurrentUsers: 1480,
    cpuLoadPercentage: 38.2
  });

  // Periodically fluctuate some live system metrics slightly for high realism
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => ({
        ...prev,
        postGisQueryAvgMs: +(16 + Math.random() * 5).toFixed(1),
        activeConcurrentUsers: Math.floor(1450 + Math.random() * 120),
        cpuLoadPercentage: +(35 + Math.random() * 8).toFixed(1),
        redisStreamsQueueLength: Math.floor(8 + Math.random() * 16)
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const switchRolePersona = (role: UserRole) => {
    let target = allUsers.find(u => u.role === role);
    if (!target) {
      if (role === 'super_admin') {
        target = allUsers.find(u => u.id === 'user_admin_salah') || INITIAL_USERS[4];
      } else if (role === 'admin') {
        target = allUsers.find(u => u.id === 'user_admin_zayn') || INITIAL_USERS[5];
      } else if (role.startsWith('business')) {
        target = INITIAL_USERS[1]; // Amira
      } else {
        target = INITIAL_USERS[0]; // Jordan
      }
    }
    setCurrentUser(target || INITIAL_USERS[0]);
    if (role === 'super_admin' || role === 'admin') {
      setViewMode('admin');
    } else if (role.startsWith('business')) {
      setViewMode('business_portal');
      setMobileRole('business');
    } else {
      setMobileRole('consumer');
    }
  };

  const toggleFollowBusiness = (bizId: string) => {
    setFollowedBusinessIds(prev => 
      prev.includes(bizId) ? prev.filter(id => id !== bizId) : [...prev, bizId]
    );
    setBusinesses(prev => prev.map(b => {
      if (b.id === bizId) {
        const isFollowing = followedBusinessIds.includes(bizId);
        return {
          ...b,
          followerCount: isFollowing ? Math.max(0, b.followerCount - 1) : b.followerCount + 1
        };
      }
      return b;
    }));
  };

  const toggleBookmarkDeal = (dealId: string) => {
    setBookmarkedDealIds(prev => 
      prev.includes(dealId) ? prev.filter(id => id !== dealId) : [...prev, dealId]
    );
  };

  const publishNewDeal = (dealData: Omit<Deal, 'id' | 'qrCodeSeed' | 'metrics' | 'currentRedemptionsCount' | 'status' | 'publishTimestamp'>): Deal => {
    const dealId = `deal_${Date.now()}`;
    const qrSeed = `FORSAT-${dealData.businessName.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 5)}-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Simulate PostGIS calculation: matched users within radius
    const simulatedMatchedUsers = Math.max(12, Math.floor((dealData.radiusMeters / 100) * (8 + Math.random() * 6)));
    const latencyMs = Math.floor(1800 + Math.random() * 2400); // 1.8s - 4.2s (sub 60s SLA)
    
    const newDeal: Deal = {
      ...dealData,
      id: dealId,
      qrCodeSeed: qrSeed,
      status: 'active',
      publishTimestamp: new Date().toISOString(),
      currentRedemptionsCount: 0,
      metrics: {
        dispatchedCount: simulatedMatchedUsers,
        deliveredCount: Math.floor(simulatedMatchedUsers * 0.98),
        viewsCount: Math.floor(simulatedMatchedUsers * 0.42),
        qrScansCount: 0,
        redemptionsCount: 0,
        conversionRate: 0,
        avgTimeToRedeemMinutes: 0
      },
      aiSuggestionGenerated: false
    };

    setDeals(prev => [newDeal, ...prev]);

    // Create Push Dispatch Record (BOD 6.4 60-second SLA)
    const pushRecord: PushNotificationRecord = {
      id: `push_dispatch_${Date.now()}`,
      dealId: newDeal.id,
      dealTitle: newDeal.title,
      businessName: newDeal.businessName,
      targetRadiusM: newDeal.radiusMeters,
      matchedUsersCount: simulatedMatchedUsers,
      dispatchedAt: new Date().toISOString(),
      completedAt: new Date(Date.now() + latencyMs).toISOString(),
      latencyMs: latencyMs,
      deliveryProvider: 'FCM',
      status: 'delivered'
    };

    setPushDispatches(prev => [pushRecord, ...prev]);
    setActiveLiveNotification(pushRecord);

    // Add Audit Log
    const newLog: AuditLog = {
      id: `audit_${Date.now()}`,
      adminEmail: currentUser.email,
      action: 'Deal Published & Geofence Dispatched',
      targetEntity: 'deal',
      targetId: newDeal.id,
      details: `Dispatched deal "${newDeal.title}" with radius ${newDeal.radiusMeters}m to ${simulatedMatchedUsers} matched devices in ${latencyMs}ms.`,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    return newDeal;
  };

  const updateDeal = (dealId: string, updates: Partial<Deal>) => {
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        return { ...d, ...updates };
      }
      return d;
    }));

    setAuditLogs(prev => [
      {
        id: `audit_deal_up_${Date.now()}`,
        adminEmail: currentUser.email,
        action: 'Deal Configuration Modified',
        targetEntity: 'deal',
        targetId: dealId,
        details: `Updated fields: ${Object.keys(updates).join(', ')}.`,
        timestamp: new Date().toISOString(),
        status: 'info'
      },
      ...prev
    ]);
  };

  const deleteDeal = (dealId: string) => {
    const target = deals.find(d => d.id === dealId);
    setDeals(prev => prev.filter(d => d.id !== dealId));
    setAuditLogs(prev => [
      {
        id: `audit_deal_del_${Date.now()}`,
        adminEmail: currentUser.email,
        action: 'Deal Deleted / Revoked',
        targetEntity: 'deal',
        targetId: dealId,
        details: `Deal "${target?.title || dealId}" removed from platform radar.`,
        timestamp: new Date().toISOString(),
        status: 'warning'
      },
      ...prev
    ]);
  };

  const toggleDealStatus = (dealId: string, newStatus?: Deal['status']) => {
    setDeals(prev => prev.map(d => {
      if (d.id === dealId) {
        const nextStatus = newStatus || (d.status === 'active' ? 'paused' : 'active');
        return { ...d, status: nextStatus };
      }
      return d;
    }));

    setAuditLogs(prev => [
      {
        id: `audit_deal_status_${Date.now()}`,
        adminEmail: currentUser.email,
        action: `Deal Status Changed to ${newStatus || 'toggled'}`,
        targetEntity: 'deal',
        targetId: dealId,
        details: `Status set to ${newStatus || 'active/paused'}. Geofence active state updated.`,
        timestamp: new Date().toISOString(),
        status: 'info'
      },
      ...prev
    ]);
  };

  const redeemDealWithQr = (dealId: string, consumerId?: string) => {
    const targetDeal = deals.find(d => d.id === dealId);
    if (!targetDeal) return { success: false, message: 'Deal not found' };
    if (targetDeal.status !== 'active') return { success: false, message: 'Deal is expired or inactive' };
    if (targetDeal.targetMaxRedemptions && targetDeal.currentRedemptionsCount >= targetDeal.targetMaxRedemptions) {
      return { success: false, message: 'Maximum redemptions cap reached for this offer' };
    }

    const updatedDeals = deals.map(d => {
      if (d.id === dealId) {
        const nextRedemptions = d.currentRedemptionsCount + 1;
        const nextScans = d.metrics.qrScansCount + 1;
        const nextViews = Math.max(d.metrics.viewsCount, nextRedemptions + 10);
        const convRate = +((nextRedemptions / Math.max(1, d.metrics.dispatchedCount)) * 100).toFixed(1);
        
        return {
          ...d,
          currentRedemptionsCount: nextRedemptions,
          metrics: {
            ...d.metrics,
            viewsCount: nextViews,
            qrScansCount: nextScans,
            redemptionsCount: nextRedemptions,
            conversionRate: convRate,
            avgTimeToRedeemMinutes: 16.4
          }
        };
      }
      return d;
    });

    setDeals(updatedDeals);

    // Audit Log
    const newLog: AuditLog = {
      id: `audit_red_${Date.now()}`,
      adminEmail: 'pos_terminal_sync@forsa-t.com',
      action: 'In-Store QR Code Redeemed',
      targetEntity: 'deal',
      targetId: dealId,
      details: `Customer ${consumerId || 'Jordan Taylor'} redeemed discount at point of sale. Seed: ${targetDeal.qrCodeSeed}`,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    return { 
      success: true, 
      message: `Redeemed ${targetDeal.discountPercentage}% discount successfully at ${targetDeal.businessName}!`,
      deal: updatedDeals.find(d => d.id === dealId)
    };
  };

  const generateAiReportForDeal = (dealId: string): AiDealPerformanceReport => {
    const deal = deals.find(d => d.id === dealId);
    const benchmark = CATEGORY_BENCHMARKS.find(b => b.category === deal?.businessCategory) || CATEGORY_BENCHMARKS[0];
    const actualConv = deal ? deal.metrics.conversionRate || 22.5 : 22.5;
    
    const newReport: AiDealPerformanceReport = {
      dealId: dealId,
      businessId: deal?.businessId || 'biz_sample',
      dealTitle: deal?.title || 'Hyper-local Flash Deal',
      actualConversionRate: actualConv,
      categoryAverageConversionRate: benchmark.avgConversionRate,
      historicalBusinessAvgConversionRate: +(actualConv * 0.85).toFixed(1),
      numericCrossCheckPassed: true,
      suggestions: [
        {
          category: 'radius',
          title: `Optimized Radius Analysis (${deal?.radiusMeters || 500}m)`,
          observation: `Deal reached ${deal?.metrics.dispatchedCount || 120} nearby residents with a ${actualConv}% conversion rate vs category benchmark ${benchmark.avgConversionRate}%.`,
          actionableRecommendation: deal && deal.radiusMeters > 1000 
            ? 'Consider tightening geofence to 400m-800m. Pedestrians within 10 min walking converted 2.8x faster.' 
            : `Retain ${deal?.radiusMeters || 500}m hyper-local radius for off-peak hours to maximize store walk-ins.`,
          confidenceScore: 0.93
        },
        {
          category: 'discount',
          title: `${deal?.discountPercentage || 25}% Discount Elasticity Evaluation`,
          observation: `${deal?.discountPercentage || 25}% discount drove strong volume without unnecessary margin erosion.`,
          actionableRecommendation: actualConv > benchmark.avgConversionRate 
            ? 'Do not increase discount. Current percentage maintains healthy profit margins while surpassing competitor foot traffic.' 
            : 'Test bundling a complimentary item instead of raising discount percentage to preserve perceived brand value.',
          confidenceScore: 0.90
        },
        {
          category: 'timing',
          title: `Peak Conversion Window (${benchmark.peakHour})`,
          observation: `Redemptions peaked within 25 minutes of push dispatch. Category peak window is ${benchmark.peakHour}.`,
          actionableRecommendation: `Automate repeat drop during ${benchmark.peakHour} on high footfall days (Thursday–Saturday).`,
          confidenceScore: 0.87
        }
      ],
      generatedAt: new Date().toISOString()
    };

    setAiReports(prev => ({ ...prev, [dealId]: newReport }));
    
    // Mark deal as having AI report
    setDeals(prev => prev.map(d => d.id === dealId ? { ...d, aiSuggestionGenerated: true } : d));

    return newReport;
  };

  const updateBusinessSubscriptionWithPayment = (params: SubscriptionChangeParams) => {
    const { businessId, tier, billingCycle, payment } = params;
    const monthlyRate = tier === 'starter' ? 4900 : tier === 'growth' ? 14900 : 39900;
    
    setBusinesses(prev => prev.map(b => {
      if (b.id === businessId) {
        return {
          ...b,
          subscription: {
            ...b.subscription,
            tier: tier,
            billingCycle: billingCycle,
            monthlyPriceCents: monthlyRate,
            status: 'active'
          }
        };
      }
      return b;
    }));

    const targetBiz = businesses.find(b => b.id === businessId);
    const bizName = targetBiz?.businessName || 'Merchant';

    // Record financial settlement / payment received if provided
    if (payment && payment.amountCents > 0) {
      const paymentRecord: SubscriptionPaymentRecord = {
        id: `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        businessId,
        businessName: bizName,
        amountCents: payment.amountCents,
        currency: activeCurrency,
        paymentMethod: payment.paymentMethod,
        referenceNumber: payment.referenceNumber || `REC-${Date.now().toString().slice(-6)}`,
        tier,
        billingCycle,
        recordedByAdminEmail: currentUser.email,
        status: payment.paymentMethod === 'waived' ? 'waived' : 'paid',
        settlementNotes: payment.settlementNotes,
        createdAt: new Date().toISOString()
      };

      setSubscriptionPayments(prev => [paymentRecord, ...prev]);
    }

    const payDetails = payment 
      ? `Received/Settled: $${(payment.amountCents / 100).toFixed(2)} ${activeCurrency} via ${payment.paymentMethod.replace('_', ' ').toUpperCase()} (Ref: ${payment.referenceNumber || 'N/A'}).` 
      : 'Billing ledger adjusted.';

    const newLog: AuditLog = {
      id: `audit_sub_${Date.now()}`,
      adminEmail: currentUser.email,
      action: `Subscription Tier Changed to ${tier.toUpperCase()}`,
      targetEntity: 'subscription',
      targetId: businessId,
      details: `Admin changed "${bizName}" subscription tier to ${tier.toUpperCase()} (${billingCycle}). ${payDetails}`,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateBusinessSubscription = (businessId: string, tier: SubscriptionTier, billingCycle: 'monthly' | 'annual') => {
    updateBusinessSubscriptionWithPayment({
      businessId,
      tier,
      billingCycle
    });
  };

  const updateAbnOverride = (params: AbnOverrideParams) => {
    setBusinesses(prev => prev.map(b => {
      if (b.id === params.businessId) {
        return { 
          ...b, 
          abn: params.abn || b.abn,
          abnStatus: params.abnStatus,
          legalTradingName: params.legalTradingName || b.legalTradingName,
          approvalStatus: params.markAsApproved ? 'approved' : b.approvalStatus
        };
      }
      return b;
    }));

    const targetBiz = businesses.find(b => b.id === params.businessId);
    const bizName = targetBiz?.businessName || 'Merchant';

    const newLog: AuditLog = {
      id: `audit_abn_${Date.now()}`,
      adminEmail: currentUser.email,
      action: 'ABN Override & Entity Verification Updated',
      targetEntity: 'abn_override',
      targetId: params.businessId,
      details: `Admin ${currentUser.fullName || currentUser.email} set ABN to "${params.abn}", Status to "${params.abnStatus.toUpperCase()}". Justification: ${params.justification || 'Compliance review verified'}.`,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const updateAbnStatus = (businessId: string, status: BusinessProfile['abnStatus']) => {
    const targetBiz = businesses.find(b => b.id === businessId);
    updateAbnOverride({
      businessId,
      abn: targetBiz?.abn || '12 345 678 901',
      abnStatus: status,
      justification: 'Admin quick status toggle'
    });
  };

  const reviewBusinessProfile = (
    businessId: string, 
    decision: 'approved' | 'rejected' | 'changes_requested', 
    reviewNotes: string, 
    rejectionReason?: string
  ) => {
    const reviewerName = currentUser.fullName || currentUser.email;
    const now = new Date().toISOString();

    setBusinesses(prev => prev.map(b => {
      if (b.id === businessId) {
        return {
          ...b,
          approvalStatus: decision,
          abnStatus: decision === 'approved' ? 'verified_abr' : b.abnStatus,
          reviewedAt: now,
          reviewedBy: `${reviewerName} (${currentUser.role === 'super_admin' ? 'Super Admin' : 'Admin'})`,
          reviewNotes: reviewNotes || (decision === 'approved' ? 'Approved following compliance verification.' : 'Action required.'),
          rejectionReason: rejectionReason || b.rejectionReason,
          branches: b.branches.map(br => ({ ...br, isActive: decision === 'approved' }))
        };
      }
      return b;
    }));

    // Add Audit Log
    const actionLabel = decision === 'approved' 
      ? 'Business Profile Approved for Platform Access'
      : (decision === 'changes_requested' ? 'Business Profile Changes Requested' : 'Business Profile Application Rejected');
      
    const newLog: AuditLog = {
      id: `audit_biz_rev_${Date.now()}`,
      adminEmail: currentUser.email,
      action: actionLabel,
      targetEntity: 'business',
      targetId: businessId,
      details: `Reviewer: ${reviewerName} (${currentUser.role}). Notes: "${reviewNotes || 'N/A'}". ${rejectionReason ? `Reason: "${rejectionReason}"` : ''}`,
      timestamp: now,
      status: decision === 'approved' ? 'success' : (decision === 'rejected' ? 'warning' : 'info')
    };
    setAuditLogs(prev => [newLog, ...prev]);

    // If approved, create a push notification dispatch record
    if (decision === 'approved') {
      const biz = businesses.find(b => b.id === businessId);
      const pushRecord: PushNotificationRecord = {
        id: `push_welcome_${Date.now()}`,
        dealId: `welcome_${businessId}`,
        dealTitle: `🎉 Business Approved: ${biz?.businessName || 'Your Business'} is now Live on FORSA-T!`,
        businessName: biz?.businessName || 'FORSA-T Platform Admin',
        targetRadiusM: 1000,
        matchedUsersCount: 1,
        dispatchedAt: now,
        completedAt: new Date(Date.now() + 1200).toISOString(),
        latencyMs: 1200,
        deliveryProvider: 'Web_Push',
        status: 'delivered'
      };
      setPushDispatches(prev => [pushRecord, ...prev]);
      setActiveLiveNotification(pushRecord);
    }
  };

  const approveBusinessProfile = (businessId: string, notes?: string) => {
    reviewBusinessProfile(businessId, 'approved', notes || 'Approved all verified identity and branch credentials.');
  };

  const rejectBusinessProfile = (businessId: string, reason: string) => {
    reviewBusinessProfile(businessId, 'rejected', `Application rejected: ${reason}`, reason);
  };

  const requestBusinessChanges = (businessId: string, notes: string) => {
    reviewBusinessProfile(businessId, 'changes_requested', notes);
  };

  const reVerifyAbn = (businessId: string) => {
    const biz = businesses.find(b => b.id === businessId);
    const isValid = !!(biz?.abn && biz.abn.replace(/\s+/g, '').length >= 9);
    const newStatus: BusinessProfile['abnStatus'] = isValid ? 'verified_abr' : 'flagged';
    
    setBusinesses(prev => prev.map(b => {
      if (b.id === businessId) {
        return {
          ...b,
          abnStatus: newStatus,
          legalTradingName: b.legalTradingName || `${b.businessName} Pty Ltd`
        };
      }
      return b;
    }));

    const newLog: AuditLog = {
      id: `audit_abr_query_${Date.now()}`,
      adminEmail: currentUser.email,
      action: 'ABR Live API Query Executed',
      targetEntity: 'abn_override',
      targetId: businessId,
      details: `Live lookup query on Australian Business Register for ABN ${biz?.abn}. Entity result: "${biz?.legalTradingName || biz?.businessName}". Status: ${newStatus}.`,
      timestamp: new Date().toISOString(),
      status: isValid ? 'success' : 'warning'
    };
    setAuditLogs(prev => [newLog, ...prev]);

    return {
      isValid,
      entityName: biz?.legalTradingName || `${biz?.businessName} Pty Ltd`,
      gstActive: true,
      status: newStatus
    };
  };

  const exportUserData = (userId: string): string => {
    const user = allUsers.find(u => u.id === userId) || currentUser;
    const userDeals = deals.filter(d => d.businessId === user.id);
    const dataPackage = {
      meta: {
        platform: 'FORSA-T Geospatial Deals Platform',
        exportedAt: new Date().toISOString(),
        gdprCompliant: true,
        schemaVersion: '1.1.0'
      },
      userProfile: user,
      activity: {
        followedBusinesses: user.followedBusinesses,
        favouriteCategories: user.favouriteCategories,
        associatedDealsCount: userDeals.length
      }
    };
    return JSON.stringify(dataPackage, null, 2);
  };

  const deleteAccount = (userId: string): boolean => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
    const newLog: AuditLog = {
      id: `audit_del_${Date.now()}`,
      adminEmail: currentUser.email,
      action: 'User Account Soft-Deleted (GDPR / Store Rule)',
      targetEntity: 'deal',
      targetId: userId,
      details: `Account deletion requested by user ${userId}. Anonymized events retained for historical analytics per policy.`,
      timestamp: new Date().toISOString(),
      status: 'warning'
    };
    setAuditLogs(prev => [newLog, ...prev]);
    return true;
  };

  const addUtmClick = (utmId: string, actionType: 'signup' | 'trial' | 'paid') => {
    setUtmRecords(prev => prev.map(u => {
      if (u.id === utmId) {
        return {
          ...u,
          visits: u.visits + 1,
          signups: actionType === 'signup' || actionType === 'trial' || actionType === 'paid' ? u.signups + 1 : u.signups,
          trials: actionType === 'trial' || actionType === 'paid' ? u.trials + 1 : u.trials,
          paidConversions: actionType === 'paid' ? u.paidConversions + 1 : u.paidConversions,
          revenueGeneratedCents: actionType === 'paid' ? u.revenueGeneratedCents + 14900 : u.revenueGeneratedCents
        };
      }
      return u;
    }));
  };

  const registerUser = (payload: RegisterPayload): UserProfile => {
    const newUserId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const role: UserRole = payload.accountType === 'consumer' 
      ? 'consumer' 
      : (payload.subscriptionTier === 'enterprise' 
          ? 'business_enterprise' 
          : (payload.subscriptionTier === 'growth' ? 'business_growth' : 'business_starter'));

    const newUser: UserProfile = {
      id: newUserId,
      email: payload.email,
      fullName: payload.fullName,
      role: role,
      phone: payload.phone || '+61 400 000 000',
      avatarUrl: payload.accountType === 'consumer' 
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      authProvider: 'email_otp',
      verified: true,
      preferredRadiusM: payload.preferredRadiusM || 3000,
      favouriteCategories: payload.favouriteCategories || ['cafe_coffee', 'restaurant_dining'],
      followedBusinesses: [],
      currentLocation: {
        lat: -34.9285,
        lng: 138.6007,
        suburb: payload.suburb || 'Adelaide CBD',
        city: 'Adelaide',
        country: 'Australia'
      },
      pushNotificationEnabled: true,
      biometricsEnabled: true,
      createdAt: new Date().toISOString()
    };

    setAllUsers(prev => [newUser, ...prev]);

    // If business, create matching business profile
    if (payload.accountType === 'business' && payload.businessName) {
      const newBizId = `biz_${Date.now()}`;
      const nowIso = new Date().toISOString();
      const newBusiness: BusinessProfile = {
        id: newBizId,
        businessName: payload.businessName,
        legalTradingName: `${payload.businessName} Pty Ltd`,
        abn: payload.abn || '51 824 753 556',
        abnStatus: 'pending_check',
        approvalStatus: 'pending_review',
        applicantName: payload.fullName,
        applicantEmail: payload.email,
        applicantPhone: payload.phone || '+61 400 000 000',
        appliedAt: nowIso,
        verificationDocs: [
          {
            id: `doc_abn_${Date.now()}`,
            type: 'abn_certificate',
            docType: 'abn_certificate',
            title: 'ASIC Certificate / ABN Registration Record',
            fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
            uploadedAt: nowIso,
            status: 'pending'
          },
          {
            id: `doc_id_${Date.now()}`,
            type: 'owner_id',
            docType: 'identity_proof',
            title: 'Director Australian Driver Licence / Passport',
            fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
            uploadedAt: nowIso,
            status: 'pending'
          },
          {
            id: `doc_lease_${Date.now()}`,
            type: 'council_license',
            docType: 'premises_lease',
            title: 'Commercial Lease Agreement / Council Food Permit',
            fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
            uploadedAt: nowIso,
            status: 'pending'
          }
        ],
        category: payload.businessCategory || 'cafe_coffee',
        description: `${payload.businessName} - Serving premium offerings in Adelaide.`,
        logoUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=150&auto=format&fit=crop&q=80',
        heroImageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80',
        website: payload.website || 'https://forsat.com.au',
        branches: [
          {
            id: `branch_${Date.now()}`,
            businessId: newBizId,
            branchName: 'Main Adelaide Branch',
            address: payload.businessAddress || '128 Rundle Mall, Adelaide SA 5000',
            lat: -34.9224,
            lng: 138.6042,
            phone: payload.phone || '+61 8 8234 5678',
            openingHours: 'Mon-Sun: 7:00 AM - 9:00 PM',
            isActive: false // inactive until approved by admin
          }
        ],
        subscription: {
          tier: payload.subscriptionTier || 'starter',
          status: 'active',
          billingCycle: 'monthly',
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          monthlyPriceCents: payload.subscriptionTier === 'enterprise' ? 49900 : (payload.subscriptionTier === 'growth' ? 14900 : 0),
          currency: 'AUD',
          stripeCustomerId: `cus_reg_${Date.now()}`,
          stripeSubscriptionId: `sub_reg_${Date.now()}`
        },
        rating: 5.0,
        reviewCount: 0,
        followerCount: 0,
        createdAt: nowIso
      };
      setBusinesses(prev => [newBusiness, ...prev]);
    }

    const auditLog: AuditLog = {
      id: `audit_reg_${Date.now()}`,
      adminEmail: payload.email,
      action: 'New User Registered via Registration Page',
      targetEntity: payload.accountType === 'business' ? 'business' : 'user',
      targetId: newUserId,
      details: payload.accountType === 'business' 
        ? `New merchant account "${payload.businessName}" submitted by ${payload.fullName} (${payload.email}). Profile queued for Admin/Super Admin verification.`
        : `Account registered for ${payload.fullName} (${payload.email}) with role ${role}. Verification passed.`,
      timestamp: new Date().toISOString(),
      status: payload.accountType === 'business' ? 'info' : 'success'
    };
    setAuditLogs(prev => [auditLog, ...prev]);
    setCurrentUser(newUser);

    return newUser;
  };

  const dismissLiveNotification = () => {
    setActiveLiveNotification(null);
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      isRtl,
      dir,
      t,
      viewMode,
      setViewMode,
      currentUser,
      setCurrentUser,
      allUsers,
      businesses,
      deals,
      auditLogs,
      utmRecords,
      pushDispatches,
      aiReports,
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
      activeCurrency,
      setActiveCurrency,
      currencies,
      setCurrencies,
      updateCurrencyRate,
      formatCurrency,
      subscriptionPlans,
      subscriptionPayments,
      setSubscriptionPlans,
      updateSubscriptionPlan,
      createSubscriptionPlan,
      deleteSubscriptionPlan,
      updateUser,
      createUser,
      toggleUserStatus,
      systemHealth,
      registerUser,
      publishNewDeal,
      updateDeal,
      deleteDeal,
      toggleDealStatus,
      redeemDealWithQr,
      generateAiReportForDeal,
      updateBusinessSubscription,
      updateBusinessSubscriptionWithPayment,
      updateAbnStatus,
      updateAbnOverride,
      reviewBusinessProfile,
      approveBusinessProfile,
      rejectBusinessProfile,
      requestBusinessChanges,
      reVerifyAbn,
      switchRolePersona,
      exportUserData,
      deleteAccount,
      addUtmClick,
      activeLiveNotification,
      dismissLiveNotification
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
