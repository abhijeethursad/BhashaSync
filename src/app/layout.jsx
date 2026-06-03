import './globals.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'BhashaSync | Language Learning Management',
  description: 'Enterprise Learning Management System tailored for modern language institutes.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="font-sans antialiased text-gray-900 bg-gray-50 dark:text-[#f1f1f1] dark:bg-[#0B1120] transition-colors duration-500 flex flex-col min-h-screen pb-16 md:pb-0">
        
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 3000,
            style: {
              background: 'transparent', // Let the Tailwind class handle it!
              color: 'inherit',          // Let the Tailwind class handle it!
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '12px 24px',      // Slightly thicker padding for a premium feel
              fontWeight: '600',
              boxShadow: 'none',         // Let Tailwind handle the shadow
            },
            // Smart Dark/Light Mode adaptation using pure Tailwind
            className: 'bg-slate-200 dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-200 dark:border-white/10 shadow-2xl',
          }}
        />
        
        <Navbar />
        
        {/* The 'children' represents whatever page you are currently on (Home, Login, Dashboard) */}
        <main className="grow flex flex-col">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}