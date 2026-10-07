import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase URL ou Anon Key manquants dans les variables d\'environnement. ' +
    'Veuillez configurer votre fichier .env.local'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
