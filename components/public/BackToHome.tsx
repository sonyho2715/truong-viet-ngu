'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function BackToHome() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  // Don't show on homepage or portal/admin pages
  const isHidden =
    pathname === '/' ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/parent') ||
    pathname.startsWith('/teacher');

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (isHidden) {
    return null;
  }

  return (
    <Link
      href="/"
      className={`fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:bg-slate-900/90 hover:shadow-xl lg:bottom-6 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
      aria-label="Về trang chủ"
    >
      <Home className="h-4 w-4" />
      <span className="hidden sm:inline">Trang Chủ</span>
    </Link>
  );
}
