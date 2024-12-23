import { useState, useEffect } from 'react';

import { supabase } from '~/supabaseConfig';
import { SubscriptionData } from '~/types/supabaseTypes';

interface SupabaseSubscriptionProps {
  table: string;
  callback?: (data: SubscriptionData) => void;
}

export const useSupabaseSubscription = ({ table, callback }: SupabaseSubscriptionProps) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDataAndSubscribe = async () => {
      try {
        // Fetch initial data
        const { data: initialData, error } = await supabase.from(table).select('*'); // Adjust the query if needed
        if (error) {
          console.error('Error fetching initial data:', error);
          return;
        }
        console.log('initialData: ', initialData);

        setData(initialData || []);

        // Set up the subscription
        const channel = supabase
          .channel(`table:${table}`)
          .on('postgres_changes', { event: '*', schema: 'public', table }, (payload) => {
            const { new: newData, old: oldData, eventType } = payload;

            setData((prevData) => {
              if (eventType === 'INSERT') {
                return [...prevData, newData];
              }
              if (eventType === 'UPDATE') {
                return prevData.map((row) => (row.address === newData.address ? newData : row));
              }
              if (eventType === 'DELETE') {
                return prevData.filter((row) => row.address !== oldData.address);
              }
              return prevData;
            });

            if (callback) callback(payload);
          })
          .subscribe();

        // Cleanup on unmount
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (err) {
        console.error('Unexpected error in subscription setup:', err);
      }
    };

    fetchDataAndSubscribe();
  }, [table, callback]);

  return data;
};
