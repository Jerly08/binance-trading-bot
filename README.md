# Binance Trading Bot

Aplikasi bot trading untuk Binance yang menerima sinyal dari TradingView, mengevaluasi strategi trading berdasarkan indikator DMI/ADX, dan mensimulasikan order dengan pengaturan Take Profit dan Stop Loss.

## Fitur

### Frontend
- Form konfigurasi untuk parameter strategi:
  - Symbol (default: BTCUSDT)
  - Timeframe (default: 5m)
  - +DI Threshold (default: 25)
  - -DI Threshold (default: 20)
  - ADX Minimum (default: 20)
  - Take Profit % (default: 2%)
  - Stop Loss % (default: 1%)
  - Leverage (default: 10x)
- Tampilan konfigurasi aktif
- Tombol reset konfigurasi
- Tampilan riwayat order simulasi

### Backend
- API Endpoints:
  - `GET /api/config`: Mengambil konfigurasi saat ini
  - `POST /api/config`: Memperbarui konfigurasi
  - `POST /api/config/reset`: Reset konfigurasi ke default
  - `GET /api/orders`: Mengambil semua order simulasi
  - `POST /api/orders/reset`: Menghapus semua order
  - `POST /api/webhook`: Memproses sinyal TradingView
  - `GET /api/health`: Health check

## Strategi Trading DMI/ADX

Bot ini menggunakan indikator DMI (Directional Movement Index) yang terdiri dari:

- **+DI**: Positive Directional Indicator, mengukur kekuatan pergerakan harga ke atas
- **-DI**: Negative Directional Indicator, mengukur kekuatan pergerakan harga ke bawah  
- **ADX**: Average Directional Index, mengukur kekuatan trend terlepas dari arahnya

### Logika Trading:

1. **BUY** ketika:
   - +DI > +DI threshold
   - -DI < -DI threshold
   - ADX > ADX minimum

2. **SELL** ketika kondisi sebaliknya terpenuhi.

## Struktur Proyek

```
/
├── data/                    # Penyimpanan data lokal
│   ├── config.json          # File konfigurasi strategi
│   └── orders.json          # Riwayat order simulasi
├── frontend/                # Aplikasi React frontend
├── src/                     # Kode source backend
│   ├── config/              # Konfigurasi aplikasi
│   ├── controllers/         # Controller untuk menangani HTTP requests
│   ├── models/              # Model untuk interaksi dengan data
│   ├── routes/              # Definisi API routes
│   ├── services/            # Business logic & integrasi pihak ketiga
│   ├── utils/               # Utility functions
│   └── server.js            # Entry point server
├── .env                     # Variabel lingkungan (tidak masuk git)
├── .env.example             # Contoh variabel lingkungan
├── index.js                 # Entry point aplikasi
├── package.json             # Dependencies & scripts
└── README.md                # Dokumentasi
```

## Instalasi

1. Clone repository:
   ```
   git clone <repository_url>
   cd binance-trading-bot
   ```

2. Install dependencies:
   ```
   npm install
   cd frontend && npm install && cd ..
   ```

3. Buat file `.env` di root directory dengan API keys Binance:
   ```
   PORT=5000
   NODE_ENV=development
   BINANCE_API_KEY=your_binance_api_key
   BINANCE_API_SECRET=your_binance_api_secret
   ```

4. Jalankan aplikasi dalam mode pengembangan:
   ```
   npm run dev
   ```

## Penggunaan

### Konfigurasi Strategi:
1. Buka aplikasi di http://localhost:3000
2. Isi form parameter strategi
3. Klik "Save Configuration"

### Setup Webhook TradingView:
Konfigurasikan TradingView alert untuk mengirim POST request ke endpoint webhook Anda dengan format berikut:

```json
{
  "symbol": "BTCUSDT",
  "plusDI": 27.5,
  "minusDI": 15.0,
  "adx": 25.0,
  "timeframe": "5m"
}
```

### Endpoints:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- TradingView Webhook: http://localhost:5000/api/webhook

## Deployment

Bot ini dapat di-deploy ke berbagai platform hosting seperti Heroku, Render, atau menggunakan VPS.

### Kebutuhan Environment Variables:
- `PORT`: Port server (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `BINANCE_API_KEY`: API Key dari Binance
- `BINANCE_API_SECRET`: API Secret dari Binance

## Deployment ke Vercel Serverless (Gratis)

Bot ini dapat dengan mudah di-deploy ke platform Vercel secara gratis dengan mengikuti langkah-langkah berikut:

1. **Persiapan Repository**:
   - Upload kode ke repository GitHub pribadi Anda

2. **Install Vercel CLI** (Opsional):
   ```
   npm install -g vercel
   ```

3. **Login ke Vercel** (Jika menggunakan CLI):
   ```
   vercel login
   ```

4. **Deploy ke Vercel**:

   **Opsi A: Menggunakan Vercel CLI**:
   ```
   vercel
   ```

   **Opsi B: Menggunakan Dashboard Vercel**:
   - Buka [vercel.com](https://vercel.com) dan login
   - Klik "New Project" dan import project dari GitHub
   - Pilih repository yang berisi kode bot
   - Konfigurasi Environment Variables (lihat di bawah)
   - Klik "Deploy"

5. **Environment Variables**:
   Tambahkan environment variables berikut di Vercel dashboard:
   - `NODE_ENV`: `production`
   - `BINANCE_API_KEY`: `your_binance_api_key`
   - `BINANCE_API_SECRET`: `your_binance_api_secret`

### Catatan Penting untuk Deployment Vercel

1. **Penyimpanan Data**: Vercel menggunakan filesystem ephemeral (tidak permanen), sehingga bot akan menyimpan data dalam memori. Data akan hilang saat instance serverless baru dimulai.

2. **Cold Start**: Fungsi serverless memiliki "cold start" yang mungkin menyebabkan sedikit penundaan saat layanan tidak aktif untuk beberapa waktu.

3. **Untuk Penggunaan Serius**: Jika Anda serius trading dengan jumlah besar, pertimbangkan untuk menggunakan database persisten seperti MongoDB Atlas (juga memiliki tier gratis) atau deploy ke VPS tradisional.

## Contoh Trading

1. **Sinyal BUY**:
   ```json
   {
     "symbol": "BTCUSDT",
     "plusDI": 30.5,
     "minusDI": 15.0,
     "adx": 25.0,
     "timeframe": "5m"
   }
   ```
   
2. **Simulasi Order**:
   ```json
   {
     "symbol": "BTCUSDT",
     "action": "BUY",
     "price_entry": "27123.12",
     "tp_price": "27665.58",
     "sl_price": "26851.89",
     "leverage": "10x",
     "timeframe": "5m",
     "timestamp": "2025-05-24T12:34:56Z"
   }
   ```

## Catatan Penting

- Bot ini hanya melakukan simulasi order, tidak melakukan order sungguhan
- Default menggunakan Binance Testnet untuk keamanan
- Harap melakukan riset sendiri dan gunakan dengan risiko sendiri

 