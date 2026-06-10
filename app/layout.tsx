import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BookMyClinic — Book Your Appointment',
  description: 'Book a 60-minute clinic appointment. Pay 100 EGP cash at the clinic.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold tracking-tight text-blue-700">
              🏥 BookMyClinic
            </a>
          </div>
        </header>
        <main className="max-w-2xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
