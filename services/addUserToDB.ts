import { slice } from 'viem';

import { InsertSupabaseData } from './Supabase/insertData';

import { supabase } from '~/supabaseConfig';
import { PrivyUser } from '@privy-io/expo';

export async function addUserToDB(user: PrivyUser) {
  console.log('User: ', user);
  // This serves to get rid of the did:privy: prefix
  const user_id = user.id.slice(10);
  console.log('Checking user in Supabase:', user_id);
  const wallet = user.linked_accounts.find((account) => account.type === 'wallet');
  if (!wallet) {
    console.error('❌ No wallet found for user:', user);
    return;
  }
  // Check if user already exists in Supabase
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('id')
    .eq('wallet_address', wallet.address)
    .single();
  console.log('existingUser: ', existingUser);
  console.log('fetchError: ', fetchError);

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
    wallet_address: wallet.address,
    total_value_historic: [],
  };
  try {
    const insertedUsers = await InsertSupabaseData({
      tableName: 'users',
      data: [data],
    });
    console.log('✅ User added:', insertedUsers);
  } catch (error: any) {
    console.error('❌ Failed to add user:', error);
  }
}
