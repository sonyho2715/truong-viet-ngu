import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Thiếu Nhi Thánh Thể - TNTT',
  description: 'Chương trình Thiếu Nhi Thánh Thể - nuôi dưỡng đức tin và giá trị Công Giáo cho thế hệ trẻ',
};

export default function TNTTPage() {
  const levels = [
    {
      name: 'Ấu Nhi',
      ageRange: '7-9 tuổi',
      description: 'Làm quen với đức tin Công Giáo qua các hoạt động vui chơi và học tập',
      color: 'bg-blue-100 text-blue-800',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
    },
    {
      name: 'Thiếu Nhi',
      ageRange: '10-12 tuổi',
      description: 'Phát triển đức tin qua các hoạt động nhóm và học giáo lý',
      color: 'bg-green-100 text-green-800',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=600&q=80',
    },
    {
      name: 'Nghĩa Sĩ',
      ageRange: '13-15 tuổi',
      description: 'Rèn luyện đức tin và tinh thần phục vụ cộng đồng',
      color: 'bg-yellow-100 text-yellow-800',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&q=80',
    },
    {
      name: 'Hiệp Sĩ',
      ageRange: '16-18 tuổi',
      description: 'Trở thành lãnh đạo và gương mẫu cho các em nhỏ',
      color: 'bg-red-100 text-red-800',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80',
    },
  ];

  const activities = [
    {
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Học Giáo Lý',
      description: 'Học các giáo lý Công Giáo qua Sách Thánh và truyền thống',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      title: 'Ca Đoàn',
      description: 'Tham gia ca đoàn và ca ngợi Chúa trong các thánh lễ',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Hoạt Động Nhóm',
      description: 'Các trò chơi, hoạt động nhóm xây dựng tình bạn và đức tin',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: 'Phục Vụ Cộng Đồng',
      description: 'Tham gia các hoạt động từ thiện và phục vụ cộng đồng',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Văn Hóa Việt Nam',
      description: 'Học và gìn giữ văn hóa, truyền thống Việt Nam',
    },
    {
      icon: (
        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Các Sự Kiện Đặc Biệt',
      description: 'Cắm trại, picnic, và các hoạt động vui chơi theo mùa',
    },
  ];

  return (
    <>
      <Navigation />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[400px] overflow-hidden bg-gradient-to-br from-brand-navy to-brand-navy/80">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80"
              alt="Thiếu Nhi Thánh Thể"
              fill
              className="object-cover opacity-20"
              priority
            />
          </div>
          <div className="relative flex h-full items-center">
            <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
              <div className="text-center">
                <h1 className="font-serif text-5xl font-bold text-white lg:text-6xl">
                  Thiếu Nhi Thánh Thể
                </h1>
                <p className="mt-4 text-xl text-brand-cream lg:text-2xl">
                  Nuôi dưỡng đức tin và giá trị Công Giáo cho thế hệ trẻ
                </p>
                <div className="mt-8">
                  <a
                    href="#enrollment"
                    className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-8 py-4 font-semibold text-brand-navy shadow-xl transition-all hover:bg-brand-gold-light hover:shadow-2xl"
                  >
                    Đăng Ký Ngay
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About TNTT Section */}
        <section className="bg-white px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <h2 className="font-serif text-3xl font-bold text-brand-navy lg:text-4xl">
                  TNTT Là Gì?
                </h2>
                <div className="mt-4 h-1 w-24 bg-brand-gold"></div>
                <div className="mt-6 space-y-4 text-lg leading-relaxed text-gray-700">
                  <p>
                    Thiếu Nhi Thánh Thể (TNTT) là một phong trào giáo dục Công Giáo dành cho trẻ em và thanh thiếu niên từ 6 đến 17 tuổi.
                  </p>
                  <p>
                    Chương trình TNTT giúp các em phát triển đức tin, học hỏi giáo lý Công Giáo, và xây dựng tình bạn trong môi trường lành mạnh, yêu thương.
                  </p>
                  <p>
                    Qua các hoạt động vui chơi, học tập, và phục vụ, các em sẽ trở thành những người công giáo tốt, những công dân có ích cho xã hội, và gìn giữ bản sắc văn hóa Việt Nam.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80"
                    alt="TNTT Activities"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Levels Section */}
        <section className="bg-gray-50 px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl font-bold text-brand-navy lg:text-4xl">
                Các Cấp Bậc TNTT
              </h2>
              <p className="mt-3 text-lg text-gray-600">
                Chương trình phù hợp cho mọi lứa tuổi
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {levels.map((level, index) => (
                <article
                  key={index}
                  className="group overflow-hidden rounded-xl border-2 border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-brand-gold hover:shadow-lg"
                >
                  {/* Level Image */}
                  <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-brand-navy/10 to-brand-navy/5">
                    <Image
                      src={level.image}
                      alt={level.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/40 to-transparent" />

                    {/* Age Range Badge */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                      <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${level.color}`}>
                        {level.ageRange}
                      </span>
                    </div>
                  </div>

                  {/* Level Info */}
                  <div className="p-6">
                    <h3 className="mb-3 text-center font-serif text-2xl font-bold text-brand-navy">
                      {level.name}
                    </h3>
                    <p className="text-center text-sm text-gray-600">
                      {level.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Activities Section */}
        <section className="bg-white px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-3xl font-bold text-brand-navy lg:text-4xl">
                Hoạt Động Của TNTT
              </h2>
              <p className="mt-3 text-lg text-gray-600">
                Phát triển toàn diện về đức tin, tri thức, và kỹ năng
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity, index) => (
                <article
                  key={index}
                  className="group rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-brand-gold hover:shadow-lg"
                >
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-navy text-brand-gold">
                    {activity.icon}
                  </div>
                  <h3 className="mb-3 font-serif text-xl font-bold text-brand-navy">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600">
                    {activity.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Schedule Section */}
        <section className="bg-gradient-to-br from-brand-navy to-brand-navy/90 px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="font-serif text-3xl font-bold text-brand-gold lg:text-4xl">
                Lịch Sinh Hoạt
              </h2>
              <div className="mt-8 rounded-xl border-2 border-brand-gold/30 bg-white/5 p-8 backdrop-blur-sm">
                <div className="space-y-6 text-brand-cream">
                  <div className="flex items-center justify-between border-b border-brand-gold/30 pb-4">
                    <span className="text-lg font-semibold">Ngày:</span>
                    <span className="text-lg">Chủ Nhật hàng tuần</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-brand-gold/30 pb-4">
                    <span className="text-lg font-semibold">Giờ:</span>
                    <span className="text-lg">9:00 AM - 12:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Địa điểm:</span>
                    <span className="text-lg">Nhà thờ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enrollment CTA Section */}
        <section id="enrollment" className="bg-brand-cream px-6 py-16 lg:py-24">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="font-serif text-3xl font-bold text-brand-navy lg:text-4xl">
                Đăng Ký Tham Gia TNTT
              </h2>
              <p className="mt-4 text-lg text-gray-700">
                Hãy để con em bạn được nuôi dưỡng đức tin và phát triển trong môi trường Công Giáo yêu thương
              </p>

              <div className="mt-8 rounded-xl border-2 border-brand-gold bg-white p-8 shadow-lg">
                <h3 className="mb-6 font-serif text-2xl font-bold text-brand-navy">
                  Thông Tin Liên Hệ
                </h3>

                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy">
                      <svg className="h-5 w-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-gray-900">Email</h4>
                      <a href="mailto:tntt@truongvietngu.com" className="text-gray-600 hover:text-brand-gold">
                        tntt@truongvietngu.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-navy">
                      <svg className="h-5 w-5 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="mb-1 font-semibold text-gray-900">Điện thoại</h4>
                      <a href="tel:808-123-4567" className="text-gray-600 hover:text-brand-gold">
                        (808) 123-4567
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-6">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-navy hover:text-brand-gold"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Quay về trang chủ
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
