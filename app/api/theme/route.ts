import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    let theme = await prisma.theme.findFirst();
    if (!theme) {
      // Create default theme if none exists
      theme = await prisma.theme.create({
        data: {
          name: 'default',
          primary: '#2563eb',
          secondary: '#1e40af',
          accent: '#eab308',
          background: '#f3f4f6',
          text: '#111827',
          cardBg: '#ffffff',
        },
      });
    }
    return NextResponse.json(theme);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch theme' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    let theme = await prisma.theme.findFirst();
    if (!theme) {
      theme = await prisma.theme.create({ data: body });
    } else {
      theme = await prisma.theme.update({
        where: { id: theme.id },
        data: body,
      });
    }
    return NextResponse.json(theme);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update theme' }, { status: 500 });
  }
}