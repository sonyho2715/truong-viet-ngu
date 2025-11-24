# Trường Việt Ngữ - Thiếu Nhi Thánh Thể

Vietnamese Language School website with admin dashboard for managing announcements, classes, and learning materials.

## 🎯 Quick Links

- **[Setup Guide](./SETUP.md)** - Complete installation and configuration instructions
- **[Project Summary](./PROJECT_SUMMARY.md)** - What's built, what's next, technical details
- **[Live Site](http://localhost:3000)** - After running `npm run dev`

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env and add your DATABASE_URL and SESSION_SECRET

# 3. Set up database
npm run db:generate
npm run db:push
npm run db:seed

# 4. Start development server
npm run dev
```

Visit http://localhost:3000

## 📁 What's Included

✅ **Complete Database Schema** - Announcements, Classes, Materials, Admin users
✅ **Authentication System** - Secure admin login with iron-session
✅ **Design System** - Vietnamese Catholic aesthetic (Navy, Gold, Cream)
✅ **Vietnamese Fonts** - Playfair Display + Inter with full diacritic support
✅ **Hero Section** - Professional header with logos
✅ **Image Upload Folders** - Organized structure for all media
✅ **Seed Data** - Sample content to get started

## 🎨 Design

**Colors:**
- Navy Blue `#1e3a5f` - Tradition and dignity
- Gold `#D4AF37` - Vietnamese heritage
- Cream `#FFFBEB` - Warmth and comfort

**Typography:**
- Headings: Playfair Display (elegant serif)
- Body: Inter (modern sans-serif)

Both fonts include complete Vietnamese character support.

## 💾 Database

**Models:**
- Admin - Admin users
- Announcement - Choir, Bible, Events, Holidays
- Class - Kindergarten (A/B/C) + Grades 1-5
- LearningMaterial - Tomathien.org links, PDFs
- SiteSettings - Site configuration

## 🔐 Admin Access

After seeding the database:

- URL: `/admin/login` (to be built)
- Email: `admin@truongvietngu.com`
- Password: `Admin123!`

## 📝 npm Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server

npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema to database
npm run db:migrate   # Create migration
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio GUI
npm run db:reset     # Reset database (⚠️ deletes data)
```

## 📂 Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Tailwind + colors
│   └── admin/                  # Admin routes (to build)
├── components/
│   ├── public/                 # Public components
│   ├── admin/                  # Admin components (to build)
│   └── ui/                     # Shared components
├── lib/
│   ├── db.ts                   # Prisma client
│   ├── auth.ts                 # Authentication
│   └── validations.ts          # Zod schemas
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.ts                 # Seed script
└── public/uploads/             # Image folders
```

## 🖼️ Adding Images

Place images in `/public/uploads/`:

```
uploads/
├── logos/              # cong-doan-logo.png, tntt-logo.png
├── classrooms/         # classroom-mg-a.jpg, classroom-1.jpg
├── class-photos/       # class-mg-a-2024.jpg, class-1-2024.jpg
└── hero/               # hero-background.jpg
```

Update database via Prisma Studio:
```bash
npm run db:studio
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** iron-session
- **Validation:** Zod
- **Fonts:** Google Fonts (Playfair Display, Inter)

## 📋 What's Next

### Priority 1: Admin Dashboard
- [ ] Login page
- [ ] Dashboard layout with sidebar
- [ ] Announcements CRUD
- [ ] Classes CRUD with image upload
- [ ] Materials CRUD
- [ ] Settings management

### Priority 2: Public Site
- [ ] Display announcements from database
- [ ] Display classes from database
- [ ] Navigation menu
- [ ] Footer

### Priority 3: Enhancements
- [ ] Rich text editor
- [ ] Image upload component
- [ ] Toast notifications
- [ ] Loading states
- [ ] Error pages

## 📚 Documentation

- [SETUP.md](./SETUP.md) - Detailed setup instructions
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Complete project overview
- [Prisma Schema](./prisma/schema.prisma) - Database structure
- [Validation Schemas](./lib/validations.ts) - Form validation

## 🆘 Troubleshooting

**Database connection failed?**
```bash
# Check your DATABASE_URL in .env
npx prisma db push
```

**Prisma Client not found?**
```bash
npm run db:generate
```

**Port 3000 in use?**
```bash
npm run dev -- -p 3001
```

**Build errors?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run db:generate
npm run build
```

## 📞 Support

See [SETUP.md](./SETUP.md) for detailed guides and [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for technical details.

## 📄 License

Private project for Thiếu Nhi Thánh Thể - Honolulu, HI

---

**Created:** 2025-11-22
**Version:** 1.0.0
**Status:** Foundation Complete ✅
