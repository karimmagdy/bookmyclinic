import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00');
  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const dayName = days[date.getDay()];
  return `${dayName} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  if (hour === 16) return `4:${m} عصراً`;
  if (hour === 17) return `5:${m} مساءً`;
  if (hour === 18) return `6:${m} مساءً`;
  if (hour === 19) return `7:${m} مساءً`;
  if (hour === 20) return `8:${m} مساءً`;
  if (hour === 21) return `9:${m} مساءً`;
  return `${hour}:${m}`;
}

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = await params;
  const supabase = await createClient();

  const { data: booking, error } = await supabase
    .from('bookings')
    .select(`
      *,
      slot:time_slots(*)
    `)
    .eq('id', bookingId)
    .single();

  if (error || !booking) {
    notFound();
  }

  return (
    <div className="text-center">
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 mb-6">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-green-800 mb-2">تم الحجز بنجاح!</h2>
        <p className="text-green-600">شكراً لك {booking.patient_name}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">تفاصيل الموعد</h3>
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-medium">اليوم والتاريخ:</span>{' '}
            {formatDate(booking.slot.slot_date)}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">الوقت:</span>{' '}
            {formatTime(booking.slot.slot_time)}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">الاسم:</span> {booking.patient_name}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">رقم الهاتف:</span> {booking.patient_phone}
          </p>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-yellow-800 font-medium">💰 الدفع نقداً عند الحضور — 100 جنيه</p>
        <p className="text-yellow-600 text-sm mt-1">
          يرجى الحضور في الموعد المحدد. إذا كنت ترغب في إلغاء الحجز، يرجى الاتصال بالعيادة.
        </p>
      </div>

      <a
        href="/"
        className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        العودة للصفحة الرئيسية
      </a>
    </div>
  );
}
