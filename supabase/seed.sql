-- ─── Hub43 Workspace — Seed Data ──────────────────────────────────────────────
-- Run after migration. Creates demo users via Supabase Auth + profiles.
-- NOTE: In production, create users through Supabase Dashboard or the app's
--       Admin → Users screen. This seed is for local dev / staging only.

-- ─── App Settings ─────────────────────────────────────────────────────────────

insert into public.app_settings (key, value) values
  ('wifi',             '{"ssid":"Hub43-Workspace-5G","password":"Hub43@2025!"}'),
  ('hot_desk_pricing', '{"hourly":625,"daily":4000,"monthly":60000}'),
  ('virtual_office_plans', '[
    {"id":"biannual","label":"Bi-Annual (6 months)","days":180,"price":75000},
    {"id":"annual","label":"Annual (12 months)","days":365,"price":120000}
  ]'),
  ('payment_methods', '{
    "bank_transfer":true,
    "paystack":true,
    "paystack_key":"pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "bank_details":{
      "bank_name":"Guaranty Trust Bank (GTB)",
      "account_number":"0123456789",
      "account_name":"Hub43 Workspace Ltd"
    }
  }'),
  ('email_settings', '{
    "service_id":"",
    "template_id":"",
    "public_key":"",
    "enable_booking_confirmation":true,
    "enable_booking_approval":true,
    "enable_subscription_activated":true,
    "enable_subscription_renewed":true,
    "enable_expiry_reminder":true,
    "enable_invoice_email":true,
    "email_log":[]
  }'),
  ('manager_email', '"manager@hub43.com"')
on conflict (key) do nothing;

-- ─── Offices ──────────────────────────────────────────────────────────────────

insert into public.offices (id, name, floor, capacity, status, type, pricing) values
  ('a1000000-0000-0000-0000-000000000001', 'Office A', '2nd Floor', 4, 'available', 'private',
   '{"daily":7500,"monthly":150000,"quarterly":380000,"yearly":1200000}'),
  ('a1000000-0000-0000-0000-000000000002', 'Office B', '2nd Floor', 2, 'available', 'private',
   '{"daily":5000,"monthly":100000,"quarterly":270000,"yearly":900000}'),
  ('a1000000-0000-0000-0000-000000000003', 'Office C', '3rd Floor', 6, 'available', 'private',
   '{"daily":12000,"monthly":220000,"quarterly":580000,"yearly":1800000}'),
  ('a1000000-0000-0000-0000-000000000004', 'Office D', '3rd Floor', 3, 'available', 'private',
   '{"daily":6000,"monthly":120000,"quarterly":320000,"yearly":1050000}')
on conflict (id) do nothing;

-- ─── Meeting Rooms ────────────────────────────────────────────────────────────

insert into public.meeting_rooms (id, name, capacity, floor, pricing) values
  ('b1000000-0000-0000-0000-000000000001', 'The Boardroom', 12, '2nd Floor',
   '{"hourly":15000,"halfDay":55000,"fullDay":100000}')
on conflict (id) do nothing;

-- ─── Notes for creating demo auth users ───────────────────────────────────────
-- Run these in Supabase Dashboard → Authentication → Users → Invite
-- Or use the Supabase CLI:
--
--   supabase auth admin create-user \
--     --email admin@hub43.com \
--     --password admin123 \
--     --user-metadata '{"name":"Admin User","role":"admin"}'
--
-- After creating auth users, update their profiles:
--   UPDATE profiles SET role = 'admin'      WHERE email = 'admin@hub43.com';
--   UPDATE profiles SET role = 'frontdesk'  WHERE email = 'frontdesk@hub43.com';
--
-- The trigger `handle_new_user` creates the profile row automatically on signup.
