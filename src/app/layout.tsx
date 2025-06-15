import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'QR Code Generator | Instant & Easy',
    template: '%s | QR Code Generator',
  },
  description: 'Create, generate, and download QR codes for your URLs quickly and easily. A free online tool for all your QR code needs.',
  keywords: ['QR code', 'generator', 'free tool', 'URL to QR', 'online QR generator', 'custom QR code', 'download QR'],
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(217.2 91.2% 59.8%)' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(217.2 91.2% 59.8%)' },
  ],
  openGraph: {
    title: 'QR Code Generator | Instant & Easy',
    description: 'Create, generate, and download QR codes for your URLs quickly and easily.',
    type: 'website',
    locale: 'en_US',
    url: 'https://your-app-url.com', // Replace with your actual app URL
    siteName: 'QR Code Generator',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} light`} suppressHydrationWarning>
      <head />
      <body className="font-body antialiased selection:bg-primary/20 selection:text-primary">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
