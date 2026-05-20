"use client";
import type { AppUser } from "@/types/supabase";
export default function FrontDeskAccount({ user }: { user: AppUser }) {
  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0" }}>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>FrontDeskAccount</h2>
      <p style={{ color: "#64748B", marginTop: 8, fontSize: 13 }}>Port the matching view from hub43-workspace-v15.jsx. Use createClient() and DAL helpers in @/lib/db.</p>
    </div>
  );
}
