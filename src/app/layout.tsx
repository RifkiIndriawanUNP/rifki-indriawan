import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/base.css';
import '@/styles/glass.css';
import '@/styles/sections.css';
import '@/styles/dock.css';
   import '@/styles/cursor.css';
   
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  title: 'Mohammad Rifki Indriawan — Portfolio',
  description: 'Informatics Engineering student focused on Data Science and Software Engineering.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
