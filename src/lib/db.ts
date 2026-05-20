/**
 * Data Access Layer (DAL)
 * All database reads/writes go through these functions.
 * Import createClient from the correct path depending on context:
 *   - Server Components / Route Handlers → "@/lib/supabase/server"
 *   - Client Components → "@/lib/supabase/client"
 *   - Admin operations → "@/lib/supabase/admin"
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

type DB = SupabaseClient<Database>;

// ─── Profiles ─────────────────────────────────────────────────────────────────

export const getProfile = async (db: DB, userId: string) => {
  const { data, error } = await db
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
};

export const getAllUsers = async (db: DB) => {
  const { data, error } = await db.from("profiles").select("*").order("joined");
  if (error) throw error;
  return data;
};

export const updateProfile = async (
  db: DB,
  userId: string,
  updates: Partial<Database["public"]["Tables"]["profiles"]["Update"]>
) => {
  const { data, error } = await db
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ─── Offices ──────────────────────────────────────────────────────────────────

export const getOffices = async (db: DB) => {
  const { data, error } = await db.from("offices").select("*").order("name");
  if (error) throw error;
  return data;
};

export const upsertOffice = async (
  db: DB,
  office: Database["public"]["Tables"]["offices"]["Insert"]
) => {
  const { data, error } = await db
    .from("offices")
    .upsert(office)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ─── Meeting rooms ────────────────────────────────────────────────────────────

export const getMeetingRooms = async (db: DB) => {
  const { data, error } = await db.from("meeting_rooms").select("*").order("name");
  if (error) throw error;
  return data;
};

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const getBookings = async (db: DB, userId?: string) => {
  let q = db.from("bookings").select("*").order("created_at", { ascending: false });
  if (userId) q = q.eq("user_id", userId);
  const { data, error } = await q;
  if (error) throw error;
  return data;
};

export const createBooking = async (
  db: DB,
  booking: Database["public"]["Tables"]["bookings"]["Insert"]
) => {
  const { data, error } = await db
    .from("bookings")
    .insert(booking)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateBooking = async (
  db: DB,
  id: string,
  updates: Database["public"]["Tables"]["bookings"]["Update"]
) => {
  const { data, error } = await db
    .from("bookings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ─── Subscriptions ────────────────────────────────────────────────────────────

export const getSubscriptions = async (db: DB, userId?: string) => {
  let q = db.from("subscriptions").select("*").order("created_at", { ascending: false });
  if (userId) q = q.eq("user_id", userId);
  const { data, error } = await q;
  if (error) throw error;
  return data;
};

export const createSubscription = async (
  db: DB,
  sub: Database["public"]["Tables"]["subscriptions"]["Insert"]
) => {
  const { data, error } = await db
    .from("subscriptions")
    .insert(sub)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateSubscription = async (
  db: DB,
  id: string,
  updates: Database["public"]["Tables"]["subscriptions"]["Update"]
) => {
  const { data, error } = await db
    .from("subscriptions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ─── Invoices ─────────────────────────────────────────────────────────────────

export const getInvoices = async (db: DB, userId?: string) => {
  let q = db.from("invoices").select("*").order("created_at", { ascending: false });
  if (userId) q = q.eq("user_id", userId);
  const { data, error } = await q;
  if (error) throw error;
  return data;
};

export const createInvoice = async (
  db: DB,
  invoice: Database["public"]["Tables"]["invoices"]["Insert"]
) => {
  const { data, error } = await db
    .from("invoices")
    .insert(invoice)
    .select()
    .single();
  if (error) throw error;
  return data;
};

// ─── Notifications ────────────────────────────────────────────────────────────

export const getNotifications = async (db: DB, userId: string) => {
  const { data, error } = await db
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

export const markNotificationRead = async (db: DB, id: string) => {
  const { error } = await db
    .from("notifications")
    .update({ read: true })
    .eq("id", id);
  if (error) throw error;
};

// ─── Expenses ─────────────────────────────────────────────────────────────────

export const getExpenses = async (db: DB) => {
  const { data, error } = await db
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
};

export const createExpense = async (
  db: DB,
  expense: Database["public"]["Tables"]["expenses"]["Insert"]
) => {
  const { data, error } = await db
    .from("expenses")
    .insert(expense)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteExpense = async (db: DB, id: string) => {
  const { error } = await db.from("expenses").delete().eq("id", id);
  if (error) throw error;
};

// ─── App settings (key-value store) ──────────────────────────────────────────

export const getSetting = async <T = unknown>(db: DB, key: string): Promise<T | null> => {
  const { data, error } = await db
    .from("app_settings")
    .select("value")
    .eq("key", key)
    .single();
  if (error) return null;
  return data.value as T;
};

export const setSetting = async (db: DB, key: string, value: Json) => {
  const { error } = await db
    .from("app_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
};
