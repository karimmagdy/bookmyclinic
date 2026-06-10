import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
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

export default async function HomePage() {
  const supabase = await createClient()

  const today = new Date().toISOString().split('T')[0]

  const { data: slots, error } = await supabase
    .from('time_slots')
    .select('*')
    .eq('is_available', true)
    .gte('slot_date', today)
    .order('slot_date', { ascending: true })
    .order('slot_time', { ascending: true })

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Something went wrong loading available slots.</p>
        <p className="text-sm mt-2">Please try again later.</p>
      </div>
    )
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">No Available Slots</h1>
        <p className="text-gray-600">
          There are no available appointments right now.
          Please check back later or call the clinic.
        </p>
      </div>
    )
  }

  const grouped: Record<string, TimeSlot[]> = {}
  for (const slot of slots) {
    if (!grouped[slot.slot_date]) grouped[slot.slot_date] = []
    grouped[slot.slot_date].push(slot)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Book an Appointment</h1>
      <p className="text-gray-600 mb-6">
        Pick a time slot below. Sessions are 60 minutes. Pay 100 EGP cash at the clinic.
      </p>

      {Object.entries(grouped).map(([date, dateSlots]) => (
        <div key={date} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            {formatDate(date)}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {dateSlots.map((slot) => (
              <Link
                key={slot.id}
                href={`/book/${slot.id}`}
                className="block text-center bg-white border border-gray-200 rounded-xl px-4 py-4 hover:border-blue-400 hover:shadow-md transition-all"
              >
                <span className="text-lg font-bold text-blue-700">
                  {formatTime(slot.slot_time)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
