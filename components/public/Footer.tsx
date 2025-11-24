import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-brand-navy px-6 py-12 text-white lg:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-bold text-brand-gold">
              Giới Thiệu
            </h3>
            <p className="text-sm leading-relaxed text-gray-300">
              Trường Việt Ngữ - Thiếu Nhi Thánh Thể. Giảng dạy tiếng Việt và giáo lý Công Giáo cho thế hệ trẻ.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-bold text-brand-gold">
              Liên Kết
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-brand-gold"
                >
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link
                  href="#announcements"
                  className="text-gray-300 hover:text-brand-gold"
                >
                  Thông Báo
                </Link>
              </li>
              <li>
                <Link
                  href="#classes"
                  className="text-gray-300 hover:text-brand-gold"
                >
                  Các Lớp Học
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-gray-300 hover:text-brand-gold"
                >
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-bold text-brand-gold">
              Tài Nguyên
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/materials"
                  className="text-gray-300 hover:text-brand-gold"
                >
                  Tài Liệu Học Tập
                </Link>
              </li>
              <li>
                <a
                  href="https://tomathien.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-brand-gold"
                >
                  Tô Màu Thiên
                </a>
              </li>
              <li>
                <Link
                  href="/calendar"
                  className="text-gray-300 hover:text-brand-gold"
                >
                  Lịch Học
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-bold text-brand-gold">
              Kết Nối
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a href="mailto:info@truongvietngu.com" className="hover:text-brand-gold">
                  info@truongvietngu.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <a href="tel:8081234567" className="hover:text-brand-gold">
                  (808) 123-4567
                </a>
              </li>
            </ul>

            {/* Social Media Icons */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-300 hover:text-brand-gold"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="text-gray-300 hover:text-brand-gold"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Email Newsletter"
                className="text-gray-300 hover:text-brand-gold"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {currentYear} Trường Việt Ngữ - Thiếu Nhi Thánh Thể. All rights reserved.
          </p>
          <p className="mt-2">
            Built with ❤️ for the Vietnamese Catholic Community
          </p>
        </div>
      </div>
    </footer>
  );
}
