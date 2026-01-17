# Database Setup Guide

This guide covers setting up PostgreSQL for {{APP_TITLE}}.

## Local Development

### Using Docker

```bash
docker run -d \
  --name {{APP_NAME}}-postgres \
  -e POSTGRES_USER={{APP_NAME}} \
  -e POSTGRES_PASSWORD=localdev \
  -e POSTGRES_DB={{APP_NAME}} \
  -p 5432:5432 \
  postgres:16-alpine
```

### Connection URL

```
DATABASE_URL="postgresql://{{APP_NAME}}:localdev@localhost:5432/{{APP_NAME}}?schema=public"
```

## Migrations

### Development

```bash
# Generate Prisma client
npm run prisma:generate

# Create and apply migration
npm run prisma:migrate

# Seed database
npm run prisma:seed
```

### Production

```bash
# Apply migrations without prompts
npm run prisma:migrate:deploy
```

## Schema Overview

The Prisma schema includes:

### User
- Discord user information
- Admin flag
- Timestamps

### Server
- Discord server/guild information
- Active status
- Premium flag

### ServerSettings
- Per-server configuration
- Command prefix
- Channel settings
- Feature toggles

### ServerMember
- User-Server relationship
- XP and levels
- Message counts

### CommandUsage
- Analytics tracking
- Execution times
- Error logging

### AppSetting
- Global key-value configuration

## Field Encryption

To enable field-level encryption for sensitive data:

1. Generate encryption key:
   ```bash
   openssl rand -base64 32
   ```

2. Add to secrets:
   ```bash
   echo -n "YOUR_KEY" | gcloud secrets create {{APP_NAME}}-field-encryption-key --data-file=-
   ```

3. Uncomment the encryption generator in `commons/prisma/schema.prisma`

4. Add `@encrypted` directive to fields:
   ```prisma
   model User {
     email String? @encrypted
   }
   ```

5. Regenerate client:
   ```bash
   npm run prisma:generate
   ```

## Backups

### Manual Backup

```bash
kubectl exec -n {{APP_NAME}} {{APP_NAME}}-postgresql-0 -- \
  pg_dump -U {{APP_NAME}} {{APP_NAME}} > backup.sql
```

### Restore

```bash
cat backup.sql | kubectl exec -i -n {{APP_NAME}} {{APP_NAME}}-postgresql-0 -- \
  psql -U {{APP_NAME}} {{APP_NAME}}
```