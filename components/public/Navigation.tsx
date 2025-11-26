'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownItem {
  label: string;
  href: string;
}

interface NavDropdownProps {
  label: string;
  items: DropdownItem[];
}

function NavDropdown({ label, items }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm font-medium text-gray-700 transition-colors hover:text-brand-gold"
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-48 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black/5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-gold/10 hover:text-brand-navy"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSubmenus, setMobileSubmenus] = useState<Record<string, boolean>>({});

  const toggleMobileSubmenu = (key: string) => {
    setMobileSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const aboutItems: DropdownItem[] = [
    { label: 'Về Trường', href: '/about' },
    { label: 'Đội Ngũ Giáo Viên', href: '/teachers' },
    { label: 'Câu Hỏi Thường Gặp', href: '/faq' },
  ];

  const resourceItems: DropdownItem[] = [
    { label: 'Tài Liệu Học Tập', href: '/materials' },
    { label: 'Lịch Học', href: '/calendar' },
    { label: 'Báo Nghỉ Học', href: '/absence-report' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/uploads/logos/cttd.png"
                alt="CTTD Logo"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <span className="font-serif text-xl font-bold text-brand-navy">
                Trường Việt Ngữ
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            <Link
              href="/"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-gold"
            >
              Trang Chủ
            </Link>
            <NavDropdown label="Thông Tin" items={aboutItems} />
            <Link
              href="/#classes"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-gold"
            >
              Các Lớp Học
            </Link>
            <Link
              href="/tntt"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-gold"
            >
              TNTT
            </Link>
            <NavDropdown label="Tài Nguyên" items={resourceItems} />
            <Link
              href="/#contact"
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
              href="/"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-brand-navy"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Trang Chủ
            </Link>

            {/* About submenu */}
            <div>
              <button
                onClick={() => toggleMobileSubmenu('about')}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-brand-navy"
              >
                Thông Tin
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileSubmenus['about'] ? 'rotate-180' : ''}`} />
              </button>
              {mobileSubmenus['about'] && (
                <div className="ml-4 space-y-1">
                  {aboutItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-brand-navy"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/#classes"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-brand-navy"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Các Lớp Học
            </Link>
            <Link
              href="/tntt"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-brand-navy"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              TNTT
            </Link>

            {/* Resources submenu */}
            <div>
              <button
                onClick={() => toggleMobileSubmenu('resources')}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-brand-navy"
              >
                Tài Nguyên
                <ChevronDown className={`h-4 w-4 transition-transform ${mobileSubmenus['resources'] ? 'rotate-180' : ''}`} />
              </button>
              {mobileSubmenus['resources'] && (
                <div className="ml-4 space-y-1">
                  {resourceItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-brand-navy"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/#contact"
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
