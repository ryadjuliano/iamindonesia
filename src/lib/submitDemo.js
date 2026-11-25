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
    _subject: `Permintaan demo COBA: ${business} (${name})`,
    _replyto: email,
    _template: "table",
    _captcha: "false",
  };

  // Sent as a plain form post in "no-cors" mode. FormSubmit delivers the email but its reply is not
  // always readable from the browser (CORS), which made successful sends look like failures.
  // In this mode the promise resolves once the server has received the request and only rejects
  // when the request never got there (offline, DNS, blocked), which is exactly what we need to know.
  if (typeof navigator !== "undefined" && navigator.onLine === false) {
    throw new SubmitError("network", "offline");
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    await fetch(ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: new URLSearchParams(body),
      signal: controller.signal,
    });
  } catch (err) {
    console.error("[demo form] request failed", err);
    throw new SubmitError(err.name === "AbortError" ? "timeout" : "network", err.message);
  } finally {
    clearTimeout(timer);
  }
}
