import Image from 'next/image';
import Link from 'next/link';
import { Camera, Calendar, Images } from 'lucide-react';
import { db } from '@/lib/db';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Breadcrumb } from '@/components/public/Breadcrumb';

export const metadata = {
  title: 'Thư Viện Ảnh | Trường Việt Ngữ',
  description: 'Hình ảnh các hoạt động, sự kiện và lớp học của Trường Việt Ngữ',
};

export default async function GalleryPage() {
  const albums = await db.galleryAlbum.findMany({
    where: { isActive: true },
    include: {
      photos: {
        take: 1,
        orderBy: { displayOrder: 'asc' },
      },
      _count: {
        select: { photos: true },
      },
    },
    orderBy: [{ displayOrder: 'asc' }, { eventDate: 'desc' }],
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-900/90 py-16 text-white">
        <div className="container mx-auto px-4">
          <Breadcrumb items={[{ label: 'Thư Viện Ảnh' }]} />
          <div className="mx-auto max-w-3xl text-center">
            <Camera className="mx-auto mb-4 h-16 w-16 text-yellow-400" />
            <h1 className="font-serif text-4xl font-bold md:text-5xl">
              Thư Viện Ảnh
            </h1>
            <p className="mt-4 text-lg text-brand-cream/90">
              Những khoảnh khắc đáng nhớ của Trường Việt Ngữ
            </p>
          </div>
        </div>
      </section>

      {/* Albums Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {albums.length > 0 ? (
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {albums.map((album) => {
                  const coverImage =
                    album.coverImage || album.photos[0]?.imageUrl;

                  return (
                    <Link
                      key={album.id}
                      href={`/gallery/${album.id}`}
                      className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-lg"
                    >
                      {/* Cover Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        {coverImage ? (
                          <Image
                            src={coverImage}
                            alt={album.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-900/80">
                            <Images className="h-16 w-16 text-yellow-400/50" />
                          </div>
                        )}
                        {/* Photo Count Badge */}
                        <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-sm font-medium text-white">
                          {album._count.photos} ảnh
                        </div>
                      </div>

                      {/* Album Info */}
                      <div className="p-5">
                        <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-yellow-400">
                          {album.title}
                        </h3>
                        {album.eventDate && (
                          <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="h-4 w-4" />
                            {new Date(album.eventDate).toLocaleDateString(
                              'vi-VN',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )}
                          </p>
                        )}
                        {album.description && (
                          <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                            {album.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-md text-center">
              <Camera className="mx-auto h-16 w-16 text-gray-300" />
              <h2 className="mt-4 font-serif text-2xl font-bold text-gray-600">
                Chưa có album ảnh
              </h2>
              <p className="mt-2 text-gray-500">
                Các album ảnh sẽ được cập nhật sớm.
              </p>
              <Link
                href="/"
                className="mt-6 inline-block rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-slate-900 transition-colors hover:bg-yellow-400/90"
              >
                Về trang chủ
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
