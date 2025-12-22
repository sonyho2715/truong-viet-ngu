'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Photo {
  src: string;
  alt: string;
  caption?: string;
}

const photos: Photo[] = [
  {
    src: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
    alt: 'Học sinh trong lớp học',
    caption: 'Lớp học tiếng Việt',
  },
  {
    src: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80',
    alt: 'Hoạt động nhóm TNTT',
    caption: 'Sinh hoạt TNTT',
  },
  {
    src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80',
    alt: 'Sự kiện cộng đồng',
    caption: 'Ngày hội cộng đồng',
  },
  {
    src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80',
    alt: 'Các em học sinh',
    caption: 'Học sinh vui vẻ',
  },
  {
    src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
    alt: 'Hoạt động văn hóa',
    caption: 'Văn hóa Việt Nam',
  },
  {
    src: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&q=80',
    alt: 'Học tập tập trung',
    caption: 'Học tập chăm chỉ',
  },
  {
    src: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
    alt: 'Lớp học nhóm',
    caption: 'Làm việc nhóm',
  },
  {
    src: 'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?w=600&q=80',
    alt: 'Thư viện trường',
    caption: 'Giờ đọc sách',
  },
  {
    src: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&q=80',
    alt: 'Hoạt động ngoài trời',
    caption: 'Vui chơi ngoài trời',
  },
];

export function PhotoGallerySection() {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <>
      <section className="bg-slate-50 px-6 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-bold text-slate-900 lg:text-4xl">
              Khoảnh Khắc Đáng Nhớ
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Những khoảnh khắc vui vẻ của học sinh và cộng đồng
            </p>
          </div>

          {/* Instagram-Style Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative aspect-square overflow-hidden rounded-lg bg-slate-200 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                {photo.caption && (
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full p-3 text-center text-sm font-medium text-white transition-transform group-hover:translate-y-0">
                    {photo.caption}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* View More CTA */}
          <div className="mt-12 text-center">
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-red-800 hover:shadow-xl"
            >
              Xem Thêm Hình Ảnh
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="relative max-h-[90vh] max-w-5xl">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src={selectedPhoto.src}
                alt={selectedPhoto.alt}
                fill
                className="object-contain"
              />
            </div>
            {selectedPhoto.caption && (
              <div className="mt-4 text-center">
                <p className="text-lg font-medium text-white">
                  {selectedPhoto.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
