// ─── Formatting ───────────────────────────────────────────────────────────────

export const formatNGN = (n: number | string): string =>
  "₦" + Number(n).toLocaleString("en-NG");

export const formatDate = (d: string | Date): string =>
  new Date(d).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const formatDateTime = (d: string | Date): string =>
  new Date(d).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// ─── Date helpers ─────────────────────────────────────────────────────────────

export const daysLeft = (endDate: string): number =>
  Math.max(
    0,
    Math.ceil((new Date(endDate).getTime() - Date.now()) / 86_400_000)
  );

export const addDays = (date: Date | string, days: number): string => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

export const todayISO = (): string => new Date().toISOString().split("T")[0];

// ─── ID generation ────────────────────────────────────────────────────────────

export const genId = (prefix = "id"): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

// ─── Brand colors ─────────────────────────────────────────────────────────────

export const BRAND = {
  red: "#C8372D",
  blue: "#1E3A8A",
  orange: "#E07B2A",
  darkBlue: "#152C6B",
  lightBlue: "#EEF2FF",
  lightOrange: "#FFF4EA",
  lightRed: "#FFF0EF",
} as const;

// ─── Status badge helper ──────────────────────────────────────────────────────

export type BadgeStatus =
  | "active"
  | "expired"
  | "pending"
  | "pending_transfer"
  | "approved"
  | "rejected"
  | "completed"
  | "available"
  | "occupied"
  | "paid"
  | "unpaid";

export const BADGE_STYLES: Record<
  BadgeStatus,
  { bg: string; color: string; label: string }
> = {
  active:           { bg: "#DCFCE7", color: "#166534", label: "Active" },
  expired:          { bg: "#FEE2E2", color: "#991B1B", label: "Expired" },
  pending:          { bg: "#FEF9C3", color: "#854D0E", label: "Pending" },
  pending_transfer: { bg: "#FFF4EA", color: "#92400E", label: "Awaiting Payment" },
  approved:         { bg: "#DCFCE7", color: "#166534", label: "Approved" },
  rejected:         { bg: "#FEE2E2", color: "#991B1B", label: "Rejected" },
  completed:        { bg: "#EDE9FE", color: "#5B21B6", label: "Completed" },
  available:        { bg: "#DCFCE7", color: "#166534", label: "Available" },
  occupied:         { bg: "#FEE2E2", color: "#991B1B", label: "Occupied" },
  paid:             { bg: "#DCFCE7", color: "#166534", label: "Paid" },
  unpaid:           { bg: "#FEE2E2", color: "#991B1B", label: "Unpaid" },
};
