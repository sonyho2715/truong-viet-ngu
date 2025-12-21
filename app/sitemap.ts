import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://truong-viet-ngu.vercel.app';

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/blog',
    '/calendar',
    '/contact',
    '/customer-journey',
    '/faq',
    '/gallery',
    '/materials',
    '/roadmap',
    '/teachers',
    '/tntt',
    '/volunteer',
    '/register',
    '/register/teacher',
    '/parent/login',
    '/parent/register',
    '/teacher/login',
  ];

  const staticRoutes = staticPages.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic blog posts
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await db.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    blogRoutes = posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));
  } catch {
    // Database might not be available during build
    console.log('Sitemap: Could not fetch blog posts');
  }

  // Dynamic gallery albums
  let galleryRoutes: MetadataRoute.Sitemap = [];
  try {
    const albums = await db.galleryAlbum.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true },
    });

    galleryRoutes = albums.map((album) => ({
      url: `${baseUrl}/gallery/${album.id}`,
      lastModified: album.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));
  } catch {
    console.log('Sitemap: Could not fetch gallery albums');
  }

  return [...staticRoutes, ...blogRoutes, ...galleryRoutes];
}
