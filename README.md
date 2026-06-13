# 🌾 KrishiMitra — AI-Powered Agricultural Decision Platform

> Empowering Indian farmers with intelligent, multilingual crop advisory, disease detection, and early-warning systems.

---

## 📌 Overview

**KrishiMitra** (कृषि मित्र — "Farmer's Friend") is a full-stack AI decision-support platform designed for Indian farmers. It combines computer vision for disease detection, a conversational AI agronomist, geospatial disease outbreak mapping, and seasonal crop planning — all in a single, mobile-first interface with Hindi and English support.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔬 **Crop Disease Scanner** | Upload or capture a photo of a crop — AI identifies the disease, severity, and recommends treatment |
| 🗺️ **CropWatch Map** | Real-time geospatial map showing disease outbreak clusters in your region |
| 💬 **AI Expert Chat** | Multilingual chat (Hindi/English) with an AI agronomist for crop, weather, and farming queries |
| 📋 **Farm Planner** | AI-powered seasonal crop recommendation based on soil type, land size, and weather |
| 📡 **Climate Advisory** | Daily weather-aware farming advisories tailored to your location |
| 🔐 **Phone OTP Login** | Secure, passwordless authentication via SMS OTP (Supabase Auth) |

---

## 🛠️ Tech Stack

**Frontend**
- [Next.js 14](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Leaflet](https://react-leaflet.js.org/) — interactive maps
- [TanStack React Query](https://tanstack.com/query) — data fetching & caching
- [Zustand](https://zustand-demo.pmnd.rs/) — lightweight state management
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — forms & validation

**Backend & Database**
- [Supabase](https://supabase.com/) — PostgreSQL database, Auth, Storage
- [PostGIS](https://postgis.net/) — geospatial queries for disease cluster mapping
- Next.js API Routes — serverless AI endpoints

**Fonts**
- [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) — primary UI font
- [Noto Sans Devanagari](https://fonts.google.com/noto/specimen/Noto+Sans+Devanagari) — Hindi text support

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/          # Phone OTP login & signup
│   ├── (app)/
│   │   ├── dashboard/      # Home dashboard with alerts & quick actions
│   │   ├── scan/           # Crop disease scanner (camera + upload)
│   │   ├── cropwatch/      # Geospatial disease outbreak map
│   │   ├── chat/           # AI agronomist chat
│   │   ├── plan/           # Seasonal crop planner
│   │   └── advisory/       # Climate & farming advisories
│   └── api/
│       ├── chat/           # AI chat endpoint
│       ├── disease/        # Disease detection endpoint
│       ├── plan/           # Crop recommendation endpoint
│       └── advisory/       # Climate advisory endpoint
├── components/
│   ├── ui/                 # Reusable UI components (Button, Input, etc.)
│   ├── map/                # CropWatch map component (Leaflet)
│   ├── layout/             # Navigation & shell layout
│   └── shared/             # QueryProvider, LanguageProvider
├── features/
│   ├── disease-detection/
│   ├── cropwatch/
│   └── ai-chat/
├── lib/                    # Supabase client, utilities
└── store/                  # Zustand global state
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js **18+**
- A [Supabase](https://supabase.com) project (free tier works)
- An SMS provider configured in Supabase (Twilio / MessageBird) for OTP

### 1. Clone the repository

```bash
git clone https://github.com/your-username/kisan-ai.git
cd kisan-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ⚠️ Never commit `.env.local` to Git — it's already in `.gitignore`.

### 4. Apply database migrations

Run the SQL migrations on your Supabase project via the **SQL Editor**:

```bash
# Using Supabase CLI (optional)
npx supabase db push
```

Or manually run the files in `supabase/migrations/` in order.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Schema

The database is built on **PostgreSQL + PostGIS** via Supabase:

| Table | Description |
|---|---|
| `farmers` | User profiles with location, soil, and crop preferences |
| `disease_reports` | Crop disease scan results with GPS coordinates |
| `chat_sessions` | AI chat conversation sessions |
| `chat_messages` | Individual messages within a chat session |
| `crop_recommendations` | AI-generated seasonal crop plans |
| `climate_advisories` | Weather-based farming advisories |
| `msp_prices` | Government Minimum Support Prices for crops |
| `government_schemes` | Eligible government schemes per crop/state |

All tables have **Row Level Security (RLS)** enabled.

---

## 🔒 Security

- All database tables have **RLS policies** — users can only access their own data
- Public reference tables (`msp_prices`, `government_schemes`, `spatial_ref_sys`) have read-only policies
- Authentication is handled entirely by **Supabase Auth** (phone OTP)
- Environment variables are never exposed to the client (only `NEXT_PUBLIC_` prefixed keys)

---

## 📦 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

---

## 🌐 Deployment

The easiest way to deploy is via **[Vercel](https://vercel.com)**:

1. Push your code to GitHub
2. Import the repository on Vercel
3. Add your environment variables in Vercel's dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">
  Built with ❤️ for Indian farmers 🌾
</p>
