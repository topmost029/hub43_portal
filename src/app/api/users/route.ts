import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllUsers } from "@/lib/db";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single<{ role: string }>();
  if (!["admin", "frontdesk"].includes(profile?.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await getAllUsers(supabase as any);
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single<{ role: string }>();
  if (profile?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const adminClient = createAdminClient();

  const { data: newUser, error: authError } = await adminClient.auth.admin.createUser({
    email: body.email,
    password: body.password,
    user_metadata: { name: body.name },
    email_confirm: true,
  });

  if (authError || !newUser.user) {
    return NextResponse.json({ error: authError?.message ?? "Failed to create user" }, { status: 400 });
  }

  const { data: updatedProfile, error: profileError } = await (adminClient as any)
    .from("profiles")
    .update({
      name: body.name,
      role: body.role ?? "member",
      phone: body.phone ?? "",
    })
    .eq("id", newUser.user.id)
    .select()
    .single<any>();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 });
  }

  return NextResponse.json(updatedProfile, { status: 201 });
}
