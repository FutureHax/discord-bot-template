# {{APP_TITLE}} - Discord Bot Template

A production-ready Discord bot template with multi-service architecture, featuring a Discord.js bot, Express API, Next.js dashboard, and Kubernetes deployment with Flux GitOps.

## Features

- **Discord.js 14** - Modern Discord bot with slash commands
- **Express API** - RESTful API service for bot management
- **Next.js Dashboard** - Admin interface with Chakra UI
- **Prisma ORM** - Type-safe database access with PostgreSQL
- **Redis** - Caching and pub/sub support
- **Kubernetes** - Helm charts with Gateway API
- **Flux GitOps** - Automated deployments
- **Semantic Release** - Automated versioning
- **Multi-arch Docker** - AMD64 and ARM64 support

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Discord Bot   │    │   API Service   │    │    Dashboard    │
│  (Discord.js)   │───▶│    (Express)    │◀───│    (Next.js)   │
└────────┬────────┘    └────────┬────────┘    └─────────────────┘
        │                       │
        └───────────┬───────────┘
                    │
        ┌───────────┴───────────┐
        │    Commons Library    │
        │ (Prisma, Redis, Log)  │
        └───────────┬───────────┘
                    │
    ┌─────────────┼─────────────┐
    │             │             │
┌───┴────┐   ┌────┴─────┐   ┌───┴────┐
│PostgreSQL│   │   Redis   │   │   GSM   │
└──────────┘   └───────────┘   └─────────┘
```

## Quick Start

### Prerequisites

- Node.js 20+
- Docker
- PostgreSQL (local or cloud)
- Discord Bot Token

### Local Development

1. **Clone and install**
   ```bash
   git clone https://github.com/{{GITHUB_ORG}}/{{APP_NAME}}.git
   cd {{APP_NAME}}
   npm install
   cd commons && npm install && cd ..
   cd api-service && npm install && cd ..
   cd dashboard && npm install && cd ..
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Discord token and database URL
   ```

3. **Setup database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```

4. **Start development**
   ```bash
   # Terminal 1 - Bot
   npm run dev
   
   # Terminal 2 - API
   cd api-service && npm run dev
   
   # Terminal 3 - Dashboard
   cd dashboard && npm run dev
   ```

### Using the Template

1. Replace all placeholders in the codebase:
   - `{{APP_NAME}}` - Your app name (kebab-case, e.g., `my-discord-bot`)
   - `{{APP_TITLE}}` - Display name (e.g., `My Discord Bot`)
   - `{{GITHUB_ORG}}` - Your GitHub org/username
   - `{{GCP_PROJECT}}` - GCP project ID
   - `{{DOCKER_REGISTRY}}` - Container registry URL
   - `{{DISCORD_CLIENT_ID}}` - Discord application ID
   - `{{DOMAIN}}` - Dashboard domain

2. Create Discord application at https://discord.com/developers

3. Setup secrets in Google Secret Manager

4. Deploy with Flux or Helm

## Project Structure

```
{{APP_NAME}}/
├── src/                    # Discord bot service
│   ├── commands/           # Slash commands
│   ├── events/             # Discord event handlers
│   ├── loaders/            # Command/event loaders
│   ├── services/           # API clients
│   └── index.js            # Bot entrypoint
├── api-service/            # Express API
│   └── src/
│       ├── routes/         # API routes
│       └── index.js        # API entrypoint
├── dashboard/              # Next.js dashboard
│   └── src/
│       ├── app/            # App Router pages
│       ├── providers/      # React providers
│       └── lib/            # Utilities
├── commons/                # Shared library
│   ├── src/
│   │   ├── config.js       # Shared config
│   │   ├── utils/          # Logger, etc.
│   │   ├── db/             # Prisma wrapper
│   │   ├── redis/          # Redis client
│   │   └── middleware/     # Express middleware
│   └── prisma/
│       └── schema.prisma   # Database schema
├── chart/{{APP_NAME}}/     # Helm chart
├── flux/                   # Flux GitOps configs
├── .github/workflows/      # CI/CD pipelines
├── Dockerfile              # Bot Dockerfile
├── docker-bake.hcl         # Multi-service builds
└── Taskfile.yml            # Task automation
```

## Commands

The bot includes these example slash commands:

| Command | Description |
|---------|-------------|
| `/ping` | Check bot latency |
| `/help` | Show available commands |
| `/status` | Display bot status |
| `/setup` | Configure server settings (Admin) |

## Documentation

- [GCP Setup Guide](docs/GCP_SETUP.md)
- [Kubernetes Setup](docs/KUBERNETES_SETUP.md)
- [Secret Management](docs/SECRET_MANAGEMENT.md)
- [Database Guide](docs/DATABASE_SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)

## Development Tasks

Using [Taskfile](https://taskfile.dev):

```bash
# Show all tasks
task

# Development
task dev              # Start bot
task dev:api          # Start API
task dev:dashboard    # Start dashboard

# Database
task db:migrate       # Run migrations
task db:seed          # Seed database
task db:studio        # Open Prisma Studio

# Docker
task docker:build     # Build all images
task docker:push      # Push to registry

# Kubernetes
task helm:install:dev # Deploy to dev
task flux:status      # Check Flux status
```

## License

MIT License - see [LICENSE](LICENSE) for details.