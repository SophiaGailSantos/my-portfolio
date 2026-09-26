// Contact form endpoint: validates, stores in Postgres, emails Sophia.
//
// Create it in the Supabase dashboard: Edge Functions > New Function > paste
// this file > Deploy. Then add the secret:
//   supabase secrets set RESEND_API_KEY=re_xxxxxxxxx

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_URL = "https://api.resend.com/emails";
const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 4000;

// Honeypot field: real visitors never see or fill this, bots usually do.
const HONEYPOT = "company_website";

// Simple fixed-window rate limit. Per-instance and resets on cold start, so it
// is a speed bump against casual bots, not a hard guarantee.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map();

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function cors(body, status = 200) {
  return new Response(body, {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function jsonError(message, status = 400) {
  return cors(JSON.stringify({ error: message }), status);
}

function rateLimited(ip) {
  const now = Date.now();

  for (const [key, stamp] of hits) {
    if (now - stamp > RATE_LIMIT_WINDOW_MS) hits.delete(key);
  }

  const count = hits.get(ip) ?? 0;
  if (count >= RATE_LIMIT_MAX) return true;

  hits.set(ip, count + 1);
  return false;
}

// The visitor's name and message go into an HTML email, so they must be
// escaped or a visitor could inject markup into the message you read.
function escapeHtml(value) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]
  );
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return cors(null, 204);
  if (request.method !== "POST") return jsonError("Method not allowed", 405);

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (rateLimited(ip)) {
    return jsonError("Too many messages sent. Please try again later.", 429);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Invalid request body");
  }

  // Pretend it worked so bots stop trying, but store nothing.
  if (clean(payload[HONEYPOT], 200)) return cors(JSON.stringify({ ok: true }));

  const name = clean(payload.name, MAX_NAME);
  const email = clean(payload.email, MAX_EMAIL);
  const message = clean(payload.message, MAX_MESSAGE);

  if (!name || !message) return jsonError("Please fill in your name and message.");
  if (!isValidEmail(email)) return jsonError("Please enter a valid email address.");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  const { error: dbError } = await supabase.from("contact_messages").insert({
    name,
    email,
    message,
    user_agent: request.headers.get("user-agent"),
  });

  // Storage failed, so the visitor must be told to retry. This is the only
  // branch that returns an error, which keeps the thank-you message honest.
  if (dbError) {
    console.error("insert failed:", dbError.message);
    return jsonError(
      "Your message could not be saved. Please try again in a moment.",
      500
    );
  }

  const resendKey = Deno.env.get("RESEND_API_KEY");
  const toEmail = Deno.env.get("CONTACT_TO_EMAIL") ?? "gailsantos38@gmail.com";
  const fromEmail =
    Deno.env.get("CONTACT_FROM_EMAIL") ?? "Portfolio <onboarding@resend.dev>";

  if (!resendKey) {
    // Saved but not emailed. Surface this in the logs so it is not silent.
    console.warn("RESEND_API_KEY is not set - message stored but not emailed.");
  } else {
    const emailResponse = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: [
          `Name: ${name}`,
          `Reply to: ${email}`,
          "",
          message,
        ].join("\n"),
        html: [
          `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
          `<p><strong>Reply to:</strong> ${escapeHtml(email)}</p>`,
          "<hr />",
          `<p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>`,
        ].join(""),
      }),
    });

    if (!emailResponse.ok) {
      // The row is already stored, so the message is safe. Log and carry on.
      console.error(
        "resend failed:",
        emailResponse.status,
        await emailResponse.text()
      );
    }
  }

  return cors(JSON.stringify({ ok: true }));
});
