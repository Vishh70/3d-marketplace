# 🔥 Melted Modulus — India's Premium 3D Printing Marketplace

<div align="center">

![Melted Modulus](https://img.shields.io/badge/Melted%20Modulus-India's%20%231%203D%20Marketplace-fa6831?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.22-teal?style=for-the-badge&logo=prisma)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)

*Premium 3D model repository + AI Foundry + Industrial-grade custom printing — all from India.*

</div>

---

## ✨ Features

### 🏪 Marketplace
- **25+ Premium Models** — Articulated figures, spiritual idols, keychains, tech accessories
- **Digital STL Downloads** — Instant access after checkout
- **Physical Printing** — Custom print orders shipped India-wide (48h dispatch)
- **Cart + Razorpay Checkout** — Fully wired payment flow in INR

### 🤖 AI Foundry (Image-to-3D Pipeline)
A 7-step industrial conversion lab:
1. Image Input & Topology Analysis
2. Point-Cloud Generation (Point-E)
3. DreamGaussian Mesh Extraction
4. Blender Cleanup & Decimation
5. Printability Audit (Watertight checks)
6. STL Export for Cura / Prusa

### 👤 Account Dashboard
- Digital Vault — own and download purchased models
- Creator Revenue Analytics
- System health monitoring
- Glassmorphism premium UI

### 🎨 Premium UI/UX
- **GSAP Animations** — Timeline sequencing, ScrollTrigger, staggered entries
- **Lenis Smooth Scroll** — Physics-based buttery scrolling
- **Custom Cursor** — GSAP quickTo interactive cursor with hover intelligence
- **Three.js Hero** — Real-time 3D background scene
- **Glassmorphism** — Premium dark design system

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2 (App Router + Turbopack) |
| Language | TypeScript 5 |
| Database | Prisma ORM + PostgreSQL (Supabase) |
| Auth | NextAuth v4 + bcryptjs |
| Payments | Razorpay India |
| 3D Engine | Three.js + React Three Fiber + Drei |
| Animations | GSAP 3.15 + Lenis |
| Storage | Supabase Storage |
| Styling | Tailwind CSS v4 |
| Email | Resend |
| Deploy | Vercel (Mumbai region) |

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) account (free tier works)
- A [Razorpay](https://razorpay.com) account (test mode)

### 2. Install
```bash
git clone https://github.com/Vishh70/3d-marketplace.git
cd 3d-marketplace
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
# Fill in all values in .env
```

### 4. Setup Database
```bash
npx prisma db push
npx prisma generate
```

### 5. Seed Products
```bash
node src/scripts/seed_more_products.js
```

### 6. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "feat: production ready"
git push origin main
```

### 2. Connect to Vercel
- Go to [vercel.com/new](https://vercel.com/new)
- Import `Vishh70/3d-marketplace`
- Add all environment variables from `.env.example`
- Deploy!

### Required Vercel Environment Variables
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase PostgreSQL pooled URL |
| `DIRECT_URL` | Supabase PostgreSQL direct URL |
| `NEXTAUTH_SECRET` | Strong random secret |
| `NEXTAUTH_URL` | Your Vercel deployment URL |
| `RAZORPAY_KEY_ID` | Razorpay API key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login, Register pages
│   ├── (main)/          # Main marketplace routes
│   │   ├── account/     # User dashboard
│   │   ├── catalogue/   # Product catalogue (DB-connected)
│   │   ├── checkout/    # Razorpay checkout
│   │   ├── models/[id]/ # Product detail page
│   │   └── ai-foundry/  # Image-to-3D pipeline
│   ├── admin/           # Admin portal
│   └── api/             # REST API routes
├── components/
│   ├── account/         # Dashboard components
│   ├── home/            # HeroSection, CategoryBrowse
│   ├── layout/          # Navbar, Footer, CustomCursor
│   └── models/          # ModelCard, ModelGrid, ModelViewer3D
├── lib/                 # auth, prisma, supabase clients
└── styles/              # Global CSS
```

---

## 🔗 Social

- Instagram: [@melted_modulus](https://www.instagram.com/melted_modulus)
- Website: Coming soon

---

© 2026 Melted Modulus Lab. Made in India 🇮🇳 · Imagine. Inspire.
