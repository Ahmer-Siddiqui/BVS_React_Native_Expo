import * as LocalAuthentication from 'expo-local-authentication';

export const isBiometricAvailable = async () => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return hasHardware && enrolled;
};

export const authenticateBiometric = async (prompt = 'Authenticate') => {
  const res = await LocalAuthentication.authenticateAsync({ promptMessage: prompt });
  return res.success;
};
