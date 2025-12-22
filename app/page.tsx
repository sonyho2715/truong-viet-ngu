import { Navigation } from '@/components/public/Navigation';
import { HeroCarousel } from '@/components/public/HeroCarousel';
import { ValuesSection } from '@/components/public/ValuesSection';
import { ClassesSection } from '@/components/public/ClassesSection';
import { ScheduleSection } from '@/components/public/ScheduleSection';
import { Footer } from '@/components/public/Footer';
import { db } from '@/lib/db';
import { Class, Teacher } from '@prisma/client';

// Force dynamic rendering to avoid database connection at build time
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch classes from database
  let classes: (Class & {
    teacher: Pick<Teacher, 'id' | 'firstName' | 'lastName'> | null;
  })[] = [];

  try {
    // Fetch classes (active only)
    classes = await db.class.findMany({
      where: {
        isActive: true,
      },
      include: {
        teacher: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    // Continue with empty data - fallback values will be used
  }

  return (
    <>
      {/* Navigation Bar */}
      <Navigation />

      <main id="main-content" className="min-h-screen">
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Mission Section */}
        <ValuesSection />

        {/* Programs Section */}
        <ClassesSection classes={classes} />

        {/* Schedule Section */}
        <ScheduleSection />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
