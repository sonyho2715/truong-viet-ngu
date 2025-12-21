import type { Metadata } from 'next';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Breadcrumb } from '@/components/public/Breadcrumb';
import {
  Users,
  GraduationCap,
  Shield,
  Globe,
  Search,
  FileText,
  UserPlus,
  LogIn,
  ClipboardList,
  Calendar,
  Bell,
  BookOpen,
  BarChart3,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  ArrowDown,
  Heart,
  Mail,
  Eye,
  Settings,
  PenTool,
  UserCheck,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hành Trình Khách Hàng - Trường Việt Ngữ',
  description: 'Khám phá hành trình trải nghiệm của phụ huynh, giáo viên và khách truy cập tại Trường Việt Ngữ.',
};

interface JourneyStep {
  icon: React.ElementType;
  title: string;
  titleVi: string;
  description: string;
}

interface UserJourney {
  id: string;
  userType: string;
  userTypeVi: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
  description: string;
  steps: JourneyStep[];
}

const journeys: UserJourney[] = [
  {
    id: 'visitor',
    userType: 'Website Visitor',
    userTypeVi: 'Khách Truy Cập',
    icon: Globe,
    color: 'text-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    gradientFrom: 'from-sky-500',
    gradientTo: 'to-blue-600',
    description: 'Người lần đầu ghé thăm website tìm hiểu về trường',
    steps: [
      { icon: Search, title: 'Discover', titleVi: 'Khám Phá', description: 'Tìm thấy trường qua Google hoặc giới thiệu' },
      { icon: Eye, title: 'Browse', titleVi: 'Xem Thông Tin', description: 'Xem chương trình, lịch học, giáo viên' },
      { icon: FileText, title: 'Learn', titleVi: 'Tìm Hiểu', description: 'Đọc blog, tin tức, câu hỏi thường gặp' },
      { icon: Mail, title: 'Contact', titleVi: 'Liên Hệ', description: 'Gửi câu hỏi qua form liên hệ' },
      { icon: Heart, title: 'Volunteer', titleVi: 'Tình Nguyện', description: 'Đăng ký làm tình nguyện viên' },
      { icon: UserPlus, title: 'Register', titleVi: 'Đăng Ký', description: 'Tạo tài khoản phụ huynh' },
    ],
  },
  {
    id: 'parent',
    userType: 'Parent',
    userTypeVi: 'Phụ Huynh',
    icon: Users,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    gradientFrom: 'from-rose-500',
    gradientTo: 'to-pink-600',
    description: 'Phụ huynh quản lý việc học của con em',
    steps: [
      { icon: UserPlus, title: 'Register', titleVi: 'Đăng Ký', description: 'Tạo tài khoản phụ huynh' },
      { icon: LogIn, title: 'Login', titleVi: 'Đăng Nhập', description: 'Đăng nhập vào cổng phụ huynh' },
      { icon: ClipboardList, title: 'Enroll', titleVi: 'Ghi Danh', description: 'Đăng ký con vào lớp học' },
      { icon: BarChart3, title: 'Dashboard', titleVi: 'Bảng Điều Khiển', description: 'Xem tổng quan và thông báo' },
      { icon: Calendar, title: 'RSVP', titleVi: 'Xác Nhận', description: 'RSVP cho các sự kiện trường' },
      { icon: BookOpen, title: 'Track', titleVi: 'Theo Dõi', description: 'Theo dõi tiến độ học tập' },
    ],
  },
  {
    id: 'teacher',
    userType: 'Teacher',
    userTypeVi: 'Giáo Viên',
    icon: GraduationCap,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    gradientFrom: 'from-amber-500',
    gradientTo: 'to-orange-600',
    description: 'Giáo viên quản lý lớp học và học sinh',
    steps: [
      { icon: UserPlus, title: 'Apply', titleVi: 'Ứng Tuyển', description: 'Đăng ký làm giáo viên' },
      { icon: UserCheck, title: 'Approved', titleVi: 'Duyệt', description: 'Được admin phê duyệt' },
      { icon: LogIn, title: 'Login', titleVi: 'Đăng Nhập', description: 'Đăng nhập cổng giáo viên' },
      { icon: BookOpen, title: 'Classes', titleVi: 'Lớp Học', description: 'Xem danh sách lớp được phân công' },
      { icon: PenTool, title: 'Materials', titleVi: 'Tài Liệu', description: 'Quản lý tài liệu giảng dạy' },
      { icon: Users, title: 'Students', titleVi: 'Học Sinh', description: 'Quản lý danh sách học sinh' },
    ],
  },
  {
    id: 'admin',
    userType: 'Administrator',
    userTypeVi: 'Quản Trị Viên',
    icon: Shield,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    gradientFrom: 'from-indigo-500',
    gradientTo: 'to-purple-600',
    description: 'Admin quản lý toàn bộ hệ thống',
    steps: [
      { icon: LogIn, title: 'Login', titleVi: 'Đăng Nhập', description: 'Đăng nhập với quyền admin' },
      { icon: BarChart3, title: 'Dashboard', titleVi: 'Tổng Quan', description: 'Xem thống kê và hoạt động' },
      { icon: Users, title: 'Manage', titleVi: 'Quản Lý', description: 'Quản lý học sinh, giáo viên, lớp' },
      { icon: FileText, title: 'Content', titleVi: 'Nội Dung', description: 'Đăng thông báo, blog, sự kiện' },
      { icon: Bell, title: 'Notify', titleVi: 'Thông Báo', description: 'Gửi thông báo đến phụ huynh' },
      { icon: Settings, title: 'Configure', titleVi: 'Cấu Hình', description: 'Cài đặt hệ thống' },
    ],
  },
];

function JourneyCard({ journey }: { journey: UserJourney }) {
  const Icon = journey.icon;

  return (
    <div className={`rounded-2xl border-2 ${journey.borderColor} overflow-hidden`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${journey.gradientFrom} ${journey.gradientTo} p-6 text-white`}>
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
            <Icon className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold">{journey.userTypeVi}</h3>
            <p className="text-sm opacity-90">{journey.userType}</p>
          </div>
        </div>
        <p className="mt-3 text-sm opacity-90">{journey.description}</p>
      </div>

      {/* Steps */}
      <div className={`${journey.bgColor} p-6`}>
        <div className="space-y-3">
          {journey.steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div key={step.title} className="flex items-start gap-3">
                {/* Step number and connector */}
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${journey.borderColor} bg-white`}
                  >
                    <StepIcon className={`h-5 w-5 ${journey.color}`} />
                  </div>
                  {index < journey.steps.length - 1 && (
                    <div className={`h-6 w-0.5 ${journey.color} opacity-30`} />
                  )}
                </div>

                {/* Step content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${journey.color}`}>
                      {index + 1}
                    </span>
                    <h4 className="font-semibold text-slate-900">{step.titleVi}</h4>
                    <span className="text-xs text-slate-400">({step.title})</span>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-600">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function FlowDiagram() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8">
      <h3 className="mb-6 text-center font-serif text-xl font-bold text-brand-navy">
        Tổng Quan Luồng Người Dùng
      </h3>

      {/* Desktop Flow */}
      <div className="hidden md:block">
        <div className="flex items-center justify-center gap-4">
          {/* Visitor */}
          <div className="rounded-xl bg-sky-100 p-4 text-center">
            <Globe className="mx-auto h-8 w-8 text-sky-600" />
            <p className="mt-2 text-sm font-medium text-sky-800">Khách</p>
          </div>

          <ArrowRight className="h-6 w-6 text-slate-300" />

          {/* Decision */}
          <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-4 text-center">
            <p className="text-sm font-medium text-slate-600">Đăng ký là...</p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <ArrowRight className="h-6 w-6 text-rose-300" />
              <div className="rounded-xl bg-rose-100 p-4 text-center">
                <Users className="mx-auto h-8 w-8 text-rose-600" />
                <p className="mt-2 text-sm font-medium text-rose-800">Phụ Huynh</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ArrowRight className="h-6 w-6 text-amber-300" />
              <div className="rounded-xl bg-amber-100 p-4 text-center">
                <GraduationCap className="mx-auto h-8 w-8 text-amber-600" />
                <p className="mt-2 text-sm font-medium text-amber-800">Giáo Viên</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ArrowRight className="h-6 w-6 text-emerald-300" />
              <div className="rounded-xl bg-emerald-100 p-4 text-center">
                <Heart className="mx-auto h-8 w-8 text-emerald-600" />
                <p className="mt-2 text-sm font-medium text-emerald-800">Tình Nguyện</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Flow */}
      <div className="flex flex-col items-center gap-3 md:hidden">
        <div className="rounded-xl bg-sky-100 px-6 py-3 text-center">
          <Globe className="mx-auto h-6 w-6 text-sky-600" />
          <p className="mt-1 text-sm font-medium text-sky-800">Khách Truy Cập</p>
        </div>

        <ArrowDown className="h-6 w-6 text-slate-300" />

        <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-3 text-center">
          <p className="text-sm font-medium text-slate-600">Chọn vai trò</p>
        </div>

        <ArrowDown className="h-6 w-6 text-slate-300" />

        <div className="grid w-full grid-cols-3 gap-2">
          <div className="rounded-xl bg-rose-100 p-3 text-center">
            <Users className="mx-auto h-5 w-5 text-rose-600" />
            <p className="mt-1 text-xs font-medium text-rose-800">Phụ Huynh</p>
          </div>
          <div className="rounded-xl bg-amber-100 p-3 text-center">
            <GraduationCap className="mx-auto h-5 w-5 text-amber-600" />
            <p className="mt-1 text-xs font-medium text-amber-800">Giáo Viên</p>
          </div>
          <div className="rounded-xl bg-emerald-100 p-3 text-center">
            <Heart className="mx-auto h-5 w-5 text-emerald-600" />
            <p className="mt-1 text-xs font-medium text-emerald-800">Tình Nguyện</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Touchpoints() {
  const touchpoints = [
    { label: 'Website', labelVi: 'Website', icon: Globe, color: 'bg-sky-500' },
    { label: 'Parent Portal', labelVi: 'Cổng Phụ Huynh', icon: Users, color: 'bg-rose-500' },
    { label: 'Teacher Portal', labelVi: 'Cổng Giáo Viên', icon: GraduationCap, color: 'bg-amber-500' },
    { label: 'Admin Dashboard', labelVi: 'Admin', icon: Shield, color: 'bg-indigo-500' },
    { label: 'Email', labelVi: 'Email', icon: Mail, color: 'bg-emerald-500' },
    { label: 'Contact Form', labelVi: 'Form Liên Hệ', icon: MessageSquare, color: 'bg-purple-500' },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="mb-4 font-serif text-lg font-bold text-brand-navy">Các Điểm Tiếp Xúc</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
        {touchpoints.map((tp) => {
          const Icon = tp.icon;
          return (
            <div key={tp.label} className="text-center">
              <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-xl ${tp.color}`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <p className="mt-2 text-xs font-medium text-slate-700">{tp.labelVi}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KeyMetrics() {
  const metrics = [
    { value: '6', label: 'Bước cho Phụ Huynh' },
    { value: '6', label: 'Bước cho Giáo Viên' },
    { value: '4', label: 'Loại người dùng' },
    { value: '6', label: 'Điểm tiếp xúc' },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {metrics.map((m) => (
        <div key={m.label} className="rounded-xl bg-white p-4 text-center shadow-sm">
          <div className="text-3xl font-bold text-brand-navy">{m.value}</div>
          <div className="mt-1 text-sm text-slate-600">{m.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function CustomerJourneyPage() {
  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-navy to-brand-navy/90 px-6 py-12 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <Breadcrumb
              items={[
                { label: 'Trang Chủ', href: '/' },
                { label: 'Hành Trình Khách Hàng' },
              ]}
            />

            <div className="mt-6">
              <h1 className="font-serif text-3xl font-bold text-white lg:text-4xl">
                Hành Trình Khách Hàng
              </h1>
              <p className="mt-2 text-brand-cream">Customer Journey Map</p>
              <p className="mt-4 max-w-2xl text-lg text-brand-cream/80">
                Khám phá cách các đối tượng khác nhau tương tác với hệ thống Trường Việt Ngữ,
                từ lần đầu ghé thăm đến khi trở thành thành viên tích cực của cộng đồng.
              </p>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="border-b border-slate-200 bg-slate-100 px-6 py-8">
          <div className="mx-auto max-w-6xl">
            <KeyMetrics />
          </div>
        </section>

        {/* Flow Diagram */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <FlowDiagram />
          </div>
        </section>

        {/* Touchpoints */}
        <section className="px-6 pb-12">
          <div className="mx-auto max-w-6xl">
            <Touchpoints />
          </div>
        </section>

        {/* User Journeys */}
        <section className="bg-slate-100 px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-center gap-4">
              <h2 className="font-serif text-2xl font-bold text-brand-navy">
                Chi Tiết Hành Trình
              </h2>
              <div className="h-px flex-1 bg-slate-300" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {journeys.map((journey) => (
                <JourneyCard key={journey.id} journey={journey} />
              ))}
            </div>
          </div>
        </section>

        {/* Success Indicators */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-center font-serif text-2xl font-bold text-brand-navy">
              Chỉ Số Thành Công
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                <CheckCircle className="h-10 w-10 text-emerald-600" />
                <h3 className="mt-4 font-bold text-emerald-900">Phụ Huynh Hài Lòng</h3>
                <ul className="mt-3 space-y-2 text-sm text-emerald-700">
                  <li>• Đăng ký dễ dàng trong 5 phút</li>
                  <li>• Theo dõi tiến độ con em</li>
                  <li>• Nhận thông báo kịp thời</li>
                  <li>• RSVP sự kiện thuận tiện</li>
                </ul>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
                <CheckCircle className="h-10 w-10 text-amber-600" />
                <h3 className="mt-4 font-bold text-amber-900">Giáo Viên Hiệu Quả</h3>
                <ul className="mt-3 space-y-2 text-sm text-amber-700">
                  <li>• Quản lý lớp dễ dàng</li>
                  <li>• Chia sẻ tài liệu nhanh chóng</li>
                  <li>• Xem danh sách học sinh</li>
                  <li>• Cập nhật hồ sơ cá nhân</li>
                </ul>
              </div>

              <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6">
                <CheckCircle className="h-10 w-10 text-indigo-600" />
                <h3 className="mt-4 font-bold text-indigo-900">Quản Trị Mạnh Mẽ</h3>
                <ul className="mt-3 space-y-2 text-sm text-indigo-700">
                  <li>• Dashboard tổng quan</li>
                  <li>• Quản lý toàn bộ hệ thống</li>
                  <li>• Đăng nội dung linh hoạt</li>
                  <li>• Báo cáo và thống kê</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-brand-navy to-brand-navy/90 px-6 py-12">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="font-serif text-2xl font-bold text-white">
              Bắt Đầu Hành Trình Của Bạn
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-brand-cream">
              Tham gia cùng Trường Việt Ngữ để con em bạn được học tiếng Việt và văn hóa Việt Nam.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="/parent/register"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-gold px-6 py-3 font-medium text-brand-navy transition-colors hover:bg-brand-gold/90"
              >
                <Users className="h-5 w-5" />
                Đăng Ký Phụ Huynh
              </a>
              <a
                href="/register/teacher"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
              >
                <GraduationCap className="h-5 w-5" />
                Đăng Ký Giáo Viên
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
