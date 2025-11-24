import { Navigation } from '@/components/public/Navigation';
import { HeroCarousel } from '@/components/public/HeroCarousel';
import { AnnouncementsSection } from '@/components/public/AnnouncementsSection';
import { HighlightsSection } from '@/components/public/HighlightsSection';
import { ValuesSection } from '@/components/public/ValuesSection';
import { ClassesSection } from '@/components/public/ClassesSection';
import { PhotoGallerySection } from '@/components/public/PhotoGallerySection';
import { WelcomeSection } from '@/components/public/WelcomeSection';
import { Footer } from '@/components/public/Footer';
import { db } from '@/lib/db';
import { Announcement, Class, SiteSetting } from '@prisma/client';

// Force dynamic rendering to avoid database connection at build time
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch site settings from database (with fallback defaults)
  let siteSettings: SiteSetting | null = null;
  let announcements: Announcement[] = [];
  let classes: Class[] = [];

  try {
    siteSettings = await db.siteSetting.findFirst();

    // Fetch announcements (active and within date range)
    announcements = await db.announcement.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { priority: 'desc' },
        { startDate: 'desc' },
      ],
    });

    // Fetch classes (active only)
    classes = await db.class.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    // Continue with empty data - fallback values will be used
  }

  const settings = {
    organizationName: siteSettings?.organizationName || 'Trường Việt Ngữ',
    subtitle: siteSettings?.subtitle || 'Thiếu Nhi Thánh Thể',
    location: siteSettings?.location || 'Honolulu, HI',
    heroBackgroundColor: siteSettings?.heroBackgroundColor || '#1e3a5f',
    leftLogoUrl: siteSettings?.leftLogoUrl || null,
    rightLogoUrl: siteSettings?.rightLogoUrl || null,
    welcomeMessage: siteSettings?.welcomeMessage ||
      'Chào mừng đến với Trường Việt Ngữ - Thiếu Nhi Thánh Thể. Chúng tôi cam kết giảng dạy tiếng Việt và giáo lý Công Giáo cho thế hệ trẻ với tình yêu thương và sự tận tâm.',
    contactEmail: siteSettings?.contactEmail || 'info@truongvietngu.com',
    contactPhone: siteSettings?.contactPhone || '(808) 123-4567',
    address: siteSettings?.address || '123 Church Street, Honolulu, HI 96817',
  };

  return (
    <>
      {/* Navigation Bar */}
      <Navigation />

      <main className="min-h-screen">
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Announcements Section */}
        <AnnouncementsSection announcements={announcements} />

        {/* Highlights Section */}
        <HighlightsSection />

        {/* Values Section */}
        <ValuesSection />

        {/* Classes Section */}
        <ClassesSection classes={classes} />

        {/* Photo Gallery Section */}
        <PhotoGallerySection />

        {/* Welcome & Contact Section */}
        <WelcomeSection
          welcomeMessage={settings.welcomeMessage}
          contactEmail={settings.contactEmail}
          contactPhone={settings.contactPhone}
          address={settings.address}
        />

        {/* Footer */}
        <Footer />
      </main>
    </>
  );
}
