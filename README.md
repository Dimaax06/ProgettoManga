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
- **Authentication** — JWT-based secure auth with bcrypt password hashing
- **Responsive** — Mobile-first, fully responsive on all screen sizes
- **Animations** — Framer Motion page transitions, hover effects, loading screens

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TailwindCSS, Framer Motion |
| Backend | Node.js, Express |
| Database | MySQL |
| Auth | JWT + bcryptjs |
| Icons | React Icons |
| HTTP | Axios |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0+

### 1. Clone & Install

```bash
git clone https://github.com/Dimaax06/ProgettoManga.git
cd ProgettoManga
```

### 2. Database Setup

In MySQL:
```sql
CREATE DATABASE dimangax;
```

Then run the schema and seed:
```bash
cd backend
mysql -u root -p dimangax < database/schema.sql
mysql -u root -p dimangax < database/seed.sql
```

Or use the setup script:
```bash
cd backend
cp .env.example .env
# Edit .env with your DB credentials
npm install
node database/setup.js
```

### 3. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your database credentials and JWT secret
npm install
npm run dev
# API running at http://localhost:5000
```

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

---

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@dimangax.com | admin123 |
| User | demo@dimangax.com | demo123 |

---

## 📁 Project Structure

```
ProgettoManga/
├── backend/
│   ├── src/
│   │   ├── config/        # Database connection
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth, admin guards
│   │   └── routes/        # API routes
│   ├── database/
│   │   ├── schema.sql     # Table definitions
│   │   ├── seed.sql       # Sample data (15 manga titles)
│   │   └── setup.js       # Setup script
│   ├── server.js
│   └── .env.example
│
└── frontend/
    └── src/
        ├── components/
        │   ├── home/      # HeroSection, TrendingSection, FeaturedSection
        │   ├── layout/    # Navbar, Footer
        │   └── ui/        # MangaCard, StarRating, GlowButton, etc.
        ├── contexts/      # AuthContext (JWT)
        ├── pages/         # HomePage, LoginPage, SearchPage, AdminPage, etc.
        └── utils/         # API client (axios)
```

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | ✓ | Current user |
| GET | /api/manga | — | Browse manga |
| GET | /api/manga/trending | — | Trending manga |
| GET | /api/manga/featured | — | Featured manga |
| GET | /api/manga/:id | — | Manga detail |
| POST | /api/manga | Admin | Create manga |
| PUT | /api/manga/:id | Admin | Update manga |
| DELETE | /api/manga/:id | Admin | Delete manga |
| GET | /api/reviews/manga/:id | — | Manga reviews |
| POST | /api/reviews | ✓ | Create review |
| PUT | /api/reviews/:id | ✓ | Edit review |
| DELETE | /api/reviews/:id | ✓ | Delete review |
| GET | /api/favorites | ✓ | My favorites |
| POST | /api/favorites/toggle | ✓ | Toggle favorite |
| GET | /api/users/profile | ✓ | My profile |
| PUT | /api/users/profile | ✓ | Update profile |
| GET | /api/admin/stats | Admin | Platform stats |
| GET | /api/admin/users | Admin | All users |
| PUT | /api/admin/users/:id/ban | Admin | Ban/unban user |
| PUT | /api/admin/users/:id/promote | Admin | Toggle admin role |

---

## 🎨 Design System

- **Background**: `#0a0a0a` (deep black)
- **Surface**: `#111111 → #2a2a2a`
- **Primary**: `#ef4444` (neon red)
- **Accent**: `#7c3aed` (purple glow)
- **Text**: White / Gray scale
- **Font Display**: Bebas Neue
- **Font Body**: Inter
