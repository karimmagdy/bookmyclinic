'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function bookSlot(slotId: string, formData: FormData) {
  const name = formData.get('name') as string
  const phone = formData.get('phone') as string

  if (!name || !name.trim()) {
    return { error: 'من فضلك أدخل الاسم' }
  }
  if (!phone || !phone.trim()) {
    return { error: 'من فضلك أدخل رقم الهاتف' }
  }
  if (phone.trim().length < 10) {
    return { error: 'رقم الهاتف غير صحيح' }
  }

  const supabase = await createClient()

  // Check the slot is still available
  const { data: slot, error: slotError } = await supabase
    .from('time_slots')
    .select('*')
    .eq('id', slotId)
    .eq('is_available', true)
    .single()

  if (slotError || !slot) {
    return { error: 'عذراً، هذا الموعد لم يعد متاحاً. من فضلك اختر موعداً آخر.' }
  }

  // Check slot is not in the past
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const slotDate = new Date(slot.slot_date + 'T00:00:00')
  if (slotDate < today) {
    return { error: 'عذراً، هذا الموعد في الماضي. من فضلك اختر موعداً آخر.' }
  }

  // Insert the booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      slot_id: slotId,
      patient_name: name.trim(),
      patient_phone: phone.trim(),
    })
    .select('id')
    .single()

  if (bookingError || !booking) {
    return { error: 'عذراً، حدث خطأ أثناء الحجز. حاول مرة أخرى.' }
  }

  // Mark slot as unavailable
  const { error: updateError } = await supabase
    .from('time_slots')
    .update({ is_available: false })
    .eq('id', slotId)

  if (updateError) {
    // Non-critical: booking exists but slot wasn't marked. Still redirect.
    console.error('Failed to mark slot as unavailable:', updateError)
  }

  return { redirect: `/confirmation/${booking.id}` }
}
