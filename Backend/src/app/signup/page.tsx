"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password || !name.trim()) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      // Include /backend basePath in API request URL
      const response = await fetch('/backend/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed. Please check your inputs.');
      }

      // Automatically redirect to dashboard after registration
      router.push('/Dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-box shadow-lg rounded-4 overflow-hidden bg-white p-0 border border-secondary-subtle" style={{ maxWidth: '480px', width: '100%' }}>
      <div className="card border-0 mb-0">
        <div className="card-header bg-primary text-white text-center py-4 border-0 bg-gradient">
          <div className="mb-2">
            <span className="badge text-bg-light text-primary fw-bold fs-6 px-3 py-2 rounded-pill shadow-sm">
              <i className="bi bi-person-plus-fill me-2"></i>New Admin Registration
            </span>
          </div>
          <h2 className="fs-4 fw-bold mb-1 mt-2">Create Admin Account</h2>
          <p className="text-white-50 mb-0 fs-6">Set up credentials for platform access</p>
        </div>

        <div className="card-body p-4 p-sm-5">
          {error && (
            <div className="alert alert-danger d-flex align-items-center mb-4 py-2 px-3 shadow-sm rounded-3 text-start fs-6" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSignup}>
            <div className="mb-3">
              <label className="form-label fw-semibold text-dark fs-6" htmlFor="name">Full Name</label>
              <div className="input-group input-group-lg shadow-sm">
                <span className="input-group-text bg-light border-end-0 text-secondary">
                  <i className="bi bi-person-fill"></i>
                </span>
                <input
                  type="text"
                  id="name"
                  className="form-control border-start-0 ps-0 text-dark fs-6"
                  placeholder="Hans Mueller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mb-3">
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
                />
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-12 col-sm-6">
                <label className="form-label fw-semibold text-dark fs-6" htmlFor="password">Password</label>
                <div className="input-group shadow-sm">
                  <span className="input-group-text bg-light border-end-0 text-secondary">
                    <i className="bi bi-key-fill"></i>
                  </span>
                  <input
                    type="password"
                    id="password"
                    className="form-control border-start-0 ps-0 text-dark"
                    placeholder="Min. 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="col-12 col-sm-6">
                <label className="form-label fw-semibold text-dark fs-6" htmlFor="confirm">Confirm Password</label>
                <div className="input-group shadow-sm">
                  <span className="input-group-text bg-light border-end-0 text-secondary">
                    <i className="bi bi-check2-all"></i>
                  </span>
                  <input
                    type="password"
                    id="confirm"
                    className="form-control border-start-0 ps-0 text-dark"
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2 shadow py-3 mt-4"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Registering Account...
                </>
              ) : (
                <>
                  <i className="bi bi-shield-check"></i>
                  <span>Register & Open Dashboard</span>
                </>
              )}
            </button>
          </form>

          <hr className="my-4 border-secondary-subtle" />

          <div className="text-center">
            <p className="text-secondary mb-0 fs-6">
              Already have an administrator account?{' '}
              <Link href="/login" className="fw-bold text-decoration-none text-primary">
                Sign In Here <i className="bi bi-chevron-right small"></i>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
