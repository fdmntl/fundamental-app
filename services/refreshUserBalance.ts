import axios from 'axios';

import { supabase } from '~/supabaseConfig';
import { User } from '~/types/supabaseTypes';

const fetchUserBalancesFromSupabase = async (walletAddress: string) => {
  // The database's Users table contains up-to-date and refreshing token balances. These balances should also be refreshable by the app, should a user have just made a trade or received a payment
  // fetch the users balance from our server
  await axios
    .get(
      `https://fundamental-api.netlify.app/.netlify/functions/updateTokenBalances/${walletAddress}`
    )
    .catch((error) => {
      console.error('Error fetching balance:', error.message);
      throw error;
    });
  console.log('✅ DB has been updated with new balances');
  const { data, error } = await supabase
    .from('users')
    .select('balances')
    .eq('wallet_address', walletAddress)
    .single();
  if (error) {
    console.error('❌ Error fetching balances from Supabase:', error.message);
    throw error;
  }
  return data?.balances || [];
};

export const refreshUserBalances = async (
  user: User,
  updateUser: (updates: Partial<User>) => void
) => {
  try {
    console.log('🔄️ Fetching user data for address:', user.wallet_address);
    if (!user || !user.wallet_address) {
      console.error('No valid user address found.');
      return;
    }
    const newBalances = await fetchUserBalancesFromSupabase(user.wallet_address);
    if (!newBalances || newBalances.length === 0) {
      console.error('❌ No balances found for user:', user.wallet_address);
      return;
    }
    console.log('✅ New balances fetched:', newBalances);
    // Update the user state with the new balance
    updateUser({ balances: newBalances });
  } catch (error) {
    console.error('❌ Error in refreshUserBalances:', error);
  }
};
