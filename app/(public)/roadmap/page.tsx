import type { Metadata } from 'next';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import {
  CheckCircle,
  Circle,
  Clock,
  Rocket,
  Users,
  Globe,
  GraduationCap,
  Shield,
  Smartphone,
  CreditCard,
  ChevronRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Lộ Trình Phát Triển - Trường Việt Ngữ',
  description: 'Xem lộ trình phát triển và các tính năng sắp tới của hệ thống Trường Việt Ngữ.',
};

interface Phase {
  number: number;
  title: string;
  titleVi: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  features: {
    name: string;
    nameVi: string;
    status: 'completed' | 'in-progress' | 'planned';
  }[];
}

const phases: Phase[] = [
  {
    number: 1,
    title: 'Foundation',
    titleVi: 'Nền Tảng',
    status: 'completed',
    icon: Rocket,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    features: [
      { name: 'Core CRUD Operations', nameVi: 'Chức năng CRUD cơ bản', status: 'completed' },
      { name: 'Authentication System', nameVi: 'Hệ thống xác thực', status: 'completed' },
      { name: 'Image & PDF Uploads', nameVi: 'Tải ảnh & PDF', status: 'completed' },
      { name: 'Responsive Design', nameVi: 'Thiết kế responsive', status: 'completed' },
    ],
  },
  {
    number: 2,
    title: 'Admin Portal',
    titleVi: 'Cổng Quản Trị',
    status: 'completed',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    features: [
      { name: 'Dashboard & Statistics', nameVi: 'Bảng điều khiển & Thống kê', status: 'completed' },
      { name: 'Student Management', nameVi: 'Quản lý học sinh', status: 'completed' },
      { name: 'Teacher Management', nameVi: 'Quản lý giáo viên', status: 'completed' },
      { name: 'Class & Schedule Management', nameVi: 'Quản lý lớp học & Lịch', status: 'completed' },
      { name: 'Blog & Announcements', nameVi: 'Blog & Thông báo', status: 'completed' },
    ],
  },
  {
    number: 3,
    title: 'Public Website',
    titleVi: 'Website Công Khai',
    status: 'completed',
    icon: Globe,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    features: [
      { name: 'Homepage & About', nameVi: 'Trang chủ & Giới thiệu', status: 'completed' },
      { name: 'Programs & Classes', nameVi: 'Chương trình & Lớp học', status: 'completed' },
      { name: 'Blog & News', nameVi: 'Blog & Tin tức', status: 'completed' },
      { name: 'Contact Form', nameVi: 'Form liên hệ', status: 'completed' },
      { name: 'Volunteer Application', nameVi: 'Đăng ký tình nguyện', status: 'completed' },
    ],
  },
  {
    number: 4,
    title: 'Teacher Portal',
    titleVi: 'Cổng Giáo Viên',
    status: 'completed',
    icon: GraduationCap,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    features: [
      { name: 'Teacher Profiles', nameVi: 'Hồ sơ giáo viên', status: 'completed' },
      { name: 'Class Assignments', nameVi: 'Phân công lớp học', status: 'completed' },
      { name: 'Learning Materials', nameVi: 'Tài liệu học tập', status: 'completed' },
      { name: 'Student Lists', nameVi: 'Danh sách học sinh', status: 'completed' },
    ],
  },
  {
    number: 5,
    title: 'Parent Portal',
    titleVi: 'Cổng Phụ Huynh',
    status: 'completed',
    icon: Users,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    features: [
      { name: 'Parent Registration', nameVi: 'Đăng ký phụ huynh', status: 'completed' },
      { name: 'Student Enrollment', nameVi: 'Ghi danh học sinh', status: 'completed' },
      { name: 'Event RSVP', nameVi: 'RSVP sự kiện', status: 'completed' },
      { name: 'Progress Tracking', nameVi: 'Theo dõi tiến độ', status: 'completed' },
    ],
  },
  {
    number: 6,
    title: 'Internationalization',
    titleVi: 'Đa Ngôn Ngữ',
    status: 'in-progress',
    icon: Globe,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    features: [
      { name: 'Vietnamese/English Toggle', nameVi: 'Chuyển đổi Việt/Anh', status: 'completed' },
      { name: 'Language Context Provider', nameVi: 'Provider ngôn ngữ', status: 'completed' },
      { name: 'Full Translation Coverage', nameVi: 'Dịch toàn bộ', status: 'in-progress' },
      { name: 'RTL Support (Future)', nameVi: 'Hỗ trợ RTL', status: 'planned' },
    ],
  },
  {
    number: 7,
    title: 'Payments & Billing',
    titleVi: 'Thanh Toán',
    status: 'upcoming',
    icon: CreditCard,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    features: [
      { name: 'Stripe Integration', nameVi: 'Tích hợp Stripe', status: 'planned' },
      { name: 'Tuition Payments', nameVi: 'Thanh toán học phí', status: 'planned' },
      { name: 'Payment History', nameVi: 'Lịch sử thanh toán', status: 'planned' },
      { name: 'Donation System', nameVi: 'Hệ thống quyên góp', status: 'planned' },
    ],
  },
  {
    number: 8,
    title: 'Mobile & Notifications',
    titleVi: 'Di Động & Thông Báo',
    status: 'upcoming',
    icon: Smartphone,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    features: [
      { name: 'PWA Support', nameVi: 'Hỗ trợ PWA', status: 'planned' },
      { name: 'Email Notifications', nameVi: 'Thông báo email', status: 'planned' },
      { name: 'SMS Alerts', nameVi: 'Cảnh báo SMS', status: 'planned' },
      { name: 'Push Notifications', nameVi: 'Thông báo đẩy', status: 'planned' },
    ],
  },
];

function StatusBadge({ status }: { status: 'completed' | 'in-progress' | 'upcoming' | 'planned' }) {
  const config = {
    completed: { label: 'Hoàn thành', labelEn: 'Completed', bg: 'bg-emerald-100', text: 'text-emerald-700' },
    'in-progress': { label: 'Đang thực hiện', labelEn: 'In Progress', bg: 'bg-amber-100', text: 'text-amber-700' },
    upcoming: { label: 'Sắp tới', labelEn: 'Upcoming', bg: 'bg-slate-100', text: 'text-slate-600' },
    planned: { label: 'Kế hoạch', labelEn: 'Planned', bg: 'bg-slate-100', text: 'text-slate-500' },
  };

  const { label, bg, text } = config[status];

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

function FeatureItem({ feature }: { feature: Phase['features'][0] }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      {feature.status === 'completed' ? (
        <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
      ) : feature.status === 'in-progress' ? (
        <Clock className="h-4 w-4 flex-shrink-0 text-amber-500" />
      ) : (
        <Circle className="h-4 w-4 flex-shrink-0 text-slate-300" />
      )}
      <span className={feature.status === 'planned' ? 'text-slate-400' : 'text-slate-700'}>
        {feature.nameVi}
      </span>
    </li>
  );
}

function PhaseCard({ phase, isLast }: { phase: Phase; isLast: boolean }) {
  const Icon = phase.icon;
  const completedCount = phase.features.filter((f) => f.status === 'completed').length;
  const progress = Math.round((completedCount / phase.features.length) * 100);

  return (
    <div className="relative flex gap-4 pb-8 md:gap-6">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${phase.bgColor} ${phase.borderColor}`}
        >
          <Icon className={`h-6 w-6 ${phase.color}`} />
        </div>
        {!isLast && <div className="mt-2 h-full w-0.5 bg-gradient-to-b from-slate-200 to-transparent" />}
      </div>

      {/* Content */}
      <div className={`flex-1 rounded-xl border ${phase.borderColor} ${phase.bgColor} p-4 md:p-6`}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${phase.color}`}>Phase {phase.number}</span>
              <StatusBadge status={phase.status} />
            </div>
            <h3 className="mt-1 text-lg font-bold text-slate-900">{phase.titleVi}</h3>
            <p className="text-sm text-slate-500">{phase.title}</p>
          </div>

          {/* Progress Ring */}
          <div className="relative h-14 w-14">
            <svg className="h-14 w-14 -rotate-90 transform">
              <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="4" fill="none" className="text-white" />
              <circle
                cx="28"
                cy="28"
                r="24"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={`${progress * 1.51} 151`}
                className={phase.color}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-700">
              {progress}%
            </span>
          </div>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {phase.features.map((feature) => (
            <FeatureItem key={feature.name} feature={feature} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const completedPhases = phases.filter((p) => p.status === 'completed').length;
  const totalPhases = phases.length;
  const overallProgress = Math.round((completedPhases / totalPhases) * 100);

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-navy to-brand-navy/90 px-6 py-12 lg:py-16">
          <div className="mx-auto max-w-5xl">
            <Breadcrumb
              items={[
                { label: 'Trang Chủ', href: '/' },
                { label: 'Lộ Trình Phát Triển' },
              ]}
            />

            <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="font-serif text-3xl font-bold text-white lg:text-4xl">
                  Lộ Trình Phát Triển
                </h1>
                <p className="mt-2 text-brand-cream">Development Roadmap</p>
                <p className="mt-4 max-w-2xl text-lg text-brand-cream/80">
                  Hành trình xây dựng nền tảng số cho Trường Việt Ngữ, từ nền tảng cơ bản đến các
                  tính năng hiện đại.
                </p>
              </div>

              {/* Overall Progress */}
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                <div className="text-center">
                  <div className="relative mx-auto h-24 w-24">
                    <svg className="h-24 w-24 -rotate-90 transform">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        className="text-white/20"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${overallProgress * 2.51} 251`}
                        className="text-brand-gold"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-white">
                      {overallProgress}%
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-brand-cream">
                    {completedPhases}/{totalPhases} giai đoạn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-slate-200 bg-white px-6 py-8">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{completedPhases}</div>
              <div className="text-sm text-slate-600">Giai đoạn hoàn thành</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">1</div>
              <div className="text-sm text-slate-600">Đang thực hiện</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-600">{totalPhases - completedPhases - 1}</div>
              <div className="text-sm text-slate-600">Sắp tới</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-brand-navy">
                {phases.reduce((acc, p) => acc + p.features.length, 0)}
              </div>
              <div className="text-sm text-slate-600">Tổng tính năng</div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 flex items-center gap-4">
              <h2 className="font-serif text-2xl font-bold text-brand-navy">Các Giai Đoạn</h2>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="space-y-2">
              {phases.map((phase, index) => (
                <PhaseCard key={phase.number} phase={phase} isLast={index === phases.length - 1} />
              ))}
            </div>
          </div>
        </section>

        {/* Legend */}
        <section className="border-t border-slate-200 bg-slate-50 px-6 py-8">
          <div className="mx-auto max-w-4xl">
            <h3 className="mb-4 font-medium text-slate-900">Chú Thích</h3>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                <span className="text-sm text-slate-600">Hoàn thành</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <span className="text-sm text-slate-600">Đang thực hiện</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="h-5 w-5 text-slate-300" />
                <span className="text-sm text-slate-600">Kế hoạch</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-brand-navy to-brand-navy/90 p-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-white">Góp Ý Cho Chúng Tôi</h2>
            <p className="mx-auto mt-2 max-w-lg text-brand-cream">
              Chúng tôi luôn lắng nghe ý kiến của phụ huynh và cộng đồng để cải thiện hệ thống.
            </p>
            <a
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand-gold px-6 py-3 font-medium text-brand-navy transition-colors hover:bg-brand-gold/90"
            >
              Liên Hệ
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
