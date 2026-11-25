# IMUDA · Landing page COBA (Cross-platform Bot Assistant)

Landing page + form permintaan demo COBA, dipakai untuk iklan Instagram.
React 18 + Vite, tanpa backend. Warna mengikuti logo IMUDA (navy `#22255A`, biru `#4A9CDC`),
font Bricolage Grotesque (judul) dan Plus Jakarta Sans (teks), keduanya SIL OFL.

## Menjalankan

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # hasil statis di dist/, bisa di-deploy ke Vercel / Netlify / hosting statis apa pun
```

## Form demo → email

Form mengirim nama lengkap, nama bisnis, no. WhatsApp/telepon, dan email ke
**industrianakmudaindonesia@gmail.com** lewat [FormSubmit](https://formsubmit.co) (gratis, tanpa akun).

Form dikirim sebagai form post biasa (`no-cors`), karena balasan FormSubmit kadang diblokir browser (CORS)
walaupun emailnya terkirim. Akibatnya halaman tidak bisa membaca balasan server: "terkirim" artinya data sudah
sampai ke FormSubmit, dan "belum terkirim" hanya muncul kalau koneksinya gagal.

1. **Aktivasi sekali:** setelah situs online, kirim satu form percobaan. FormSubmit mengirim email
   "Activate Form" ke inbox di atas. Klik tombol aktivasinya. Sebelum diaktifkan, isian form belum diteruskan.
2. Setelah aktif, setiap isian masuk sebagai email dengan subjek
   `Permintaan demo COBA: <bisnis> (<nama>)`. Tombol Reply langsung membalas ke email pengisi.
3. Email juga mencantumkan **Sumber** (`utm_source` / `utm_campaign` dari link iklan), jadi kelihatan
   lead mana yang datang dari Instagram.
4. Opsional: FormSubmit mengirim alias acak setelah aktivasi. Isi sebagai `VITE_FORM_EMAIL` agar alamat
   email asli tidak terlihat di source halaman.

## Daftar permintaan demo: /list-form

Setiap isian form juga disimpan ke database dan tampil sebagai tabel di **`/list-form`**
(contoh: `https://iamindonesia.site/list-form`, file `list-form.html` dengan `cleanUrls` di `vercel.json`), dilindungi password.

- Filter per status (Baru, Dihubungi, Demo dijadwalkan, Selesai, Batal), pencarian, unduh CSV.
- Tombol **Chat WhatsApp** membuka `wa.me` dengan pesan pembuka; status "Baru" otomatis jadi "Dihubungi".
  Nomor telepon kantor (bukan HP) mendapat tombol **Telepon**.
- Email notifikasi FormSubmit tetap dikirim dan berisi link ke halaman ini.

Penyiapan di Vercel (sekali):

1. **Storage → Create Database → Upstash for Redis** (paket gratis), lalu **Connect** ke project ini.
   Vercel otomatis menambahkan `KV_REST_API_URL` dan `KV_REST_API_TOKEN`.
2. **Settings → Environment Variables:** tambah `ADMIN_PASSWORD` (password untuk membuka `/list-form`).
3. **Redeploy** supaya variabel baru terbaca.

API (Vercel Functions di `api/`):

| Endpoint | Fungsi |
| --- | --- |
| `POST /api/demo` | Simpan isian form (maks 5 per IP per 10 menit) |
| `GET /api/leads` | Daftar permintaan, butuh header `x-admin-key` |
| `PATCH /api/leads` | Ubah status `{ id, status }` |
| `DELETE /api/leads?id=…` | Hapus (spam / data uji) |

Form dianggap terkirim kalau salah satu berhasil: tersimpan ke database **atau** email terkirim.

## Iklan Instagram

- Pakai link dengan UTM, misalnya:
  `https://<domain>/?utm_source=instagram&utm_medium=paid&utm_campaign=demo_coba`
- Di HP, form langsung tampil setelah judul. Tombol "Jadwalkan demo" menempel di bawah layar setelah form terlewati.
- Meta Pixel (opsional): isi `VITE_META_PIXEL_ID` saat build. Halaman mengirim `PageView`, dan event `Lead`
  setiap form berhasil terkirim, sehingga iklan bisa dioptimalkan untuk lead.

## Variabel lingkungan (opsional)

| Variabel | Fungsi |
| --- | --- |
| `VITE_FORM_EMAIL` | Tujuan FormSubmit (email atau alias acak). Default: industrianakmudaindonesia@gmail.com |
| `VITE_META_PIXEL_ID` | ID Meta Pixel untuk tracking iklan Instagram/Facebook |
| `ADMIN_PASSWORD` | Wajib untuk `/list-form`. Password admin |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Diisi otomatis oleh integrasi Upstash Redis di Vercel |
