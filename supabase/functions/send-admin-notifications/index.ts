import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BATCH_SIZE = 20;

const REQUEST_TYPE_LABELS: Record<string, string> = {
  volunteer: "New Volunteer Registration",
  business_partner: "New Business Partner Registration",
  care_facility_ngo: "New Care Facility / NGO Registration",
  foundation_ngo: "New Foundation / NGO Registration",
};

interface ClaimedEmail {
  outbox_id: string;
  request_id: string;
  recipient_email: string;
  request_type: string;
  applicant_name: string;
  submitted_at: string;
  attempt_number: number;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatSubmitted = (iso: string) =>
  `${new Date(iso).toLocaleString("en-GB", {
    timeZone: "UTC",
    dateStyle: "medium",
    timeStyle: "short",
  })} UTC`;

const buildEmail = (row: ClaimedEmail, siteUrl: string) => {
  const requestLabel = REQUEST_TYPE_LABELS[row.request_type] ?? "New Registration Request";
  const submitted = formatSubmitted(row.submitted_at);
  const reviewLink = `${siteUrl}/?view=admin&request=${encodeURIComponent(row.request_id)}`;
  const subject = `Administrator Action Required: ${requestLabel}`;

  const text = [
    "A request on the Hearty Foundation platform is waiting for administrator review.",
    "",
    `Request: ${requestLabel}`,
    `Applicant: ${row.applicant_name}`,
    `Submitted: ${submitted}`,
    "",
    "Please log in to the Administrator area to review the submitted information and documentation, then approve or reject the request.",
    "",
    `Log in to review the request: ${reviewLink}`,
    "",
    "For security reasons, administrator credentials are never included in email notifications.",
  ].join("\n");

  const html = `
<div style="font-family: Arial, Helvetica, sans-serif; color: #374151; max-width: 560px; line-height: 1.5;">
  <h2 style="color: #111827; margin: 0 0 16px;">Administrator Action Required</h2>
  <p>A request on the Hearty Foundation platform is waiting for administrator review.</p>
  <table style="border-collapse: collapse; margin: 16px 0;">
    <tr><td style="padding: 4px 16px 4px 0; color: #6b7280;">Request</td><td style="padding: 4px 0;"><strong>${escapeHtml(requestLabel)}</strong></td></tr>
    <tr><td style="padding: 4px 16px 4px 0; color: #6b7280;">Applicant</td><td style="padding: 4px 0;">${escapeHtml(row.applicant_name)}</td></tr>
    <tr><td style="padding: 4px 16px 4px 0; color: #6b7280;">Submitted</td><td style="padding: 4px 0;">${escapeHtml(submitted)}</td></tr>
  </table>
  <p>Please log in to the Administrator area to review the submitted information and documentation, then approve or reject the request.</p>
  <p style="margin: 24px 0;">
    <a href="${escapeHtml(reviewLink)}" style="display: inline-block; background: #dc2626; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: bold;">Log in to Review Request</a>
  </p>
  <p style="font-size: 12px; color: #6b7280;">For security reasons, administrator credentials are never included in email notifications.</p>
</div>`;

  return { subject, text, html };
};

const sendWithProvider = async (
  apiKey: string,
  from: string,
  to: string,
  message: { subject: string; text: string; html: string },
) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], ...message }),
  });
  if (!response.ok) {
    throw new Error(`Email provider responded with status ${response.status}`);
  }
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const fromAddress = Deno.env.get("ADMIN_EMAIL_FROM");
    const siteUrl = Deno.env.get("SITE_URL")?.replace(/\/+$/, "");

    if (!resendApiKey || !fromAddress || !siteUrl) {
      console.error("Admin email notifications are not configured");
      return json({ error: "Email notifications are not configured" }, 503);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const { data: claimed, error: claimError } = await admin.rpc("claim_admin_email_batch", {
      p_limit: BATCH_SIZE,
    });
    if (claimError) {
      console.error("Could not claim admin emails:", claimError.message);
      return json({ error: "Could not load pending notifications" }, 500);
    }

    const rows = (Array.isArray(claimed) ? claimed : []) as ClaimedEmail[];
    let sent = 0;
    let failed = 0;

    for (const row of rows) {
      try {
        await sendWithProvider(resendApiKey, fromAddress, row.recipient_email, buildEmail(row, siteUrl));
        const { error: updateError } = await admin
          .from("admin_email_outbox")
          .update({ status: "sent", sent_at: new Date().toISOString(), last_error: null, claimed_at: null })
          .eq("id", row.outbox_id);
        if (updateError) throw new Error(updateError.message);
        sent += 1;
      } catch (sendError) {
        failed += 1;
        const message = sendError instanceof Error ? sendError.message : "Unknown delivery error";
        console.error(`Admin email ${row.outbox_id} failed:`, message);
        const { error: failUpdateError } = await admin
          .from("admin_email_outbox")
          .update({ status: "failed", last_error: message.slice(0, 500), claimed_at: null })
          .eq("id", row.outbox_id);
        if (failUpdateError) console.error("Could not record email failure:", failUpdateError.message);
      }
    }

    return json({ processed: rows.length, sent, failed });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    console.error("send-admin-notifications error:", message);
    return json({ error: "Could not send administrator notifications" }, 500);
  }
});
