import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/context';

export const metadata: Metadata = {
  title: 'CSDSIMS | Computer Science Dept · Moshood Abiola Polytechnic (MAPOLY)',
  description: 'Role-aware information management system for course registration, result computation, attendance, timetabling, and departmental communications at MAPOLY Abeokuta.',
  manifest: '/manifest.json',
  themeColor: '#064e3b',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CSDSIMS MAPOLY',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#064e3b" />
      </head>
      <body className="antialiased bg-base text-text-primary min-h-screen">
        <AppProvider>
          {children}
        </AppProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(reg) { console.log('SW registered:', reg.scope); },
                    function(err) { console.log('SW registration failed:', err); }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
