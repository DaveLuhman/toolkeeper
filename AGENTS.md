# AGENTS.md

## Cursor Cloud specific instructions

**ToolKeeper** is a full-stack multi-tenant SaaS tool crib management app (Node.js 22 + Express + MongoDB + Handlebars + TailwindCSS/DaisyUI).

### Required services

| Service | How to start |
|---------|-------------|
| MongoDB | `mongod --dbpath /data/db --fork --logpath /tmp/mongod.log` |
| Express dev server | `npm run dev` (nodemon, port 5000) |

### Key commands

| Task | Command |
|------|---------|
| Install deps | `npm ci` |
| Build CSS | `npm run build:css` |
| Watch CSS (dev) | `npm run watch:css` |
| Run tests | `NODE_ENV=test npx vitest run` |
| Dev server | `npm run dev` |

### Non-obvious caveats

- **MongoDB must be running** before starting the dev server or it will fail with a connection error (retries 3 times then exits).
- **Barcodes are required fields** when creating tools. The new tool form will not submit without a barcode value.
- The `.env` file goes in the project root (not `src/config/`). The server loads it via `import "dotenv/config"` from the working directory. A `.env.test` with `MONGO_URI` is also needed for tests (winston-mongodb transport requires it even though tests use MongoMemoryServer).
- **vitest** is listed in devDependencies in v3.0.0. Run tests with `NODE_ENV=test npx vitest run`.
- On first startup with an empty database, the app auto-seeds a default admin user (`admin@toolkeeper.site` / `asdfasdf`), demo user (`demo@toolkeeper.site` / `demo`), tenant, subscription, categories, and service assignments.
- TailwindCSS must be built before the app can serve styled pages: `npm run build:css`.
- Some test files have pre-existing failures (subscription/tenant schema mismatches, controller tests lacking auth mocking). These are not environment issues.
- The `NODE_ENV=development` setting uses in-memory sessions (no MongoDBStore), so sessions don't persist across server restarts.
- Optional services (SMTP, LemonSqueezy, Wasabi S3) are not needed for local development; the app degrades gracefully without them.
