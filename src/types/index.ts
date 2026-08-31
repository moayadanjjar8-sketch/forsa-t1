export type UserRole = 'consumer' | 'business_starter' | 'business_growth' | 'business_enterprise' | 'admin' | 'super_admin';

export type DealCategory = 
  | 'cafe_coffee' 
  | 'restaurant_dining' 
  | 'retail_fashion' 
  | 'beauty_wellness' 
  | 'entertainment_events' 
  | 'services_auto';

export type CurrencyCode = 'AUD' | 'MYR' | 'SGD' | 'IDR' | 'THB' | 'AED' | 'SAR' | 'USD';

export type SubscriptionTier = 'starter' | 'growth' | 'enterprise';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  authProvider: 'email_otp' | 'google' | 'apple';
  verified: boolean;
  status?: 'active' | 'suspended';
  businessId?: string;
  phone?: string;
  preferredRadiusM: number; // e.g. 3000m (3km)
  favouriteCategories: DealCategory[];
  followedBusinesses: string[]; // business IDs
  currentLocation: {
    lat: number;
    lng: number;
    suburb: string;
    city: string;
    country: string;
  };
  pushNotificationEnabled: boolean;
  biometricsEnabled?: boolean;
  createdAt: string;
  lastActive?: string;
}

export interface CurrencyConfig {
  code: CurrencyCode;
  name: string;
  symbol: string;
  rateToAud: number; // e.g. 1 AUD = 0.65 USD, 2.45 SAR, 2.40 AED
  flag: string;
  formatPosition: 'prefix' | 'suffix';
  isDefault?: boolean;
  decimals: number;
  enabled: boolean;
}

export interface SubscriptionPlanConfig {
  id: string;
  name: string;
  tierKey: SubscriptionTier | string;
  priceMonthlyAud: number;
  priceAnnualAud: number;
  badge?: string;
  description: string;
  features: string[];
  maxDealsPerMonth: number | 'unlimited';
  maxBranches: number | 'unlimited';
  maxRadiusMeters: number;
  priorityQueue: boolean;
  aiSuggestionsEnabled: boolean;
  salesCommissionPercent: number; // 0% default
  isActive: boolean;
  popular?: boolean;
}

export interface BusinessBranch {
  id: string;
  businessId: string;
  branchName: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  openingHours: string;
  isActive: boolean;
}

export type BusinessApprovalStatus = 'approved' | 'pending_review' | 'changes_requested' | 'rejected';

export type AbnVerificationStatus = 'verified_abr' | 'pending' | 'pending_check' | 'flagged' | 'manual_override';

export interface BusinessVerificationDoc {
  id: string;
  type: 'abn_certificate' | 'storefront_photo' | 'council_license' | 'owner_id' | 'utility_bill';
  docType?: string;
  title: string;
  fileUrl: string;
  uploadedAt: string;
  status: 'verified' | 'pending' | 'flagged';
  notes?: string;
}

export interface BusinessProfile {
  id: string;
  businessName: string;
  legalTradingName?: string;
  abn: string;
  abnStatus: AbnVerificationStatus;
  approvalStatus: BusinessApprovalStatus;
  category: DealCategory;
  description: string;
  logoUrl: string;
  heroImageUrl: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  applicantName?: string;
  applicantEmail?: string;
  applicantPhone?: string;
  appliedAt?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  reviewNotes?: string;
  verificationDocs?: BusinessVerificationDoc[];
  branches: BusinessBranch[];
  subscription: {
    tier: SubscriptionTier;
    status: 'active' | 'trialing' | 'past_due' | 'cancelled';
    billingCycle: 'monthly' | 'annual';
    currentPeriodEnd: string;
    monthlyPriceCents: number;
    currency: CurrencyCode;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
  };
  rating: number;
  reviewCount: number;
  followerCount: number;
  createdAt: string;
}

export interface Deal {
  id: string;
  businessId: string;
  businessName: string;
  businessLogo: string;
  businessCategory: DealCategory;
  branchIds: string[];
  title: string;
  description: string;
  discountPercentage: number;
  originalPriceCents?: number;
  discountedPriceCents?: number;
  radiusMeters: number; // 50m to 5000m
  imageUrl: string;
  qrCodeSeed: string;
  termsAndConditions: string;
  status: 'active' | 'scheduled' | 'expired' | 'paused' | 'moderation_flagged';
  publishTimestamp: string;
  expiryTimestamp: string;
  targetMaxRedemptions?: number;
  currentRedemptionsCount: number;
  // Coordinates of primary location
  location: {
    lat: number;
    lng: number;
    address: string;
    suburb: string;
  };
  metrics: {
    dispatchedCount: number;
    deliveredCount: number;
    viewsCount: number;
    qrScansCount: number;
    redemptionsCount: number;
    conversionRate: number; // percentage e.g. 24.5
    avgTimeToRedeemMinutes: number;
  };
  aiSuggestionGenerated?: boolean;
}

export interface DealEvent {
  id: string;
  dealId: string;
  eventType: 'impression' | 'dispatch' | 'delivered' | 'opened' | 'viewed' | 'qr_scanned' | 'redeemed';
  consumerIdAnonymized: string;
  branchId: string;
  timestamp: string;
  distanceAtEventMeters?: number;
  metadata?: Record<string, any>;
}

export interface CategoryBenchmark {
  category: DealCategory;
  avgConversionRate: number; // e.g. 17.2%
  bestPerformingRadiusBucket: string; // e.g. "50m-200m"
  bestPerformingDiscountBucket: string; // e.g. "25%-35%"
  avgRedemptionsPerDeal: number;
  peakHour: string; // e.g. "14:00 - 16:00"
}

export interface AiDealPerformanceReport {
  dealId: string;
  businessId: string;
  dealTitle: string;
  actualConversionRate: number;
  categoryAverageConversionRate: number;
  historicalBusinessAvgConversionRate: number;
  numericCrossCheckPassed: boolean;
  suggestions: {
    title: string;
    observation: string;
    actionableRecommendation: string;
    confidenceScore: number;
    category: 'radius' | 'discount' | 'timing' | 'duration';
  }[];
  generatedAt: string;
}

export interface UtmCampaignRecord {
  id: string;
  source: string; // e.g. facebook, google, instagram, qr_poster
  medium: string; // e.g. cpc, social, offline, email
  campaign: string; // e.g. adelaide_launch_q3
  term?: string;
  content?: string;
  visits: number;
  signups: number;
  trials: number;
  paidConversions: number;
  revenueGeneratedCents: number;
}

export interface AuditLog {
  id: string;
  adminEmail: string;
  action: string;
  targetEntity: 'deal' | 'business' | 'subscription' | 'category_rule' | 'abn_override' | 'user' | 'merchant_review';
  targetId: string;
  details: string;
  timestamp: string;
  status: 'success' | 'reverted' | 'warning' | 'info';
}

export interface PushNotificationRecord {
  id: string;
  dealId: string;
  dealTitle: string;
  businessName: string;
  targetRadiusM: number;
  matchedUsersCount: number;
  dispatchedAt: string;
  completedAt: string;
  latencyMs: number; // SLA <= 60000ms
  deliveryProvider: 'FCM' | 'APNs' | 'Web_Push';
  status: 'delivered' | 'dispatching' | 'queued';
}

export interface SubscriptionPaymentRecord {
  id: string;
  businessId: string;
  businessName: string;
  amountCents: number;
  currency: CurrencyCode;
  paymentMethod: 'bank_transfer' | 'stripe_card' | 'cash_pos' | 'direct_debit' | 'waived' | 'other';
  referenceNumber: string;
  tier: SubscriptionTier;
  billingCycle: 'monthly' | 'annual';
  recordedByAdminEmail: string;
  status: 'paid' | 'pending' | 'waived';
  settlementNotes?: string;
  createdAt: string;
}

export interface AbnOverrideParams {
  businessId: string;
  abn: string;
  abnStatus: AbnVerificationStatus;
  legalTradingName?: string;
  justification?: string;
  markAsApproved?: boolean;
}

export interface SubscriptionChangeParams {
  businessId: string;
  tier: SubscriptionTier;
  billingCycle: 'monthly' | 'annual';
  payment?: {
    amountCents: number;
    paymentMethod: 'bank_transfer' | 'stripe_card' | 'cash_pos' | 'direct_debit' | 'waived' | 'other';
    referenceNumber: string;
    settlementNotes?: string;
    sendReceiptEmail?: boolean;
  };
}
