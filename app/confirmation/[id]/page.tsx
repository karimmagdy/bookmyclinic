import { notFound } from 'next/navigation';
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

export default async function ConfirmationPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from('bookings')
    .select('id, patient_name, patient_phone, created_at, time_slots(slot_date, slot_time)')
    .eq('id', params.id)
    .single();

  if (!booking) notFound();

  const slot = booking.time_slots as { slot_date: string; slot_time: string } | null;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-700 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500 mb-6">See you at the clinic</p>

          <div className="bg-green-50 rounded-xl p-5 mb-6 text-left">
            <p className="text-gray-600 text-sm mb-1">Patient</p>
            <p className="font-semibold text-gray-900 text-lg mb-3">{booking.patient_name}</p>
            {slot && (
              <>
                <p className="text-gray-600 text-sm mb-1">Date</p>
                <p className="font-semibold text-gray-900 mb-3">{formatDate(slot.slot_date)}</p>
                <p className="text-gray-600 text-sm mb-1">Time</p>
                <p className="font-semibold text-gray-900">{formatTime(slot.slot_time)}</p>
              </>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-amber-800 font-semibold">💵 Payment</p>
            <p className="text-amber-700 mt-1">Please bring <strong>100 EGP cash</strong> to pay at the clinic.</p>
          </div>

          <Link href="/" className="text-blue-600 underline text-sm">Back to home</Link>
        </div>
      </div>
    </main>
  );
}
