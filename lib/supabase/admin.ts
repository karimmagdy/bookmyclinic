import { createClient } from '@supabase/supabase-js';

const SCHEMA = process.env.SUPABASE_SCHEMA ?? 'public';

export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { persistSession: false },
      global: {
        headers: {
          'Accept-Profile': SCHEMA,
          'Content-Profile': SCHEMA
        }
      }
    }
  );
}
