import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
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

export default async function ConfirmationPage(props: { params: Promise<{ bookingId: string }> }) {
  const params = await props.params
  const supabase = await createClient()

  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*, time_slots(*)')
    .eq('id', params.bookingId)
    .single()

  if (error || !booking) {
    notFound()
  }

  const slot = booking.time_slots as { slot_date: string; slot_time: string }

  return (
    <>
      <div className="bg-green-600 text-white rounded-xl p-8 text-center shadow-lg mb-6">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2">تم الحجز بنجاح!</h2>
        <p className="text-green-100">شكراً لك {booking.patient_name}</p>
      </div>

      <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">تفاصيل الحجز</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500">الاسم</span>
            <span className="font-semibold text-gray-800">{booking.patient_name}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500">رقم الهاتف</span>
            <span className="font-semibold text-gray-800" dir="ltr">{booking.patient_phone}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500">التاريخ</span>
            <span className="font-semibold text-gray-800">{formatDate(slot.slot_date)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-500">الوقت</span>
            <span className="font-semibold text-gray-800">{formatTime(slot.slot_time)}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-500">المدة</span>
            <span className="font-semibold text-gray-800">ساعة واحدة</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-center mb-6">
        <p className="text-yellow-800 font-semibold text-lg mb-1">💰 الدفع عند الحضور</p>
        <p className="text-yellow-700">من فضلك احضر ١٠٠ جنيه مصري نقداً عند موعدك</p>
      </div>

      <Link
        href="/"
        className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition"
      >
        العودة للصفحة الرئيسية
      </Link>
    </>
  )
}
