# 🇩🇪 AmarDeutsch (`amardeutsch.com`)
**Advanced Gamified German Learning Suite & Behavioral Intelligence Platform**

[![Next.js 15](https://img.shields.io/badge/Next.js%2015-Black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)](https://turbo.build/)
[![AdminLTE 4](https://img.shields.io/badge/AdminLTE%204-198754?style=for-the-badge&logo=bootstrap&logoColor=white)](https://adminlte.io/)

Welcome to **AmarDeutsch (`amardeutsch.com`)**, a modern, full-stack language learning ecosystem engineered for German fluency and customer behavior analytics. Built as a dual Next.js monorepo powered by Turborepo, AmarDeutsch combines intuitive gamified CEFR curriculum tracks (A1 to B2) with an enterprise-grade administrative intelligence dashboard.

---

## 🌟 Core Feature Highlights

### 1. 🔒 Protected Gateway & Simple Authentication Suite
* **Mandatory Registration Barrier**: Lesson modules, vocabulary flashcards, syntax rules, quizzes, and mini-games remain strictly protected behind an interactive login hub until user authentication.
* **1-Click Google Account Registration**: Simplified sign-up flow (`Continue with Google Account 🚀`) that validates Google emails and generates instant student profiles without password friction.
* **Streamlined Tabbed Auth UI**: Effortlessly transition between **Sign Up ✨**, **Google 🌐**, and **Log In 🔑** modes directly from the vibrant landing hero.

### 2. 🎲 5-Digit Telemetry UID & Database Enforcement
* **Automated Collision-Free IDs**: Upon registration via Email or Google, every user account is assigned a strictly verified **5-Digit Random User ID** (ranging from `#10000` to `#99999`) stored within the Prisma SQLite database.
* **Active User Recognition**: Authenticated learners are welcomed with a clean identity banner highlighting their unique Student UID and real-time telemetry indicator:
  ```text
  🌟 Willkommen zurück! [UID: #58942] ⚡ Telemetry Active
  ```

### 3. 🛰️ Real-Time Behavioral Telemetry Engine
* **Automated Navigation Ledgers**: An intelligent background observer tracks every curriculum page and interactive tool visited during a session.
* **Dwell-Time Study Habitat Detection**: Calculates cumulative study duration across curriculum zones to determine the student's *Primary Learning Habitat*.
* **Customer Retention & Loyalty Analytics**: Dynamically models return habits and dropout probability, generating unified JSON dossiers transmitted directly to the administrative monitoring suite.

### 4. 📈 AdminLTE 4 Behavioral Intelligence Panel
* **Zero Dummy Fallbacks**: Operates exclusively on genuine database records and validated student telemetry.
* **Customer Dossier Inspection**: Clicking on any registered student UID in the Admin Dashboard immediately presents a high-tech **Behavioral Intelligence Well**:
  * ⏱️ **Section Spent Most Time**: Identifies top module usage and total dwell duration.
  * 📈 **Customer Retention Rate**: Displays computed loyalty percentages and dropout risk indicators.
  * 👁️ **What User Opened Today**: An interactive tag ledger showing exact navigation sequences.
* **Administrative Operations**: Award study bonus XP, assign SRS refresher vocabulary decks, export user audit logs to `.csv`, and schedule global HTML email broadcasts.

---

## 🏗️ Architecture & Workspace Topology

This project is organized as a high-velocity **Turborepo Monorepo**:

```text
├── Frontend/                 # Student Learning Portal (Next.js 15, Tailwind CSS, Port 3000)
│   ├── src/app/              # App Router, CEFR Tracks (A1, A2, B1, B2), Games Arena
│   ├── src/context/          # AuthContext & Universal Behavioral Telemetry Observer
│   └── src/shared/           # Reusable UI systems, Navbar, and interactive charts
│
├── Backend/                  # Administrative & Analytics Portal (Next.js 15, AdminLTE 4, Port 3001)
│   ├── src/app/backend/      # Admin App Shell, Custom Routing & Security Headers
│   ├── src/components/tabs/  # AnalyticsTab, UsersTab, NewsletterTab, Content Studio
│   └── prisma/               # SQLite Schema (dev.db) & 3NF Normalized Models
│
└── package.json              # Monorepo Orchestration & Turborepo build scripts
```

---

## ⚡ Quick Start Guide (Local Development)

### Prerequisites
* Node.js (v18.17+ or v20+ recommended)
* npm (v10+ recommended)

### 1. Clone & Install Dependencies
From the root directory, install all workspace packages in a single command:
```bash
git clone https://github.com/your-username/amardeutsch-platform.git
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

To test online using your custom domain **`amardeutsch.com`** with zero hosting fees, select one of the following recommended strategies:

### Option 1: Vercel Deployments (Recommended for Cloud Testing)
1. Import your repository into [Vercel](https://vercel.com) as **two separate projects**:
   * **Project 1 (`amardeutsch-frontend`)**: Set Root Directory to `Frontend`. Link custom domain `amardeutsch.com`.
   * **Project 2 (`amardeutsch-backend`)**: Set Root Directory to `Backend`. Link subdomain `admin.amardeutsch.com`.
2. *Database Notice*: Since serverless environments reset local SQLite disk state, connect a free remote database via [Turso (LibSQL)](https://turso.tech) or [Neon Postgres](https://neon.tech) and set your `DATABASE_URL` in Vercel Environment Variables.

### Option 2: Cloudflare Zero Trust Tunnels (Best for Instant Local Testing)
1. Point your domain `amardeutsch.com` DNS to Cloudflare (Free Plan).
2. Under **Zero Trust → Networks → Tunnels**, create a new secure tunnel.
3. Map public hostnames directly to your local machines without modifying database adapters:
   * `amardeutsch.com` ➔ `http://localhost:3000`
   * `admin.amardeutsch.com` ➔ `http://localhost:3001`
4. Run `npm run dev` locally to securely expose your system to global testers with free automatic SSL!

---

## 📝 License
Copyright © 2026 **AmarDeutsch (`amardeutsch.com`)**. All rights reserved.
