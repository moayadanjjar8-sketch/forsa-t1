import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserRole } from '../../types';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  ShieldCheck, 
  ShieldAlert, 
  Edit3, 
  UserCheck, 
  UserX, 
  Download, 
  Trash2, 
  LogIn, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Building2,
  Sparkles
} from 'lucide-react';
import { EditUserModal } from './EditUserModal';
import { CreateUserModal } from './CreateUserModal';

export const UserManagementTab: React.FC = () => {
  const { 
    allUsers, 
    currentUser, 
    updateUser, 
    createUser, 
    toggleUserStatus, 
    deleteAccount, 
    exportUserData, 
    setCurrentUser,
    setMobileRole,
    setViewMode,
    businesses
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<string>('all');
  
  // Modals state
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [exportModalUser, setExportModalUser] = useState<{ user: UserProfile; jsonString: string } | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Metrics computation
  const metrics = useMemo(() => {
    const total = allUsers.length;
    const consumers = allUsers.filter(u => u.role === 'consumer').length;
    const businessOwners = allUsers.filter(u => u.role.startsWith('business')).length;
    const admins = allUsers.filter(u => u.role.includes('admin')).length;
    const suspended = allUsers.filter(u => u.status === 'suspended').length;
    const verified = allUsers.filter(u => u.verified).length;

    return { total, consumers, businessOwners, admins, suspended, verified };
  }, [allUsers]);

  // Filtered list
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      const matchesSearch = 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.phone && user.phone.includes(searchQuery)) ||
        (user.currentLocation?.suburb || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = 
        roleFilter === 'all' ? true :
        roleFilter === 'consumer' ? user.role === 'consumer' :
        roleFilter === 'business' ? user.role.startsWith('business') :
        roleFilter === 'admin' ? user.role.includes('admin') :
        user.role === roleFilter;

      const matchesStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'active' ? (user.status !== 'suspended') :
        user.status === 'suspended';

      const matchesVerification = 
        verificationFilter === 'all' ? true :
        verificationFilter === 'verified' ? user.verified :
        !user.verified;

      return matchesSearch && matchesRole && matchesStatus && matchesVerification;
    });
  }, [allUsers, searchQuery, roleFilter, statusFilter, verificationFilter]);

  const handleExportData = (user: UserProfile) => {
    const jsonStr = exportUserData(user.id);
    setExportModalUser({ user, jsonString: jsonStr });
  };

  const handleImpersonate = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.role.includes('admin')) {
      setViewMode('admin');
    } else if (user.role.startsWith('business')) {
      setMobileRole('business');
      setViewMode('mobile');
    } else {
      setMobileRole('consumer');
      setViewMode('mobile');
    }
  };

  const handleDeleteUser = (userId: string) => {
    deleteAccount(userId);
    setDeletingUserId(null);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-900 border border-purple-200">Super Admin</span>;
      case 'admin':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-900 border border-indigo-200">Platform Admin</span>;
      case 'business_enterprise':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">Enterprise Owner</span>;
      case 'business_growth':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">Growth Owner</span>;
      case 'business_starter':
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-50 text-orange-800 border border-orange-200">Starter Owner</span>;
      case 'consumer':
      default:
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Consumer Shopper</span>;
    }
  };

  return (
    <div id="admin-user-management-tab" className="space-y-6">
      
      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Total Users</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{metrics.total}</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Registered profiles</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Consumers</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{metrics.consumers}</span>
            <span className="text-xs font-bold text-emerald-600 font-mono">
              {Math.round((metrics.consumers / Math.max(1, metrics.total)) * 100)}%
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Shoppers in radius</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Business Owners</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-amber-900 font-mono">{metrics.businessOwners}</span>
            <Building2 className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Active businesses</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Admins &amp; Ops</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-purple-900 font-mono">{metrics.admins}</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Super/Staff admins</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Verified ID</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-extrabold text-emerald-800 font-mono">{metrics.verified}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-[10px] text-emerald-700 font-mono mt-1 block">OTP/ABN verified</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">Suspended</span>
          <div className="flex items-baseline justify-between mt-1">
            <span className={`text-2xl font-extrabold font-mono ${metrics.suspended > 0 ? 'text-rose-700' : 'text-slate-400'}`}>
              {metrics.suspended}
            </span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Banned/Flagged</span>
        </div>

      </div>

      {/* Control Bar: Search, Filters, Add User Button */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        <div className="flex flex-1 flex-wrap items-center gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="admin-user-search-input"
              type="text"
              placeholder="Search by name, email, phone, location..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Role Filter */}
          <select
            id="admin-role-filter-select"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            <option value="all">All Roles ({allUsers.length})</option>
            <option value="consumer">Consumers</option>
            <option value="business">All Business Owners</option>
            <option value="business_starter">Starter Tier Owners</option>
            <option value="business_growth">Growth Tier Owners</option>
            <option value="business_enterprise">Enterprise Owners</option>
            <option value="admin">Platform &amp; Super Admins</option>
          </select>

          {/* Status Filter */}
          <select
            id="admin-status-filter-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Accounts</option>
            <option value="suspended">Suspended Accounts</option>
          </select>

          {/* Verification Filter */}
          <select
            id="admin-verify-filter-select"
            value={verificationFilter}
            onChange={e => setVerificationFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          >
            <option value="all">All Verification</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>

        </div>

        {/* Create User Button */}
        <button
          id="admin-open-create-user-btn"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision New User</span>
        </button>

      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px] uppercase tracking-wider text-start">
                <th className="py-3.5 px-4 font-bold">User Identity</th>
                <th className="py-3.5 px-4 font-bold">Role &amp; Tier</th>
                <th className="py-3.5 px-4 font-bold">Location &amp; Radius</th>
                <th className="py-3.5 px-4 font-bold">Status &amp; Verification</th>
                <th className="py-3.5 px-4 font-bold">Activity</th>
                <th className="py-3.5 px-4 font-bold text-end">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-bold text-slate-700">No users found matching query</p>
                    <p className="text-xs text-slate-500 mt-0.5">Try clearing filters or search terms</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const isCurrentActiveSession = currentUser.id === user.id;
                  const isSuspended = user.status === 'suspended';
                  const associatedBusiness = user.businessId 
                    ? businesses.find(b => b.id === user.businessId) 
                    : businesses.find(b => b.businessName.toLowerCase().includes(user.fullName.toLowerCase()));

                  return (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-slate-50/80 transition-colors ${isCurrentActiveSession ? 'bg-amber-50/30' : ''}`}
                    >
                      
                      {/* User Identity */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                              alt={user.fullName}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shadow-2xs"
                              referrerPolicy="no-referrer"
                            />
                            {user.verified && (
                              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-2xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                              </div>
                            )}
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900">{user.fullName}</span>
                              {isCurrentActiveSession && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500 text-slate-950">
                                  YOU
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block">{user.email}</span>
                            {user.phone && (
                              <span className="text-[10px] text-slate-400 font-mono">{user.phone}</span>
                            )}
                            {associatedBusiness && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-amber-900 font-medium bg-amber-50 px-1.5 py-0.5 rounded mt-0.5 border border-amber-200/50">
                                <Building2 className="w-2.5 h-2.5" />
                                {associatedBusiness.businessName}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role & Tier */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {getRoleBadge(user.role)}
                          <span className="text-[10px] text-slate-400 block font-mono">
                            Auth: {user.authProvider}
                          </span>
                        </div>
                      </td>

                      {/* Location & Radius */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1 text-slate-800 font-medium">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{user.currentLocation?.suburb || 'Adelaide CBD'}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono block">
                            Radar: {(user.preferredRadiusM / 1000).toFixed(1)} km ({user.preferredRadiusM}m)
                          </span>
                        </div>
                      </td>

                      {/* Status & Verification */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {isSuspended ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-200">
                              <ShieldAlert className="w-3 h-3" />
                              Suspended
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Active
                            </span>
                          )}

                          <span className="text-[10px] text-slate-400 block">
                            {user.verified ? 'Verified Identity' : 'Unverified Phone/Email'}
                          </span>
                        </div>
                      </td>

                      {/* Activity */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 font-mono text-[11px]">
                          <span className="text-slate-600 block">
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            Last: {user.lastActive ? new Date(user.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Active now'}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-end">
                        <div className="inline-flex items-center gap-1.5">
                          
                          {/* Impersonate / Switch */}
                          <button
                            title="Switch Persona / Impersonate User"
                            onClick={() => handleImpersonate(user)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-800 hover:bg-amber-100/60 transition-colors"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit User */}
                          <button
                            title="Edit Role & Details"
                            onClick={() => setEditingUser(user)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Suspend / Reactivate */}
                          <button
                            title={isSuspended ? 'Reactivate Account' : 'Suspend Account'}
                            onClick={() => toggleUserStatus(user.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isSuspended 
                                ? 'text-emerald-600 hover:bg-emerald-50' 
                                : 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                            }`}
                          >
                            {isSuspended ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                          </button>

                          {/* Export GDPR */}
                          <button
                            title="Export GDPR User Data"
                            onClick={() => handleExportData(user)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            title="Delete User"
                            onClick={() => setDeletingUserId(user.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          isOpen={true}
          onClose={() => setEditingUser(null)}
          onSave={updateUser}
        />
      )}

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createUser}
      />

      {/* Export GDPR Modal */}
      {exportModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">GDPR User Package Export</h3>
                <p className="text-xs text-slate-500 font-mono">{exportModalUser.user.email} (ID: {exportModalUser.user.id})</p>
              </div>
              <button
                onClick={() => setExportModalUser(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
            </div>

            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-[11px] font-mono max-h-80 overflow-y-auto">
              {exportModalUser.jsonString}
            </pre>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  const blob = new Blob([exportModalUser.jsonString], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `user_export_${exportModalUser.user.id}.json`;
                  a.click();
                }}
                className="px-4 py-2 text-xs font-bold bg-amber-500 text-slate-950 rounded-xl hover:bg-amber-400"
              >
                Download JSON File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingUserId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 text-start">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-sm font-bold text-slate-900">Confirm User Account Deletion</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete user ID <strong className="font-mono">{deletingUserId}</strong>? This action will remove their active credentials and soft-delete personal data in compliance with GDPR policy.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingUserId(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-user-btn"
                onClick={() => handleDeleteUser(deletingUserId)}
                className="px-4 py-2 text-xs font-bold bg-rose-600 text-white hover:bg-rose-500 rounded-xl"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
