export interface TimeSlot {
  id: string;
  slot_date: string;
  slot_time: string;
  is_available: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  slot_id: string;
  patient_name: string;
  patient_phone: string;
  created_at: string;
}
