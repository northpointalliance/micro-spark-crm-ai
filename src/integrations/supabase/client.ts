import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Try multiple sources so the app never hard-crashes if envs are missing
// 1) Lovable runtime injection (if available)
// 2) Vite env variables (if present)
// 3) Safe fallback client to avoid blank screen while showing a clear warning
const runtime: any = (globalThis as any).__LOVABLE__ || (window as any).__LOVABLE__;
const injectedUrl: string | undefined = runtime?.supabaseUrl;
const injectedAnonKey: string | undefined = runtime?.supabaseAnonKey;
const injectedClient: SupabaseClient | undefined = runtime?.supabase;

const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const supabaseUrl = injectedUrl || envUrl;
const supabaseAnonKey = injectedAnonKey || envAnonKey;

let client: SupabaseClient;

if (injectedClient) {
  client = injectedClient;
} else if (supabaseUrl && supabaseAnonKey) {
  client = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('[MicroCRM] Supabase not configured. UI will load, but data features are disabled. Connect Supabase in the top-right (green button).');
  // Create a harmless dummy client pointing to an invalid endpoint to avoid crashes
  client = createClient('https://invalid.supabase.co', 'public-anon-key');
}

export const supabase = client;