import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

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

export default async function HomePage() {
  const supabase = createClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().split('T')[0]

  const { data: slots, error } = await supabase
    .from('time_slots')
    .select('*')
    .eq('is_available', true)
    .gte('slot_date', todayStr)
    .order('slot_date', { ascending: true })
    .order('slot_time', { ascending: true })

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700">عذراً، حدث خطأ في تحميل المواعيد. حاول مرة أخرى لاحقاً.</p>
      </div>
    )
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
        <p className="text-yellow-800 text-lg mb-2">لا توجد مواعيد متاحة حالياً</p>
        <p className="text-yellow-600">مواعيد العمل: الأحد إلى الخميس من 4 مساءً إلى 9 مساءً</p>
      </div>
    )
  }

  const grouped: Record<string, typeof slots> = {}
  for (const slot of slots) {
    if (!grouped[slot.slot_date]) {
      grouped[slot.slot_date] = []
    }
    grouped[slot.slot_date].push(slot)
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">اختر موعداً</h2>
        <p className="text-gray-500 mt-1">المواعيد المتاحة للحجز</p>
      </div>

      {Object.entries(grouped).map(([date, dateSlots]) => (
        <div key={date} className="mb-8">
          <h3 className="text-lg font-semibold text-green-800 mb-3 border-r-4 border-green-600 pr-3">
            {formatDate(date)}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {dateSlots.map((slot) => (
              <Link
                key={slot.id}
                href={`/book/${slot.id}`}
                className="block bg-white border border-green-200 rounded-xl p-4 text-center hover:bg-green-50 hover:border-green-400 transition shadow-sm"
              >
                <span className="text-lg font-bold text-green-700">
                  {formatTime(slot.slot_time)}
                </span>
                <span className="block text-xs text-gray-400 mt-1">مدة الجلسة: ساعة</span>
              </Link>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700 mt-4">
        <p className="font-semibold mb-1">ملاحظات هامة:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>مدة الجلسة ساعة واحدة</li>
          <li>الدفع نقداً عند الحضور بقيمة ١٠٠ جنيه</li>
          <li>مواعيد العمل: الأحد إلى الخميس من ٤ مساءً إلى ٩ مساءً</li>
        </ul>
      </div>
    </>
  )
}
