import Link from 'next/link';

export default function CustomJerseyPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Custom Jersey Builder</h1>
      <p className="text-gray-600 mb-8">Design your own jersey – coming soon! Choose name, number, colors.</p>
      <Link href="/" className="text-blue-600 hover:underline">← Back to shop</Link>
    </div>
  );
}