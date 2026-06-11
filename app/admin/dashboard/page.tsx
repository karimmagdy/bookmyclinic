import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import AdminBookingsTable from './AdminBookingsTable';
import { logout } from '../login/actions';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login');
  }

  const adminClient = createAdminClient();
  const { data: bookings } = await adminClient
    .from('bookings')
    .select('id, patient_name, patient_phone, created_at, time_slots(slot_date, slot_time)')
    .order('created_at', { ascending: false });

  const rows = (bookings ?? []).map(b => ({
    id: b.id,
    patient_name: b.patient_name,
    patient_phone: b.patient_phone,
    created_at: b.created_at,
    slot: b.time_slots as { slot_date: string; slot_time: string } | null
  }));

  return <AdminBookingsTable bookings={rows} logoutAction={logout} />;
}
