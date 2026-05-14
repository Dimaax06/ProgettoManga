# 🔥 DiMangaX — Next-Generation Anime & Manga Platform

A cinematic, immersive anime & manga community platform built with React, Node.js, and MySQL.

---

## ✨ Features

- **Cinematic Dark UI** — Anime-inspired design with neon red/purple glow effects, particle animations, and manga panel aesthetics
- **Hero Section** — Animated slideshow with featured manga, cinematic backgrounds, and smooth transitions
- **Manga Catalog** — Browse, search, filter by genre/status, sort by rating/popularity
- **Review System** — Star ratings (1–5), written reviews, edit & delete
- **Favorites** — Personal collection with one-click add/remove
- **User Profiles** — Edit bio, view review history, see statistics
- **Admin Panel** — Full dashboard with stats, manga CRUD, user management (ban/promote)
- **Authentication** — JWT-based secure auth with bcrypt (cost 12) password hashing
- **Auto-setup** — Database, schema and seed data are created automatically on first run
- **Responsive** — Mobile-first, fully responsive on all screen sizes
- **Animations** — Framer Motion page transitions, hover effects, loading screens

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS, Framer Motion |
| Backend | Node.js, Express |
| Database | MySQL 8 |
| Auth | JWT + bcryptjs (cost 12) |
| Security | Helmet, CORS, express-rate-limit |
| HTTP | Axios |

---

## 🚀 Quick Start (3 steps)

### Prerequisites
- Node.js 18+
- MySQL 8.0+ running locally

### 1. Configure Backend
```bash
cd backend
cp .env.example .env
# Edit .env — set DB_USER, DB_PASSWORD to match your local MySQL.
# JWT_SECRET will fall back to an insecure dev key if missing (with warning).
npm install
npm run dev
```

> The backend will **auto-create** the `dimangax` database, all tables, and **auto-seed 15 manga + demo accounts** on first run. No manual `mysql` commands needed.

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Open the app
- App → http://localhost:5173
- API → http://localhost:5000/api/health (should return `{"status":"ok"}`)

---

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@dimangax.com` | `admin123` |
| User | `demo@dimangax.com` | `demo123` |

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| **"Cannot connect to the server"** | Backend not running. Run `npm run dev` in `/backend`. |
| **"Database unavailable"** | MySQL not running or credentials in `.env` are wrong. |
| **No manga showing up** | Restart the backend — it auto-seeds 15 manga if the DB is empty. |
| **"Invalid email or password"** | Use the demo accounts above, or register a new one. |
| **JWT errors after restart** | Clear browser localStorage and log in again. |

---

## 🔒 Security Notes

- Passwords are hashed with bcrypt at cost 12
- JWT tokens expire in 7 days
- Rate limiting: 500 req/15min general, 30 req/15min on auth endpoints
- All inputs are validated and sanitized
- SQL queries use parameterized statements (no string interpolation)
- Helmet provides default HTTP security headers
- CORS is configured for `localhost:5173` only by default
- Admin actions require both `auth` AND `admin` role checks

For production:
1. Generate a strong `JWT_SECRET`: `openssl rand -hex 64`
2. Set `NODE_ENV=production` (hides stack traces in errors)
3. Set `CORS_ORIGIN` to your production domain
4. Use HTTPS only

---

## 📁 Project Structure

```
ProgettoManga/
├── backend/
│   ├── src/
│   │   ├── config/        # Database pool + auto-init
│   │   ├── controllers/   # Auth, manga, review, favorites, admin
│   │   ├── middleware/    # auth (JWT) + admin guards
│   │   └── routes/        # REST endpoints
│   ├── database/
│   │   ├── schema.sql     # Idempotent (CREATE TABLE IF NOT EXISTS)
│   │   └── seed.sql       # 15 manga + demo accounts
│   ├── server.js          # Startup + auto-init
│   └── .env.example
│
└── frontend/
    └── src/
        ├── components/
        │   ├── home/      # HeroSection, TrendingSection, FeaturedSection
        │   ├── layout/    # Navbar, Footer
        │   └── ui/        # MangaCard, StarRating, GlowButton, EmptyState
        ├── contexts/      # AuthContext (JWT)
        ├── pages/         # HomePage, LoginPage, AdminPage, etc.
        └── utils/         # API client (axios) with interceptors
```

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/health | — | Health check (DB status) |
| POST | /api/auth/register | — | Register |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | ✓ | Current user |
| GET | /api/manga | — | Browse manga (paginated, filtered) |
| GET | /api/manga/trending | — | Trending manga |
| GET | /api/manga/featured | — | Featured manga |
| GET | /api/manga/:id | — | Manga detail |
| POST | /api/manga | Admin | Create manga |
| PUT | /api/manga/:id | Admin | Update manga |
| DELETE | /api/manga/:id | Admin | Delete manga |
| GET | /api/reviews/manga/:id | — | Reviews for a manga |
| GET | /api/reviews/my | ✓ | My reviews |
| POST | /api/reviews | ✓ | Create review |
| PUT | /api/reviews/:id | ✓ | Edit review |
| DELETE | /api/reviews/:id | ✓ | Delete review |
| GET | /api/favorites | ✓ | My favorites |
| POST | /api/favorites/toggle | ✓ | Toggle favorite |
| GET | /api/users/profile | ✓ | My profile |
| PUT | /api/users/profile | ✓ | Update profile |
| GET | /api/admin/stats | Admin | Platform stats |
| GET | /api/admin/users | Admin | List users |
| PUT | /api/admin/users/:id/ban | Admin | Ban/unban user |
| PUT | /api/admin/users/:id/promote | Admin | Promote/demote |

---

## 🎨 Design System

- **Background**: `#0a0a0a` (deep black)
- **Surface**: `#111111 → #2a2a2a`
- **Primary**: `#ef4444` (neon red)
- **Accent**: `#7c3aed` (purple glow)
- **Text**: White / Gray scale
- **Font Display**: Bebas Neue
- **Font Body**: Inter
- **Font Japanese**: Noto Sans JP
