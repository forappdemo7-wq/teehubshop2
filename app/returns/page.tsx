import Link from 'next/link';

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Return & Refund Policy</h1>
      <p className="text-gray-600 mb-4">Last updated: April 2026</p>
      <div className="space-y-4 text-gray-700">
        <p>We want you to be completely satisfied with your purchase. If you're not happy, you may return eligible items within 30 days of delivery.</p>
        <h2 className="text-xl font-semibold mt-6">Conditions:</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Items must be unworn, unwashed, with original tags attached.</li>
          <li>Customized jerseys (with name/number) are final sale.</li>
          <li>Return shipping costs are the responsibility of the customer unless the item is defective.</li>
        </ul>
        <p className="mt-4">To start a return, please contact us at <a href="mailto:support@teehubshop.com" className="text-blue-600">support@teehubshop.com</a> with your order number.</p>
        <Link href="/" className="inline-block mt-6 text-blue-600 hover:underline">← Back to shop</Link>
      </div>
    </div>
  );
}