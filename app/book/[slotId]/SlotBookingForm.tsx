'use client'

import { useState } from 'react'
import { bookSlot } from '@/app/book/actions'
import { useRouter } from 'next/navigation'

export default function SlotBookingForm({ slotId }: { slotId: string }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('من فضلك أدخل الاسم')
      return
    }
    if (!phone.trim()) {
      setError('من فضلك أدخل رقم الهاتف')
      return
    }
    if (phone.trim().length < 10) {
      setError('رقم الهاتف غير صحيح - أدخل رقم مكون من ١٠ أرقام على الأقل')
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append('name', name.trim())
    formData.append('phone', phone.trim())

    const result = await bookSlot(slotId, formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    if (result?.redirect) {
      router.push(result.redirect)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          الاسم الكامل
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="أدخل اسمك"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          رقم الهاتف
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="أدخل رقم هاتفك"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-lg py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'جاري تأكيد الحجز...' : 'تأكيد الحجز'}
      </button>
    </form>
  )
}
