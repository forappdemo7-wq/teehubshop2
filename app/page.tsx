import { prisma } from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface PageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const category = params.category;
  const searchQuery = params.q?.toLowerCase() || '';

  const whereClause: any = {};
  if (category && category !== 'All') whereClause.category = category;
  if (searchQuery) whereClause.name = { contains: searchQuery, mode: 'insensitive' };

  const products = await prisma.product.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
  });

  const teamLogos = await prisma.logo.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });

  const categories = ['Jersey', 'Pants', 'Shorts', 'Set'];
  const activeCategory = category || 'All';
  const scrollingLogos = teamLogos.length > 0 ? [...teamLogos, ...teamLogos] : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Hero Section – brand gradient (unchanged) */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 container mx-auto px-4 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-xl">
            Design Your Legacy
          </h1>
          <p className="text-lg md:text-2xl text-blue-100 mb-10">
            Customize your premium jersey with your name and number.
          </p>
          <Link href="/custom-jersey" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 px-10 rounded-full">
            Start Designing
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent z-10"></div>
      </section>

      {/* Team Logos Slider – full colour, visible title */}
      {teamLogos.length > 0 && (
        <section className="py-10 overflow-hidden border-b" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-text)20' }}>
          <div className="container mx-auto px-4">
            {/* ✅ Fixed dark text – always visible regardless of theme */}
            <p className="text-sm font-bold tracking-widest text-center uppercase mb-8 text-gray-700">
              Official Partner Teams
            </p>
            <div className="relative overflow-hidden group">
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r to-transparent z-10" style={{ background: `linear-gradient(to right, var(--color-card-bg), transparent)` }}></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l to-transparent z-10" style={{ background: `linear-gradient(to left, var(--color-card-bg), transparent)` }}></div>
              <div className="flex gap-12 w-max animate-scroll group-hover:animation-play-state:paused">
                {scrollingLogos.map((logo, idx) => (
                  <div key={idx} className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                    <img
                      src={logo.imageUrl}
                      alt={logo.name}
                      className="max-w-full max-h-full object-contain transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search & Filter Bar – adapts to theme */}
      <div className="sticky top-0 shadow-md z-40 py-4 border-b" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-text)20' }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <Link
                href="/"
                className={`px-5 py-2 rounded-full text-sm font-bold transition ${
                  activeCategory === 'All' ? 'text-white shadow-sm' : 'hover:bg-gray-200 border border-gray-300'
                }`}
                style={{
                  backgroundColor: activeCategory === 'All' ? 'var(--color-primary)' : 'var(--color-card-bg)',
                  color: activeCategory === 'All' ? 'white' : 'var(--color-text)',
                }}
              >
                All Gear
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/?category=${cat}`}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition ${
                    activeCategory === cat ? 'text-white shadow-sm' : 'hover:bg-gray-200 border border-gray-300'
                  }`}
                  style={{
                    backgroundColor: activeCategory === cat ? 'var(--color-primary)' : 'var(--color-card-bg)',
                    color: activeCategory === cat ? 'white' : 'var(--color-text)',
                  }}
                >
                  {cat}s
                </Link>
              ))}
            </div>

            <form action="/" method="GET" className="relative w-full md:w-96">
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-text)30',
                  color: 'var(--color-text)',
                }}
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5" style={{ color: 'var(--color-text)80' }} />
              {category && <input type="hidden" name="category" value={category} />}
            </form>
          </div>
        </div>
      </div>

      {/* Products Grid – 2 columns on mobile */}
      <div className="container mx-auto px-4 py-12">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: 'var(--color-text)80' }}>No products found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}