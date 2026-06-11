import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import AdminBookingsTable from './AdminBookingsTable';
import { logout } from '../login/actions';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');

  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin) redirect('/admin/login');

  const admin = createAdminClient();
  const { data: bookings } = await admin
    .from('bookings')
    .select('id, patient_name, patient_phone, created_at, time_slots!inner(slot_date, slot_time)')
    .order('created_at', { ascending: false });

  type Booking = {
    id: string;
    patient_name: string;
    patient_phone: string;
    created_at: string;
    time_slots: { slot_date: string; slot_time: string };
  };

  const rows: Booking[] = (bookings ?? []).map((b: unknown) => b as Booking);
  rows.sort((a, b) => a.time_slots.slot_date.localeCompare(b.time_slots.slot_date));

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm">BookMyClinic — all bookings</p>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm text-gray-500 hover:text-red-600 transition">Sign out</button>
        </form>
      </div>
      <AdminBookingsTable bookings={rows} />
    </main>
  );
}
