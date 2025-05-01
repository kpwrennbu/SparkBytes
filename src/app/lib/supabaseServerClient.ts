import { createClient } from '@supabase/supabase-js';
//using ENV to get the URL and key
// const supabaseURL = process.env.SUPABASE_URL;
// const supabaseRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// These are *server-only* environment variables
// if (!supabaseURL || !supabaseRoleKey) {
//     throw new Error("Missing Supabase credentials " + supabaseURL + " : " + supabaseRoleKey);
// }

const supabase = createClient("https://ztuoczhbsqzkjvnoucia.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0dW9jemhic3F6a2p2bm91Y2lhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mjg1NDQ4OCwiZXhwIjoyMDU4NDMwNDg4fQ.PTrzP2fuzrJNZ1_OVAipRblJC6tXQvTSrf74MVYZn00");

export default supabase;