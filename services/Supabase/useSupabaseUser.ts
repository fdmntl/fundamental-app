import { useState, useEffect } from 'react';

import { supabase } from '~/supabaseConfig';

interface SupabaseUserProps {
  address: string;
}

export const useSupabaseUser = ({ address }: SupabaseUserProps) => {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    if (!address || address === '') {
      setUser(null);
      return;
    }

    const fetchUserAndSubscribe = async () => {
      try {
        console.log('Fetching user data for address:', address);
        const { data: initialData, error } = await supabase
          .from('users')
          .select('*')
          .eq('wallet_address', address)
          .single();

        if (error) {
          console.error('Error fetching user data:', error);
          return;
        }

        setUser(initialData);

        const channel = supabase
          .channel(`user:${address}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'users',
              filter: `wallet_address=eq.${address}`,
            },
            (payload) => {
              const { new: newData, old: oldData, eventType } = payload;

              if (eventType === 'INSERT' || eventType === 'UPDATE') {
                setUser(newData);
              }

              if (eventType === 'DELETE') {
                setUser(null);
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (err) {
        console.error('Unexpected error in subscription setup:', err);
      }
    };

    fetchUserAndSubscribe();
  }, [address]);

  return user;
};
