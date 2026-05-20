"use client";

import { BRAND } from "@/lib/utils";
import type { AppUser } from "@/types/supabase";

interface NavItem {
  key: string;
  label: string;
  icon: string;
  section?: string;
}

const ADMIN_NAV: NavItem[] = [
  { key: "dashboard",        label: "Dashboard",        icon: "⊞",  section: "Overview" },
  { key: "users",            label: "Members",          icon: "👥", section: "People" },
  { key: "offices",          label: "Offices",          icon: "🏢", section: "Spaces" },
  { key: "meeting_rooms",    label: "Meeting Rooms",    icon: "🤝" },
  { key: "virtual_offices",  label: "Virtual Offices",  icon: "🌐" },
  { key: "bookings",         label: "Bookings",         icon: "📅", section: "Operations" },
  { key: "pending_payments", label: "Pending Payments", icon: "⏳" },
  { key: "subscriptions",    label: "Subscriptions",    icon: "🔄" },
  { key: "invoices",         label: "Invoices",         icon: "🧾" },
  { key: "expenses",         label: "Expenses",         icon: "💸" },
  { key: "revenue",          label: "Revenue",          icon: "📊", section: "Reports" },
  { key: "export",           label: "Export Data",      icon: "⬇️" },
  { key: "pricing",          label: "Pricing",          icon: "🏷️", section: "Settings" },
  { key: "settings",         label: "App Settings",     icon: "⚙️" },
];

const MEMBER_NAV: NavItem[] = [
  { key: "dashboard",      label: "Dashboard",       icon: "⊞" },
  { key: "hot_desk",       label: "Hot Desk",        icon: "💻", section: "Book a Space" },
  { key: "private_office", label: "Private Office",  icon: "🏢" },
  { key: "meeting_room",   label: "Meeting Room",    icon: "🤝" },
  { key: "virtual_office", label: "Virtual Office",  icon: "🌐" },
  { key: "my_bookings",    label: "My Bookings",     icon: "📅", section: "My Account" },
  { key: "subscriptions",  label: "Subscriptions",   icon: "🔄" },
  { key: "my_invoices",    label: "Invoices",        icon: "🧾" },
  { key: "my_profile",     label: "Profile",         icon: "👤" },
];

const FRONTDESK_NAV: NavItem[] = [
  { key: "fd_onboard",  label: "Check-In",    icon: "✅" },
  { key: "fd_checkins", label: "Check-Ins",   icon: "📋" },
  { key: "fd_members",  label: "Members",     icon: "👥" },
  { key: "expenses",    label: "Expenses",    icon: "💸" },
  { key: "fd_account",  label: "My Account",  icon: "👤" },
];

interface SidebarProps {
  user: AppUser;
  active: string;
  setActive: (key: string) => void;
  open: boolean;
}

export default function Sidebar({ user, active, setActive, open }: SidebarProps) {
  const navItems =
    user.role === "admin"
      ? ADMIN_NAV
      : user.role === "frontdesk"
      ? FRONTDESK_NAV
      : MEMBER_NAV;

  if (!open) return null;

  let lastSection: string | undefined;

  return (
    <aside
      style={{
        width: 220,
        background: "#fff",
        borderRight: "1px solid #E2E8F0",
        overflowY: "auto",
        flexShrink: 0,
        padding: "12px 0",
      }}
    >
      {navItems.map((item) => {
        const showSection = item.section && item.section !== lastSection;
        if (item.section) lastSection = item.section;

        return (
          <div key={item.key}>
            {showSection && (
              <div
                style={{
                  padding: "12px 16px 4px",
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {item.section}
              </div>
            )}
            <button
              onClick={() => setActive(item.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "9px 16px",
                background:
                  active === item.key ? BRAND.lightBlue : "transparent",
                border: "none",
                borderLeft:
                  active === item.key
                    ? `3px solid ${BRAND.blue}`
                    : "3px solid transparent",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: active === item.key ? 600 : 400,
                color: active === item.key ? BRAND.blue : "#374151",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          </div>
        );
      })}
    </aside>
  );
}
