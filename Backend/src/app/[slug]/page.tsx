import React from 'react';
import { notFound } from 'next/navigation';

import DashboardTab from "@/components/tabs/DashboardTab";
import VocabularyTab from "@/components/tabs/VocabularyTab";
import GrammarTab from "@/components/tabs/GrammarTab";
import QuizzesTab from "@/components/tabs/QuizzesTab";
import UsersTab from "@/components/tabs/UsersTab";
import AnalyticsTab from "@/components/tabs/AnalyticsTab";
import NewsletterTab from "@/components/tabs/NewsletterTab";
import SubscriptionsTab from "@/components/tabs/SubscriptionsTab";
import PaymentGatewaysTab from "@/components/tabs/PaymentGatewaysTab";

export default async function DynamicAdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const normalized = (slug || '').toLowerCase().trim();

  let content = null;
  let title = "";

  switch (normalized) {
    case 'dashboard':
    case 'home':
    case 'overview':
      title = "Executive Dashboard Overview";
      content = <DashboardTab />;
      break;
    case 'vocabulary-database':
    case 'vocabulary':
    case 'vocab':
      title = "Vocabulary Database Studio";
      content = <VocabularyTab />;
      break;
    case 'grammar-rules':
    case 'grammar':
    case 'rules':
      title = "Grammar Rules & Syntax Database";
      content = <GrammarTab />;
      break;
    case 'grammar-quizzes':
    case 'quizzes':
    case 'quiz':
      title = "CEFR Grammar Quizzes & Testing Engine";
      content = <QuizzesTab />;
      break;
    case 'cefr-levels':
    case 'cefr':
    case 'levels':
      title = "CEFR Proficiency Levels";
      content = (
        <div className="card card-outline card-primary shadow-sm border-0 rounded-4">
          <div className="card-header bg-white p-4 border-bottom"><h3 className="card-title fw-black mb-0 text-dark">Manage CEFR Levels</h3></div>
          <div className="card-body p-4">
            <p className="text-muted fw-semibold mb-0">Levels are currently locked to genuine CEFR proficiency standards: A1 (Beginner), A2 (Elementary), B1 (Intermediate), B2 (Upper Intermediate) inside the SQLite repository.</p>
          </div>
        </div>
      );
      break;
    case 'customer-analytics':
    case 'analytics':
    case 'retention':
      title = "Individual Customer Analytics & Retention Studio";
      content = <AnalyticsTab />;
      break;
    case 'user-management':
    case 'users':
    case 'accounts':
      title = "User Directory & Management Studio";
      content = <UsersTab />;
      break;
    case 'newsletter-campaigns':
    case 'newsletter':
    case 'email-campaigns':
      title = "Email Marketing & Announcement Studio";
      content = <NewsletterTab />;
      break;
    case 'subscription-plans':
    case 'subscriptions':
    case 'plans':
      title = "Subscription Plans & Billing Tiers";
      content = <SubscriptionsTab />;
      break;
    case 'payment-gateways':
    case 'gateways':
    case 'payments':
      title = "Payment Gateway Integrations";
      content = <PaymentGatewaysTab />;
      break;
    case 'settings':
    case 'config':
    case 'system':
      title = "General Platform Settings";
      content = (
        <div className="card card-outline card-dark shadow-sm border-0 rounded-4">
          <div className="card-header bg-white p-4 border-bottom"><h3 className="card-title fw-black mb-0 text-dark">System & API Settings</h3></div>
          <div className="card-body p-4">
            <p className="text-muted fw-semibold mb-0">Platform environment parameters and security encryption toggles are managed through zero-dummy SQLite configurations.</p>
          </div>
        </div>
      );
      break;
    default:
      return notFound();
  }

  return (
    <>
      <div className="app-content-header mb-4">
        <div className="row">
          <div className="col-sm-6">
            <h3 className="mb-0">{title}</h3>
          </div>
          <div className="col-sm-6">
            <ol className="breadcrumb float-sm-end">
              <li className="breadcrumb-item"><a href="/Dashboard">Home</a></li>
              <li className="breadcrumb-item active" aria-current="page">
                {title}
              </li>
            </ol>
          </div>
        </div>
      </div>
      {content}
    </>
  );
}
