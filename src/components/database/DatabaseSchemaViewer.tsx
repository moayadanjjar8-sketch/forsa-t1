import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Database, 
  Table, 
  Code, 
  Zap, 
  Server, 
  CheckCircle, 
  Layers, 
  Compass, 
  Sliders, 
  Play, 
  Terminal, 
  Sparkles,
  ArrowRight,
  ShieldAlert,
  GitBranch,
  Clock,
  DollarSign,
  User,
  Users,
  Smartphone,
  Key,
  ShieldCheck,
  Eye,
  FileText,
  Copy,
  Check,
  MapPin,
  Flame,
  ArrowDownRight
} from 'lucide-react';

export const DatabaseSchemaViewer: React.FC = () => {
  const { deals, businesses, systemHealth, allUsers } = useApp();

  const [activeTab, setActiveTab] = useState<'tables' | 'er_diagram' | 'sql_playground' | 'ddl_generator' | 'live_data' | 'architecture' | 'roadmap'>('tables');
  const [selectedTable, setSelectedTable] = useState<string>('users');
  const [copiedDdl, setCopiedDdl] = useState<boolean>(false);

  // SQL Runner state
  const [activeQueryIndex, setActiveQueryIndex] = useState<number>(0);
  const [queryRunning, setQueryRunning] = useState<boolean>(false);
  const [queryExecutionTime, setQueryExecutionTime] = useState<number>(14.6);

  const sampleQueries = [
    {
      name: 'PostGIS ST_DWithin Geofence Match (Adelaide CBD)',
      sql: `-- 1. Identify active candidate consumers within a 500m radius of Amira's Café
SELECT 
  u.id AS user_id,
  u.full_name,
  u.email,
  u.preferred_radius_m,
  u.fcm_push_token,
  ROUND(ST_Distance(u.current_location, ST_SetSRID(ST_MakePoint(138.6030, -34.9248), 4326)::geography)::numeric, 1) AS distance_meters
FROM users u
WHERE u.role = 'consumer'
  AND u.account_status = 'active'
  AND u.push_notifications_enabled = TRUE
  AND ST_DWithin(
    u.current_location,
    ST_SetSRID(ST_MakePoint(138.6030, -34.9248), 4326)::geography,
    500 -- 500 meter geofence radius
  )
  AND (u.last_deal_notification_at IS NULL OR u.last_deal_notification_at < NOW() - INTERVAL '30 minutes') -- 30-min cooldown
ORDER BY distance_meters ASC
LIMIT 500;`,
      explain: `Index Scan using idx_users_location_gist on users u
  Filter: (ST_DWithin(current_location, ... , 500) AND cooldown_passed)
  Execution Time: 14.6 ms | Rows Matched: 142 Active Mobile Devices`
    },
    {
      name: 'User Multi-Device FCM/APNs Token Resolution',
      sql: `-- 2. Retrieve active device tokens with battery-optimized push routing
SELECT 
  u.id AS user_id,
  u.full_name,
  ud.device_token,
  ud.platform, -- 'ios' or 'android'
  ud.app_version,
  ud.last_active_at
FROM users u
JOIN user_devices ud ON ud.user_id = u.id
WHERE u.account_status = 'active'
  AND ud.is_push_active = TRUE
  AND u.push_notifications_enabled = TRUE;`,
      explain: `Hash Join (user_devices ud JOIN users u ON u.id = ud.user_id)
  Execution Time: 8.4 ms | Resolved push tokens for high-speed dispatch`
    },
    {
      name: 'User Redemption Verification & Voucher Integrity',
      sql: `-- 3. POS optical QR code scan validation & transaction atomic commit
SELECT 
  ur.id AS redemption_id,
  ur.deal_id,
  ur.user_id,
  u.full_name AS consumer_name,
  d.title AS deal_title,
  d.discounted_price_cents,
  ur.redeemed_at,
  ur.pos_device_id
FROM user_redemptions ur
JOIN users u ON u.id = ur.user_id
JOIN deals d ON d.id = ur.deal_id
WHERE ur.qr_voucher_code = 'VOUCH_AMIRA_98432'
  AND ur.status = 'verified'
FOR UPDATE;`,
      explain: `Index Scan on user_redemptions (qr_voucher_code) -> Row-level lock
  Execution Time: 3.2 ms | Cryptographic voucher validation verified`
    },
    {
      name: 'Multi-Branch Deduplication Fan-Out (Enterprise)',
      sql: `-- 4. Deduplicate multi-branch alerts so a consumer following 3 branches gets only 1 notification
WITH matching_branches AS (
  SELECT b.id AS branch_id, b.business_id, b.location
  FROM branches b
  WHERE b.business_id = 'biz_king_william_bistro' AND b.is_active = TRUE
),
matched_users AS (
  SELECT DISTINCT ON (u.id)
    u.id AS user_id,
    u.fcm_push_token,
    mb.branch_id,
    ST_Distance(u.current_location, mb.location) AS min_distance_m
  FROM users u
  JOIN matching_branches mb 
    ON ST_DWithin(u.current_location, mb.location, 1500)
  ORDER BY u.id, min_distance_m ASC
)
SELECT * FROM matched_users;`,
      explain: `Unique on (u.id) -> Nested Loop with GiST Spatial index
  Execution Time: 19.8 ms | Deduplicated Records: 310`
    },
    {
      name: 'Claude AI Historical Data Layer Query (Phase 4)',
      sql: `-- 5. Aggregate deal performance vs business baseline & category benchmark
SELECT 
  d.id AS deal_id,
  d.radius_m,
  d.discount_pct,
  dm.conversion_rate AS deal_actual_conv,
  cb.avg_conversion_rate AS category_benchmark_conv,
  bhs.avg_conversion_rate AS business_historical_conv,
  bhs.best_performing_radius AS business_best_radius
FROM deals d
JOIN deal_metrics dm ON dm.deal_id = d.id
JOIN category_benchmarks cb ON cb.category_id = d.category_id
JOIN business_history_summary bhs ON bhs.business_id = d.business_id
WHERE d.id = 'deal_amira_afternoon_coffee';`,
      explain: `Hash Join on Materialized Fact & Benchmark Tables
  Execution Time: 3.8 ms | Data verified for Claude AI Prompt`
    }
  ];

  const handleRunQuery = () => {
    setQueryRunning(true);
    setTimeout(() => {
      setQueryExecutionTime(+(10 + Math.random() * 8).toFixed(1));
      setQueryRunning(false);
    }, 400);
  };

  const schemaTables = [
    {
      name: 'users',
      category: 'Identity & Spatial',
      desc: 'Central identity table for Mobile Shoppers, Local Merchants, and Platform Administrators with PostGIS spatial coordinates & FCM push tokens',
      columns: [
        { name: 'id', type: 'UUID PRIMARY KEY', desc: 'Unique user identifier (UUID v4 default gen_random_uuid())', isKey: true },
        { name: 'email', type: 'VARCHAR(255) UNIQUE NOT NULL', desc: 'Normalized lowercase email with unique B-tree index', isIndexed: true },
        { name: 'phone', type: 'VARCHAR(32)', desc: 'E.164 formatted phone number for SMS and 2FA OTP (+61 4...)' },
        { name: 'password_hash', type: 'VARCHAR(255) NOT NULL', desc: 'Argon2id / bcrypt salted password hash (never plain text)' },
        { name: 'role', type: 'VARCHAR(32) NOT NULL', desc: 'consumer | business_starter | business_growth | business_enterprise | admin | super_admin' },
        { name: 'full_name', type: 'VARCHAR(255) NOT NULL', desc: 'Full display name of the user or merchant representative' },
        { name: 'avatar_url', type: 'TEXT', desc: 'AWS S3 / CloudFront hosted profile picture URI' },
        { name: 'business_id', type: 'UUID REFERENCES businesses(id) ON DELETE SET NULL', desc: 'Foreign key to businesses table (NULL for consumer shoppers)', isFk: true },
        { name: 'current_location', type: 'GEOGRAPHY(Point, 4326)', desc: 'PostGIS point (lng, lat) with GiST spatial index for sub-60s ST_DWithin geofence matching', isSpatial: true },
        { name: 'preferred_radius_m', type: 'INTEGER DEFAULT 3000', desc: 'Consumer Deal Radar filter radius (500m to 5000m walking/driving steps)' },
        { name: 'favourite_categories', type: 'VARCHAR(64)[] DEFAULT ARRAY[\'cafe_coffee\', \'restaurant_dining\']', desc: 'PostgreSQL array of subscribed taxonomy category IDs' },
        { name: 'home_suburb', type: 'VARCHAR(128) DEFAULT \'Adelaide CBD\'', desc: 'Primary living / working suburb for fallback matching' },
        { name: 'fcm_push_token', type: 'TEXT', desc: 'Active Firebase Cloud Messaging / Apple APNs registration token for push notifications' },
        { name: 'push_notifications_enabled', type: 'BOOLEAN DEFAULT TRUE', desc: 'Master opt-in switch for background and foreground deal alerts' },
        { name: 'biometrics_enabled', type: 'BOOLEAN DEFAULT FALSE', desc: 'Flag indicating FaceID / TouchID biometric login configured' },
        { name: 'last_deal_notification_at', type: 'TIMESTAMPTZ', desc: 'Timestamp of last deal dispatch (enforces 30-minute anti-spam cooldown)' },
        { name: 'last_location_updated_at', type: 'TIMESTAMPTZ', desc: 'Battery-optimized background GPS heartbeat timestamp' },
        { name: 'account_status', type: 'VARCHAR(32) DEFAULT \'active\'', desc: 'active | suspended | pending_verification | soft_deleted' },
        { name: 'email_verified_at', type: 'TIMESTAMPTZ', desc: 'Timestamp when OTP or email link was verified' },
        { name: 'created_at', type: 'TIMESTAMPTZ DEFAULT NOW()', desc: 'Account registration timestamp' },
        { name: 'updated_at', type: 'TIMESTAMPTZ DEFAULT NOW()', desc: 'Last record update timestamp' },
        { name: 'deleted_at', type: 'TIMESTAMPTZ NULL', desc: 'GDPR / Australian Privacy Principles right-to-be-forgotten soft delete' }
      ]
    },
    {
      name: 'user_devices',
      category: 'Push & Hardware',
      desc: 'Multi-device push notification tokens for native iOS and Android hardware installations',
      columns: [
        { name: 'id', type: 'UUID PRIMARY KEY', desc: 'Unique device registration record', isKey: true },
        { name: 'user_id', type: 'UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE', desc: 'Associated user account', isFk: true },
        { name: 'device_token', type: 'TEXT NOT NULL', desc: 'FCM / APNs device push token string' },
        { name: 'platform', type: 'VARCHAR(16) NOT NULL', desc: 'ios | android' },
        { name: 'device_model', type: 'VARCHAR(128)', desc: 'e.g. iPhone 15 Pro, Samsung Galaxy S24' },
        { name: 'app_version', type: 'VARCHAR(32)', desc: 'e.g. 1.0.4' },
        { name: 'is_push_active', type: 'BOOLEAN DEFAULT TRUE', desc: 'Device push permission status' },
        { name: 'last_active_at', type: 'TIMESTAMPTZ DEFAULT NOW()', desc: 'Last time this device pinged the API' },
        { name: 'created_at', type: 'TIMESTAMPTZ DEFAULT NOW()', desc: 'Device enrollment timestamp' }
      ]
    },
    {
      name: 'user_redemptions',
      category: 'Commerce & Vouchers',
      desc: 'Cryptographically verified point-of-sale deal redemptions and QR checkouts',
      columns: [
        { name: 'id', type: 'UUID PRIMARY KEY', desc: 'Unique redemption audit ID', isKey: true },
        { name: 'deal_id', type: 'UUID NOT NULL REFERENCES deals(id) ON DELETE RESTRICT', desc: 'Claimed deal offer', isFk: true },
        { name: 'user_id', type: 'UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE', desc: 'Consumer who redeemed the voucher', isFk: true },
        { name: 'business_id', type: 'UUID NOT NULL REFERENCES businesses(id)', desc: 'Merchant establishment', isFk: true },
        { name: 'qr_voucher_code', type: 'VARCHAR(64) UNIQUE NOT NULL', desc: 'Cryptographic single-use optical QR voucher hash', isIndexed: true },
        { name: 'discounted_price_cents', type: 'INTEGER NOT NULL', desc: 'Final price paid in integer cents' },
        { name: 'savings_cents', type: 'INTEGER NOT NULL', desc: 'Total discount amount saved by shopper' },
        { name: 'status', type: 'VARCHAR(32) DEFAULT \'verified\'', desc: 'pending | verified | canceled | refunded' },
        { name: 'pos_device_id', type: 'VARCHAR(128)', desc: 'Merchant scanning terminal / mobile camera scanner ID' },
        { name: 'redeemed_at', type: 'TIMESTAMPTZ DEFAULT NOW()', desc: 'Exact POS scan timestamp' }
      ]
    },
    {
      name: 'user_saved_deals',
      category: 'Preferences',
      desc: 'Consumer bookmarks and deal radar watchlists with expiry notification triggers',
      columns: [
        { name: 'id', type: 'UUID PRIMARY KEY', desc: 'Saved deal record ID', isKey: true },
        { name: 'user_id', type: 'UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE', desc: 'Owner consumer ID', isFk: true },
        { name: 'deal_id', type: 'UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE', desc: 'Bookmarked deal ID', isFk: true },
        { name: 'saved_at', type: 'TIMESTAMPTZ DEFAULT NOW()', desc: 'When the deal was bookmarked' },
        { name: 'reminder_sent', type: 'BOOLEAN DEFAULT FALSE', desc: 'True when 15-min expiry alert dispatched' }
      ]
    },
    {
      name: 'deals',
      category: 'Deals & Inventory',
      desc: 'Immutable flash deal fact records with spatial boundaries, inventory limits, and duration cutoffs',
      columns: [
        { name: 'id', type: 'UUID PRIMARY KEY', desc: 'Unique deal identifier', isKey: true },
        { name: 'business_id', type: 'UUID REFERENCES businesses(id)', desc: 'Owning merchant business entity', isFk: true },
        { name: 'branch_ids', type: 'UUID[]', desc: 'Array of participating branch storefronts' },
        { name: 'title', type: 'VARCHAR(255) NOT NULL', desc: 'Offer headline with emoji' },
        { name: 'description', type: 'TEXT', desc: 'Terms, included items & conditions' },
        { name: 'category_id', type: 'VARCHAR(64) NOT NULL', desc: 'Taxonomy classification (e.g. cafe_coffee)' },
        { name: 'discount_pct', type: 'INTEGER NOT NULL', desc: 'Discount percentage (5-90%)' },
        { name: 'original_price_cents', type: 'INTEGER NOT NULL', desc: 'Original price in integer cents (no floating point errors)' },
        { name: 'discounted_price_cents', type: 'INTEGER NOT NULL', desc: 'Discounted price in integer cents' },
        { name: 'radius_m', type: 'INTEGER NOT NULL', desc: 'Discrete step radius (50m to 5000m)' },
        { name: 'location', type: 'GEOGRAPHY(Point, 4326) NOT NULL', desc: 'PostGIS spatial coordinate with GiST index', isSpatial: true },
        { name: 'qr_code_seed', type: 'VARCHAR(64) UNIQUE NOT NULL', desc: 'Cryptographic POS voucher seed', isIndexed: true },
        { name: 'quantity_available', type: 'INTEGER', desc: 'Total inventory cap (NULL for unlimited)' },
        { name: 'quantity_claimed', type: 'INTEGER DEFAULT 0', desc: 'Count of claimed vouchers' },
        { name: 'status', type: 'VARCHAR(32) DEFAULT \'active\'', desc: 'active | expired | paused | flagged' },
        { name: 'publish_at', type: 'TIMESTAMPTZ NOT NULL', desc: 'Deal launch timestamp' },
        { name: 'expiry_at', type: 'TIMESTAMPTZ NOT NULL', desc: 'Hard expiration cutoff' },
        { name: 'created_at', type: 'TIMESTAMPTZ DEFAULT NOW()', desc: 'Creation timestamp' },
        { name: 'deleted_at', type: 'TIMESTAMPTZ NULL', desc: 'Soft delete timestamp' }
      ]
    },
    {
      name: 'deal_events',
      category: 'Telemetry',
      desc: 'Append-only event telemetry stream capturing complete consumer conversion funnel',
      columns: [
        { name: 'id', type: 'BIGSERIAL PRIMARY KEY', desc: 'Sequential event index', isKey: true },
        { name: 'deal_id', type: 'UUID REFERENCES deals(id)', desc: 'Associated deal', isFk: true },
        { name: 'event_type', type: 'VARCHAR(32)', desc: 'impression | dispatch | delivered | opened | viewed | qr_scanned | redeemed' },
        { name: 'consumer_id_anonymized', type: 'UUID', desc: 'GDPR-compliant anonymized user hash' },
        { name: 'distance_at_event_m', type: 'INTEGER', desc: 'Distance between consumer and merchant at interaction' },
        { name: 'created_at', type: 'TIMESTAMPTZ DEFAULT NOW()', desc: 'Timestamp of event' }
      ]
    },
    {
      name: 'deal_metrics',
      category: 'Analytics',
      desc: 'Materialized fast-read aggregation table for merchant & admin dashboards',
      columns: [
        { name: 'deal_id', type: 'UUID PRIMARY KEY REFERENCES deals(id)', desc: 'Associated deal', isKey: true, isFk: true },
        { name: 'dispatched_count', type: 'INTEGER DEFAULT 0', desc: 'Total candidate devices notified' },
        { name: 'delivered_count', type: 'INTEGER DEFAULT 0', desc: 'Confirmed receipt' },
        { name: 'views_count', type: 'INTEGER DEFAULT 0', desc: 'Deal detail screen opens' },
        { name: 'qr_scans_count', type: 'INTEGER DEFAULT 0', desc: 'Counter voucher scans' },
        { name: 'redemptions_count', type: 'INTEGER DEFAULT 0', desc: 'Successful checkouts' },
        { name: 'conversion_rate', type: 'NUMERIC(5,2)', desc: 'Computed (redemptions / dispatched) * 100' },
        { name: 'refreshed_at', type: 'TIMESTAMPTZ', desc: 'Last materialized refresh' }
      ]
    },
    {
      name: 'businesses',
      category: 'Merchants & Billing',
      desc: 'Registered business profiles with ABR validation and Stripe subscription linkage',
      columns: [
        { name: 'id', type: 'UUID PRIMARY KEY', desc: 'Unique merchant ID', isKey: true },
        { name: 'business_name', type: 'VARCHAR(255) NOT NULL', desc: 'Legal / trade entity name' },
        { name: 'abn', type: 'VARCHAR(20) NOT NULL', desc: 'Australian Business Number (11 digits)', isIndexed: true },
        { name: 'abn_status', type: 'VARCHAR(32)', desc: 'verified_abr | pending | manual_override' },
        { name: 'category_id', type: 'VARCHAR(64)', desc: 'Taxonomy category' },
        { name: 'stripe_customer_id', type: 'VARCHAR(128)', desc: 'Stripe Billing customer ID' },
        { name: 'stripe_subscription_id', type: 'VARCHAR(128)', desc: 'Active Stripe subscription ID' },
        { name: 'subscription_tier', type: 'VARCHAR(32)', desc: 'starter | growth | enterprise' },
        { name: 'trial_ends_at', type: 'TIMESTAMPTZ', desc: '14-day zero-risk trial cutoff' },
        { name: 'created_at', type: 'TIMESTAMPTZ DEFAULT NOW()', desc: 'Onboarding date' }
      ]
    },
    {
      name: 'branches',
      category: 'Locations',
      desc: 'Physical storefronts with PostGIS geographic coordinates (Enterprise multi-branch support)',
      columns: [
        { name: 'id', type: 'UUID PRIMARY KEY', desc: 'Branch ID', isKey: true },
        { name: 'business_id', type: 'UUID REFERENCES businesses(id)', desc: 'Parent business', isFk: true },
        { name: 'branch_name', type: 'VARCHAR(255)', desc: 'Location designation (e.g. CBD Flagship)' },
        { name: 'address', type: 'TEXT', desc: 'Physical street address' },
        { name: 'location', type: 'GEOGRAPHY(Point, 4326)', desc: 'GiST-indexed Point(lng, lat)', isSpatial: true },
        { name: 'is_active', type: 'BOOLEAN DEFAULT TRUE', desc: 'Operational status' }
      ]
    },
    {
      name: 'category_benchmarks',
      category: 'AI & Analytics',
      desc: 'Platform-wide category averages used by Claude AI recommendations (Phase 4)',
      columns: [
        { name: 'category_id', type: 'VARCHAR(64) PRIMARY KEY', desc: 'Category key', isKey: true },
        { name: 'avg_conversion_rate', type: 'NUMERIC(5,2)', desc: 'Platform baseline conversion %' },
        { name: 'best_radius_bucket', type: 'VARCHAR(64)', desc: 'Optimal performing radius range' },
        { name: 'best_discount_bucket', type: 'VARCHAR(64)', desc: 'Optimal discount margin bucket' },
        { name: 'peak_hour_window', type: 'VARCHAR(64)', desc: 'High conversion time block' }
      ]
    }
  ];

  // Full SQL DDL Generator
  const generateDdlSql = () => {
    return `-- ============================================================================
-- FORSA-T POSTGRESQL 16 + POSTGIS SPATIAL DATABASE SCHEMA
-- Target Region: AWS ap-southeast-2 (Sydney)
-- Compliance: Australian Privacy Principles (APP) & GDPR Right-to-be-Forgotten
-- ============================================================================

-- 1. Enable Required PostgreSQL Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ----------------------------------------------------------------------------
-- 2. USERS TABLE (Identity, Authentication, Spatial Coordinates & Push Tokens)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(32),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(32) NOT NULL DEFAULT 'consumer',
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    business_id UUID, -- REFERENCES businesses(id) added below
    current_location GEOGRAPHY(Point, 4326),
    preferred_radius_m INTEGER NOT NULL DEFAULT 3000,
    favourite_categories VARCHAR(64)[] DEFAULT ARRAY['cafe_coffee', 'restaurant_dining'],
    home_suburb VARCHAR(128) DEFAULT 'Adelaide CBD',
    fcm_push_token TEXT,
    push_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    biometrics_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    last_deal_notification_at TIMESTAMPTZ,
    last_location_updated_at TIMESTAMPTZ,
    account_status VARCHAR(32) NOT NULL DEFAULT 'active',
    email_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Spatial & Performance Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_location_gist ON users USING GIST (current_location);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_role_status ON users (role, account_status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_users_cooldown ON users (last_deal_notification_at);

-- ----------------------------------------------------------------------------
-- 3. USER_DEVICES TABLE (Multi-Device Mobile FCM/APNs Registration)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_token TEXT NOT NULL,
    platform VARCHAR(16) NOT NULL CHECK (platform IN ('ios', 'android')),
    device_model VARCHAR(128),
    app_version VARCHAR(32),
    is_push_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_user_devices_user_id ON user_devices (user_id);
CREATE INDEX IF NOT EXISTS idx_user_devices_token ON user_devices (device_token);

-- ----------------------------------------------------------------------------
-- 4. BUSINESSES TABLE (Merchants, ABN Verification & Stripe Subscriptions)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name VARCHAR(255) NOT NULL,
    abn VARCHAR(20) NOT NULL,
    abn_status VARCHAR(32) NOT NULL DEFAULT 'pending',
    category_id VARCHAR(64) NOT NULL,
    stripe_customer_id VARCHAR(128),
    stripe_subscription_id VARCHAR(128),
    subscription_tier VARCHAR(32) NOT NULL DEFAULT 'growth',
    trial_ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_businesses_abn ON businesses (abn);

-- Add Foreign Key from users.business_id -> businesses.id
ALTER TABLE users 
ADD CONSTRAINT fk_users_business 
FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE SET NULL;

-- ----------------------------------------------------------------------------
-- 5. BRANCHES TABLE (Physical Storefronts with PostGIS Spatial Coordinates)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    branch_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    location GEOGRAPHY(Point, 4326) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_branches_location_gist ON branches USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_branches_business_id ON branches (business_id);

-- ----------------------------------------------------------------------------
-- 6. DEALS TABLE (Flash Deals, Discrete Geofence Radius & Expiration)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    branch_ids UUID[] DEFAULT ARRAY[]::UUID[],
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id VARCHAR(64) NOT NULL,
    discount_pct INTEGER NOT NULL CHECK (discount_pct BETWEEN 5 AND 90),
    original_price_cents INTEGER NOT NULL,
    discounted_price_cents INTEGER NOT NULL,
    radius_m INTEGER NOT NULL CHECK (radius_m IN (50, 100, 250, 500, 1000, 1500, 2000, 3000, 5000)),
    location GEOGRAPHY(Point, 4326) NOT NULL,
    qr_code_seed VARCHAR(64) UNIQUE NOT NULL,
    quantity_available INTEGER,
    quantity_claimed INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    publish_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expiry_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_deals_location_gist ON deals USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_deals_status_expiry ON deals (status, expiry_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_deals_business_id ON deals (business_id);

-- ----------------------------------------------------------------------------
-- 7. USER_REDEMPTIONS TABLE (POS QR Code Scans & Claim Audit Log)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_redemptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id),
    qr_voucher_code VARCHAR(64) UNIQUE NOT NULL,
    discounted_price_cents INTEGER NOT NULL,
    savings_cents INTEGER NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'verified',
    pos_device_id VARCHAR(128),
    redeemed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_user_redemptions_deal ON user_redemptions (deal_id);
CREATE INDEX IF NOT EXISTS idx_user_redemptions_user ON user_redemptions (user_id);
CREATE INDEX IF NOT EXISTS idx_user_redemptions_voucher ON user_redemptions (qr_voucher_code);

-- ----------------------------------------------------------------------------
-- 8. USER_SAVED_DEALS TABLE (Consumer Radar Bookmarks)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_saved_deals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_user_deal_saved UNIQUE (user_id, deal_id)
);
CREATE INDEX IF NOT EXISTS idx_user_saved_deals_user ON user_saved_deals (user_id);

-- ----------------------------------------------------------------------------
-- 9. DEAL_METRICS TABLE (Materialized Analytics for Dashboard Speed)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS deal_metrics (
    deal_id UUID PRIMARY KEY REFERENCES deals(id) ON DELETE CASCADE,
    dispatched_count INTEGER NOT NULL DEFAULT 0,
    delivered_count INTEGER NOT NULL DEFAULT 0,
    views_count INTEGER NOT NULL DEFAULT 0,
    qr_scans_count INTEGER NOT NULL DEFAULT 0,
    redemptions_count INTEGER NOT NULL DEFAULT 0,
    conversion_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    refreshed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);`;
  };

  const handleCopyDdl = () => {
    navigator.clipboard.writeText(generateDdlSql());
    setCopiedDdl(true);
    setTimeout(() => setCopiedDdl(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      
      {/* Top Banner */}
      <div className="bg-white border-b border-slate-200 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                PostgreSQL 16 + PostGIS Spatial Engine
              </span>
              <span className="text-xs text-slate-500 font-mono">BOD Section 7, 8 &amp; 13</span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-slate-900 mt-1">
              Database Architecture &amp; User Schema
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
              AWS ap-southeast-2 (Sydney)
            </span>
            <span className="px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 font-semibold flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              GiST Spatial Indexes: ACTIVE
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 pb-2 mb-6 border-b border-slate-200 text-xs font-medium">
          {[
            { id: 'tables', label: 'Relational Schema & Tables', icon: Table },
            { id: 'er_diagram', label: 'User & System ER Diagram', icon: Layers },
            { id: 'ddl_generator', label: 'Export DDL SQL Script', icon: Code },
            { id: 'live_data', label: 'Live Data Inspector (Users & Deals)', icon: Eye },
            { id: 'sql_playground', label: 'PostGIS ST_DWithin Runner', icon: Terminal },
            { id: 'architecture', label: 'System Topology & Redis Streams', icon: Server },
            { id: 'roadmap', label: '28-Week Phase Roadmap (BOD 11)', icon: GitBranch }
          ].map(tab => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`db-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-xs'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: RELATIONAL SCHEMA TABLES */}
        {activeTab === 'tables' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Table Selector Sidebar */}
            <div className="lg:col-span-4 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  PostgreSQL Tables ({schemaTables.length})
                </h3>
                <span className="text-[10px] bg-amber-50 text-amber-900 font-semibold px-2 py-0.5 rounded-md border border-amber-200 font-mono">
                  users selected
                </span>
              </div>

              {schemaTables.map(tbl => (
                <div
                  key={tbl.name}
                  id={`btn-select-table-${tbl.name}`}
                  onClick={() => setSelectedTable(tbl.name)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedTable === tbl.name
                      ? 'bg-amber-50/80 border-amber-300 shadow-xs ring-1 ring-amber-300'
                      : 'bg-white border-slate-200 hover:bg-slate-50 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {tbl.name === 'users' ? (
                        <User className="w-4 h-4 text-amber-800" />
                      ) : tbl.name.startsWith('user_') ? (
                        <Smartphone className="w-4 h-4 text-sky-800" />
                      ) : (
                        <Table className="w-4 h-4 text-slate-400" />
                      )}
                      <span className="font-mono font-bold text-sm text-slate-900">{tbl.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{tbl.columns.length} cols</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[11px] text-slate-600 line-clamp-1">{tbl.desc}</p>
                    <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded shrink-0 font-mono ml-2">
                      {tbl.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Selected Table Columns Grid */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              {(() => {
                const currentTbl = schemaTables.find(t => t.name === selectedTable) || schemaTables[0];
                return (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Table className="w-5 h-5 text-amber-700" />
                          <h3 className="font-mono font-bold text-lg text-slate-900">
                            public.{currentTbl.name}
                          </h3>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md font-mono">
                            {currentTbl.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{currentTbl.desc}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {currentTbl.name === 'users' && (
                          <span className="text-[11px] font-mono px-2.5 py-1 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 font-bold flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                            Core Identity
                          </span>
                        )}
                        <span className="text-xs font-mono px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-sky-800 font-semibold">
                          PostGIS Enabled
                        </span>
                      </div>
                    </div>

                    {/* Table Special Badges for Users */}
                    {currentTbl.name === 'users' && (
                      <div className="mb-4 p-3.5 bg-sky-50/80 border border-sky-200 rounded-xl text-xs space-y-1.5">
                        <div className="font-bold text-sky-950 flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-sky-700" />
                          <span>Spatial &amp; Privacy Design Specifications for Users Table:</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                          <strong>1. PostGIS Spatial Column:</strong> <code className="bg-white px-1 py-0.5 rounded text-sky-900">current_location GEOGRAPHY(Point, 4326)</code> with GiST indexing resolves candidate shoppers in &lt;20ms.<br />
                          <strong>2. Push Cooldown SLA:</strong> <code className="bg-white px-1 py-0.5 rounded text-sky-900">last_deal_notification_at</code> enforces a 30-minute anti-spam guard.<br />
                          <strong>3. Right-to-be-Forgotten:</strong> <code className="bg-white px-1 py-0.5 rounded text-sky-900">deleted_at</code> guarantees instant compliance with Australian Privacy Principles (APP).
                        </p>
                      </div>
                    )}

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse font-mono">
                        <thead>
                          <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px]">
                            <th className="pb-2 px-2">Column Name</th>
                            <th className="pb-2 px-2">PostgreSQL Data Type</th>
                            <th className="pb-2 px-2">Constraints / Flags</th>
                            <th className="pb-2 px-2">Description &amp; Specification</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentTbl.columns.map((col: any, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                              <td className="py-2.5 px-2 font-bold text-amber-900 flex items-center gap-1.5">
                                {col.isKey && <Key className="w-3 h-3 text-amber-600" />}
                                {col.name}
                              </td>
                              <td className="py-2.5 px-2 text-sky-800 font-semibold">
                                {col.type}
                              </td>
                              <td className="py-2.5 px-2">
                                <div className="flex flex-wrap gap-1">
                                  {col.isKey && (
                                    <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-900 font-bold rounded">PK</span>
                                  )}
                                  {col.isFk && (
                                    <span className="text-[9px] px-1.5 py-0.5 bg-sky-100 text-sky-900 font-bold rounded">FK</span>
                                  )}
                                  {col.isSpatial && (
                                    <span className="text-[9px] px-1.5 py-0.5 bg-emerald-100 text-emerald-900 font-bold rounded">GIST SPATIAL</span>
                                  )}
                                  {col.isIndexed && (
                                    <span className="text-[9px] px-1.5 py-0.5 bg-purple-100 text-purple-900 font-bold rounded">INDEXED</span>
                                  )}
                                  {!col.isKey && !col.isFk && !col.isSpatial && !col.isIndexed && (
                                    <span className="text-[9px] text-slate-400 font-normal">-</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-2.5 px-2 text-slate-600 font-sans text-xs">
                                {col.desc}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        )}

        {/* TAB 2: VISUAL ER DIAGRAM */}
        {activeTab === 'er_diagram' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-heading font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-700" />
                  <span>Entity-Relationship Architecture (Centered on Users)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Visual map of foreign keys, spatial GiST links, and transactional redemptions
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 font-semibold">
                PostgreSQL Relational Foreign Keys
              </span>
            </div>

            {/* Visual ER Map */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              
              {/* Left Column: USERS & USER SUBSIDIARIES */}
              <div className="space-y-4">
                
                {/* Users Card (Highlighted) */}
                <div className="p-4 bg-amber-50/90 border-2 border-amber-400 rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-amber-900" />
                      <span className="font-mono font-bold text-sm text-amber-950">public.users</span>
                    </div>
                    <span className="text-[10px] bg-amber-200/80 text-amber-900 font-mono px-1.5 py-0.5 rounded font-bold">
                      CORE
                    </span>
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-amber-900 font-bold flex justify-between">
                      <span>🔑 id (UUID)</span>
                      <span className="text-[10px] text-amber-700">PRIMARY KEY</span>
                    </div>
                    <div className="text-slate-700">📧 email (VARCHAR UNIQUE)</div>
                    <div className="text-slate-700">👤 full_name (VARCHAR)</div>
                    <div className="text-slate-700">🛡️ role (VARCHAR)</div>
                    <div className="text-emerald-800 font-bold">📍 current_location (GEOGRAPHY)</div>
                    <div className="text-sky-800">📱 fcm_push_token (TEXT)</div>
                    <div className="text-slate-700">⏱️ preferred_radius_m (INT)</div>
                    <div className="text-slate-700">⏱️ last_deal_notification_at</div>
                    <div className="text-purple-800">🔗 business_id (UUID FK NULL)</div>
                  </div>
                </div>

                {/* User Devices Card */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-sky-700" />
                      <span className="font-mono font-bold text-xs text-slate-900">public.user_devices</span>
                    </div>
                    <span className="text-[9px] bg-sky-50 text-sky-800 font-mono px-1.5 py-0.5 rounded font-bold">
                      1 : N
                    </span>
                  </div>
                  <div className="space-y-1 font-mono text-xs text-slate-600">
                    <div>🔑 id (UUID PK)</div>
                    <div className="text-amber-900 font-bold">🔗 user_id (UUID FK)</div>
                    <div>📱 device_token (TEXT)</div>
                    <div>💻 platform ('ios' | 'android')</div>
                  </div>
                </div>

                {/* User Saved Deals */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-mono font-bold text-xs text-slate-900">public.user_saved_deals</span>
                    <span className="text-[9px] bg-purple-50 text-purple-800 font-mono px-1.5 py-0.5 rounded font-bold">
                      N : M
                    </span>
                  </div>
                  <div className="space-y-1 font-mono text-xs text-slate-600">
                    <div>🔑 id (UUID PK)</div>
                    <div className="text-amber-900 font-bold">🔗 user_id (UUID FK)</div>
                    <div className="text-rose-900 font-bold">🔗 deal_id (UUID FK)</div>
                  </div>
                </div>

              </div>

              {/* Center Column: TRANSACTIONS & REDEMPTIONS */}
              <div className="space-y-4">
                
                {/* User Redemptions Card */}
                <div className="p-4 bg-emerald-50/70 border-2 border-emerald-300 rounded-2xl shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                    <span className="font-mono font-bold text-sm text-emerald-950">public.user_redemptions</span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-mono px-1.5 py-0.5 rounded font-bold">
                      COMMERCE
                    </span>
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-emerald-950 font-bold">🔑 id (UUID PRIMARY KEY)</div>
                    <div className="text-amber-900 font-bold">🔗 user_id (UUID FK)</div>
                    <div className="text-rose-900 font-bold">🔗 deal_id (UUID FK)</div>
                    <div className="text-purple-900 font-bold">🔗 business_id (UUID FK)</div>
                    <div className="text-slate-800 font-semibold">🎟️ qr_voucher_code (UNIQUE)</div>
                    <div className="text-slate-700">💲 discounted_price_cents</div>
                    <div className="text-slate-700">💰 savings_cents</div>
                    <div className="text-emerald-800 font-bold">⏱️ redeemed_at (TIMESTAMPTZ)</div>
                  </div>
                </div>

                {/* Deal Events Telemetry */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-mono font-bold text-xs text-slate-900">public.deal_events</span>
                    <span className="text-[9px] bg-slate-100 text-slate-700 font-mono px-1.5 py-0.5 rounded font-bold">
                      STREAM
                    </span>
                  </div>
                  <div className="space-y-1 font-mono text-xs text-slate-600">
                    <div>🔑 id (BIGSERIAL PK)</div>
                    <div className="text-rose-900 font-bold">🔗 deal_id (UUID FK)</div>
                    <div>📊 event_type (VARCHAR)</div>
                    <div>🛡️ consumer_id_anonymized</div>
                    <div>📍 distance_at_event_m</div>
                  </div>
                </div>

              </div>

              {/* Right Column: BUSINESSES & DEALS */}
              <div className="space-y-4">
                
                {/* Businesses Card */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-mono font-bold text-sm text-slate-900">public.businesses</span>
                    <span className="text-[10px] bg-purple-50 text-purple-800 font-mono px-1.5 py-0.5 rounded font-bold">
                      MERCHANT
                    </span>
                  </div>
                  <div className="space-y-1 font-mono text-xs text-slate-700">
                    <div className="text-purple-900 font-bold">🔑 id (UUID PK)</div>
                    <div>🏬 business_name (VARCHAR)</div>
                    <div>🇦🇺 abn (VARCHAR NOT NULL)</div>
                    <div>💳 stripe_subscription_id</div>
                    <div>⭐ subscription_tier</div>
                  </div>
                </div>

                {/* Deals Card */}
                <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-rose-200">
                    <span className="font-mono font-bold text-sm text-rose-950">public.deals</span>
                    <span className="text-[10px] bg-rose-200 text-rose-900 font-mono px-1.5 py-0.5 rounded font-bold">
                      OFFERS
                    </span>
                  </div>
                  <div className="space-y-1 font-mono text-xs">
                    <div className="text-rose-950 font-bold">🔑 id (UUID PK)</div>
                    <div className="text-purple-900 font-bold">🔗 business_id (UUID FK)</div>
                    <div className="text-slate-800 font-semibold">🏷️ title (VARCHAR)</div>
                    <div className="text-emerald-800 font-bold">📍 location (GEOGRAPHY)</div>
                    <div className="text-slate-700">🎯 radius_m (INTEGER)</div>
                    <div className="text-slate-700">⏳ publish_at / expiry_at</div>
                  </div>
                </div>

                {/* Branches Card */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-mono font-bold text-xs text-slate-900">public.branches</span>
                    <span className="text-[9px] bg-slate-100 text-slate-700 font-mono px-1.5 py-0.5 rounded font-bold">
                      MULTI-STORE
                    </span>
                  </div>
                  <div className="space-y-1 font-mono text-xs text-slate-600">
                    <div>🔑 id (UUID PK)</div>
                    <div className="text-purple-900 font-bold">🔗 business_id (UUID FK)</div>
                    <div className="text-emerald-800 font-bold">📍 location (GEOGRAPHY)</div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 3: DDL SQL SCRIPT GENERATOR */}
        {activeTab === 'ddl_generator' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-heading font-bold text-slate-900 flex items-center gap-2">
                  <Code className="w-5 h-5 text-amber-700" />
                  <span>Production PostgreSQL 16 DDL Script</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Ready-to-deploy SQL migration for AWS RDS PostgreSQL with PostGIS extensions &amp; GiST spatial indexes
                </p>
              </div>

              <button
                id="btn-copy-ddl-sql"
                onClick={handleCopyDdl}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-all shrink-0"
              >
                {copiedDdl ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Full SQL Schema</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 p-5 font-mono text-xs overflow-x-auto max-h-[550px]">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800 mb-3 text-[11px]">
                <span>schema/migrations/001_initial_spatial_user_schema.sql</span>
                <span className="text-emerald-400">PostgreSQL 16.2 / PostGIS 3.4</span>
              </div>
              <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {generateDdlSql()}
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: LIVE DATA INSPECTOR */}
        {activeTab === 'live_data' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-heading font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-700" />
                  <span>Live Mock Database Records (public.users)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Inspecting active database entities loaded into memory ({allUsers?.length || 0} user records)
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 bg-amber-50 text-amber-900 rounded-lg border border-amber-200 font-semibold">
                Client &amp; Server Synchronized
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[11px] bg-slate-50">
                    <th className="py-2.5 px-3">User ID</th>
                    <th className="py-2.5 px-3">Full Name &amp; Email</th>
                    <th className="py-2.5 px-3">Role</th>
                    <th className="py-2.5 px-3">Spatial Coordinates (PostGIS)</th>
                    <th className="py-2.5 px-3">Radius</th>
                    <th className="py-2.5 px-3">Push Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allUsers && allUsers.map((u: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-amber-900">
                        {u.id}
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-sans font-bold text-slate-900">{u.fullName}</div>
                        <div className="text-slate-500 text-[11px]">{u.email}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'consumer'
                            ? 'bg-sky-50 text-sky-800 border border-sky-200'
                            : u.role.includes('admin')
                              ? 'bg-purple-50 text-purple-800 border border-purple-200'
                              : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        <div className="flex items-center gap-1 text-emerald-800 font-bold">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>POINT({u.currentLocation?.lng || 138.6007}, {u.currentLocation?.lat || -34.9285})</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans">{u.currentLocation?.suburb || 'Adelaide CBD'}</div>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-800">
                        {(u.preferredRadiusM / 1000).toFixed(1)} km
                      </td>
                      <td className="py-3 px-3">
                        {u.pushNotificationEnabled ? (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                            <CheckCircle className="w-3.5 h-3.5" /> Active Token
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Disabled</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: POSTGIS SQL PLAYGROUND */}
        {activeTab === 'sql_playground' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-heading font-bold text-slate-900">
                  Interactive PostGIS Spatial Query Runner
                </h3>
                <p className="text-xs text-slate-500">
                  Test sub-25ms spatial indexing on the <strong>users</strong> table, multi-device token fanout, and voucher verification
                </p>
              </div>

              <button
                id="btn-run-postgis-query"
                onClick={handleRunQuery}
                disabled={queryRunning}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <Play className={`w-4 h-4 ${queryRunning ? 'animate-spin' : ''}`} />
                {queryRunning ? 'Executing on AWS RDS...' : 'Execute Query (PostGIS 16)'}
              </button>
            </div>

            {/* Query Selector Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
              {sampleQueries.map((q, idx) => (
                <button
                  key={idx}
                  id={`btn-query-select-${idx}`}
                  onClick={() => setActiveQueryIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    activeQueryIndex === idx
                      ? 'bg-slate-900 text-white font-semibold shadow-xs'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {q.name}
                </button>
              ))}
            </div>

            {/* SQL Terminal Window */}
            <div className="bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 p-4 font-mono text-xs overflow-x-auto">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800 mb-3 text-[11px]">
                <span>postgres@rds-postgis-adelaide:5432 / forsat_production</span>
                <span>Latency: {queryExecutionTime} ms</span>
              </div>
              <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                {sampleQueries[activeQueryIndex].sql}
              </pre>
            </div>

            {/* Explain Output Box */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono space-y-1">
              <div className="text-sky-800 font-bold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                EXPLAIN ANALYZE OUTPUT (GiST Index Scan Verified):
              </div>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                {sampleQueries[activeQueryIndex].explain}
              </p>
            </div>

          </div>
        )}

        {/* TAB 6: SYSTEM TOPOLOGY & REDIS STREAMS */}
        {activeTab === 'architecture' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-heading font-bold text-slate-900">
                End-to-End Push Notification
              </h3>
              <p className="text-xs text-slate-500">
                Decoupled event pipeline from deal publish to FCM/APNs delivery (BOD Section 24 &amp; 25)
              </p>
            </div>

            {/* Pipeline Stage Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
              
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center font-bold font-mono">
                  1
                </div>
                <h4 className="font-bold text-slate-900">Merchant Publishes Deal</h4>
                <p className="text-slate-600 text-[11px]">
                  Business submits deal via Next.js web / React Native app with discrete radius (e.g. 500m).
                </p>
                <span className="text-[10px] text-amber-800 font-mono font-medium">Clock Starts (T = 0s)</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-sky-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 flex items-center justify-center font-bold font-mono">
                  2
                </div>
                <h4 className="font-bold text-slate-900">PostGIS Spatial Resolution</h4>
                <p className="text-slate-600 text-[11px]">
                  ST_DWithin spatial query executes on <strong>users.current_location</strong> in &lt;20ms. Matched candidate consumer IDs returned.
                </p>
                <span className="text-[10px] text-sky-800 font-mono font-medium">Elapsed: ~0.03s</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-purple-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 flex items-center justify-center font-bold font-mono">
                  3
                </div>
                <h4 className="font-bold text-slate-900">Redis Streams Ingestion</h4>
                <p className="text-slate-600 text-[11px]">
                  Stream workers batch consumer tokens, applying cooldown and multi-branch dedup rules.
                </p>
                <span className="text-[10px] text-purple-800 font-mono font-medium">Elapsed: ~0.15s</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-emerald-200 space-y-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold font-mono">
                  4
                </div>
                <h4 className="font-bold text-slate-900">FCM / APNs Dispatch</h4>
                <p className="text-slate-600 text-[11px]">
                  Background workers push chunks to Apple and Google push servers with deep-link payload.
                </p>
                <span className="text-[10px] text-emerald-800 font-mono font-bold">Total SLA: &lt; 4.8s (&lt;60s limit)</span>
              </div>

            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <h4 className="font-bold text-slate-900">Why Push Notifications Beat Open WebSockets at Scale</h4>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                As addressed in BOD Section 24, mobile operating systems suspend background WebSockets to conserve battery. 
                Relying on FCM &amp; APNs eliminates persistent server socket holding, allowing Forsa-T to effortlessly scale to 50,000+ devices on lean AWS infrastructure without sticky load-balancer lock-in.
              </p>
            </div>
          </div>
        )}

        {/* TAB 7: ROADMAP */}
        {activeTab === 'roadmap' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-heading font-bold text-slate-900">
                  28-Week Phase-Gated Delivery Roadmap
                </h3>
                <p className="text-xs text-slate-500">
                  AeliaSoft Fixed-Price Implementation Plan ($26,000 all-in with AI-Assisted Effort Compression)
                </p>
              </div>
              <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-mono font-semibold">
                Total AI Hours: 713 (44.3% Saved)
              </span>
            </div>

            <div className="space-y-4">
              {[
                {
                  phase: 'PHASE 1',
                  title: 'Website, Web App & Commercial Foundation',
                  weeks: '6 Weeks (Week 1–6)',
                  hours: '235 hrs (53.6% saved)',
                  milestone: 'Staging live by Week 2; commercially live & Stripe billing ready by Week 6',
                  status: 'Delivered / Live in Pilot'
                },
                {
                  phase: 'PHASE 2',
                  title: 'Real-Time Location Engine & Event Streaming',
                  weeks: '8 Weeks (Week 7–14)',
                  hours: '228 hrs (37.0% saved)',
                  milestone: '500-user baseline & 5,000-user k6 load test report with sub-60s SLA proof',
                  status: 'Load Tested & Validated'
                },
                {
                  phase: 'PHASE 3',
                  title: 'React Native Mobile Applications (iOS & Android)',
                  weeks: '10 Weeks (Week 15–24)',
                  hours: '156 hrs (42.6% saved)',
                  milestone: 'TestFlight beta, camera/QR scanner, background location, App Store submission',
                  status: 'Store Ready & Compliant'
                },
                {
                  phase: 'PHASE 4',
                  title: 'Claude AI Deal Performance Suggestions Engine',
                  weeks: '4 Weeks (Week 25–28)',
                  hours: '94 hrs (32.9% saved)',
                  milestone: 'Post-deal analytics reporting, numeric cross-check validation, branded email delivery',
                  status: 'AI Insights Operational'
                }
              ].map((p, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-amber-800">{p.phase}:</span>
                      <span className="font-bold text-sm text-slate-900">{p.title}</span>
                    </div>
                    <p className="text-xs text-slate-600">{p.milestone}</p>
                  </div>

                  <div className="text-right shrink-0 text-xs font-mono">
                    <div className="text-slate-800 font-bold">{p.weeks}</div>
                    <div className="text-emerald-700 font-semibold text-[11px]">{p.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
