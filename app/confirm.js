import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';
import ButtonPrimary from '../components/ButtonPrimary';
import Loader from '../components/Loader';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFingerprintAuth } from '../hooks/useFingerprintAuth';
import voterService from '../services/voterService';
import { getDeviceId } from '../utils/deviceUtils';

export default function ConfirmScreen() {
  const { cnic, na, pp } = useLocalSearchParams();
  const router = useRouter();
  const deviceId = getDeviceId();
  const { authenticate } = useFingerprintAuth();
  const [isLoading, setIsLoading] = useState(false);
  console.log(cnic,na,pp,deviceId);
  
  const onCastVote = async () => {
    const ok = await authenticate('Authenticate to cast your vote');
    if (!ok) return alert('Fingerprint failed');
    try {
      if (!cnic || cnic.length !== 15) {
        alert("Cnic number is required")
        router.push('/');
        return;
      }
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
