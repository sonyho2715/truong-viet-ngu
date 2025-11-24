import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-playfair',
  display: 'swap',
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
    <html lang="vi" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
