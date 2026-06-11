'use server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function bookSlot(formData: FormData) {
  const slotId = formData.get('slotId') as string;
  const name = (formData.get('name') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim();

  if (!slotId || !name || !phone) redirect('/?error=missing');

  const supabase = await createClient();

  const { data: slot } = await supabase
    .from('time_slots')
    .select('id, is_available')
    .eq('id', slotId)
    .single();

  if (!slot || !slot.is_available) redirect('/?error=unavailable');

  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({ slot_id: slotId, patient_name: name, patient_phone: phone })
    .select('id')
    .single();

  if (error || !booking) redirect('/?error=failed');

  await supabase
    .from('time_slots')
    .update({ is_available: false })
    .eq('id', slotId);

  redirect(`/booked/${booking.id}`);
}
