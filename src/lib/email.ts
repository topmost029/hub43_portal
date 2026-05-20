// ─── EmailJS integration ───────────────────────────────────────────────────────
// Free plan: 200 emails/month. Configure via Admin → Email Settings.

export interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export interface SendEmailOptions {
  config: EmailJSConfig;
  templateParams: Record<string, string>;
}

export async function sendEmailJS({
  config,
  templateParams,
}: SendEmailOptions): Promise<{ ok: boolean; fallback?: boolean }> {
  const { serviceId, templateId, publicKey } = config;

  if (
    !serviceId ||
    !templateId ||
    !publicKey ||
    publicKey === "YOUR_PUBLIC_KEY"
  ) {
    // Fallback: open mailto
    const { to_email, subject = "Hub43 Message", message = "" } = templateParams;
    if (to_email) {
      window.open(
        `mailto:${to_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`,
        "_blank"
      );
    }
    return { ok: false, fallback: true };
  }

  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams,
      }),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false, fallback: true };
  }
}

// ─── Template builders ─────────────────────────────────────────────────────────

export const buildEmailParams = {
  bookingConfirmation: ({
    userName,
    userEmail,
    service,
    plan,
    date,
    amount,
  }: {
    userName: string;
    userEmail: string;
    service: string;
    plan: string;
    date: string;
    amount: number;
  }) => ({
    to_email: userEmail,
    to_name: userName,
    subject: `Hub43 – ${service} Booking Confirmed`,
    message: `Hi ${userName},\n\nYour ${service} booking has been submitted.\n\nService: ${service}\nPlan: ${plan}\nDate: ${date}\nAmount: ₦${Number(amount).toLocaleString("en-NG")}\nStatus: Pending Admin Approval\n\nYou will receive another email once your booking is approved.\n\nWarm regards,\nHub43 Workspace Team\nwork@hub43.com`,
    service_label: service,
    plan_label: plan,
    amount: "₦" + Number(amount).toLocaleString("en-NG"),
    status: "Pending Approval",
  }),

  bookingApproved: ({
    userName,
    userEmail,
    service,
    date,
    wifiSsid,
    wifiPassword,
  }: {
    userName: string;
    userEmail: string;
    service: string;
    date: string;
    wifiSsid: string;
    wifiPassword: string;
  }) => ({
    to_email: userEmail,
    to_name: userName,
    subject: `Hub43 – Your Booking is Approved! 🎉`,
    message: `Hi ${userName},\n\nGreat news! Your ${service} booking has been approved.\n\nDate: ${date}\nWiFi Network: ${wifiSsid}\nWiFi Password: ${wifiPassword}\n\nPlease do not share the WiFi password outside Hub43.\n\nSee you at the workspace!\nHub43 Team`,
    service_label: service,
    wifi_ssid: wifiSsid,
    wifi_password: wifiPassword,
    status: "Approved",
  }),

  subscriptionActivated: ({
    userName,
    userEmail,
    service,
    plan,
    startDate,
    endDate,
    amount,
    officeName,
  }: {
    userName: string;
    userEmail: string;
    service: string;
    plan: string;
    startDate: string;
    endDate: string;
    amount: number;
    officeName?: string;
  }) => ({
    to_email: userEmail,
    to_name: userName,
    subject: `Hub43 – ${service} Subscription Active`,
    message: `Hi ${userName},\n\nYour Hub43 subscription is now active!\n\nService: ${service}\nPlan: ${plan}\nStart: ${startDate}\nExpires: ${endDate}${officeName ? "\nOffice: " + officeName : ""}\nAmount: ₦${Number(amount).toLocaleString("en-NG")}\n\nHub43 Workspace Team`,
    service_label: service,
    plan_label: plan,
    expiry_date: endDate,
    amount: "₦" + Number(amount).toLocaleString("en-NG"),
    office_name: officeName ?? "",
  }),

  expiryReminder: ({
    userName,
    userEmail,
    service,
    endDate,
    daysLeft,
  }: {
    userName: string;
    userEmail: string;
    service: string;
    endDate: string;
    daysLeft: number;
  }) => ({
    to_email: userEmail,
    to_name: userName,
    subject: `Hub43 – Subscription Expiring in ${daysLeft} Day${daysLeft !== 1 ? "s" : ""}`,
    message: `Hi ${userName},\n\nYour Hub43 ${service} subscription expires in ${daysLeft} day${daysLeft !== 1 ? "s" : ""} (${endDate}).\n\nLog in to renew and avoid any interruption.\n\nHub43 Workspace Team`,
    service_label: service,
    days_left: String(daysLeft),
    expiry_date: endDate,
  }),
};
