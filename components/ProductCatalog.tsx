'use client';

import { useState, useMemo, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';
import { Search, X, ArrowUpDown, Sparkles, Grid3x3 } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  initialCategory?: string;
  initialSearch?: string;
}

const normalizeCategory = (cat?: string | null): string => {
  if (!cat) return '';
  const c = cat.trim().toLowerCase();
  if (c.startsWith('jerse')) return 'jersey';
  if (c.startsWith('pant')) return 'pants';
  if (c.startsWith('short')) return 'shorts';
  if (c.startsWith('set')) return 'set';
  return c;
};

// ─── Category color map ──────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, { bg: string; activeBg: string; text: string; border: string }> = {
  'All': { bg: 'bg-slate-100', activeBg: 'bg-slate-900', text: 'text-slate-700', border: 'border-slate-200' },
  'Jersey': { bg: 'bg-blue-50', activeBg: 'bg-blue-600', text: 'text-blue-700', border: 'border-blue-200' },
  'Pants': { bg: 'bg-emerald-50', activeBg: 'bg-emerald-600', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Shorts': { bg: 'bg-amber-50', activeBg: 'bg-amber-600', text: 'text-amber-700', border: 'border-amber-200' },
  'Set': { bg: 'bg-purple-50', activeBg: 'bg-purple-600', text: 'text-purple-700', border: 'border-purple-200' },
};

export default function ProductCatalog({
  products = [],
  initialCategory = 'All',
  initialSearch = '',
}: ProductCatalogProps) {
  const { theme } = useTheme();

  const [items, setItems] = useState<Product[]>(products);
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory || 'All');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || '');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  // ─── Load products from API if empty ──────────────────────────────
  useEffect(() => {
    if (products && products.length > 0) {
      setItems(products);
    } else {
      fetch('/api/products')
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setItems(data);
          }
        })
        .catch(() => {});
    }
  }, [products]);

  // ─── Sync with URL params ──────────────────────────────────────────
  useEffect(() => {
    if (initialCategory) setActiveCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    const handleCategoryEvent = (e: CustomEvent<string>) => {
      if (e.detail) setActiveCategory(e.detail);
    };
    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        setActiveCategory(params.get('category') || 'All');
        setSearchQuery(params.get('q') || '');
      } catch {}
    };
    window.addEventListener('teehub:setCategory' as any, handleCategoryEvent as any);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('teehub:setCategory' as any, handleCategoryEvent as any);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // ─── Compute category counts ──────────────────────────────────────
  const categories = useMemo(() => {
    const safeProducts = Array.isArray(items) ? items : [];
    const counts: Record<string, number> = {
      All: safeProducts.length,
      Jersey: 0,
      Pants: 0,
      Shorts: 0,
      Set: 0,
    };
    safeProducts.forEach((p) => {
      const normalized = normalizeCategory(p.category);
      if (normalized === 'jersey') counts['Jersey'] = (counts['Jersey'] || 0) + 1;
      else if (normalized === 'pants') counts['Pants'] = (counts['Pants'] || 0) + 1;
      else if (normalized === 'shorts') counts['Shorts'] = (counts['Shorts'] || 0) + 1;
      else if (normalized === 'set') counts['Set'] = (counts['Set'] || 0) + 1;
    });
    return [
      { name: 'All Gear', value: 'All', count: counts['All'] || 0 },
      { name: 'Jerseys', value: 'Jersey', count: counts['Jersey'] || 0 },
      { name: 'Pants', value: 'Pants', count: counts['Pants'] || 0 },
      { name: 'Shorts', value: 'Shorts', count: counts['Shorts'] || 0 },
      { name: 'Sets', value: 'Set', count: counts['Set'] || 0 },
    ];
  }, [items]);

  // ─── Filter and sort products ─────────────────────────────────────
  const filteredProducts = useMemo(() => {
    const safeProducts = Array.isArray(items) ? [...items] : [];
    let list = safeProducts;
    const normActive = normalizeCategory(activeCategory);
    if (normActive && normActive !== 'all') {
      list = list.filter((p) => normalizeCategory(p.category) === normActive);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          (p.name || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.category || '').toLowerCase().includes(q)
      );
    }
    if (sortBy === 'price-asc') list.sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortBy === 'price-desc') list.sort((a, b) => (b.price || 0) - (a.price || 0));
    else if (sortBy === 'name') list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    else list.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
    return list;
  }, [items, activeCategory, searchQuery, sortBy]);

  // ─── Handlers ──────────────────────────────────────────────────────
  const handleCategorySelect = (categoryValue: string) => {
    setActiveCategory(categoryValue);
    try {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (categoryValue.toLowerCase() === 'all') url.searchParams.delete('category');
        else url.searchParams.set('category', categoryValue);
        window.history.replaceState({}, '', url.toString());
      }
    } catch {}
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    try {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        if (val.trim()) url.searchParams.set('q', val.trim());
        else url.searchParams.delete('q');
        window.history.replaceState({}, '', url.toString());
      }
    } catch {}
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    try {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('q');
        window.history.replaceState({}, '', url.toString());
      }
    } catch {}
  };

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSearchQuery('');
    try {
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('category');
        url.searchParams.delete('q');
        window.history.replaceState({}, '', url.toString());
      }
    } catch {}
  };

  const normActive = normalizeCategory(activeCategory);
  const primaryColor = theme?.primary || '#2563eb';

  return (
    <section id="collection" className="scroll-mt-20">
      
      {/* ─── ✨ UPGRADED STICKY FILTER BAR ─── */}
      <div 
        className="sticky top-[64px] z-30 py-4 border-b border-white/10 shadow-lg backdrop-blur-2xl bg-opacity-85 transition-all"
        style={{ 
          backgroundColor: `${theme?.cardBg || '#ffffff'}dd`,
          borderColor: 'rgba(0,0,0,0.06)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            
            {/* ── Category Pills ── */}
            <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
              {categories.map((cat) => {
                const isSelected = 
                  (cat.value === 'All' && (!normActive || normActive === 'all')) ||
                  normalizeCategory(cat.value) === normActive;
                
                const colors = CATEGORY_COLORS[cat.value] || CATEGORY_COLORS['All'];
                const hasItems = cat.count > 0;

                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleCategorySelect(cat.value)}
                    disabled={!hasItems}
                    className={`
                      relative group flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold 
                      transition-all duration-300 ease-out cursor-pointer select-none
                      ${!hasItems ? 'opacity-40 cursor-not-allowed' : ''}
                      ${isSelected 
                        ? 'text-white shadow-lg scale-105 active:scale-95' 
                        : 'text-slate-700 hover:text-slate-900 hover:scale-102'
                      }
                    `}
                    style={{
                      backgroundColor: isSelected 
                        ? primaryColor 
                        : `${theme?.background || '#f1f5f9'}80`,
                      boxShadow: isSelected 
                        ? `0 4px 20px ${primaryColor}40` 
                        : 'none',
                    }}
                  >
                    {/* Hover ring effect */}
                    {!isSelected && hasItems && (
                      <span className="absolute inset-0 rounded-full ring-1 ring-black/5 group-hover:ring-black/20 transition-all" />
                    )}

                    <span className="relative z-10">{cat.name}</span>

                    {/* Count badge */}
                    <span 
                      className={`
                        relative z-10 text-[10px] font-black px-2 py-0.5 rounded-full transition-all
                        ${isSelected 
                          ? 'bg-white/25 text-white' 
                          : 'bg-black/8 text-slate-500 group-hover:bg-black/15'
                        }
                      `}
                    >
                      {cat.count}
                    </span>

                    {/* Active indicator dot */}
                    {isSelected && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-white/60" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Search & Sort ── */}
            {/* ── Search & Sort ── */}
<div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              
              {/* Premium Search Input */}
              <div className="relative flex-1 lg:w-72">
                <div className={`
                  absolute inset-0 rounded-xl transition-all duration-300
                  ${searchQuery ? 'ring-2 ring-blue-500/30' : 'ring-1 ring-black/5'}
                `} />
                
                <input
                  id="catalog-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search gear..."
                  className={`
                    w-full pl-10 pr-10 py-2.5 text-sm rounded-xl 
                    bg-white/80 backdrop-blur-sm
                    text-slate-800 placeholder:text-slate-400
                    focus:outline-none focus:bg-white
                    transition-all duration-300
                    border-0
                  `}
                  style={{
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                />
                
                {/* Search Icon */}
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

                {/* Clear button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="relative flex-shrink-0">
                <select
                  id="catalog-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none pl-3.5 pr-8 py-2.5 text-xs font-semibold rounded-xl bg-white/80 backdrop-blur-sm border-0 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 cursor-pointer transition-all"
                  style={{
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <option value="featured">✨ Featured</option>
                  <option value="price-asc">↑ Price: Low</option>
                  <option value="price-desc">↓ Price: High</option>
                  <option value="name">A–Z Name</option>
                </select>
                <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─── Main Products Grid ────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 min-h-[450px]">
        
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-slate-900">
              {!normActive || normActive === 'all'
                ? '🏆 All Collection'
                : normActive === 'jersey'
                ? '👕 Pro Match Jerseys'
                : normActive === 'pants'
                ? '👖 Training Pants'
                : normActive === 'shorts'
                ? '🩳 Performance Shorts'
                : normActive === 'set'
                ? '📦 Complete Kit Sets'
                : `${activeCategory} Collection`}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <span className="font-bold text-slate-700">{filteredProducts.length}</span>
              {filteredProducts.length === 1 ? 'item' : 'items'} ready
              {searchQuery && (
                <span className="text-slate-400">· matching &ldquo;{searchQuery}&rdquo;</span>
              )}
            </p>
          </div>

          {((normActive && normActive !== 'all') || searchQuery) && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 hover:underline transition-all flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        {/* ─── Product Grid ── */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 p-8">
            <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No matching gear found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any products matching {activeCategory !== 'All' ? `"${activeCategory}"` : 'your search'} {searchQuery ? `or "${searchQuery}"` : ''}.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              View Full Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}