import { usePrivy } from '@privy-io/expo';
import React from 'react';

import { Button } from './Button';
import { useAppData } from './Wrappers/AppData';
import { refreshUserBalances } from '~/services/refreshUserBalance';
import { InsertSupabaseData } from '~/services/Supabase/insertData';
import { supabase } from '~/supabaseConfig';

import { slice } from 'viem';

export const DebugButton = () => {
  async function AddUser(user: any, wallet: any) {
    const user_id = user.id;
    // Check if user already exists in Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user_id)
      .single();
    console.log(user_id);

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
      ens: '', // might wanna add this later
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
  const { user } = useAppData();
  const { updateUser } = useAppData();
  const { privy } = useAppData();
  const { user: address } = useAppData();
  const { user: privyUser } = usePrivy();
  const { getAccessToken } = usePrivy();
  const { tokens } = useAppData();
  const debug = async () => {
    await refreshUserBalances(user, updateUser);
    console.log('\n---------------------Trying to add user to DB --------------------');
    await AddUser(privy.user, privy.wallet);
    console.log('\n---------------------App data---------------------');
    console.log('User:', user);
    console.log('\nPrivy:', privy);
    console.log('\n---------------------Privy data---------------------');
    console.log('Privy User:', privyUser);
    const accessToken = await getAccessToken();
    console.log('\nPrivy Access Token:', accessToken);
    console.log('\n---------------------Tokens---------------------');
    tokens.forEach((token) => {
      const { name, address, symbol, digits, description, is_stablecoin } = token;
      console.log({
        name,
        address,
        symbol,
        digits,
        description,
        is_stablecoin,
      });
    });
  };

  return <Button onPress={debug} className="bg-primary" title="Debug" />;
};
