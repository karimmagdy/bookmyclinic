import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import SlotBookingForm from './SlotBookingForm'
import type { TimeSlot } from '@/types'

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

const ERROR_MESSAGES: Record<string, string> = {
  missing_name:  'Please enter your full name.',
  missing_phone: 'Please enter your phone number.',
  not_found:     'This slot could not be found. Please go back and choose another.',
  taken:         'Sorry, this slot was just booked. Please choose another time.',
  db_error:      'Could not save your booking. Please try again.',
}

export default async function BookPage({
  params,
  searchParams,
}: {
  params: { slotId: string }
  searchParams: { error?: string }
}) {
  const supabase = await createClient()

  const { data: slot, error } = await supabase
    .from('time_slots')
    .select('*')
    .eq('id', params.slotId)
    .single()

  if (error || !slot) return notFound()

  const s = slot as TimeSlot
  const errorMsg = searchParams.error ? (ERROR_MESSAGES[searchParams.error] ?? 'Something went wrong. Please try again.') : null

  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <p className="text-sm text-gray-500 mb-1">You are booking</p>
        <p className="text-xl font-bold text-gray-800">{formatDate(s.slot_date)}</p>
        <p className="text-2xl font-bold text-blue-700 mt-1">{formatTime(s.slot_time)}</p>
        <p className="text-sm text-gray-400 mt-2">60-minute session · 100 EGP cash at the clinic</p>
      </div>

      {!s.is_available && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">
          This slot has already been booked. <a href="/" className="underline font-semibold">Choose another time</a>.
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-red-700 text-sm">
          {errorMsg}
        </div>
      )}

      {s.is_available && <SlotBookingForm slotId={s.id} />}
    </div>
  )
}
