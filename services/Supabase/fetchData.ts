import { supabase } from '~/supabaseConfig';

export const fetchData = async () => {
  const { data, error } = await supabase.from('token_list').select('*');

  if (error) {
    throw error;
  }

  return data;
};
