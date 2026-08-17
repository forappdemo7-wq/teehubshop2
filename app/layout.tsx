import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/contexts/CartContext';
import { ThemeProvider } from '@/contexts/ThemeContext'; // ✅ Import ThemeProvider
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import SessionProvider from '@/components/SessionProvider';
import { Toaster } from 'react-hot-toast';

// Optimize font loading with CSS variables
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TeeHub | Premium Sports Apparel & Custom Jerseys',
  description: 'Shop the best official jerseys, pants, shorts, and training sets. Customize your own gear and wear your identity on the pitch.',
  openGraph: {
    title: 'TeeHub - Premium Sports Apparel',
    description: 'Custom sports jerseys and premium athletic wear.',
    type: 'website',
    siteName: 'TeeHub',
  }
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen bg-white antialiased text-slate-900 selection:bg-blue-200">
        {/* ✅ ThemeProvider at the root – provides CSS variables to all components */}
        <ThemeProvider>
          <SessionProvider session={session}>
            <CartProvider>
              <Navbar />
              
              {/* Main content area */}
              <main className="flex-1 pt-[68px] sm:pt-[76px]">
                {children}
              </main>
              
              <Footer />
              
              {/* Styled Toaster to match the premium theme */}
              <Toaster 
                position="bottom-center" 
                reverseOrder={false}
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1a1c20',
                    color: '#fff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontWeight: '500',
                  },
                  success: {
                    iconTheme: {
                      primary: '#3b82f6',
                      secondary: '#fff',
                    },
                  },
                }} 
              />
            </CartProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}