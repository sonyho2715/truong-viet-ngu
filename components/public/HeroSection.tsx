import Image from 'next/image';

interface HeroSectionProps {
  organizationName: string;
  subtitle: string;
  location: string;
  leftLogoUrl?: string | null;
  rightLogoUrl?: string | null;
  heroBackgroundColor: string;
}

export function HeroSection({
  organizationName,
  subtitle,
  location,
  leftLogoUrl,
  rightLogoUrl,
  heroBackgroundColor,
}: HeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden px-6 py-16 lg:px-8 lg:py-24"
      style={{ backgroundColor: heroBackgroundColor }}
    >
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23D4AF37' fill-opacity='0.1'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between">
          {/* Left Logo */}
          <div className="flex-shrink-0 lg:order-1">
            {leftLogoUrl ? (
              <div className="relative h-28 w-28 lg:h-40 lg:w-40">
                <div className="absolute inset-0 rounded-full bg-brand-cream opacity-20 blur-2xl" />
                <div className="relative flex h-full w-full items-center justify-center rounded-full border-4 border-brand-gold bg-brand-cream p-4 shadow-2xl">
                  <Image
                    src={leftLogoUrl}
                    alt="Công đoàn logo"
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-brand-gold bg-brand-cream p-4 shadow-2xl lg:h-40 lg:w-40">
                <span className="font-serif text-xl font-bold text-brand-navy lg:text-3xl">
                  CĐ
                </span>
              </div>
            )}
          </div>

          {/* Center Content */}
          <div className="flex-1 text-center lg:order-2 lg:px-12">
            <h1 className="font-serif text-4xl font-bold tracking-wide text-brand-gold lg:text-5xl xl:text-6xl">
              {organizationName}
            </h1>
            <p className="mt-4 text-2xl text-brand-cream lg:text-3xl">
              {subtitle}
            </p>
            <div className="mt-6 flex items-center justify-center gap-2 text-brand-cream/90">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-lg lg:text-xl">{location}</p>
            </div>

            {/* Call to action */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                href="#announcements"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-brand-gold bg-brand-gold px-6 py-3 font-semibold text-brand-navy shadow-lg transition-all hover:bg-brand-gold/90 hover:shadow-xl"
              >
                Xem Thông Báo
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </a>
              <a
                href="#classes"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-brand-cream bg-transparent px-6 py-3 font-semibold text-brand-cream shadow-lg transition-all hover:bg-brand-cream hover:text-brand-navy"
              >
                Các Lớp Học
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Right Logo */}
          <div className="flex-shrink-0 lg:order-3">
            {rightLogoUrl ? (
              <div className="relative h-28 w-28 lg:h-40 lg:w-40">
                <div className="absolute inset-0 rounded-full bg-brand-cream opacity-20 blur-2xl" />
                <div className="relative flex h-full w-full items-center justify-center rounded-full border-4 border-brand-gold bg-brand-cream p-4 shadow-2xl">
                  <Image
                    src={rightLogoUrl}
                    alt="TNTT logo"
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-brand-gold bg-brand-cream p-4 shadow-2xl lg:h-40 lg:w-40">
                <span className="font-serif text-xl font-bold text-brand-navy lg:text-3xl">
                  TNTT
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gold decorative border at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1.5"
        style={{
          background:
            'linear-gradient(90deg, #D4AF37 0%, #E8C968 50%, #D4AF37 100%)',
        }}
      />
    </section>
  );
}
