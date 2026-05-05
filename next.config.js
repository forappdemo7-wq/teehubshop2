/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Your Cloudinary account (for new product, gallery & logo images)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dqz2aoygf/**', // Optional: restricts to your cloud name
      },
      // Unsplash (for your existing sample products)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Icons8 (for your team logos)
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
      },
      // Fallback placeholder for any broken images
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
};

module.exports = nextConfig;