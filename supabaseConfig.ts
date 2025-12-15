import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Access values via Constants.expoConfig.extra
let SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl;
let SUPABASE_KEY = Constants.expoConfig?.extra?.supabaseKey;



if (!SUPABASE_URL) {
  //try to get from env as fallback
  SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
  if (!SUPABASE_URL) {
    throw new Error('Missing Supabase URL in app configuration');
  }
}

if (!SUPABASE_KEY) {
  SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY;
  if (!SUPABASE_KEY) {
    throw new Error('Missing Supabase Key in app configuration');
  }
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
