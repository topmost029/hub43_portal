"use client";

/**
 * AppShell
 * The main client-side application shell.
 * Mirrors the structure of the original single-file React app
 * but split into modular components that fetch their own data via Supabase.
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AppUser } from "@/types/supabase";
import TopNav from "./TopNav";
import Sidebar from "./Sidebar";

// ─── Lazy-loaded view components ────────────────────────────────────────────
// Each view lives in src/components/{admin|member|frontdesk}/
// and is responsible for its own data fetching.

import dynamic from "next/dynamic";

const AdminDashboard     = dynamic(() => import("@/components/admin/AdminDashboard"));
const AdminUsers         = dynamic(() => import("@/components/admin/AdminUsers"));
const AdminOffices       = dynamic(() => import("@/components/admin/AdminOffices"));
const AdminBookings      = dynamic(() => import("@/components/admin/AdminBookings"));
const AdminSubscriptions = dynamic(() => import("@/components/admin/AdminSubscriptions"));
const AdminInvoices      = dynamic(() => import("@/components/admin/AdminInvoices"));
const AdminRevenue       = dynamic(() => import("@/components/admin/AdminRevenue"));
const AdminPricing       = dynamic(() => import("@/components/admin/AdminPricing"));
const AdminPendingPayments = dynamic(() => import("@/components/admin/AdminPendingPayments"));
const AdminExpenses      = dynamic(() => import("@/components/admin/AdminExpenses"));
const AdminExport        = dynamic(() => import("@/components/admin/AdminExport"));
const AdminSettings      = dynamic(() => import("@/components/admin/AdminSettings"));
const AdminVirtualOffices = dynamic(() => import("@/components/admin/AdminVirtualOffices"));
const MeetingRoomAdmin   = dynamic(() => import("@/components/admin/MeetingRoomAdmin"));

const MemberDashboard    = dynamic(() => import("@/components/member/MemberDashboard"));
const HotDeskView        = dynamic(() => import("@/components/member/HotDeskView"));
const PrivateOfficeView  = dynamic(() => import("@/components/member/PrivateOfficeView"));
const MeetingRoomView    = dynamic(() => import("@/components/member/MeetingRoomView"));
const VirtualOfficeView  = dynamic(() => import("@/components/member/VirtualOfficeView"));
const MyBookings         = dynamic(() => import("@/components/member/MyBookings"));
const MemberSubscriptions = dynamic(() => import("@/components/member/MemberSubscriptions"));
const MemberInvoices     = dynamic(() => import("@/components/member/MemberInvoices"));
const MemberProfile      = dynamic(() => import("@/components/member/MemberProfile"));

const FrontDeskOnboard   = dynamic(() => import("@/components/frontdesk/FrontDeskOnboard"));
const FrontDeskCheckins  = dynamic(() => import("@/components/frontdesk/FrontDeskCheckins"));
const FrontDeskMembers   = dynamic(() => import("@/components/frontdesk/FrontDeskMembers"));
const FrontDeskExpenses  = dynamic(() => import("@/components/frontdesk/FrontDeskExpenses"));
const FrontDeskAccount   = dynamic(() => import("@/components/frontdesk/FrontDeskAccount"));

interface AppShellProps {
  initialUser: AppUser;
}

export default function AppShell({ initialUser }: AppShellProps) {
  const router = useRouter();
  const [user] = useState<AppUser>(initialUser);
  const [active, setActive] = useState<string>(
    initialUser.role === "frontdesk" ? "fd_onboard" : "dashboard"
  );
  const [sideOpen, setSideOpen] = useState(true);
  const [showNotifs, setShowNotifs] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const renderContent = () => {
    if (user.role === "admin") {
      switch (active) {
        case "dashboard":         return <AdminDashboard user={user} />;
        case "users":             return <AdminUsers />;
        case "offices":           return <AdminOffices />;
        case "meeting_rooms":     return <MeetingRoomAdmin user={user} />;
        case "bookings":          return <AdminBookings />;
        case "virtual_offices":   return <AdminVirtualOffices />;
        case "subscriptions":     return <AdminSubscriptions />;
        case "invoices":          return <AdminInvoices />;
        case "revenue":           return <AdminRevenue />;
        case "pricing":           return <AdminPricing />;
        case "pending_payments":  return <AdminPendingPayments />;
        case "expenses":          return <AdminExpenses user={user} />;
        case "export":            return <AdminExport />;
        case "settings":          return <AdminSettings />;
        default:                  return <AdminDashboard user={user} />;
      }
    }

    if (user.role === "frontdesk") {
      switch (active) {
        case "fd_onboard":   return <FrontDeskOnboard user={user} />;
        case "fd_checkins":  return <FrontDeskCheckins />;
        case "fd_members":   return <FrontDeskMembers />;
        case "expenses":     return <FrontDeskExpenses user={user} />;
        case "fd_account":   return <FrontDeskAccount user={user} />;
        default:             return <FrontDeskOnboard user={user} />;
      }
    }

    // Member
    switch (active) {
      case "dashboard":      return <MemberDashboard user={user} setActive={setActive} />;
      case "hot_desk":       return <HotDeskView user={user} />;
      case "private_office": return <PrivateOfficeView user={user} />;
      case "meeting_room":   return <MeetingRoomView user={user} />;
      case "virtual_office": return <VirtualOfficeView user={user} />;
      case "my_bookings":    return <MyBookings user={user} />;
      case "subscriptions":  return <MemberSubscriptions user={user} />;
      case "my_invoices":    return <MemberInvoices user={user} />;
      case "my_profile":     return <MemberProfile user={user} />;
      default:               return <MemberDashboard user={user} setActive={setActive} />;
    }
  };

  return (
    <div
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#F8FAFC",
      }}
    >
      <TopNav
        user={user}
        onNotifClick={() => setShowNotifs(true)}
        onLogout={handleLogout}
        sideOpen={sideOpen}
        setSideOpen={setSideOpen}
      />

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar
          user={user}
          active={active}
          setActive={setActive}
          open={sideOpen}
        />
        <main style={{ flex: 1, overflow: "auto", padding: "24px 28px" }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
