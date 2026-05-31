import type { Metadata } from "next";
import { Literata, DM_Sans, JetBrains_Mono, Spectral, Inter } from "next/font/google";
import { env } from "@/lib/env";
import "./globals.css";
import Footer from "@/components/site/Footer";
import TopNav from "@/components/site/TopNav";

const serif = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
});

const sans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: env.siteName,
  description: env.siteDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable} ${spectral.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <TopNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
