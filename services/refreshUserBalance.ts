import { useState } from "react";
import { supabase } from "~/supabaseConfig";
import { useSupabaseUser } from "./Supabase/useSupabaseUser";
import { useAppData } from "../components/Wrappers/AppData";
import { Privy } from '~/types/privy';
import { Token, User } from '~/types/supabaseTypes';



const fetchUserBalancesFromSupabase = async (walletAddress: string) => {
  // The database's Users table contains up-to-date and refreshing token balances. These balances should also be refreshable by the app, should a user have just made a trade or received a payment
    const { data, error } = await supabase
      .from('users')
      .select('balances') // Select only the balances column
      .eq('wallet_address', walletAddress) // Filter by user ID
      .single(); // Ensures only one result is returned

    if (error) {
      console.error('Error fetching balance:', error.message);
      return null;
    }
    return data?.balances || [];
  };

export const refreshUserBalances = async (user: User, updateUser: (updates: Partial<User>) => void) => {
  try {
      console.log('Fetching user data for address:', user.wallet_address);
      if (!user || !user.wallet_address) {
        console.error("❌ No valid user address found.");
        return;
      }
      // Simulate fetching new balance data from an API
      const newBalances = await fetchUserBalancesFromSupabase(user.wallet_address);
      // Check if the balances array is empty (indicating no balances found)
      if (!newBalances || newBalances.length === 0) {
        console.error("❌ No balances found for user:", user.wallet_address);
        return;
      }
      console.log("✅ New balances fetched:", newBalances);
      // Update the user state with the new balance
      updateUser({ balances: newBalances });
  } catch (error) {
      console.error("❌ Error in refreshUserBalances:", error);
  }
};
