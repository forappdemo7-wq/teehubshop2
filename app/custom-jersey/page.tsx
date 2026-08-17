'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ShoppingBag, 
  Check, 
  RotateCw, 
  Shield, 
  Flame, 
  Star, 
  Crown,
  ChevronLeft,
  Palette,
  Layers,
  Type,
  Ruler
} from 'lucide-react';
import toast from 'react-hot-toast';

const COLOR_PALETTES = [
  { name: 'Royal Blue', hex: '#1d4ed8', textHex: '#ffffff' },
  { name: 'Pitch Black', hex: '#0f172a', textHex: '#ffffff' },
  { name: 'Crimson Red', hex: '#dc2626', textHex: '#ffffff' },
  { name: 'Emerald Green', hex: '#059669', textHex: '#ffffff' },
  { name: 'Golden Yellow', hex: '#eab308', textHex: '#000000' },
  { name: 'Pure White', hex: '#f8fafc', textHex: '#0f172a', border: true },
  { name: 'Electric Purple', hex: '#7c3aed', textHex: '#ffffff' },
  { name: 'Stealth Gray', hex: '#475569', textHex: '#ffffff' },
];

const ACCENT_COLORS = [
  { name: 'Golden Yellow', hex: '#f59e0b' },
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Pitch Black', hex: '#0f172a' },
  { name: 'Neon Cyan', hex: '#06b6d4' },
  { name: 'Crimson Red', hex: '#ef4444' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL'];

export default function CustomJerseyPage() {
  const { addItem } = useCart();
  const { theme } = useTheme();

  const [playerName, setPlayerName] = useState('CHAMPION');
  const [playerNumber, setPlayerNumber] = useState('10');
  const [teamName, setTeamName] = useState('TEEHUB FC');
  const [baseColor, setBaseColor] = useState(COLOR_PALETTES[0]);
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [viewAngle, setViewAngle] = useState<'back' | 'front'>('back');
  const [isAdded, setIsAdded] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);

  const price = 69.99;

  const handleAddToCart = () => {
    const customId = `custom-jersey-${Date.now()}`;
    const customTitle = `Custom ${baseColor.name} Jersey (#${playerNumber} ${playerName || 'ATHLETE'})`;

    addItem({
      id: customId,
      name: customTitle,
      price: price,
      imageUrl: '/logos/custom-jersey.svg',
      stock: 50,
      quantity: 1,
    });

    setIsAdded(true);
    toast.success(`Custom Jersey added to cart! (${selectedSize})`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleFlip = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setViewAngle(prev => prev === 'back' ? 'front' : 'back');
      setIsFlipping(false);
    }, 250);
  };

  return (
    <div className="min-h-screen py-8 md:py-12 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-[#0a0a0a] dark:via-[#0f0f0f] dark:to-[#1a1a1a] transition-colors duration-500 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold shadow-[0_0_30px_rgba(245,158,11,0.1)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pro Custom Studio</span>
          </motion.div>
        </div>

        {/* ─── Main Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ─── Preview ─── */}
          <div className="lg:col-span-7 flex flex-col items-center w-full">
            
            <div className="w-full relative aspect-square max-w-2xl rounded-[2rem] p-6 md:p-8 flex flex-col items-center justify-center bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-2xl overflow-hidden transition-all duration-500">
              
              {/* Dynamic Glow */}
              <div 
                className="absolute inset-0 opacity-25 pointer-events-none blur-[120px] transition-colors duration-700 ease-in-out"
                style={{ backgroundColor: baseColor.hex, transform: 'scale(1.5)' }}
              />

              {/* ─── View Controls ─── */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20 flex flex-col gap-2">
                <button
                  onClick={handleFlip}
                  disabled={isFlipping}
                  className="group flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold bg-white/90 dark:bg-black/60 backdrop-blur-md border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-black/80 text-slate-800 dark:text-white transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50"
                >
                  <RotateCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 dark:text-slate-400 transition-transform duration-500 ${isFlipping ? 'rotate-180' : ''}`} />
                  <span className="hidden sm:inline">{viewAngle.toUpperCase()}</span>
                  <span className="sm:hidden">{viewAngle === 'back' ? 'BACK' : 'FRONT'}</span>
                </button>
              </div>

              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-black/5 dark:bg-white/10 text-slate-500 dark:text-slate-300 border border-black/5 dark:border-white/5 backdrop-blur-sm">
                  {viewAngle === 'back' ? 'Matchday Rear' : 'Matchday Front'}
                </span>
              </div>

              {/* ─── 3D Jersey Preview ─── */}
              <div className="relative w-full max-w-[340px] sm:max-w-[420px] h-full flex items-center justify-center perspective-1000">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewAngle}
                    initial={{ rotateY: viewAngle === 'back' ? 180 : 0, opacity: 0.5 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    exit={{ rotateY: viewAngle === 'back' ? -180 : 0, opacity: 0.5 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full flex items-center justify-center"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <motion.svg 
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      viewBox="0 0 500 580" 
                      className="w-full h-auto drop-shadow-2xl"
                    >
                      <defs>
                        {/* ── Fabric Textures ── */}
                        <filter id="jerseyShadow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#000000" floodOpacity="0.35" />
                          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000000" floodOpacity="0.15" />
                        </filter>

                        {/* Fabric Mesh Pattern */}
                        <pattern id="meshTexture" patternUnits="userSpaceOnUse" width="3" height="3" patternTransform="rotate(45)">
                          <rect width="3" height="3" fill="transparent" />
                          <circle cx="1.5" cy="1.5" r="0.4" fill="#000000" opacity="0.06" />
                        </pattern>

                        {/* Lighting Gradients */}
                        <radialGradient id="chestHighlight" cx="35%" cy="25%" r="60%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.05" />
                          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
                        </radialGradient>

                        <linearGradient id="fabricSheen" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                          <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
                          <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
                        </linearGradient>

                        {/* ── Jersey Path ── */}
                        <path id="jerseyShape" d="M185 55 Q250 95 315 55 C355 65 415 100 455 130 C465 140 470 155 460 170 L405 230 C395 240 380 240 370 230 C370 230 370 240 365 460 C365 495 250 505 250 505 C250 505 135 495 135 460 C130 240 130 230 130 230 C120 240 105 240 95 230 L40 170 C30 155 35 140 45 130 C85 100 145 65 185 55 Z" />

                        <path id="nameArc" d="M 170 175 Q 250 150 330 175" fill="transparent" />
                      </defs>

                      {/* ─── Main Jersey ─── */}
                      <g filter="url(#jerseyShadow)">
                        {/* Base Color */}
                        <use href="#jerseyShape" fill={baseColor.hex} />
                        <use href="#jerseyShape" fill="url(#meshTexture)" />
                        <use href="#jerseyShape" fill="url(#chestHighlight)" />
                        <use href="#jerseyShape" fill="url(#fabricSheen)" />

                        {/* ─── Fabric Folds ─── */}
                        <path d="M 130 230 Q 160 320 150 470 Q 170 320 140 220 Z" fill="#000000" opacity="0.12" />
                        <path d="M 370 230 Q 340 320 350 470 Q 330 320 360 220 Z" fill="#000000" opacity="0.12" />
                        <path d="M 220 140 Q 250 260 245 420 Q 230 260 200 140 Z" fill="#ffffff" opacity="0.06" />

                        {/* Sleeve Cuffs */}
                        <path d="M 40 170 L 60 190 C 80 210 110 200 100 230 L 65 210 Z" fill={accentColor.hex} opacity="0.85" />
                        <path d="M 460 170 L 440 190 C 420 210 390 200 400 230 L 435 210 Z" fill={accentColor.hex} opacity="0.85" />

                        {/* Collar */}
                        <path d="M 185 55 Q 250 105 315 55 Q 250 80 185 55 Z" fill={accentColor.hex} />
                        <path d="M 185 55 Q 250 70 315 55 Q 250 95 185 55 Z" fill="#000000" opacity="0.15" />

                        {/* Side Mesh Panels */}
                        <path d="M 130 230 L 125 460 Q 140 465 145 460 L 145 230 Z" fill={accentColor.hex} opacity="0.15" />
                        <path d="M 370 230 L 375 460 Q 360 465 355 460 L 355 230 Z" fill={accentColor.hex} opacity="0.15" />

                        {/* ─── Stitching ─── */}
                        <path d="M 130 230 L 185 55" stroke="#000000" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.1" fill="none" />
                        <path d="M 370 230 L 315 55" stroke="#000000" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.1" fill="none" />
                        <path d="M 250 105 L 250 130" stroke="#000000" strokeWidth="1.5" strokeDasharray="3 4" opacity="0.08" fill="none" />
                      </g>

                      {/* ─── Graphics ─── */}
                      {viewAngle === 'back' ? (
                        <g>
                          <text fill={accentColor.hex} fontSize="34" fontWeight="900" fontFamily="'Impact', 'Arial Black', sans-serif" letterSpacing="4">
                            <textPath href="#nameArc" startOffset="50%" textAnchor="middle" style={{ filter: 'drop-shadow(0px 3px 6px rgba(0,0,0,0.3))' }}>
                              {(playerName || 'ATHLETE').toUpperCase()}
                            </textPath>
                          </text>

                          <text
                            x="250"
                            y="350"
                            textAnchor="middle"
                            fill={accentColor.hex}
                            fontSize="165"
                            fontWeight="900"
                            fontFamily="'Impact', 'Arial Black', sans-serif"
                            stroke="#000000"
                            strokeWidth="3"
                            style={{ filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.3))' }}
                          >
                            {playerNumber || '00'}
                          </text>

                          <text
                            x="250"
                            y="465"
                            textAnchor="middle"
                            fill={accentColor.hex}
                            fontSize="13"
                            fontWeight="800"
                            letterSpacing="5"
                            opacity="0.7"
                          >
                            {teamName.toUpperCase()}
                          </text>
                        </g>
                      ) : (
                        <g>
                          <rect x="175" y="225" width="150" height="45" rx="8" fill="#000000" opacity="0.12" />
                          <text
                            x="250"
                            y="258"
                            textAnchor="middle"
                            fill={accentColor.hex}
                            fontSize="22"
                            fontWeight="900"
                            fontFamily="'Impact', 'Arial Black', sans-serif"
                            letterSpacing="2"
                            style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }}
                          >
                            {(teamName || 'TEEHUB').toUpperCase()}
                          </text>

                          <text x="310" y="170" textAnchor="middle" fill={accentColor.hex} fontSize="30" fontWeight="900" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))' }}>
                            {playerNumber || '10'}
                          </text>

                          <circle cx="190" cy="160" r="22" fill={accentColor.hex} style={{ filter: 'drop-shadow(0px 3px 8px rgba(0,0,0,0.3))' }} />
                          <text x="190" y="168" textAnchor="middle" fill={baseColor.hex} fontSize="18" fontWeight="900">
                            ★
                          </text>
                        </g>
                      )}
                    </motion.svg>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Hint */}
              <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 mt-4 flex items-center gap-1.5 font-medium">
                <RotateCw className="w-3 h-3" />
                <span>Tap the flip button to see both sides</span>
              </p>
            </div>
          </div>

          {/* ─── Controls ─── */}
          <div className="lg:col-span-5 rounded-[2rem] p-6 sm:p-8 bg-white/70 dark:bg-[#151515]/90 backdrop-blur-3xl shadow-2xl border border-slate-200/50 dark:border-white/5 space-y-6">
            
            {/* Header */}
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
                  Custom Studio
                </h1>
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  ${price.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium leading-relaxed">
                Premium AeroDry™ fabric • Heat-pressed graphics • Made to order
              </p>
            </div>

            {/* ─── Controls Grid ─── */}
            <div className="space-y-5 pt-4 border-t border-slate-200 dark:border-white/10">
              
              {/* Name & Number */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5" /> Typography
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <input
                      type="text"
                      maxLength={12}
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
                      placeholder="Name"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/50 text-slate-900 dark:text-white text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      maxLength={2}
                      value={playerNumber}
                      onChange={(e) => setPlayerNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="#"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/50 text-slate-900 dark:text-white text-xs font-bold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Team Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1.5">
                  Team / Sponsor
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value.toUpperCase())}
                  placeholder="TEEHUB FC"
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/50 text-slate-900 dark:text-white text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* ─── Colors ─── */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/10">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" /> Base Color
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {COLOR_PALETTES.map((col) => {
                    const isSelected = baseColor.name === col.name;
                    return (
                      <button
                        key={col.name}
                        onClick={() => setBaseColor(col)}
                        className={`h-10 rounded-xl flex items-center justify-center transition-all duration-300 relative ${
                          isSelected ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-105 shadow-lg' : 'hover:scale-105 opacity-70 hover:opacity-100'
                        }`}
                        style={{ 
                          backgroundColor: col.hex,
                          border: col.border ? '1px solid #e2e8f0' : '1px solid transparent'
                        }}
                        title={col.name}
                      >
                        {isSelected && <Check className="w-4 h-4 drop-shadow" style={{ color: col.textHex }} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
                  Accent & Graphics
                </label>
                <div className="flex gap-3">
                  {ACCENT_COLORS.map((col) => {
                    const isSelected = accentColor.name === col.name;
                    return (
                      <button
                        key={col.name}
                        onClick={() => setAccentColor(col)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isSelected ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110 shadow-lg' : 'hover:scale-110 opacity-70 hover:opacity-100'
                        }`}
                        style={{ 
                          backgroundColor: col.hex,
                          border: col.hex === '#ffffff' ? '1px solid #e2e8f0' : '1px solid transparent'
                        }}
                        title={col.name}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 drop-shadow" style={{ color: col.hex === '#ffffff' || col.hex === '#f59e0b' ? '#000000' : '#ffffff' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ─── Size ─── */}
            <div className="pt-4 border-t border-slate-200 dark:border-white/10">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5" /> Size
                </label>
                <span className="text-[9px] text-slate-400 font-medium">Athletic fit</span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {SIZES.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 rounded-xl text-xs font-black transition-all duration-200 ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-lg scale-105'
                          : 'bg-white dark:bg-black/40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-slate-400'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─── CTA ─── */}
            <div className="pt-6 border-t border-slate-200 dark:border-white/10">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-white shadow-xl flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                style={{
                  backgroundColor: isAdded ? '#10b981' : baseColor.hex,
                }}
              >
                {isAdded ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>Added to Bag!</span>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart – ${price.toFixed(2)}</span>
                  </motion.div>
                )}
              </button>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-indigo-500" />
                  Premium Quality
                </span>
                <span>•</span>
                <span>Heat-Pressed</span>
                <span>•</span>
                <span>Express Shipping</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}