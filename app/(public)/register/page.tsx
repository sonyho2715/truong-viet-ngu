'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  User,
  Users,
  MapPin,
  AlertTriangle,
  FileText,
  CheckCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const GRADE_LEVELS = [
  { value: 'MAU_GIAO_A', label: 'Mẫu Giáo A (4-5 tuổi)' },
  { value: 'MAU_GIAO_B', label: 'Mẫu Giáo B (5-6 tuổi)' },
  { value: 'MAU_GIAO_C', label: 'Mẫu Giáo C (6-7 tuổi)' },
  { value: 'LOP_1', label: 'Lớp 1 (7-8 tuổi)' },
  { value: 'LOP_2', label: 'Lớp 2 (8-9 tuổi)' },
  { value: 'LOP_3', label: 'Lớp 3 (9-10 tuổi)' },
  { value: 'LOP_4', label: 'Lớp 4 (10-11 tuổi)' },
  { value: 'LOP_5', label: 'Lớp 5 (11-12 tuổi)' },
  { value: 'LOP_6', label: 'Lớp 6 (12-13 tuổi)' },
  { value: 'LOP_7', label: 'Lớp 7 (13+ tuổi)' },
];

const STEPS = [
  { id: 1, name: 'Học sinh', icon: GraduationCap },
  { id: 2, name: 'Phụ huynh', icon: Users },
  { id: 3, name: 'Địa chỉ', icon: MapPin },
  { id: 4, name: 'Khẩn cấp', icon: AlertTriangle },
  { id: 5, name: 'Xác nhận', icon: FileText },
];

export default function RegistrationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    // Student Info
    studentFirstName: '',
    studentLastName: '',
    studentDOB: '',
    preferredGrade: '',
    // Parent 1 Info
    parentFirstName: '',
    parentLastName: '',
    parentEmail: '',
    parentPhone: '',
    parentRelation: '',
    // Parent 2 Info (optional)
    parent2FirstName: '',
    parent2LastName: '',
    parent2Email: '',
    parent2Phone: '',
    parent2Relation: '',
    // Address
    address: '',
    city: '',
    state: 'HI',
    zipCode: '',
    // Emergency Contact
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: '',
    // Additional Info
    previousSchool: '',
    medicalNotes: '',
    allergies: '',
    specialNeeds: '',
    howHeard: '',
    additionalNotes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.studentFirstName && formData.studentLastName && formData.studentDOB);
      case 2:
        return !!(formData.parentFirstName && formData.parentLastName && formData.parentEmail && formData.parentPhone && formData.parentRelation);
      case 3:
        return !!(formData.address && formData.city && formData.state && formData.zipCode);
      case 4:
        return !!(formData.emergencyName && formData.emergencyPhone && formData.emergencyRelation);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }
    setError('');
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handlePrevious = () => {
    setError('');
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Đã xảy ra lỗi khi gửi đơn đăng ký');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-2xl px-4">
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">
              Đăng Ký Thành Công!
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Cảm ơn bạn đã gửi đơn đăng ký cho con em.
            </p>
            <p className="mt-2 text-gray-500">
              Chúng tôi sẽ xem xét và liên hệ qua email <strong>{formData.parentEmail}</strong> trong thời gian sớm nhất.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/"
                className="rounded-lg bg-brand-navy px-6 py-3 font-semibold text-white hover:bg-brand-navy/90"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Đăng Ký Học Sinh Mới
          </h1>
          <p className="mt-2 text-gray-600">
            Điền thông tin bên dưới để đăng ký cho con em vào Trường Việt Ngữ
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center rounded-full p-2 ${
                    currentStep >= step.id
                      ? 'bg-brand-navy text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <span
                  className={`ml-2 hidden text-sm font-medium sm:inline ${
                    currentStep >= step.id ? 'text-brand-navy' : 'text-gray-400'
                  }`}
                >
                  {step.name}
                </span>
                {index < STEPS.length - 1 && (
                  <div
                    className={`mx-3 h-0.5 w-8 sm:w-12 ${
                      currentStep > step.id ? 'bg-brand-navy' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Step 1: Student Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <GraduationCap className="h-6 w-6 text-brand-gold" />
                Thông Tin Học Sinh
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="studentFirstName"
                    value={formData.studentFirstName}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Họ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="studentLastName"
                    value={formData.studentLastName}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ngày sinh <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="studentDOB"
                    value={formData.studentDOB}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Lớp muốn đăng ký
                  </label>
                  <select
                    name="preferredGrade"
                    value={formData.preferredGrade}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                  >
                    <option value="">Để trường xếp lớp</option>
                    {GRADE_LEVELS.map(grade => (
                      <option key={grade.value} value={grade.value}>
                        {grade.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Parent Info */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <Users className="h-6 w-6 text-brand-gold" />
                Thông Tin Phụ Huynh
              </h2>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-medium text-gray-900">Phụ huynh chính <span className="text-red-500">*</span></h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên</label>
                    <input
                      type="text"
                      name="parentFirstName"
                      value={formData.parentFirstName}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ</label>
                    <input
                      type="text"
                      name="parentLastName"
                      value={formData.parentLastName}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="parentEmail"
                      value={formData.parentEmail}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input
                      type="tel"
                      name="parentPhone"
                      value={formData.parentPhone}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Quan hệ với học sinh</label>
                    <select
                      name="parentRelation"
                      value={formData.parentRelation}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                      required
                    >
                      <option value="">Chọn quan hệ</option>
                      <option value="Mẹ">Mẹ</option>
                      <option value="Cha">Cha</option>
                      <option value="Người giám hộ">Người giám hộ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-medium text-gray-900">Phụ huynh phụ (tùy chọn)</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên</label>
                    <input
                      type="text"
                      name="parent2FirstName"
                      value={formData.parent2FirstName}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ</label>
                    <input
                      type="text"
                      name="parent2LastName"
                      value={formData.parent2LastName}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="parent2Email"
                      value={formData.parent2Email}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input
                      type="tel"
                      name="parent2Phone"
                      value={formData.parent2Phone}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Quan hệ với học sinh</label>
                    <select
                      name="parent2Relation"
                      value={formData.parent2Relation}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    >
                      <option value="">Chọn quan hệ</option>
                      <option value="Mẹ">Mẹ</option>
                      <option value="Cha">Cha</option>
                      <option value="Người giám hộ">Người giám hộ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <MapPin className="h-6 w-6 text-brand-gold" />
                Địa Chỉ
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Số nhà, tên đường"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thành phố <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tiểu bang <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mã bưu điện <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Emergency Contact */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <AlertTriangle className="h-6 w-6 text-brand-gold" />
                Liên Hệ Khẩn Cấp & Thông Tin Thêm
              </h2>

              <div className="rounded-lg bg-red-50 p-4">
                <h3 className="font-medium text-gray-900">
                  Người liên hệ khẩn cấp <span className="text-red-500">*</span>
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  (Phải khác với phụ huynh đã điền ở trên)
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                    <input
                      type="text"
                      name="emergencyName"
                      value={formData.emergencyName}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Quan hệ</label>
                    <input
                      type="text"
                      name="emergencyRelation"
                      value={formData.emergencyRelation}
                      onChange={handleChange}
                      placeholder="Ông, bà, cô, chú..."
                      className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Trường học trước đây (nếu có)
                  </label>
                  <input
                    type="text"
                    name="previousSchool"
                    value={formData.previousSchool}
                    onChange={handleChange}
                    placeholder="Tên trường Việt ngữ trước đây"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ghi chú y tế
                  </label>
                  <textarea
                    name="medicalNotes"
                    value={formData.medicalNotes}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Các vấn đề sức khỏe cần biết"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dị ứng
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="Thức ăn, thuốc, etc."
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nhu cầu đặc biệt
                  </label>
                  <textarea
                    name="specialNeeds"
                    value={formData.specialNeeds}
                    onChange={handleChange}
                    rows={2}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Bạn biết về trường qua đâu?
                  </label>
                  <select
                    name="howHeard"
                    value={formData.howHeard}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                  >
                    <option value="">Chọn một</option>
                    <option value="Nhà thờ">Nhà thờ</option>
                    <option value="Bạn bè / Gia đình">Bạn bè / Gia đình</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Tìm kiếm Internet">Tìm kiếm Internet</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-xl font-semibold text-gray-900">
                <FileText className="h-6 w-6 text-brand-gold" />
                Xác Nhận Thông Tin
              </h2>

              <div className="space-y-4 text-sm">
                <div className="rounded-lg bg-blue-50 p-4">
                  <h3 className="font-semibold text-blue-900">Học sinh</h3>
                  <p className="mt-1 text-blue-800">
                    {formData.studentFirstName} {formData.studentLastName}
                  </p>
                  <p className="text-blue-700">
                    Ngày sinh: {formData.studentDOB}
                  </p>
                  {formData.preferredGrade && (
                    <p className="text-blue-700">
                      Lớp: {GRADE_LEVELS.find(g => g.value === formData.preferredGrade)?.label}
                    </p>
                  )}
                </div>

                <div className="rounded-lg bg-green-50 p-4">
                  <h3 className="font-semibold text-green-900">Phụ huynh</h3>
                  <p className="mt-1 text-green-800">
                    {formData.parentFirstName} {formData.parentLastName} ({formData.parentRelation})
                  </p>
                  <p className="text-green-700">{formData.parentEmail}</p>
                  <p className="text-green-700">{formData.parentPhone}</p>
                </div>

                <div className="rounded-lg bg-yellow-50 p-4">
                  <h3 className="font-semibold text-yellow-900">Địa chỉ</h3>
                  <p className="mt-1 text-yellow-800">
                    {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
                  </p>
                </div>

                <div className="rounded-lg bg-red-50 p-4">
                  <h3 className="font-semibold text-red-900">Liên hệ khẩn cấp</h3>
                  <p className="mt-1 text-red-800">
                    {formData.emergencyName} ({formData.emergencyRelation})
                  </p>
                  <p className="text-red-700">{formData.emergencyPhone}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ghi chú thêm
                </label>
                <textarea
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Bất kỳ thông tin nào khác bạn muốn chia sẻ..."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
                />
              </div>

              <div className="rounded-lg bg-gray-100 p-4">
                <p className="text-sm text-gray-600">
                  Bằng cách gửi đơn này, tôi xác nhận rằng tất cả thông tin trên là chính xác và đầy đủ.
                  Tôi đồng ý để trường liên hệ qua email hoặc điện thoại về việc đăng ký.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevious}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
              >
                <ChevronLeft className="h-5 w-5" />
                Quay lại
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 rounded-lg bg-brand-navy px-6 py-3 font-semibold text-white hover:bg-brand-navy/90"
              >
                Tiếp tục
                <ChevronRight className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-brand-gold px-8 py-3 font-semibold text-brand-navy hover:bg-brand-gold/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi Đơn Đăng Ký'}
              </button>
            )}
          </div>
        </form>

        {/* Help */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Cần trợ giúp?{' '}
          <Link href="/contact" className="text-brand-navy hover:underline">
            Liên hệ với chúng tôi
          </Link>
        </p>
      </div>
    </div>
  );
}
