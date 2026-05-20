"use client";

/**
 * AdminDashboard
 * Mirrors the AdminDashboard view from the original JSX.
 * Fetches summary stats from Supabase and renders charts.
 *
 * TODO: Implement full chart/stats logic from original hub43-workspace-v15.jsx
 */

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatNGN } from "@/lib/utils";
import { StatCard } from "@/components/ui/Card";
import type { AppUser } from "@/types/supabase";

interface AdminDashboardProps {
  user: AppUser;
}

interface Stats {
  totalRevenue: number;
  activeSubscriptions: number;
  pendingBookings: number;
  totalMembers: number;
}

export default function AdminDashboard({ user }: AdminDashboardProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const db = createClient();

      const [
        { data: subs },
        { data: bookings },
        { data: members },
        { data: invoices },
      ] = await Promise.all([
        db.from("subscriptions").select("status"),
        db.from("bookings").select("status"),
        db.from("profiles").select("role"),
        db.from("invoices").select("amount, status"),
      ]);

      setStats({
        totalRevenue: (invoices ?? [])
          .filter((i) => i.status === "paid")
          .reduce((s, i) => s + Number(i.amount), 0),
        activeSubscriptions: (subs ?? []).filter((s) => s.status === "active").length,
        pendingBookings: (bookings ?? []).filter((b) => b.status === "pending" || b.status === "pending_transfer").length,
        totalMembers: (members ?? []).filter((u) => u.role === "member").length,
      });
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60, color: "#94A3B8" }}>
        Loading dashboard…
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ margin: "0 0 20px", fontSize: 20, fontWeight: 800, color: "#1E293B" }}>
        Welcome back, {user.name.split(" ")[0]} 👋
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}
      >
        <StatCard
          label="Total Revenue"
          value={formatNGN(stats?.totalRevenue ?? 0)}
          icon="💰"
          color="#166534"
          bg="#DCFCE7"
        />
        <StatCard
          label="Active Subscriptions"
          value={stats?.activeSubscriptions ?? 0}
          icon="🔄"
          color="#1E3A8A"
          bg="#EEF2FF"
        />
        <StatCard
          label="Pending Bookings"
          value={stats?.pendingBookings ?? 0}
          icon="⏳"
          color="#92400E"
          bg="#FFF4EA"
        />
        <StatCard
          label="Total Members"
          value={stats?.totalMembers ?? 0}
          icon="👥"
          color="#1E3A8A"
          bg="#EEF2FF"
        />
      </div>

      <p style={{ color: "#64748B", fontSize: 13 }}>
        Full charts (revenue trends, booking breakdown, occupancy) are rendered here —
        port from <code>AdminDashboard</code> in <code>hub43-workspace-v15.jsx</code>.
      </p>
    </div>
  );
}
