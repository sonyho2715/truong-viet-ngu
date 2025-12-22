import Image from 'next/image';
import { Church, Heart, Users, BookOpen, Cross, Calendar } from 'lucide-react';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Breadcrumb } from '@/components/public/Breadcrumb';

export const metadata = {
  title: 'Giới Thiệu | Trường Việt Ngữ - Thiếu Nhi Thánh Thể',
  description:
    'Lịch sử và sứ mạng của Trường Việt Ngữ Thiếu Nhi Thánh Thể tại Honolulu, Hawaii. Tìm hiểu về các Thánh Tử Đạo Việt Nam.',
};

const martyrsInfo = [
  {
    name: 'Thánh Anrê Dũng-Lạc',
    title: 'Linh mục',
    martyredYear: 1839,
    description:
      'Thánh Anrê Dũng-Lạc là một trong những vị thánh nổi tiếng nhất trong số 117 Thánh Tử Đạo Việt Nam. Ngài bị xử trảm ngày 21 tháng 12 năm 1839.',
  },
  {
    name: 'Thánh Phaolô Lê Bảo Tịnh',
    title: 'Linh mục',
    martyredYear: 1857,
    description:
      'Thánh Phaolô Lê Bảo Tịnh là linh mục và là tác giả của nhiều bài thánh ca Việt Nam vẫn còn được hát trong các nhà thờ ngày nay.',
  },
  {
    name: 'Thánh Agnès Lê Thị Thành',
    title: 'Giáo dân',
    martyredYear: 1841,
    description:
      'Một trong số ít phụ nữ trong danh sách các Thánh Tử Đạo. Bà đã can đảm tuyên xưng đức tin đến hơi thở cuối cùng.',
  },
];

const timelineEvents = [
  {
    year: '1533',
    title: 'Đạo Công Giáo đến Việt Nam',
    description: 'Các nhà truyền giáo Bồ Đào Nha đầu tiên đến Việt Nam.',
  },
  {
    year: '1625',
    title: 'Linh mục Alexandre de Rhodes',
    description: 'Cha Alexandre de Rhodes đến Việt Nam và phát triển chữ Quốc Ngữ.',
  },
  {
    year: '1833-1862',
    title: 'Thời kỳ bách hại',
    description: 'Thời kỳ bách hại đạo khốc liệt nhất dưới các triều vua Minh Mạng, Thiệu Trị, và Tự Đức.',
  },
  {
    year: '1988',
    title: 'Phong Thánh',
    description: 'Đức Giáo Hoàng Gioan Phaolô II tuyên phong 117 vị Tử Đạo Việt Nam lên bậc Hiển Thánh.',
  },
];

const values = [
  {
    icon: Cross,
    title: 'Đức Tin',
    description: 'Sống và truyền đạt đức tin Công Giáo cho thế hệ trẻ.',
  },
  {
    icon: BookOpen,
    title: 'Văn Hóa',
    description: 'Bảo tồn và phát huy ngôn ngữ và văn hóa Việt Nam.',
  },
  {
    icon: Users,
    title: 'Cộng Đồng',
    description: 'Xây dựng cộng đồng đoàn kết yêu thương.',
  },
  {
    icon: Heart,
    title: 'Phục Vụ',
    description: 'Đào tạo tinh thần phục vụ tha nhân.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 to-slate-900/90 py-20 text-white">
        <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5" />
        <div className="container relative mx-auto px-4">
          <Breadcrumb items={[{ label: 'Giới Thiệu' }]} />
          <div className="mx-auto max-w-3xl text-center">
            <Church className="mx-auto mb-6 h-20 w-20 text-yellow-400" />
            <h1 className="font-serif text-4xl font-bold md:text-5xl">
              Trường Việt Ngữ
            </h1>
            <p className="mt-2 text-2xl text-yellow-400">Thiếu Nhi Thánh Thể</p>
            <p className="mt-6 text-lg text-brand-cream/90">
              Honolulu, Hawaii
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center font-serif text-3xl font-bold text-slate-900">
              Sứ Mạng Của Chúng Tôi
            </h2>
            <div className="rounded-2xl bg-white p-8 shadow-lg md:p-12">
              <p className="text-center text-lg leading-relaxed text-gray-700">
                Trường Việt Ngữ Thiếu Nhi Thánh Thể được thành lập với sứ mạng{' '}
                <strong className="text-slate-900">
                  giáo dục tiếng Việt và văn hóa Việt Nam
                </strong>{' '}
                cho các thế hệ trẻ gốc Việt tại Hawaii. Chúng tôi kết hợp việc dạy
                ngôn ngữ với{' '}
                <strong className="text-slate-900">
                  giáo dục đức tin Công Giáo
                </strong>
                , giúp các em không chỉ biết đọc, viết tiếng Việt mà còn hiểu và
                sống theo các giá trị đạo đức của cha ông.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold text-slate-900">
            Giá Trị Cốt Lõi
          </h2>
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="rounded-xl border-2 border-yellow-400/20 bg-gradient-to-b from-yellow-400/5 to-transparent p-6 text-center transition-all hover:border-yellow-400 hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400/20">
                  <value.icon className="h-8 w-8 text-yellow-400" />
                </div>
                <h3 className="mb-2 font-serif text-xl font-bold text-slate-900">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vietnamese Martyrs Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <Cross className="mx-auto mb-4 h-12 w-12 text-yellow-400" />
              <h2 className="font-serif text-3xl font-bold text-slate-900">
                117 Thánh Tử Đạo Việt Nam
              </h2>
              <p className="mt-4 text-gray-600">
                Lễ kính: Ngày 24 tháng 11 hàng năm
              </p>
            </div>

            {/* Introduction */}
            <div className="mb-12 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/90 p-8 text-white md:p-12">
              <p className="text-lg leading-relaxed">
                Trong suốt ba thế kỷ (từ thế kỷ 17 đến thế kỷ 19), hàng trăm ngàn
                người Công Giáo Việt Nam đã hy sinh mạng sống vì đức tin. Trong số
                đó, <strong className="text-yellow-400">117 vị</strong> đã được
                Đức Giáo Hoàng Gioan Phaolô II tuyên phong Hiển Thánh vào ngày{' '}
                <strong className="text-yellow-400">19 tháng 6 năm 1988</strong>.
              </p>
              <div className="mt-6 grid gap-4 text-center md:grid-cols-3">
                <div className="rounded-lg bg-white/10 p-4">
                  <div className="text-3xl font-bold text-yellow-400">8</div>
                  <div className="text-sm">Giám mục</div>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <div className="text-3xl font-bold text-yellow-400">50</div>
                  <div className="text-sm">Linh mục</div>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <div className="text-3xl font-bold text-yellow-400">59</div>
                  <div className="text-sm">Giáo dân</div>
                </div>
              </div>
            </div>

            {/* Featured Martyrs */}
            <h3 className="mb-6 text-center font-serif text-2xl font-bold text-slate-900">
              Một Số Vị Thánh Tiêu Biểu
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              {martyrsInfo.map((martyr, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
                >
                  <div className="bg-yellow-400/10 p-4">
                    <h4 className="font-serif text-lg font-bold text-slate-900">
                      {martyr.name}
                    </h4>
                    <p className="text-sm text-gray-600">{martyr.title}</p>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-700">{martyr.description}</p>
                    <p className="mt-3 text-xs text-yellow-400">
                      Tử đạo năm {martyr.martyredYear}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="mt-16">
              <h3 className="mb-8 text-center font-serif text-2xl font-bold text-slate-900">
                Lịch Sử Đạo Công Giáo Việt Nam
              </h3>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-yellow-400/30 md:block" />
                <div className="space-y-8">
                  {timelineEvents.map((event, index) => (
                    <div
                      key={index}
                      className={`relative flex items-center gap-8 ${
                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      <div className="flex-1 md:text-right">
                        {index % 2 === 0 && (
                          <div className="rounded-xl bg-white p-6 shadow-sm">
                            <div className="mb-2 text-2xl font-bold text-yellow-400">
                              {event.year}
                            </div>
                            <h4 className="font-serif text-lg font-bold text-slate-900">
                              {event.title}
                            </h4>
                            <p className="mt-2 text-sm text-gray-600">
                              {event.description}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="relative z-10 hidden h-4 w-4 rounded-full bg-yellow-400 md:block" />
                      <div className="flex-1">
                        {index % 2 !== 0 && (
                          <div className="rounded-xl bg-white p-6 shadow-sm">
                            <div className="mb-2 text-2xl font-bold text-yellow-400">
                              {event.year}
                            </div>
                            <h4 className="font-serif text-lg font-bold text-slate-900">
                              {event.title}
                            </h4>
                            <p className="mt-2 text-sm text-gray-600">
                              {event.description}
                            </p>
                          </div>
                        )}
                      </div>
                      {/* Mobile view */}
                      <div className="w-full md:hidden">
                        <div className="rounded-xl bg-white p-6 shadow-sm">
                          <div className="mb-2 text-2xl font-bold text-yellow-400">
                            {event.year}
                          </div>
                          <h4 className="font-serif text-lg font-bold text-slate-900">
                            {event.title}
                          </h4>
                          <p className="mt-2 text-sm text-gray-600">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School History */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center font-serif text-3xl font-bold text-slate-900">
              Lịch Sử Trường Việt Ngữ
            </h2>
            <div className="prose prose-lg mx-auto">
              <p className="text-gray-700">
                Trường Việt Ngữ Thiếu Nhi Thánh Thể tại Honolulu được thành lập
                với mục đích phục vụ cộng đồng người Việt Công Giáo tại Hawaii.
                Trong hơn <strong>15 năm</strong> qua, trường đã đào tạo hàng
                trăm học sinh, giúp các em duy trì tiếng Việt và đức tin trong
                môi trường sống xa quê hương.
              </p>
              <p className="text-gray-700">
                Trường hoạt động vào mỗi cuối tuần, với các lớp Việt Ngữ từ Mẫu
                Giáo đến Lớp 7, cùng với chương trình Thiếu Nhi Thánh Thể (TNTT)
                dành cho các em từ 7 đến 18 tuổi.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-12 grid gap-6 md:grid-cols-4">
              <div className="rounded-xl bg-slate-900 p-6 text-center text-white">
                <div className="text-4xl font-bold text-yellow-400">15+</div>
                <div className="mt-2 text-sm">Năm hoạt động</div>
              </div>
              <div className="rounded-xl bg-slate-900 p-6 text-center text-white">
                <div className="text-4xl font-bold text-yellow-400">8</div>
                <div className="mt-2 text-sm">Cấp lớp</div>
              </div>
              <div className="rounded-xl bg-slate-900 p-6 text-center text-white">
                <div className="text-4xl font-bold text-yellow-400">4</div>
                <div className="mt-2 text-sm">Ngành TNTT</div>
              </div>
              <div className="rounded-xl bg-slate-900 p-6 text-center text-white">
                <div className="text-4xl font-bold text-yellow-400">100%</div>
                <div className="mt-2 text-sm">Tận tâm</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-yellow-400 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl font-bold text-slate-900 md:text-3xl">
            Hãy Cùng Chúng Tôi Xây Dựng Tương Lai
          </h2>
          <p className="mt-4 text-slate-900/80">
            Ghi danh con em vào Trường Việt Ngữ ngay hôm nay
          </p>
          <a
            href="/contact"
            className="mt-6 inline-block rounded-lg bg-slate-900 px-8 py-3 font-semibold text-white transition-colors hover:bg-slate-900/90"
          >
            Liên Hệ Ghi Danh
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
