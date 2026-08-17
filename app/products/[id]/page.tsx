import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import AddToCartButton from '@/components/AddToCartButton';
import ProductGallery from '@/components/ProductGallery';
import ProductCard from '@/components/ProductCard';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ChevronLeft, 
  Sparkles,
  CheckCircle2,
  Star,
  Package,
  Clock
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

function safeParse(data: string | null): string[] {
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) return { title: 'Product Not Found | TeeHub' };

  return {
    title: `${product.name} | TeeHub Sportswear`,
    description: product.description,
    openGraph: {
      images: [product.imageUrl],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) notFound();

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) notFound();

  const features = safeParse(product.features);
  const specs = safeParse(product.specs);
  const gallery = safeParse(product.images);
  const allImages = [product.imageUrl, ...gallery];
  
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  const relatedProducts = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id } },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen py-8 md:py-12" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── Breadcrumb ─── */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
          <Link 
            href={`/?category=${product.category}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to {product.category}s</span>
          </Link>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-white/50 px-3 py-1 rounded-full border border-slate-200/50">
            SKU: {product.id.slice(0, 8).toUpperCase()}
          </span>
        </div>

        {/* ─── Main Product Card ─── */}
        <div 
          className="rounded-3xl shadow-2xl border border-black/5 overflow-hidden bg-white/80 backdrop-blur-sm"
          style={{ backgroundColor: 'var(--color-card-bg)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-10">
            
            {/* ── Gallery ── */}
            <div className="lg:col-span-7">
              <ProductGallery images={allImages} />
            </div>

            {/* ── Product Details ── */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              
              {/* Category & Stock */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span 
                  className="inline-block px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full"
                  style={{
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                  }`} />
                  <span className={`text-xs font-bold ${
                    isOutOfStock ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {isOutOfStock ? 'Sold Out' : isLowStock ? `Only ${product.stock} Left!` : 'In Stock'}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight" style={{ color: 'var(--color-text)' }}>
                {product.name}
              </h1>

              {/* Price & Shipping */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--color-text)' }}>
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  Free shipping
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed border-t border-black/5 pt-4">
                {product.description}
              </p>

              {/* Features */}
              {features.length > 0 && (
                <div className="pt-2 border-t border-black/5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
                    Key Highlights
                  </h3>
                  <ul className="grid grid-cols-1 gap-2">
                    {features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specs (Optional) */}
              {specs.length > 0 && (
                <div className="pt-2 border-t border-black/5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
                    Specifications
                  </h3>
                  <ul className="grid grid-cols-1 gap-1.5">
                    {specs.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ── Add to Cart & Trust ── */}
              <div className="space-y-4 pt-4 border-t border-black/5">
                <AddToCartButton product={product} />

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                    <ShieldCheck className="w-4 h-4 text-slate-700 mb-1" />
                    <span className="text-[10px] font-bold text-slate-800">100% Pro Fit</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                    <Truck className="w-4 h-4 text-slate-700 mb-1" />
                    <span className="text-[10px] font-bold text-slate-800">Fast Shipping</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                    <RotateCcw className="w-4 h-4 text-slate-700 mb-1" />
                    <span className="text-[10px] font-bold text-slate-800">30-Day Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Related Products ─── */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight" style={{ color: 'var(--color-text)' }}>
                You May Also Like
              </h2>
              <Link 
                href={`/?category=${product.category}`}
                className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1"
              >
                View all {product.category}s
                <span className="text-lg">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={{ ...rp, category: rp.category }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}