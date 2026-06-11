import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import SlotBookingForm from './SlotBookingForm';

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
      <h1 className="text-2xl font-bold mb-1">Book Your Appointment</h1>
      <p className="text-gray-500 mb-6">Fill in your details to confirm the slot below.</p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-blue-500 font-medium uppercase tracking-wide mb-1">Selected Slot</p>
        <p className="text-lg font-bold text-blue-800">{formatDate(slot.slot_date)}</p>
        <p className="text-lg font-semibold text-blue-700">{formatTime(slot.slot_time)}</p>
      </div>

      <SlotBookingForm slotId={slot.id} />
    </main>
  );
}
