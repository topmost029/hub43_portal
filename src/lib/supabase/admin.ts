import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

/**
 * Admin client bypasses Row Level Security.
 * ONLY use this in API routes / server actions — never import in client components.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
