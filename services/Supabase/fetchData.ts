//* This is a test function, use it as an example to fetch data from Supabase
//* However, it is preferable to use the useSupabaseSubscription hook to update the data in real-time

import { supabase } from '~/supabaseConfig';
import { TokenList } from '~/types/supabaseTypes';

export const fetchData = async () => {
  const { data, error } = await supabase.from('token_list').select('*').returns<TokenList>();

  if (error) {
    throw error;
  }

  return data;
};
