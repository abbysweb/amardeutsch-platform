# German-Edtech-Platform

**An Advanced Gamified German Learning Suite & Behavioral Intelligence Platform**

[![Next.js 16](https://img.shields.io/badge/Next.js%2016-Black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript 5](https://img.shields.io/badge/TypeScript%205-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Prisma ORM](https://img.shields.io/badge/Prisma_3NF-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![SQLite Serverless](https://img.shields.io/badge/SQLite_Cloud-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![Vercel Deployed](https://img.shields.io/badge/Vercel%20Production-Live-10B981?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

---

## Live Deployments

| Layer | URL | What it does |
|:---|:---|:---|
| **Student Portal** | [amardeutsch-navy.vercel.app](https://amardeutsch-navy.vercel.app) | Gamified vocabulary arenas, grammar quizzes with gameshow audio, and speech pronunciation |
| **Admin Dashboard** | [amardeutsch-platform-backend.vercel.app/backend](https://amardeutsch-platform-backend.vercel.app/backend/Dashboard) | Live database management, quiz CRUD, student telemetry, and content ingestion |
| **Brand Domain** | [amardeutsch.com](https://amardeutsch.com) | Primary portal mapping to the learning platform |

---

## Why This Exists

Most language learning platforms treat vocabulary as static JSON blobs and quizzes as hardcoded HTML. That means every time an admin wants to add a new grammar topic or update a translation, someone has to rebuild and redeploy the entire frontend. Teachers get no visibility into *which* words students actually struggle with or *when* they stop practicing.

AmarDeutsch takes a different approach. The entire curriculum lives in a normalized SQLite database, and every admin change (new quiz, updated vocabulary, corrected sentence) shows up in student browsers within seconds, no rebuild required. On top of that, the platform tracks how students interact with the material and computes memory retention rates per CEFR level, giving educators real data instead of guesswork.

The result is what we call a *behavioral intelligence platform* -- it learns about the learners.

---

## What's Inside

### Gamified Learning (A1 through C2)

The curriculum follows the Common European Framework of Reference, structured into six proficiency tiers. Each tier has its own vocabulary set, grammar topics, and quiz modules:

| Level | Vocab Nodes | Quiz Modules | Grammar Focus |
|:---|:---|:---|:---|
| **A1** Beginner | 850+ | 10 batches | Regular verbs, gender articles (der/die/das), basic Nominativ & Akkusativ |
| **A2** Elementary | 1,200+ | 15 batches | Dativ case, dual-case prepositions, simple past, subordinate clauses |
| **B1** Intermediate | 1,800+ | 18 batches | Genitiv, passive voice, Konjunktiv II, relative clauses |
| **B2** Upper Inter. | 2,200+ | 16 batches | Argumentation syntax, Nomen-Verb-Verbindungen, academic nominalization |
| **C1-C2** Mastery | 1,500+ | Custom | Literary stylistics, conversational idioms, academic prose |

**The Random Word Arena** presents vocabulary in glassmorphic cards with enlarged example sentences. Each German article gets a distinct color: `der` is blue, `die` is rose, `das` is emerald green, and plural/dative forms show up in amber and purple. It sounds small, but that color-coding actually makes a measurable difference in how quickly people internalize grammatical gender.

**Grammar Quizzes** run as interactive gameshow-style challenges. When a student picks the right answer, the Web Audio API fires off an ascending major chord arpeggio (C5 to C6, 523-1046 Hz) through browser oscillators. Wrong answer? A low-frequency buzzer with a CSS shake animation on the card. No audio files loaded, no latency, pure synthesized sound. It keeps things snappy even on slow connections.

**Speech Synthesis** lets students hear native-quality German pronunciation for any vocabulary word or example sentence with one click, powered by the browser's built-in SpeechSynthesis engine.

### Real-Time Admin CRUD

The admin dashboard at `/backend` lets educators manage everything without touching code:

- Create, edit, and delete quizzes and vocabulary directly through the UI
- Changes propagate to all student frontends instantly -- no static rebuild, no cache invalidation drama
- Batch sentence ingestion tools pull from the Tatoeba open corpus and run automated translations
- All mutations hit the database inside atomic SQLite transactions with WAL (Write-Ahead Logging) mode, so concurrent student reads never block

### Student Telemetry

Every student gets a 5-digit ID on registration. The platform silently tracks study patterns in the background:

- Which modules a student spends the most time in
- Memory retention rates calculated from quiz performance and session frequency
- Navigation history showing completed grammar drills and vocabulary challenges
- Dwell-time analysis pinpointing primary study zones

This data surfaces in the admin dashboard, giving teachers a clear picture of how their students are actually doing.

---

## Architecture

The platform is a monorepo with two Next.js applications:

```
amardeutsch-platform/
  Frontend/                 Student Portal (React 19 + Tailwind CSS v4, port 3000)
    src/app/                Next.js App Router with A1-B2 CEFR tracks
    src/hooks/              Data fetching hooks (useLevelVocabulary, useRealtimeStats)
    src/levels/             Level-specific vocabulary, quiz, and grammar components
    src/providers/          VocabularyProvider for global context

  Backend/                  Admin Portal & API Gateway (Next.js 16, port 3001)
    src/app/api/            RESTful API routes (vocab, quizzes, grammar, auth)
    src/app/backend/        Admin dashboard with tab-based UI
    src/proxy.ts            Edge security proxy with JWT cookie authentication
    src/lib/prisma.ts       Prisma singleton with serverless RAM mirroring
    prisma/schema.prisma    3NF database schema (User, Vocabulary, Quiz, QuizQuestion, etc.)
    prisma/dev.db           Authoritative seeded SQLite database (741KB)
```

### How Requests Flow

Every request from the student browser follows this path:

1. **Edge Proxy** (`proxy.ts`) intercepts at the CDN layer, validates JWT cookie sessions
2. **AWS Lambda** receives the verified request and checks if it's running in a Vercel environment
3. On **cold start**, the Lambda scans 9 candidate directories to find `dev.db`, copies it to `/tmp/dev.db` (ephemeral RAM), and configures SQLite WAL mode
4. **Prisma ORM** translates TypeScript queries into parameterized SQL against the in-memory database
5. **SQLite** returns rows through the typed Prisma layer, serialized as JSON back to the browser
6. React 19 hydrates the UI with the response

The whole roundtrip for a vocabulary fetch takes under 200ms.

### Vercel Serverless Adaptation

Deploying SQLite to serverless was the hardest part. Vercel Lambda containers have read-only filesystems after build time, which means you can't write to a `.db` file. The solution lives in `src/lib/prisma.ts`:

- On cold start, an exhaustive path scan finds the authoritative database across 9 possible locations
- `fs.copyFileSync()` transfers it to `/tmp/dev.db` (writable RAM)
- `PRAGMA journal_mode=WAL` enables concurrent reads during writes
- `PRAGMA busy_timeout=5000` gives a 5-second retry window under high student load
- A deduplicated Prisma singleton prevents connection pool exhaustion

This runs exactly once per new Lambda container. After that, warm invocations connect directly to the RAM copy.

---

## Getting Started Locally

**Prerequisites:** Node.js 18.17+ and npm 10+

```bash
# Clone the repo
git clone https://github.com/abbysweb/amardeutsch-platform.git
cd amardeutsch-platform

# Install dependencies
npm install

# Set up the database
cd Backend
npx prisma db push
cd ..

# Start both servers
npm run dev
```

That's it. The student portal runs at `localhost:3000` and the admin dashboard at `localhost:3001/backend/Dashboard`.

---

## Development History

The platform was built across 77 development phases. Here's a condensed overview of how it evolved:

- **Phases 1-15** -- Initial Next.js layouts, German typography, core vocabulary cards
- **Phases 16-25** -- Dark mode, glassmorphic aesthetics, micro-animations, hover transitions
- **Phases 26-35** -- CEFR route structures (A1-C2), grammar topic cards, verb conjugation displays
- **Phases 36-45** -- Interactive multiple-choice quizzes, fill-in-the-blank exercises, client-side validation
- **Phases 46-53** -- Browser speech synthesis, German character keyboard helpers (umlauts, sharp s)
- **Phases 54-56** -- Random Word Arena redesign, ergonomic card scaling, sentence presentation overhaul
- **Phases 57-59** -- Grammatical article color-coding (der=blue, die=rose, das=emerald)
- **Phase 60** -- Admin quiz CRUD with Prisma models bound to CEFR levels
- **Phase 61** -- Web Audio API gameshow sounds, A/B/C/D option badging
- **Phase 72** -- Bulk ingestion of 59 quiz modules (1,625 questions) into SQLite, real-time CRUD sync
- **Phase 73** -- Vercel serverless SQLite adaptation, RAM mirroring, connection pool deduplication
- **Phase 74** -- Root route autodirection, universal CORS headers for cross-origin API access
- **Phase 75** -- Next.js 16 proxy convention migration (middleware.ts to proxy.ts)
- **Phase 76** -- Node File Trace bundling, ephemeral RAM copying, admin signup restoration
- **Phase 77** -- Stale database cleanup, cloud schema prioritization

Build times went from 18.4 seconds (Phase 15) down to 6.9 seconds (Phase 77). Static generation dropped from 5.2s to 0.8s.

---

## Roadmap

Two things we're actively working on:

1. **2,000-Word German-English Cognate Integration** -- Populating the database with structured cognate matrices so English speakers can leverage lexical pattern similarities for faster acquisition
2. **CMS Visual Page Builder** -- A drag-and-drop interface in the admin backend for assembling grammar challenges and multimedia lessons without writing code

---

## Author

**Abdullah Al Mamun**
M.Sc. & B.Sc. In Software Engineering

TU Wien (Vienna, Austria) & Daffodil International University

- Email: [mamun.swe.de@gmail.com](mailto:mamun.swe.de@gmail.com)
- GitHub: [github.com/abbysweb](https://github.com/abbysweb)
- ORCID: [0009-0006-7473-0024](https://orcid.org/0009-0006-7473-0024)

---

## License

Copyright 2026 AmarDeutsch (amardeutsch.com). All rights reserved.
