import type { Metadata } from "next";
import { Noto_Sans, Noto_Serif } from "next/font/google";
import { Toaster } from "@/components/ui/Toaster";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-noto-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const notoSerif = Noto_Serif({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-noto-serif',
  display: 'swap',
  weight: ['400', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Trường Việt Ngữ - Thiếu Nhi Thánh Thể',
  description: 'Trường Việt Ngữ Thiếu Nhi Thánh Thể - Honolulu, HI. Giáo dục tiếng Việt và văn hóa Việt Nam cho thế hệ trẻ.',
  keywords: ['Trường Việt Ngữ', 'Vietnamese School', 'Thiếu Nhi Thánh Thể', 'Honolulu', 'Hawaii', 'Vietnamese Language'],
  openGraph: {
    title: 'Trường Việt Ngữ - Thiếu Nhi Thánh Thể',
    description: 'Giáo dục tiếng Việt và văn hóa Việt Nam cho thế hệ trẻ tại Honolulu, HI',
    locale: 'vi_VN',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${notoSans.variable} ${notoSerif.variable}`}>
      <body className={`${notoSans.className} antialiased`}>
        <Providers>
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-brand-navy focus:shadow-lg"
          >
            Bỏ qua đến nội dung chính
          </a>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
