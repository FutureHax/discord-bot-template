import type { Metadata, Viewport } from 'next';
import { ChakraProviders } from '@/providers/ChakraProviders';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: '{{APP_TITLE}} Dashboard',
    template: '%s | {{APP_TITLE}}',
  },
  description: 'Admin dashboard for {{APP_TITLE}} Discord bot',
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#5865F2',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ChakraProviders>{children}</ChakraProviders>
      </body>
    </html>
  );
}