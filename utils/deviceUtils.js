import * as Device from 'expo-device';

export const getDeviceId = () => {
  if (!Device) return 'unknown';
  return Device.isDevice ? `${Device.deviceName}${Device.modelName}${Device.osBuildId}` : 'simulator';
};
