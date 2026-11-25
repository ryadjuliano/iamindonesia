import React, { useEffect, useState } from "react";
import DemoForm from "./components/DemoForm.jsx";
import Icon from "./components/Icon.jsx";

const FEATURES = [
  {
    icon: "bot",
    title: "AI balas chat WhatsApp 24 jam",
    text: "AI menjawab pertanyaan customer dari Knowledge Base bisnis Anda: harga, jam buka, promo. Pertanyaan sulit atau komplain langsung diteruskan ke tim.",
  },
  {
    icon: "inbox",
    title: "Inbox bersama untuk tim CS",
    text: "Semua chat masuk ke satu dashboard. Tim bisa ambil alih chat dari AI kapan saja, lalu serahkan lagi setelah selesai.",
  },
  {
    icon: "megaphone",
    title: "Broadcast yang aman",
    text: "Kirim promo ke semua customer, per tag, atau yang lama tidak aktif. Dikirim bertahap per nomor, lengkap dengan laporan terkirim, dibaca, dan dibalas.",
  },
  {
    icon: "flow",
    title: "Automation marketing",
    text: "Pesan otomatis untuk lead baru, ucapan ulang tahun, membership hampir habis, atau member yang lama tidak datang.",
  },
  {
    icon: "gift",
    title: "Loyalty: poin, stempel, voucher",
    text: "Customer kumpulkan poin dari transaksi dan tukar dengan hadiah. Saldo poin bisa disisipkan langsung di pesan WhatsApp.",
  },
  {
    icon: "chart",
    title: "Bot laporan lewat WhatsApp",
    text: "Owner cukup ketik \"laporan hari ini\" ke nomor toko untuk melihat omzet, cek member, dan membership yang akan habis.",
  },
  {
    icon: "agents",
    title: "AI Agents & Telegram",
    text: "Agent AI menyusun laporan harian dan rangkuman chat, lalu mengirimnya ke grup Telegram. Tanya data langsung dengan /tanya.",
  },
  {
    icon: "ads",
    title: "Meta Ads",
    text: "Pantau campaign Facebook dan Instagram, dan buat konten iklan dengan bantuan AI dari dashboard yang sama.",
  },
];

const INDUSTRIES = [
  { icon: "dumbbell", title: "Gym & fitness", text: "Cek status membership otomatis, pengingat perpanjangan, dan sapaan untuk member yang lama tidak datang." },
  { icon: "cup", title: "Cafe & resto", text: "Jawab pertanyaan menu dan jam buka, broadcast promo, dan program loyalty untuk pelanggan tetap." },
  { icon: "wifi", title: "Internet / ISP", text: "Tangani pertanyaan pelanggan di WhatsApp dan kirim pengingat lewat broadcast dan automation." },
  { icon: "store", title: "Retail", text: "Satu inbox untuk semua chat penjualan, broadcast produk baru, dan poin untuk pelanggan setia." },
];

const STEPS = [
  { title: "Isi form demo", text: "Cukup nama, bisnis, nomor WhatsApp, dan email." },
  { title: "Kami hubungi Anda", text: "Tim IMUDA menghubungi lewat WhatsApp atau email untuk atur jadwal." },
  { title: "Lihat Omni bekerja", text: "Kami tunjukkan cara pakai Omni sesuai alur bisnis Anda." },
];

const FAQS = [
  {
    q: "Apakah perlu ganti nomor WhatsApp?",
    a: "Tidak. Nomor WhatsApp bisnis yang sudah ada dihubungkan ke Omni dengan scan QR, sama seperti WhatsApp Web.",
  },
  {
    q: "Bagaimana kalau AI tidak tahu jawabannya?",
    a: "AI hanya menjawab dari informasi yang Anda isi di Knowledge Base. Kalau jawabannya tidak ada, atau customer minta bicara dengan staf, chat diteruskan ke tim Anda.",
  },
  {
    q: "Bisa terhubung dengan sistem yang sudah saya pakai?",
    a: "Omni bisa membaca data dari sistem bisnis Anda lewat API, misalnya data member dan check-in gym. Detailnya kita bahas saat demo.",
  },
  {
    q: "Apakah tim saya bisa pakai bersama?",
    a: "Bisa. Ada peran owner, admin, marketing, dan agent/CS, masing-masing dengan akses menu sendiri. Dashboard juga nyaman dipakai dari HP.",
  },
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
          <span className="eyebrow">Omni Automation by IMUDA</span>
          <h1>
            Chat WhatsApp customer dibalas AI, <em>24 jam</em>, tanpa tambah admin.
          </h1>
          <p className="lead">
            Omni menggabungkan AI auto-reply, inbox tim, broadcast, automation, dan loyalty dalam
            satu dashboard, terhubung ke nomor WhatsApp bisnis Anda.
          </p>
        </div>
        <div className="hero-form" id="demo">
          <DemoForm />
        </div>
        <div className="hero-extra">
          <ul className="hero-points">
            {["Pakai nomor WhatsApp yang sudah ada", "AI menjawab dari data bisnis Anda", "Tim bisa ambil alih chat kapan saja"].map((t) => (
              <li key={t}>
                <Icon name="check" size={18} /> {t}
              </li>
            ))}
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
        <div className="section-head">
          <span className="eyebrow">Fitur Omni</span>
          <h2>Semua urusan chat dan marketing, di satu tempat</h2>
          <p>Dari membalas pertanyaan pertama sampai membuat customer datang lagi.</p>
        </div>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <article className="feature" key={f.title}>
              <div className="feature-icon">
                <Icon name={f.icon} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Industries() {
  return (
    <section className="section section-tint" id="industri">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Untuk siapa</span>
          <h2>Dibuat untuk bisnis yang ramai chat</h2>
        </div>
        <div className="industry-grid">
          {INDUSTRIES.map((i) => (
            <article className="industry" key={i.title}>
              <Icon name={i.icon} size={28} />
              <h3>{i.title}</h3>
              <p>{i.text}</p>
            </article>
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
        <div className="section-head">
          <span className="eyebrow">Cara demo</span>
          <h2>Tiga langkah untuk melihat Omni</h2>
        </div>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="step-num">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="section section-tint" id="faq">
      <div className="container narrow">
        <div className="section-head">
          <span className="eyebrow">FAQ</span>
          <h2>Pertanyaan yang sering ditanyakan</h2>
        </div>
        <div className="faq">
          {FAQS.map((f) => (
            <details key={f.q}>
              <summary>
                {f.q}
                <Icon name="chevron" size={20} />
              </summary>
              <p>{f.a}</p>
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
        <h2>Siap melihat Omni membalas chat customer Anda?</h2>
        <a href="#demo" className="btn btn-light" onClick={scrollToForm}>
          Jadwalkan demo sekarang
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <img src="/logo.png" alt="IMUDA" width="96" height="73" />
        <div>
          <p>
            <strong>IMUDA</strong> · Iam Indonesia
          </p>
          <p>
            <a href="mailto:industrianakmudaindonesia@gmail.com">industrianakmudaindonesia@gmail.com</a>
          </p>
          <p className="muted">© {new Date().getFullYear()} IMUDA. Hak cipta dilindungi.</p>
        </div>
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
