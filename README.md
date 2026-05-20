# Hub43 Workspace — Production App

A full-stack coworking workspace management platform built with **Next.js 14 (App Router)**, **Supabase**, and deployed on **Vercel**.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth (email/password) |
| Styling | Tailwind CSS + inline styles |
| Charts | Recharts |
| Payments | Paystack (inline checkout) |
| Email | EmailJS |
| Hosting | Vercel |

---

## 📁 Project Structure

```
hub43-workspace/
├── src/
│   ├── app/                          # Next.js App Router pages & API routes
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Root redirect → /dashboard or /login
│   │   ├── globals.css
│   │   ├── login/page.tsx            # Login screen
│   │   ├── dashboard/page.tsx        # Protected dashboard (server component)
│   │   ├── auth/callback/route.ts    # OAuth/magic-link callback
│   │   └── api/
│   │       ├── bookings/             # GET list, POST create, PATCH [id]
│   │       ├── expenses/             # GET, POST
│   │       ├── settings/             # GET ?key=, POST (admin)
│   │       └── users/               # GET, POST (admin)
│   ├── components/
│   │   ├── shared/
│   │   │   ├── AppShell.tsx          # Main client app wrapper + routing
│   │   │   ├── TopNav.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── ui/
│   │   │   ├── Badge.tsx
│   │   │   └── Card.tsx
│   │   ├── admin/                    # Admin-role views (port from v15.jsx)
│   │   │   ├── AdminDashboard.tsx    ✅ implemented
│   │   │   ├── AdminUsers.tsx        🔲 stub — port from v15
│   │   │   ├── AdminOffices.tsx      🔲 stub
│   │   │   ├── AdminBookings.tsx     🔲 stub
│   │   │   ├── AdminSubscriptions.tsx
│   │   │   ├── AdminInvoices.tsx
│   │   │   ├── AdminRevenue.tsx
│   │   │   ├── AdminPricing.tsx
│   │   │   ├── AdminPendingPayments.tsx
│   │   │   ├── AdminExpenses.tsx
│   │   │   ├── AdminExport.tsx
│   │   │   ├── AdminSettings.tsx     # WiFi, Email, Payment settings
│   │   │   ├── AdminVirtualOffices.tsx
│   │   │   └── MeetingRoomAdmin.tsx
│   │   ├── member/                   # Member-role views
│   │   │   ├── MemberDashboard.tsx
│   │   │   ├── HotDeskView.tsx
│   │   │   ├── PrivateOfficeView.tsx
│   │   │   ├── MeetingRoomView.tsx
│   │   │   ├── VirtualOfficeView.tsx
│   │   │   ├── MyBookings.tsx
│   │   │   ├── MemberSubscriptions.tsx
│   │   │   ├── MemberInvoices.tsx
│   │   │   └── MemberProfile.tsx
│   │   └── frontdesk/               # Front desk staff views
│   │       ├── FrontDeskOnboard.tsx
│   │       ├── FrontDeskCheckins.tsx
│   │       ├── FrontDeskMembers.tsx
│   │       ├── FrontDeskExpenses.tsx
│   │       └── FrontDeskAccount.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client
│   │   │   ├── server.ts             # Server Component client
│   │   │   └── admin.ts             # Service-role client (API routes only)
│   │   ├── db.ts                     # Data Access Layer (all DB queries)
│   │   ├── utils.ts                  # Formatters, helpers, brand colors
│   │   ├── email.ts                  # EmailJS helpers + template builders
│   │   └── paystack.ts              # Paystack inline checkout helper
│   ├── middleware.ts                 # Auth session refresh + route protection
│   └── types/
│       └── supabase.ts              # Database types + domain types
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   └── 001_initial_schema.sql   # Complete schema with RLS policies
│   └── seed.sql                     # Dev seed data (offices, settings)
├── .env.local.example               # Environment variable template
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 🚀 Deployment Guide

### 1. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/migrations/001_initial_schema.sql`
3. Run `supabase/seed.sql` to populate offices, meeting rooms, and default settings
4. Go to **Authentication → Users** and create:
   - `admin@hub43.com` (password: your choice)
   - `frontdesk@hub43.com` (password: your choice)
5. In SQL Editor, set their roles:
   ```sql
   UPDATE profiles SET role = 'admin'     WHERE email = 'admin@hub43.com';
   UPDATE profiles SET role = 'frontdesk' WHERE email = 'frontdesk@hub43.com';
   ```
6. Copy your **Project URL** and **anon key** from Settings → API

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 3. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# Project → Settings → Environment Variables
# Add all variables from .env.local.example
```

Or connect your GitHub repo to Vercel for automatic deployments.

### 4. Local Development

```bash
npm install
cp .env.local.example .env.local
# Fill in your Supabase credentials

npm run dev
# App runs at http://localhost:3000
```

---

## 🔌 Third-Party Services

### Paystack
- Sign up at [paystack.com](https://paystack.com)
- Get your public key from Dashboard → Settings → API
- Admin can update the key in-app: **Admin → Settings → Payment Settings**
- Or set `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` in environment variables

### EmailJS
- Sign up at [emailjs.com](https://emailjs.com)
- Create a service, template, and get your public key
- Admin can configure in-app: **Admin → Settings → Email Settings**
- Template variables used: `to_email`, `to_name`, `subject`, `message`, `service_label`, `amount`, etc.

---

## 🏗️ Porting the Original UI

All view components are stubs that need the UI logic ported from `hub43-workspace-v15.jsx`.

**Pattern for each component:**

```tsx
"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
// Use DAL helpers:
import { getBookings, createBooking } from "@/lib/db";
// Use shared utilities:
import { formatNGN, formatDate, BRAND } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  
  useEffect(() => {
    createClient()
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setBookings(data ?? []));
  }, []);

  // ... render UI from v15.jsx, replacing data.bookings → bookings
  //     and setData(...) → refetch or optimistic update
}
```

**Key replacements:**
| v15.jsx pattern | Production pattern |
|---|---|
| `data.bookings` | fetch from Supabase via `createClient()` |
| `setData(prev => {...})` | `await supabase.from(...).update(...)` then refetch |
| `INITIAL_DATA` | Supabase seed data |
| `localStorage` session | Supabase Auth (handled by middleware) |
| `data.emailSettings` | `await getSetting(db, "email_settings")` |
| `data.wifi` | `await getSetting(db, "wifi")` |

---

## 🔒 Security Notes

- **Row Level Security** is enabled on all tables — see migration for policies
- **Service role key** is only used server-side in API routes, never exposed to the client
- **Passwords** are managed by Supabase Auth — no plain-text storage
- Admin creates frontdesk/member accounts via `POST /api/users` (uses admin client)
- WiFi password is stored in `app_settings` table and only readable by authenticated users

---

## 📧 Contact

Hub43 Workspace · work@hub43.com · +234-800-HUB-43HQ
