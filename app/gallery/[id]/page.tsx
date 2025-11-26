'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Breadcrumb } from '@/components/public/Breadcrumb';

interface Photo {
  id: string;
  imageUrl: string;
  caption: string | null;
}

interface Album {
  id: string;
  title: string;
  description: string | null;
  eventDate: string | null;
  photos: Photo[];
}

export default function AlbumPage() {
  const params = useParams();
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchAlbum();
  }, [params.id]);

  const fetchAlbum = async () => {
    try {
      const res = await fetch(`/api/gallery/${params.id}`);
      const data = await res.json();
      if (data.success) {
        setAlbum(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch album:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  };

  const goToPrevious = () => {
    if (album && lightboxIndex !== null) {
      setLightboxIndex(
        lightboxIndex === 0 ? album.photos.length - 1 : lightboxIndex - 1
      );
    }
  };

  const goToNext = () => {
    if (album && lightboxIndex !== null) {
      setLightboxIndex(
        lightboxIndex === album.photos.length - 1 ? 0 : lightboxIndex + 1
      );
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <Navigation />
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-navy border-t-transparent"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <Images className="mx-auto h-16 w-16 text-gray-300" />
          <h1 className="mt-4 font-serif text-2xl font-bold text-gray-600">
            Không tìm thấy album
          </h1>
          <Link
            href="/gallery"
            className="mt-6 inline-block rounded-lg bg-brand-navy px-6 py-3 font-semibold text-white"
          >
            Quay lại thư viện
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-navy to-brand-navy/90 py-12 text-white">
        <div className="container mx-auto px-4">
          <Breadcrumb
            items={[
              { label: 'Thư Viện Ảnh', href: '/gallery' },
              { label: album.title },
            ]}
          />
          <div className="flex items-center gap-4">
            <Link
              href="/gallery"
              className="rounded-lg border border-white/30 p-2 hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-serif text-3xl font-bold md:text-4xl">
                {album.title}
              </h1>
              {album.eventDate && (
                <p className="mt-2 flex items-center gap-2 text-brand-cream/80">
                  <Calendar className="h-4 w-4" />
                  {new Date(album.eventDate).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
              {album.description && (
                <p className="mt-2 text-brand-cream/80">{album.description}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <p className="mb-6 text-sm text-gray-500">
            {album.photos.length} ảnh - Nhấn vào ảnh để xem lớn hơn
          </p>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {album.photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => openLightbox(index)}
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
              >
                <Image
                  src={photo.imageUrl}
                  alt={photo.caption || `Ảnh ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {photo.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-sm text-white">{photo.caption}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Navigation arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 rounded-full bg-white/10 p-3 text-white hover:bg-white/20"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          {/* Image */}
          <div className="relative h-[80vh] w-[90vw] max-w-5xl">
            <Image
              src={album.photos[lightboxIndex].imageUrl}
              alt={album.photos[lightboxIndex].caption || ''}
              fill
              className="object-contain"
            />
          </div>

          {/* Caption and counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white">
            {album.photos[lightboxIndex].caption && (
              <p className="mb-2">{album.photos[lightboxIndex].caption}</p>
            )}
            <p className="text-sm text-gray-400">
              {lightboxIndex + 1} / {album.photos.length}
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
