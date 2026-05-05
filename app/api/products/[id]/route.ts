import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// Reuse the same validation logic for consistency
const UpdateProductSchema = z.object({
  name: z.string().min(3, "Name is required"),
  description: z.string().min(10, "Description is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  stock: z.coerce.number().int().nonnegative("Stock cannot be negative"),
  category: z.string().min(1, "Category is required"),
  imageUrl: z.string().url("Main image URL is required"),
  images: z.string().optional().default('[]'),
  features: z.string().optional().default('[]'),
  specs: z.string().optional().default('[]'),
});

export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Auth Guard
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Product ID is missing" }, { status: 400 });
    }

    // 2. Validate Data
    const formData = await req.formData();
    const rawData = Object.fromEntries(formData.entries());
    const result = UpdateProductSchema.safeParse(rawData);

    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        error: result.error.errors[0].message 
      }, { status: 400 });
    }

    // 3. Verify existence before update
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // 4. Perform Update
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...result.data,
        // Ensure strings are trimmed
        name: result.data.name.trim(),
        description: result.data.description.trim(),
      },
    });

    return NextResponse.json({ 
      success: true, 
      product,
      message: "Product updated successfully" 
    });

  } catch (error) {
    console.error(`[PRODUCT_PUT_ERROR]:`, error);
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}