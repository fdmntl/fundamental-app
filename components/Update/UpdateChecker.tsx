import React, { useEffect, useState } from 'react';

import { UpdateModal } from './UpdateModal';
import { useAppUpdate } from '~/hooks/useAppUpdate';

export const UpdateChecker: React.FC = () => {
  const { updateInfo } = useAppUpdate();
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);

  useEffect(() => {
    if (updateInfo) {
      setUpdateModalVisible(true);
    }
  }, [updateInfo]);

  if (!updateInfo) return null;

  return (
    <UpdateModal
      visible={isUpdateModalVisible}
      versionName={updateInfo.versionName}
      updateUrl={updateInfo.updateUrl}
      currentVersionName={updateInfo.currentVersionName}
      currentBuildNumber={updateInfo.currentBuildNumber}
      latestBuildNumber={updateInfo.latestBuildNumber}
      onClose={() => setUpdateModalVisible(false)}
    />
  );
};
