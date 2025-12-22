'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, Mail, Phone } from 'lucide-react';
import { Navigation } from '@/components/public/Navigation';
import { Footer } from '@/components/public/Footer';
import { Breadcrumb } from '@/components/public/Breadcrumb';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // Ghi Danh
  {
    category: 'Ghi Danh',
    question: 'Làm sao để ghi danh cho con em vào trường?',
    answer:
      'Quý phụ huynh có thể liên hệ trực tiếp với văn phòng nhà trường qua email hoặc điện thoại. Chúng tôi sẽ hướng dẫn quy trình ghi danh và cung cấp các mẫu đơn cần thiết. Thời gian ghi danh thường mở vào đầu năm học (tháng 8-9).',
  },
  {
    category: 'Ghi Danh',
    question: 'Trường nhận học sinh từ mấy tuổi?',
    answer:
      'Trường nhận học sinh từ 4 tuổi (lớp Mẫu Giáo A) đến 18 tuổi. Các em nhỏ từ 4-6 tuổi sẽ học lớp Mẫu Giáo, từ 7 tuổi trở lên sẽ vào các lớp Việt Ngữ và có thể tham gia chương trình TNTT.',
  },
  {
    category: 'Ghi Danh',
    question: 'Con em tôi không biết tiếng Việt, có thể ghi danh không?',
    answer:
      'Hoàn toàn được! Chúng tôi có các lớp dành cho các em chưa biết tiếng Việt. Giáo viên sẽ hướng dẫn từ căn bản, giúp các em học đọc, viết và nói tiếng Việt một cách tự nhiên.',
  },
  {
    category: 'Ghi Danh',
    question: 'Học phí là bao nhiêu?',
    answer:
      'Xin vui lòng liên hệ văn phòng nhà trường để biết thông tin chi tiết về học phí. Chúng tôi có chính sách hỗ trợ cho các gia đình có nhiều con em theo học.',
  },
  // Lịch Học
  {
    category: 'Lịch Học',
    question: 'Trường học vào những ngày nào trong tuần?',
    answer:
      'Lớp Việt Ngữ học vào Thứ Bảy hoặc Chủ Nhật (tùy lớp). Chương trình TNTT sinh hoạt vào Chủ Nhật từ 9:00 AM đến 12:00 PM.',
  },
  {
    category: 'Lịch Học',
    question: 'Năm học bắt đầu và kết thúc khi nào?',
    answer:
      'Năm học thường bắt đầu vào tháng 9 và kết thúc vào tháng 5 năm sau. Trường nghỉ theo lịch nghỉ lễ của Giáo Hội và các ngày lễ lớn của Hawaii.',
  },
  {
    category: 'Lịch Học',
    question: 'Nếu con em nghỉ học thì báo cho ai?',
    answer:
      'Phụ huynh có thể báo nghỉ qua form trên website, gọi điện thoại, hoặc email cho giáo viên chủ nhiệm. Xin thông báo trước ít nhất 1 ngày nếu có thể.',
  },
  // Chương Trình Học
  {
    category: 'Chương Trình Học',
    question: 'Chương trình học bao gồm những gì?',
    answer:
      'Chương trình Việt Ngữ bao gồm: đọc, viết, chính tả, văn phạm, và văn hóa Việt Nam. Chương trình TNTT bao gồm: giáo lý, sinh hoạt nhóm, phụng vụ, và các hoạt động cộng đồng.',
  },
  {
    category: 'Chương Trình Học',
    question: 'TNTT là gì?',
    answer:
      'TNTT (Thiếu Nhi Thánh Thể) là Phong Trào Thanh Thiếu Nhi Thánh Thể Việt Nam, một tổ chức giáo dục đức tin Công Giáo cho giới trẻ. Các em được chia thành 4 ngành theo độ tuổi: Ấu Nhi (7-9), Thiếu Nhi (10-12), Nghĩa Sĩ (13-15), và Hiệp Sĩ (16-18).',
  },
  {
    category: 'Chương Trình Học',
    question: 'Có cần phải là người Công Giáo để ghi danh không?',
    answer:
      'Chương trình Việt Ngữ mở cho tất cả các em muốn học tiếng Việt, không phân biệt tôn giáo. Chương trình TNTT dành cho các em Công Giáo hoặc các em muốn tìm hiểu về đức tin Công Giáo.',
  },
  // Đồng Phục & Vật Dụng
  {
    category: 'Đồng Phục',
    question: 'Học sinh có cần mặc đồng phục không?',
    answer:
      'Các em tham gia TNTT cần mặc đồng phục theo quy định: quần/váy xanh đậm, áo trắng có logo TNTT, và khăn quàng theo màu của ngành. Lớp Việt Ngữ không bắt buộc đồng phục nhưng khuyến khích ăn mặc lịch sự.',
  },
  {
    category: 'Đồng Phục',
    question: 'Mua đồng phục TNTT ở đâu?',
    answer:
      'Đồng phục TNTT có thể đặt mua qua nhà trường. Xin liên hệ văn phòng để biết thêm chi tiết về giá cả và cách đặt hàng.',
  },
  {
    category: 'Đồng Phục',
    question: 'Học sinh cần mang theo những gì khi đi học?',
    answer:
      'Các em cần mang theo: sách vở, bút viết, và bữa ăn nhẹ (snack). Sách giáo khoa sẽ được phát vào đầu năm học.',
  },
  // Phụ Huynh
  {
    category: 'Phụ Huynh',
    question: 'Phụ huynh có thể tham gia hoạt động của trường không?',
    answer:
      'Chúng tôi rất hoan nghênh sự tham gia của phụ huynh! Quý vị có thể đăng ký làm tình nguyện viên, tham gia Hội Phụ Huynh, hoặc giúp đỡ trong các sự kiện của trường.',
  },
  {
    category: 'Phụ Huynh',
    question: 'Làm sao để liên lạc với giáo viên của con em?',
    answer:
      'Phụ huynh có thể liên lạc với giáo viên qua email, điện thoại, hoặc gặp trực tiếp sau giờ học. Thông tin liên lạc của giáo viên sẽ được cung cấp vào đầu năm học.',
  },
];

const categories = [...new Set(faqs.map((faq) => faq.category))];

function FAQAccordion({ faq, isOpen, onToggle }: { faq: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-gray-200 last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 text-left transition-colors hover:text-yellow-400"
      >
        <span className="pr-4 font-medium text-gray-900">{faq.question}</span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-yellow-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600">{faq.answer}</p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleItem = (question: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [question]: !prev[question],
    }));
  };

  const filteredFaqs = selectedCategory
    ? faqs.filter((faq) => faq.category === selectedCategory)
    : faqs;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-900/90 py-16 text-white">
        <div className="container mx-auto px-4">
          <Breadcrumb items={[{ label: 'Câu Hỏi Thường Gặp' }]} />
          <div className="mx-auto max-w-3xl text-center">
            <HelpCircle className="mx-auto mb-4 h-16 w-16 text-yellow-400" />
            <h1 className="font-serif text-4xl font-bold md:text-5xl">
              Câu Hỏi Thường Gặp
            </h1>
            <p className="mt-4 text-lg text-brand-cream/90">
              Tìm câu trả lời cho các thắc mắc về trường học và chương trình
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="border-b border-gray-200 bg-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-slate-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-slate-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            {selectedCategory ? (
              <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
                <h2 className="mb-6 font-serif text-2xl font-bold text-slate-900">
                  {selectedCategory}
                </h2>
                {filteredFaqs.map((faq) => (
                  <FAQAccordion
                    key={faq.question}
                    faq={faq}
                    isOpen={openItems[faq.question] || false}
                    onToggle={() => toggleItem(faq.question)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                {categories.map((category) => (
                  <div
                    key={category}
                    className="rounded-xl bg-white p-6 shadow-sm md:p-8"
                  >
                    <h2 className="mb-6 font-serif text-2xl font-bold text-slate-900">
                      {category}
                    </h2>
                    {faqs
                      .filter((faq) => faq.category === category)
                      .map((faq) => (
                        <FAQAccordion
                          key={faq.question}
                          faq={faq}
                          isOpen={openItems[faq.question] || false}
                          onToggle={() => toggleItem(faq.question)}
                        />
                      ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-r from-slate-900 to-slate-900/90 p-8 text-center text-white md:p-12">
            <h2 className="font-serif text-2xl font-bold md:text-3xl">
              Không tìm thấy câu trả lời?
            </h2>
            <p className="mt-4 text-brand-cream/90">
              Hãy liên hệ với chúng tôi, chúng tôi sẵn sàng hỗ trợ bạn
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="mailto:truongvietngu@gmail.com"
                className="flex items-center gap-2 rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-slate-900 transition-colors hover:bg-yellow-400/90"
              >
                <Mail className="h-5 w-5" />
                Email
              </a>
              <a
                href="tel:+18081234567"
                className="flex items-center gap-2 rounded-lg border-2 border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-slate-900"
              >
                <Phone className="h-5 w-5" />
                Gọi điện
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
