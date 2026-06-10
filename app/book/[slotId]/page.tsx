import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import SlotBookingForm from './SlotBookingForm';

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

export default async function BookPage({
  params,
}: {
  params: Promise<{ slotId: string }>;
}) {
  const { slotId } = await params;
  const supabase = await createClient();

  const { data: slot, error } = await supabase
    .from('time_slots')
    .select('*')
    .eq('id', slotId)
    .single();

  if (error || !slot) {
    notFound();
  }

  if (!slot.is_available) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg font-semibold">هذا الموعد غير متاح</p>
        <p className="text-gray-500 mt-2">لقد تم حجز هذا الموعد مسبقاً.</p>
        <a
          href="/"
          className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          العودة للمواعيد المتاحة
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 text-center">
        <h2 className="text-lg font-semibold text-gray-700 mb-1">حجز موعد</h2>
        <p className="text-2xl font-bold text-blue-700 mt-2">
          {formatDate(slot.slot_date)}
        </p>
        <p className="text-xl text-gray-600 mt-1">
          الساعة {formatTime(slot.slot_time)}
        </p>
        <p className="text-sm text-gray-400 mt-3">
          مدة الجلسة 60 دقيقة — الدفع 100 جنيه عند الحضور
        </p>
      </div>

      <SlotBookingForm slotId={slot.id} />
    </div>
  );
}
