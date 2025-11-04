import * as LocalAuthentication from 'expo-local-authentication';

export const useFingerprintAuth = () => {
  const authenticate = async (prompt = 'Authenticate') => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        alert('Biometric hardware not available on this device');
        return false;
      }
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        alert('No biometrics enrolled. Please set up fingerprint or face ID on your device.');
        return false;
      }
      const result = await LocalAuthentication.authenticateAsync({ promptMessage: prompt, fallbackLabel: 'Use device passcode' });
      return result.success;
    } catch (err) {
      console.error('Fingerprint error', err);
      return false;
    }
  };

  return { authenticate };
};
