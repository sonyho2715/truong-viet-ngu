'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold text-brand-navy">
                Trường Việt Ngữ
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            <Link
              href="#announcements"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-gold"
            >
              Thông Báo
            </Link>
            <Link
              href="#classes"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-gold"
            >
              Các Lớp Học
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-gold"
            >
              Giới Thiệu
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-gold"
            >
              Liên Hệ
            </Link>
            <Link
              href="/admin/login"
              className="rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-navy/90"
            >
              Đăng Nhập
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-brand-navy focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-gold"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 border-t border-gray-200 px-4 pb-3 pt-2">
            <Link
              href="#announcements"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-brand-navy"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Thông Báo
            </Link>
            <Link
              href="#classes"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-brand-navy"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Các Lớp Học
            </Link>
            <Link
              href="#about"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-brand-navy"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Giới Thiệu
            </Link>
            <Link
              href="#contact"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-brand-navy"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Liên Hệ
            </Link>
            <Link
              href="/admin/login"
              className="block rounded-md bg-brand-navy px-3 py-2 text-base font-medium text-white hover:bg-brand-navy/90"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Đăng Nhập
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
