// /api/leads — admin only (header x-admin-key = ADMIN_PASSWORD).
//   GET                     → newest demo requests first (max 1000)
//   PATCH { id, status }    → update a request's follow-up status
//   DELETE ?id=…            → remove a request (spam / test entries)
import { redis, send, readBody, isAdmin, storageReady, STATUSES, clientIp } from "./_lib.js";

export default async function handler(req, res) {
  if (!storageReady()) return send(res, 503, { ok: false, error: "storage_not_configured" });
  if (!process.env.ADMIN_PASSWORD) return send(res, 503, { ok: false, error: "admin_password_not_set" });

  if (!isAdmin(req)) {
    // Slow down password guessing.
    await new Promise((r) => setTimeout(r, 800));
    console.warn("[api/leads] wrong password from", clientIp(req));
    return send(res, 401, { ok: false, error: "unauthorized" });
  }

  try {
    if (req.method === "GET") {
      const [ids] = await redis(["ZREVRANGE", "leads", 0, 999]);
      if (!ids.length) return send(res, 200, { ok: true, leads: [] });
      const [rows] = await redis(["MGET", ...ids.map((id) => `lead:${id}`)]);
      const leads = rows.filter(Boolean).map((r) => JSON.parse(r));
      return send(res, 200, { ok: true, leads });
    }

    if (req.method === "PATCH") {
      const { id, status } = await readBody(req);
      if (!id || !STATUSES.includes(status)) return send(res, 400, { ok: false, error: "invalid" });
      const [raw] = await redis(["GET", `lead:${id}`]);
      if (!raw) return send(res, 404, { ok: false, error: "not_found" });
      const lead = { ...JSON.parse(raw), status, updatedAt: new Date().toISOString() };
      await redis(["SET", `lead:${id}`, JSON.stringify(lead)]);
      return send(res, 200, { ok: true, lead });
    }

    if (req.method === "DELETE") {
      const id = new URL(req.url, "http://x").searchParams.get("id");
      if (!id) return send(res, 400, { ok: false, error: "invalid" });
      await redis(["DEL", `lead:${id}`], ["ZREM", "leads", id]);
      return send(res, 200, { ok: true });
    }

    return send(res, 405, { ok: false, error: "method_not_allowed" });
  } catch (err) {
    console.error("[api/leads]", err);
    return send(res, 500, { ok: false, error: "storage_error" });
  }
}
