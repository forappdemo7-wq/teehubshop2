import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <div className="bg-white rounded-2xl shadow-md p-6 space-y-6">
        <div className="flex items-start gap-4">
          <Mail className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold">Email</h3>
            <p>support@teehubshop.com</p>
            <p className="text-sm text-gray-500">We reply within 24 hours</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <Phone className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold">Phone</h3>
            <p>+1 (800) 123-4567</p>
            <p className="text-sm text-gray-500">Mon-Fri, 9am-6pm EST</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <MapPin className="h-6 w-6 text-blue-600 mt-1" />
          <div>
            <h3 className="font-semibold">Office</h3>
            <p>123 Fashion Avenue, Suite 400<br />New York, NY 10001</p>
          </div>
        </div>
        <Link href="/" className="inline-block text-blue-600 hover:underline">← Back to shop</Link>
      </div>
    </div>
  );
}