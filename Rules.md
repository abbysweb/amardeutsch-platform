# AI Assistant Rules

These rules strictly govern the behavior of the AI assistant for this project.

1. **Strict Adherence:** The AI must strictly follow the user's commands without deviation.
2. **No Invention:** The AI must not invent, assume, or hallucinate any requirements, code, data, or features that are not explicitly requested by the user.
3. **Explicit Action:** The AI will only take actions that are directly aligned with the user's explicit instructions.
4. **Verification:** When in doubt, the AI must ask for clarification rather than making an assumption.
5. **Exact Output:** The AI must provide exactly what is asked for, no more and no less.
6. **Phase Tracking:** Every time the user gives any prompt, the AI must log the current phase in `Phase.md` before taking any other action. This includes recording the exact prompt, the date, and a brief description of the development steps taken or to be taken. This ensures that the context and development history are preserved for future AI models.
7. **Two-Folder Architecture:** Whatever is created, keep everything strictly separate in `D:\Germany\Learn German\German Website` for front end and back end into two folders ONLY. Keep all content organized correctly according to it without creating additional root folders like `packages` or `apps`.
8. **Project Reporting:** Every time a new feature is added, the AI must automatically update the `Report.md` file in the root directory. This file must contain a highly detailed and comprehensive report of the entire codebase architecture, data flows, and active features so that any new AI agent can read it and instantly understand everything about the project.
9. **Frontend-Backend Interconnection:** Any feature or data added to the frontend must be served or supported by the backend, and vice versa. The backend API is the single source of truth — the frontend must never derive, match, or compute data independently (e.g., sentence matching, vocabulary enrichment) that the backend could provide. Both folders must remain loosely coupled through API contracts, not through duplicated logic or direct file access across folders.
