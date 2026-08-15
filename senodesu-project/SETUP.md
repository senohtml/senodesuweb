# Senodesu Setup Guide

## 🎯 Step-by-Step Setup

### Step 1: Clone/Extract Project
```bash
# Extract project zip
unzip senodesu-project.zip
cd senodesu-project
```

### Step 2: Setup Supabase Database

1. **Buat Supabase Account**
   - Pergi ke https://supabase.com
   - Sign up dengan email
   - Create new project
   - Tunggu sampai project selesai dibuat (5-10 menit)

2. **Copy Credentials**
   - Buka Project Settings
   - Copy:
     - Project URL (Project > API > Project URL)
     - Anon Key (Project > API > Project API keys > anon)
     - Service Role Key (Project > API > Project API keys > service_role)

3. **Run Database Schema**
   - Buka SQL Editor di Supabase dashboard
   - Copy paste semua code dari `database/schema.sql`
   - Click "Run"
   - Database tables berhasil dibuat!

### Step 3: Setup Backend

```bash
# Navigate to backend folder
cd backend

# Copy environment template
cp .env.example .env

# Edit .env dengan editor favorit
# Isi dengan Supabase credentials:
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
# EMAIL_USER=senohtml@gmail.com

# Install dependencies
npm install

# Start server
npm start
```

Expected output:
```
Server running on http://localhost:5000
Supabase connected: true
```

### Step 4: Setup Frontend

**Option A: Direct Browser (Recommended for Testing)**
```bash
cd frontend
# Buka index.html langsung di browser
# Atau gunakan: python -m http.server 3000
# Kemudian buka: http://localhost:3000
```

**Option B: Local Server**
```bash
cd frontend
# Install http-server (jika belum)
npm install -g http-server

# Start server
http-server . -p 3000 --cors
```

Buka http://localhost:3000 di browser

### Step 5: Setup Admin Dashboard

**Buat Admin User di Supabase:**
1. Buka Supabase dashboard
2. Go to Authentication > Users
3. Click "Invite user"
4. Isi email (contoh: admin@senodesu.com)
5. Supabase akan send invitation email
6. Buka link di email, set password
7. Admin user berhasil dibuat!

**Access Admin Dashboard:**
1. Pastikan backend running (`npm start` di folder backend)
2. Buka browser: http://localhost:5000/admin/login.html
3. Login dengan email dan password yang tadi dibuat
4. Dashboard akan load!

### Step 6: Add Resources

Di Admin Dashboard:
1. Click "+ Add Resource"
2. Isi form:
   - Title
   - Description
   - Category (pilih dari dropdown)
   - Link (optional)
   - Google Drive Link
3. Click "Save"
4. Resource akan muncul di landing page!

## 🌐 Domain Setup (senodesu.my.id)

### 1. Point Domain ke Server
Di registrar domain (.my.id):
1. Go to DNS settings
2. Tambah A record:
   - Host: @ (atau your-domain)
   - Points to: Your server IP
   - TTL: 3600

### 2. Setup SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d senodesu.my.id

# Update nginx.conf dengan certificate path
# Uncomment HTTPS section di nginx.conf
```

### 3. Deploy to Production
Option A: Docker (Recommended)
```bash
# Update .env di root dengan production values
# Build and run
docker-compose up -d
```

Option B: Manual
```bash
# Backend
cd backend
npm install --production
npm start

# Frontend (in another terminal)
cd frontend
http-server . -p 3000
```

## 🚀 Deployment Options

### Option 1: Vercel (Recommended for Frontend)

**Frontend Deployment:**
```bash
npm install -g vercel
cd frontend
vercel --prod
```

**Backend Deployment (dengan Vercel):**
```bash
cd backend
vercel --prod
```

### Option 2: Railway

1. Buka https://railway.app
2. Connect GitHub repository
3. Add environment variables
4. Deploy!

### Option 3: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create senodesu-app

# Add buildpack
heroku buildpacks:add heroku/nodejs -a senodesu-app

# Push code
git push heroku main

# View logs
heroku logs --tail -a senodesu-app
```

### Option 4: DigitalOcean/VPS

```bash
# SSH ke server
ssh root@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone project
git clone your-repo-url
cd senodesu-project

# Setup env
cp .env.example .env
# Edit .env dengan production values

# Install PM2 untuk manage process
sudo npm install -g pm2

# Start backend with PM2
cd backend
npm install
pm2 start server.js --name "senodesu-backend"
pm2 startup
pm2 save

# Setup frontend with Nginx
sudo apt-get install nginx
# Copy frontend files ke /var/www/senodesu
# Configure nginx (lihat nginx.conf)
```

## ✅ Verification Checklist

- [ ] Supabase account created dan database schema running
- [ ] Backend running di http://localhost:5000
- [ ] Frontend accessible di http://localhost:3000
- [ ] Admin dashboard login working
- [ ] Can create/edit/delete resources dari dashboard
- [ ] Resources muncul di landing page
- [ ] All 3 languages (ID, EN, JP) working
- [ ] Monochrome icons showing correctly
- [ ] Mobile responsive working
- [ ] Social links correct (TikTok, Instagram)

## 🐛 Common Issues & Solutions

### Issue: Backend tidak connect ke Supabase
**Solution:**
- Check .env file credentials benar
- Verify Supabase project active
- Check firewall/network restrictions
- Restart backend: `npm start`

### Issue: Admin login gagal
**Solution:**
- Pastikan user dibuat di Supabase Auth
- Password benar
- Check browser console untuk error details
- Verify backend running

### Issue: Resources tidak load di frontend
**Solution:**
- Ensure backend running
- Check API URL di script.js benar
- Verify database punya data
- Open browser console untuk error

### Issue: CORS errors
**Solution:**
- Check cors package di backend installed
- Verify API_BASE_URL di frontend config
- Restart both frontend dan backend

### Issue: Styling / CSS tidak muncul
**Solution:**
- Clear browser cache (Ctrl+Shift+Del)
- Check CSS file path di HTML
- Restart http-server
- Try different browser

## 📞 Getting Help

- Check browser console (F12) untuk error messages
- Check backend logs (terminal dimana npm start)
- Read error messages carefully
- Google error message
- Email: senohtml@gmail.com

## 🎉 Next Steps

1. **Customize Content**
   - Edit translations di `frontend/translations.js`
   - Add your resources di admin dashboard
   - Update settings dengan info kamu

2. **Deploy ke Production**
   - Choose deployment platform
   - Follow step-by-step di atas
   - Setup domain pointing
   - Test di production

3. **Promote**
   - Share link di TikTok (@senodesuu)
   - Share di Instagram (@agil.dss)
   - Add to bio
   - Regular updates dengan resources baru

Happy coding! 🚀
