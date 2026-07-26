"use client";

import React, { useState, useEffect, useMemo } from 'react';

interface SubscriptionPlan {
  id: number;
  name: string;
  price: number;
  currency?: string;
  billingPeriod?: string;
}

interface User {
  id: number;
  name: string | null;
  email: string;
  role: string;
  subscriptionId: number | null;
  subscriptionStatus: string;
  createdAt: string;
  subscription?: SubscriptionPlan;
}

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'ADMIN' | 'STUDENT'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'FREE' | 'PAST_DUE'>('ALL');

  // Sorting
  const [sortField, setSortField] = useState<'id' | 'name' | 'email' | 'role' | 'createdAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);

  // Modals & Drawers
  const [showModal, setShowModal] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    role: 'STUDENT',
    password: '',
    subscriptionId: '',
    subscriptionStatus: 'INACTIVE'
  });
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
    fetchPlans();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/backend/api/admin/users');
      if (res.ok) {
        const data: User[] = await res.json();
        setUsers(data);
      }
    } catch (e) {
      console.error("Error fetching users:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await fetch('/backend/api/admin/subscriptions');
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      }
    } catch (e) {
      console.error("Error fetching subscription plans:", e);
    }
  };

  const notify = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 5000);
  };

  // KPI Metrics Calculations
  const kpiStats = useMemo(() => {
    const total = users.length;
    const activeSubs = users.filter(u => u.subscriptionStatus === 'ACTIVE' && u.subscriptionId).length;
    const admins = users.filter(u => u.role === 'ADMIN').length;
    const freeOrInactive = users.filter(u => !u.subscriptionId || u.subscriptionStatus !== 'ACTIVE').length;
    return { total, activeSubs, admins, freeOrInactive };
  }, [users]);

  // Filtered & Sorted Users
  const filteredUsers = useMemo(() => {
    return users
      .filter(u => {
        if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
        if (statusFilter === 'ACTIVE' && u.subscriptionStatus !== 'ACTIVE') return false;
        if (statusFilter === 'FREE' && (u.subscriptionId || u.subscriptionStatus === 'ACTIVE')) return false;
        if (statusFilter === 'PAST_DUE' && u.subscriptionStatus !== 'PAST_DUE') return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const matchName = u.name?.toLowerCase().includes(q);
          const matchEmail = u.email.toLowerCase().includes(q);
          const matchPlan = u.subscription?.name?.toLowerCase().includes(q);
          if (!matchName && !matchEmail && !matchPlan) return false;
        }
        return true;
      })
      .sort((a, b) => {
        let valA = a[sortField] || '';
        let valB = b[sortField] || '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [users, roleFilter, statusFilter, searchQuery, sortField, sortDirection]);

  // Pagination Slice
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;

  const toggleSort = (field: 'id' | 'name' | 'email' | 'role' | 'createdAt') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Bulk Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = paginatedUsers.map(u => u.id);
      setSelectedIds(Array.from(new Set([...selectedIds, ...allIds])));
    } else {
      const visibleIds = new Set(paginatedUsers.map(u => u.id));
      setSelectedIds(selectedIds.filter(id => !visibleIds.has(id)));
    }
  };

  const handleSelectRow = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Bulk Action Requests
  const handleBulkRoleChange = async (targetRole: string) => {
    if (!confirm(`Are you sure you want to change role to ${targetRole} for ${selectedIds.length} selected accounts?`)) return;
    setBulkProcessing(true);
    try {
      const res = await fetch('/backend/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, role: targetRole })
      });
      if (res.ok) {
        notify(`✅ Successfully updated role to ${targetRole} for ${selectedIds.length} users.`);
        setSelectedIds([]);
        fetchUsers();
      } else {
        alert("Failed to perform bulk role update.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`⚠️ WARNING: Are you sure you want to permanently delete ${selectedIds.length} selected user accounts? This action cannot be undone!`)) return;
    setBulkProcessing(true);
    try {
      const res = await fetch(`/backend/api/admin/users?ids=${selectedIds.join(',')}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        notify(`🗑️ Deleted ${selectedIds.length} accounts from system database.`);
        setSelectedIds([]);
        fetchUsers();
      } else {
        alert("Failed to delete selected users.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setBulkProcessing(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/backend/api/admin/users';
      const method = isEditing ? 'PUT' : 'POST';
      
      const payload: any = { ...formData };
      if (!payload.password && isEditing) {
        delete payload.password;
      }
      if (!isEditing && !payload.password) {
        payload.password = "Deutsch2026!";
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setShowModal(false);
        notify(isEditing ? `✅ User account (#${formData.id}) updated successfully.` : `✅ New student account (${formData.email}) registered.`);
        fetchUsers();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || 'Failed to save user account.'}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this user account?")) return;
    try {
      const res = await fetch(`/backend/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSelectedIds(selectedIds.filter(item => item !== id));
        notify(`🗑️ User #${id} successfully removed.`);
        fetchUsers();
      } else {
        alert("Failed to delete user.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const generatePassword = () => {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newPass = `DeLern#${randomStr}!26`;
    setFormData({ ...formData, password: newPass });
    setPasswordFeedback(`Generated: ${newPass} (Copied!)`);
    navigator.clipboard?.writeText(newPass).catch(() => {});
    setTimeout(() => setPasswordFeedback(''), 5000);
  };

  const handleQuickPasswordReset = async (userId: number) => {
    const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
    const tempPass = `Reset#${randomStr}!99`;
    if (!confirm(`Reset this user's password to temporary password: "${tempPass}"?`)) return;

    try {
      const res = await fetch('/backend/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, newPassword: tempPass })
      });
      if (res.ok) {
        alert(`Password successfully reset to: ${tempPass}\n\nThe new temporary password has been copied to your clipboard.`);
        navigator.clipboard?.writeText(tempPass).catch(() => {});
        setViewingUser(null);
        notify(`🔑 Temporary reset password generated and copied for User #${userId}.`);
      } else {
        alert("Failed to reset password.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openAddModal = () => {
    setFormData({ id: '', name: '', email: '', role: 'STUDENT', password: '', subscriptionId: '', subscriptionStatus: 'INACTIVE' });
    setPasswordFeedback('');
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setFormData({ 
      id: user.id.toString(), 
      name: user.name || '', 
      email: user.email, 
      role: user.role, 
      password: '',
      subscriptionId: user.subscriptionId ? user.subscriptionId.toString() : '', 
      subscriptionStatus: user.subscriptionStatus 
    });
    setPasswordFeedback('');
    setIsEditing(true);
    setShowModal(true);
  };

  const exportToCSV = () => {
    if (filteredUsers.length === 0) {
      alert("No data available to export with current filters!");
      return;
    }

    const headers = ["ID", "Full Name", "Email Address", "Role", "Subscription Plan", "Status", "Joined Date"];
    const rows = filteredUsers.map(u => [
      u.id,
      `"${(u.name || '').replace(/"/g, '""')}"`,
      `"${u.email.replace(/"/g, '""')}"`,
      u.role,
      `"${(u.subscription?.name || 'Free Tier').replace(/"/g, '""')}"`,
      u.subscriptionStatus,
      new Date(u.createdAt).toISOString().split('T')[0]
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `amardeutsch_users_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify("📧 exported filtered user directory to CSV format.");
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return "Recent";
    }
  };

  const allVisibleSelected = paginatedUsers.length > 0 && paginatedUsers.every(u => selectedIds.includes(u.id));

  return (
    <div className="user-management-studio pb-5 font-sans">
      
      {/* ===== ALERT FEEDBACK TOAST ===== */}
      {actionNotice && (
        <div className="alert alert-success bg-white border border-success border-2 shadow-sm rounded-3 d-flex align-items-center justify-content-between mb-4 py-3 px-4 animate-fade-in">
          <div className="d-flex align-items-center gap-2 fw-bold text-success">
            <i className="bi bi-shield-check fs-4"></i>
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="btn-close btn-close-sm"></button>
        </div>
      )}

      {/* ===== EXECUTIVE KPI SUMMARY CARDS ===== */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <div className="info-box bg-white shadow-sm border-start border-4 border-primary rounded-4 p-3 h-100 mb-0 transition-all hover-shadow">
            <span className="info-box-icon text-primary bg-primary bg-opacity-10 rounded-3 m-2 fs-3 d-flex align-items-center justify-content-center" style={{ width: "54px", height: "54px" }}>
              <i className="bi bi-people-fill"></i>
            </span>
            <div className="info-box-content justify-content-center pe-2">
              <span className="info-box-text text-muted text-uppercase fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Platform Users</span>
              <span className="info-box-number fs-3 fw-black text-dark mb-0">{kpiStats.total}</span>
              <span className="text-muted" style={{ fontSize: "12px" }}>Registered learner base</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="info-box bg-white shadow-sm border-start border-4 border-success rounded-4 p-3 h-100 mb-0 transition-all hover-shadow">
            <span className="info-box-icon text-success bg-success bg-opacity-10 rounded-3 m-2 fs-3 d-flex align-items-center justify-content-center" style={{ width: "54px", height: "54px" }}>
              <i className="bi bi-patch-check-fill"></i>
            </span>
            <div className="info-box-content justify-content-center pe-2">
              <span className="info-box-text text-muted text-uppercase fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Active Subscribers</span>
              <span className="info-box-number fs-3 fw-black text-success mb-0">{kpiStats.activeSubs}</span>
              <span className="text-muted" style={{ fontSize: "12px" }}>Paid premium contracts</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="info-box bg-white shadow-sm border-start border-4 border-danger rounded-4 p-3 h-100 mb-0 transition-all hover-shadow">
            <span className="info-box-icon text-danger bg-danger bg-opacity-10 rounded-3 m-2 fs-3 d-flex align-items-center justify-content-center" style={{ width: "54px", height: "54px" }}>
              <i className="bi bi-shield-lock-fill"></i>
            </span>
            <div className="info-box-content justify-content-center pe-2">
              <span className="info-box-text text-muted text-uppercase fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Administrators</span>
              <span className="info-box-number fs-3 fw-black text-danger mb-0">{kpiStats.admins}</span>
              <span className="text-muted" style={{ fontSize: "12px" }}>System supervisors</span>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <div className="info-box bg-white shadow-sm border-start border-4 border-warning rounded-4 p-3 h-100 mb-0 transition-all hover-shadow">
            <span className="info-box-icon text-warning bg-warning bg-opacity-10 rounded-3 m-2 fs-3 d-flex align-items-center justify-content-center" style={{ width: "54px", height: "54px" }}>
              <i className="bi bi-person-badge-fill"></i>
            </span>
            <div className="info-box-content justify-content-center pe-2">
              <span className="info-box-text text-muted text-uppercase fw-bold" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>Free Students</span>
              <span className="info-box-number fs-3 fw-black text-dark mb-0">{kpiStats.freeOrInactive}</span>
              <span className="text-muted" style={{ fontSize: "12px" }}>Standard trial learners</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN USER DATABASE MANAGEMENT CARD ===== */}
      <div className="card card-outline card-primary shadow-sm border-0 rounded-4 overflow-hidden mb-4">
        
        {/* Modern Header Ribbon */}
        <div className="card-header bg-white py-4 px-4 d-flex flex-wrap justify-content-between align-items-center gap-3 border-bottom border-light">
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary fs-5">
                <i className="bi bi-person-vcard-fill"></i>
              </span>
              <h4 className="card-title mb-0 fw-black text-dark tracking-tight">User Directory & Security Suite</h4>
            </div>
            <p className="text-muted small mb-0 mt-1">
              Supervise student accounts, assign CEFR subscriptions, reset credentials, or perform multi-select batch operations.
            </p>
          </div>

          <div className="d-flex gap-2.5 align-items-center ms-auto">
            <button 
              className="btn btn-outline-secondary btn-sm fw-bold d-flex align-items-center gap-1.5 px-3.5 py-2.5 rounded-3 bg-white shadow-2xs hover-light" 
              onClick={exportToCSV} 
              title="Export filtered directory to CSV"
            >
              <i className="bi bi-download text-primary"></i>
              <span>Export CSV</span>
            </button>
            <button 
              className="btn btn-primary btn-sm fw-black d-flex align-items-center gap-2 px-4 py-2.5 rounded-3 shadow-sm hover-primary-dark" 
              onClick={openAddModal}
            >
              <i className="bi bi-person-plus-fill fs-6"></i>
              <span>Add Student Account</span>
            </button>
          </div>
        </div>
        
        <div className="card-body p-4">
          
          {/* SLEEK EXECUTIVE CONTROL BAR */}
          <div className="p-3 bg-light rounded-4 mb-4 border border-secondary-subtle d-flex flex-column flex-xl-row justify-content-between align-items-xl-center gap-3">
            
            {/* Filter Pills */}
            <div className="d-flex flex-wrap gap-2 align-items-center">
              <span className="text-muted small fw-black text-uppercase tracking-wider me-1">
                <i className="bi bi-funnel-fill text-primary me-1"></i>Filter Directory:
              </span>
              
              <div className="btn-group btn-group-sm shadow-2xs rounded-3 overflow-hidden" role="group">
                <button 
                  type="button" 
                  className={`btn px-3 py-1.5 fw-bold ${roleFilter === 'ALL' ? 'btn-primary' : 'btn-white bg-white text-secondary border'}`} 
                  onClick={() => { setRoleFilter('ALL'); setCurrentPage(1); }}
                >
                  All Roles
                </button>
                <button 
                  type="button" 
                  className={`btn px-3 py-1.5 fw-bold ${roleFilter === 'ADMIN' ? 'btn-danger text-white' : 'btn-white bg-white text-secondary border'}`} 
                  onClick={() => { setRoleFilter('ADMIN'); setCurrentPage(1); }}
                >
                  Admins Only
                </button>
                <button 
                  type="button" 
                  className={`btn px-3 py-1.5 fw-bold ${roleFilter === 'STUDENT' ? 'btn-info text-white' : 'btn-white bg-white text-secondary border'}`} 
                  onClick={() => { setRoleFilter('STUDENT'); setCurrentPage(1); }}
                >
                  Students Only
                </button>
              </div>

              <div className="btn-group btn-group-sm shadow-2xs rounded-3 overflow-hidden ms-sm-2" role="group">
                <button 
                  type="button" 
                  className={`btn px-3 py-1.5 fw-bold ${statusFilter === 'ALL' ? 'btn-dark' : 'btn-white bg-white text-secondary border'}`} 
                  onClick={() => { setStatusFilter('ALL'); setCurrentPage(1); }}
                >
                  All Plans
                </button>
                <button 
                  type="button" 
                  className={`btn px-3 py-1.5 fw-bold ${statusFilter === 'ACTIVE' ? 'btn-success' : 'btn-white bg-white text-secondary border'}`} 
                  onClick={() => { setStatusFilter('ACTIVE'); setCurrentPage(1); }}
                >
                  Active Paid
                </button>
                <button 
                  type="button" 
                  className={`btn px-3 py-1.5 fw-bold ${statusFilter === 'FREE' ? 'btn-warning text-dark' : 'btn-white bg-white text-secondary border'}`} 
                  onClick={() => { setStatusFilter('FREE'); setCurrentPage(1); }}
                >
                  Free Tier
                </button>
              </div>
            </div>

            {/* Instant Realtime Search Box */}
            <div className="input-group shadow-2xs rounded-3 overflow-hidden" style={{ maxWidth: "380px" }}>
              <span className="input-group-text bg-white border-end-0 text-secondary pe-2">
                <i className="bi bi-search"></i>
              </span>
              <input 
                type="text" 
                className="form-control border-start-0 ps-1 py-2 text-sm fw-medium"
                placeholder="Search name, email, or plan package..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
              {searchQuery && (
                <button className="btn btn-white bg-white text-muted border-start-0 border px-3" onClick={() => setSearchQuery("")} title="Clear search">
                  <i className="bi bi-x-circle-fill text-secondary"></i>
                </button>
              )}
            </div>
          </div>

          {/* FLOATING BATCH ACTION BANNER */}
          {selectedIds.length > 0 && (
            <div className="p-3 bg-primary bg-opacity-10 border border-primary border-2 rounded-4 mb-4 d-flex flex-wrap align-items-center justify-content-between gap-3 shadow-sm animate-fade-in">
              <div className="d-flex align-items-center gap-3">
                <span className="badge bg-primary text-white px-3.5 py-2 rounded-pill fs-6 fw-bold shadow-sm">
                  {selectedIds.length} Checked
                </span>
                <span className="fw-bold text-primary dark:text-primary-light">
                  Batch administrative actions ready to execute on marked rows:
                </span>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button 
                  className="btn btn-sm btn-light fw-bold px-3 py-2 border shadow-2xs d-flex align-items-center gap-1.5 text-danger" 
                  onClick={() => handleBulkRoleChange('ADMIN')} 
                  disabled={bulkProcessing}
                >
                  <i className="bi bi-shield-lock-fill"></i> Elevate to Admin
                </button>
                <button 
                  className="btn btn-sm btn-light fw-bold px-3 py-2 border shadow-2xs d-flex align-items-center gap-1.5 text-dark" 
                  onClick={() => handleBulkRoleChange('STUDENT')} 
                  disabled={bulkProcessing}
                >
                  <i className="bi bi-person-check-fill"></i> Set as Student
                </button>
                <button 
                  className="btn btn-sm btn-danger fw-black px-4 py-2 shadow-sm ms-sm-2 d-flex align-items-center gap-1.5" 
                  onClick={handleBulkDelete} 
                  disabled={bulkProcessing}
                >
                  <i className="bi bi-trash-fill"></i> Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* ULTRA-CLEAN DATA TABLE */}
          {loading ? (
             <div className="text-center py-5 my-4">
               <div className="spinner-border text-primary mb-3" role="status" style={{ width: '2.5rem', height: '2.5rem' }}></div>
               <h6 className="fw-bold text-dark">Synchronizing Platform Account Index...</h6>
               <p className="text-muted small">Retrieving student telemetry and active membership plans.</p>
             </div>
          ) : (
            <div className="table-responsive rounded-4 border border-secondary-subtle">
              <table className="table table-hover align-middle mb-0 bg-white">
                <thead className="bg-light border-bottom border-secondary-subtle">
                  <tr className="text-secondary small fw-extrabold text-uppercase tracking-wider">
                    <th style={{ width: '48px' }} className="text-center py-3">
                      <input 
                        type="checkbox" 
                        className="form-check-input shadow-xs" 
                        checked={allVisibleSelected} 
                        onChange={handleSelectAll} 
                      />
                    </th>
                    <th style={{ width: '75px', cursor: 'pointer' }} className="py-3" onClick={() => toggleSort('id')}>
                      ID {sortField === 'id' && <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-short text-primary fs-6`}></i>}
                    </th>
                    <th style={{ cursor: 'pointer', minWidth: '220px' }} className="py-3" onClick={() => toggleSort('name')}>
                      Learner Profile {sortField === 'name' && <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-short text-primary fs-6`}></i>}
                    </th>
                    <th style={{ cursor: 'pointer' }} className="py-3" onClick={() => toggleSort('role')}>
                      Account Role {sortField === 'role' && <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-short text-primary fs-6`}></i>}
                    </th>
                    <th className="py-3">Membership Package</th>
                    <th style={{ cursor: 'pointer' }} className="py-3" onClick={() => toggleSort('createdAt')}>
                      Joined Date {sortField === 'createdAt' && <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-short text-primary fs-6`}></i>}
                    </th>
                    <th style={{ width: '160px' }} className="text-center py-3">Quick Controls</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-5 my-4 text-muted">
                        <i className="bi bi-folder2-open fs-1 d-block mb-2 text-secondary opacity-50"></i>
                        <span className="fw-bold text-dark fs-6 d-block mb-1">No learners match your specified criteria</span>
                        <small className="text-muted">Try removing role or subscription filters above to see more registered accounts.</small>
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map(u => {
                      const isSelected = selectedIds.includes(u.id);
                      return (
                        <tr key={u.id} className={`transition-colors ${isSelected ? 'bg-primary bg-opacity-10' : ''}`}>
                          <td className="text-center">
                            <input 
                              type="checkbox" 
                              className="form-check-input shadow-xs" 
                              checked={isSelected} 
                              onChange={() => handleSelectRow(u.id)} 
                            />
                          </td>
                          <td className="text-muted fw-bold small">#{u.id}</td>
                          <td>
                            <div className="d-flex align-items-center gap-3 py-1">
                              <div className="position-relative shrink-0">
                                <img 
                                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || u.email)}&background=${u.role === 'ADMIN' ? 'DC3545' : '0D6EFD'}&color=fff&size=44`} 
                                  alt="Avatar" 
                                  className="rounded-3 shadow-xs border border-2 border-white" 
                                  style={{ width: '42px', height: '42px', objectFit: 'cover' }}
                                />
                                <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-white rounded-circle" title="Account Valid & Synced"></span>
                              </div>
                              <div>
                                <div className="fw-extrabold text-dark d-flex align-items-center gap-1.5">
                                  <span>{u.name || <span className="text-muted fst-italic fw-medium">No Name Specified</span>}</span>
                                </div>
                                <div className="text-secondary small fw-medium" style={{ fontSize: "12px" }}>{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`badge px-3 py-1.5 rounded-pill fw-bold border ${u.role === 'ADMIN' ? 'bg-danger bg-opacity-10 text-danger border-danger border-opacity-25' : 'bg-primary bg-opacity-10 text-primary border-primary border-opacity-25'}`}>
                              <i className={`bi ${u.role === 'ADMIN' ? 'bi-shield-lock-fill' : 'bi-person-badge-fill'} me-1.5`}></i>
                              {u.role === 'ADMIN' ? 'Administrator' : 'Student Tier'}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex flex-column gap-1">
                              <div className="d-flex align-items-center gap-2">
                                <span className={`badge px-2.5 py-1 rounded-2 fw-extrabold ${u.subscription ? 'bg-warning text-dark border border-warning border-opacity-50' : 'bg-light text-secondary border'}`}>
                                  <i className="bi bi-award-fill me-1"></i>
                                  {u.subscription ? u.subscription.name : 'Free Starter Tier'}
                                </span>
                              </div>
                              <span className={`small fw-bold d-flex align-items-center gap-1 ${u.subscriptionStatus === 'ACTIVE' ? 'text-success' : 'text-muted'}`} style={{ fontSize: "11px" }}>
                                <span className={`d-inline-block rounded-circle ${u.subscriptionStatus === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`} style={{ width: "6px", height: "6px" }}></span>
                                <span>Status: {u.subscriptionStatus}</span>
                              </span>
                            </div>
                          </td>
                          <td className="text-secondary small fw-semibold">
                            <div className="d-flex align-items-center gap-1.5">
                              <i className="bi bi-calendar3 text-muted"></i>
                              <span>{formatDate(u.createdAt)}</span>
                            </div>
                          </td>
                          <td className="text-center">
                            <div className="d-flex align-items-center justify-content-center gap-1.5">
                              <button 
                                className="btn btn-sm btn-light border text-primary rounded-3 p-1.5 px-2.5 shadow-2xs hover-primary" 
                                title="Inspect Account & Reset Credentials" 
                                onClick={() => setViewingUser(u)}
                              >
                                <i className="bi bi-eye-fill"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-light border text-secondary rounded-3 p-1.5 px-2.5 shadow-2xs hover-dark" 
                                title="Edit Profile Details" 
                                onClick={() => openEditModal(u)}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-light border text-danger rounded-3 p-1.5 px-2.5 shadow-2xs hover-danger" 
                                title="Delete Account" 
                                onClick={() => handleDelete(u.id)}
                              >
                                <i className="bi bi-trash-fill"></i>
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
          )}

          {/* CLEAN PAGINATION RIBBON */}
          {!loading && filteredUsers.length > 0 && (
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 pt-4 mt-2">
              <div className="d-flex align-items-center gap-2 text-secondary small fw-medium">
                <span>Showing <strong className="text-dark">{(currentPage - 1) * pageSize + 1}</strong> – <strong className="text-dark">{Math.min(currentPage * pageSize, filteredUsers.length)}</strong> of <strong className="text-dark">{filteredUsers.length}</strong> learner records</span>
                <select 
                  className="form-select form-select-sm w-auto ms-3 fw-bold rounded-3 shadow-2xs border-secondary-subtle" 
                  value={pageSize} 
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>

              <nav aria-label="Table pagination">
                <ul className="pagination pagination-sm mb-0 gap-1">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link rounded-3 px-3 fw-bold shadow-2xs border-secondary-subtle" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}>
                      <i className="bi bi-chevron-left me-1"></i> Prev
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <li key={p} className={`page-item ${currentPage === p ? 'active' : ''}`}>
                      <button 
                        className={`page-link rounded-3 px-3 fw-black shadow-2xs ${currentPage === p ? 'bg-primary border-primary text-white' : 'border-secondary-subtle'}`} 
                        onClick={() => setCurrentPage(p)}
                      >
                        {p}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link rounded-3 px-3 fw-bold shadow-2xs border-secondary-subtle" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}>
                      Next <i className="bi bi-chevron-right ms-1"></i>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* ===== INSPECT & PASSWORD RESET DRAWER / MODAL ===== */}
      {viewingUser && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header bg-dark text-white p-4 d-flex align-items-center justify-content-between border-bottom border-dark">
                <div className="d-flex align-items-center gap-3">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(viewingUser.name || viewingUser.email)}&background=0D6EFD&color=fff&size=60`} 
                    alt="Avatar" 
                    className="rounded-3 shadow-md border border-2 border-white"
                    style={{ width: '56px', height: '56px', objectFit: "cover" }}
                  />
                  <div>
                    <span className="badge bg-primary px-2 py-0.5 small mb-1">Account Dossier</span>
                    <h5 className="modal-title fw-black mb-0 text-white">{viewingUser.name || 'Student Account'}</h5>
                    <span className="text-white-50 small d-block">{viewingUser.email}</span>
                  </div>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setViewingUser(null)}></button>
              </div>

              <div className="modal-body p-4">
                <h6 className="text-uppercase text-muted fw-black small mb-3 tracking-wider d-flex align-items-center gap-2">
                  <i className="bi bi-info-circle-fill text-primary"></i>
                  <span>System Telemetry Overview</span>
                </h6>
                
                <div className="p-3.5 bg-light rounded-4 mb-4 border border-secondary-subtle shadow-2xs">
                  <div className="row g-3 text-sm">
                    <div className="col-6">
                      <span className="text-muted d-block small fw-bold">Database Account ID:</span>
                      <strong className="text-dark fs-6">#{viewingUser.id}</strong>
                    </div>
                    <div className="col-6">
                      <span className="text-muted d-block small fw-bold">Assigned Privileges:</span>
                      <span className={`badge px-3 py-1 mt-1 rounded-pill ${viewingUser.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>{viewingUser.role}</span>
                    </div>
                    <div className="col-6 mt-3 pt-2 border-top">
                      <span className="text-muted d-block small fw-bold">CEFR Membership:</span>
                      <strong className="text-dark fs-6">{viewingUser.subscription?.name || 'Free Trial Tier'}</strong>
                    </div>
                    <div className="col-6 mt-3 pt-2 border-top">
                      <span className="text-muted d-block small fw-bold">Billing Status:</span>
                      <span className={`fw-black ${viewingUser.subscriptionStatus === 'ACTIVE' ? 'text-success' : 'text-secondary'}`}>{viewingUser.subscriptionStatus}</span>
                    </div>
                    <div className="col-12 mt-3 pt-2 border-top">
                      <span className="text-muted d-block small fw-bold">Account Registration Date:</span>
                      <strong className="text-secondary">{new Date(viewingUser.createdAt).toUTCString()}</strong>
                    </div>
                  </div>
                </div>

                <h6 className="text-uppercase text-muted fw-black small mb-2.5 tracking-wider d-flex align-items-center gap-2">
                  <i className="bi bi-shield-lock-fill text-danger"></i>
                  <span>Administrative Intervention Controls</span>
                </h6>
                <div className="d-grid gap-2.5">
                  <button 
                    className="btn btn-outline-danger fw-black d-flex align-items-center justify-content-center gap-2 py-2.5 rounded-3 shadow-2xs" 
                    onClick={() => handleQuickPasswordReset(viewingUser.id)}
                  >
                    <i className="bi bi-key-fill fs-5"></i>
                    <span>Generate & Reset Temporary Password</span>
                  </button>
                  
                  <button 
                    className="btn btn-outline-dark fw-bold d-flex align-items-center justify-content-center gap-2 py-2.5 rounded-3 shadow-2xs"
                    onClick={() => {
                      const targetRole = viewingUser.role === 'ADMIN' ? 'STUDENT' : 'ADMIN';
                      if (confirm(`Are you sure you want to alter account privileges to ${targetRole}?`)) {
                        fetch('/backend/api/admin/users', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id: viewingUser.id, role: targetRole })
                        }).then(() => { setViewingUser(null); fetchUsers(); notify(`✅ Role altered to ${targetRole} for User #${viewingUser.id}`); });
                      }
                    }}
                  >
                    <i className="bi bi-arrow-left-right text-primary"></i>
                    <span>Switch Role Between Student & Admin</span>
                  </button>
                </div>
              </div>

              <div className="modal-footer bg-light px-4 py-3 border-top">
                <button type="button" className="btn btn-secondary px-4 fw-bold rounded-3" onClick={() => setViewingUser(null)}>Close Dossier</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== ADD / EDIT USER MODAL ===== */}
      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header bg-primary text-white p-4 d-flex align-items-center justify-content-between border-0">
                <div className="d-flex align-items-center gap-2.5">
                  <span className="p-2.5 bg-white bg-opacity-25 rounded-3 text-white fs-4 d-flex align-items-center justify-content-center" style={{ width: "46px", height: "46px" }}>
                    <i className={`bi ${isEditing ? 'bi-person-gear' : 'bi-person-plus-fill'}`}></i>
                  </span>
                  <div>
                    <h5 className="modal-title fw-black mb-0">{isEditing ? "Edit Learner Account Profile" : "Register New Student Account"}</h5>
                    <span className="text-white-50 small d-block">Modify credential privileges and attach billing memberships.</span>
                  </div>
                </div>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body p-4">
                <form id="userForm" onSubmit={handleSave}>
                  
                  <h6 className="fw-black mb-3 text-dark d-flex align-items-center gap-2 text-uppercase text-xs tracking-wider">
                    <i className="bi bi-person-badge text-primary fs-5"></i>
                    <span>Core Identity Credentials</span>
                  </h6>

                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-bold small text-secondary">Full Student Name</label>
                      <input 
                        type="text" 
                        className="form-control rounded-3 py-2.5 border-2" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        placeholder="e.g. Hans Mueller" 
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-bold small text-secondary">Email Address <span className="text-danger">*</span></label>
                      <input 
                        required 
                        type="email" 
                        className="form-control rounded-3 py-2.5 border-2" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        placeholder="user@amardeutsch.com" 
                      />
                    </div>
                  </div>

                  <div className="row g-3 mb-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-bold small text-secondary">Platform Role Privileges</label>
                      <select className="form-select rounded-3 py-2.5 fw-semibold border-2" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                        <option value="STUDENT">🎓 Student (Standard Learner Access)</option>
                        <option value="ADMIN">🛡️ Administrator (Superuser Privileges)</option>
                      </select>
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-bold small text-secondary d-flex justify-content-between">
                        <span>Password Credentials {isEditing ? <small className="text-muted fw-normal">(Unchanged if blank)</small> : <span className="text-danger">*</span>}</span>
                      </label>
                      <div className="input-group rounded-3 overflow-hidden shadow-2xs">
                        <input 
                          type="text" 
                          className="form-control py-2.5 border-2" 
                          value={formData.password} 
                          onChange={e => setFormData({...formData, password: e.target.value})} 
                          placeholder={isEditing ? "Leave empty to retain current" : "Min. 8 alphanumeric chars"} 
                        />
                        <button type="button" className="btn btn-dark px-3 fw-bold d-flex align-items-center gap-1.5" onClick={generatePassword} title="Generate strong random secure password">
                          <i className="bi bi-dice-5-fill text-warning"></i>
                          <span>Generate</span>
                        </button>
                      </div>
                      {passwordFeedback && <div className="text-success small fw-bold mt-1 d-flex align-items-center gap-1"><i className="bi bi-check-circle-fill"></i> {passwordFeedback}</div>}
                    </div>
                  </div>

                  <hr className="my-4 border-secondary-subtle opacity-50"/>
                  
                  <h6 className="fw-black mb-3 text-dark d-flex align-items-center gap-2 text-uppercase text-xs tracking-wider">
                    <i className="bi bi-credit-card-2-front-fill text-success fs-5"></i>
                    <span>Subscription Tier & Billing Plan</span>
                  </h6>

                  <div className="row g-3 p-3.5 bg-light rounded-4 border border-secondary-subtle">
                    <div className="col-12 col-sm-6">
                      <label className="form-label fw-bold small text-secondary">CEFR Package Assignment</label>
                      <select className="form-select rounded-3 py-2.5 fw-semibold border-2 bg-white" value={formData.subscriptionId} onChange={e => setFormData({...formData, subscriptionId: e.target.value})}>
                        <option value="">🌱 Free Starter Tier (Standard)</option>
                        {plans.map(p => (
                          <option key={p.id} value={p.id}>⭐ {p.name} — €{p.price} / {p.billingPeriod || 'month'}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 col-sm-6">
                      <label className="form-label fw-bold small text-secondary">Contract Status</label>
                      <select className="form-select rounded-3 py-2.5 fw-extrabold border-2 bg-white" value={formData.subscriptionStatus} onChange={e => setFormData({...formData, subscriptionStatus: e.target.value})}>
                        <option value="INACTIVE" className="text-secondary">● INACTIVE (NO PLAN)</option>
                        <option value="ACTIVE" className="text-success">🟢 ACTIVE (PAID / SYNCED)</option>
                        <option value="CANCELED" className="text-danger">🔴 CANCELED</option>
                        <option value="PAST_DUE" className="text-warning">🟠 PAST DUE (OVERDUE)</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>

              <div className="modal-footer bg-light px-4 py-3.5 border-top d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-outline-secondary px-4 py-2.5 fw-bold rounded-3 bg-white" onClick={() => setShowModal(false)}>Cancel Operation</button>
                <button type="submit" form="userForm" className="btn btn-primary px-5 py-2.5 fw-black shadow-sm rounded-3">
                  <i className="bi bi-check2-circle me-1.5 fs-6"></i>
                  <span>{isEditing ? "Update Account Records" : "Register New Account"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
