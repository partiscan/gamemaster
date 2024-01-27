import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header/header';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'GameMaster',
  description: '',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      className={cn(
        'min-h-screen bg-background font-sans antialiased',
        inter.variable,
      )}
    >
      <body>
        <Header />
        <main className='p-4 xl:p-12 2xl:px-24'>{children}</main>
      </body>
    </html>
  );
}
