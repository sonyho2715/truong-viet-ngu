'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Calendar, School } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

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
    imageUrl: '/images/hero/tntt-group.jpg',
    title: null,
    subtitle: null,
    linkUrl: null,
    linkText: null,
  },
  {
    id: 'default-2',
    imageUrl: '/images/hero/school-group.jpg',
    title: null,
    subtitle: null,
    linkUrl: null,
    linkText: null,
  },
];

export function HeroCarousel() {
  const { t } = useLanguage();
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
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-900">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt="Vietnamese School Class"
              fill
              className="object-cover opacity-40"
              priority={index === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-yellow-300 font-medium text-sm mb-6">
            <School size={16} />
            <span>{t('home.hero.badge')}</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-serif">
            {t('home.hero.mainTitle1')} <span className="text-yellow-400">{t('home.hero.mainTitle2')}</span>,<br />
            {t('home.hero.mainTitle3')} <span className="text-red-500">{t('home.hero.mainTitle4')}</span>.
          </h1>

          {/* Description */}
          <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
            {t('home.hero.description')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/about"
              className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-red-900/30 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <BookOpen size={20} />
              {t('home.hero.viewProgram')}
            </Link>
            <Link
              href="/calendar"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2"
            >
              <Calendar size={20} />
              {t('home.hero.openingDate')}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => {
              goToPrevious();
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 10000);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/30 lg:left-8 z-20"
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
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/30 lg:right-8 z-20"
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
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3 z-20">
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
