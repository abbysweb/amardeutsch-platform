"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  // Helper to check if a link is active (usePathname strips basePath)
  const isActive = (path: string) => pathname === `/${path}` ? 'active' : '';

  return (
    <aside className="app-sidebar bg-body-secondary shadow" data-bs-theme="dark">
      <div className="sidebar-brand">
        <Link href="/Dashboard" className="brand-link">
          <i className="bi bi-globe brand-image opacity-75 shadow d-flex align-items-center justify-content-center text-warning" style={{ fontSize: '1.5rem', width: '33px' }}></i>
          <span className="brand-text fw-semibold tracking-wide">amardeutsch.com</span>
        </Link>
      </div>
      <div className="sidebar-wrapper">
        <nav className="mt-2">
          <ul className="nav sidebar-menu flex-column" data-lte-toggle="treeview" role="menu" data-accordion="false">
            <li className="nav-item">
              <Link href="/Dashboard" className={`nav-link ${isActive('Dashboard')}`}>
                <i className="nav-icon bi bi-speedometer"></i>
                <p>Dashboard</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/CEFR-Levels" className={`nav-link ${isActive('CEFR-Levels')}`}>
                <i className="nav-icon bi bi-layers"></i>
                <p>CEFR Levels</p>
              </Link>
            </li>
            
            <li className="nav-header">CONTENT DATABASE</li>
            <li className="nav-item">
              <Link href="/Vocabulary-Database" className={`nav-link ${isActive('Vocabulary-Database')}`}>
                <i className="nav-icon bi bi-book"></i>
                <p>Vocabulary Database</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/Grammar-Rules" className={`nav-link ${isActive('Grammar-Rules')}`}>
                <i className="nav-icon bi bi-journal-text"></i>
                <p>Grammar Rules</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/Grammar-Quizzes" className={`nav-link ${isActive('Grammar-Quizzes')}`}>
                <i className="nav-icon bi bi-patch-question-fill"></i>
                <p>Grammar Quizzes</p>
              </Link>
            </li>
            
            <li className="nav-header">SAAS PLATFORM</li>
            <li className="nav-item">
              <Link href="/Customer-Analytics" className={`nav-link ${isActive('Customer-Analytics')}`}>
                <i className="nav-icon bi bi-bar-chart-fill"></i>
                <p>Customer Analytics</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/User-Management" className={`nav-link ${isActive('User-Management')}`}>
                <i className="nav-icon bi bi-people-fill"></i>
                <p>User Management</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/Newsletter-Campaigns" className={`nav-link ${isActive('Newsletter-Campaigns')}`}>
                <i className="nav-icon bi bi-envelope-paper-fill"></i>
                <p>Newsletter Campaigns</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/Subscription-Plans" className={`nav-link ${isActive('Subscription-Plans')}`}>
                <i className="nav-icon bi bi-tags-fill"></i>
                <p>Subscription Plans</p>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/Payment-Gateways" className={`nav-link ${isActive('Payment-Gateways')}`}>
                <i className="nav-icon bi bi-bank2"></i>
                <p>Payment Gateways</p>
              </Link>
            </li>

            <li className="nav-header">SYSTEM</li>
            <li className="nav-item">
              <Link href="/Settings" className={`nav-link ${isActive('Settings')}`}>
                <i className="nav-icon bi bi-gear"></i>
                <p>Settings</p>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
