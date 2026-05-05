import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query || query.trim() === '') {
    return NextResponse.json({ success: false, error: 'Please provide an order number or email' }, { status: 400 });
  }

  try {
    const isEmail = query.includes('@');
    let orders;

    if (isEmail) {
      orders = await prisma.order.findMany({
        where: { customerEmail: query.toLowerCase() },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      orders = await prisma.order.findMany({
        where: { orderNumber: query },
        include: { items: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    return NextResponse.json({
      success: true,
      orders: orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        items: order.items.map(item => ({
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
        })),
      })),
    });
  } catch (error) {
    console.error('Track order error:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}