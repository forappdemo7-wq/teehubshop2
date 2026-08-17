import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight, 
  Package, 
  Truck, 
  Mail, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

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
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="max-w-xl w-full mx-auto">
        <div 
          className="rounded-3xl p-8 sm:p-10 shadow-2xl border border-black/5 text-center space-y-6"
          style={{ backgroundColor: 'var(--color-card-bg)' }}
        >
          {/* Animated Success Badge */}
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto shadow-inner text-emerald-600">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
              Payment & Order Verified
            </span>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight" style={{ color: 'var(--color-text)' }}>
              Order Confirmed!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Your match gear order has been received and sent to our production & dispatch hub.
            </p>
          </div>

          {/* Order Details Card */}
          {order && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-left space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-500">Order Reference</span>
                <span className="text-xs font-mono font-black text-slate-900 bg-white px-2 py-1 rounded border border-slate-200">
                  {order.orderNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Recipient</span>
                <span className="font-bold text-slate-800">{order.customerName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Total Charged</span>
                <span className="font-black text-slate-900">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-semibold">Shipping Address</span>
                <span className="font-medium text-slate-700 truncate max-w-[200px]">{order.customerAddress}</span>
              </div>
            </div>
          )}

          {/* Features note */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-slate-800">Email Confirmation</p>
                <p className="text-[10px] text-slate-500">Receipt sent to your inbox</p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] font-bold text-slate-800">Express Delivery</p>
                <p className="text-[10px] text-slate-500">Dispatched in 24-48 hrs</p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="flex-1 py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider text-white shadow-xl flex items-center justify-center gap-2 transition hover:opacity-95"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <span>Back to Store</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/track-order"
              className="py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider text-slate-800 bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4 text-slate-600" />
              <span>Track Orders</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
