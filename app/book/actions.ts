'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function bookSlot(
  slotId: string,
  formData: FormData
): Promise<{ error: string }> {
  const name = (formData.get('name') as string | null)?.trim() ?? ''
  const phone = (formData.get('phone') as string | null)?.trim() ?? ''

  if (!name) return { error: 'Please enter your full name.' }
  if (!phone) return { error: 'Please enter your phone number.' }

  const supabase = await createClient()

  // Check slot is still available
  const { data: slot, error: slotError } = await supabase
    .from('time_slots')
    .select('id, is_available')
    .eq('id', slotId)
    .single()

  if (slotError || !slot) return { error: 'This slot could not be found. Please go back and choose another.' }
  if (!slot.is_available) return { error: 'Sorry, this slot was just booked. Please go back and choose another time.' }

  // Insert booking
  const { data: booking, error: insertError } = await supabase
    .from('bookings')
    .insert({ slot_id: slotId, patient_name: name, patient_phone: phone })
    .select('id')
    .single()

  if (insertError || !booking) return { error: 'Could not save your booking. Please try again.' }

  // Mark slot unavailable
  await supabase
    .from('time_slots')
    .update({ is_available: false })
    .eq('id', slotId)

  redirect(`/confirmation/${booking.id}`)
}
