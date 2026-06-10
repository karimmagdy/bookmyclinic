import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import SlotBookingForm from './SlotBookingForm'

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00')
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return date.toLocaleDateString('ar-EG', options)
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h, 10)
  if (hour < 12) return `${hour}:${m} صباحاً`
  if (hour === 12) return `12:${m} مساءً`
  return `${hour - 12}:${m} مساءً`
}

export default async function BookPage({ params }: { params: { slotId: string } }) {
  const supabase = await createClient()

  const { data: slot, error } = await supabase
    .from('time_slots')
    .select('*')
    .eq('id', params.slotId)
    .single()

  if (error || !slot || !slot.is_available) {
    notFound()
  }

  // Check if slot is in the past
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const slotDate = new Date(slot.slot_date + 'T00:00:00')
  if (slotDate < today) {
    notFound()
  }

  return (
    <div>
      <div className="bg-white border border-green-200 rounded-xl p-6 mb-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">تأكيد الحجز</h2>
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">التاريخ:</span> {formatDate(slot.slot_date)}
          </p>
          <p className="text-gray-700 mb-1">
            <span className="font-semibold">الوقت:</span> {formatTime(slot.slot_time)}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">المدة:</span> ساعة واحدة
          </p>
        </div>

        <SlotBookingForm slotId={slot.id} />
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700">
        <p className="font-semibold">تذكير:</p>
        <p>الدفع نقداً عند الحضور بقيمة ١٠٠ جنيه مصري. من فضلك احضر المبلغ مضبوطاً.</p>
      </div>
    </div>
  )
}
