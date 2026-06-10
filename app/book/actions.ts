'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function bookSlot(formData: FormData) {
  const supabase = await createClient()

  const slotId = formData.get('slotId') as string
  const name = (formData.get('name') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim()

  const fieldErrors: { name?: string; phone?: string } = {}

  if (!name || name.length < 2) {
    fieldErrors.name = 'Please enter your full name.'
  }
  if (!phone || phone.length < 5) {
    fieldErrors.phone = 'Please enter a valid phone number.'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { error: undefined, fieldErrors }
  }

  const { data: slot } = await supabase
    .from('time_slots')
    .select('is_available')
    .eq('id', slotId)
    .single()

  if (!slot || !slot.is_available) {
    return { error: 'Sorry, this slot is no longer available. Please pick another one.', fieldErrors: undefined }
  }

  const { data: booking, error: insertError } = await supabase
    .from('bookings')
    .insert({
      slot_id: slotId,
      patient_name: name,
      patient_phone: phone,
    })
    .select('id')
    .single()

  if (insertError || !booking) {
    console.error('Insert booking error:', insertError)
    return { error: 'Something went wrong. Please try again.', fieldErrors: undefined }
  }

  const { error: updateError } = await supabase
    .from('time_slots')
    .update({ is_available: false })
    .eq('id', slotId)

  if (updateError) {
    console.error('Update slot error:', updateError)
    // Booking was created but slot not marked — still show success but log
  }

  revalidatePath('/')
  redirect(`/confirmation/${booking.id}`)
}
