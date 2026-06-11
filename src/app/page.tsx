import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTime(timeStr: string) {
  const [hourStr, minuteStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  return `${h}:${minuteStr ?? '00'} ${ampm}`;
}

export default async function HomePage() {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: slots } = await supabase
    .from('time_slots')
    .select('id, slot_date, slot_time')
    .eq('is_available', true)
    .gte('slot_date', today)
    .order('slot_date', { ascending: true })
    .order('slot_time', { ascending: true });

  const grouped: Record<string, { id: string; slot_date: string; slot_time: string }[]> = {};
  for (const slot of slots ?? []) {
    if (!grouped[slot.slot_date]) grouped[slot.slot_date] = [];
    grouped[slot.slot_date].push(slot);
  }

  const dates = Object.keys(grouped).sort();

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-2">BookMyClinic</h1>
      <p className="text-center text-gray-500 mb-8">Pick a time that works for you — payment is 100 EGP cash at the clinic.</p>

      {dates.length === 0 ? (
        <p className="text-center text-gray-400 mt-20">No available slots right now. Please check back later.</p>
      ) : (
        <div className="space-y-8">
          {dates.map(date => (
            <div key={date}>
              <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-1">{formatDate(date)}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {grouped[date].map(slot => (
                  <Link
                    key={slot.id}
                    href={`/book/${slot.id}`}
                    className="block text-center bg-white border-2 border-blue-500 text-blue-600 font-semibold rounded-xl py-3 hover:bg-blue-500 hover:text-white transition-colors"
                  >
                    {formatTime(slot.slot_time)}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
