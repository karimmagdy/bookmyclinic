import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { TimeSlot } from '@/types'

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h, 10)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour > 12 ? hour - 12 : hour
  return `${displayHour}:${m} ${ampm}`
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
    return <p className="text-red-600">Could not load slots. Please try again later.</p>
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">No available appointments right now.</p>
        <p className="text-gray-400 mt-2">Please check back later.</p>
      </div>
    )
  }

  // Group by date
  const grouped: Record<string, TimeSlot[]> = {}
  for (const slot of slots as TimeSlot[]) {
    if (!grouped[slot.slot_date]) grouped[slot.slot_date] = []
    grouped[slot.slot_date].push(slot)
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Available Appointments</h2>
      <div className="space-y-8">
        {Object.entries(grouped).map(([date, daySlots]) => (
          <div key={date}>
            <h3 className="text-base font-semibold text-gray-600 mb-3 uppercase tracking-wide text-sm">
              {formatDate(date)}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {daySlots.map((slot) => (
                <Link
                  key={slot.id}
                  href={`/book/${slot.id}`}
                  className="block bg-white border border-blue-200 rounded-xl p-4 text-center hover:bg-blue-50 hover:border-blue-400 transition-colors shadow-sm"
                >
                  <span className="text-lg font-bold text-blue-700">{formatTime(slot.slot_time)}</span>
                  <p className="text-xs text-gray-400 mt-1">60 min · 100 EGP cash</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
