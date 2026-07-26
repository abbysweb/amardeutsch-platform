# 🇩🇪 AmarDeutsch (`amardeutsch.com`)
**Advanced Gamified German Learning Suite & Behavioral Intelligence Platform**

[![Next.js 16](https://img.shields.io/badge/Next.js%2016-Black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript 5](https://img.shields.io/badge/TypeScript%205-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Turbopack](https://img.shields.io/badge/Turbopack-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![AdminLTE 4](https://img.shields.io/badge/AdminLTE%204-198754?style=for-the-badge&logo=bootstrap&logoColor=white)](https://adminlte.io/)
[![Vercel Ready](https://img.shields.io/badge/Vercel%20CI-Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

Welcome to **AmarDeutsch (`amardeutsch.com`)**, an state-of-the-art, full-stack language learning ecosystem engineered for German mastery and customer behavioral analytics. Built as a high-velocity **Turborepo monorepo** running Next.js 16 and Tailwind CSS v4, AmarDeutsch bridges intuitive CEFR gamified curriculum tracks (A1, A2, B1, B2) with an enterprise-grade administrative intelligence panel.

---

## 🌟 Core Feature Highlights

### 1. 🔒 Protected Gateway & Simple Authentication Suite
* **Mandatory Registration Barrier**: Lesson modules, vocabulary flashcards, grammar lectures, interactive quizzes, and mini-games remain strictly protected behind an interactive login hub until user authentication.
* **1-Click Google Account Registration**: Simplified sign-up flow (`Continue with Google Account 🚀`) that validates Google emails and generates instant student profiles without password friction.
* **Streamlined Tabbed Auth UI**: Effortlessly transition between **Sign Up ✨**, **Google 🌐**, and **Log In 🔑** modes directly from the vibrant landing hero.

### 2. 🎲 5-Digit Telemetry UID & Database Enforcement
* **Automated Collision-Free IDs**: Upon registration via Email or Google, every user account is assigned a strictly verified **5-Digit Random User ID** (ranging from `#10000` to `#99999`) stored within the Prisma SQLite database.
* **Active User Recognition**: Authenticated learners are welcomed with a dynamic identity banner highlighting their unique Student UID and real-time telemetry indicator:
  ```text
  🌟 Willkommen zurück, Abdullah! [UID: #58942] ⚡ Telemetry Active
  ```

### 3. 🎮 CEFR Interactive Games Arena & Visual Verification Engine (BaBaDum)
* **Multi-Tier HD Visual Asset Delivery**: Our interactive picture-matching game (*BaBaDum*) utilizes an intelligent asset fallback pipeline, automatically surfacing the sharpest graphic resolution available:
  * 🎨 *Tier 1*: 512px Ultra-HD Noto Emoji WebP vectors
  * 🖼️ *Tier 2*: Official Twemoji Vector SVGs via Cloudflare CDN
  * 🍎 *Tier 3*: Glossy Apple 3D Emojis & OpenMoji color primitives
* **Spaced Repetition & Audio-Visual Reinforcement**: Integrated with `naturalTTS` German pronunciation engines to automatically articulate target nouns, articles, and grammar cases during competitive gamification rounds.

### 4. 🛰️ Real-Time Behavioral Telemetry Engine
* **Automated Navigation Ledgers**: An intelligent background observer tracks every curriculum page, grammar lecture, and interactive tool visited during a session.
* **Dwell-Time Study Habitat Detection**: Calculates cumulative study duration across curriculum zones to determine the student's *Primary Learning Habitat*.
* **Customer Retention & Loyalty Analytics**: Dynamically models return habits and dropout probability, generating unified JSON dossiers transmitted directly to the administrative monitoring suite.

### 5. 📈 AdminLTE 4 Behavioral Intelligence Panel
* **Zero Dummy Fallbacks**: Operates exclusively on genuine database records and validated student telemetry.
* **Customer Dossier Inspection**: Clicking on any registered student UID in the Admin Dashboard immediately presents a high-tech **Behavioral Intelligence Well**:
  * ⏱️ **Section Spent Most Time**: Identifies top module usage and total dwell duration.
  * 📈 **Customer Retention Rate**: Displays computed loyalty percentages and dropout risk indicators.
  * 👁️ **What User Opened Today**: An interactive tag ledger showing exact navigation sequences.
* **Administrative Operations**: Award study bonus XP, assign SRS refresher vocabulary decks, export user audit logs to `.csv`, and schedule global HTML email broadcasts.

---

## 🏗️ Architecture & Workspace Topology

This project is structured as an enterprise-grade **Turborepo Monorepo**:

```text
├── Frontend/                 # Student Learning Portal (Next.js 16, Tailwind CSS v4, Port 3000)
│   ├── src/app/              # App Router, CEFR Tracks (A1, A2, B1, B2), Games Arena (BaBaDum)
│   ├── src/context/          # AuthContext & Universal Behavioral Telemetry Observer
│   └── src/shared/           # Reusable UI systems, Navbar, and interactive analytics charts
│
├── Backend/                  # Administrative & Analytics Portal (Next.js 16, AdminLTE 4, Port 3001)
│   ├── src/app/backend/      # Admin App Shell, Custom Routing & Security Headers
│   ├── src/components/tabs/  # AnalyticsTab, UsersTab, NewsletterTab, Content Studio
│   └── prisma/               # SQLite Schema (dev.db) & 3NF Normalized Models
│
├── .npmrc                    # CI enforcement rules for optional native compiler binaries
└── package.json              # Monorepo Orchestration, Turborepo commands & elevated lockfile bindings
```

---

## 🛡️ Vercel CI & Monorepo Native Binding Resilience
AmarDeutsch is architecturally reinforced for modern cloud deployments (Vercel, Docker, AWS):
* **Cross-Platform Compiler Hoisting**: Specifically structured to hoist high-performance Rust CSS compile bindings (`lightningcss-linux-x64-gnu` & `@tailwindcss/oxide-linux-x64-gnu/musl`) directly to the workspace root, eliminating multi-platform build discrepancy bugs on serverless CI containers.
* **Strict Type Safety**: Fully audited with zero TypeScript or ESLint compiler faults across both Frontend and Backend environments.

---

## ⚡ Quick Start Guide (Local Development)

### Prerequisites
* Node.js (v18.17+ or v20+ recommended)
* npm (v10+ recommended)

### 1. Clone & Install Dependencies
From the root directory, install all workspace packages in a single command:
```bash
git clone https://github.com/abbysweb/amardeutsch-platform.git
cd amardeutsch-platform
npm install
```

### 2. Configure Database & Environment
Copy the example environment configuration inside the backend workspace:
```bash
cd Backend
cp .env.example .env
npx prisma db push
cd ..
```

### 3. Launch the Platform (Dual Dev Servers)
Run the Turbo development engine to start both Frontend and Backend concurrently:
```bash
npm run dev
```

* 🌍 **Student Portal (Frontend)**: Open [http://localhost:3000](http://localhost:3000)
* 🛡️ **Admin Portal (Backend)**: Open [http://localhost:3001/backend](http://localhost:3001/backend)

---

## 🌐 Free Hosting & Live Domain Testing Guide

To deploy online using your custom domain **`amardeutsch.com`** with zero hosting fees, follow our cloud deployment playbook:

### Option 1: Vercel Deployments (Cloud Production)
1. Import `https://github.com/abbysweb/amardeutsch-platform` into [Vercel](https://vercel.com) as **two separate projects**:
   * **Project 1 (`amardeutsch-frontend`)**: Set Root Directory to `Frontend`. Link custom domain `amardeutsch.com`.
   * **Project 2 (`amardeutsch-backend`)**: Set Root Directory to `Backend`. Link subdomain `admin.amardeutsch.com`.
2. *Database Notice*: Since serverless environments reset local SQLite disk state on restart, connect a free remote serverless database via [Turso (LibSQL)](https://turso.tech) or [Neon Postgres](https://neon.tech) and place your `DATABASE_URL` in Vercel Environment Variables.

### Option 2: Cloudflare Zero Trust Tunnels (Instant Local Exposing)
1. Point your domain `amardeutsch.com` DNS to Cloudflare (Free Plan).
2. Under **Zero Trust → Networks → Tunnels**, create a new secure tunnel.
3. Map public hostnames directly to your machine ports without altering database adapters:
   * `amardeutsch.com` ➔ `http://localhost:3000`
   * `admin.amardeutsch.com` ➔ `http://localhost:3001`
4. Run `npm run dev` locally to securely expose your system to global testers with free automatic SSL!

---

## 📝 License
Copyright © 2026 **AmarDeutsch (`amardeutsch.com`) — Created by @abbysweb**. All rights reserved.
