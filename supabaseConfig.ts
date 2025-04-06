// import { createClient } from '@supabase/supabase-js';

// const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
// const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY;

// if (!SUPABASE_URL) {
//   throw new Error('Missing env.SUPABASE_URL');
// }

// if (!SUPABASE_KEY) {
//   throw new Error('Missing env.SUPABASE_KEY');
// }

// export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Access values via Constants.expoConfig.extra
const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl;
const SUPABASE_KEY = Constants.expoConfig?.extra?.supabaseKey;

if (!SUPABASE_URL) {
  throw new Error('Missing Supabase URL in app configuration');
}

if (!SUPABASE_KEY) {
  throw new Error('Missing Supabase Key in app configuration');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
