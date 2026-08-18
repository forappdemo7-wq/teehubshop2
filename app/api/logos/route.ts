// app/api/logos/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const logos = await prisma.logo.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(logos);
  } catch (error) {
    console.error('GET logos error:', error);
    return NextResponse.json({ error: 'Failed to fetch logos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 1. Authentication
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse request body
    const body = await req.json();
    const { name, imageUrl, order, showName } = body;

    // 3. Validate required fields
    if (!name || !imageUrl) {
      return NextResponse.json(
        { error: 'Name and imageUrl are required' },
        { status: 400 }
      );
    }

    // 4. Create logo with showName (default to true if not provided)
    const logo = await prisma.logo.create({
      data: {
        name,
        imageUrl,
        order: order || 0,
        showName: showName ?? true,
        isActive: true, // explicitly set, default is true anyway
      },
    });

    return NextResponse.json(logo, { status: 201 });
  } catch (error) {
    console.error('POST logo error:', error);
    return NextResponse.json(
      { error: 'Failed to create logo' },
      { status: 500 }
    );
  }
}