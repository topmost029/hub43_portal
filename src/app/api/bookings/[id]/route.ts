Change `.single()` to `.single<{ role: string }>()`:

```ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { updateBooking } from "@/lib/db";

// PATCH /api/bookings/[id] — admin approves/rejects a booking
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single<{ role: string }>();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const adminClient = createAdminClient();

  const booking = await updateBooking(adminClient, params.id, {
    status: body.status,
  });

  return NextResponse.json(booking);
}
```

That's the only change — line 18, `.single<{ role: string }>()`. Save, commit, push.
