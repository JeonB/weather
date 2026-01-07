import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import QueryProvider from "@/src/app/providers/QueryProvider";
import ThemeProvider from "@/src/app/providers/ThemeProvider";
import FavoritesQuickAccess from "@/components/layout/FavoritesQuickAccess";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "날씨 앱 - 대한민국 날씨 정보",
  description: "대한민국 지역의 날씨 정보를 조회하고 즐겨찾기에 추가하세요",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider>
          <QueryProvider>
            {children}
            <FavoritesQuickAccess />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
