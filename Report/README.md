# AmarDeutsch & DeutschLern: Industry-Standard Technical Report

This folder contains the comprehensive **APA 7th Edition LaTeX Technical Report** documenting the software architecture, database schemas, algorithms, pedagogical linguistics, and developmental phases (Phases 1–77) of the AmarDeutsch & DeutschLern educational platform.

## 📄 File Inventory
- [`amardeutsch_technical_report.tex`](file:///d:/Germany/Learn%20German/German%20Website/Report/amardeutsch_technical_report.tex): The complete self-contained LaTeX source file containing all chapter texts, citations, and programmatic TikZ diagrams.

---

## 🏛️ Included Diagrams & Schemas (Native TikZ)
The LaTeX document natively renders industry-standard software engineering diagrams without requiring external image files or manual graphics compilation:
1. **System Architecture Topology Diagram**: Layered block architecture depicting Client Browsers, Next.js 16 Edge Proxy Routing (`proxy.ts`), Vercel Serverless API Lambdas, Ephemeral `/tmp/dev.db` RAM Memory, and Authoritative SQLite Storage.
2. **Third Normal Form (3NF) Entity-Relationship Schema (ERD)**: Full relational database model illustrating primary keys, foreign keys, constraints, and cardinalities across `CefrLevel`, `Category`, `Vocabulary`, `Quiz`, `QuizQuestion`, and `User` tables.
3. **Use Case Interaction Boundary Diagram**: Actor modeling for Student Learners (Random Word Arena, Gameshow Quizzes, Speech Synthesizer) and Executive Administrators (Live CRUD, Batch Ingestion, Analytics).
4. **Serverless Execution & Fallback Decision Flowchart**: Runtime execution decisions traversing root redirect interceptors, JWT cookie session validations, cloud lambda memory copying, and high-concurrency WAL mode database bindings.
5. **Multi-Agent AI Governance Workflow Diagram**: Formal state transitions modeling the **Antigravity / Gemini 3.1 Pro** Supervisory Quality Gate and asynchronous OpenCode Free Model fallback rotation.

---

## 🚀 How to Compile to PDF

### Option 1: VS Code (LaTeX Workshop Extension)
1. Open [`amardeutsch_technical_report.tex`](file:///d:/Germany/Learn%20German/German%20Website/Report/amardeutsch_technical_report.tex) in Visual Studio Code.
2. Click the green **Build LaTeX Project** play button in the top right, or press `Ctrl + Alt + B`.

### Option 2: Command Line (MiKTeX / TeX Live / MacTeX)
Run `pdflatex` twice in terminal to resolve table of contents and internal links:
```bash
cd "d:/Germany/Learn German/German Website/Report"
pdflatex amardeutsch_technical_report.tex
pdflatex amardeutsch_technical_report.tex
```
*(This will output `amardeutsch_technical_report.pdf` in this directory).*

### Option 3: Online (Overleaf)
1. Upload `amardeutsch_technical_report.tex` directly to [Overleaf.com](https://www.overleaf.com/).
2. Set Compiler to **pdfLaTeX** or **XeLaTeX** and click **Recompile**.

---
*Report generated and verified under the Advanced Multi-Agent Divide & Conquer Supervision Protocol (Antigravity & Google DeepMind Team).*
