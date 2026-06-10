import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'عيادة — حجز المواعيد',
  description: 'احجز موعدك في العيادة بسهولة',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <h1 className="text-xl font-bold text-gray-900 text-center">
              🏥 العيادة — حجز المواعيد
            </h1>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
