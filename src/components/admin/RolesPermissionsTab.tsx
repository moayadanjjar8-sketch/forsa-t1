import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Building2, 
  DollarSign, 
  FileText, 
  Sliders, 
  Lock, 
  Sparkles,
  Info,
  Search,
  Eye,
  AlertCircle
} from 'lucide-react';
import { UserRole } from '../../types';

interface RoleDefinition {
  id: UserRole;
  title: string;
  category: 'consumer' | 'merchant' | 'admin';
  badgeColor: string;
  description: string;
  maxRadius: string;
  dealQuota: string;
  branches: string;
  allowedCapabilities: string[];
  restrictedCapabilities: string[];
}

export const RolesPermissionsTab: React.FC = () => {
  const { allUsers, currentUser } = useApp();
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedRoleForDetail, setSelectedRoleForDetail] = useState<UserRole>('business_growth');
  const [searchQuery, setSearchQuery] = useState('');

  const rolesList: RoleDefinition[] = [
    {
      id: 'consumer',
      title: 'Consumer (Shopper)',
      category: 'consumer',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-200/80',
      description: 'Public app user who discovers nearby flash deals, receives geofence alerts, and redeems in-store QR offers.',
      maxRadius: '500m – 5km (Discovery Radar)',
      dealQuota: 'Unlimited Redemptions',
      branches: 'N/A',
      allowedCapabilities: [
        'Live Geofence Radar Discovery',
        'In-Store QR Code Deal Redemption',
        'Save Favorite Businesses & Categories',
        'Custom Notification Radius Settings',
        'Personal Profile & Account Export'
      ],
      restrictedCapabilities: [
        'Publishing Deals or Geofence Broadcasts',
        'Multi-Branch Management',
        'Access to Financial or Platform Analytics',
        'User or Deal Moderation'
      ]
    },
    {
      id: 'business_starter',
      title: 'Business Owner: Starter Tier',
      category: 'merchant',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
      description: 'Single-location local business looking to broadcast flash drops to nearby pedestrians within 2km.',
      maxRadius: '2,000 meters (2km)',
      dealQuota: '10 Flash Deals / month',
      branches: '1 Branch Location',
      allowedCapabilities: [
        'Publish Geofenced Flash Deals (up to 2km)',
        'Cashier In-Store QR Redemption Scanner',
        'Basic Store Profile & Business Hours',
        'Essential Redemption & Views Analytics'
      ],
      restrictedCapabilities: [
        'Multi-Branch Location Management',
        'AI Deal Copywriting Assistant',
        'Social Media Syndication',
        'Priority Notification Push Queue',
        'Platform Administration'
      ]
    },
    {
      id: 'business_growth',
      title: 'Business Owner: Growth Tier',
      category: 'merchant',
      badgeColor: 'bg-amber-50 text-amber-900 border-amber-200/80',
      description: 'Expanding local business with up to 3 locations, requiring AI-assisted deal generation and social distribution.',
      maxRadius: '5,000 meters (5km)',
      dealQuota: '35 Flash Deals / month',
      branches: 'Up to 3 Branches',
      allowedCapabilities: [
        'Publish Deals up to 5km Geofence Radius',
        'Manage Up to 3 Branch Locations',
        'AI Marketing & Deal Suggestion Co-pilot',
        'Social Media Multi-Platform Syndication',
        'Conversion Funnel & Peak Hour Analytics'
      ],
      restrictedCapabilities: [
        'Unlimited Multi-Branch Federation',
        'Custom Polygon Geofencing',
        'Dedicated Priority Push Queue',
        'Platform Administration'
      ]
    },
    {
      id: 'business_enterprise',
      title: 'Business Owner: Enterprise Tier',
      category: 'merchant',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200/80',
      description: 'Franchise and multi-outlet brand requiring unlimited branches, priority push dispatch, and custom geofences.',
      maxRadius: '20,000 meters (20km)',
      dealQuota: 'Unlimited Deals',
      branches: 'Unlimited Branches',
      allowedCapabilities: [
        'Unlimited Branches & Locations',
        'Custom Geofence Radius up to 20km',
        'Dedicated Priority Notification Delivery Queue',
        'Multi-Branch Audience Deduplication',
        'Multi-Staff Cashier Accounts & Custom Roles',
        'Export Detailed Accounting & Redemptions CSV'
      ],
      restrictedCapabilities: [
        'Platform-wide User Account Suspension',
        'Platform Multi-Currency & FX Matrix Control'
      ]
    },
    {
      id: 'admin',
      title: 'Operations & Regional Admin',
      category: 'admin',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200/80',
      description: 'Operations team member tasked with reviewing promotions, verifying ABN registrations, and monitoring user accounts.',
      maxRadius: 'Global Platform',
      dealQuota: 'Administrative Oversight',
      branches: 'All Businesses',
      allowedCapabilities: [
        'Inspect & Pause Non-Compliant Deals',
        'Approve & Override ABN Australian Registrations',
        'Review Flagged Business Profiles & Images',
        'Manage Suburb Geofence Radius Steps & Categories',
        'Inspect Deal Funnel & Conversion Metrics',
        'View Platform Audit Trail'
      ],
      restrictedCapabilities: [
        'Manage Multi-Currency FX Rates',
        'Edit Subscription Pricing & Billing Plans',
        'Delete User Accounts or Super Admin Roles'
      ]
    },
    {
      id: 'super_admin',
      title: 'Platform Super Admin',
      category: 'admin',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200/80',
      description: 'Full root access for platform owners to govern currencies, subscription pricing, user roles, security, and billing.',
      maxRadius: 'Global Platform Root',
      dealQuota: 'Full Unrestricted Access',
      branches: 'All Businesses & Hubs',
      allowedCapabilities: [
        'Complete Multi-Currency & FX Exchange Matrix Governance',
        'Create, Edit & Delete Subscription Billing Plans',
        'User Management: Provision, Assign Roles, Suspend & Delete',
        'One-Click Impersonation & Testing Simulator',
        'ABN Verification Override & Business Owner Tier Management',
        'Immutable GDPR & Security Audit Log Export',
        'No-Code Category Taxonomy & Radius Rule Enforcement'
      ],
      restrictedCapabilities: []
    }
  ];

  // Permissions Matrix Definition
  const permissionsMatrix = [
    {
      category: 'Geofenced Deals & Promotions',
      permissions: [
        { name: 'Discover nearby deals within radius', consumer: true, starter: true, growth: true, enterprise: true, admin: true, superAdmin: true },
        { name: 'Redeem deals in-store with QR code', consumer: true, starter: false, growth: false, enterprise: false, admin: false, superAdmin: true },
        { name: 'Publish deals (up to 2km radius)', consumer: false, starter: true, growth: true, enterprise: true, admin: false, superAdmin: true },
        { name: 'Publish deals (up to 5km radius + AI Co-Pilot)', consumer: false, starter: false, growth: true, enterprise: true, admin: false, superAdmin: true },
        { name: 'Publish deals (up to 20km + Priority Queue)', consumer: false, starter: false, growth: false, enterprise: true, admin: false, superAdmin: true },
        { name: 'Moderate & pause non-compliant deals', consumer: false, starter: false, growth: false, enterprise: false, admin: true, superAdmin: true },
      ]
    },
    {
      category: 'Business Owner & Multi-Branch Operations',
      permissions: [
        { name: 'Review & approve business profile & ABN docs before joining platform', consumer: false, starter: false, growth: false, enterprise: false, admin: true, superAdmin: true },
        { name: 'Manage single store profile & hours', consumer: false, starter: true, growth: true, enterprise: true, admin: true, superAdmin: true },
        { name: 'Manage multi-branch locations (up to 3)', consumer: false, starter: false, growth: true, enterprise: true, admin: true, superAdmin: true },
        { name: 'Unlimited branches with audience dedup', consumer: false, starter: false, growth: false, enterprise: true, admin: false, superAdmin: true },
        { name: 'Override ABN Australian verification status', consumer: false, starter: false, growth: false, enterprise: false, admin: true, superAdmin: true },
      ]
    },
    {
      category: 'Financials, Currencies & Plans',
      permissions: [
        { name: 'Manage business owner monthly subscription plan', consumer: false, starter: true, growth: true, enterprise: true, admin: true, superAdmin: true },
        { name: 'Manage multi-currency settlement & FX rates', consumer: false, starter: false, growth: false, enterprise: false, admin: false, superAdmin: true },
        { name: 'Create & modify platform subscription pricing', consumer: false, starter: false, growth: false, enterprise: false, admin: false, superAdmin: true },
        { name: 'Track UTM campaign ROI & marketing revenue', consumer: false, starter: false, growth: true, enterprise: true, admin: true, superAdmin: true },
      ]
    },
    {
      category: 'User Accounts & Security Governance',
      permissions: [
        { name: 'Export personal GDPR data bundle', consumer: true, starter: true, growth: true, enterprise: true, admin: true, superAdmin: true },
        { name: 'Assign user roles & modify account profiles', consumer: false, starter: false, growth: false, enterprise: false, admin: false, superAdmin: true },
        { name: 'Suspend or ban abusive user accounts', consumer: false, starter: false, growth: false, enterprise: false, admin: true, superAdmin: true },
        { name: 'Access immutable platform audit logs', consumer: false, starter: false, growth: false, enterprise: false, admin: true, superAdmin: true },
      ]
    }
  ];

  const filteredRoles = rolesList.filter(r => {
    const matchesFilter = selectedRoleFilter === 'all' ? true : r.category === selectedRoleFilter;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const selectedRole = rolesList.find(r => r.id === selectedRoleForDetail) || rolesList[2];

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                Access Control &amp; RBAC
              </span>
              <span className="text-xs text-slate-500 font-medium">Role-Based Security Matrix</span>
            </div>
            <h2 className="text-xl font-heading font-bold text-slate-900 mt-1">
              Roles &amp; Permission Governance
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Define operational privileges, business owner tier boundaries, geofence radius limits, and administrative authorization
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Your Active Role:</span>
            <span className="px-3 py-1.5 bg-rose-50 text-rose-800 rounded-xl text-xs font-bold border border-rose-200/80">
              Platform Super Admin
            </span>
          </div>
        </div>

        {/* Roles Quick Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 mt-6">
          {rolesList.map(r => {
            const count = allUsers.filter(u => u.role === r.id).length;
            const isSelected = selectedRoleForDetail === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRoleForDetail(r.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                    : 'bg-slate-50 text-slate-800 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <div className="text-[11px] font-medium opacity-80 truncate">{r.title.split(':')[0]}</div>
                <div className="text-lg font-bold font-mono mt-0.5">{count}</div>
                <div className="text-[10px] opacity-70 mt-1 truncate">Users Assigned</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Cards & Deep Dive Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Role Definitions List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                id="search-roles-input"
                type="text"
                placeholder="Search roles or privileges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              {[
                { id: 'all', label: 'All Roles' },
                { id: 'consumer', label: 'Consumer' },
                { id: 'merchant', label: 'Business Owners' },
                { id: 'admin', label: 'Platform Admins' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedRoleFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
                    selectedRoleFilter === f.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredRoles.map(role => {
              const isSelected = role.id === selectedRoleForDetail;
              const userCount = allUsers.filter(u => u.role === role.id).length;
              return (
                <div
                  key={role.id}
                  onClick={() => setSelectedRoleForDetail(role.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-sky-50/70 border-sky-300 shadow-xs' 
                      : 'bg-white border-slate-200 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900">{role.title}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${role.badgeColor}`}>
                          {role.category.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{role.description}</p>
                    </div>

                    <div className="text-right font-mono text-xs shrink-0">
                      <span className="font-bold text-slate-900">{userCount}</span>
                      <span className="text-[10px] text-slate-500 block">active users</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Max Broadcast:</span>
                      <span className="font-semibold text-slate-800">{role.maxRadius}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Deal Quota:</span>
                      <span className="font-semibold text-slate-800">{role.dealQuota}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Branch Capacity:</span>
                      <span className="font-semibold text-slate-800">{role.branches}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Col: Selected Role Privilege Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">
              Selected Role Inspector
            </span>
            <h3 className="text-base font-heading font-bold text-slate-900 mt-0.5">
              {selectedRole.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">{selectedRole.description}</p>
          </div>

          {/* Core Privileges */}
          <div className="space-y-3 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Granted Capabilities
              </h4>
              <div className="space-y-1.5">
                {selectedRole.allowedCapabilities.map((cap, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-emerald-50/50 rounded-lg border border-emerald-100 text-slate-800 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedRole.restrictedCapabilities.length > 0 && (
              <div>
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 mb-2 text-rose-800">
                  <XCircle className="w-4 h-4 text-rose-500" />
                  Restricted Capabilities
                </h4>
                <div className="space-y-1.5">
                  {selectedRole.restrictedCapabilities.map((cap, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200/80 text-slate-600">
                      <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              RBAC Enforcement Engine
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Privileges are strictly validated server-side on every geofence push dispatch, token refresh, and mutation request.
            </p>
          </div>
        </div>

      </div>

      {/* Comprehensive Permission Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-heading font-bold text-slate-900">
            Platform Permission &amp; Authorization Matrix
          </h3>
          <p className="text-xs text-slate-500">
            Side-by-side comparison of granular permissions across all customer, business owner, and administrator personas
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-mono uppercase text-[11px]">
                <th className="pb-3 px-3 min-w-[220px]">Capability &amp; Action</th>
                <th className="pb-3 px-2 text-center">Shopper</th>
                <th className="pb-3 px-2 text-center">Starter</th>
                <th className="pb-3 px-2 text-center">Growth</th>
                <th className="pb-3 px-2 text-center">Enterprise</th>
                <th className="pb-3 px-2 text-center">Admin</th>
                <th className="pb-3 px-2 text-center">Super Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((section, sIdx) => (
                <React.Fragment key={sIdx}>
                  <tr className="bg-slate-50/80">
                    <td colSpan={7} className="py-2.5 px-3 font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
                      {section.category}
                    </td>
                  </tr>
                  {section.permissions.map((perm, pIdx) => (
                    <tr key={pIdx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {perm.name}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {perm.consumer ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {perm.starter ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {perm.growth ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {perm.enterprise ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {perm.admin ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        {perm.superAdmin ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
