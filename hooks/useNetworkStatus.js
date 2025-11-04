import { useEffect, useState } from 'react';
import { NetInfo } from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    let unsub;
    try {
      const NetInfoLib = require('@react-native-community/netinfo');
      unsub = NetInfoLib.addEventListener((state) => setIsConnected(state.isConnected));
    } catch {
      // fallback
      setIsConnected(true);
    }
    return () => unsub && unsub();
  }, []);

  return isConnected;
};
