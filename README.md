# On My Plate

This workspace is organized as a simple full-stack scaffold:

```text
frontend/   # React UI area
backend/    # API server area
shared/     # Code or types shared by both sides
docs/       # Project notes and documentation
scripts/    # Utility scripts
```

## Current State

- The frontend app now lives in `frontend/`.
- The backend scaffold lives in `backend/`.
- Shared code, docs, and scripts stay at the workspace root.

## Backend Starter

The backend scaffold includes:

- `src/server.js` for bootstrapping the HTTP server
- `src/app.js` for Express app setup
- `src/routes/` for route definitions
- `src/controllers/` for request handlers
- `src/middleware/` for cross-cutting logic
- `src/config/` for environment and app configuration

## Next Steps

1. Add backend dependencies and connect routes to real data sources.
2. Keep shared contracts in `shared/` once frontend and backend start exchanging types or schemas.
3. Add workspace-level tooling if you want a single command to run both apps together.
