import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${m} ${ampm}`;
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

  const grouped: Record<string, typeof slots> = {};
  for (const slot of slots ?? []) {
    if (!grouped[slot.slot_date]) grouped[slot.slot_date] = [];
    grouped[slot.slot_date]!.push(slot);
  }

  const dates = Object.keys(grouped).sort();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-blue-700 mb-2">BookMyClinic</h1>
          <p className="text-gray-600 text-lg">Pick a time that works for you</p>
          <p className="text-gray-500 mt-1">Session: 60 min &nbsp;·&nbsp; 100 EGP cash at the clinic</p>
        </div>

        {dates.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-xl">No available slots right now.</p>
            <p className="mt-2">Please check back later.</p>
          </div>
        )}

        {dates.map(date => (
          <div key={date} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">{formatDate(date)}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {grouped[date]!.map(slot => (
                <Link
                  key={slot.id}
                  href={`/book/${slot.id}`}
                  className="block text-center bg-white border-2 border-blue-200 rounded-xl py-4 px-3 text-blue-700 font-semibold text-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors"
                >
                  {formatTime(slot.slot_time)}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
