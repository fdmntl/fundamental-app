import { supabase } from '~/supabaseConfig';

interface InsertDataProps<T> {
  data: T[];
  tableName: string;
}

export async function updateSupabaseData({ tableName, data }: InsertDataProps<any>) {
  if (!tableName || typeof tableName !== 'string') {
    throw new Error('Table name must be a valid string');
  }
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Data must be a non-empty array of objects');
  }

  const user_id = data[0]?.id;
  if (!user_id) {
    throw new Error('user_id is missing from data object');
  }
  console.log('Updating data:', data);

  try {
    const {
      data: updated_user,
      error: updateError,
      count,
    } = await supabase.from(tableName).update(data[0]).eq('id', user_id).select().single();

    if (updateError) {
      throw new Error(`Query failed: ${updateError.message}`);
    }
    if (!updated_user || count === 0) {
      throw new Error('No user found or update failed');
    }

    console.log('✅ Successfully updated data:', updated_user);
    return updated_user;
  } catch (err) {
    console.error('Error in updateSupabaseData:', err);
    throw err;
  }
}
