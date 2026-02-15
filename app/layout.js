import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Analytics from "@/components/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kawinphop Chomnikorn - Software Engineer",
  description: "Portfolio of Kawinphop Chomnikorn, a Software Engineer based in Bangkok, experiencing in Flutter, Dart, Firebase, and Mobile Application Development.",
  keywords: ["Kawinphop Chomnikorn", "Software Engineer", "Flutter Developer", "Mobile Developer", "Bangkok", "Thailand"],
  openGraph: {
    title: "Kawinphop Chomnikorn - Software Engineer",
    description: "Portfolio of Kawinphop Chomnikorn, a Software Engineer based in Bangkok.",
    url: "https://kawin101.github.io",
    siteName: "Kawinphop Chomnikorn Portfolio",
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/76491614",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
