'use client';

import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  BoltIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function Footer() {
  const { theme } = useTheme();          // ← get current theme colours
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Jerseys', href: '/?category=Jersey' },
    { name: 'Pants', href: '/?category=Pants' },
    { name: 'Shorts', href: '/?category=Shorts' },
    { name: 'Sets', href: '/?category=Set' },
  ];

  const supportLinks = [
    { name: 'Track Order', href: '/track-order' },
    { name: 'Return & Refund', href: '/returns' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Contact Us', href: '/contact' },
  ];

  const features = [
    { icon: TruckIcon, text: 'Free Shipping on orders over $50' },
    { icon: ArrowPathIcon, text: '30-Day Easy Returns' },
    { icon: ShieldCheckIcon, text: 'Secure Payment' },
    { icon: CreditCardIcon, text: '100% Authentic Products' },
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: 'https://img.icons8.com/ios-filled/50/ffffff/facebook-new.png' },
    { name: 'Twitter', href: '#', icon: 'https://img.icons8.com/ios-filled/50/ffffff/twitter.png' },
    { name: 'Instagram', href: '#', icon: 'https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png' },
    { name: 'YouTube', href: '#', icon: 'https://img.icons8.com/ios-filled/50/ffffff/youtube-play.png' },
  ];

  return (
    <footer
      className="text-white py-12 mt-auto border-t border-white/10"
      style={{ backgroundColor: theme.secondary }}   // ← uses secondary colour from theme
    >
      <div className="container mx-auto px-6">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <BoltIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black italic tracking-tighter text-white uppercase">
                TEE<span style={{ color: theme.accent }}>HUB</span>
              </span>
            </div>
            <p className="text-gray-200 text-sm mb-4">
              Premium sports apparel for champions. Quality jerseys, pants, shorts, and sets for athletes who dare to win.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={social.icon} alt={social.name} className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Shop</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-200 hover:text-white transition text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-200 hover:text-white transition text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-gray-300 mt-0.5" />
                <span className="text-gray-200 text-sm">123 Fashion Avenue, Suite 400<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="h-5 w-5 text-gray-300" />
                <a href="tel:+18001234567" className="text-gray-200 hover:text-white text-sm">+1 (800) 123-4567</a>
              </li>
              <li className="flex items-center gap-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-300" />
                <a href="mailto:support@teehubshop.com" className="text-gray-200 hover:text-white text-sm">support@teehubshop.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Bar */}
        <div className="border-t border-white/15 pt-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="flex items-center justify-center gap-2 text-gray-200 text-xs md:text-sm">
                  <Icon className="h-4 w-4 text-gray-300" />
                  <span>{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-white/15 pt-6 text-center">
          <p className="text-gray-300 text-xs">
            &copy; {currentYear} TeeHubShop. All rights reserved. | Designed for athletes worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}