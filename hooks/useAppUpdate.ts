import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Application from 'expo-application';
import Constants from 'expo-constants';

import { supabase } from '~/supabaseConfig';

export interface AppUpdateInfo {
  versionName: string;
  updateUrl: string;
  currentVersionName: string;
}

interface AppUpdateState {
  updateInfo: AppUpdateInfo | null;
  loading: boolean;
  error: string | null;
}

export const useAppUpdate = (): AppUpdateState => {
  const [updateInfo, setUpdateInfo] = useState<AppUpdateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        setLoading(true);
        const currentBuildNumberStr = Application.nativeBuildVersion;
        if (!currentBuildNumberStr) {
          setError('Could not determine app build number.');
          setLoading(false);
          return;
        }

        const currentBuildNumber = parseInt(currentBuildNumberStr, 10);
        const currentVersionName = Constants.expoConfig?.version || 'Unknown';
        const platform = Platform.OS;

        console.log(
          `[AppUpdate] Current build number: ${currentBuildNumber} on platform: ${platform}`
        );
        console.log(`[AppUpdate] Current version name: ${currentVersionName}`);

        const { data, error: dbError } = await supabase
          .from('version_control')
          .select('build_number, build_name, url')
          .eq('platform', platform)
          .single();

        if (dbError) {
          throw new Error(dbError.message);
        }

        if (data) {
          const latestBuildNumber = data.build_number;
          console.log(`[AppUpdate] Latest build number from DB: ${latestBuildNumber}`);
          if (currentBuildNumber < latestBuildNumber) {
            console.log('[AppUpdate] Update available.');
            setUpdateInfo({
              versionName: data.build_name,
              updateUrl: data.url,
              currentVersionName: currentVersionName,
            });
          } else {
            console.log('[AppUpdate] No update necessary.');
          }
        } else {
          console.log('[AppUpdate] No version information found in DB for this platform.');
        }
      } catch (e: any) {
        setError(e.message || 'An unexpected error occurred.');
        console.error('Failed to check for app update:', e);
      } finally {
        setLoading(false);
      }
    };

    checkVersion();
  }, []);

  return { updateInfo, loading, error };
};
