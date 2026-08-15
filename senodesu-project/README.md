# Senodesu - Personal Branding Website

Senodesu adalah platform pembelajaran dengan dashboard admin untuk mengelola sumber daya tentang Jepang.

## 🎯 Fitur

- **Minimalist Design** - Typography dan layout yang clean dan modern
- **Multilingual Support** - Bahasa Indonesia, English, dan Jepang
- **Admin Dashboard** - Kelola resources tanpa coding
- **Database Integration** - Supabase untuk data management
- **OAuth Authentication** - Secure login untuk admin
- **Monochrome Icons** - Icon minimalis tanpa warna
- **Responsive Design** - Mobile-friendly interface
- **Motion & Animation** - Subtle animations untuk UX yang baik

## 📋 Requirements

- Node.js 16+ dan npm
- Supabase account (free tier ok)
- Google Drive untuk file storage
- Text editor atau IDE

## 🚀 Quick Start

### 1. Setup Supabase

1. Buat account di https://supabase.com
2. Create new project
3. Go ke SQL Editor dan jalankan schema dari `database/schema.sql`
4. Copy API credentials:
   - Project URL (SUPABASE_URL)
   - Anon Key (SUPABASE_ANON_KEY)

### 2. Setup Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` dan isi credentials:
```
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=5000
EMAIL_USER=senohtml@gmail.com
```

```bash
npm install
npm start
```

Server akan running di `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend
# Tidak perlu install, langsung open di browser atau local server
# Atau gunakan: python -m http.server 3000
```

Buka `http://localhost:3000` (atau buka `index.html` langsung di browser)

### 4. Setup Admin Dashboard

Backend harus running dahulu!

```bash
cd admin
# Update config.js jika API_BASE_URL berbeda
# Buka di browser: http://localhost:5000/admin/login.html
```

Login dengan credentials Supabase auth user.

## 📁 Folder Structure

```
senodesu-project/
├── frontend/           # Landing page website
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── translations.js
├── backend/            # Express.js API server
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── admin/              # Admin dashboard
│   ├── login.html
│   ├── dashboard.html
│   ├── admin-style.css
│   ├── login.js
│   ├── dashboard.js
│   └── config.js
├── database/           # Database schema
│   └── schema.sql
└── README.md           # Ini file
```

## 🔧 API Endpoints

### Resources
- `GET /api/resources` - Dapatkan semua resources
- `GET /api/resources/:id` - Dapatkan resource by ID
- `POST /api/resources` - Buat resource baru (require auth)
- `PUT /api/resources/:id` - Update resource (require auth)
- `DELETE /api/resources/:id` - Hapus resource (require auth)

### Authentication
- `POST /api/auth/signup` - Register user baru
- `POST /api/auth/signin` - Login user
- `POST /api/auth/signout` - Logout
- `GET /api/auth/me` - Get current user (require auth)

## 🛠️ Customization

### Bahasa
Edit `frontend/translations.js` untuk tambah/edit terjemahan

### Warna & Style
Edit `frontend/style.css` untuk customize warna dan font

### Admin Settings
Di admin dashboard > Settings untuk update:
- Site Title
- Site Description
- Contact Email
- Social Media Links

## 📧 Email Configuration

Update `backend/.env`:
```
EMAIL_USER=senohtml@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

Untuk Gmail: https://support.google.com/accounts/answer/185833

## 🌐 Deployment

### Option 1: Vercel (Frontend + Backend)

Frontend:
```bash
npm install -g vercel
cd frontend
vercel --prod
```

Backend:
```bash
cd backend
vercel --prod
```

### Option 2: Railway

1. Push code ke GitHub
2. Connect repo ke Railway.app
3. Add environment variables
4. Deploy!

### Option 3: Heroku

```bash
cd backend
heroku login
heroku create your-app-name
git push heroku main
```

### Option 4: Docker

```bash
docker-compose up -d
```

## 📱 Mobile Optimization

Website sudah fully responsive untuk mobile. Test di:
- Chrome DevTools (F12 > Toggle device toolbar)
- iPhone Safari
- Android Chrome

## 🔐 Security Notes

- Jangan expose SUPABASE_SERVICE_ROLE_KEY ke frontend
- Gunakan SUPABASE_ANON_KEY untuk frontend saja
- Enable RLS (Row Level Security) di Supabase
- Validate semua input di backend

## 🐛 Troubleshooting

**Error: Cannot connect to backend**
- Pastikan backend running: `npm start` di folder backend
- Check CORS settings di backend/server.js

**Admin login tidak bisa**
- Pastikan user sudah terdaftar di Supabase Auth
- Check email & password benar
- Lihat browser console untuk error details

**Resources tidak load**
- Check backend is running
- Pastikan database schema sudah dijalankan
- Check Supabase API keys di .env

**Styling hilang**
- Clear browser cache (Ctrl+Shift+Del)
- Pastikan CSS file path benar

## 📞 Support

Email: senohtml@gmail.com
TikTok: @senodesuu
Instagram: @agil.dss

## 📝 License

MIT License - Bebas untuk commercial atau personal use

## 🎉 Credits

Dibuat dengan ❤️ untuk Senodesu Platform
