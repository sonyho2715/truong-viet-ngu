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
      className="relative overflow-hidden px-6 py-8 lg:px-8 lg:py-12"
      style={{ backgroundColor: heroBackgroundColor }}
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23D4AF37' fill-opacity='0.1'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-8">
          {/* Left Logo */}
          <div className="flex-shrink-0">
            {leftLogoUrl ? (
              <div className="relative h-20 w-20 lg:h-32 lg:w-32">
                <div className="absolute inset-0 rounded-full bg-brand-cream opacity-30 blur-xl" />
                <div className="relative flex h-full w-full items-center justify-center rounded-full border-3 border-brand-gold bg-brand-cream p-3 shadow-lg">
                  <Image
                    src={leftLogoUrl}
                    alt="Công đoàn logo"
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-3 border-brand-gold bg-brand-cream p-3 shadow-lg lg:h-32 lg:w-32">
                <span className="font-serif text-sm font-bold text-brand-navy lg:text-xl">
                  CĐ
                </span>
              </div>
            )}
          </div>

          {/* Center Content */}
          <div className="flex-1 text-center">
            <h1 className="font-serif text-3xl font-bold tracking-wide text-brand-gold lg:text-4xl">
              {organizationName}
            </h1>
            <p className="mt-2 text-lg text-brand-cream lg:text-xl">
              {subtitle}
            </p>
            <p className="mt-1 text-sm text-brand-cream/80 lg:text-base">
              {location}
            </p>
          </div>

          {/* Right Logo */}
          <div className="flex-shrink-0">
            {rightLogoUrl ? (
              <div className="relative h-20 w-20 lg:h-32 lg:w-32">
                <div className="absolute inset-0 rounded-full bg-brand-cream opacity-30 blur-xl" />
                <div className="relative flex h-full w-full items-center justify-center rounded-full border-3 border-brand-gold bg-brand-cream p-3 shadow-lg">
                  <Image
                    src={rightLogoUrl}
                    alt="TNTT logo"
                    fill
                    className="object-contain p-2"
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full border-3 border-brand-gold bg-brand-cream p-3 shadow-lg lg:h-32 lg:w-32">
                <span className="font-serif text-sm font-bold text-brand-navy lg:text-xl">
                  TNTT
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gold decorative border at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, #D4AF37 0%, #E8C968 50%, #D4AF37 100%)',
        }}
      />
    </section>
  );
}
