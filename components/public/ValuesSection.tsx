import { BookOpen, Heart, Users } from 'lucide-react';

const values = [
  {
    title: 'Ngôn Ngữ',
    description: 'Rèn luyện 4 kỹ năng: Nghe, Nói, Đọc, Viết qua giáo trình bài bản.',
    icon: BookOpen,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-100',
    iconBgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
  },
  {
    title: 'Văn Hóa',
    description: 'Học ca dao, tục ngữ, phong tục tập quán và lễ hội truyền thống.',
    icon: Heart,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-100',
    iconBgColor: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  {
    title: 'Đức Tin',
    description: 'Môi trường học tập lành mạnh, gắn kết với sinh hoạt Thiếu Nhi Thánh Thể.',
    icon: Users,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-100',
    iconBgColor: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
];

export function ValuesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 font-serif">
            Sứ Mạng Của Chúng Tôi
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Trường Việt Ngữ là một phần không thể thiếu của Cộng Đoàn, với sứ mạng giúp các em thanh thiếu niên sinh trưởng tại hải ngoại không quên tiếng mẹ đẻ, đồng thời hiểu biết thêm về lịch sử và văn hóa hào hùng của dân tộc Việt Nam.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div
                key={index}
                className={`p-8 rounded-2xl ${value.bgColor} border ${value.borderColor} text-center hover:shadow-lg transition-shadow`}
              >
                <div className={`w-16 h-16 mx-auto ${value.iconBgColor} rounded-full flex items-center justify-center ${value.iconColor} mb-4`}>
                  <IconComponent size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-slate-600">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
