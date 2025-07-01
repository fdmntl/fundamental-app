import { useEffect, useRef } from 'react';
import { refreshUserBalances } from '~/services/refreshUserBalance';
import { useAppData } from '~/components/Wrappers/AppData';

interface DelayedBalanceRefresherProps {
  delay?: number; // Optional delay in ms, defaults to 3000
}

export const DelayedBalanceRefresher: React.FC<DelayedBalanceRefresherProps> = ({
  delay = 3000,
}) => {
  const { user, updateUser } = useAppData();
  const hasInitiatedRefresh = useRef(false);

  useEffect(() => {
    if (!hasInitiatedRefresh.current && user && updateUser) {
      hasInitiatedRefresh.current = true;

      const timerId = setTimeout(async () => {
        try {
          await refreshUserBalances(user, updateUser);
        } catch (refreshError) {
          console.log('Error refreshing balances after delay:', refreshError);
        }
      }, delay);
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [user, updateUser, delay]);
  return null;
};
