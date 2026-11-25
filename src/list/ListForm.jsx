import React, { useCallback, useEffect, useMemo, useState } from "react";

const KEY_STORAGE = "imuda_admin_key";

const STATUS = [
  ["baru", "Baru"],
  ["dihubungi", "Dihubungi"],
  ["demo_dijadwalkan", "Demo dijadwalkan"],
  ["selesai", "Selesai"],
  ["batal", "Batal"],
];
const STATUS_LABEL = Object.fromEntries(STATUS);

const storage = {
  get() {
    try {
      return localStorage.getItem(KEY_STORAGE) || "";
    } catch {
      return "";
    }
  },
  set(v) {
    try {
      localStorage.setItem(KEY_STORAGE, v);
    } catch {
      /* private mode: stay logged in for this tab only */
    }
  },
  clear() {
    try {
      localStorage.removeItem(KEY_STORAGE);
    } catch {
      /* ignore */
    }
  },
};

/** 0812… / +62812… / 62812… → 62812… (the format wa.me expects). */
export function toIntl(phone) {
  const digits = String(phone).replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  return digits;
}

const isMobile = (phone) => /^628\d{7,12}$/.test(toIntl(phone));

function waLink(lead) {
  const first = lead.name.split(" ")[0];
  const text =
    `Halo Kak ${first}, saya dari IMUDA. Terima kasih sudah mengisi form demo COBA untuk ${lead.business}. ` +
    `Kapan waktu yang pas untuk kami tunjukkan cara pakainya?`;
  return `https://wa.me/${toIntl(lead.phone)}?text=${encodeURIComponent(text)}`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function sourceOf(lead) {
  const c = lead.campaign || {};
  return c.utm_source ? [c.utm_source, c.utm_campaign].filter(Boolean).join(" / ") : "Langsung";
}

function toCsv(leads) {
  const head = ["Waktu", "Nama", "Bisnis", "Telepon", "Email", "Sumber", "Status"];
  const rows = leads.map((l) => [formatDate(l.createdAt), l.name, l.business, l.phone, l.email, sourceOf(l), STATUS_LABEL[l.status] || l.status]);
  return [head, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
}

const API_ERRORS = {
  storage_not_configured: "Database belum tersambung. Hubungkan Upstash Redis di Vercel (lihat README).",
  admin_password_not_set: "ADMIN_PASSWORD belum diisi di Environment Variables Vercel.",
  unauthorized: "Password salah.",
};

async function api(key, method = "GET", { body, query = "" } = {}) {
  const res = await fetch(`/api/leads${query}`, {
    method,
    headers: { "x-admin-key": key, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    const err = new Error(API_ERRORS[data.error] || `Gagal memuat data (${data.error || res.status}).`);
    err.code = data.error;
    throw err;
  }
  return data;
}

function Login({ onLogin, error, busy }) {
  const [value, setValue] = useState("");
  return (
    <main className="admin-login">
      <form
        className="form-card"
        onSubmit={(e) => {
          e.preventDefault();
          if (value) onLogin(value);
        }}
      >
        <img src="/logo-mark.png" alt="" width="44" height="44" />
        <h3>Daftar permintaan demo</h3>
        <p className="form-sub">Masukkan password admin untuk melihat data.</p>
        <div className={`field${error ? " has-error" : ""}`}>
          <label htmlFor="admin-key">Password</label>
          <input id="admin-key" type="password" autoComplete="current-password" value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
          {error && <span className="field-error">{error}</span>}
        </div>
        <button className="btn btn-primary btn-block" type="submit" disabled={busy}>
          {busy && <span className="spinner" aria-hidden="true" />}
          {busy ? "Memeriksa…" : "Masuk"}
        </button>
      </form>
    </main>
  );
}

export default function ListForm() {
  const [key, setKey] = useState(storage.get);
  const [leads, setLeads] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("semua");
  const [query, setQuery] = useState("");

  const load = useCallback(
    async (k = key) => {
      if (!k) return;
      setLoading(true);
      setError("");
      try {
        const data = await api(k);
        setLeads(data.leads);
        setKey(k);
        storage.set(k);
      } catch (err) {
        if (err.code === "unauthorized") {
          storage.clear();
          setKey("");
          setLeads(null);
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [key]
  );

  useEffect(() => {
    if (key) load(key);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function setStatus(lead, status) {
    const before = leads;
    setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    try {
      await api(key, "PATCH", { body: { id: lead.id, status } });
    } catch (err) {
      setLeads(before);
      alert(err.message);
    }
  }

  async function remove(lead) {
    if (!confirm(`Hapus permintaan dari ${lead.name} (${lead.business})?`)) return;
    try {
      await api(key, "DELETE", { query: `?id=${encodeURIComponent(lead.id)}` });
      setLeads((ls) => ls.filter((l) => l.id !== lead.id));
    } catch (err) {
      alert(err.message);
    }
  }

  function download() {
    const blob = new Blob(["﻿" + toCsv(shown)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `permintaan-demo-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const counts = useMemo(() => {
    const c = { semua: leads?.length || 0 };
    for (const [s] of STATUS) c[s] = 0;
    for (const l of leads || []) c[l.status] = (c[l.status] || 0) + 1;
    return c;
  }, [leads]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (leads || []).filter(
      (l) =>
        (filter === "semua" || l.status === filter) &&
        (!q || [l.name, l.business, l.phone, l.email].some((v) => v.toLowerCase().includes(q)))
    );
  }, [leads, filter, query]);

  if (!leads) {
    return <Login onLogin={load} error={error} busy={loading} />;
  }

  return (
    <div className="admin">
      <header className="nav">
        <div className="container nav-inner">
          <a href="/" className="brand" aria-label="IMUDA, ke halaman utama">
            <img src="/logo-mark.png" alt="" width="32" height="32" />
            <span>IMUDA</span>
          </a>
          <button className="btn btn-sm btn-ghost" onClick={() => load()} disabled={loading}>
            {loading ? "Memuat…" : "Muat ulang"}
          </button>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => {
              storage.clear();
              setKey("");
              setLeads(null);
            }}
          >
            Keluar
          </button>
        </div>
      </header>

      <main className="container admin-main">
        <div className="admin-head">
          <div>
            <h1>Permintaan demo</h1>
            <p className="muted">
              {counts.semua} total · {counts.baru} belum dihubungi
            </p>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={download} disabled={!shown.length}>
            Unduh CSV
          </button>
        </div>

        {error && <p className="form-alert">{error}</p>}

        <div className="admin-tools">
          <div className="tabs" role="tablist" aria-label="Filter status">
            {[["semua", "Semua"], ...STATUS].map(([s, label]) => (
              <button key={s} role="tab" aria-selected={filter === s} className={filter === s ? "active" : ""} onClick={() => setFilter(s)}>
                {label} <span>{counts[s] || 0}</span>
              </button>
            ))}
          </div>
          <input className="search" type="search" placeholder="Cari nama, bisnis, nomor, email" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Cari" />
        </div>

        {shown.length === 0 ? (
          <p className="empty">{counts.semua === 0 ? "Belum ada permintaan demo yang masuk." : "Tidak ada data yang cocok."}</p>
        ) : (
          <table className="leads">
            <thead>
              <tr>
                <th>Masuk</th>
                <th>Nama & bisnis</th>
                <th>Kontak</th>
                <th>Sumber</th>
                <th>Status</th>
                <th>
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {shown.map((l) => (
                <tr key={l.id} className={l.status === "baru" ? "is-new" : ""}>
                  <td className="c-date">{formatDate(l.createdAt)}</td>
                  <td className="c-name">
                    <strong>{l.name}</strong>
                    <span>{l.business}</span>
                  </td>
                  <td className="c-contact">
                    <a href={`tel:${l.phone}`}>{l.phone}</a>
                    <a href={`mailto:${l.email}`}>{l.email}</a>
                  </td>
                  <td className="c-source">{sourceOf(l)}</td>
                  <td className="c-status">
                    <select value={l.status} onChange={(e) => setStatus(l, e.target.value)} aria-label={`Status ${l.name}`} data-status={l.status}>
                      {STATUS.map(([s, label]) => (
                        <option key={s} value={s}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="c-actions">
                    {isMobile(l.phone) ? (
                      <a
                        className="btn btn-sm btn-wa"
                        href={waLink(l)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => l.status === "baru" && setStatus(l, "dihubungi")}
                      >
                        Chat WhatsApp
                      </a>
                    ) : (
                      <a className="btn btn-sm btn-ghost" href={`tel:${l.phone}`}>
                        Telepon
                      </a>
                    )}
                    <button className="link-danger" onClick={() => remove(l)} aria-label={`Hapus ${l.name}`}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
