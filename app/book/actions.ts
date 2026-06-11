'use server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function bookSlot(formData: FormData): Promise<never> {
  const slotId = (formData.get('slotId') as string | null)?.trim() ?? ''
  const name   = (formData.get('name')   as string | null)?.trim() ?? ''
  const phone  = (formData.get('phone')  as string | null)?.trim() ?? ''

  if (!slotId) redirect('/?error=missing_slot')
  if (!name)   redirect(`/book/${slotId}?error=missing_name`)
  if (!phone)  redirect(`/book/${slotId}?error=missing_phone`)

  const supabase = await createClient()

  // Re-check availability
  const { data: slot, error: slotError } = await supabase
    .from('time_slots')
    .select('id, is_available')
    .eq('id', slotId)
    .single()

  if (slotError || !slot) redirect(`/book/${slotId}?error=not_found`)
  if (!slot.is_available)  redirect(`/book/${slotId}?error=taken`)

  // Insert booking
  const { data: booking, error: insertError } = await supabase
    .from('bookings')
    .insert({ slot_id: slotId, patient_name: name, patient_phone: phone })
    .select('id')
    .single()

  if (insertError || !booking) redirect(`/book/${slotId}?error=db_error`)

  // Mark slot unavailable
  await supabase
    .from('time_slots')
    .update({ is_available: false })
    .eq('id', slotId)

  redirect(`/confirmation/${booking.id}`)
}
