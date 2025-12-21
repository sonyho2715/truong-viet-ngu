# Truong Viet Ngu

## Project Overview
Vietnamese language school management platform. Handles student enrollment, classes, and administration.

## Tech Stack
- **Framework:** Next.js (App Router)
- **Database:** PostgreSQL + Prisma
- **Auth:** iron-session + bcryptjs
- **Dates:** date-fns
- **Icons:** Lucide React

## Key Features
- Student management
- Class scheduling
- Enrollment system
- Administrative dashboard

## Database Commands
```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema
npm run db:migrate    # Create migration
npm run db:seed       # Seed data
npm run db:studio     # Prisma Studio
npm run db:reset      # Reset database
```

## Auth Pattern
Standard iron-session pattern:
```typescript
import { getSession } from '@/lib/auth';
```

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection
- `SESSION_SECRET` - iron-session secret

## Deployment
- **Hosting:** Vercel
- **Database:** Railway PostgreSQL

## Notes
- Standard Next.js + Prisma stack
- Vietnamese language school context
- May have bilingual content needs
