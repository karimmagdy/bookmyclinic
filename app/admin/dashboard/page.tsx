import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import AdminBookingsTable from './AdminBookingsTable';
import { logout } from '../login/actions';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) redirect('/admin/login');

  const adminClient = createAdminClient();
  const { data: bookings } = await adminClient
    .from('bookings')
    .select('id, patient_name, patient_phone, created_at, slot:time_slots!inner(slot_date, slot_time)')
    .order('created_at', { ascending: false });

  const rows = (bookings ?? []).map(b => {
    const slot = Array.isArray(b.slot) ? b.slot[0] : b.slot;
    return {
      id: b.id as string,
      patient_name: b.patient_name as string,
      patient_phone: b.patient_phone as string,
      created_at: b.created_at as string,
      slot_date: (slot as { slot_date: string; slot_time: string }).slot_date,
      slot_time: (slot as { slot_date: string; slot_time: string }).slot_time
    };
  }).sort((a, b) => a.slot_date.localeCompare(b.slot_date) || a.slot_time.localeCompare(b.slot_time));

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Bookings Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Total: {rows.length} {rows.length === 1 ? 'booking' : 'bookings'}</p>
        </div>
        <form action={logout}>
          <button type="submit" className="text-sm text-gray-500 hover:text-red-600 border border-gray-300 rounded-lg px-4 py-2 hover:border-red-300 transition-colors">
            Sign Out
          </button>
        </form>
      </div>

      <AdminBookingsTable bookings={rows} />
    </main>
  );
}
