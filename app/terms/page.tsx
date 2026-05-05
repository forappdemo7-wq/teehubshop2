import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <div className="space-y-4 text-gray-700">
        <p>By using TeeHubShop, you agree to these terms. We reserve the right to update them at any time.</p>
        <h2 className="text-xl font-semibold mt-6">Use of Website:</h2>
        <p>You must be at least 13 years old to use our services. You agree to provide accurate information during checkout.</p>
        <h2 className="text-xl font-semibold mt-6">Products & Pricing:</h2>
        <p>We strive to display accurate product images and prices. However, errors may occur – we reserve the right to cancel orders due to pricing mistakes.</p>
        <Link href="/" className="inline-block mt-6 text-blue-600 hover:underline">← Back to shop</Link>
      </div>
    </div>
  );
}