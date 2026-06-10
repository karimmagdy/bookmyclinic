import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
  return `${hour12}:${m} ${ampm}`
}

export default async function ConfirmationPage({
  params,
}: {
  params: { bookingId: string }
}) {
  const { bookingId } = params
  const supabase = await createClient()

  const { data: booking, error } = await supabase
    .from('bookings')
    .select('id, patient_name, patient_phone, created_at, slot:time_slots!inner(slot_date, slot_time)')
    .eq('id', bookingId)
    .single()

  if (error || !booking) {
    notFound()
  }

  const slot = booking.slot as unknown as { slot_date: string; slot_time: string }

  return (
    <div className="bg-white border border-green-200 rounded-xl p-6 text-center max-w-md mx-auto">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="text-2xl font-bold text-green-800 mb-2">Appointment Booked!</h1>
      <p className="text-gray-600 mb-6">
        Your appointment is confirmed. See you at the clinic.
      </p>

      <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left space-y-2">
        <p>
          <span className="font-medium text-gray-700">Name:</span>{' '}
          {booking.patient_name}
        </p>
        <p>
          <span className="font-medium text-gray-700">Phone:</span>{' '}
          {booking.patient_phone}
        </p>
        <p>
          <span className="font-medium text-gray-700">Date:</span>{' '}
          {formatDate(slot.slot_date)}
        </p>
        <p>
          <span className="font-medium text-gray-700">Time:</span>{' '}
          {formatTime(slot.slot_time)}
        </p>
        <p className="pt-2 text-sm text-gray-500">
          💵 Please bring <strong>100 EGP</strong> in cash to the clinic.
        </p>
      </div>

      <Link
        href="/"
        className="inline-block bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 hover:bg-blue-800 transition-colors"
      >
        Book Another Appointment
      </Link>
    </div>
  )
}
