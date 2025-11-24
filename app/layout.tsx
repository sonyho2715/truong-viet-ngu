import type { Metadata } from "next";
import { Noto_Sans, Noto_Serif } from "next/font/google";
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
        {children}
      </body>
    </html>
  );
}
