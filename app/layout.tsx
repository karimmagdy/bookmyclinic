import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'عيادة الدكتور - حجز المواعيد',
  description: 'احجز موعدك في العيادة بسهولة',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-green-700 text-white shadow-md">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <h1 className="text-xl font-bold text-center">عيادة الدكتور</h1>
            <p className="text-sm text-center text-green-100">حجز المواعيد</p>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
