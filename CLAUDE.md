# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a collection of six self-contained sample applications demonstrating Dokploy deployment patterns. Each subdirectory is an independent project with its own Dockerfile and `dokploy.yaml`.

## Local Development

Each project with a database dependency has its own `docker-compose.yml` for local development:

```bash
# Express + PostgreSQL
cd 03-express-postgres && docker-compose up

# FastAPI + MongoDB
cd 04-fastapi-mongodb && docker-compose up

# Node.js Worker (API + Worker + Redis)
cd 05-node-worker && docker-compose up
```

Run all projects together from the root:
```bash
docker-compose up
```

### Per-project dev commands (Node.js projects)

All Node.js projects (`02-nextjs-app`, `03-express-postgres`, `05-node-worker`, `06-cron-job`) share the same pattern:

```bash
npm install
npm run dev          # ts-node-dev with hot reload
npm run build        # tsc → dist/
npm run start        # node dist/index.js
```

For `05-node-worker`, the worker process runs separately:
```bash
npm run worker       # dev mode
npm run start:worker # production
```

For `03-express-postgres`, Prisma commands:
```bash
npm run prisma:generate   # generate client
npm run prisma:migrate    # deploy migrations
npm run prisma:studio     # open Prisma Studio UI
```

For `02-nextjs-app`:
```bash
npm run lint
```

### FastAPI (04-fastapi-mongodb)

```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Architecture

Each project follows a deploy-to-Dokploy pattern using two config files:

- **`Dockerfile`** — production image build
- **`dokploy.yaml`** — Dokploy-specific: registry credentials, container config, domains, health checks, resource limits, replicas, and database declarations

For local iteration, projects that need infrastructure (`03`, `04`, `05`) each include a `docker-compose.yml` that wires the app container to its database.

### Project-specific notes

| Project | Port | Key dependency | Notes |
|---------|------|---------------|-------|
| 01-static-website | 80 | Nginx | Pure static files |
| 02-nextjs-app | 3000 | — | SSR + API routes under `src/app` |
| 03-express-postgres | 3000 | PostgreSQL | Prisma ORM; schema in `prisma/schema.prisma` |
| 04-fastapi-mongodb | 8000 | MongoDB | Motor async driver; flat file layout (no src/) |
| 05-node-worker | 3000 | Redis | Two Dockerfiles: `Dockerfile` (API) and `Dockerfile.worker` (Bull worker) |
| 06-cron-job | — | — | Background only; no exposed port |

**05-node-worker dual-container pattern**: the `dokploy.yaml` declares two containers from the same image — `api` runs the default entrypoint (Express server) and `worker` overrides the command to `node dist/worker.js`.

## Deployment

Deploy each project independently to Dokploy using the same Git repo with different Build Paths:

| Project | Build Path | Required Dokploy DB |
|---------|-----------|---------------------|
| 01-static-website | /01-static-website | — |
| 02-nextjs-app | /02-nextjs-app | — |
| 03-express-postgres | /03-express-postgres | PostgreSQL |
| 04-fastapi-mongodb | /04-fastapi-mongodb | MongoDB |
| 05-node-worker | /05-node-worker | Redis |
| 06-cron-job | /06-cron-job | — |

The root `dokploy.yaml` + `docker-compose.yml` support an optional all-in-one compose-based deployment.
