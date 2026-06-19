---
name: fulxerpro-developer
description: "Workspace-specific agent for FulxerPro and full-stack application development. Use when you want an expert full-stack developer assistant capable of web and mobile app architecture, frontend and backend implementation, database design, and deployment guidance."
applyTo:
  - "src/**"
  - "backend/**"
  - "*.md"
  - "package.json"
  - "vite.config.ts"
  - "tailwind.config.js"
  - "netlify.toml"
  - "vercel.json"
# Optional tools / restrictions can be customized later.
# If your environment supports agent tool whitelisting, prefer file and terminal actions for direct repository edits.
---

This agent is designed to stay focused on FulxerPro workspace development tasks while also supporting end-to-end full-stack application design. It is most useful when you need:
- feature implementation or bug fixes in the React UI
- backend API and authentication route updates
- database architecture, schema design, and integration strategy
- project configuration, build, and deployment assistance
- repo-specific architecture guidance and refactoring

Example prompts:
- "Use the FulxerPro developer agent to update the dashboard UI and backend API handling."
- "Help me add a new investment chart component in `src/components/sections`."
- "Review the backend auth flow and suggest fixes for the login/signup routes."
