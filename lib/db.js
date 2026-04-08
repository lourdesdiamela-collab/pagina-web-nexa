import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) throw new Error('Supabase env vars required');
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, { auth: { persistSession: false } })
  : supabase;

export function hasServiceRole() {
  return Boolean(supabaseServiceRoleKey);
}

export function isMissingTableError(error) {
  if (!error) return false;
  const message = String(error.message || '').toLowerCase();
  return message.includes('schema cache') || message.includes('could not find the table') || message.includes('relation') && message.includes('does not exist');
}
