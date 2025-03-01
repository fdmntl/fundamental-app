import { supabase } from '~/supabaseConfig';

interface InsertDataProps<T> {
  data: T[];
  tableName: string;
  upsert?: boolean;
}

export async function InsertSupabaseData({
  tableName,
  data,
  upsert = false,
}: InsertDataProps<any>) {
  if (!tableName || typeof tableName !== 'string') {
    throw new Error('Table name must be a valid string');
  }
  if (!Array.isArray(data)) {
    throw new Error('Data must be an array of objects');
  }
  if (data.length === 0) {
    throw new Error('Data array cannot be empty');
  }

  console.log('Inserting data:', data);
  const query = supabase.from(tableName).insert(data, { upsert });
  const { data: result, error } = await query;

  if (error) {
    throw new Error('query failed', error.message);
  }
  console.log('✅ Successfully inserted data');
  return result;
}

// export const insertData = async <T>({
//   data,
//   tableName,
//   upsert = false,
// }: InsertDataProps<T>): Promise<T[]> => {
//   if (!data.length) {
//     throw new Error('❌Data array cannot be empty.');
//   }

//   const query = supabase.from<T, any>(tableName);
//   const { data: insertedData, error } = upsert
//     ? await query.upsert(data).select()
//     : await query.insert(data).select();
//   if (error) {
//     console.error(`❌ Failed to insert data into ${tableName}:`, error.message);
//   } else {
//     console.log('✅ Successfully inserted data');
//   }

//   return insertedData ?? [];
// };
