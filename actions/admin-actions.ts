// actions/admin-actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await checkAdmin();
    
    await prisma.order.update({
      where: { id: orderId },
      data: { status: status as any },
    });

    revalidatePath('/admin/orders');
    return { success: true };
  } catch (error) {
    console.error('Update order status error:', error);
    return { success: false, error: 'Failed to update status' };
  }
}