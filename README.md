# LandChecker

Full-stack property search app. Rails API backend + React frontend.

**Stack:** Ruby 4.0.4 · Rails · PostgreSQL 16 · Redis 7 · React · TypeScript · Vite · Tailwind · shadcn/ui · Devise JWT · ActionCable

---

## Prerequisites

| Tool | Version |
|------|---------|
| Ruby | 4.0.4 |
| Node | 24+ |
| pnpm | 10+ (`corepack enable pnpm`) |
| Docker + Docker Compose | Latest |
| PostgreSQL 16 | (or use Docker) |
| Redis 7 | (or use Docker) |

---

## Development

### Option A — Docker for services, local for app (recommended)

Start PostgreSQL + Redis + Rails server via Docker:

```bash
cd backend
docker compose up
```

This starts:
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`
- Rails API on `localhost:3001` (with live code reload via volume mount)

In a separate terminal, start the frontend:

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend runs on `http://localhost:5173`.

> **Mock data:** By default the frontend uses mock data (`VITE_USE_MOCK=true`).
> To hit the real Rails backend, create `frontend/.env.local`:
> ```
> VITE_USE_MOCK=false
> VITE_API_URL=http://localhost:3001
> ```

---

### Option B — Fully local (no Docker)

**Backend setup:**

```bash
cd backend

# Install gems
bundle install

# Copy and configure env
cp .env.example .env  # create this if needed, or export vars manually
export DATABASE_URL=postgresql://localhost:5432/landchecker_dev
export REDIS_URL=redis://localhost:6379/0
export DEVISE_JWT_SECRET_KEY=$(openssl rand -hex 64)
export RAILS_ENV=development

# Setup database
bin/rails db:create db:migrate db:seed

# Start server
bin/rails server -p 3001
```

**Frontend setup:**

```bash
cd frontend
pnpm install
pnpm dev
```

---

### Running tests

**Backend (RSpec):**

```bash
cd backend
bundle exec rspec
```

**Frontend (Vitest):**

```bash
cd frontend
pnpm test        # watch mode
pnpm test:run    # single run
pnpm test:coverage
```

---

## Production Deployment

### Server requirements

- Ubuntu 22.04+ with Docker + Docker Compose installed
- Ports **80** and **443** open in firewall
- Domain `landchecker.lovenangelo.dev` pointed at the server's IP

### 1. Clone repo on server

```bash
git clone <repo-url> landchecker
cd landchecker
```

### 2. Create env file

```bash
cp .env.prod.example .env.prod
```

Fill in `.env.prod`:

```env
POSTGRES_USER=landchecker_user
POSTGRES_PASSWORD=<strong-password>
POSTGRES_DB=landchecker_production

# Generate with: openssl rand -hex 64
DEVISE_JWT_SECRET_KEY=<generated>

# Contents of backend/config/master.key
RAILS_MASTER_KEY=<master-key>
```

### 3. Get Rails master key

If deploying from local machine, copy the key:

```bash
# On local machine
cat backend/config/master.key
```

Paste that value into `RAILS_MASTER_KEY` in `.env.prod`.

### 4. Build and start

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

This starts:
- PostgreSQL (internal only, no exposed port)
- Redis (internal only, no exposed port)
- Rails backend via Thruster on internal port 80
- Nginx serving frontend static files on internal port 80
- Caddy on ports 80/443 — handles SSL and routes traffic

Caddy automatically obtains a Let's Encrypt SSL certificate on first boot.

### 5. Verify

```bash
# Check all services healthy
docker compose -f docker-compose.prod.yml ps

# Tail logs
docker compose -f docker-compose.prod.yml logs -f

# Check Rails health endpoint
curl https://landchecker.lovenangelo.dev/api/up
```

---

### Traffic routing (production)

```
Browser → Caddy (443/SSL)
           ├── /api/*   → backend:80  (Rails via Thruster)
           ├── /cable   → backend:80  (ActionCable WebSocket)
           └── /*       → frontend:80 (Nginx static SPA)
```

---

### Useful production commands

```bash
# Run Rails console
docker compose -f docker-compose.prod.yml exec backend bin/rails console

# Run migrations manually
docker compose -f docker-compose.prod.yml exec backend bin/rails db:migrate

# Rebuild and redeploy a single service
docker compose -f docker-compose.prod.yml up -d --build backend

# View Caddy SSL certificate status
docker compose -f docker-compose.prod.yml exec caddy caddy list-certificates
```

---

## Project structure

```
landchecker/
├── backend/              # Rails API
│   ├── app/
│   │   ├── controllers/api/v1/
│   │   ├── models/
│   │   └── jobs/
│   ├── spec/             # RSpec tests
│   ├── docker-compose.yml  # Dev compose (DB + Redis + Rails)
│   └── Dockerfile          # Production image
├── frontend/             # React + Vite
│   ├── src/
│   │   ├── api/          # Axios API clients
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/        # Zustand stores
│   │   └── types/
│   ├── Dockerfile          # Production image (Nginx)
│   └── nginx.conf
├── docker-compose.prod.yml # Production compose (all services)
├── Caddyfile               # Caddy reverse proxy + SSL config
└── .env.prod.example       # Production env template
```
