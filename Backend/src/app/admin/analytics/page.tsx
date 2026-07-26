"use client";

import React from "react";
import InterconnectedAnalyticsDashboard from "@/components/Analytics/InterconnectedAnalyticsDashboard";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <InterconnectedAnalyticsDashboard viewMode="admin" />
    </div>
  );
}
