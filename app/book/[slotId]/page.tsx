import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { bookSlot } from './actions';

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

export default async function BookPage({ params }: { params: { slotId: string } }) {
  const supabase = await createClient();
  const { data: slot } = await supabase
    .from('time_slots')
    .select('id, slot_date, slot_time, is_available')
    .eq('id', params.slotId)
    .single();

  if (!slot || !slot.is_available) notFound();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <h1 className="text-2xl font-bold text-blue-700 mb-1">Book Your Appointment</h1>
          <p className="text-gray-500 mb-6">Fill in your details to confirm</p>

          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <p className="text-blue-800 font-semibold text-lg">{formatDate(slot.slot_date)}</p>
            <p className="text-blue-600 text-lg">{formatTime(slot.slot_time)}</p>
          </div>

          <form action={bookSlot}>
            <input type="hidden" name="slotId" value={slot.id} />

            <div className="mb-5">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="name">Your Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="e.g. Ahmed Mohamed"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="e.g. 01012345678"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Confirm Booking
            </button>
          </form>

          <p className="text-center text-gray-500 mt-4 text-sm">Payment: 100 EGP cash at the clinic</p>
        </div>
      </div>
    </main>
  );
}
