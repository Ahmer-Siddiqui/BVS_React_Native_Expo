import * as Device from 'expo-device';
import { useEffect, useState } from 'react';

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState(null);

  useEffect(() => {
    const id = Device.isDevice ? Device.deviceName || Device.osInternalBuildId || Device.modelName : 'emulator-device';
    setDeviceId(id);
  }, []);

  return deviceId || 'unknown-device';
};
