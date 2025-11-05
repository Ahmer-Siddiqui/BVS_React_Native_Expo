import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import AppHeader from '../components/AppHeader';
import CandidateCard from '../components/CandidateCard';
import Loader from '../components/Loader';
import { useLocalSearchParams, useRouter } from 'expo-router';
import candidateService from '../services/candidateService';
import ButtonPrimary from '../components/ButtonPrimary';

export default function CandidatesScreen() {
  const { cnic } = useLocalSearchParams();
  
  const router = useRouter();
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selection, setSelection] = useState({ NA: null, PP: null });  

  useEffect(() => {
    if (!cnic) return;
    fetchCandidates();
  }, [cnic]);

  const fetchCandidates = async () => {
    try {
      setIsLoading(true);
      const res = await candidateService.getCandidates(cnic);
      setIsLoading(false);
      // If voter not registered or no voterStation assigned, backend returns error -> route to register
      if (!res || !res.candidates) {
        router.push(`/register?cnic=${cnic}`);
        return;
      }
      setCandidates(res.candidates || []);
    } catch (err) {
      setIsLoading(false);
      // likely not registered
      router.push(`/register?cnic=${cnic}`);
    }
  };

  const toggleSelect = (item) => {
    setSelection((prev) => {
      const copy = { ...prev };
      copy[item.position] = copy[item.position] === item._id ? null : item._id;
      return copy;
    });
  };

  const onConfirm = () => {
    // must select one NA and one PP
    if (!selection.NA || !selection.PP) return alert('Select one candidate for NA and one for PP');
    // navigate to confirm screen with selections
    const params = new URLSearchParams({ cnic, na: selection.NA, pp: selection.PP }).toString();
    router.push(`/confirm?${params}`);
  };

  if (isLoading) return <Loader />;

  return (
    <View style={styles.container}>
      <AppHeader title="Candidates" />
      <View style={styles.body}>
        <Text style={styles.instructions}>Select 1 candidate for NA and 1 for PP</Text>
        <FlatList
          data={candidates}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <CandidateCard item={item} selected={selection[item.position] === item._id} onPress={() => toggleSelect(item)} />
          )}
          ListEmptyComponent={<Text>No candidates found.</Text>}
        />
        <ButtonPrimary title="Confirm Selection" onPress={onConfirm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  body: { padding: 16 },
  instructions: { fontSize: 14, marginBottom: 12 }
});
