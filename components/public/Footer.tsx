'use client';

import Link from 'next/link';
import { MapPin, Mail, Phone, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();

  const content = {
    vi: {
      schoolName: 'Trường Việt Ngữ',
      subtitle: 'Thiếu Nhi Thánh Thể',
      description: 'Giảng dạy tiếng Việt và giáo lý Công Giáo cho thế hệ trẻ Việt Nam tại Hawaii.',
      address: '2250 Kuhio Ave, Honolulu, HI 96815',
      email: 'info@truongvietngu.com',
      phone: '(808) 123-4567',
      pages: {
        title: 'Về Trang',
        home: 'Trang Chủ',
        about: 'Về Trường',
        calendar: 'Lịch Học',
        contact: 'Liên Hệ',
        register: 'Ghi Danh',
      },
      community: {
        title: 'Cộng Đoàn',
        cttdvn: 'CTTĐVN Honolulu',
        tomaThien: 'Toma Thiện',
        langYouth: 'Làng Youth',
        facebook: 'Facebook',
      },
      copyright: `© ${currentYear} Trường Việt Ngữ - TNTT Honolulu`,
    },
    en: {
      schoolName: 'Vietnamese Language School',
      subtitle: 'Eucharistic Youth Movement',
      description: 'Teaching Vietnamese language and Catholic faith to Vietnamese youth in Hawaii.',
      address: '2250 Kuhio Ave, Honolulu, HI 96815',
      email: 'info@truongvietngu.com',
      phone: '(808) 123-4567',
      pages: {
        title: 'Pages',
        home: 'Home',
        about: 'About',
        calendar: 'Calendar',
        contact: 'Contact',
        register: 'Register',
      },
      community: {
        title: 'Community',
        cttdvn: 'VMCC Honolulu',
        tomaThien: 'Toma Thien',
        langYouth: 'Lang Youth',
        facebook: 'Facebook',
      },
      copyright: `© ${currentYear} Vietnamese Language School - TNTT Honolulu`,
    },
  };

  const t = content[language];

  return (
    <footer className="bg-slate-900 text-white py-16 pb-24 lg:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: School Info */}
          <div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold font-serif text-yellow-400">
                {t.schoolName}
              </h3>
              <p className="text-slate-400 text-sm">{t.subtitle}</p>
            </div>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              {t.description}
            </p>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                <span>{t.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-yellow-400 flex-shrink-0" />
                <a
                  href={`mailto:${t.email}`}
                  className="hover:text-yellow-400 transition-colors"
                >
                  {t.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-yellow-400 flex-shrink-0" />
                <a
                  href={`tel:${t.phone.replace(/[^0-9]/g, '')}`}
                  className="hover:text-yellow-400 transition-colors"
                >
                  {t.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Pages */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">
              {t.pages.title}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-300 hover:text-yellow-400 transition-colors"
                >
                  {t.pages.home}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-300 hover:text-yellow-400 transition-colors"
                >
                  {t.pages.about}
                </Link>
              </li>
              <li>
                <Link
                  href="/calendar"
                  className="text-slate-300 hover:text-yellow-400 transition-colors"
                >
                  {t.pages.calendar}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-300 hover:text-yellow-400 transition-colors"
                >
                  {t.pages.contact}
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-slate-300 hover:text-yellow-400 transition-colors"
                >
                  {t.pages.register}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Community Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">
              {t.community.title}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://cttdvn-honolulu.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-yellow-400 transition-colors inline-flex items-center gap-1"
                >
                  {t.community.cttdvn}
                  <ArrowUpRight size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://tomathien.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-yellow-400 transition-colors inline-flex items-center gap-1"
                >
                  {t.community.tomaThien}
                  <ArrowUpRight size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://langyouth.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-yellow-400 transition-colors inline-flex items-center gap-1"
                >
                  {t.community.langYouth}
                  <ArrowUpRight size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://facebook.com/truongvietngu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-yellow-400 transition-colors inline-flex items-center gap-1"
                >
                  {t.community.facebook}
                  <ArrowUpRight size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
          <p>{t.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
