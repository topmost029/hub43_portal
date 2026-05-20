import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/db";
import AppShell from "@/components/shared/AppShell";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const profile = await getProfile(supabase, user.id).catch(() => null);
  if (!profile) redirect("/login");

  return <AppShell initialUser={profile} />;
}
