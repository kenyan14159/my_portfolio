import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ErrorBoundary from "@/components/ErrorBoundary";
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
  metadataBase: new URL("https://shotaro.dev"),
  title: "Shotaro Futamura | Engineer × Ekiden Runner",
  description: "箱根駅伝を走ったエンジニア。16年の陸上競技で培った継続力を、ITへ。Web制作・開発のポートフォリオサイト。",
  keywords: ["Shotaro Futamura", "二村昇太朗", "箱根駅伝", "エンジニア", "Web制作", "ポートフォリオ", "Next.js", "React", "TypeScript", "フロントエンドエンジニア"],
  authors: [{ name: "Shotaro Futamura", url: "https://shotaro.dev" }],
  creator: "Shotaro Futamura",
  publisher: "Shotaro Futamura",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/shotaro_favicon.png",
    apple: "/shotaro_favicon.png",
  },
  openGraph: {
    title: "Shotaro Futamura | Engineer × Ekiden Runner",
    description: "箱根駅伝を走ったエンジニア。16年の陸上競技で培った継続力を、ITへ。",
    url: "https://shotaro.dev",
    siteName: "Shotaro Futamura Portfolio",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/shotro-ogp.jpg",
        width: 1200,
        height: 630,
        alt: "Shotaro Futamura - Engineer × Ekiden Runner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shotaro Futamura | Engineer × Ekiden Runner",
    description: "箱根駅伝を走ったエンジニア。16年の陸上競技で培った継続力を、ITへ。",
    creator: "@shotaro_93993",
    images: ["/shotro-ogp.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://shotaro.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 構造化データ (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "二村昇太朗",
    alternateName: "Shotaro Futamura",
    description: "箱根駅伝を走ったエンジニア。16年の陸上競技で培った継続力を、ITへ。",
    url: "https://shotaro.dev",
    image: "https://shotaro.dev/shotro-ogp.jpg",
    email: "info@shotaro.dev",
    sameAs: [
      "https://x.com/shotaro_93993",
      "https://www.instagram.com/shotaro.f_04/",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "日本体育大学",
    },
    knowsAbout: [
      "Web開発",
      "React",
      "Next.js",
      "TypeScript",
      "陸上競技",
      "長距離走",
      "箱根駅伝",
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "応用情報技術者",
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "基本情報技術者",
      },
    ],
    athlete: {
      "@type": "Person",
      sport: "陸上競技（長距離）",
      memberOf: {
        "@type": "SportsTeam",
        name: "日本体育大学駅伝部",
      },
    },
  };

  return (
    <html lang="ja" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
