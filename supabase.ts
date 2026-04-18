import { createClient } from '@supabase/supabase-js';

// Support both prefixed and non-prefixed environment variables for user convenience
const rawUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.SUPABASE_ANON_KEY;

const formatUrl = (url: string | undefined): string | null => {
  if (!url) return null;
  let formatted = url.trim();
  
  // If the user only provided the project ID (e.g., "gcynvkgtlodljbshfrdz")
  if (!formatted.includes('.') && !formatted.includes(':')) {
    formatted = `https://${formatted}.supabase.co`;
  }
  
  // If the user provided the URL without the domain part
  if (formatted.startsWith('https://') && !formatted.includes('.supabase.co')) {
    formatted = `${formatted}.supabase.co`;
  }

  try {
    const parsed = new URL(formatted);
    return (parsed.protocol === 'http:' || parsed.protocol === 'https:') ? parsed.toString() : null;
  } catch {
    return null;
  }
};

const supabaseUrl = formatUrl(rawUrl) || 'https://placeholder.supabase.co';
const supabaseAnonKey = (rawKey || 'placeholder-key').trim();

const isConfigured = !!formatUrl(rawUrl) && !!rawKey && rawKey.trim() !== '';

if (!isConfigured) {
  console.warn('Supabase is not properly configured. Please check your Supabase URL and Anon Key.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export { isConfigured };
