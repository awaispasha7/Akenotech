import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Akeno Tech - AI Solutions",
  description: "Transform your business with custom AI solutions. We build scalable AI systems that automate workflows and deliver actionable insights.",
  icons: {
    icon: [
      { url: '/akeno-tech.png', sizes: '32x32', type: 'image/png' },
      { url: '/akeno-tech.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/akeno-tech.png',
    apple: '/akeno-tech.png',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/akeno-tech.png" type="image/png" />
        <link rel="shortcut icon" href="/akeno-tech.png" type="image/png" />
        <link rel="apple-touch-icon" href="/akeno-tech.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}