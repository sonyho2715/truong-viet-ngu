import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import { db } from '@/lib/db';
import { Heart, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { VolunteerSignupButton } from '@/components/public/VolunteerSignupButton';

export const metadata = {
  title: 'Tình Nguyện - Trường Việt Ngữ',
  description: 'Đăng ký tình nguyện viên để hỗ trợ các hoạt động của Trường Việt Ngữ.',
};

export default async function VolunteerPage() {
  const opportunities = await db.volunteerOpportunity.findMany({
    where: {
      isActive: true,
    },
    include: {
      _count: {
        select: { signups: true },
      },
      signups: {
        where: { status: 'CONFIRMED' },
        select: { id: true },
      },
    },
    orderBy: [{ date: 'asc' }, { createdAt: 'desc' }],
  });

  const upcomingOpportunities = opportunities.filter(
    (o) => !o.date || new Date(o.date) >= new Date()
  );

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-navy to-brand-navy/90 px-6 py-16 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <Breadcrumb items={[{ label: 'Tình Nguyện' }]} />
            <div className="text-center">
              <Heart className="mx-auto mb-4 h-16 w-16 text-brand-gold" />
              <h1 className="font-serif text-4xl font-bold text-white lg:text-5xl">
                Tình Nguyện Viên
              </h1>
              <p className="mt-4 text-lg text-brand-cream lg:text-xl">
                Cùng chung tay xây dựng cộng đồng và hỗ trợ các em học sinh
              </p>
            </div>
          </div>
        </section>

        {/* Why Volunteer Section */}
        <section className="bg-white px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-center font-serif text-3xl font-bold text-brand-navy">
              Tại Sao Nên Tình Nguyện?
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-brand-cream p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold text-brand-navy">
                  <Heart className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-navy">
                  Đóng Góp Cộng Đồng
                </h3>
                <p className="mt-2 text-gray-600">
                  Giúp đỡ các em học sinh học tiếng Việt và gìn giữ văn hóa Việt Nam
                </p>
              </div>
              <div className="rounded-xl bg-brand-cream p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold text-brand-navy">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-navy">
                  Kết Nối
                </h3>
                <p className="mt-2 text-gray-600">
                  Gặp gỡ và kết nối với các gia đình trong cộng đồng
                </p>
              </div>
              <div className="rounded-xl bg-brand-cream p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold text-brand-navy">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-navy">
                  Linh Hoạt
                </h3>
                <p className="mt-2 text-gray-600">
                  Chọn công việc và thời gian phù hợp với lịch của bạn
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Opportunities Section */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 font-serif text-3xl font-bold text-brand-navy">
              Cơ Hội Tình Nguyện
            </h2>

            {upcomingOpportunities.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {upcomingOpportunities.map((opportunity) => {
                  const confirmedCount = opportunity.signups.length;
                  const spotsLeft = opportunity.spotsAvailable
                    ? opportunity.spotsAvailable - confirmedCount
                    : null;

                  return (
                    <div
                      key={opportunity.id}
                      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                    >
                      <h3 className="font-serif text-xl font-bold text-brand-navy">
                        {opportunity.title}
                      </h3>

                      {(opportunity.date || opportunity.location) && (
                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                          {opportunity.date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-brand-gold" />
                              <span>
                                {new Date(opportunity.date).toLocaleDateString('vi-VN', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          )}
                          {opportunity.startTime && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-brand-gold" />
                              <span>
                                {opportunity.startTime}
                                {opportunity.endTime && ` - ${opportunity.endTime}`}
                              </span>
                            </div>
                          )}
                          {opportunity.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-brand-gold" />
                              <span>{opportunity.location}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <p className="mt-4 text-gray-600">{opportunity.description}</p>

                      {opportunity.requirements && (
                        <div className="mt-4 rounded-lg bg-gray-50 p-3">
                          <p className="text-sm font-medium text-gray-700">Yêu cầu:</p>
                          <p className="text-sm text-gray-600">{opportunity.requirements}</p>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {spotsLeft !== null ? (
                            spotsLeft > 0 ? (
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                Còn {spotsLeft} chỗ
                              </span>
                            ) : (
                              <span className="text-orange-600">Đã đủ người</span>
                            )
                          ) : (
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {confirmedCount} đã đăng ký
                            </span>
                          )}
                        </div>

                        {(spotsLeft === null || spotsLeft > 0) && (
                          <VolunteerSignupButton
                            opportunityId={opportunity.id}
                            opportunityTitle={opportunity.title}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                <Heart className="mx-auto h-16 w-16 text-gray-300" />
                <h3 className="mt-4 font-serif text-xl font-bold text-gray-600">
                  Chưa có cơ hội tình nguyện nào
                </h3>
                <p className="mt-2 text-gray-500">
                  Các cơ hội tình nguyện mới sẽ được đăng sớm. Vui lòng quay lại sau.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-brand-cream px-6 py-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif text-2xl font-bold text-brand-navy">
              Có Câu Hỏi?
            </h2>
            <p className="mt-4 text-gray-600">
              Nếu bạn muốn biết thêm thông tin về việc tình nguyện hoặc có ý tưởng muốn đóng góp,
              xin vui lòng liên hệ với chúng tôi.
            </p>
            <a
              href="/contact"
              className="mt-6 inline-block rounded-lg bg-brand-navy px-6 py-3 font-semibold text-white hover:bg-brand-navy/90"
            >
              Liên Hệ
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
