# Deploying EduPath to Render

This repository contains both the frontend (Vite + React) and backend (Express) under `server/`.
The included `render.yaml` manifest will create two services on Render:

- `edupath-backend` — Node web service serving the API (from `server/server.js`).
- `edupath-frontend` — Static site (Vite build output) that will serve the frontend.

What I added
- `render.yaml` — manifest for Render (backend web service + frontend static site).
- `DEPLOY_RENDER.md` (this file) — step-by-step instructions.

Quick deploy steps (recommended)
1. Push this repo to your Git provider (GitHub/GitLab/Bitbucket).
2. Open https://dashboard.render.com and "New +" -> "Import from Git" and connect the repo.
3. When Render detects `render.yaml` it will propose the two services. Review and create them.

Required environment variables (for the backend service on Render)
- `DB_HOST` — database host (for Render you can use an external MySQL or Render's managed database)
- `DB_USER` — database user
- `DB_PASSWORD` — db password
- `DB_NAME` — database name
- `JWT_SECRET` — JWT signing secret

Frontend configuration
- Set `VITE_API_BASE` on the frontend service to your backend's public URL, for example:
  `https://edupath-backend.onrender.com/api`

Notes and troubleshooting
- The backend expects a MySQL database. If you want Render-managed Postgres, you'll need to update the server DB code.
- For local dev, the frontend falls back to `http://localhost:5000/api` if `VITE_API_BASE` is not set.
- If you need me to set up the Render services automatically (using Render CLI) or update the server to support Postgres, tell me which provider and I can continue.

Commands you can run locally to validate before deploy

```bash
# install front and server deps
npm run install-all

# run front+server concurrently (dev)
npm run dev

# build only (for static site preview)
npm run build
# preview build
npm run preview
```

If you'd like I can:
- Create the services in your Render account using the Render CLI (you must provide Render API key), or
- Walk you through the Render dashboard step-by-step while you create the services.

Tell me which option you prefer: `manifest-only` (I already added files), `render-cli` (I will run the Render CLI here if you provide an API key), or `guided` (I'll give a step-by-step dashboard walkthrough).