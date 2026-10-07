import { createClient } from '@supabase/supabase-js';
import { env } from './env';

// Client standard pour les opérations anonymes / liées à l'utilisateur authentifié
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

// Client administrateur (Service Role) pour contourner la RLS si nécessaire dans la logique backend interne
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
