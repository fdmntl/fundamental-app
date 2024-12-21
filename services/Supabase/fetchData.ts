import { supabase } from '~/supabaseConfig';
import { TokenList } from '~/types/supabaseTypes';

export const fetchData = async () => {
  const { data, error } = await supabase.from('token_list').select('*').returns<TokenList>();

  if (error) {
    throw error;
  }

  return data;
};
