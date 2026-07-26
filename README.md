### Advanced Gamified German Learning Suite & Behavioral Intelligence Platform

[![Next.js 16](https://img.shields.io/badge/Next.js%2016-Black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript 5](https://img.shields.io/badge/TypeScript%205-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Prisma ORM](https://img.shields.io/badge/Prisma_3NF-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite Serverless](https://img.shields.io/badge/SQLite_Cloud-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Vercel Deployed](https://img.shields.io/badge/Vercel%20Production-Live-10B981?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

---

## 🚀 Live Cloud Deployments

We believe in testing in production. Try out our live student interfaces and administrative monitoring portals running on Vercel:

| Platform Layer | Live URL & Access Link | Description |
| :--- | :--- | :--- |
| **🎓 Student Learning Portal (Frontend)** | **[amardeutsch-navy.vercel.app](https://amardeutsch-navy.vercel.app)** | Gamified German learning arena, interactive flashcards, 3D pronunciation mechanics, and real-time CEFR grammar quizzes. |
| **🛡️ Executive Analytics Panel (Backend)** | **[amardeutsch-platform-backend.vercel.app/backend/Dashboard](https://amardeutsch-platform-backend.vercel.app/backend/Dashboard)** | Real-time educator dashboard, live 3NF database management, student memory retention curves, and customer telemetry. |
| **🌐 Official Brand Domain** | **[amardeutsch.com](https://amardeutsch.com)** | Primary portal mapping to our gamified German acquisition tracks and linguistic intelligence ecosystem. |

---

## 💡 Why We Built AmarDeutsch

Learning German shouldn't feel like memorizing repetitive spreadsheet rows or clicking through lifeless syntax flashcards. Traditional language apps often isolate frontend presentation from pedagogical data, leaving educators without real insight into *why* a student struggles with Dative prepositions or *when* they drop out during vocabulary drills.

**AmarDeutsch** reimagines language acquisition by combining **vibrant gamified UI craftsmanship** with **deep behavioral telemetry**. Whether a beginner is exploring basic A1 regular verbs or an advanced scholar is breaking down C2 academic argumentation syntax, our platform adapts to their pace. Behind the scenes, an intelligent non-intrusive monitoring engine observes student study habits, computes memory retention rates, and surfaces real-time learning insights to educators—all served out of a responsive Next.js 16 Turborepo monorepo.

---

## 🎨 What Makes AmarDeutsch Special?

### 1. 🎮 Gamified CEFR Learning & Visual Memory Arenas
* **From A1 Beginners to C2 Masters**: Structured curriculum tracks seamlessly guide learners through grammatical syntax, gender articles (*der*, *die*, *das* with intuitive semantic color-coding), and complex sentence structures.
* **The Random Word & BaBaDum Arenas**: Experience dynamic vocabulary challenges wrapped in sleek glassmorphic cards with proportional scaling and vivid HD emoji fallback vectors.
* **Zero-Latency Gameshow Audio**: We embedded native Web Audio API synthesis directly into interactive quizzes—triggering uplifting major chord arpeggios when you conquer a question, and gentle buzzer vibrations to reinforce positive cognitive memory when you err.
* **Instant Phonetic Pronunciation**: Powered by HTML5 browser speech engines, students can articulate naturalistic German words and sample sentences at the push of a button.

### 2. 🛰️ Real-Time Student Telemetry & Behavioral Intelligence
* **We Celebrate Learning Habits**: As learners navigate between grammar lectures and mini-games, an intelligent background observer maps their interactive study journey without slowing down browser performance.
* **5-Digit Telemetry UID Identification**: Every registered student is assigned a secure, collision-free Student ID (ranging from `#10000` to `#99999`). When logged in, learners see their personalized identity banner:
  ```text
  🌟 Willkommen zurück, Abdullah! [UID: #58942] ⚡ Telemetry Active
  ```
* **Dwell-Time & Habitat Discovery**: Our analytics engine accurately pinpoints a learner's primary study zones and calculates personalized pedagogical memory retention rates—helping teachers recognize when a refresher deck is needed.

### 3. 📈 Executive Educator Dashboard
* **Real Insights, Zero Mock Data**: Accessed via our live administrative gateway, the executive suite empowers educators to inspect real student telemetry and manage curriculum structures on the fly.
* **The Student Dossier Well**: Click on any active learner UID in the backend panel to immediately unveil:
  * ⏱️ **Top Study Modules**: Where the student spends most of their learning duration.
  * 📊 **Memory Retention Curvature**: Calculated consistency metrics and engagement trends.
  * 👁️ **Daily Navigation Ledgers**: Transparent chronologies of completed grammar drills and vocabulary challenges.
* **Live Content Engine (3NF CRUD)**: Add, edit, or remove quiz questions and vocabulary nodes directly in the SQLite database, instantly reflecting changes across all student frontends worldwide without static recompilation delays!

---

## 🏗️ How We Architected the Monorepo

We split our ecosystem into two highly cohesive, specialized Next.js applications communicating across universal API boundaries:

```text
amardeutsch-platform/
├── Frontend/                 # 🎓 Student Portal (React 19, Tailwind CSS v4, Port 3000)
│   ├── src/app/              # Next.js App Router, A1-B2 CEFR tracks & games arenas
│   ├── src/context/          # Student session state & live background telemetry observers
│   └── src/shared/           # Reusable UI tokens, sound synthesizers & interactive charts
│
├── Backend/                  # 🛡️ Executive Portal & API Gateway (Next.js 16, Port 3001)
│   ├── src/app/backend/      # Admin App Shell, Custom edge routing & security headers
│   ├── src/components/tabs/  # Interactive Analytics, User Management, & Content Studio
│   ├── src/proxy.ts          # Next.js 16 Edge Security Interceptor & JWT cookie auth
│   └── prisma/dev.db         # 3NF Normalized SQLite database archive & schema definitions
│
├── Report/                   # 📄 Academic & Industry Technical Report (23-Page LaTeX Archive)
└── package.json              # Monorepo orchestration & Turborepo build optimization scripts
```

### ☁️ Built for Vercel Serverless Resilience
Deploying a relational SQLite database to cloud serverless containers often triggers read-only file filesystem crashes (`EROFS`). To solve this in production, AmarDeutsch incorporates an intelligent runtime database mirroring engine (`src/lib/prisma.ts`). On cold start in cloud Lambda containers, our platform automatically mirrors the authoritative seeded database into ephemeral cloud RAM (`/tmp/dev.db`) with SQLite Write-Ahead Logging (WAL) concurrency enabled—guaranteeing rapid read/write synchronization with zero cloud infrastructure complexity!

---

## 💻 Get It Running Locally in 3 Minutes

Want to explore the codebase, test out new grammar challenges, or contribute to our multi-agent governance workflow? Getting set up is quick and straightforward!

### What You'll Need
* **Node.js**: Version 18.17+ or 20+ (recommended)
* **npm**: Version 10+ (comes standard with newer Node releases)

### Step 1: Clone & Install Dependencies
Open your favorite terminal, clone the repository, and install packages for both workspaces in a single sweep:
```bash
git clone https://github.com/abbysweb/amardeutsch-platform.git
cd amardeutsch-platform
npm install
```

### Step 2: Prepare Your Database
Navigate into the backend directory to apply our seeded template environment and Prisma schema:
```bash
cd Backend
cp .env.example .env      # Or copy directly if setting custom variables
npx prisma db push        # Synchronize schema and verify local SQLite binding
cd ..
```

### Step 3: Launch Dual Development Servers
Use our simple Turborepo script to fire up both the student interactive arena and executive portal concurrently:
```bash
npm run dev
```

Now grab a cup of coffee and open up your local instances:
* 🌍 **Student Gamified Portal**: [http://localhost:3000](http://localhost:3000)
* 🛡️ **Executive Analytics Panel**: [http://localhost:3001/backend/Dashboard](http://localhost:3001/backend/Dashboard)

---

## 👨‍💻 Meet the Architect

Designed and engineered under an advanced multi-agent supervisory framework by:

**Abdullah Al Mamun**  
*M.Sc. and B.Sc. In Software Engineering *  
*TU Wien (Vienna, Austria) & Daffodil International University*  

* 📧 Email: [`mamun.swe.de@gmail.com`](mailto:mamun.swe.de@gmail.com)  
* 🐙 GitHub: [`https://github.com/abbysweb`](https://github.com/abbysweb)  
* 🔬 ORCID: [`0009-0006-7473-0024`](https://orcid.org/0009-0006-7473-0024)  

---

## 📝 License & Copyright

Copyright © 2026 **AmarDeutsch (`amardeutsch.com`) — Engineered by @abbysweb**. All rights reserved.  
*Approved under our internal Multi-Agent Divide & Conquer AI Governance Framework.*
