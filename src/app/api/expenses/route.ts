import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getExpenses, createExpense } from "@/lib/db";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!["admin", "frontdesk"].includes(profile?.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const expenses = await getExpenses(supabase);
  return NextResponse.json(expenses);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!["admin", "frontdesk"].includes(profile?.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const adminClient = createAdminClient();

  const expense = await createExpense(adminClient, {
    date: body.date,
    category: body.category,
    description: body.description,
    amount: body.amount,
    payment_method: body.payment_method ?? "card",
    recorded_by: user.id,
    entered_at: new Date().toISOString(),
  });

  return NextResponse.json(expense, { status: 201 });
}
