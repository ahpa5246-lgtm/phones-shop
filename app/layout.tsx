import type { Metadata } from 'next';
import './globals.css';
import './commerce.css';
import SiteHeader from '@/components/site-header';

export const metadata: Metadata = {
  title: 'NOVA Mobile | Premium Smartphones',
  description: 'Premium smartphones, accessories, offers, warranty and trusted service in Iraq.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
