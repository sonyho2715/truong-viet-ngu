'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface Slide {
  id: string;
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  linkUrl: string | null;
  linkText: string | null;
}

// Default slides (used when no database slides are available)
const defaultSlides: Slide[] = [
  {
    id: 'default-1',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80',
    title: 'Chào Mừng Đến Với Trường Việt Ngữ',
    subtitle: 'Giáo dục tiếng Việt và văn hóa cho thế hệ trẻ',
    linkUrl: '/about',
    linkText: 'Tìm Hiểu Thêm',
  },
  {
    id: 'default-2',
    imageUrl: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&q=80',
    title: 'Thiếu Nhi Thánh Thể',
    subtitle: 'Nuôi dưỡng đức tin và truyền thống Công Giáo',
    linkUrl: '/tntt',
    linkText: 'Xem Chương Trình TNTT',
  },
  {
    id: 'default-3',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&q=80',
    title: 'Cộng Đồng Của Chúng Ta',
    subtitle: 'Xây dựng cầu nối văn hóa Việt Nam tại Hawaii',
    linkUrl: '/#contact',
    linkText: 'Tham Gia Cùng Chúng Tôi',
  },
];

export function HeroCarousel() {
  const [slides, setSlides] = useState<Slide[]>(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch slides from database
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch('/api/slideshow');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setSlides(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch slides:', error);
        // Keep default slides
      }
    };

    fetchSlides();
  }, []);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Auto-play
  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, goToNext, slides.length]);

  return (
    <section className="relative h-[500px] overflow-hidden md:h-[600px] lg:h-[700px]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.imageUrl}
              alt={slide.title || 'Slideshow'}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/40" />
          </div>

          {/* Content */}
          <div className="relative flex h-full items-center">
            <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
              <div className="max-w-2xl">
                {slide.title && (
                  <h1 className="font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>
                )}
                {slide.subtitle && (
                  <p className="mt-6 text-xl text-slate-200 md:text-2xl">
                    {slide.subtitle}
                  </p>
                )}
                {slide.linkUrl && slide.linkText && (
                  <div className="mt-8 flex flex-wrap gap-4">
                    <a
                      href={slide.linkUrl}
                      className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-8 py-4 font-semibold text-white shadow-xl transition-all hover:bg-red-800 hover:shadow-2xl"
                    >
                      {slide.linkText}
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => {
              goToPrevious();
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 10000);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/30 lg:left-8"
            aria-label="Previous slide"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => {
              goToNext();
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 10000);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/30 lg:right-8"
            aria-label="Next slide"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-yellow-400'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
