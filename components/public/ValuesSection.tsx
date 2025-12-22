import Image from 'next/image';
import { ReactNode } from 'react';

interface Value {
  title: string;
  description: string;
  image: string;
  icon: ReactNode;
}

const values: Value[] = [
  {
    title: 'Đức Tin',
    description: 'Nuôi dưỡng đức tin Công Giáo và giá trị tâm linh trong mỗi học sinh',
    image: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=600&q=80',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    title: 'Văn Hóa',
    description: 'Gìn giữ và phát triển bản sắc văn hóa Việt Nam cho thế hệ trẻ',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Cộng Đồng',
    description: 'Xây dựng cộng đồng người Việt đoàn kết và yêu thương tại Hawaii',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Giáo Dục',
    description: 'Cung cấp chương trình giáo dục tiếng Việt và giáo lý chất lượng cao',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80',
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
      </svg>
    ),
  },
];

export function ValuesSection() {
  return (
    <section className="bg-white px-6 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-slate-900 lg:text-4xl">
            Giá Trị Cốt Lõi
          </h2>
          <p className="mt-3 text-lg text-slate-600">
            Những giá trị chúng tôi cam kết mang lại cho học sinh
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <article
              key={index}
              className="group overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-sm transition-all duration-200 hover:border-yellow-400 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-900/10 to-slate-900/5">
                <Image
                  src={value.image}
                  alt={value.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent" />

                {/* Icon Overlay */}
                <div className="absolute bottom-4 left-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg backdrop-blur-sm">
                  {value.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-3 font-serif text-xl font-bold text-slate-900 group-hover:text-red-700">
                  {value.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  {value.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-red-800 hover:shadow-xl"
          >
            Tìm Hiểu Thêm Về Chúng Tôi
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
