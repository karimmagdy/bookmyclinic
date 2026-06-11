import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

function fmt(date: string) {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
function fmtTime(t: string) {
  const [h, m] = t.split(':');
  const hr = parseInt(h);
  return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
}

export default async function ConfirmationPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, patient_name, patient_phone, created_at, time_slots!inner(slot_date, slot_time)')
    .eq('id', params.id)
    .single();

  if (!booking) notFound();

  const slot = booking.time_slots as unknown as { slot_date: string; slot_time: string };

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-green-700 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 mb-6">See you at the clinic, {booking.patient_name}.</p>

        <div className="bg-green-50 rounded-xl p-5 mb-6 text-left">
          <div className="mb-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
            <p className="text-gray-800 font-semibold">{fmt(slot.slot_date)}</p>
          </div>
          <div className="mb-3">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Time</p>
            <p className="text-gray-800 font-semibold">{fmtTime(slot.slot_time)} · 60 minutes</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
            <p className="text-gray-800 font-semibold">{booking.patient_phone}</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <p className="text-yellow-800 font-semibold">💵 Payment: 100 EGP cash at the clinic</p>
          <p className="text-yellow-700 text-sm mt-1">No online payment needed. Pay when you arrive.</p>
        </div>

        <Link href="/" className="text-blue-600 text-sm hover:underline">← Back to home</Link>
      </div>
    </main>
  );
}
