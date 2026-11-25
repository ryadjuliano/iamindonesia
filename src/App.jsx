import React, { useEffect, useState } from "react";
import DemoForm from "./components/DemoForm.jsx";
import Icon from "./components/Icon.jsx";

const FEATURE_GROUPS = [
  {
    title: "Membalas",
    text: "Chat masuk tidak lagi menunggu admin online.",
    items: [
      ["AI auto-reply WhatsApp", "Menjawab harga, jam buka, dan promo dari Knowledge Base bisnis Anda. Komplain atau pertanyaan sulit diteruskan ke tim."],
      ["Inbox bersama", "Semua chat di satu dashboard. Tim bisa ambil alih dari AI kapan saja, lalu serahkan lagi."],
    ],
  },
  {
    title: "Menjual lagi",
    text: "Customer lama datang lagi tanpa Anda kirim pesan satu per satu.",
    items: [
      ["Broadcast", "Kirim promo ke semua customer, per tag, atau yang lama tidak aktif. Dikirim bertahap, ada laporan terkirim, dibaca, dan dibalas."],
      ["Automation", "Pesan otomatis untuk lead baru, ulang tahun, membership hampir habis, dan member yang lama tidak datang."],
      ["Loyalty", "Poin, kartu stempel, dan voucher. Saldo poin bisa langsung disisipkan di pesan."],
      ["Meta Ads", "Pantau campaign Facebook dan Instagram, dan buat konten iklan dengan bantuan AI."],
    ],
  },
  {
    title: "Memantau",
    text: "Angka bisnis sampai ke HP Anda tanpa buka laptop.",
    items: [
      ["Bot laporan WhatsApp", "Ketik \"laporan hari ini\" ke nomor toko: omzet, cek member, dan membership yang akan habis."],
      ["AI Agents + Telegram", "Laporan harian dan rangkuman chat dikirim ke grup Telegram. Tanya data dengan /tanya."],
    ],
  },
];

const INDUSTRIES = [
  ["Gym & fitness", "Cek status membership otomatis, pengingat perpanjangan, sapaan untuk member yang lama tidak datang."],
  ["Cafe & resto", "Jawab pertanyaan menu dan jam buka, broadcast promo, loyalty untuk pelanggan tetap."],
  ["Internet / ISP", "Tangani pertanyaan pelanggan di WhatsApp, kirim pengingat lewat automation."],
  ["Retail", "Satu inbox untuk chat penjualan, broadcast produk baru, poin untuk pelanggan setia."],
];

const STEPS = [
  ["Isi form", "Nama, bisnis, nomor WhatsApp, dan email. Satu menit selesai."],
  ["Kami hubungi", "Tim IMUDA menghubungi lewat WhatsApp atau email untuk atur jadwal."],
  ["Demo", "Kami tunjukkan cara pakai Omni sesuai alur bisnis Anda."],
];

const FAQS = [
  ["Apakah perlu ganti nomor WhatsApp?", "Tidak. Nomor WhatsApp bisnis yang sudah ada dihubungkan ke Omni dengan scan QR, sama seperti WhatsApp Web."],
  ["Bagaimana kalau AI tidak tahu jawabannya?", "AI hanya menjawab dari informasi yang Anda isi di Knowledge Base. Kalau jawabannya tidak ada, atau customer minta bicara dengan staf, chat diteruskan ke tim Anda."],
  ["Bisa terhubung dengan sistem yang sudah saya pakai?", "Omni bisa membaca data dari sistem bisnis Anda lewat API, misalnya data member dan check-in gym. Detailnya kita bahas saat demo."],
  ["Apakah tim saya bisa pakai bersama?", "Bisa. Ada peran owner, admin, marketing, dan agent/CS dengan akses menu masing-masing. Dashboard juga nyaman dipakai dari HP."],
];

function scrollToForm(e) {
  e?.preventDefault();
  const el = document.getElementById("demo");
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => document.getElementById("demo-name")?.focus({ preventScroll: true }), 500);
}

function Brand() {
  return (
    <a href="#top" className="brand" aria-label="IMUDA, ke atas">
      <img src="/logo-mark.png" alt="" width="36" height="36" />
      <span>IMUDA</span>
    </a>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    ["#fitur", "Fitur"],
    ["#industri", "Untuk siapa"],
    ["#cara", "Cara demo"],
    ["#faq", "FAQ"],
  ];
  return (
    <header className="nav">
      <div className="container nav-inner">
        <Brand />
        <nav className={`nav-links${open ? " open" : ""}`} aria-label="Navigasi utama">
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <a href="#demo" className="btn btn-primary btn-sm nav-cta" onClick={(e) => { setOpen(false); scrollToForm(e); }}>
          Jadwalkan demo
        </a>
        <button
          className="nav-toggle"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
    </header>
  );
}

function ChatMock() {
  return (
    <div className="chat-mock" aria-label="Contoh percakapan WhatsApp yang dijawab AI Omni">
      <div className="chat-head">
        <img src="/logo-mark.png" alt="" width="32" height="32" />
        <div>
          <strong>Bugar Fitness</strong>
          <span>AI aktif · membalas otomatis</span>
        </div>
      </div>
      <div className="chat-body">
        <p className="msg in">Kak, membership saya sampai kapan ya?</p>
        <p className="msg out">
          Halo Kak Rina! Paket 3 bulan Kakak aktif sampai 12 Desember 2026, sisa 17 hari. Check-in
          terakhir kemarin di cabang Kemang 💪
          <span className="msg-tag">Dijawab AI</span>
        </p>
        <p className="msg in">Kalau perpanjang 3 bulan berapa?</p>
        <p className="msg out">
          Perpanjangan 3 bulan Rp1.050.000 ya Kak. Mau sekalian saya bantu sambungkan ke tim untuk
          pembayaran?
          <span className="msg-tag">Dijawab AI</span>
        </p>
      </div>
      <p className="chat-caption">Contoh tampilan</p>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="kicker">Omni Automation, dari IMUDA</p>
          <h1>
            Customer chat jam 11 malam? <span className="mark">Omni yang balas.</span>
          </h1>
          <p className="lead">
            AI yang menjawab WhatsApp bisnis Anda dari data Anda sendiri, plus inbox tim, broadcast,
            dan automation di satu dashboard.
          </p>
        </div>
        <div className="hero-form" id="demo">
          <DemoForm />
        </div>
        <div className="hero-extra">
          <ul className="hero-points">
            <li>Pakai nomor WhatsApp yang sudah ada</li>
            <li>AI hanya menjawab dari data bisnis Anda</li>
            <li>Tim bisa ambil alih chat kapan saja</li>
          </ul>
          <ChatMock />
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="section" id="fitur">
      <div className="container">
        <h2 className="section-title">Apa yang dikerjakan Omni</h2>
        {FEATURE_GROUPS.map((g) => (
          <div className="group" key={g.title}>
            <div className="group-head">
              <h3>{g.title}</h3>
              <p>{g.text}</p>
            </div>
            <dl className="group-items">
              {g.items.map(([title, text]) => (
                <div className="item" key={title}>
                  <dt>{title}</dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}

function Industries() {
  return (
    <section className="section section-alt" id="industri">
      <div className="container">
        <h2 className="section-title">Cocok untuk bisnis yang ramai chat</h2>
        <div className="industries">
          {INDUSTRIES.map(([title, text]) => (
            <div className="industry" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section className="section" id="cara">
      <div className="container">
        <h2 className="section-title">Cara dapat demo</h2>
        <ol className="steps">
          {STEPS.map(([title, text], i) => (
            <li key={title}>
              <span className="step-num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="section section-alt" id="faq">
      <div className="container faq-grid">
        <h2 className="section-title">Pertanyaan umum</h2>
        <div className="faq">
          {FAQS.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span className="faq-sign" aria-hidden="true" />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="cta">
      <div className="container cta-inner">
        <div>
          <h2>Lihat Omni membalas chat customer Anda.</h2>
          <p>Isi form, kami atur jadwalnya.</p>
        </div>
        <a href="#demo" className="btn btn-light" onClick={scrollToForm}>
          Jadwalkan demo
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <Brand />
        <a href="mailto:industrianakmudaindonesia@gmail.com">industrianakmudaindonesia@gmail.com</a>
        <p className="muted">© {new Date().getFullYear()} IMUDA · Iam Indonesia</p>
      </div>
    </footer>
  );
}

function StickyCta() {
  // Mobile only (CSS): appears once the demo form has scrolled out of view.
  const [show, setShow] = useState(false);
  useEffect(() => {
    const form = document.getElementById("demo");
    if (!form || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => {
      setShow(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(form);
    return () => io.disconnect();
  }, []);
  return (
    <a href="#demo" className={`sticky-cta${show ? " show" : ""}`} onClick={scrollToForm} tabIndex={show ? 0 : -1}>
      Jadwalkan demo
    </a>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Industries />
        <Steps />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyCta />
    </>
  );
}
