'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Zap,
  ChevronDown,
  Package,
  RefreshCw,
  FileText,
  Shield,
  Mail
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { totalItems } = useCart();
  const { theme } = useTheme();               // ← get current theme colours
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const categories = ['Jersey', 'Pants', 'Shorts', 'Set'];

  const supportLinks = [
    { name: 'Track Order', href: '/track-order', icon: Package },
    { name: 'Return & Refund', href: '/returns', icon: RefreshCw },
    { name: 'Terms of Service', href: '/terms', icon: FileText },
    { name: 'Privacy Policy', href: '/privacy', icon: Shield },
    { name: 'Contact Us', href: '/contact', icon: Mail },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
          scrolled ? 'backdrop-blur-sm border-b border-white/10 py-3 shadow-xl' : 'py-5'
        }`}
        style={{
          background: scrolled
            ? `linear-gradient(135deg, ${theme.primary}dd, ${theme.secondary}dd)`
            : `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
        }}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group z-50">
              <div className="bg-white/20 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                <Zap size={20} className="text-white fill-white" />
              </div>
              <span className="text-2xl font-black italic tracking-tighter text-white uppercase">
                TEE<span style={{ color: theme.accent }}>HUB</span>
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              <Link href="/" className="px-4 py-2 text-sm font-bold text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition">Home</Link>
              {categories.map(cat => (
                <Link 
                  key={cat} 
                  href={`/?category=${cat}`} 
                  className="px-4 py-2 text-sm font-bold text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition"
                >
                  {cat}s
                </Link>
              ))}
            </div>
            
            {/* Right Side Icons */}
            <div className="flex items-center space-x-2 md:space-x-4 z-50">
              
              {/* Support Dropdown */}
              <div className="hidden md:block relative group">
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition">
                  Support
                  <ChevronDown size={16} className="transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div
                  className="absolute right-0 mt-2 w-56 backdrop-blur-md border border-white/15 rounded-2xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right group-hover:translate-y-0 translate-y-2 z-50"
                  style={{ background: `linear-gradient(to bottom, ${theme.primary}dd, ${theme.secondary}dd)` }}
                >
                  <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                    <p className="text-xs font-bold text-blue-200 uppercase tracking-wider">Need help?</p>
                    <p className="text-sm text-white font-medium mt-0.5">We're here for you</p>
                  </div>
                  <div className="py-2">
                    {supportLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/15 hover:text-white transition-colors"
                      >
                        <link.icon size={16} className="text-blue-300" /> {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cart */}
              <Link href="/cart" className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition">
                <ShoppingBag size={22} />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-black text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-blue-800"
                    style={{ backgroundColor: theme.accent }}
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-white/10 rounded-xl text-white transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Slide-out */}
        <div
          className={`md:hidden fixed inset-x-0 top-[68px] h-[calc(100vh-68px)] border-t border-white/15 transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}
          style={{ background: `linear-gradient(to bottom, ${theme.primary}, ${theme.secondary})` }}
        >
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <p className="text-xs font-bold tracking-widest text-blue-200 uppercase">Shop</p>
              <Link href="/" className="block text-xl font-bold text-white" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              {categories.map(cat => (
                <Link 
                  key={cat} 
                  href={`/?category=${cat}`} 
                  className="block text-xl font-bold text-white/70 hover:text-yellow-300 transition" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat}s
                </Link>
              ))}
            </div>
            
            <div className="pt-6 border-t border-white/15">
              <p className="text-xs font-bold tracking-widest text-blue-200 uppercase mb-4">Support</p>
              <div className="space-y-1">
                {supportLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 py-3 text-white/70 hover:text-yellow-300 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <link.icon size={18} className="text-blue-300" /> {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}