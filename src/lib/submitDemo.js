// Demo requests are emailed through FormSubmit (https://formsubmit.co): no server or account needed.
// The very first submission sends an activation email to the inbox below; click "Activate Form"
// once and every later submission arrives as a normal email.
// After activation FormSubmit also emails a random alias (e.g. 2f1c…): set it as VITE_FORM_EMAIL
// so the real address is not visible in the page source.
export const CONTACT_EMAIL = "industrianakmudaindonesia@gmail.com";
const FORM_EMAIL = import.meta.env.VITE_FORM_EMAIL || CONTACT_EMAIL;
const ENDPOINT = `https://formsubmit.co/ajax/${FORM_EMAIL}`;
const TIMEOUT_MS = 20000;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

/** Why a submission failed, so the form can tell the visitor something useful. */
export class SubmitError extends Error {
  constructor(kind, message) {
    super(message);
    this.kind = kind; // "timeout" | "network"
  }
}

/** Ad tracking params from the landing URL (Instagram ads add these), so each lead shows its source. */
export function readCampaign() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const out = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) out[key] = value.slice(0, 120);
  }
  return out;
}

export async function submitDemoRequest({ name, business, phone, email }) {
  const campaign = readCampaign();
  const source = campaign.utm_source
    ? [campaign.utm_source, campaign.utm_campaign].filter(Boolean).join(" / ")
    : "Langsung / organik";

  const body = {
    "Nama lengkap": name,
    "Nama bisnis": business,
    "No. WhatsApp / telepon": phone,
    Email: email,
    Sumber: source,
    ...campaign,
    "Waktu kirim": new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) + " WIB",
    "Daftar semua permintaan": `${window.location.origin}/list-form`,
    _subject: `Permintaan demo COBA: ${business} (${name})`,
    _replyto: email,
    _template: "table",
    _captcha: "false",
  };

  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new SubmitError("network", "offline");
  }

  // Two deliveries in parallel; the request counts as received when either one succeeds:
  // 1. /api/demo saves it to the lead list at /list-form (readable, same-origin reply).
  // 2. FormSubmit emails it. Sent in "no-cors" mode because FormSubmit's reply is often blocked by
  //    CORS even when the email goes out; the promise resolves once the request reached the server.
  const [saved, emailed] = await Promise.allSettled([
    withTimeout((signal) =>
      fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, business, phone, email, campaign }),
        signal,
      }).then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) throw new Error(data.error || `HTTP ${res.status}`);
        return data;
      })
    ),
    withTimeout((signal) =>
      fetch(ENDPOINT, { method: "POST", mode: "no-cors", body: new URLSearchParams(body), signal })
    ),
  ]);

  if (saved.status === "rejected") console.error("[demo form] saving to list failed", saved.reason);
  if (emailed.status === "rejected") console.error("[demo form] email failed", emailed.reason);
  if (saved.status === "rejected" && emailed.status === "rejected") {
    const timedOut = [saved, emailed].every((r) => r.reason?.name === "AbortError");
    throw new SubmitError(timedOut ? "timeout" : "network", String(saved.reason?.message));
  }
}

async function withTimeout(run) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await run(controller.signal);
  } finally {
    clearTimeout(timer);
  }
}
