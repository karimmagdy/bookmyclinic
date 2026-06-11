export type TimeSlot = {
  id: string
  slot_date: string
  slot_time: string
  is_available: boolean
}

export type Booking = {
  id: string
  slot_id: string
  patient_name: string
  patient_phone: string
  created_at: string
}
