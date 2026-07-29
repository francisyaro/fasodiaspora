import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Instance réelle du client Supabase utilisable côté client
export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

export const supabaseMock = {
  auth: {
    getSession: async () => {
      if (supabase) {
        return supabase.auth.getSession();
      }
      return { data: { session: null }, error: null };
    },
    signInWithPassword: async ({ email, password }: { email: string; password?: string }) => {
      if (supabase) {
        return supabase.auth.signInWithPassword({ email, password: password || '' });
      }
      // Validation simple de repli local
      if (email.endsWith('@fasodiaspora.com')) {
        return { data: { user: { email, id: 'admin-user-id' } }, error: null };
      }
      return { data: { user: null }, error: { message: 'Identifiants invalides (doit se terminer par @fasodiaspora.com)' } };
    },
    signOut: async () => {
      // Supprimer le cookie de session Next.js
      document.cookie = 'diaspora-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      if (supabase) {
        return supabase.auth.signOut();
      }
      return { error: null };
    },
  }
};
