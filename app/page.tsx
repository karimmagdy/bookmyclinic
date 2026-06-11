import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

type Slot = { id: string; slot_date: string; slot_time: string };

function fmt(date: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
function fmtTime(t: string) {
  const [h, m] = t.split(':');
  const hr = parseInt(h);
  return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
}

export default async function HomePage() {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];
  const { data: slots } = await supabase
    .from('time_slots')
    .select('id, slot_date, slot_time')
    .eq('is_available', true)
    .gte('slot_date', today)
    .order('slot_date')
    .order('slot_time');

  const grouped: Record<string, Slot[]> = {};
  for (const s of slots ?? []) {
    if (!grouped[s.slot_date]) grouped[s.slot_date] = [];
    grouped[s.slot_date].push(s);
  }

  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-2">BookMyClinic</h1>
        <p className="text-gray-600">Pick a time that works for you. Each session is 60 minutes.</p>
        <p className="text-sm text-gray-500 mt-1">Payment: 100 EGP cash at the clinic.</p>
      </div>

      {Object.keys(grouped).length === 0 && (
        <p className="text-center text-gray-500 mt-16">No available slots right now. Please check back soon.</p>
      )}

      {Object.entries(grouped).map(([date, daySlots]) => (
        <div key={date} className="mb-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{fmt(date)}</h2>
          <div className="grid grid-cols-2 gap-3">
            {daySlots.map(slot => (
              <Link key={slot.id} href={`/book/${slot.id}`}
                className="block bg-white border-2 border-blue-200 rounded-xl p-4 text-center hover:border-blue-500 hover:shadow transition">
                <span className="text-lg font-semibold text-blue-700">{fmtTime(slot.slot_time)}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
