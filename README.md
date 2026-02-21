# KasRapi Web Admin ☕

> SaaS Point of Sales (POS) Modern & Minimalis untuk Pengelola Kafe Kekinian.

KasRapi adalah platform manajemen kafe komprehensif yang dirancang untuk membantu pemilik bisnis mengelola operasional harian dengan lebih tenang, efisien, dan modern. Dari manajemen inventaris hingga sistem kasir yang terintegrasi dengan pembayaran digital.

## ✨ Key Features

- **Multi-tenant Dashboard**: Kelola beberapa cabang toko dalam satu akun Juragan.
- **Real-time Stock Tracking**: Pemantauan stok otomatis dengan indikator stok rendah.
- **Advanced POS System**: Antarmuka kasir yang cepat, responsif, dan mudah digunakan.
- **Midtrans Integration**: Mendukung pembayaran digital (QRIS, VA, E-Wallet) melalui Midtrans Snap.
- **Hardened Security**: Implementasi idempotency keys untuk mencegah transaksi ganda dan enkripsi data sensitif.
- **Responsive Design**: Optimal untuk penggunaan di tablet maupun desktop.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **UI Components**: [Lucide React](https://lucide.dev/) & Custom Premium UI
- **Data Fetching**: [SWR](https://swr.vercel.app/) & [Axios](https://axios-http.com/)
- **Validation**: [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Backend KasRapi yang sudah berjalan

### Installation

1. Clone repositori:
   ```bash
   git clone https://github.com/your-username/kasrapi-web-admin.git
   cd kasrapi-web-admin
   ```

2. Install dependensi:
   ```bash
   npm install
   ```

3. Konfigurasi Environment:
   Buat file `.env.local` dan lengkapi variabel berikut:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_client_key
   ```

4. Jalankan aplikasi:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `src/app/`: Routing dan halaman utama (Dashboard, POS, Menu, Auth).
- `src/components/`: Komponen UI yang reusable (Layout, Auth, POS).
- `src/store/`: State management menggunakan Zustand (Auth Store, POS Store).
- `src/lib/`: Utilitas, konfigurasi API, dan helper functions.
- `src/hooks/`: Custom hooks untuk autentikasi dan fungsionalitas lainnya.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ for Indonesian Coffee Shop Owners.
