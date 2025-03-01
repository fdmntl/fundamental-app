import { slice } from 'viem';
import { supabase } from '~/supabaseConfig';
import { InsertSupabaseData } from './Supabase/insertData';

export async function AddUser(user: any, wallet: any) {
  const user_id = slice(user.id, 10, user.id.length);
  console.log('Adding user to Supabase:', user_id);
  console.log(wallet.account.address);
  // Check if user already exists in Supabase
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('id')
    .eq('wallet_address', wallet.account.address)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('❌ Supabase fetch error:', fetchError);
    return;
  }
  if (existingUser) {
    console.log('User already exists in Supabase, skipping creation');
    return;
  }
  const data = {
    id: user_id,
    created_at: new Date(),
    ens: null,
    balances: [],
    wallet_address: wallet.account.address,
    total_value_historic: [],
  };
  try {
    const insertedUsers = await InsertSupabaseData({
      tableName: 'users',
      data: [data],
      upsert: false,
    });
    console.log('✅ User added:', insertedUsers);
  } catch (error: any) {
    console.error('❌ Failed to add user:', error);
  }
}
