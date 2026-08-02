import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://axjnwfcjsfuzsrvuokla.supabase.co";
const supabasePublishableKey = "sb_publishable_7AHEC9OjGEBAYWCaSnXjiw_U2cephqS";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
  },
});
