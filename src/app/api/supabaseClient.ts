import { createClient } from "@supabase/supabase-js";

//using ENV to get the URL and key
const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

//throw error if we don't have any
if (!supabaseURL || !supabaseAnonKey) {
    throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseURL, supabaseAnonKey);

export default supabase;