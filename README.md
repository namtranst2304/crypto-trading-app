# Crypto Trading App

A full-stack cryptocurrency trading application built with Next.js and GoFiber.

## Architecture

- **Frontend**: Next.js (TypeScript)
- **Backend**: GoFiber (Go)
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Deployment**: Docker + Docker Compose

## Quick Start

1. Clone the repository
2. Copy environment files:
   ```bash
   cp apps/web/.env.local.example apps/web/.env.local
   cp apps/api/.env.example apps/api/.env
   ```
3. Start the development environment:
   ```bash
   docker-compose up -d
   ```

## Development

### Frontend (Next.js)
```bash
cd apps/web
npm install
npm run dev
```

### Backend (GoFiber)
```bash
cd apps/api
go mod tidy
go run cmd/main.go
```

## Project Structure

```
crypto-app/
├── apps/
│   ├── web/               # Next.js frontend
│   └── api/               # GoFiber backend
├── infra/
│   ├── db/                # SQL migrations
│   └── docker/            # Docker configurations
├── shared/                # Shared types and constants
└── docker-compose.yml     # Development environment
```

## Features

- User authentication (register/login)
- Cryptocurrency price tracking
- Trading simulation
- Watchlist management
- User dashboard
- Real-time price updates
