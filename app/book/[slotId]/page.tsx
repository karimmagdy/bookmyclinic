import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SlotBookingForm from './SlotBookingForm'
import type { TimeSlot } from '@/types'

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

export default async function BookSlotPage({
  params,
}: {
  params: { slotId: string }
}) {
  const { slotId } = params
  const supabase = await createClient()

  const { data: slot, error } = await supabase
    .from('time_slots')
    .select('*')
    .eq('id', slotId)
    .eq('is_available', true)
    .single<TimeSlot>()

  if (error || !slot) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Book This Slot</h1>
      <p className="text-gray-600 mb-6">
        {formatDate(slot.slot_date)} at {formatTime(slot.slot_time)}
      </p>
      <SlotBookingForm slotId={slot.id} />
    </div>
  )
}
