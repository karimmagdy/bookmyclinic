import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminLoginForm from './AdminLoginForm';

export default async function AdminLoginPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    redirect('/admin/dashboard');
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-blue-700 mb-1">Admin Login</h1>
        <p className="text-gray-500 mb-6 text-sm">BookMyClinic dashboard</p>
        <AdminLoginForm />
      </div>
    </main>
  );
}
