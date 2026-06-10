'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function bookSlot(
  slotId: string,
  data: { name: string; phone: string }
) {
  const supabase = await createClient();

  // Check slot is still available
  const { data: slot, error: slotError } = await supabase
    .from('time_slots')
    .select('*')
    .eq('id', slotId)
    .single();

  if (slotError || !slot) {
    return { error: 'الموعد غير موجود.' };
  }

  if (!slot.is_available) {
    return { error: 'لقد تم حجز هذا الموعد مسبقاً. اختر موعداً آخر.' };
  }

  // Check slot is not in the past
  const today = new Date().toISOString().split('T')[0];
  if (slot.slot_date < today) {
    return { error: 'لا يمكن حجز موعد في الماضي.' };
  }

  // Create the booking
  const { data: booking, error: insertError } = await supabase
    .from('bookings')
    .insert({
      slot_id: slotId,
      patient_name: data.name,
      patient_phone: data.phone,
    })
    .select()
    .single();

  if (insertError || !booking) {
    console.error('Insert error:', insertError?.message);
    return { error: 'حدث خطأ أثناء الحجز. حاول مرة أخرى.' };
  }

  // Mark slot as unavailable
  const { error: updateError } = await supabase
    .from('time_slots')
    .update({ is_available: false })
    .eq('id', slotId);

  if (updateError) {
    console.error('Update error:', updateError.message);
    // Booking was created but slot wasn't marked — it's okay, we'll show it as booked
  }

  redirect(`/confirmation/${booking.id}`);
}
