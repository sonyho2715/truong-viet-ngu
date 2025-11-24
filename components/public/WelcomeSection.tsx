interface WelcomeSectionProps {
  welcomeMessage?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
}

export function WelcomeSection({
  welcomeMessage = 'Chào mừng đến với Trường Việt Ngữ - Thiếu Nhi Thánh Thể. Chúng tôi cam kết giảng dạy tiếng Việt và giáo lý Công Giáo cho thế hệ trẻ với tình yêu thương và sự tận tâm.',
  contactEmail = 'info@truongvietngu.com',
  contactPhone = '(808) 123-4567',
  address = '123 Church Street, Honolulu, HI 96817',
}: WelcomeSectionProps) {
  return (
    <section id="about" className="bg-brand-cream px-6 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Welcome Message */}
          <div id="contact" className="flex flex-col justify-center">
            <h2 className="font-serif text-3xl font-bold text-brand-navy lg:text-4xl">
              Chào Mừng
            </h2>
            <div className="mt-4 h-1 w-24 bg-brand-gold"></div>
            <p className="mt-6 text-lg leading-relaxed text-gray-700">
              {welcomeMessage}
            </p>
          </div>

          {/* Contact Info Card */}
          <div className="rounded-xl border-2 border-brand-gold bg-white p-8 shadow-lg">
            <h3 className="mb-6 font-serif text-2xl font-bold text-brand-navy">
              Liên Hệ
            </h3>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy">
                  <svg
                    className="h-5 w-5 text-brand-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-gray-900">Email</h4>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-gray-600 hover:text-brand-gold"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy">
                  <svg
                    className="h-5 w-5 text-brand-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-gray-900">Điện thoại</h4>
                  <a
                    href={`tel:${contactPhone}`}
                    className="text-gray-600 hover:text-brand-gold"
                  >
                    {contactPhone}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy">
                  <svg
                    className="h-5 w-5 text-brand-gold"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="mb-1 font-semibold text-gray-900">Địa chỉ</h4>
                  <address className="not-italic text-gray-600">
                    {address}
                  </address>
                </div>
              </div>
            </div>

            {/* Visit Us Button */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-navy hover:text-brand-gold"
              >
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
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
                Xem bản đồ
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
