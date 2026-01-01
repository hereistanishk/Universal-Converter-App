import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pprfusbvxmpbykgpatnx.supabase.co';
const supabaseAnonKey = 'sb_publishable_XZOdUW97AF-nCa0xEgFixg_bJwY_a0D';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);