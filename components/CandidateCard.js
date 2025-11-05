import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function CandidateCard({ item, onPress, selected }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, selected && styles.selected]}>
      <View style={styles.container}>
        {/* Left Section - Candidate Details */}
        <View style={styles.left}>
          <Text style={styles.name}>
            {item?.userId ? `${item.userId.firstName} ${item.userId.lastName}` : 'Unknown'}
          </Text>
          <Text style={styles.party}>{item.party || 'Independent'}</Text>
          <Text style={styles.position}>{item.position}</Text>
        </View>

        {/* Right Section - Party Symbol */}
        {item.symbol ? (
          <Image
            source={{ uri: item.symbol }}
            style={styles.symbol}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>No Logo</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 8,
    backgroundColor: '#fff'
  },
  selected: {
    borderColor: '#0a7cff',
    backgroundColor: '#eef6ff'
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  left: {
    flex: 1,
    paddingRight: 10
  },
  name: {
    fontWeight: '600',
    fontSize: 16
  },
  party: {
    color: '#666',
    marginTop: 2
  },
  position: {
    marginTop: 6,
    fontSize: 12,
    color: '#333'
  },
  symbol: {
    width: 50,
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  placeholder: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderText: {
    fontSize: 10,
    color: '#aaa'
  }
});
