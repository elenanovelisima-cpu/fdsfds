import { createClient } from '@supabase/supabase-js';

// Supabase project credentials provided by the user
export const SUPABASE_URL = 'https://hzuzuyyuxmfcabcemprx.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_W-Of3_CR5DGFC6rv2naisw_b1gDxPD5';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const checkSupabaseConnection = async (): Promise<{ ok: boolean; message: string; pingMs?: number }> => {
  const start = performance.now();
  try {
    const { data, error } = await supabase.auth.getSession();
    const pingMs = Math.round(performance.now() - start);
    if (error) {
      return { ok: false, message: error.message, pingMs };
    }
    return { ok: true, message: 'Conectado a Supabase correctamente (REST v1 / Auth)', pingMs };
  } catch (err: unknown) {
    const pingMs = Math.round(performance.now() - start);
    return { ok: false, message: err instanceof Error ? err.message : 'Error desconocido de conexión', pingMs };
  }
};
