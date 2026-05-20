"use client";
import type { AppUser } from "@/types/supabase";
interface Props { user: AppUser; setActive?: (k: string) => void; }
export default function HotDeskView({ user }: Props) {
  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 12, border: "1px solid #E2E8F0" }}>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>HotDeskView</h2>
      <p style={{ color: "#64748B", marginTop: 8, fontSize: 13 }}>Port the matching view from hub43-workspace-v15.jsx. Use createClient() and the DAL helpers in @/lib/db for all data.</p>
    </div>
  );
}
