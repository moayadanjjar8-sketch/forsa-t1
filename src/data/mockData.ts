import { 
  BusinessProfile, 
  CategoryBenchmark, 
  Deal, 
  UserProfile, 
  UtmCampaignRecord, 
  AuditLog, 
  PushNotificationRecord,
  AiDealPerformanceReport,
  CurrencyConfig,
  SubscriptionPlanConfig,
  SubscriptionPaymentRecord
} from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user_consumer_jordan',
    email: 'jordan.local@example.com',
    fullName: 'Jordan Taylor',
    role: 'consumer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    authProvider: 'google',
    verified: true,
    status: 'active',
    phone: '+61 412 345 678',
    preferredRadiusM: 3000,
    favouriteCategories: ['cafe_coffee', 'restaurant_dining', 'retail_fashion'],
    followedBusinesses: ['biz_amira_cafe', 'biz_king_william_bistro'],
    currentLocation: {
      lat: -34.9228,
      lng: 138.6012,
      suburb: 'Adelaide CBD (Rundle Mall)',
      city: 'Adelaide',
      country: 'Australia'
    },
    pushNotificationEnabled: true,
    biometricsEnabled: true,
    createdAt: '2026-06-10T08:30:00Z',
    lastActive: '2026-08-28T09:45:00Z'
  },
  {
    id: 'user_biz_amira',
    email: 'amira@craftcoffee.adelaide.au',
    fullName: 'Amira Mansour',
    role: 'business_growth',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    authProvider: 'email_otp',
    verified: true,
    status: 'active',
    businessId: 'biz_amira_cafe',
    phone: '+61 423 889 001',
    preferredRadiusM: 1000,
    favouriteCategories: ['cafe_coffee'],
    followedBusinesses: [],
    currentLocation: {
      lat: -34.9232,
      lng: 138.6025,
      suburb: 'Adelaide CBD (Grenfell St)',
      city: 'Adelaide',
      country: 'Australia'
    },
    pushNotificationEnabled: true,
    createdAt: '2026-05-15T10:00:00Z',
    lastActive: '2026-08-28T10:12:00Z'
  },
  {
    id: 'user_biz_marcus',
    email: 'marcus.vance@kwbistro.com.au',
    fullName: 'Marcus Vance',
    role: 'business_enterprise',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    authProvider: 'email_otp',
    verified: true,
    status: 'active',
    businessId: 'biz_king_william_bistro',
    phone: '+61 433 998 123',
    preferredRadiusM: 2000,
    favouriteCategories: ['restaurant_dining'],
    followedBusinesses: [],
    currentLocation: {
      lat: -34.9265,
      lng: 138.5998,
      suburb: 'Adelaide CBD (King William)',
      city: 'Adelaide',
      country: 'Australia'
    },
    pushNotificationEnabled: true,
    createdAt: '2026-04-02T11:20:00Z',
    lastActive: '2026-08-28T08:30:00Z'
  },
  {
    id: 'user_consumer_elena',
    email: 'elena.rostova@adelaideuni.edu.au',
    fullName: 'Elena Rostova',
    role: 'consumer',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    authProvider: 'apple',
    verified: true,
    status: 'active',
    phone: '+61 405 678 910',
    preferredRadiusM: 1500,
    favouriteCategories: ['retail_fashion', 'beauty_wellness', 'cafe_coffee'],
    followedBusinesses: ['biz_north_terrace_apparel', 'biz_glow_wellness'],
    currentLocation: {
      lat: -34.9198,
      lng: 138.6050,
      suburb: 'North Terrace & University',
      city: 'Adelaide',
      country: 'Australia'
    },
    pushNotificationEnabled: true,
    biometricsEnabled: true,
    createdAt: '2026-07-01T14:15:00Z',
    lastActive: '2026-08-28T10:05:00Z'
  },
  {
    id: 'user_admin_salah',
    email: 'superadmin@forsa-t.com',
    fullName: 'Salah Itekedk (Super Admin)',
    role: 'super_admin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    authProvider: 'email_otp',
    verified: true,
    status: 'active',
    phone: '+61 400 900 100',
    preferredRadiusM: 5000,
    favouriteCategories: ['cafe_coffee', 'restaurant_dining', 'beauty_wellness'],
    followedBusinesses: [],
    currentLocation: {
      lat: -34.9285,
      lng: 138.6007,
      suburb: 'Adelaide HQ (Super Admin)',
      city: 'Adelaide',
      country: 'Australia'
    },
    pushNotificationEnabled: true,
    createdAt: '2026-01-01T00:00:00Z',
    lastActive: '2026-08-28T10:17:00Z'
  },
  {
    id: 'user_admin_zayn',
    email: 'ops.admin@forsa-t.com',
    fullName: 'Zayn Bennett (Operations Admin)',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    authProvider: 'email_otp',
    verified: true,
    status: 'active',
    phone: '+61 400 888 222',
    preferredRadiusM: 4000,
    favouriteCategories: ['cafe_coffee', 'restaurant_dining', 'retail_fashion'],
    followedBusinesses: [],
    currentLocation: {
      lat: -34.9250,
      lng: 138.6000,
      suburb: 'Adelaide Operations Hub',
      city: 'Adelaide',
      country: 'Australia'
    },
    pushNotificationEnabled: true,
    createdAt: '2026-02-15T08:00:00Z',
    lastActive: '2026-08-28T11:00:00Z'
  },
  {
    id: 'user_consumer_tariq',
    email: 'tariq.almansoor@outlook.com',
    fullName: 'Tariq Al-Mansoor',
    role: 'consumer',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    authProvider: 'google',
    verified: false,
    status: 'active',
    phone: '+61 411 777 888',
    preferredRadiusM: 2000,
    favouriteCategories: ['entertainment_events', 'restaurant_dining'],
    followedBusinesses: ['biz_amira_cafe'],
    currentLocation: {
      lat: -34.9310,
      lng: 138.6040,
      suburb: 'Hutt Street Precinct',
      city: 'Adelaide',
      country: 'Australia'
    },
    pushNotificationEnabled: false,
    createdAt: '2026-08-15T09:20:00Z',
    lastActive: '2026-08-27T18:00:00Z'
  }
];

export const INITIAL_BUSINESSES: BusinessProfile[] = [
  {
    id: 'biz_amira_cafe',
    businessName: "Amira's Artisan Café & Roastery",
    legalTradingName: "Amira Hospitality Pty Ltd",
    abn: '53 004 085 616',
    abnStatus: 'verified_abr',
    approvalStatus: 'approved',
    applicantName: 'Amira Benali',
    applicantEmail: 'amira@amirasartisan.com.au',
    applicantPhone: '+61 412 345 678',
    appliedAt: '2026-05-14T09:00:00Z',
    reviewedAt: '2026-05-15T10:00:00Z',
    reviewedBy: 'admin@forsa-t.com',
    reviewNotes: 'ABN confirmed on Australian Business Register. Food council license and lease agreement verified for 42 Grenfell St.',
    verificationDocs: [
      {
        id: 'doc_amira_1',
        type: 'abn_certificate',
        title: 'Australian Business Register ABN Confirmation',
        fileUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80',
        uploadedAt: '2026-05-14T09:10:00Z',
        status: 'verified',
        notes: 'ABN Active and GST registered'
      },
      {
        id: 'doc_amira_2',
        type: 'council_license',
        title: 'Adelaide City Council Food Business Notification (FBN)',
        fileUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
        uploadedAt: '2026-05-14T09:15:00Z',
        status: 'verified'
      },
      {
        id: 'doc_amira_3',
        type: 'storefront_photo',
        title: 'Grenfell St Premises Storefront & Signage',
        fileUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&auto=format&fit=crop&q=80',
        uploadedAt: '2026-05-14T09:20:00Z',
        status: 'verified'
      }
    ],
    category: 'cafe_coffee',
    description: 'Specialty single-origin espresso, cold brews, and fresh French pastries baked daily in the heart of Adelaide.',
    logoUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=80',
    website: 'https://amirasartisan.com.au',
    instagram: '@amiras_cafe_adl',
    facebook: 'amirascoffeebar',
    branches: [
      {
        id: 'branch_amira_main',
        businessId: 'biz_amira_cafe',
        branchName: 'Grenfell Flagship (CBD)',
        address: '42 Grenfell Street, Adelaide SA 5000',
        lat: -34.9248,
        lng: 138.6030,
        phone: '+61 8 8231 9901',
        openingHours: 'Mon-Fri 06:30 - 17:00, Sat 08:00 - 15:00',
        isActive: true
      },
      {
        id: 'branch_amira_eastend',
        businessId: 'biz_amira_cafe',
        branchName: 'East End Espresso Kiosk',
        address: '188 Rundle St, Adelaide SA 5000',
        lat: -34.9219,
        lng: 138.6087,
        phone: '+61 8 8231 9902',
        openingHours: 'Mon-Sun 07:00 - 18:00',
        isActive: true
      }
    ],
    subscription: {
      tier: 'growth',
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodEnd: '2026-09-15T00:00:00Z',
      monthlyPriceCents: 14900,
      currency: 'AUD',
      stripeCustomerId: 'cus_ForsaT_Amira987',
      stripeSubscriptionId: 'sub_Stripe_Grow_88231'
    },
    rating: 4.9,
    reviewCount: 342,
    followerCount: 1850,
    createdAt: '2026-05-15T10:00:00Z'
  },
  {
    id: 'biz_king_william_bistro',
    businessName: 'King William Woodfire Bistro',
    legalTradingName: 'Vance Culinary Group SA Pty Ltd',
    abn: '12 876 543 210',
    abnStatus: 'verified_abr',
    approvalStatus: 'approved',
    applicantName: 'Marcus Vance',
    applicantEmail: 'marcus.vance@kwbistro.com.au',
    applicantPhone: '+61 433 998 123',
    appliedAt: '2026-04-01T11:00:00Z',
    reviewedAt: '2026-04-02T11:20:00Z',
    reviewedBy: 'super_admin@forsa-t.com',
    reviewNotes: 'Verified enterprise dining venue with South Australian liquor license and verified commercial premises.',
    verificationDocs: [
      {
        id: 'doc_kwb_1',
        type: 'abn_certificate',
        title: 'ABR Entity Summary Certificate',
        fileUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80',
        uploadedAt: '2026-04-01T11:10:00Z',
        status: 'verified'
      },
      {
        id: 'doc_kwb_2',
        type: 'council_license',
        title: 'Liquor & Gaming SA Producer & Dining Permit',
        fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
        uploadedAt: '2026-04-01T11:15:00Z',
        status: 'verified'
      }
    ],
    category: 'restaurant_dining',
    description: 'Modern Australian woodfired grill, artisanal pasta, and premium local South Australian wines.',
    logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    website: 'https://kingwilliambistro.com.au',
    instagram: '@kingwilliambistro',
    branches: [
      {
        id: 'branch_kwb_1',
        businessId: 'biz_king_william_bistro',
        branchName: 'King William Central',
        address: '112 King William St, Adelaide SA 5000',
        lat: -34.9265,
        lng: 138.5998,
        phone: '+61 8 8212 4433',
        openingHours: 'Tue-Sun 12:00 - 22:00',
        isActive: true
      }
    ],
    subscription: {
      tier: 'enterprise',
      status: 'active',
      billingCycle: 'annual',
      currentPeriodEnd: '2027-04-01T00:00:00Z',
      monthlyPriceCents: 39900,
      currency: 'AUD',
      stripeCustomerId: 'cus_ForsaT_KWB442',
      stripeSubscriptionId: 'sub_Stripe_Ent_99128'
    },
    rating: 4.8,
    reviewCount: 520,
    followerCount: 2940,
    createdAt: '2026-04-02T11:20:00Z'
  },
  {
    id: 'biz_north_terrace_apparel',
    businessName: 'North Terrace Boutique & Apparel',
    legalTradingName: 'Terrace Fashion Collective',
    abn: '98 765 432 109',
    abnStatus: 'verified_abr',
    approvalStatus: 'approved',
    applicantName: 'Chloe Sutherland',
    applicantEmail: 'chloe@northterraceapparel.com.au',
    applicantPhone: '+61 405 112 334',
    category: 'retail_fashion',
    description: 'Curated Australian designer clothing, sustainable leather goods, and premium streetwear.',
    logoUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&auto=format&fit=crop&q=80',
    branches: [
      {
        id: 'branch_nta_1',
        businessId: 'biz_north_terrace_apparel',
        branchName: 'North Terrace Mall',
        address: '77 North Terrace, Adelaide SA 5000',
        lat: -34.9205,
        lng: 138.6018,
        phone: '+61 8 8223 6611',
        openingHours: 'Mon-Sat 10:00 - 18:00, Sun 11:00 - 17:00',
        isActive: true
      }
    ],
    subscription: {
      tier: 'starter',
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodEnd: '2026-09-20T00:00:00Z',
      monthlyPriceCents: 4900,
      currency: 'AUD',
      stripeCustomerId: 'cus_ForsaT_NTA101',
      stripeSubscriptionId: 'sub_Stripe_Start_55210'
    },
    rating: 4.7,
    reviewCount: 198,
    followerCount: 920,
    createdAt: '2026-06-01T09:00:00Z'
  },
  {
    id: 'biz_glow_wellness',
    businessName: 'Glow Botanical Spa & Sanctuary',
    legalTradingName: 'Glow Holistic Health Pty Ltd',
    abn: '45 123 987 654',
    abnStatus: 'verified_abr',
    approvalStatus: 'approved',
    applicantName: 'Dr. Sarah Jenkins',
    applicantEmail: 'sarah@glowbotanicalspa.com.au',
    applicantPhone: '+61 411 998 776',
    category: 'beauty_wellness',
    description: 'Organic facial therapies, deep tissue hydrotherapy, and mindfulness relaxation lounges.',
    logoUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&auto=format&fit=crop&q=80',
    branches: [
      {
        id: 'branch_glow_1',
        businessId: 'biz_glow_wellness',
        branchName: 'Flinders St Sanctuary',
        address: '89 Flinders St, Adelaide SA 5000',
        lat: -34.9271,
        lng: 138.6055,
        phone: '+61 8 8312 7788',
        openingHours: 'Mon-Sat 09:00 - 19:00',
        isActive: true
      }
    ],
    subscription: {
      tier: 'growth',
      status: 'active',
      billingCycle: 'monthly',
      currentPeriodEnd: '2026-09-18T00:00:00Z',
      monthlyPriceCents: 14900,
      currency: 'AUD',
      stripeCustomerId: 'cus_ForsaT_Glow77',
      stripeSubscriptionId: 'sub_Stripe_Grow_7721'
    },
    rating: 4.9,
    reviewCount: 410,
    followerCount: 2130,
    createdAt: '2026-05-20T14:30:00Z'
  },
  {
    id: 'biz_hutt_bakehouse',
    businessName: 'Hutt Street Sourdough & Patisserie',
    legalTradingName: 'Hutt Bakery Holdings Pty Ltd',
    abn: '71 902 441 883',
    abnStatus: 'pending',
    approvalStatus: 'pending_review',
    applicantName: 'Julian Moreau',
    applicantEmail: 'julian@huttbakehouse.com.au',
    applicantPhone: '+61 422 789 012',
    appliedAt: '2026-08-28T14:22:00Z',
    reviewNotes: 'New applicant. ABN active since 2024. Waiting for Admin physical geofence and food registration check.',
    verificationDocs: [
      {
        id: 'doc_hutt_1',
        type: 'abn_certificate',
        title: 'Australian Business Register ABN Extract (ABN 71 902 441 883)',
        fileUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80',
        uploadedAt: '2026-08-28T14:25:00Z',
        status: 'pending',
        notes: 'ABN Match: Hutt Bakery Holdings Pty Ltd'
      },
      {
        id: 'doc_hutt_2',
        type: 'council_license',
        title: 'City of Adelaide Food Premises Permit #FP-88912',
        fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
        uploadedAt: '2026-08-28T14:28:00Z',
        status: 'pending'
      },
      {
        id: 'doc_hutt_3',
        type: 'storefront_photo',
        title: 'Commercial Storefront & Entrance Photo',
        fileUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
        uploadedAt: '2026-08-28T14:30:00Z',
        status: 'pending'
      },
      {
        id: 'doc_hutt_4',
        type: 'owner_id',
        title: 'Applicant Director South Australian Driver Licence',
        fileUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
        uploadedAt: '2026-08-28T14:31:00Z',
        status: 'pending'
      }
    ],
    category: 'cafe_coffee',
    description: 'Slow-fermented woodfired sourdough loaves, almond croissants, and batch brew coffee on historic Hutt Street.',
    logoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    website: 'https://huttbakehouse.com.au',
    instagram: '@huttbakehouse',
    branches: [
      {
        id: 'branch_hutt_1',
        businessId: 'biz_hutt_bakehouse',
        branchName: 'Hutt St Flagship',
        address: '154 Hutt St, Adelaide SA 5000',
        lat: -34.9312,
        lng: 138.6110,
        phone: '+61 8 8232 4001',
        openingHours: 'Wed-Sun 06:30 - 15:00',
        isActive: false
      }
    ],
    subscription: {
      tier: 'growth',
      status: 'trialing',
      billingCycle: 'monthly',
      currentPeriodEnd: '2026-09-11T00:00:00Z',
      monthlyPriceCents: 14900,
      currency: 'AUD',
      stripeCustomerId: 'cus_ForsaT_Hutt12',
      stripeSubscriptionId: 'sub_Stripe_Trial_993'
    },
    rating: 0,
    reviewCount: 0,
    followerCount: 14,
    createdAt: '2026-08-28T14:22:00Z'
  },
  {
    id: 'biz_hindley_vr_arcade',
    businessName: 'Hindley Neon VR & Gaming Lounge',
    legalTradingName: 'Hindley Entertainment Ops SA',
    abn: '33 456 789 012',
    abnStatus: 'pending',
    approvalStatus: 'changes_requested',
    applicantName: 'Liam Chen',
    applicantEmail: 'liam@hindleyvr.com.au',
    applicantPhone: '+61 430 556 778',
    appliedAt: '2026-08-27T10:15:00Z',
    reviewedAt: '2026-08-28T09:00:00Z',
    reviewedBy: 'moderator_admin@forsa-t.com',
    reviewNotes: 'Admin requested updated lease agreement document with floor plan to confirm physical boundary on Hindley Street.',
    rejectionReason: 'Missing current commercial lease agreement showing physical entrance on Hindley St.',
    verificationDocs: [
      {
        id: 'doc_vr_1',
        type: 'abn_certificate',
        title: 'ABR Registration Document',
        fileUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=80',
        uploadedAt: '2026-08-27T10:20:00Z',
        status: 'verified',
        notes: 'ABN verified'
      },
      {
        id: 'doc_vr_2',
        type: 'council_license',
        title: 'Place of Public Entertainment (POPE) Certificate',
        fileUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
        uploadedAt: '2026-08-27T10:22:00Z',
        status: 'flagged',
        notes: 'Expired permit submitted - updated copy requested.'
      }
    ],
    category: 'entertainment_events',
    description: 'Immersive multiplayer VR escape rooms, simulator racing rigs, and esports lounge in the Adelaide West End.',
    logoUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=200&auto=format&fit=crop&q=80',
    heroImageUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80',
    website: 'https://hindleyvr.com.au',
    instagram: '@hindley_vr_adl',
    branches: [
      {
        id: 'branch_vr_1',
        businessId: 'biz_hindley_vr_arcade',
        branchName: 'Hindley West End Hub',
        address: '64 Hindley St, Adelaide SA 5000',
        lat: -34.9238,
        lng: 138.5950,
        phone: '+61 8 8211 9000',
        openingHours: 'Mon-Sun 12:00 - 00:00',
        isActive: false
      }
    ],
    subscription: {
      tier: 'starter',
      status: 'trialing',
      billingCycle: 'monthly',
      currentPeriodEnd: '2026-09-10T00:00:00Z',
      monthlyPriceCents: 4900,
      currency: 'AUD',
      stripeCustomerId: 'cus_ForsaT_VR88',
      stripeSubscriptionId: 'sub_Stripe_Trial_VR88'
    },
    rating: 0,
    reviewCount: 0,
    followerCount: 8,
    createdAt: '2026-08-27T10:15:00Z'
  }
];

export const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal_amira_afternoon_coffee',
    businessId: 'biz_amira_cafe',
    businessName: "Amira's Artisan Café & Roastery",
    businessLogo: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=200&auto=format&fit=crop&q=80',
    businessCategory: 'cafe_coffee',
    branchIds: ['branch_amira_main'],
    title: '☕ 30% Off All Specialty Flat Whites & Croissants (Happy Hour)',
    description: 'Flash afternoon surge deal! Enjoy freshly pulled single origin espresso and hand-rolled butter croissants. Available for the next 90 minutes.',
    discountPercentage: 30,
    originalPriceCents: 1100,
    discountedPriceCents: 770,
    radiusMeters: 500,
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
    qrCodeSeed: 'FORSAT-AMIRA-DEAL-88231',
    termsAndConditions: 'Limit 1 voucher redemption per customer. Valid for dine-in or takeaway at Grenfell St branch only. Cannot be combined with loyalty stamp cards.',
    status: 'active',
    publishTimestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    expiryTimestamp: new Date(Date.now() + 75 * 60 * 1000).toISOString(),
    targetMaxRedemptions: 60,
    currentRedemptionsCount: 22,
    location: {
      lat: -34.9248,
      lng: 138.6030,
      address: '42 Grenfell St, Adelaide CBD',
      suburb: 'Adelaide CBD'
    },
    metrics: {
      dispatchedCount: 142,
      deliveredCount: 140,
      viewsCount: 88,
      qrScansCount: 24,
      redemptionsCount: 22,
      conversionRate: 25.0,
      avgTimeToRedeemMinutes: 18.5
    },
    aiSuggestionGenerated: true
  },
  {
    id: 'deal_kwb_woodfire_dinner',
    businessId: 'biz_king_william_bistro',
    businessName: 'King William Woodfire Bistro',
    businessLogo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&auto=format&fit=crop&q=80',
    businessCategory: 'restaurant_dining',
    branchIds: ['branch_kwb_1'],
    title: '🥩 25% Off Woodfired Wagyu Ribeye & Complimentary Shiraz Glass',
    description: 'Early bird dinner special! 300g MB5+ Australian Wagyu Ribeye served with truffle crushed potatoes and Barossa Shiraz.',
    discountPercentage: 25,
    originalPriceCents: 6800,
    discountedPriceCents: 5100,
    radiusMeters: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    qrCodeSeed: 'FORSAT-KWB-DEAL-99120',
    termsAndConditions: 'Valid between 5:30 PM and 7:00 PM today. Booking recommended or walk-in subject to table availability. 18+ for complimentary wine.',
    status: 'active',
    publishTimestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    expiryTimestamp: new Date(Date.now() + 150 * 60 * 1000).toISOString(),
    targetMaxRedemptions: 30,
    currentRedemptionsCount: 11,
    location: {
      lat: -34.9265,
      lng: 138.5998,
      address: '112 King William St, Adelaide',
      suburb: 'Adelaide CBD'
    },
    metrics: {
      dispatchedCount: 310,
      deliveredCount: 304,
      viewsCount: 165,
      qrScansCount: 14,
      redemptionsCount: 11,
      conversionRate: 18.2,
      avgTimeToRedeemMinutes: 34.0
    },
    aiSuggestionGenerated: true
  },
  {
    id: 'deal_nta_apparel_flash',
    businessId: 'biz_north_terrace_apparel',
    businessName: 'North Terrace Boutique & Apparel',
    businessLogo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&auto=format&fit=crop&q=80',
    businessCategory: 'retail_fashion',
    branchIds: ['branch_nta_1'],
    title: '👗 40% Off Premium Autumn Knitwear & Designer Jackets',
    description: 'Mid-season warehouse clearance flash deal. Top Australian designer labels only 2 blocks from Adelaide Train Station.',
    discountPercentage: 40,
    originalPriceCents: 18000,
    discountedPriceCents: 10800,
    radiusMeters: 800,
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
    qrCodeSeed: 'FORSAT-NTA-DEAL-33412',
    termsAndConditions: 'Applies to marked yellow-tag and blue-tag designer knitwear. No refunds on discounted flash items, exchanges welcome within 7 days.',
    status: 'active',
    publishTimestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    expiryTimestamp: new Date(Date.now() + 180 * 60 * 1000).toISOString(),
    targetMaxRedemptions: 40,
    currentRedemptionsCount: 8,
    location: {
      lat: -34.9205,
      lng: 138.6018,
      address: '77 North Terrace, Adelaide',
      suburb: 'Adelaide CBD'
    },
    metrics: {
      dispatchedCount: 195,
      deliveredCount: 191,
      viewsCount: 92,
      qrScansCount: 9,
      redemptionsCount: 8,
      conversionRate: 14.5,
      avgTimeToRedeemMinutes: 22.0
    },
    aiSuggestionGenerated: false
  },
  {
    id: 'deal_glow_express_facial',
    businessId: 'biz_glow_wellness',
    businessName: 'Glow Botanical Spa & Sanctuary',
    businessLogo: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=200&auto=format&fit=crop&q=80',
    businessCategory: 'beauty_wellness',
    branchIds: ['branch_glow_1'],
    title: '🌿 $45 Express 30-Min Botanical Glow Facial (Save 35%)',
    description: 'Instant lunchtime rejuvenation! Deep ultrasonic cleansing, hyaluronic oxygen mist, and organic rosehip botanical mask.',
    discountPercentage: 35,
    originalPriceCents: 7000,
    discountedPriceCents: 4500,
    radiusMeters: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    qrCodeSeed: 'FORSAT-GLOW-DEAL-11099',
    termsAndConditions: 'Strictly 5 slots remaining today. Must redeem between 12:00 PM and 3:00 PM. Call ahead or present directly.',
    status: 'active',
    publishTimestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    expiryTimestamp: new Date(Date.now() + 105 * 60 * 1000).toISOString(),
    targetMaxRedemptions: 15,
    currentRedemptionsCount: 5,
    location: {
      lat: -34.9271,
      lng: 138.6055,
      address: '89 Flinders St, Adelaide',
      suburb: 'Adelaide CBD'
    },
    metrics: {
      dispatchedCount: 120,
      deliveredCount: 118,
      viewsCount: 64,
      qrScansCount: 6,
      redemptionsCount: 5,
      conversionRate: 21.0,
      avgTimeToRedeemMinutes: 12.0
    },
    aiSuggestionGenerated: true
  }
];

export const CATEGORY_BENCHMARKS: CategoryBenchmark[] = [
  {
    category: 'cafe_coffee',
    avgConversionRate: 17.2,
    bestPerformingRadiusBucket: '50m - 500m',
    bestPerformingDiscountBucket: '25% - 30%',
    avgRedemptionsPerDeal: 28,
    peakHour: '07:30 - 09:30 & 14:00 - 15:30'
  },
  {
    category: 'restaurant_dining',
    avgConversionRate: 14.8,
    bestPerformingRadiusBucket: '500m - 2000m',
    bestPerformingDiscountBucket: '20% - 25%',
    avgRedemptionsPerDeal: 18,
    peakHour: '12:00 - 13:30 & 17:30 - 20:00'
  },
  {
    category: 'retail_fashion',
    avgConversionRate: 11.5,
    bestPerformingRadiusBucket: '300m - 1200m',
    bestPerformingDiscountBucket: '30% - 40%',
    avgRedemptionsPerDeal: 14,
    peakHour: '12:30 - 14:00 & 16:30 - 18:00'
  },
  {
    category: 'beauty_wellness',
    avgConversionRate: 18.6,
    bestPerformingRadiusBucket: '500m - 1500m',
    bestPerformingDiscountBucket: '25% - 35%',
    avgRedemptionsPerDeal: 12,
    peakHour: '11:00 - 15:00'
  },
  {
    category: 'entertainment_events',
    avgConversionRate: 13.0,
    bestPerformingRadiusBucket: '1000m - 4000m',
    bestPerformingDiscountBucket: '20% - 30%',
    avgRedemptionsPerDeal: 35,
    peakHour: '18:00 - 22:00'
  },
  {
    category: 'services_auto',
    avgConversionRate: 9.4,
    bestPerformingRadiusBucket: '2000m - 5000m',
    bestPerformingDiscountBucket: '15% - 25%',
    avgRedemptionsPerDeal: 8,
    peakHour: '08:00 - 11:00'
  }
];

export const INITIAL_AI_REPORTS: Record<string, AiDealPerformanceReport> = {
  deal_amira_afternoon_coffee: {
    dealId: 'deal_amira_afternoon_coffee',
    businessId: 'biz_amira_cafe',
    dealTitle: '☕ 30% Off All Specialty Flat Whites & Croissants (Happy Hour)',
    actualConversionRate: 25.0,
    categoryAverageConversionRate: 17.2,
    historicalBusinessAvgConversionRate: 16.8,
    numericCrossCheckPassed: true,
    suggestions: [
      {
        category: 'radius',
        title: 'Tight 500m Radius Supercharged Footfall',
        observation: 'Your 500m radius achieved a 25.0% conversion rate compared to previous 1500m campaigns which averaged 12.4%.',
        actionableRecommendation: 'Keep hyper-local radius between 300m–500m for afternoon peak hours (2:00 PM – 4:00 PM). Pedestrians within 500m converted 3.2x faster.',
        confidenceScore: 0.94
      },
      {
        category: 'discount',
        title: '30% Discount Sweet Spot Detected',
        observation: '30% discount delivered 22 redemptions in 90 mins, whereas past 40% discount deals yielded 18 redemptions at lower revenue margins.',
        actionableRecommendation: 'Do not increase discount to 40% on coffee. 30% is the optimal profit-volume equilibrium for your category.',
        confidenceScore: 0.91
      },
      {
        category: 'timing',
        title: 'Friday 2:00 PM Outperformed Morning Deals',
        observation: 'Afternoon coffee deals convert 45% higher than 8:00 AM breakfast deals because morning commuters have fixed habits.',
        actionableRecommendation: 'Schedule automatic recurring Friday 2:00 PM flash drops with 60-minute duration.',
        confidenceScore: 0.88
      }
    ],
    generatedAt: '2026-08-25T14:45:00Z'
  }
};

export const INITIAL_UTM_RECORDS: UtmCampaignRecord[] = [
  {
    id: 'utm_1',
    source: 'meta_ads',
    medium: 'cpc',
    campaign: 'adelaide_cbd_merchants_launch',
    term: 'cafe_discount_software',
    content: 'video_barista_testimonial',
    visits: 4280,
    signups: 340,
    trials: 185,
    paidConversions: 48,
    revenueGeneratedCents: 715200 // $7,152.00
  },
  {
    id: 'utm_2',
    source: 'google_search',
    medium: 'cpc',
    campaign: 'hyperlocal_deals_australia',
    term: 'geofence_deals_app',
    content: 'search_ad_v2',
    visits: 6150,
    signups: 512,
    trials: 290,
    paidConversions: 82,
    revenueGeneratedCents: 1221800 // $12,218.00
  },
  {
    id: 'utm_3',
    source: 'qr_flyer',
    medium: 'offline_print',
    campaign: 'rundle_mall_merchant_drive',
    term: 'b2b_door_to_door',
    content: 'a5_gold_foil_card',
    visits: 890,
    signups: 114,
    trials: 76,
    paidConversions: 31,
    revenueGeneratedCents: 461900 // $4,619.00
  },
  {
    id: 'utm_4',
    source: 'linkedin_b2b',
    medium: 'sponsored_content',
    campaign: 'restaurant_hospitality_sa',
    term: 'hospitality_revenue_optimizer',
    content: 'case_study_kwb',
    visits: 1420,
    signups: 98,
    trials: 64,
    paidConversions: 24,
    revenueGeneratedCents: 957600 // $9,576.00 (Enterprise focus)
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit_01',
    adminEmail: 'admin@forsa-t.com',
    action: 'ABN Verification Manual Approval',
    targetEntity: 'abn_override',
    targetId: 'biz_amira_cafe',
    details: 'Verified entity identity via Australian Business Register API fallback cross-reference.',
    timestamp: '2026-08-25T11:20:00Z',
    status: 'success'
  },
  {
    id: 'audit_02',
    adminEmail: 'admin@forsa-t.com',
    action: 'Deal Approved & Geofence Dispatched',
    targetEntity: 'deal',
    targetId: 'deal_amira_afternoon_coffee',
    details: 'Published deal with 500m radius. PostGIS resolved 142 consumer endpoints in 24ms.',
    timestamp: '2026-08-25T13:00:00Z',
    status: 'success'
  },
  {
    id: 'audit_03',
    adminEmail: 'admin@forsa-t.com',
    action: 'Category Commission & Pricing Rule Update',
    targetEntity: 'category_rule',
    targetId: 'cafe_coffee',
    details: 'Set default step radius limits to 50m, 200m, 500m, 1000m, 3000m.',
    timestamp: '2026-08-24T09:15:00Z',
    status: 'success'
  }
];

export const INITIAL_PUSH_DISPATCHES: PushNotificationRecord[] = [
  {
    id: 'push_dispatch_101',
    dealId: 'deal_amira_afternoon_coffee',
    dealTitle: '☕ 30% Off All Specialty Flat Whites & Croissants (Happy Hour)',
    businessName: "Amira's Artisan Café & Roastery",
    targetRadiusM: 500,
    matchedUsersCount: 142,
    dispatchedAt: '2026-08-25T13:00:01Z',
    completedAt: '2026-08-25T13:00:04Z',
    latencyMs: 3120, // 3.12s, well within 60s SLA
    deliveryProvider: 'FCM',
    status: 'delivered'
  },
  {
    id: 'push_dispatch_102',
    dealId: 'deal_kwb_woodfire_dinner',
    dealTitle: '🥩 25% Off Woodfired Wagyu Ribeye & Complimentary Shiraz Glass',
    businessName: 'King William Woodfire Bistro',
    targetRadiusM: 1500,
    matchedUsersCount: 310,
    dispatchedAt: '2026-08-25T12:15:00Z',
    completedAt: '2026-08-25T12:15:06Z',
    latencyMs: 5840,
    deliveryProvider: 'APNs',
    status: 'delivered'
  }
];

export const INITIAL_CURRENCIES: CurrencyConfig[] = [
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: '$',
    rateToAud: 1.0,
    flag: '🇦🇺',
    formatPosition: 'prefix',
    isDefault: true,
    decimals: 2,
    enabled: true
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rateToAud: 0.65,
    flag: '🇺🇸',
    formatPosition: 'prefix',
    isDefault: false,
    decimals: 2,
    enabled: true
  },
  {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: 'ر.س',
    rateToAud: 2.44,
    flag: '🇸🇦',
    formatPosition: 'suffix',
    isDefault: false,
    decimals: 2,
    enabled: true
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'د.إ',
    rateToAud: 2.39,
    flag: '🇦🇪',
    formatPosition: 'suffix',
    isDefault: false,
    decimals: 2,
    enabled: true
  },
  {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    rateToAud: 0.88,
    flag: '🇸🇬',
    formatPosition: 'prefix',
    isDefault: false,
    decimals: 2,
    enabled: true
  },
  {
    code: 'MYR',
    name: 'Malaysian Ringgit',
    symbol: 'RM',
    rateToAud: 3.08,
    flag: '🇲🇾',
    formatPosition: 'prefix',
    isDefault: false,
    decimals: 2,
    enabled: true
  },
  {
    code: 'THB',
    name: 'Thai Baht',
    symbol: '฿',
    rateToAud: 23.40,
    flag: '🇹🇭',
    formatPosition: 'prefix',
    isDefault: false,
    decimals: 0,
    enabled: true
  },
  {
    code: 'IDR',
    name: 'Indonesian Rupiah',
    symbol: 'Rp',
    rateToAud: 10450.0,
    flag: '🇮🇩',
    formatPosition: 'prefix',
    isDefault: false,
    decimals: 0,
    enabled: true
  }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlanConfig[] = [
  {
    id: 'starter',
    tierKey: 'starter',
    name: 'Starter Plan',
    priceMonthlyAud: 49,
    priceAnnualAud: 470,
    badge: 'Single Location',
    description: 'Perfect for independent cafés, boutique shops, and neighborhood gems.',
    features: [
      'Up to 10 active flash deals / month',
      'Single branch location geofencing',
      'Standard radius matching (50m to 2km)',
      'Push notification',
      'Basic real-time redemption analytics',
      'Standard QR code in-store validator'
    ],
    maxDealsPerMonth: 10,
    maxBranches: 1,
    maxRadiusMeters: 2000,
    priorityQueue: false,
    aiSuggestionsEnabled: false,
    salesCommissionPercent: 0,
    isActive: true,
    popular: false
  },
  {
    id: 'growth',
    tierKey: 'growth',
    name: 'Growth Plan',
    priceMonthlyAud: 149,
    priceAnnualAud: 1430,
    badge: 'Most Popular',
    description: 'For thriving local businesses aiming to maximize off-peak foot traffic.',
    features: [
      'Unlimited flash deals & scheduled drops',
      'Up to 3 branch locations included',
      'Extended radius matching (50m to 5km)',
      'Priority push notification dispatch queue',
      'One-tap Instagram & Facebook deal syndication',
      'Full funnel analytics (Impression to Scan)',
      'Claude AI Deal Performance suggestions (Phase 4)',
      'Category benchmark competitive metrics'
    ],
    maxDealsPerMonth: 'unlimited',
    maxBranches: 3,
    maxRadiusMeters: 5000,
    priorityQueue: true,
    aiSuggestionsEnabled: true,
    salesCommissionPercent: 0,
    isActive: true,
    popular: true
  },
  {
    id: 'enterprise',
    tierKey: 'enterprise',
    name: 'Enterprise Plan',
    priceMonthlyAud: 399,
    priceAnnualAud: 3830,
    badge: 'Chains & Franchises',
    description: 'Tailored for restaurant groups, franchises, and regional retail networks.',
    features: [
      'Unlimited branch locations with dedup fan-out',
      'Multi-branch aggregated rollups & branch leaderboards',
      'Custom geofence boundaries & polygonal zones',
      'Dedicated Redis Streams priority worker pool',
      'Custom webhook triggers & POS API access',
      'AI Recommendation Engine with custom discount elasticity',
      'Dedicated account manager & 99.9% Uptime SLA',
      'Multi-currency automated settlement'
    ],
    maxDealsPerMonth: 'unlimited',
    maxBranches: 'unlimited',
    maxRadiusMeters: 10000,
    priorityQueue: true,
    aiSuggestionsEnabled: true,
    salesCommissionPercent: 0,
    isActive: true,
    popular: false
  }
];

export const INITIAL_SUBSCRIPTION_PAYMENTS: SubscriptionPaymentRecord[] = [
  {
    id: 'pay_init_01',
    businessId: 'biz_amira_cafe',
    businessName: "Amira's Artisan Café & Roastery",
    amountCents: 4900,
    currency: 'AUD',
    paymentMethod: 'stripe_card',
    referenceNumber: 'REC-STR-2026-94812',
    tier: 'starter',
    billingCycle: 'monthly',
    recordedByAdminEmail: 'admin@forsa-t.com',
    status: 'paid',
    settlementNotes: 'Initial onboarding Starter plan subscription via Stripe Card charge.',
    createdAt: '2026-08-01T10:00:00Z'
  },
  {
    id: 'pay_init_02',
    businessId: 'biz_king_william_bistro',
    businessName: 'King William Woodfire Bistro',
    amountCents: 39900,
    currency: 'AUD',
    paymentMethod: 'bank_transfer',
    referenceNumber: 'REC-EFT-2026-44910',
    tier: 'enterprise',
    billingCycle: 'monthly',
    recordedByAdminEmail: 'admin@forsa-t.com',
    status: 'paid',
    settlementNotes: 'Direct EFT Bank transfer received for Enterprise geofencing tier.',
    createdAt: '2026-08-15T14:30:00Z'
  }
];
