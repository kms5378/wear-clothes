import { createClient } from "@supabase/supabase-js";

type SupabaseConfigInput = {
  url?: string;
  anonKey?: string;
  serviceRoleKey?: string;
};

export function getSupabaseConfigStatus(input: SupabaseConfigInput = {}) {
  const url = input.url ?? process.env.SUPABASE_URL;
  const anonKey = input.anonKey ?? process.env.SUPABASE_ANON_KEY;
  const serviceRoleKey = input.serviceRoleKey ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasUrl = Boolean(url && url !== "undefined");
  const hasAnonKey = Boolean(anonKey && anonKey !== "undefined");
  const hasServiceRoleKey = Boolean(serviceRoleKey && serviceRoleKey !== "undefined");

  return {
    hasUrl,
    hasAnonKey,
    hasServiceRoleKey,
    isClientReady: hasUrl && hasAnonKey,
    isServerReady: hasUrl && hasServiceRoleKey
  };
}

export function createBrowserSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required");
  }

  return createClient(url, anonKey);
}

export function createServiceSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
