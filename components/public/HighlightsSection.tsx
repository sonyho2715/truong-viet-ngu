export function HighlightsSection() {
  const highlights = [
    {
      number: '8',
      label: 'Cấp độ',
      description: 'Mẫu Giáo A đến Lớp 5',
    },
    {
      number: '15+',
      label: 'Năm',
      description: 'Phục vụ cộng đồng',
    },
    {
      number: '100%',
      label: 'Cam kết',
      description: 'Giáo dục tiếng Việt và văn hóa',
    },
    {
      number: '5+',
      label: 'Giáo viên',
      description: 'Tận tâm và giàu kinh nghiệm',
    },
  ];

  return (
    <section className="bg-gradient-to-br from-brand-navy via-brand-navy to-brand-navy/90 px-6 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl font-bold text-brand-gold lg:text-4xl">
            Điểm Nổi Bật
          </h2>
          <p className="mt-3 text-lg text-brand-cream/90">
            Những con số nói lên cam kết của chúng tôi
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border-2 border-brand-gold/30 bg-white/5 p-8 text-center backdrop-blur-sm transition-all duration-300 hover:border-brand-gold hover:bg-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-2 font-serif text-5xl font-bold text-brand-gold">
                  {highlight.number}
                </div>
                <div className="mb-1 text-xl font-semibold text-brand-cream">
                  {highlight.label}
                </div>
                <div className="text-sm text-brand-cream/70">
                  {highlight.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
