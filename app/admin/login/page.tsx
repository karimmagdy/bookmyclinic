import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminLoginForm from './AdminLoginForm';

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
    if (profile?.is_admin) redirect('/admin/dashboard');
  }
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-blue-700 mb-1 text-center">Admin Login</h1>
        <p className="text-gray-500 text-sm text-center mb-6">BookMyClinic</p>
        <AdminLoginForm />
      </div>
    </main>
  );
}
