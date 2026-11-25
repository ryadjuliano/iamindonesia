import React, { useState } from "react";
import { submitDemoRequest } from "../lib/submitDemo.js";
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
  if (!/^(\+62|62|0)8\d{7,12}$/.test(phone)) errors.phone = "Contoh: 0812 3456 7890";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) errors.email = "Contoh: nama@bisnis.com";
  return errors;
}

export default function DemoForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [honey, setHoney] = useState("");

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  async function onSubmit(e) {
    e.preventDefault();
    if (honey) return; // bots fill the hidden field
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`demo-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      await submitDemoRequest({
        name: values.name.trim(),
        business: values.business.trim(),
        phone: normalisePhone(values.phone),
        email: values.email.trim().toLowerCase(),
      });
      trackLead();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="form-card form-done" role="status">
        <div className="done-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="28" height="28"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
        <h3>Terima kasih, {values.name.split(" ")[0]}!</h3>
        <p>
          Permintaan demo untuk <strong>{values.business}</strong> sudah kami terima. Tim IMUDA akan
          menghubungi Anda lewat WhatsApp atau email untuk mengatur jadwal demo.
        </p>
      </div>
    );
  }

  const field = (key, label, props) => (
    <div className={`field${errors[key] ? " has-error" : ""}`}>
      <label htmlFor={`demo-${key}`}>{label}</label>
      <input
        id={`demo-${key}`}
        name={key}
        value={values[key]}
        onChange={set(key)}
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
    <form className="form-card" onSubmit={onSubmit} noValidate>
      <h3>Jadwalkan demo Omni</h3>
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

      <input
        type="text"
        name="_honey"
        className="hp"
        tabIndex={-1}
        autoComplete="off"
        value={honey}
        onChange={(e) => setHoney(e.target.value)}
        aria-hidden="true"
      />

      <button className="btn btn-primary btn-block" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Mengirim…" : "Minta jadwal demo"}
      </button>

      {status === "error" && (
        <p className="form-alert" role="alert">
          Gagal mengirim. Periksa koneksi internet lalu coba lagi, atau email kami di{" "}
          <a href="mailto:industrianakmudaindonesia@gmail.com">industrianakmudaindonesia@gmail.com</a>.
        </p>
      )}
      <p className="form-note">Data Anda hanya dipakai untuk menghubungi Anda soal demo.</p>
    </form>
  );
}
