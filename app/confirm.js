import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';
import ButtonPrimary from '../components/ButtonPrimary';
import Loader from '../components/Loader';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDeviceId } from '../hooks/useDeviceId';
import { useFingerprintAuth } from '../hooks/useFingerprintAuth';
import voterService from '../services/voterService';

export default function ConfirmScreen() {
  const { cnic, na, pp } = useLocalSearchParams();
  const router = useRouter();
  const deviceId = useDeviceId();
  const { authenticate } = useFingerprintAuth();
  const [isLoading, setIsLoading] = useState(false);

  const onCastVote = async () => {
    const ok = await authenticate('Authenticate to cast your vote');
    if (!ok) return alert('Fingerprint failed');
    try {
      setIsLoading(true);
      const payload = { cnicNumber: cnic, deviceId, candidates: [na, pp] };
      const res = await voterService.voteCasting(payload);
      setIsLoading(false);
      alert(res?.message || 'Vote cast successfully');
      router.push('/success');
    } catch (err) {
      setIsLoading(false);
      alert(err?.message || 'Vote casting failed');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Confirm Vote" />
      <View style={styles.body}>
        <Text style={styles.label}>CNIC: {cnic}</Text>
        <Text style={styles.label}>NA Candidate ID: {na}</Text>
        <Text style={styles.label}>PP Candidate ID: {pp}</Text>
        <ButtonPrimary title="Confirm & Authenticate" onPress={onCastVote} />
        {isLoading && <Loader />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  body: { padding: 20 },
  label: { marginVertical: 8 }
});
