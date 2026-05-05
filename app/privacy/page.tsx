import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <div className="space-y-4 text-gray-700">
        <p>Your privacy is important to us. We collect only the information necessary to process your orders and improve our service.</p>
        <h2 className="text-xl font-semibold mt-6">What we collect:</h2>
        <ul className="list-disc pl-6">
          <li>Name, email, shipping address, phone number</li>
          <li>Order history</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6">Data security:</h2>
        <p>We use industry-standard encryption. We never sell your data to third parties.</p>
        <Link href="/" className="inline-block mt-6 text-blue-600 hover:underline">← Back to shop</Link>
      </div>
    </div>
  );
}