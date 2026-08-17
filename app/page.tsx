import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight
} from 'lucide-react';
import ProductCatalog from '@/components/ProductCatalog';

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const categoryParam = params.category;
  const searchQuery = params.q?.toLowerCase() || '';

  // ─── Fetch all products with category relation ──────────────────────
  const products = await prisma.product.findMany({
    include: {
      category: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  // ─── Fetch active team logos ─────────────────────────────────────
  const teamLogos = await prisma.logo.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  // ─── Map products to include a plain `category` string ────────────
  const productsWithCategory = products.map(product => ({
    ...product,
    category: product.category?.name || 'Uncategorized',
  }));

  const scrollingLogos = teamLogos.length > 0 ? [...teamLogos, ...teamLogos, ...teamLogos] : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      
      {/* ─── Hero Section ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-10 pb-20 md:pt-16 md:pb-28">
        {/* Glow & Backdrop Shapes */}
        <div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none animate-pulse-glow"
          style={{ backgroundColor: 'var(--color-primary)' }}
        />
        <div 
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: 'var(--color-accent)' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-white shadow-inner">
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: 'var(--color-accent)' }} />
              <span className="uppercase tracking-widest text-[10px] font-bold text-white/90">2026 Pro Athletic Collection</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black italic tracking-tight uppercase leading-[1.05]">
              ENGINEERED FOR <br />
              <span 
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: `linear-gradient(to right, #ffffff, var(--color-accent), #ffffff)`,
                }}
              >
                CHAMPIONS
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Official league jerseys, high-mobility pants, lightweight shorts, and matching training sets. Custom-tailored with your name and number.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <Link
                href="/custom-jersey"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-black flex items-center justify-center gap-2.5 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
                <span>Design Custom Jersey</span>
                <ArrowRight className="w-4 h-4 text-black group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#collection"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Explore Catalog</span>
              </Link>
            </div>

            <div className="pt-8 grid grid-cols-3 gap-2 sm:gap-6 border-t border-white/10 max-w-xl mx-auto">
              <div className="flex flex-col items-center text-center">
                <span className="text-sm sm:text-base font-black text-white">100% Breathable</span>
                <span className="text-[10px] sm:text-xs text-white/60">AeroDry Mesh Fabric</span>
              </div>
              <div className="flex flex-col items-center text-center border-x border-white/10 px-2">
                <span className="text-sm sm:text-base font-black text-white">Custom Print</span>
                <span className="text-[10px] sm:text-xs text-white/60">Pro Heat-Press Numbers</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <span className="text-sm sm:text-base font-black text-white">Express Delivery</span>
                <span className="text-[10px] sm:text-xs text-white/60">Fast Global Dispatch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Official Partner Clubs Marquee ────────────────────────── */}
      {teamLogos.length > 0 && (
        <section 
          className="py-8 overflow-hidden border-y border-black/5" 
          style={{ backgroundColor: 'var(--color-card-bg)' }}
        >
          <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">
              Official Pro League Partners & Kit Providers
            </p>
          </div>

          <div className="relative overflow-hidden">
            <div 
              className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
              style={{ background: `linear-gradient(to right, var(--color-card-bg), transparent)` }}
            />
            <div 
              className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
              style={{ background: `linear-gradient(to left, var(--color-card-bg), transparent)` }}
            />

            <div className="flex gap-6 w-max animate-marquee py-2">
              {scrollingLogos.map((logo, idx) => (
                <div 
                  key={idx} 
                  className="flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-2xl border border-black/5 bg-slate-50/70 hover:bg-slate-100/90 transition-all duration-300 shadow-sm"
                >
                  <div className="w-10 h-10 relative flex items-center justify-center">
                    <img
                      src={logo.imageUrl}
                      alt={logo.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                    {logo.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── ✨ UPGRADED CATALOG COMPONENT ────────────────────────── */}
      <ProductCatalog 
        products={productsWithCategory} 
        initialCategory={categoryParam || 'All'} 
        initialSearch={params.q || ''} 
      />

    </div>
  );
}