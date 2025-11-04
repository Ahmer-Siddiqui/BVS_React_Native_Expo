import { useState } from 'react';
import voterService from '../services/voterService';
import { useDeviceId } from './useDeviceId';
import { useFingerprintAuth } from './useFingerprintAuth';

export const useVoteProcess = () => {
  const deviceId = useDeviceId();
  const { authenticate } = useFingerprintAuth();
  const [loading, setLoading] = useState(false);

  const register = async ({ cnicNumber, cnicPicture }) => {
    const ok = await authenticate('Authenticate to register');
    if (!ok) throw new Error('Authentication failed');
    setLoading(true);
    const res = await voterService.registerVoter({ cnicNumber, deviceId, cnicPicture });
    setLoading(false);
    return res;
  };

  const castVote = async ({ cnicNumber, candidates }) => {
    const ok = await authenticate('Authenticate to cast vote');
    if (!ok) throw new Error('Authentication failed');
    setLoading(true);
    const res = await voterService.voteCasting({ cnicNumber, deviceId, candidates });
    setLoading(false);
    return res;
  };

  return { register, castVote, loading };
};
