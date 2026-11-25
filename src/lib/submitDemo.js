// Demo requests are emailed through FormSubmit (https://formsubmit.co): no server or account needed.
// The very first submission sends an activation email to the inbox below; click "Activate Form"
// once and every later submission arrives as a normal email.
// After activation FormSubmit also emails a random alias (e.g. 2f1c…): set it as VITE_FORM_EMAIL
// so the real address is not visible in the page source.
const FORM_EMAIL = import.meta.env.VITE_FORM_EMAIL || "industrianakmudaindonesia@gmail.com";
const ENDPOINT = `https://formsubmit.co/ajax/${FORM_EMAIL}`;

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

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

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false || data.success === "false") {
    throw new Error(data.message || "Gagal mengirim");
  }
  return data;
}
