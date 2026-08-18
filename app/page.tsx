import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import { Metadata } from 'next';
import ProductCatalog from '@/components/ProductCatalog';
import FeaturedCarousel from '@/components/FeaturedCarousel';

// ─── Metadata for SEO ──────────────────────────────────────────────
export const metadata: Metadata = {
  title: 'TeeHub Shop – Premium Sportswear & Custom Jerseys',
  description: 'Engineered sportswear, pro match jerseys, training gear, and custom jersey design studio.',
  openGraph: {
    title: 'TeeHub Shop – Premium Sportswear & Custom Jerseys',
    description: 'Engineered sportswear, pro match jerseys, training gear, and custom jersey design studio.',
    images: ['/og-image.png'],
  },
};

// ─── Revalidate every 60 seconds ──────────────────────────────────
export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

// ─── Fallback UI for errors ──────────────────────────────────────
function ErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Oops! Something went wrong</h2>
        <p className="text-sm mt-2" style={{ color: 'var(--color-text)', opacity: 0.7 }}>We couldn't load the page. Please try again later.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 rounded-xl font-bold text-sm transition hover:scale-105 active:scale-95"
          style={{ backgroundColor: 'var(--color-accent)', color: '#000' }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

export default async function Home({ searchParams }: PageProps) {
  try {
    const params = await searchParams;
    const categoryParam = params.category;
    const searchQuery = params.q?.toLowerCase() || '';

    // ─── Optimised product query ──────────────────────────────────
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        price: true,
        imageUrl: true,
        stock: true,
        createdAt: true,
        category: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // ─── Featured products ──────────────────────────────────────
    const featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        category: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // ─── Active team logos ──────────────────────────────────────
    const teamLogos = await prisma.logo.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        showName: true,
      },
    });

    // ─── Map products to a plain `category` string ──────────────
    const productsWithCategory = products.map(product => ({
      ...product,
      category: product.category?.name || 'Uncategorized',
    }));

    const scrollingLogos = teamLogos.length > 0 ? [...teamLogos, ...teamLogos, ...teamLogos] : [];

    return (
      <div className="min-h-screen transition-colors duration-500" style={{ backgroundColor: 'var(--color-background)' }}>
        
        {/* ─── HERO SECTION ────────────────────────────────────── */}
        <section 
          className="relative overflow-hidden min-h-[85vh] flex items-center transition-colors duration-500"
          style={{ backgroundColor: 'var(--color-background)' }}
        >
          {/* Background Gradients & Grid */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 transition-colors duration-500"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
            <div 
              className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-20 transition-colors duration-500"
              style={{ backgroundColor: 'var(--color-accent)' }}
            />
            <div 
              className="absolute inset-0 opacity-[0.05] transition-colors duration-500" 
              style={{ 
                backgroundImage: `radial-gradient(var(--color-text) 1px, transparent 1px)`, 
                backgroundSize: '32px 32px' 
              }} 
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* ─── LEFT: Content ─── */}
              <div className="space-y-6">
                
                {/* Badge */}
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm backdrop-blur-md text-xs font-semibold transition-colors duration-500"
                  style={{ 
                    backgroundColor: 'var(--color-card-bg)',
                    borderColor: 'var(--color-primary)',
                    color: 'var(--color-text)'
                  }}
                >
                  <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: 'var(--color-accent)' }} />
                  <span className="uppercase tracking-[0.15em] text-[10px] font-bold opacity-90">
                    2026 Pro Athletic Collection
                  </span>
                </div>

                {/* Headline */}
                <h1 
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic tracking-tight uppercase leading-[1.08] transition-colors duration-500"
                  style={{ color: 'var(--color-text)' }}
                >
                  ENGINEERED <br />
                  FOR <br />
                  <span 
                    className="inline-block pr-4 pb-1 bg-clip-text text-transparent transition-all duration-500"
                    style={{
                      backgroundImage: `linear-gradient(to right, var(--color-text), var(--color-accent), var(--color-text))`,
                    }}
                  >
                    CHAMPIONS
                  </span>
                </h1>

                {/* Description */}
                <p 
                  className="text-base sm:text-lg max-w-lg leading-relaxed transition-colors duration-500"
                  style={{ color: 'var(--color-text)', opacity: 0.8 }}
                >
                  Official league jerseys, high-mobility pants, lightweight shorts, and matching training sets. Custom-tailored with your name and number.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                  <Link
                    href="/custom-jersey"
                    prefetch
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
                    style={{ 
                      backgroundColor: 'var(--color-accent)',
                      color: 'var(--color-background)' 
                    }}
                  >
                    <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span>Design Custom Jersey</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="#collection"
                    prefetch
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm border backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-70"
                    style={{ 
                      backgroundColor: 'transparent',
                      borderColor: 'var(--color-text)',
                      color: 'var(--color-text)'
                    }}
                  >
                    <span>Explore Catalog</span>
                  </Link>
                </div>

                {/* Features */}
                <div 
                  className="grid grid-cols-3 gap-4 pt-4 border-t max-w-lg transition-colors duration-500"
                  style={{ borderColor: 'var(--color-primary)' }}
                >
                  <div>
                    <p className="text-sm font-black" style={{ color: 'var(--color-text)' }}>100% Breathable</p>
                    <p className="text-[10px] font-medium" style={{ color: 'var(--color-text)', opacity: 0.6 }}>AeroDry Mesh</p>
                  </div>
                  <div className="border-l pl-4 transition-colors duration-500" style={{ borderColor: 'var(--color-primary)' }}>
                    <p className="text-sm font-black" style={{ color: 'var(--color-text)' }}>Custom Print</p>
                    <p className="text-[10px] font-medium" style={{ color: 'var(--color-text)', opacity: 0.6 }}>Heat-Press Numbers</p>
                  </div>
                  <div className="border-l pl-4 transition-colors duration-500" style={{ borderColor: 'var(--color-primary)' }}>
                    <p className="text-sm font-black" style={{ color: 'var(--color-text)' }}>Express Delivery</p>
                    <p className="text-[10px] font-medium" style={{ color: 'var(--color-text)', opacity: 0.6 }}>Fast Global Dispatch</p>
                  </div>
                </div>
              </div>

              {/* ─── RIGHT: Featured Products Carousel ─── */}
              <Suspense fallback={
                <div className="w-full max-w-md lg:max-w-lg h-80 animate-pulse bg-slate-700 rounded-3xl" />
              }>
                <FeaturedCarousel products={featuredProducts} />
              </Suspense>

            </div>
          </div>
        </section>

        {/* ─── Official Partner Clubs Marquee ────────────────────── */}
        {teamLogos.length > 0 && (
          <section 
            className="py-8 overflow-hidden transition-colors duration-500" 
            style={{ backgroundColor: 'var(--color-card-bg)' }}  // ✅ Dynamic marquee background
          >
            <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
              <p 
                className="text-[11px] font-black uppercase tracking-widest transition-colors duration-500"
                style={{ color: 'var(--color-text)', opacity: 0.6 }}
              >
                Official Pro League Partners & Kit Providers
              </p>
            </div>

            <div className="relative overflow-hidden">
              {/* ✅ Dynamic fade overlays using card background */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none transition-colors duration-500"
                style={{ background: `linear-gradient(to right, var(--color-card-bg), transparent)` }}
              />
              <div 
                className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none transition-colors duration-500"
                style={{ background: `linear-gradient(to left, var(--color-card-bg), transparent)` }}
              />

              <div className="flex gap-6 w-max animate-marquee py-2">
                {scrollingLogos.map((logo, idx) => (
                  <div 
                    key={idx} 
                    className="flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-500 shadow-sm hover:scale-105"
                    style={{ 
                      backgroundColor: '#f9fafb',              // ✅ Fixed light gray card background
                      borderColor: 'var(--color-primary)',    // ✅ Dynamic border
                    }}
                  >
                    <div className="w-10 h-10 relative flex items-center justify-center">
                      <Image
                        src={logo.imageUrl}
                        alt={logo.name}
                        width={40}
                        height={40}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    {logo.showName && (
                      <span 
                        className="text-xs font-bold uppercase tracking-tight transition-colors duration-500"
                        style={{ color: 'var(--color-text)' }}   // ✅ Dynamic text
                      >
                        {logo.name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── PRODUCT CATALOG ────────────────────────────────────── */}
        <ProductCatalog 
          products={productsWithCategory} 
          initialCategory={categoryParam || 'All'} 
          initialSearch={params.q || ''} 
        />

      </div>
    );
  } catch (error) {
    console.error('Home page error:', error);
    return <ErrorFallback />;
  }
}