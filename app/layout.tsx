import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BookMyClinic',
  description: 'Book your clinic appointment easily'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white border-b border-gray-200 py-4 px-6 mb-8">
          <h1 className="text-2xl font-bold text-blue-700">BookMyClinic</h1>
          <p className="text-sm text-gray-500 mt-1">Book your appointment — Sunday to Thursday, 4pm to 9pm</p>
        </header>
        <main className="max-w-2xl mx-auto px-4 pb-16">{children}</main>
      </body>
    </html>
  )
}
