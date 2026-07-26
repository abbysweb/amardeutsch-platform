"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawFrom = searchParams.get('from') || '/Dashboard';
  // If from already contains /backend from URL params, normalize it for Next router
  const from = rawFrom.startsWith('/backend') ? rawFrom.slice('/backend'.length) || '/Dashboard' : rawFrom;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      // Must include /backend basePath for API requests
      const response = await fetch('/backend/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Login failed. Please check your credentials.');
      }

      // Successfully logged in
      router.push(from);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-box shadow-lg rounded-4 overflow-hidden bg-white p-0 border border-secondary-subtle" style={{ maxWidth: '440px', width: '100%' }}>
      <div className="card border-0 mb-0">
        <div className="card-header bg-dark text-white text-center py-4 border-0">
          <div className="mb-2">
            <span className="badge text-bg-warning fs-6 px-3 py-2 rounded-pill shadow-sm">
              <i className="bi bi-shield-lock-fill me-2"></i>amardeutsch.com Admin Portal
            </span>
          </div>
          <h2 className="fs-4 fw-bold mb-1 mt-2">Welcome Back</h2>
          <p className="text-white-50 mb-0 fs-6">Sign in to manage vocabulary and content</p>
        </div>
        
        <div className="card-body p-4 p-sm-5">
          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4 py-2 px-3 shadow-sm rounded-3 text-start fs-6" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="form-label fw-semibold text-dark fs-6" htmlFor="email">Email Address</label>
              <div className="input-group input-group-lg shadow-sm">
                <span className="input-group-text bg-light border-end-0 text-secondary">
                  <i className="bi bi-envelope-fill"></i>
                </span>
                <input
                  type="email"
                  id="email"
                  className="form-control border-start-0 ps-0 text-dark fs-6"
                  placeholder="admin@amardeutsch.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <label className="form-label fw-semibold text-dark fs-6 mb-1" htmlFor="password">Password</label>
              </div>
              <div className="input-group input-group-lg shadow-sm">
                <span className="input-group-text bg-light border-end-0 text-secondary">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input
                  type="password"
                  id="password"
                  className="form-control border-start-0 ps-0 text-dark fs-6"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2 shadow mt-4 py-3"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Authenticating...
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <i className="bi bi-arrow-right-circle-fill"></i>
                </>
              )}
            </button>
          </form>

          <hr className="my-4 border-secondary-subtle" />

          <div className="text-center">
            <p className="text-secondary mb-0 fs-6">
              Don&apos;t have an admin account yet?{' '}
              <Link href="/signup" className="fw-bold text-decoration-none text-primary">
                Create Account <i className="bi bi-chevron-right small"></i>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
