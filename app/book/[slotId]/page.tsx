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

export default async function BookPage({ params }: { params: { slotId: string } }) {
  const supabase = await createClient()

  const { data: slot, error } = await supabase
    .from('time_slots')
    .select('*')
    .eq('id', params.slotId)
    .eq('is_available', true)
    .single()

  if (error || !slot) return notFound()

  const s = slot as TimeSlot

  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
        <p className="text-sm text-gray-500 mb-1">You are booking</p>
        <p className="text-xl font-bold text-gray-800">{formatDate(s.slot_date)}</p>
        <p className="text-2xl font-bold text-blue-700 mt-1">{formatTime(s.slot_time)}</p>
        <p className="text-sm text-gray-400 mt-2">60-minute session · 100 EGP cash at the clinic</p>
      </div>
      <SlotBookingForm slotId={s.id} />
    </div>
  )
}
