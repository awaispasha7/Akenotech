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
      { url: '/final.png', sizes: '32x32', type: 'image/png' },
      { url: '/final.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/final.png',
    apple: '/final.png',
  },
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/final.png" type="image/png" />
        <link rel="shortcut icon" href="/final.png" type="image/png" />
        <link rel="apple-touch-icon" href="/final.png" />
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