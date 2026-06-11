import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function formatTime(timeStr: string) {
  const [h] = timeStr.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour
  return `${displayHour}:00 ${ampm}`
}

export default async function ConfirmationPage({ params }: { params: { bookingId: string } }) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bookings')
    .select('id, patient_name, patient_phone, time_slots(slot_date, slot_time)')
    .eq('id', params.bookingId)
    .single()

  if (error || !data) return notFound()

  const slot = Array.isArray(data.time_slots) ? data.time_slots[0] : data.time_slots
  if (!slot) return notFound()

  return (
    <div className="text-center">
      <div className="text-5xl mb-4">✅</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">You&apos;re Booked!</h2>
      <p className="text-gray-500 mb-8">See you at the clinic.</p>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-left space-y-4 mb-8">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Patient</p>
          <p className="text-lg font-semibold text-gray-800">{data.patient_name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
          <p className="text-lg font-semibold text-gray-800">{formatDate(slot.slot_date)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Time</p>
          <p className="text-lg font-semibold text-blue-700">{formatTime(slot.slot_time)}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-yellow-800">💵 Payment at the Clinic</p>
          <p className="text-sm text-yellow-700 mt-1">Please bring <strong>100 EGP cash</strong> with you on the day of your appointment.</p>
        </div>
      </div>

      <Link href="/" className="text-blue-600 hover:underline text-sm">← Back to appointments</Link>
    </div>
  )
}
