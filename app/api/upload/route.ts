// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// ─── Cloudinary Configuration ──────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Constants ──────────────────────────────────────────────────────────────
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml', // optional, but useful for logos
];

export async function POST(request: NextRequest) {
  try {
    // ── 1. Authenticate ──
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized – admin access required' },
        { status: 401 }
      );
    }

    // ── 2. Validate Cloudinary credentials ──
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error('❌ Missing Cloudinary environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: missing Cloudinary credentials' },
        { status: 500 }
      );
    }

    // ── 3. Parse form data ──
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // ── 4. Validate file type ──
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file type. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // ── 5. Validate file size ──
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // ── 6. Convert to buffer ──
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ── 7. Upload to Cloudinary ──
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'teehubshop',                // organize all uploads in this folder
          use_filename: true,
          unique_filename: true,
          resource_type: 'auto',               // auto-detect image type
          // optional: transformation for consistent sizing
          // transformation: [{ width: 800, height: 800, crop: 'limit' }],
        },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      ).end(buffer);
    });

    // ── 8. Return secure URL ──
    const imageUrl = (result as any).secure_url;
    console.log(`✅ Image uploaded: ${imageUrl}`);

    return NextResponse.json({
      success: true,
      url: imageUrl,
      // optional: return additional metadata if needed
      // public_id: (result as any).public_id,
    });
  } catch (error: any) {
    console.error('❌ Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}

// ── Optional: Add a GET route to test configuration ──
export async function GET() {
  return NextResponse.json({
    status: 'Cloudinary upload API is ready',
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'not set',
  });
}