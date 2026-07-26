"use client";

import React, { useState, useEffect } from 'react';

export default function SubscriptionsTab() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({ id: '', name: '', price: 0, currency: 'EUR', interval: 'MONTHLY', features: '', isActive: true });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await fetch('/backend/api/admin/subscriptions');
      if (res.ok) {
        const data = await res.json();
        setPlans(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/backend/api/admin/subscriptions';
      const method = isEditing ? 'PUT' : 'POST';
      
      const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f);

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          features: featuresArray
        })
      });
      
      if (res.ok) {
        setShowModal(false);
        fetchPlans();
      } else {
        alert("Failed to save subscription plan.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      const res = await fetch(`/backend/api/admin/subscriptions?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchPlans();
      else alert("Cannot delete a plan that has active users.");
    } catch (e) {
      console.error(e);
    }
  };

  const openAddModal = () => {
    setFormData({ id: '', name: '', price: 0, currency: 'EUR', interval: 'MONTHLY', features: '', isActive: true });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (plan: any) => {
    let parsedFeatures = [];
    try { parsedFeatures = JSON.parse(plan.features || "[]"); } catch (e) {}
    
    setFormData({ 
      id: plan.id, 
      name: plan.name, 
      price: plan.price, 
      currency: plan.currency, 
      interval: plan.interval, 
      features: parsedFeatures.join(', '), 
      isActive: plan.isActive 
    });
    setIsEditing(true);
    setShowModal(true);
  };

  return (
    <>
      <div className="card card-outline card-warning mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="card-title mb-0">Subscription Pricing Plans</h3>
          <button className="btn btn-warning btn-sm ms-auto text-dark fw-bold" onClick={openAddModal}>
            <i className="bi bi-plus-circle"></i> Create New Plan
          </button>
        </div>
        
        <div className="card-body bg-light">
          {loading ? (
             <div className="text-center py-4"><div className="spinner-border text-warning" role="status"></div></div>
          ) : plans.length === 0 ? (
             <div className="text-center py-5 text-muted">No plans found. Create your first pricing tier!</div>
          ) : (
            <div className="row">
              {plans.map(plan => {
                let featureList: string[] = [];
                try { featureList = JSON.parse(plan.features || "[]"); } catch (e) {}

                return (
                  <div className="col-md-4 mb-3" key={plan.id}>
                    <div className={`card h-100 shadow-sm border-${plan.isActive ? 'warning' : 'secondary'}`}>
                      <div className="card-body text-center position-relative">
                        {!plan.isActive && (
                          <span className="badge text-bg-secondary position-absolute top-0 end-0 m-2">Inactive</span>
                        )}
                        <h4 className="fw-bold">{plan.name}</h4>
                        <h2 className="my-3 text-warning">
                          {plan.currency === 'EUR' ? '€' : plan.currency === 'USD' ? '$' : '৳'}
                          {plan.price} <small className="text-muted fs-6">/ {plan.interval.toLowerCase()}</small>
                        </h2>
                        <p className="text-muted">{plan._count?.users || 0} Active Subscribers</p>
                        <hr/>
                        <ul className="list-unstyled text-start">
                          {featureList.map((feature, idx) => (
                             <li className="mb-2" key={idx}>
                               <i className="bi bi-check-circle-fill text-success me-2"></i> {feature}
                             </li>
                          ))}
                          {featureList.length === 0 && <li className="text-muted text-center">No features listed</li>}
                        </ul>
                      </div>
                      <div className="card-footer bg-white border-top-0 d-flex gap-2">
                        <button className="btn btn-outline-warning w-100 text-dark fw-bold" onClick={() => openEditModal(plan)}>
                          Edit
                        </button>
                        <button className="btn btn-outline-danger" onClick={() => handleDelete(plan.id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header text-bg-warning">
                <h5 className="modal-title fw-bold text-dark">{isEditing ? "Edit Plan" : "Create New Plan"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form id="planForm" onSubmit={handleSave}>
                  <div className="mb-3">
                    <label className="form-label">Plan Name</label>
                    <input required type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Premium" />
                  </div>
                  
                  <div className="row mb-3">
                    <div className="col-6">
                      <label className="form-label">Price</label>
                      <input required type="number" step="0.01" className="form-control" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} />
                    </div>
                    <div className="col-6">
                      <label className="form-label">Currency</label>
                      <select className="form-select" value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value})}>
                        <option value="EUR">EUR (€)</option>
                        <option value="USD">USD ($)</option>
                        <option value="BDT">BDT (৳)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Billing Interval</label>
                    <select className="form-select" value={formData.interval} onChange={e => setFormData({...formData, interval: e.target.value})}>
                      <option value="MONTHLY">Monthly</option>
                      <option value="YEARLY">Yearly</option>
                      <option value="LIFETIME">One-time / Lifetime</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Features (Comma separated)</label>
                    <textarea 
                      className="form-control" 
                      rows={3} 
                      value={formData.features} 
                      onChange={e => setFormData({...formData, features: e.target.value})} 
                      placeholder="All Grammar Rules, Flashcards, Priority Support"
                    ></textarea>
                  </div>

                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" id="activeToggle" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                    <label className="form-check-label" htmlFor="activeToggle">Plan is Active (Available for purchase)</label>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" form="planForm" className="btn btn-warning text-dark fw-bold">Save Plan</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
