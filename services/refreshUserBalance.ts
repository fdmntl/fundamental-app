import { supabase } from '~/supabaseConfig';
import { SubscriptionData } from '~/types/supabaseTypes';

// The database's Users table contains up-to-date and refreshing token balances. These balances should also be refreshable by the app, should a user have just made a trade or received a payment

// export const refreshUserBalances = async () => 