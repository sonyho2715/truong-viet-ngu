'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Slide {
  id: string;
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  linkUrl: string | null;
  linkText: string | null;
}

interface HeroSlideshowProps {
  slides: Slide[];
  autoPlayInterval?: number;
}

export function HeroSlideshow({
  slides,
  autoPlayInterval = 5000,
}: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume autoplay after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlayInterval, goToNext, slides.length]);

  if (slides.length === 0) {
    return (
      <section className="relative h-[500px] bg-gradient-to-br from-brand-navy to-brand-navy/90 lg:h-[600px]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="font-serif text-4xl font-bold md:text-5xl lg:text-6xl">
              Trường Việt Ngữ
            </h1>
            <p className="mt-4 text-lg text-brand-cream/90 md:text-xl">
              Thiếu Nhi Thánh Thể - Honolulu, HI
            </p>
          </div>
        </div>
      </section>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <section className="relative h-[500px] overflow-hidden lg:h-[600px]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <Image
            src={slide.imageUrl}
            alt={slide.title || 'Slideshow image'}
            fill
            className="object-cover"
            priority={index === 0}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/80 via-brand-navy/50 to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            {currentSlide.title && (
              <h1 className="font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                {currentSlide.title}
              </h1>
            )}
            {currentSlide.subtitle && (
              <p className="mt-4 text-lg text-brand-cream/90 md:text-xl">
                {currentSlide.subtitle}
              </p>
            )}
            {currentSlide.linkUrl && currentSlide.linkText && (
              <Link
                href={currentSlide.linkUrl}
                className="mt-8 inline-block rounded-lg bg-brand-gold px-8 py-4 font-semibold text-brand-navy transition-colors hover:bg-brand-gold/90"
              >
                {currentSlide.linkText}
              </Link>
            )}
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
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/30"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => {
              goToNext();
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 10000);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/30"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-brand-gold'
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
