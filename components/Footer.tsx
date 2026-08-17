'use client';

import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Mail, 
  Phone, 
  MapPin,
  Flame,
  CreditCard,
  ShieldCheck,
  Truck,
  RefreshCw,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  const quickLinks = [
    { name: 'All Gear', href: '/' },
    { name: 'Jerseys', href: '/?category=Jersey' },
    { name: 'Pants', href: '/?category=Pants' },
    { name: 'Shorts', href: '/?category=Shorts' },
    { name: 'Sets', href: '/?category=Set' },
    { name: 'Custom Studio', href: '/custom-jersey' },
  ];

  const supportLinks = [
    { name: 'Track Order', href: '/track-order' },
    { name: 'Return & Refund', href: '/returns' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const features = [
    { icon: Truck, title: 'Express Worldwide Shipping', desc: 'Free on all orders over $50' },
    { icon: RefreshCw, title: '30-Day Easy Returns', desc: 'Hassle-free exchanges & refunds' },
    { icon: ShieldCheck, title: 'Secure Encrypted Checkout', desc: 'Protected by 256-bit SSL' },
    { icon: CreditCard, title: '100% Pro Authenticity', desc: 'Engineered for top performance' },
  ];

  return (
    <footer
      className="text-white mt-auto border-t border-white/10 relative overflow-hidden"
      style={{ backgroundColor: theme.secondary }}
    >
      {/* Top Features Ribbon */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, idx) => (
              <div key={idx} className="flex items-center gap-3.5">
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner"
                  style={{ backgroundColor: `${theme.primary}50` }}
                >
                  <feat.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">{feat.title}</h4>
                  <p className="text-[11px] text-white/70 mt-0.5">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Brand Column (2 cols wide on LG) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md transition-transform group-hover:scale-105"
                style={{ backgroundColor: theme.primary }}
              >
                <Flame className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-2xl font-black italic tracking-tighter text-white uppercase">
                TEE<span style={{ color: theme.accent }}>HUB</span>
              </span>
            </Link>
            
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              Engineered sportswear crafted for champions. Premium matchday jerseys, training pants, performance shorts, and tailored sets designed to elevate your athletic legacy.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-white/90 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                <span>Join the Athletes Club</span>
              </p>
              {subscribed ? (
                <div className="bg-white/10 border border-white/20 p-3 rounded-xl text-xs text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" style={{ color: theme.accent }} />
                  <span>You're in! Watch your inbox for VIP drops.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-white/10 border border-white/20 px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-white/50 focus:outline-none focus:border-white transition"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-black flex items-center gap-1 hover:opacity-90 transition active:scale-95 shadow-md"
                    style={{ backgroundColor: theme.accent }}
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/90 mb-4">Collection</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-xs sm:text-sm text-white/70 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span className="text-white/30 group-hover:text-white transition-colors">›</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/90 mb-4">Assistance</h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="text-xs sm:text-sm text-white/70 hover:text-white transition flex items-center gap-1.5 group"
                  >
                    <span className="text-white/30 group-hover:text-white transition-colors">›</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/90 mb-4">Headquarters</h3>
            <ul className="space-y-3 text-xs sm:text-sm text-white/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-white/50 flex-shrink-0 mt-0.5" />
                <span>123 Athletic Boulevard, Suite 500<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-white/50 flex-shrink-0" />
                <a href="tel:+18001234567" className="hover:text-white transition">+1 (800) 123-4567</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-white/50 flex-shrink-0" />
                <a href="mailto:support@teehubshop.com" className="hover:text-white transition">support@teehubshop.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom copyright */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <p>&copy; {currentYear} TeeHub Performance Gear. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-white transition">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
