"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

interface UserProfile {
  id: number;
  name?: string;
  email: string;
  role: string;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname.endsWith('/login') || pathname.endsWith('/signup');

  useEffect(() => {
    if (!isAuthPage) {
      fetch('/backend/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated && data.user) {
            setUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, [isAuthPage, pathname]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await fetch('/backend/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // On auth screens, show clean background without sidebar/header overlays
  if (isAuthPage) {
    return (
      <main className="min-vh-100 d-flex align-items-center justify-content-center bg-dark bg-gradient p-3" suppressHydrationWarning>
        {children}
      </main>
    );
  }

  // Regular AdminLTE dashboard shell
  return (
    <div className="app-wrapper" suppressHydrationWarning>
      {/* ===== TOP NAVBAR ===== */}
      <nav className="app-header navbar navbar-expand bg-body shadow-sm">
        <div className="container-fluid">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" data-lte-toggle="sidebar" href="#" role="button">
                <i className="bi bi-list fs-5"></i>
              </a>
            </li>
            <li className="nav-item d-none d-md-block">
              <Link href="/Dashboard" className="nav-link fw-medium">Home</Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <a className="nav-link" href="#" data-lte-toggle="fullscreen" title="Toggle Fullscreen">
                <i data-lte-icon="maximize" className="bi bi-arrows-fullscreen"></i>
                <i data-lte-icon="minimize" className="bi bi-fullscreen-exit d-none"></i>
              </a>
            </li>

            <li className="nav-item dropdown user-menu ms-2">
              <a href="#" className="nav-link dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown" aria-expanded="false">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin User')}&background=0D8ABC&color=fff&size=40`}
                  className="user-image rounded-circle shadow-sm"
                  alt="User Image"
                  style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                />
                <span className="d-none d-md-inline fw-semibold">{user?.name || 'Admin'}</span>
              </a>
              
              <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-2 py-2" style={{ minWidth: '240px' }}>
                <li className="px-3 py-2 border-bottom bg-light bg-opacity-50">
                  <div className="fw-bold text-dark">{user?.name || 'Admin User'}</div>
                  <div className="text-secondary small text-truncate">{user?.email || 'Administrator'}</div>
                  <span className="badge bg-primary mt-1 px-2 py-1 small">Role: {user?.role || 'ADMIN'}</span>
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger fw-medium mt-1" href="#" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right fs-5"></i>
                    <span>Sign Out</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </nav>

      {/* ===== SIDEBAR ===== */}
      <Sidebar />

      {/* ===== MAIN CONTENT ===== */}
      <main className="app-main">
        <div className="app-content">
          <div className="container-fluid pt-4">
            {children}
          </div>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="app-footer text-muted text-end small py-3 px-4 border-top">
        <div className="float-start d-none d-sm-inline fw-semibold text-secondary">amardeutsch.com Platform v2.0</div>
        <strong>Copyright &copy; 2026 <Link href="/Dashboard" className="text-decoration-none text-primary fw-bold">AmarDeutsch (amardeutsch.com)</Link>.</strong> All rights reserved.
      </footer>
    </div>
  );
}
