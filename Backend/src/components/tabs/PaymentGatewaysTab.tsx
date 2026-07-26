"use client";

import React, { useState } from 'react';

export default function PaymentGatewaysTab() {
  const [activeGateway, setActiveGateway] = useState('stripe');

  return (
    <div className="card card-outline card-info mb-4">
      <div className="card-header">
        <h3 className="card-title mb-0">Payment Gateway Integrations</h3>
      </div>
      
      <div className="card-body">
        <ul className="nav nav-pills mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeGateway === 'stripe' ? 'active' : ''}`} onClick={() => setActiveGateway('stripe')}>
              <i className="bi bi-credit-card me-2"></i> Stripe (International)
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeGateway === 'bkash' ? 'active' : ''}`} onClick={() => setActiveGateway('bkash')}>
              <i className="bi bi-phone-fill me-2"></i> bKash (Bangladesh)
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeGateway === 'sslcommerz' ? 'active' : ''}`} onClick={() => setActiveGateway('sslcommerz')}>
              <i className="bi bi-bank me-2"></i> SSLCommerz (Bangladesh)
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeGateway === 'bdbank' ? 'active' : ''}`} onClick={() => setActiveGateway('bdbank')}>
              <i className="bi bi-building me-2"></i> BD Bank Transfer
            </button>
          </li>
        </ul>

        <div className="tab-content border rounded p-4 bg-light">
          {activeGateway === 'stripe' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Stripe Configuration</h4>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" role="switch" id="stripeToggle" defaultChecked />
                  <label className="form-check-label text-success fw-bold" htmlFor="stripeToggle">Active</label>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Publishable Key</label>
                <input type="text" className="form-control" placeholder="pk_test_..." />
              </div>
              <div className="mb-3">
                <label className="form-label">Secret Key</label>
                <input type="password" className="form-control" placeholder="sk_test_..." />
              </div>
              <div className="mb-3">
                <label className="form-label">Webhook Secret</label>
                <input type="password" className="form-control" placeholder="whsec_..." />
              </div>
              <button className="btn btn-info text-white">Save Stripe Keys</button>
            </div>
          )}

          {activeGateway === 'bkash' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>bKash API Configuration</h4>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" role="switch" id="bkashToggle" />
                  <label className="form-check-label text-muted" htmlFor="bkashToggle">Inactive</label>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">App Key</label>
                <input type="text" className="form-control" placeholder="Enter bKash App Key" />
              </div>
              <div className="mb-3">
                <label className="form-label">App Secret</label>
                <input type="password" className="form-control" placeholder="Enter bKash App Secret" />
              </div>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input type="text" className="form-control" placeholder="Merchant Username" />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" placeholder="Merchant Password" />
              </div>
              <button className="btn btn-info text-white">Save bKash Keys</button>
            </div>
          )}

          {activeGateway === 'sslcommerz' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>SSLCommerz Configuration</h4>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" role="switch" id="sslToggle" />
                  <label className="form-check-label text-muted" htmlFor="sslToggle">Inactive</label>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Store ID</label>
                <input type="text" className="form-control" placeholder="Enter Store ID" />
              </div>
              <div className="mb-3">
                <label className="form-label">Store Password</label>
                <input type="password" className="form-control" placeholder="Enter Store Password" />
              </div>
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="sslSandbox" defaultChecked />
                <label className="form-check-label" htmlFor="sslSandbox">
                  Enable Sandbox Mode (Testing)
                </label>
              </div>
              <button className="btn btn-info text-white">Save SSLCommerz Keys</button>
            </div>
          )}

          {activeGateway === 'bdbank' && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Direct Bank Transfer Configuration</h4>
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" role="switch" id="bdbankToggle" />
                  <label className="form-check-label text-muted" htmlFor="bdbankToggle">Inactive</label>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Bank Name</label>
                <input type="text" className="form-control" placeholder="e.g., Dutch-Bangla Bank, BRAC Bank" />
              </div>
              <div className="mb-3">
                <label className="form-label">Account Name</label>
                <input type="text" className="form-control" placeholder="e.g., Learn German Limited" />
              </div>
              <div className="mb-3">
                <label className="form-label">Account Number</label>
                <input type="text" className="form-control" placeholder="Enter Account Number" />
              </div>
              <div className="mb-3">
                <label className="form-label">Branch Routing Number</label>
                <input type="text" className="form-control" placeholder="Enter Routing Number" />
              </div>
              <div className="mb-3">
                <label className="form-label">Instructions for Users</label>
                <textarea className="form-control" rows={3} placeholder="Please deposit the exact amount to the above account and upload your receipt..."></textarea>
              </div>
              <button className="btn btn-info text-white">Save Bank Details</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
