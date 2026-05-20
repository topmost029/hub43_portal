"use client";

import { BRAND } from "@/lib/utils";
import type { AppUser } from "@/types/supabase";

interface TopNavProps {
  user: AppUser;
  onNotifClick: () => void;
  onLogout: () => void;
  sideOpen: boolean;
  setSideOpen: (v: boolean) => void;
}

export default function TopNav({
  user,
  onNotifClick,
  onLogout,
  sideOpen,
  setSideOpen,
}: TopNavProps) {
  const roleLabel =
    user.role === "admin"
      ? "Admin"
      : user.role === "frontdesk"
      ? "Front Desk"
      : "Member";

  return (
    <header
      style={{
        height: 56,
        background: BRAND.darkBlue,
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        gap: 12,
        flexShrink: 0,
        zIndex: 100,
      }}
    >
      {/* Hamburger */}
      <button
        onClick={() => setSideOpen(!sideOpen)}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 4,
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
        aria-label="Toggle sidebar"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: "block",
              width: 20,
              height: 2,
              background: "#fff",
              borderRadius: 2,
            }}
          />
        ))}
      </button>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 7,
            background: BRAND.red,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 900,
            color: "#fff",
          }}
        >
          H43
        </div>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>
          Hub43 Workspace
        </span>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Notification bell */}
        <button
          onClick={onNotifClick}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: 8,
            width: 34,
            height: 34,
            cursor: "pointer",
            color: "#fff",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Notifications"
        >
          🔔
        </button>

        {/* User chip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: "4px 10px",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: BRAND.orange,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ color: "#fff", fontSize: 12, fontWeight: 600, lineHeight: 1.2 }}>
              {user.name.split(" ")[0]}
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 10 }}>
              {roleLabel}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "none",
            borderRadius: 8,
            width: 34,
            height: 34,
            cursor: "pointer",
            color: "#fff",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title="Log out"
        >
          ⎋
        </button>
      </div>
    </header>
  );
}
