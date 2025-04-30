//This is the doc to create supabase, here is the reference: https://supabase.com/docs
import { createClient } from "@supabase/supabase-js";

//using ENV to get the URL and key
const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

//throw error if we don't have any
if (!supabaseURL || !supabaseAnonKey) {
    throw new Error("Missing Supabase credentials");
}

//create a client and export it
const supabase = createClient(supabaseURL, supabaseAnonKey);

export default supabase;