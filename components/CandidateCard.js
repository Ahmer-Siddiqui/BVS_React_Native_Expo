import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../constants/theme';

export default function CandidateCard({ item, onPress, selected }) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.card, 
        selected && styles.selected
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.container}>
        {/* Left Section - Candidate Details */}
        <View style={styles.left}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>
              {item?.userId ? `${item.userId.firstName} ${item.userId.lastName}` : 'Unknown'}
            </Text>
            {selected && (
              <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
              </View>
            )}
          </View>
          
          <View style={styles.detailsRow}>
            <Ionicons name="people" size={14} color={COLORS.textSecondary} />
            <Text style={styles.party}>{item.party || 'Independent'}</Text>
          </View>
          
          <View style={styles.positionBadge}>
            <Text style={styles.positionText}>{item.position}</Text>
          </View>
        </View>

        {/* Right Section - Party Symbol */}
        <View style={styles.symbolContainer}>
          {item.symbol ? (
            <Image
              source={{ uri: item.symbol }}
              style={styles.symbol}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="image-outline" size={24} color={COLORS.textTertiary} />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  selected: {
    borderColor: COLORS.success,
    backgroundColor: '#F0FDF4', // Light green tint
    ...SHADOWS.md,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  name: {
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textPrimary,
    flex: 1,
  },
  checkmarkContainer: {
    marginLeft: SPACING.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  party: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    marginLeft: SPACING.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
  },
  positionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  positionText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textInverse,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
  },
  symbolContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    width: 70,
    height: 70,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  placeholder: {
    width: 70,
    height: 70,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
