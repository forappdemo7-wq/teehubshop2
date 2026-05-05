import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import AddToCartButton from '@/components/AddToCartButton';
import ProductGallery from '@/components/ProductGallery';

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Utility to safely parse JSON strings from the database
 */
function safeParse(data: string | null): string[] {
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse JSON field:", e);
    return [];
  }
}

/**
 * Dynamic SEO Metadata
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });

  if (!product) return { title: 'Product Not Found' };

  return {
    title: `${product.name} | MyStore`,
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

  // Data preparation
  const features = safeParse(product.features);
  const specs = safeParse(product.specs);
  const gallery = safeParse(product.images);
  const allImages = [product.imageUrl, ...gallery];
  
  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = product.stock === 0;

  const relatedProducts = await prisma.product.findMany({
    where: { category: product.category, id: { not: product.id } },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Main Image Section */}
            <div className="lg:w-1/2 bg-gray-100">
              <ProductGallery images={allImages} />
            </div>

            {/* Product Info Section */}
            <div className="lg:w-1/2 p-6 md:p-8">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wide">
                {product.category}
              </span>
              
              <h1 className="text-3xl font-bold text-gray-900 mt-3">{product.name}</h1>
              
              <div className="flex items-baseline gap-3 mt-2 mb-4">
                <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                {!isOutOfStock && (
                  <span className="text-sm text-gray-500 font-medium">
                    {product.stock} available
                  </span>
                )}
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>

              {/* Dynamic Stock Indicator */}
              <div className="flex items-center gap-2 mb-8">
                <div className={`w-3 h-3 rounded-full animate-pulse ${
                  isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-orange-500' : 'bg-green-500'
                }`} />
                <span className="text-sm font-medium">
                  {isOutOfStock ? 'Out of Stock' : isLowStock ? 'Limited Stock Available' : 'In Stock'}
                </span>
              </div>

              {/* Features & Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {features.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Key Features</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                      {features.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                  </div>
                )}
                {specs.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Included</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                      {specs.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
              </div>

              <AddToCartButton product={product} />
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((rp) => {
                const isRelatedOutOfStock = rp.stock === 0;
                return (
                  <Link 
                    key={rp.id} 
                    href={`/products/${rp.id}`} 
                    className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="relative h-56 w-full">
                      <Image 
                        src={rp.imageUrl} 
                        alt={rp.name} 
                        fill 
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    </div>
                    <div className="p-5">
                      <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{rp.category}</span>
                      <h3 className="font-bold text-gray-900 mt-1 group-hover:text-blue-600 transition-colors">{rp.name}</h3>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xl font-bold text-gray-900">${rp.price.toFixed(2)}</span>
                        <span className={`text-xs font-bold ${isRelatedOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                          {isRelatedOutOfStock ? 'Out of Stock' : 'In Stock'}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}