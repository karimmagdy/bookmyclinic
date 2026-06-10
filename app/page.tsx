import { createClient } from '@/lib/supabase/server';

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00');
  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const dayName = days[date.getDay()];
  return `${dayName} ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  if (hour === 12) return `12:${m} ظهراً`;
  if (hour === 13) return `1:${m} ظهراً`;
  if (hour === 14) return `2:${m} ظهراً`;
  if (hour === 15) return `3:${m} عصراً`;
  if (hour === 16) return `4:${m} عصراً`;
  if (hour === 17) return `5:${m} مساءً`;
  if (hour === 18) return `6:${m} مساءً`;
  if (hour === 19) return `7:${m} مساءً`;
  if (hour === 20) return `8:${m} مساءً`;
  if (hour === 21) return `9:${m} مساءً`;
  if (hour === 22) return `10:${m} مساءً`;
  return `${hour}:${m}`;
}

export default async function HomePage() {
  const supabase = await createClient();

  const today = new Date().toISOString().split('T')[0];

  const { data: slots, error } = await supabase
    .from('time_slots')
    .select('*')
    .eq('is_available', true)
    .gte('slot_date', today)
    .order('slot_date', { ascending: true })
    .order('slot_time', { ascending: true });

  if (error) {
    console.error('Error fetching slots:', error.message);
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">عذراً، حدث خطأ في تحميل المواعيد. حاول مرة أخرى لاحقاً.</p>
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">لا توجد مواعيد متاحة حالياً.</p>
        <p className="text-gray-400 mt-2">يرجى التحقق لاحقاً لحجز موعد جديد.</p>
      </div>
    );
  }

  // Group slots by date
  const grouped: Record<string, typeof slots> = {};
  for (const slot of slots) {
    if (!grouped[slot.slot_date]) {
      grouped[slot.slot_date] = [];
    }
    grouped[slot.slot_date].push(slot);
  }

  return (
    <div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-center">
        <p className="text-blue-800 font-medium">
          ⏰ مواعيد العمل: الأحد إلى الخميس — 4:00 عصراً حتى 9:00 مساءً
        </p>
        <p className="text-blue-600 text-sm mt-1">
          مدة الجلسة 60 دقيقة — الدفع 100 جنيه عند الحضور
        </p>
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        اختر الموعد المناسب لك:
      </h2>

      {Object.entries(grouped).map(([date, dateSlots]) => (
        <div key={date} className="mb-6">
          <h3 className="text-md font-bold text-gray-700 mb-2 bg-gray-100 px-3 py-2 rounded-lg">
            {formatDate(date)}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {dateSlots.map((slot) => (
              <a
                key={slot.id}
                href={`/book/${slot.id}`}
                className="block bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-blue-400 hover:shadow-md transition-all active:bg-blue-50"
              >
                <span className="text-lg font-bold text-gray-800">
                  {formatTime(slot.slot_time)}
                </span>
                <span className="block text-xs text-gray-400 mt-1">
                  متاح
                </span>
              </a>
            ))}
          </div>
        </div>
      ))}

      <div className="text-center text-xs text-gray-400 mt-8 border-t pt-4">
        <p>عند الحجز، يرجى الحضور في الموعد المحدد. شكراً لكم.</p>
      </div>
    </div>
  );
}
