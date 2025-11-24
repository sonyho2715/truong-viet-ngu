# Trường Việt Ngữ - Setup Guide

## 🎉 Project Status

Your Vietnamese Language School website has been created with:

✅ **Database Schema** - Complete Prisma schema with all models
✅ **Design System** - Vietnamese Catholic aesthetic (Navy, Gold, Cream colors)
✅ **Authentication** - iron-session based admin auth
✅ **Folder Structure** - Image upload folders ready
✅ **Fonts** - Playfair Display (headings) + Inter (body) with Vietnamese support
✅ **Validation** - Zod schemas for all forms

## 📁 Project Structure

```
truong-viet-ngu/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Public homepage
│   ├── globals.css         # Tailwind + custom colors
│   └── admin/              # Admin dashboard (to be built)
├── components/
│   ├── public/             # Public-facing components
│   ├── admin/              # Admin dashboard components
│   └── ui/                 # Shared UI components
├── lib/
│   ├── db.ts              # Prisma client singleton
│   ├── auth.ts            # Authentication functions
│   └── validations.ts     # Zod validation schemas
├── prisma/
│   ├── schema.prisma      # Complete database schema
│   └── seed.ts            # Database seeding script
└── public/uploads/        # Image upload folders
    ├── logos/
    ├── classrooms/
    ├── class-photos/
    ├── hero/
    └── announcements/
```

## 🚀 Quick Start

### Step 1: Set up Environment Variables

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add:

```env
# Database URL (use Railway or local PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"

# Session Secret (generate with: openssl rand -base64 32)
SESSION_SECRET="your-super-secret-session-key-at-least-32-characters-long"

# Environment
NODE_ENV="development"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 2: Generate Session Secret

```bash
openssl rand -base64 32
```

Copy the output to SESSION_SECRET in `.env`

### Step 3: Set up Database

#### Option A: Use Railway (Recommended)

```bash
# Login to Railway
railway login

# Create new project
railway init

# Add PostgreSQL
railway add

# Get DATABASE_URL
railway variables

# Copy DATABASE_URL to .env
```

#### Option B: Local PostgreSQL

Install PostgreSQL locally and create a database:

```bash
createdb truong_viet_ngu
```

Update DATABASE_URL in `.env`:

```env
DATABASE_URL="postgresql://localhost:5432/truong_viet_ngu"
```

### Step 4: Run Database Migrations

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with initial data
npm run db:seed
```

After seeding, you'll see:

```
🎉 Database seeding completed!

📊 Summary:
   - 1 admin user
   - 5 classes
   - 3 learning materials
   - 4 announcements
   - 1 site settings record

🔐 Admin Login Credentials:
   Email: admin@truongvietngu.com
   Password: Admin123!

⚠️  IMPORTANT: Change the admin password after first login!
```

### Step 5: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 🎨 Design System

### Colors

**Primary Colors:**
- Navy Blue: `#1e3a5f` (use `bg-brand-navy`, `text-brand-navy`)
- Gold: `#D4AF37` (use `bg-brand-gold`, `text-brand-gold`)
- Cream: `#FFFBEB` (use `bg-brand-cream`, `text-brand-cream`)

**Usage in Tailwind:**

```tsx
<div className="bg-brand-navy text-brand-gold">
  Content
</div>
```

### Typography

**Headings:** `font-serif` (Playfair Display)
**Body:** `font-sans` (Inter)

```tsx
<h1 className="font-serif text-3xl font-bold text-brand-navy">
  Heading
</h1>
<p className="font-sans text-base text-gray-700">
  Body text
</p>
```

## 📝 Database Schema

### Main Models

1. **Admin** - Admin users for dashboard
2. **Announcement** - Announcements (Choir, Bible, Events, Holidays)
3. **Class** - Classes (Mẫu giáo A/B/C, Lớp 1-5)
4. **LearningMaterial** - Learning resources (Tomathien.org links, PDFs)
5. **SiteSettings** - Site configuration (singleton)
6. **Image** - Image gallery (optional)
7. **AuditLog** - Change tracking (optional)

### Enums

**AnnouncementCategory:**
- CHOIR (Ca đoàn TNTT)
- BIBLE (Đọc Sách Thánh)
- EVENT (Sự kiện)
- GENERAL (Thông báo chung)
- HOLIDAY (Nghỉ lễ)

**GradeLevel:**
- MAU_GIAO_A/B/C (Kindergarten A/B/C)
- LOP_1/2/3/4/5 (Grades 1-5)

## 🖼️ Adding Images

### Manual Upload

1. Place images in appropriate folders:
   - `/public/uploads/logos/` - Organization logos
   - `/public/uploads/classrooms/` - Classroom photos
   - `/public/uploads/class-photos/` - Class group photos
   - `/public/uploads/hero/` - Hero backgrounds

2. Update database records via Prisma Studio:

```bash
npm run db:studio
```

Navigate to http://localhost:5555

### Recommended Images

**Logos (200x200px to 500x500px PNG):**
- `cong-doan-logo.png` - Left logo
- `tntt-logo.png` - Right logo

**Classroom Photos (800x600px JPG):**
- `classroom-mg-a.jpg`
- `classroom-mg-b.jpg`
- `classroom-mg-c.jpg`
- `classroom-1.jpg`
- `classroom-3.jpg`

**Class Photos (1200x800px JPG):**
- `class-mg-a-2024.jpg`
- `class-mg-b-2024.jpg`
- `class-1-2024.jpg`

## 🔐 Admin Dashboard

### Access

- URL: http://localhost:3000/admin/login
- Email: `admin@truongvietngu.com`
- Password: `Admin123!`

### Admin Features (To Be Built)

1. **Dashboard** - Overview stats
2. **Announcements** - CRUD operations
3. **Classes** - Manage classes with image upload
4. **Materials** - Manage learning resources
5. **Settings** - Site configuration

## 🛠️ Development Commands

```bash
# Development
npm run dev                # Start dev server

# Database
npm run db:generate        # Generate Prisma Client
npm run db:push            # Push schema to database
npm run db:migrate         # Create migration
npm run db:seed            # Seed database
npm run db:studio          # Open Prisma Studio
npm run db:reset           # Reset database (WARNING: deletes all data)

# Build
npm run build              # Build for production
npm run start              # Start production server

# Linting
npm run lint               # Run ESLint
```

## 📦 Current Implementation Status

### ✅ Completed

- [x] Project setup with Next.js 15
- [x] Database schema design
- [x] Authentication system
- [x] Design system (colors, fonts)
- [x] Image upload folder structure
- [x] Validation schemas
- [x] Database seeding script
- [x] Hero section component
- [x] Public homepage layout

### 🚧 In Progress

- [ ] Public homepage with announcements and classes display
- [ ] Admin login page
- [ ] Admin dashboard layout
- [ ] Announcements management (CRUD)
- [ ] Classes management with image upload
- [ ] Learning materials management
- [ ] Site settings management
- [ ] Image upload functionality

### 📋 To Do

- [ ] Navigation component
- [ ] Admin sidebar
- [ ] Data tables for admin
- [ ] Form components
- [ ] Image upload component
- [ ] Rich text editor for announcements
- [ ] Date picker component
- [ ] Toast notifications
- [ ] Loading states
- [ ] Error pages
- [ ] Deployment setup

## 🎯 Next Steps

### For Immediate Use:

1. **Set up database** (follow Step 3 above)
2. **Run seed script** to populate with sample data
3. **Start dev server** and view homepage
4. **Add your images** to upload folders
5. **Update site settings** via Prisma Studio

### For Development:

The foundation is ready! You can now:

1. Build admin pages (login, dashboard, CRUD operations)
2. Add navigation component
3. Enhance public pages with more features
4. Implement image upload functionality
5. Add rich text editor for announcements

## 📚 Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Zod Validation**: https://zod.dev
- **iron-session**: https://github.com/vvo/iron-session

## 🆘 Troubleshooting

### Database Connection Issues

```bash
# Check DATABASE_URL is correct
echo $DATABASE_URL

# Test connection
npx prisma db push
```

### Prisma Client Not Found

```bash
npm run db:generate
```

### Port 3000 Already in Use

```bash
# Kill process on port 3000
pkill -f "next dev"

# Or use different port
npm run dev -- -p 3001
```

### Build Errors

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma
npm run db:generate

# Build
npm run build
```

## 📞 Support

For issues or questions:
1. Check this SETUP.md file
2. Review the database schema in `prisma/schema.prisma`
3. Check validation schemas in `lib/validations.ts`
4. Review design specs in design documentation

---

**Last Updated:** 2025-11-22
**Version:** 1.0.0
