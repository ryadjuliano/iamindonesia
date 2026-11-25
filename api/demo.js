// POST /api/demo — saves one demo request from the landing page form.
import { randomUUID } from "node:crypto";
import { redis, send, readBody, clientIp, storageReady } from "./_lib.js";

const MAX_PER_IP = 5; // per 10 minutes
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

const clean = (v, max) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { ok: false, error: "method_not_allowed" });
  if (!storageReady()) return send(res, 503, { ok: false, error: "storage_not_configured" });

  let body;
  try {
    body = await readBody(req);
  } catch {
    return send(res, 400, { ok: false, error: "bad_json" });
  }

  const lead = {
    name: clean(body.name, 100),
    business: clean(body.business, 120),
    phone: clean(body.phone, 20).replace(/[\s\-().]/g, ""),
    email: clean(body.email, 120).toLowerCase(),
  };
  const invalid =
    lead.name.length < 3 ||
    lead.business.length < 2 ||
    !/^(\+62|62|0)[2-9]\d{6,12}$/.test(lead.phone) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email);
  if (invalid) return send(res, 400, { ok: false, error: "invalid_fields" });

  try {
    const rateKey = `rate:demo:${clientIp(req)}`;
    const [count] = await redis(["INCR", rateKey], ["EXPIRE", rateKey, 600, "NX"]);
    if (count > MAX_PER_IP) return send(res, 429, { ok: false, error: "too_many_requests" });

    const now = Date.now();
    const record = {
      id: randomUUID(),
      createdAt: new Date(now).toISOString(),
      ...lead,
      status: "baru",
      campaign: Object.fromEntries(
        UTM_KEYS.filter((k) => body.campaign?.[k]).map((k) => [k, clean(body.campaign[k], 120)])
      ),
    };
    await redis(["SET", `lead:${record.id}`, JSON.stringify(record)], ["ZADD", "leads", now, record.id]);
    return send(res, 200, { ok: true, id: record.id });
  } catch (err) {
    console.error("[api/demo]", err);
    return send(res, 500, { ok: false, error: "storage_error" });
  }
}
