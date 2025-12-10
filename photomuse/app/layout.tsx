import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PhotoMuse | AI Photography Ideas Generator',
  description: 'One click, one stunning shoot concept. AI-powered photography ideas for fine art photographers who refuse to run dry.',
  keywords: ['photography ideas', 'creative inspiration', 'AI photography', 'shoot concepts', 'fine art photography'],
  authors: [{ name: 'PhotoMuse' }],
  openGraph: {
    title: 'PhotoMuse | AI Photography Ideas Generator',
    description: 'One click, one stunning shoot concept.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-charcoal-950 text-slate-100 antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
