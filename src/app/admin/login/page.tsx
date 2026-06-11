import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminLoginForm from './AdminLoginForm';

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    if (profile?.is_admin) redirect('/admin/dashboard');
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-2">Admin Login</h1>
        <p className="text-center text-gray-500 text-sm mb-8">BookMyClinic staff only</p>
        <AdminLoginForm />
      </div>
    </main>
  );
}
