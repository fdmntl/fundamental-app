import { useEffect } from 'react';
import { refreshUserBalances } from '~/services/refreshUserBalance';
import { useAppData } from '~/components/Wrappers/AppData';

interface DelayedBalanceRefresherProps {
  delay?: number; // Optional delay in ms, defaults to 5000
}

export const DelayedBalanceRefresher: React.FC<DelayedBalanceRefresherProps> = ({
  delay = 5000,
}) => {
  const { user, updateUser } = useAppData();

  useEffect(() => {
    if (user && updateUser) {
      console.log(
        `DelayedBalanceRefresher mounted/triggered. Waiting ${delay / 1000} seconds before refreshing...`
      );
      const timerId = setTimeout(async () => {
        try {
          await refreshUserBalances(user, updateUser);
          console.log(`User balances refreshed after ${delay / 1000}s delay.`);
        } catch (refreshError) {
          console.error('Error refreshing balances after delay:', refreshError);
        }
      }, delay);
      // Cleanup function to clear the timeout if the component unmounts before the timeout finishes
      // (e.g., if the key changes again rapidly).
      return () => clearTimeout(timerId);
    } else {
      console.warn(
        'User or updateUser from AppData not available in DelayedBalanceRefresher when triggered.'
      );
    }
  }, [user, updateUser, delay]);
  return null;
};
