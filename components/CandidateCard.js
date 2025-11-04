import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function CandidateCard({ item, onPress, selected }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, selected && styles.selected]}>
      <View style={styles.left}>
        <Text style={styles.name}>{item?.userId ? `${item.userId.firstName} ${item.userId.lastName}` : 'Unknown'}</Text>
        <Text style={styles.party}>{item.party || 'Independent'}</Text>
        <Text style={styles.position}>{item.position}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#eee', marginBottom: 8, backgroundColor: '#fff' },
  selected: { borderColor: '#0a7cff', backgroundColor: '#eef6ff' },
  name: { fontWeight: '600' },
  party: { color: '#666' },
  position: { marginTop: 6, fontSize: 12, color: '#333' }
});
