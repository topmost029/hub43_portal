"use client";
import type { AppUser } from "@/types/supabase";
export default function AdminExpenses({ user }: { user: AppUser }) {
  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0" }}>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>AdminExpenses</h2>
      <p style={{ color: "#64748B", marginTop: 8, fontSize: 13 }}>Port from hub43-workspace-v15.jsx.</p>
    </div>
  );
}
