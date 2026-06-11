import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
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

export default async function BookedPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, patient_name, patient_phone, created_at, slot:time_slots!inner(slot_date, slot_time)')
    .eq('id', params.id)
    .single();

  if (!booking) notFound();

  const slot = Array.isArray(booking.slot) ? booking.slot[0] : booking.slot;
  const s = slot as { slot_date: string; slot_time: string };

  return (
    <main className="max-w-md mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">✅</div>
        <h1 className="text-2xl font-bold text-green-700">Booking Confirmed!</h1>
        <p className="text-gray-500 mt-1">See you at the clinic.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Patient Name</p>
          <p className="text-lg font-semibold">{booking.patient_name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Date</p>
          <p className="text-lg font-semibold">{formatDate(s.slot_date)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Time</p>
          <p className="text-lg font-semibold">{formatTime(s.slot_time)}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-sm font-semibold text-yellow-800">💵 Payment: 100 EGP cash at the clinic</p>
          <p className="text-xs text-yellow-700 mt-1">No online payment needed — pay when you arrive.</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-blue-600 hover:underline text-sm">← Back to all slots</Link>
      </div>
    </main>
  );
}
