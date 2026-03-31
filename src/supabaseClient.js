import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oeyqgoggimhbfkitlhou.supabase.co'

const supabaseAnonKey = 'sb_publishable_po3gmyy2bOYsx4VU2CT3lg_wS3zCkIA' 

export const supabase = createClient(supabaseUrl, supabaseAnonKey)