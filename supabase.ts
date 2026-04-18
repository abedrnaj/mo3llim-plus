import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

const isConfigured = !!rawUrl && !!rawKey && isValidUrl(rawUrl);

// Use a guaranteed valid URL for the client initialization to prevent crash
// even if the user provided an invalid string in the environment variables.
const supabaseUrl = isConfigured ? rawUrl : 'https://placeholder.supabase.co';
const supabaseAnonKey = isConfigured ? rawKey : 'placeholder-key';

if (!isConfigured) {
  console.warn('Supabase is not properly configured. Please check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export { isConfigured };
