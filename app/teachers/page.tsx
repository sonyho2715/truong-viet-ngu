import Image from 'next/image';
import { Users, Mail, Phone, BookOpen } from 'lucide-react';
import { db } from '@/lib/db';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Breadcrumb } from '@/components/public/Breadcrumb';

export const metadata = {
  title: 'Giáo Viên | Trường Việt Ngữ',
  description: 'Đội ngũ giáo viên tận tâm của Trường Việt Ngữ Thiếu Nhi Thánh Thể',
};

export default async function TeachersPage() {
  const teachers = await db.teacher.findMany({
    where: { isActive: true },
    include: {
      classes: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
  });

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-navy to-brand-navy/90 py-16 text-white">
        <div className="container mx-auto px-4">
          <Breadcrumb items={[{ label: 'Giáo Viên' }]} />
          <div className="mx-auto max-w-3xl text-center">
            <Users className="mx-auto mb-4 h-16 w-16 text-brand-gold" />
            <h1 className="font-serif text-4xl font-bold md:text-5xl">
              Đội Ngũ Giáo Viên
            </h1>
            <p className="mt-4 text-lg text-brand-cream/90">
              Những người thầy, người cô tận tâm với sứ mạng giáo dục
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-brand-gold">
                {teachers.length}+
              </div>
              <div className="text-sm text-gray-600">Giáo viên</div>
            </div>
            <div className="h-12 w-px bg-gray-200" />
            <div>
              <div className="text-3xl font-bold text-brand-gold">15+</div>
              <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
            </div>
            <div className="h-12 w-px bg-gray-200" />
            <div>
              <div className="text-3xl font-bold text-brand-gold">100%</div>
              <div className="text-sm text-gray-600">Tận tâm</div>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {teachers.length > 0 ? (
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-lg"
                  >
                    {/* Photo */}
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-brand-navy to-brand-navy/80">
                      {teacher.photoUrl ? (
                        <Image
                          src={teacher.photoUrl}
                          alt={`${teacher.firstName} ${teacher.lastName}`}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <div className="text-center">
                            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-gold/20">
                              <span className="font-serif text-3xl font-bold text-brand-gold">
                                {teacher.firstName[0]}
                                {teacher.lastName[0]}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-6">
                      <h3 className="font-serif text-xl font-bold text-brand-navy">
                        {teacher.firstName} {teacher.lastName}
                      </h3>

                      {/* Classes */}
                      {teacher.classes.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <BookOpen className="h-4 w-4" />
                            <span>Đang dạy:</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {teacher.classes.map((cls) => (
                              <span
                                key={cls.id}
                                className="rounded-full bg-brand-gold/10 px-3 py-1 text-xs font-medium text-brand-navy"
                              >
                                {cls.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Bio */}
                      {teacher.bio && (
                        <p className="mt-4 line-clamp-3 text-sm text-gray-600">
                          {teacher.bio}
                        </p>
                      )}

                      {/* Contact */}
                      <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                        {teacher.email && (
                          <a
                            href={`mailto:${teacher.email}`}
                            className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-brand-gold"
                          >
                            <Mail className="h-4 w-4" />
                            <span className="truncate">{teacher.email}</span>
                          </a>
                        )}
                        {teacher.phone && (
                          <a
                            href={`tel:${teacher.phone}`}
                            className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-brand-gold"
                          >
                            <Phone className="h-4 w-4" />
                            <span>{teacher.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-md text-center">
              <Users className="mx-auto h-16 w-16 text-gray-300" />
              <h2 className="mt-4 font-serif text-2xl font-bold text-gray-600">
                Đang cập nhật
              </h2>
              <p className="mt-2 text-gray-500">
                Thông tin giáo viên sẽ được cập nhật sớm.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-brand-gold/10 to-brand-gold/5 p-8 text-center md:p-12">
            <h2 className="font-serif text-2xl font-bold text-brand-navy md:text-3xl">
              Bạn Muốn Trở Thành Giáo Viên?
            </h2>
            <p className="mt-4 text-gray-600">
              Chúng tôi luôn chào đón những người có tâm huyết muốn đóng góp vào
              sứ mạng giáo dục tiếng Việt và đức tin cho thế hệ trẻ.
            </p>
            <a
              href="/contact"
              className="mt-6 inline-block rounded-lg bg-brand-navy px-8 py-3 font-semibold text-white transition-colors hover:bg-brand-navy/90"
            >
              Liên Hệ Với Chúng Tôi
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
