import { prisma } from '@/lib/prisma';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const orderId = params.orderId;
  let order = null;

  if (orderId) {
    order = await prisma.order.findUnique({
      where: { id: orderId },
    });
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 text-lg mb-2">Thank you for your purchase.</p>
        {order ? (
          <>
            <p className="text-gray-500 mb-4">
              Order number: <span className="font-mono font-semibold text-gray-800">{order.orderNumber}</span>
            </p>
            <p className="text-gray-500 mb-6">A confirmation email has been sent to your inbox.</p>
          </>
        ) : (
          <p className="text-gray-500 mb-6">Your order has been placed successfully.</p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md">
            Continue Shopping
          </Link>
          <Link href="/track-order" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition">
            Track Orders
          </Link>
        </div>
      </div>
    </div>
  );
}