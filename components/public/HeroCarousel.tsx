'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Slide {
  image: string;
  title: string;
  subtitle: string;
  cta?: {
    text: string;
    link: string;
  };
}

const slides: Slide[] = [
  {
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80',
    title: 'Chào Mừng Đến Với Trường Việt Ngữ',
    subtitle: 'Giáo dục tiếng Việt và văn hóa cho thế hệ trẻ',
    cta: {
      text: 'Tìm Hiểu Thêm',
      link: '#about',
    },
  },
  {
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1920&q=80',
    title: 'Thiếu Nhi Thánh Thể',
    subtitle: 'Nuôi dưỡng đức tin và truyền thống Công Giáo',
    cta: {
      text: 'Xem Chương Trình TNTT',
      link: '/tntt',
    },
  },
  {
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920&q=80',
    title: 'Cộng Đồng Của Chúng Ta',
    subtitle: 'Xây dựng cầu nối văn hóa Việt Nam tại Hawaii',
    cta: {
      text: 'Tham Gia Cùng Chúng Tôi',
      link: '#contact',
    },
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative h-[500px] overflow-hidden md:h-[600px] lg:h-[700px]">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/70 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative flex h-full items-center">
            <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
              <div className="max-w-2xl">
                <h1 className="font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl">
                  {slide.title}
                </h1>
                <p className="mt-6 text-xl text-brand-cream md:text-2xl">
                  {slide.subtitle}
                </p>
                {slide.cta && (
                  <div className="mt-8">
                    <a
                      href={slide.cta.link}
                      className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-8 py-4 font-semibold text-brand-navy shadow-xl transition-all hover:bg-yellow-400 hover:shadow-2xl"
                    >
                      {slide.cta.text}
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
      <button
        onClick={goToPrevious}
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
        onClick={goToNext}
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

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-3 w-3 rounded-full transition-all ${
              index === currentSlide
                ? 'w-8 bg-brand-gold'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
