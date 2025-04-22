import { createClient } from "@supabase/supabase-js";

const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseURL || !supabaseAnonKey) {
    throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseURL, supabaseAnonKey);

export default supabase;