'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Menu, Home, BookOpen, Users, Calendar, Phone, User, Globe, UserPlus } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface DropdownItem {
  label: string;
  labelEn: string;
  href: string;
}

interface NavDropdownProps {
  label: string;
  items: DropdownItem[];
  lang: 'vi' | 'en';
}

function NavDropdown({ label, items, lang }: NavDropdownProps) {
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
              {lang === 'vi' ? item.label : item.labelEn}
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
  const { language, setLanguage, t } = useLanguage();

  const toggleMobileSubmenu = (key: string) => {
    setMobileSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const aboutItems: DropdownItem[] = [
    { label: 'Về Trường', labelEn: 'About Us', href: '/about' },
    { label: 'Đội Ngũ Giáo Viên', labelEn: 'Our Teachers', href: '/teachers' },
    { label: 'Câu Hỏi Thường Gặp', labelEn: 'FAQ', href: '/faq' },
  ];

  const resourceItems: DropdownItem[] = [
    { label: 'Tài Liệu Học Tập', labelEn: 'Learning Materials', href: '/materials' },
    { label: 'Lịch Học', labelEn: 'Calendar', href: '/calendar' },
    { label: 'Báo Nghỉ Học', labelEn: 'Absence Report', href: '/absence-report' },
    { label: 'Thư Viện Ảnh', labelEn: 'Photo Gallery', href: '/gallery' },
  ];

  const portalItems: DropdownItem[] = [
    { label: 'Phụ Huynh', labelEn: 'Parent Portal', href: '/parent/login' },
    { label: 'Giáo Viên', labelEn: 'Teacher Portal', href: '/teacher/login' },
    { label: 'Quản Trị', labelEn: 'Admin', href: '/admin/login' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2 sm:gap-3">
                <Image
                  src="/uploads/logos/cttd.png"
                  alt="CTTD Logo"
                  width={48}
                  height={48}
                  className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
                />
                <span className="font-serif text-lg sm:text-xl font-bold text-brand-navy">
                  Trường Việt Ngữ
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-gold"
              >
                {t('nav.home')}
              </Link>
              <NavDropdown label={t('nav.about')} items={aboutItems} lang={language} />
              <Link
                href="/blog"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-gold"
              >
                {t('nav.news')}
              </Link>
              <Link
                href="/tntt"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-gold"
              >
                TNTT
              </Link>
              <NavDropdown label={t('nav.resources')} items={resourceItems} lang={language} />
              <Link
                href="/contact"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-brand-gold"
              >
                {t('nav.contact')}
              </Link>
              <NavDropdown label={t('nav.portal')} items={portalItems} lang={language} />

              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                title={language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
              >
                <Globe className="h-4 w-4" />
                {language === 'vi' ? 'EN' : 'VI'}
              </button>
            </div>

            {/* Mobile: Language + Menu button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-sm font-medium text-gray-600"
              >
                <Globe className="h-4 w-4" />
                {language === 'vi' ? 'EN' : 'VI'}
              </button>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-brand-navy"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Slide-in Menu */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
              <span className="font-serif text-lg font-bold text-brand-navy">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="h-[calc(100vh-4rem)] overflow-y-auto pb-20">
              <div className="space-y-1 p-4">
                {/* Main Links */}
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-gray-700 hover:bg-brand-gold/10 hover:text-brand-navy active:bg-brand-gold/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  {t('nav.home')}
                </Link>

                {/* About submenu */}
                <div>
                  <button
                    onClick={() => toggleMobileSubmenu('about')}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-gray-700 hover:bg-brand-gold/10 hover:text-brand-navy"
                  >
                    <span className="flex items-center gap-3">
                      <Users className="h-5 w-5" />
                      {t('nav.about')}
                    </span>
                    <ChevronDown className={`h-5 w-5 transition-transform ${mobileSubmenus['about'] ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileSubmenus['about'] && (
                    <div className="ml-8 space-y-1 border-l-2 border-brand-gold/30 pl-4">
                      {aboutItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-brand-gold/10 hover:text-brand-navy"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {language === 'vi' ? item.label : item.labelEn}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/blog"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-gray-700 hover:bg-brand-gold/10 hover:text-brand-navy active:bg-brand-gold/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BookOpen className="h-5 w-5" />
                  {t('nav.news')}
                </Link>

                <Link
                  href="/tntt"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-gray-700 hover:bg-brand-gold/10 hover:text-brand-navy active:bg-brand-gold/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  TNTT
                </Link>

                {/* Resources submenu */}
                <div>
                  <button
                    onClick={() => toggleMobileSubmenu('resources')}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-gray-700 hover:bg-brand-gold/10 hover:text-brand-navy"
                  >
                    <span className="flex items-center gap-3">
                      <Calendar className="h-5 w-5" />
                      {t('nav.resources')}
                    </span>
                    <ChevronDown className={`h-5 w-5 transition-transform ${mobileSubmenus['resources'] ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileSubmenus['resources'] && (
                    <div className="ml-8 space-y-1 border-l-2 border-brand-gold/30 pl-4">
                      {resourceItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-lg px-3 py-2.5 text-sm text-gray-600 hover:bg-brand-gold/10 hover:text-brand-navy"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {language === 'vi' ? item.label : item.labelEn}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/contact"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-gray-700 hover:bg-brand-gold/10 hover:text-brand-navy active:bg-brand-gold/20"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Phone className="h-5 w-5" />
                  {t('nav.contact')}
                </Link>

                <Link
                  href="/register"
                  className="flex items-center gap-3 rounded-lg bg-brand-gold/10 px-3 py-3 text-base font-medium text-brand-navy hover:bg-brand-gold/20 active:bg-brand-gold/30"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserPlus className="h-5 w-5" />
                  {t('nav.register')}
                </Link>

                {/* Divider */}
                <div className="my-4 border-t border-gray-200" />

                {/* Portal Links */}
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  {t('nav.portal')}
                </p>
                {portalItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-gray-700 hover:bg-brand-gold/10 hover:text-brand-navy active:bg-brand-gold/20"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    {language === 'vi' ? item.label : item.labelEn}
                  </Link>
                ))}

                {/* Register CTA */}
                <div className="mt-6 px-3">
                  <Link
                    href="/register"
                    className="block w-full rounded-lg bg-brand-gold py-3 text-center font-semibold text-brand-navy hover:bg-brand-gold/90 active:bg-brand-gold/80"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('nav.register')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white lg:hidden safe-area-bottom">
        <div className="grid h-16 grid-cols-5">
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-brand-navy active:bg-gray-100"
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium">{language === 'vi' ? 'Trang chủ' : 'Home'}</span>
          </Link>
          <Link
            href="/blog"
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-brand-navy active:bg-gray-100"
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-[10px] font-medium">{language === 'vi' ? 'Tin tức' : 'News'}</span>
          </Link>
          <Link
            href="/register"
            className="flex flex-col items-center justify-center gap-1"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold text-brand-navy shadow-lg -mt-4">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-medium text-brand-navy">{language === 'vi' ? 'Đăng ký' : 'Register'}</span>
          </Link>
          <Link
            href="/calendar"
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-brand-navy active:bg-gray-100"
          >
            <Calendar className="h-5 w-5" />
            <span className="text-[10px] font-medium">{language === 'vi' ? 'Lịch' : 'Calendar'}</span>
          </Link>
          <Link
            href="/parent/login"
            className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-brand-navy active:bg-gray-100"
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] font-medium">{language === 'vi' ? 'Cổng PH' : 'Portal'}</span>
          </Link>
        </div>
      </div>
    </>
  );
}
