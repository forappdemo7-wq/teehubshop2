'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  Sparkles,
  ChevronDown,
  Package,
  RefreshCw,
  FileText,
  ShieldCheck,
  Mail,
  Palette,
  Sliders,
  Flame
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { totalItems } = useCart();
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('All');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Update current category from URL when on homepage
    if (pathname === '/' && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setCurrentCategory(params.get('category') || 'All');
    } else {
      setCurrentCategory('All');
    }
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'All Gear', href: '/', category: 'All' },
    { name: 'Jerseys', href: '/?category=Jersey', category: 'Jersey' },
    { name: 'Pants', href: '/?category=Pants', category: 'Pants' },
    { name: 'Shorts', href: '/?category=Shorts', category: 'Shorts' },
    { name: 'Sets', href: '/?category=Set', category: 'Set' },
  ];

  const supportLinks = [
    { name: 'Track Order', href: '/track-order', icon: Package },
    { name: 'Return & Refund', href: '/returns', icon: RefreshCw },
    { name: 'Terms of Service', href: '/terms', icon: FileText },
    { name: 'Privacy Policy', href: '/privacy', icon: ShieldCheck },
    { name: 'Contact Us', href: '/contact', icon: Mail },
  ];

  // ─── Handle category click ──────────────────────────────────────────
  const handleCategoryClick = (category: string, e: React.MouseEvent) => {
    if (pathname === '/') {
      e.preventDefault();
      
      // Update URL
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (category === 'All') {
          url.searchParams.delete('category');
        } else {
          url.searchParams.set('category', category);
        }
        window.history.pushState({}, '', url.toString());
      }
      
      // Update state
      setCurrentCategory(category);
      
      // Dispatch event for ProductCatalog
      window.dispatchEvent(new CustomEvent('teehub:setCategory', { detail: category }));
      
      // Scroll to collection
      setTimeout(() => {
        const el = document.getElementById('collection');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // ─── Check if link is active ──────────────────────────────────────
  const isActiveLink = (link: typeof navLinks[0]) => {
    if (pathname === '/') {
      // On homepage: check category param
      return link.category === currentCategory;
    }
    // On other pages: check pathname
    return pathname === link.href || (link.href === '/' && pathname === '/');
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${
          scrolled 
            ? 'backdrop-blur-xl bg-opacity-90 shadow-lg shadow-black/10 py-3 border-b border-white/10' 
            : 'py-4 md:py-5'
        }`}
        style={{
          backgroundColor: scrolled ? `${theme.secondary}fa` : theme.secondary,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105 group-hover:rotate-6"
                style={{ backgroundColor: theme.primary }}
              >
                <Flame className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black italic tracking-tighter text-white uppercase flex items-center leading-none">
                  TEE<span style={{ color: theme.accent }}>HUB</span>
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-widest text-white/60">
                  Performance Apparel
                </span>
              </div>
            </Link>
            
            {/* Desktop Center Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/15 shadow-inner">
              {navLinks.map((link) => {
                const active = isActiveLink(link);
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    scroll={false}
                    onClick={(e) => handleCategoryClick(link.category, e)}
                    className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 ${
                      active 
                        ? 'text-white bg-white/20' 
                        : 'text-white/90 hover:text-white hover:bg-white/15'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}

              <div className="w-px h-4 bg-white/20 mx-1" />

              <Link
                href="/custom-jersey"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-full transition-all duration-300 text-black shadow-md hover:scale-105"
                style={{ backgroundColor: theme.accent }}
              >
                <Sparkles className="w-3.5 h-3.5 text-black" />
                Custom Studio
              </Link>
            </nav>
            
            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Support Dropdown */}
              <div className="hidden md:block relative group">
                <button className="flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 rounded-xl transition">
                  <span>Support</span>
                  <ChevronDown size={14} className="transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <div
                  className="absolute right-0 mt-2 w-56 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right group-hover:translate-y-0 translate-y-2 z-50"
                  style={{ backgroundColor: `${theme.secondary}fa` }}
                >
                  <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Help & Resources</p>
                    <p className="text-xs text-white font-medium mt-0.5">24/7 Athlete Support</p>
                  </div>
                  <div className="p-1.5 space-y-0.5">
                    {supportLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-white/80 hover:text-white hover:bg-white/15 rounded-lg transition-colors"
                      >
                        <link.icon size={15} style={{ color: theme.accent }} /> 
                        <span>{link.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Shopping Bag Button */}
              <Link 
                href="/cart" 
                className="relative p-2.5 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 active:scale-95 border border-white/10"
                aria-label="View shopping cart"
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 text-black text-[10px] font-black rounded-full h-5 min-w-5 px-1 flex items-center justify-center shadow-lg transform transition-transform animate-bounce"
                    style={{ backgroundColor: theme.accent }}
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/10"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <div
          className={`lg:hidden fixed inset-x-0 top-[65px] h-[calc(100vh-65px)] border-t border-white/15 transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
          } overflow-y-auto backdrop-blur-2xl`}
          style={{ backgroundColor: `${theme.secondary}fc` }}
        >
          <div className="p-6 space-y-6 max-w-lg mx-auto">
            
            {/* Custom Studio CTA for Mobile */}
            <Link
              href="/custom-jersey"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-4 rounded-2xl shadow-lg transition-transform active:scale-98"
              style={{ backgroundColor: theme.accent, color: '#000' }}
            >
              <div className="flex items-center gap-3 font-bold text-base">
                <Sparkles className="w-5 h-5 text-black" />
                <span>Custom Jersey Studio</span>
              </div>
              <span className="text-xs font-black uppercase tracking-wider bg-black/10 px-2 py-1 rounded-md">
                Try Now →
              </span>
            </Link>

            {/* Navigation links */}
            <div className="space-y-1">
              <p className="text-[11px] font-bold tracking-widest text-white/50 uppercase px-3 mb-2">Shop Categories</p>
              {navLinks.map((link) => {
                const active = isActiveLink(link);
                return (
                  <Link 
                    key={link.name} 
                    href={link.href}
                    scroll={false}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold transition ${
                      active 
                        ? 'bg-white/20 text-white' 
                        : 'text-white hover:bg-white/15'
                    }`}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      handleCategoryClick(link.category, e);
                    }}
                  >
                    <span>{link.name}</span>
                    <span className="text-xs text-white/40">→</span>
                  </Link>
                );
              })}
            </div>

            {/* Quick Admin Tools */}
            <div className="pt-4 border-t border-white/15">
              <p className="text-[11px] font-bold tracking-widest text-white/50 uppercase px-3 mb-2">Admin & Customizer</p>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/admin/theme"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  <Palette className="w-4 h-4" style={{ color: theme.accent }} />
                  <span>Theme Studio</span>
                </Link>
                <Link
                  href="/admin/logos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                >
                  <Sliders className="w-4 h-4" style={{ color: theme.accent }} />
                  <span>Logos & Partners</span>
                </Link>
              </div>
            </div>
            
            {/* Support section */}
            <div className="pt-4 border-t border-white/15">
              <p className="text-[11px] font-bold tracking-widest text-white/50 uppercase px-3 mb-2">Support & Assistance</p>
              <div className="space-y-1">
                {supportLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <link.icon size={16} style={{ color: theme.accent }} /> 
                    <span>{link.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}