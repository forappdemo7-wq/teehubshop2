'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface FeaturedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: { name: string } | null;
}

interface FeaturedCarouselProps {
  products: FeaturedProduct[];
}

export default function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || products.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, products.length]);

  // Pause on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  if (products.length === 0) {
    return (
      <div 
        className="w-full max-w-md lg:max-w-lg rounded-3xl border flex items-center justify-center p-12 text-center backdrop-blur-sm"
        style={{
          backgroundColor: `${theme.cardBg}cc`,
          borderColor: `${theme.primary}30`,
          color: theme.text,
        }}
      >
        <div>
          <span className="text-5xl block mb-4" style={{ color: theme.accent }}>🔥</span>
          <p className="text-sm font-medium">No featured products yet</p>
          <p className="text-xs mt-1 opacity-70">Mark products in the admin panel</p>
        </div>
      </div>
    );
  }

  const currentProduct = products[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  return (
    <div 
      className="w-full max-w-md lg:max-w-lg relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="rounded-3xl overflow-hidden shadow-2xl border p-6 backdrop-blur-sm transition-colors duration-300"
        style={{
          backgroundColor: `${theme.cardBg}dd`,
          borderColor: `${theme.primary}30`,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentProduct.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-56 w-full rounded-2xl overflow-hidden">
              <Image
                src={currentProduct.imageUrl}
                alt={currentProduct.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-5 space-y-3">
              <span 
                className="inline-block text-xs font-black uppercase tracking-widest"
                style={{ color: theme.accent }}
              >
                PRO PERFORMANCE
              </span>
              <h2 
                className="text-xl sm:text-2xl font-black leading-tight"
                style={{ color: theme.text }}
              >
                {currentProduct.name}
              </h2>
              <p 
                className="text-sm line-clamp-2"
                style={{ color: `${theme.text}cc` }}
              >
                {currentProduct.description}
              </p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: `${theme.text}20` }}>
                <span 
                  className="text-2xl font-black"
                  style={{ color: theme.text }}
                >
                  ${currentProduct.price.toFixed(2)}
                </span>
                <Link
                  href={`/products/${currentProduct.id}`}
                  className="px-5 py-2.5 rounded-xl font-bold text-sm transition hover:scale-105 active:scale-95 shadow-lg"
                  style={{ 
                    backgroundColor: theme.accent,
                    color: '#000000'
                  }}
                >
                  Shop Now →
                </Link>
              </div>
              {currentProduct.category && (
                <p className="text-xs" style={{ color: `${theme.text}80` }}>
                  Category: {currentProduct.category.name}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-5">
          {products.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentIndex ? 'w-8' : 'w-2.5'
              }`}
              style={{
                backgroundColor: idx === currentIndex ? theme.accent : `${theme.text}40`,
              }}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Prev/Next Buttons */}
      {products.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-4 p-2 rounded-full backdrop-blur-md transition z-10"
            style={{
              backgroundColor: `${theme.cardBg}cc`,
              color: theme.text,
              border: `1px solid ${theme.primary}30`,
            }}
            aria-label="Previous product"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-4 p-2 rounded-full backdrop-blur-md transition z-10"
            style={{
              backgroundColor: `${theme.cardBg}cc`,
              color: theme.text,
              border: `1px solid ${theme.primary}30`,
            }}
            aria-label="Next product"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}