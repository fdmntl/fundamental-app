import React, { useEffect, useState } from 'react';
import { useAppData } from '../Wrappers/AppData';

import { UpdateModal } from './UpdateModal';

export const UpdateChecker: React.FC = () => {
  const { updateInfo, setUpdateModalDismissed } = useAppData();
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);

  useEffect(() => {
    if (updateInfo) {
      setUpdateModalVisible(true);
    }
  }, [updateInfo]);

  if (!updateInfo) return null;

  const handleClose = () => {
    setUpdateModalVisible(false);
    setUpdateModalDismissed(true);
  };

  return (
    <UpdateModal
      visible={isUpdateModalVisible}
      versionName={updateInfo.versionName}
      updateUrl={updateInfo.updateUrl}
      currentVersionName={updateInfo.currentVersionName}
      onClose={handleClose}
    />
  );
};
