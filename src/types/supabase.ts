// ─── Core domain types (mirrors the Supabase schema) ──────────────────────────

export type UserRole = "admin" | "frontdesk" | "member";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  joined: string; // ISO date string
  avatar_url?: string;
}

export interface Office {
  id: string;
  name: string;
  floor: string;
  capacity: number;
  status: "available" | "occupied";
  assigned_to: string | null;
  type: "private";
  pricing: {
    daily: number;
    monthly: number;
    quarterly: number;
    yearly: number;
  };
}

export interface MeetingRoom {
  id: string;
  name: string;
  capacity: number;
  floor: string;
  pricing: {
    hourly: number;
    halfDay: number;
    fullDay: number;
  };
}

export type ServiceType =
  | "hot_desk"
  | "private_office"
  | "meeting_room"
  | "virtual_office";

export type BookingStatus =
  | "pending"
  | "pending_transfer"
  | "approved"
  | "rejected"
  | "completed";

export interface Booking {
  id: string;
  user_id: string;
  service: ServiceType;
  room_id?: string;
  office_id?: string;
  date: string;
  check_in?: string;
  check_out?: string;
  start_time?: string;
  end_time?: string;
  hours?: number;
  amount: number;
  status: BookingStatus;
  invoice_id?: string | null;
  payment_method?: "paystack" | "bank_transfer" | null;
  payment_reference?: string | null;
  created_at: string;
}

export type SubscriptionStatus = "active" | "expired" | "cancelled";

export interface Subscription {
  id: string;
  user_id: string;
  service: ServiceType;
  plan: string;
  start_date: string;
  end_date: string;
  status: SubscriptionStatus;
  office_id?: string | null;
  amount: number;
  created_at: string;
}

export type InvoiceStatus = "paid" | "unpaid" | "pending";

export interface Invoice {
  id: string;
  user_id: string;
  booking_id?: string | null;
  subscription_id?: string | null;
  amount: number;
  date: string;
  status: InvoiceStatus;
  service: string;
  description: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: "reminder" | "info" | "warning" | "success";
  message: string;
  read: boolean;
  date: string;
  created_at: string;
}

export interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  payment_method: string;
  recorded_by: string;
  entered_at: string;
}

export interface VirtualDocCertificate {
  file_name: string;
  uploaded_at: string;
  storage_path: string;
}

export interface VirtualDocs {
  certificates: Record<string, VirtualDocCertificate>;
  utility_bill: {
    file_name: string;
    uploaded_at: string;
    storage_path: string;
  } | null;
  utility_requests: Array<{
    id: string;
    user_id: string;
    requested_at: string;
    status: "pending" | "fulfilled";
  }>;
}

export interface HotDeskPricing {
  hourly: number;
  daily: number;
  monthly: number;
}

export interface VirtualOfficePlan {
  id: string;
  label: string;
  days: number;
  price: number;
}

export interface PaymentMethods {
  bank_transfer: boolean;
  paystack: boolean;
  paystack_key: string;
  bank_details: {
    bank_name: string;
    account_number: string;
    account_name: string;
  };
}

export interface EmailSettings {
  service_id: string;
  template_id: string;
  public_key: string;
  enable_booking_confirmation: boolean;
  enable_booking_approval: boolean;
  enable_subscription_activated: boolean;
  enable_subscription_renewed: boolean;
  enable_expiry_reminder: boolean;
  enable_invoice_email: boolean;
  email_log: EmailLogEntry[];
}

export interface EmailLogEntry {
  id: string;
  type: string;
  to: string;
  subject: string;
  status: "sent" | "failed" | "fallback";
  timestamp: string;
}

export interface WifiSettings {
  ssid: string;
  password: string;
}

// ─── Supabase auto-generated stub — replace with `supabase gen types` output ──
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: AppUser;
        Insert: Omit<AppUser, "joined"> & { joined?: string };
        Update: Partial<AppUser>;
      };
      offices: {
        Row: Office;
        Insert: Omit<Office, "id">;
        Update: Partial<Office>;
      };
      meeting_rooms: {
        Row: MeetingRoom;
        Insert: Omit<MeetingRoom, "id">;
        Update: Partial<MeetingRoom>;
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, "id" | "created_at">;
        Update: Partial<Booking>;
      };
      subscriptions: {
        Row: Subscription;
        Insert: Omit<Subscription, "id" | "created_at">;
        Update: Partial<Subscription>;
      };
      invoices: {
        Row: Invoice;
        Insert: Omit<Invoice, "id" | "created_at">;
        Update: Partial<Invoice>;
      };
      notifications: {
        Row: Notification;
        Insert: Omit<Notification, "id" | "created_at">;
        Update: Partial<Notification>;
      };
      expenses: {
        Row: Expense;
        Insert: Omit<Expense, "id">;
        Update: Partial<Expense>;
      };
      app_settings: {
        Row: {
          key: string;
          value: unknown;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: unknown;
        };
        Update: {
          value?: unknown;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      booking_status: BookingStatus;
      subscription_status: SubscriptionStatus;
      invoice_status: InvoiceStatus;
      service_type: ServiceType;
    };
  };
};
