import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createBooking, createInvoice, getBookings } from "@/lib/db";
import { genId, todayISO } from "@/lib/utils";

// GET /api/bookings — returns bookings scoped to the caller's role
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.role === "frontdesk";

  const bookings = await getBookings(supabase, isAdmin ? undefined : user.id);
  return NextResponse.json(bookings);
}

// POST /api/bookings — create a new booking
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const adminClient = createAdminClient();

  const booking = await createBooking(adminClient, {
    user_id: user.id,
    service: body.service,
    room_id: body.room_id ?? null,
    office_id: body.office_id ?? null,
    date: body.date ?? todayISO(),
    check_in: body.check_in ?? null,
    check_out: body.check_out ?? null,
    start_time: body.start_time ?? null,
    end_time: body.end_time ?? null,
    hours: body.hours ?? null,
    amount: body.amount,
    status: "pending",
    payment_method: body.payment_method ?? null,
    payment_reference: body.payment_reference ?? null,
  });

  return NextResponse.json(booking, { status: 201 });
}
