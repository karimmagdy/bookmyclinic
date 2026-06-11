import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { bookSlot } from './actions';

function fmt(date: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
function fmtTime(t: string) {
  const [h, m] = t.split(':');
  const hr = parseInt(h);
  return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
}

export default async function BookPage({ params }: { params: { slotId: string } }) {
  const supabase = await createClient();
  const { data: slot } = await supabase
    .from('time_slots')
    .select('id, slot_date, slot_time, is_available')
    .eq('id', params.slotId)
    .single();

  if (!slot || !slot.is_available) notFound();

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-blue-700 mb-1">Book Appointment</h1>
        <p className="text-gray-500 mb-6 text-sm">Fill in your details to confirm your slot.</p>

        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <p className="text-blue-800 font-semibold text-lg">{fmt(slot.slot_date)}</p>
          <p className="text-blue-600">{fmtTime(slot.slot_time)} · 60 minutes</p>
        </div>

        <form action={bookSlot}>
          <input type="hidden" name="slotId" value={slot.id} />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="name" required placeholder="Your full name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input name="phone" required placeholder="e.g. 01012345678" type="tel"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400" />
          </div>
          <button type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition text-lg">
            Confirm Booking
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">Payment: 100 EGP cash at the clinic.</p>
      </div>
    </main>
  );
}
