'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, Menu, Home, BookOpen, Users, Calendar, Phone, User, Globe, UserPlus, Mail } from 'lucide-react';
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
  isScrolled: boolean;
}

function NavDropdown({ label, items, lang, isScrolled }: NavDropdownProps) {
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
        className={`flex items-center gap-1 text-sm font-medium transition-colors ${
          isScrolled
            ? 'text-slate-700 hover:text-red-700'
            : 'text-white hover:text-yellow-400'
        }`}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-48 rounded-lg bg-white py-2 shadow-xl ring-1 ring-black/5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-yellow-50 hover:text-red-700"
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
  const [isScrolled, setIsScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      {/* Top Bar */}
      <div className="hidden bg-slate-900 py-2 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 text-sm text-slate-300">
            <a href="tel:8081234567" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
              <Phone className="h-4 w-4" />
              (808) 123-4567
            </a>
            <a href="mailto:info@truongvietngu.com" className="flex items-center gap-2 hover:text-yellow-400 transition-colors">
              <Mail className="h-4 w-4" />
              info@truongvietngu.com
            </a>
          </div>
          <button
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-yellow-400 transition-colors"
          >
            <Globe className="h-4 w-4" />
            {language === 'vi' ? 'English' : 'Tiếng Việt'}
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-lg'
          : 'bg-transparent'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
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
                <span className={`font-serif text-lg sm:text-xl font-bold transition-colors ${
                  isScrolled ? 'text-slate-900' : 'text-white'
                }`}>
                  Trường Việt Ngữ
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-8">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? 'text-slate-700 hover:text-red-700'
                    : 'text-white hover:text-yellow-400'
                }`}
              >
                {t('nav.home')}
              </Link>
              <NavDropdown label={t('nav.about')} items={aboutItems} lang={language} isScrolled={isScrolled} />
              <Link
                href="/blog"
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? 'text-slate-700 hover:text-red-700'
                    : 'text-white hover:text-yellow-400'
                }`}
              >
                {t('nav.news')}
              </Link>
              <Link
                href="/tntt"
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? 'text-slate-700 hover:text-red-700'
                    : 'text-white hover:text-yellow-400'
                }`}
              >
                TNTT
              </Link>
              <NavDropdown label={t('nav.resources')} items={resourceItems} lang={language} isScrolled={isScrolled} />
              <Link
                href="/contact"
                className={`text-sm font-medium transition-colors ${
                  isScrolled
                    ? 'text-slate-700 hover:text-red-700'
                    : 'text-white hover:text-yellow-400'
                }`}
              >
                {t('nav.contact')}
              </Link>
              <NavDropdown label={t('nav.portal')} items={portalItems} lang={language} isScrolled={isScrolled} />

              {/* Register CTA */}
              <Link
                href="/register"
                className="rounded-lg bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-800 hover:shadow-lg"
              >
                {t('nav.register')}
              </Link>
            </div>

            {/* Mobile: Language + Menu button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
                className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors ${
                  isScrolled
                    ? 'text-slate-600 border border-slate-200'
                    : 'text-white border border-white/30'
                }`}
              >
                <Globe className="h-4 w-4" />
                {language === 'vi' ? 'EN' : 'VI'}
              </button>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className={`inline-flex items-center justify-center rounded-md p-2 transition-colors ${
                  isScrolled
                    ? 'text-slate-700 hover:bg-slate-100'
                    : 'text-white hover:bg-white/10'
                }`}
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
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
              <span className="font-serif text-lg font-bold text-slate-900">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
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
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-yellow-50 hover:text-red-700 active:bg-yellow-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  {t('nav.home')}
                </Link>

                {/* About submenu */}
                <div>
                  <button
                    onClick={() => toggleMobileSubmenu('about')}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-yellow-50 hover:text-red-700"
                  >
                    <span className="flex items-center gap-3">
                      <Users className="h-5 w-5" />
                      {t('nav.about')}
                    </span>
                    <ChevronDown className={`h-5 w-5 transition-transform ${mobileSubmenus['about'] ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileSubmenus['about'] && (
                    <div className="ml-8 space-y-1 border-l-2 border-yellow-400/30 pl-4">
                      {aboutItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-yellow-50 hover:text-red-700"
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
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-yellow-50 hover:text-red-700 active:bg-yellow-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BookOpen className="h-5 w-5" />
                  {t('nav.news')}
                </Link>

                <Link
                  href="/tntt"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-yellow-50 hover:text-red-700 active:bg-yellow-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  TNTT
                </Link>

                {/* Resources submenu */}
                <div>
                  <button
                    onClick={() => toggleMobileSubmenu('resources')}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-yellow-50 hover:text-red-700"
                  >
                    <span className="flex items-center gap-3">
                      <Calendar className="h-5 w-5" />
                      {t('nav.resources')}
                    </span>
                    <ChevronDown className={`h-5 w-5 transition-transform ${mobileSubmenus['resources'] ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileSubmenus['resources'] && (
                    <div className="ml-8 space-y-1 border-l-2 border-yellow-400/30 pl-4">
                      {resourceItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-yellow-50 hover:text-red-700"
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
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-yellow-50 hover:text-red-700 active:bg-yellow-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Phone className="h-5 w-5" />
                  {t('nav.contact')}
                </Link>

                <Link
                  href="/register"
                  className="flex items-center gap-3 rounded-lg bg-red-50 px-3 py-3 text-base font-medium text-red-700 hover:bg-red-100 active:bg-red-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserPlus className="h-5 w-5" />
                  {t('nav.register')}
                </Link>

                {/* Divider */}
                <div className="my-4 border-t border-slate-200" />

                {/* Portal Links */}
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {t('nav.portal')}
                </p>
                {portalItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-slate-700 hover:bg-yellow-50 hover:text-red-700 active:bg-yellow-100"
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
                    className="block w-full rounded-lg bg-red-700 py-3 text-center font-semibold text-white hover:bg-red-800 active:bg-red-900"
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
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white lg:hidden safe-area-bottom">
        <div className="grid h-16 grid-cols-5">
          <Link
            href="/"
            className="flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-red-700 active:bg-slate-100"
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium">{language === 'vi' ? 'Trang chủ' : 'Home'}</span>
          </Link>
          <Link
            href="/blog"
            className="flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-red-700 active:bg-slate-100"
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-[10px] font-medium">{language === 'vi' ? 'Tin tức' : 'News'}</span>
          </Link>
          <Link
            href="/register"
            className="flex flex-col items-center justify-center gap-1"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-700 text-white shadow-lg -mt-4">
              <Users className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-medium text-red-700">{language === 'vi' ? 'Đăng ký' : 'Register'}</span>
          </Link>
          <Link
            href="/calendar"
            className="flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-red-700 active:bg-slate-100"
          >
            <Calendar className="h-5 w-5" />
            <span className="text-[10px] font-medium">{language === 'vi' ? 'Lịch' : 'Calendar'}</span>
          </Link>
          <Link
            href="/parent/login"
            className="flex flex-col items-center justify-center gap-1 text-slate-600 hover:text-red-700 active:bg-slate-100"
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] font-medium">{language === 'vi' ? 'Cổng PH' : 'Portal'}</span>
          </Link>
        </div>
      </div>
    </>
  );
}
