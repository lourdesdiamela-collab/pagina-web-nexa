import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xwmwndjywojzrsjlsvey.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_k8nxCWMtqu2wB9BQawvxbw_2uq2JyV6';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Removed better-sqlite3 getDb and initializeDatabase as we are now fully on Supabase Postgres in the cloud.
