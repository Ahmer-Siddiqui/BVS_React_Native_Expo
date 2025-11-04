import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AppHeader from '../components/AppHeader';
import ButtonPrimary from '../components/ButtonPrimary';
import InputField from '../components/InputField';
import * as ImagePicker from 'expo-image-picker';
import { useDeviceId } from '../hooks/useDeviceId';
import { useFingerprintAuth } from '../hooks/useFingerprintAuth';
import voterService from '../services/voterService';
import { useRouter, useSearchParams } from 'expo-router';
import Loader from '../components/Loader';

export default function RegisterScreen() {
  const { cnic } = useSearchParams();
  const router = useRouter();
  const [cnicImage, setCnicImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const deviceId = useDeviceId();
  const { authenticate } = useFingerprintAuth();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera roll permissions are required.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.6, base64: true });
    if (!result.cancelled) setCnicImage(result);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permissions are required.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.6, base64: true });
    if (!result.cancelled) setCnicImage(result);
  };

  const onRegister = async () => {
    if (!cnic || cnic.length < 13) return alert('Invalid CNIC');
    if (!cnicImage) return alert('Please add CNIC image');
    const ok = await authenticate('Place your finger to register');
    if (!ok) return alert('Fingerprint authentication failed');

    try {
      setIsLoading(true);
      // send base64 or file URL depending on backend
      const payload = { cnicNumber: cnic, deviceId, cnicPicture: cnicImage.base64 ? `data:image/jpeg;base64,${cnicImage.base64}` : cnicImage.uri };
      const res = await voterService.registerVoter(payload);
      setIsLoading(false);
      alert(res?.message || 'Registered successfully');
      router.push(`/candidates?cnic=${cnic}`);
    } catch (err) {
      setIsLoading(false);
      alert(err?.message || 'Registration failed');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Register Voter" />
      <View style={styles.body}>
        <Text style={styles.info}>CNIC: {cnic}</Text>
        {cnicImage ? <Image source={{ uri: cnicImage.uri }} style={styles.preview} /> : <Text>No CNIC image</Text>}
        <View style={styles.row}>
          <TouchableOpacity onPress={pickImage} style={styles.smallBtn}><Text>Select Image</Text></TouchableOpacity>
          <TouchableOpacity onPress={takePhoto} style={styles.smallBtn}><Text>Take Photo</Text></TouchableOpacity>
        </View>
        <ButtonPrimary title="Register (Fingerprint)" onPress={onRegister} />
        {isLoading && <Loader />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  body: { padding: 20 },
  info: { marginBottom: 12 },
  preview: { width: 240, height: 160, resizeMode: 'cover', marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12, marginVertical: 12 },
  smallBtn: { padding: 10, borderWidth: 1, borderRadius: 8, marginRight: 8 }
});
