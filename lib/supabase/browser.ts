import { createBrowserClient } from '@supabase/ssr';

const SCHEMA = process.env.NEXT_PUBLIC_SUPABASE_SCHEMA ?? 'public';

let client: ReturnType<typeof createBrowserClient> | null = null;

export function getBrowserClient() {
  if (!client) {
    client = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            'Accept-Profile': SCHEMA,
            'Content-Profile': SCHEMA
          }
        }
      }
    );
  }
  return client;
}
