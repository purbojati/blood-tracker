import { createClient } from '@supabase/supabase-js'

// Replace with your actual Supabase credentials
const supabaseUrl = 'your-supabase-url'
const supabaseKey = 'your-supabase-key'

export const supabase = createClient(supabaseUrl, supabaseKey)