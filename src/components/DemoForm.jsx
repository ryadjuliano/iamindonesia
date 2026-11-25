import React, { useEffect, useRef, useState } from "react";
import { submitDemoRequest, CONTACT_EMAIL } from "../lib/submitDemo.js";
import { trackLead } from "../lib/metaPixel.js";

const EMPTY = { name: "", business: "", phone: "", email: "" };

function normalisePhone(raw) {
  return raw.replace(/[\s\-().]/g, "");
}

function validate(v) {
  const errors = {};
  if (v.name.trim().length < 3) errors.name = "Tulis nama lengkap Anda.";
  if (v.business.trim().length < 2) errors.business = "Tulis nama bisnis Anda.";
  const phone = normalisePhone(v.phone);
  // Mobile (08…, 628…, +628…) or landline (021…, 0274…).
  if (!/^(\+62|62|0)[2-9]\d{6,12}$/.test(phone)) errors.phone = "Contoh: 0812 3456 7890 atau 021 1234 5678";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) errors.email = "Contoh: nama@bisnis.com";
  return errors;
}

const ERROR_TEXT = {
  activation:
    "Formulir belum aktif, jadi data belum terkirim. Pemilik situs perlu klik tombol \"Activate Form\" di email dari FormSubmit.",
  timeout: "Server terlalu lama merespons. Data belum terkirim, silakan coba lagi.",
  network: "Tidak bisa terhubung ke server. Periksa koneksi internet, lalu coba lagi.",
  rejected: "Data belum terkirim karena ada gangguan di server. Silakan coba lagi.",
};

export default function DemoForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorKind, setErrorKind] = useState(null);
  const resultRef = useRef(null);

  // Bring the outcome (thank-you card or error) into view so it is never missed on a phone.
  useEffect(() => {
    if (status === "sent" || status === "error") {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      resultRef.current?.focus({ preventScroll: true });
    }
  }, [status]);

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (status === "sending") return;
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`demo-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setStatus("sending");
    setErrorKind(null);
    try {
      await submitDemoRequest({
        name: values.name.trim(),
        business: values.business.trim(),
        phone: normalisePhone(values.phone),
        email: values.email.trim().toLowerCase(),
      });
      trackLead();
      setStatus("sent");
    } catch (err) {
      setErrorKind(err.kind || "rejected");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="form-card form-done" role="status" tabIndex={-1} ref={resultRef}>
        <div className="done-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="24" height="24"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h3>Permintaan demo terkirim</h3>
        <p>
          Terima kasih, {values.name.split(" ")[0]}. Data untuk <strong>{values.business}</strong> sudah
          kami terima. Tim IMUDA akan menghubungi Anda di <strong>{values.phone}</strong> atau{" "}
          <strong>{values.email}</strong> untuk mengatur jadwal demo.
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  const field = (key, label, props) => (
    <div className={`field${errors[key] ? " has-error" : ""}`}>
      <label htmlFor={`demo-${key}`}>{label}</label>
      <input
        id={`demo-${key}`}
        name={key}
        value={values[key]}
        onChange={set(key)}
        disabled={sending}
        aria-invalid={errors[key] ? "true" : "false"}
        aria-describedby={errors[key] ? `demo-${key}-err` : undefined}
        {...props}
      />
      {errors[key] && (
        <span className="field-error" id={`demo-${key}-err`}>
          {errors[key]}
        </span>
      )}
    </div>
  );

  return (
    <form className="form-card" onSubmit={onSubmit} noValidate aria-busy={sending}>
      <h3>Jadwalkan demo COBA</h3>
      <p className="form-sub">Isi data di bawah, tim kami akan menghubungi Anda untuk atur jadwal.</p>

      {field("name", "Nama lengkap", { autoComplete: "name", placeholder: "Nama Anda" })}
      {field("business", "Nama bisnis", { autoComplete: "organization", placeholder: "Contoh: Bugar Fitness" })}
      {field("phone", "No. WhatsApp / telepon", {
        type: "tel",
        inputMode: "tel",
        autoComplete: "tel",
        placeholder: "0812 3456 7890",
      })}
      {field("email", "Email", {
        type: "email",
        inputMode: "email",
        autoComplete: "email",
        autoCapitalize: "off",
        placeholder: "nama@bisnis.com",
      })}

      <button className="btn btn-primary btn-block" type="submit" disabled={sending}>
        {sending && <span className="spinner" aria-hidden="true" />}
        {sending ? "Mengirim data…" : "Minta jadwal demo"}
      </button>
      {sending && (
        <p className="form-progress" role="status">
          Sedang mengirim, mohon tunggu beberapa detik.
        </p>
      )}

      {status === "error" && (
        <div className="form-alert" role="alert" tabIndex={-1} ref={resultRef}>
          <strong>Belum terkirim.</strong> {ERROR_TEXT[errorKind] || ERROR_TEXT.rejected}
          <br />
          Atau kirim data Anda langsung ke{" "}
          <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Permintaan demo COBA")}`}>{CONTACT_EMAIL}</a>.
        </div>
      )}
      <p className="form-note">Data Anda hanya dipakai untuk menghubungi Anda soal demo.</p>
    </form>
  );
}
