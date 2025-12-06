import React, { useEffect, useState, useMemo } from "react";
import { View, Text, StyleSheet, SectionList, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../components/AppHeader";
import CandidateCard from "../components/CandidateCard";
import Loader from "../components/Loader";
import ButtonPrimary from "../components/ButtonPrimary";
import StepIndicator from "../components/StepIndicator";
import EmptyState from "../components/EmptyState";
import { useLocalSearchParams, useRouter } from "expo-router";
import { fetchCandidates } from "../redux/candidateSlice";
import { useDispatch, useSelector } from "react-redux";
import { resetValue } from "../redux/voterSlice";
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from "../constants/theme";
import { useAlert } from "../context/AlertContext";

export default function CandidatesScreen() {
  const { cnic } = useLocalSearchParams();
  const { candidates, isLoading, message, success } = useSelector(
    (state) => state.candidate
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const [selection, setSelection] = useState({ NA: null, PP: null });
  const { showAlert } = useAlert();

  // Group candidates by position for SectionList
  const sections = useMemo(() => {
    if (!candidates || candidates.length === 0) return [];
    
    const naCandidates = candidates.filter(c => c.position === 'NA');
    const ppCandidates = candidates.filter(c => c.position === 'PP');
    
    return [
      { title: 'National Assembly (NA)', data: naCandidates, type: 'NA' },
      { title: 'Provincial Assembly (PP)', data: ppCandidates, type: 'PP' }
    ].filter(section => section.data.length > 0);
  }, [candidates]);

  const toggleSelect = (item) => {
    setSelection((prev) => {
      const copy = { ...prev };
      // If clicking already selected item, deselect it. Otherwise select new one.
      copy[item.position] = copy[item.position] === item._id ? null : item._id;
      return copy;
    });
  };

  const onConfirm = () => {
    // must select one NA and one PP
    if (!selection.NA || !selection.PP)
      return showAlert({
        title: "Incomplete Selection",
        message: "Please select one candidate for NA and one for PP",
        type: "warning"
      });
      
    // navigate to confirm screen with selections
    const params = new URLSearchParams({
      cnic,
      na: selection.NA,
      pp: selection.PP,
    }).toString();
    router.push(`/confirm?${params}`);
  };

  useEffect(() => {
    dispatch(resetValue());
  }, []);

  useEffect(() => {
    if (!cnic) return router.push("/");
    dispatch(fetchCandidates(cnic));
  }, [cnic]);

  useEffect(() => {
    if (message && !success) showAlert({
      title: "Notice",
      message: message,
      type: "info"
    });
  }, [success, message]);

  const renderSectionHeader = ({ section: { title, type } }) => {
    const isSelected = !!selection[type];
    
    return (
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderContent}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {isSelected && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark" size={12} color={COLORS.textInverse} />
              <Text style={styles.completedText}>Selected</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (isLoading) return <Loader />;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#F9FAFB', '#EEF2FF']}
        style={styles.gradient}
      >
        <AppHeader title="Select Candidates" />
        
        <View style={styles.content}>
          <StepIndicator currentStep={3} />
          
          <SectionList
            sections={sections}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <CandidateCard
                item={item}
                selected={selection[item.position] === item._id}
                onPress={() => toggleSelect(item)}
              />
            )}
            renderSectionHeader={renderSectionHeader}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={true}
            ListEmptyComponent={
              <EmptyState 
                title="No Candidates Found"
                message="There are no candidates available for your constituency at this time."
              />
            }
            ListHeaderComponent={
              <View style={styles.headerInfo}>
                <Text style={styles.instructions}>
                  Please select one candidate from each category below to proceed.
                </Text>
              </View>
            }
            ListFooterComponent={<View style={{ height: 100 }} />} // Space for bottom button
          />
          
          {/* Floating Bottom Bar */}
          <View style={styles.bottomBar}>
            <View style={styles.selectionSummary}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>NA:</Text>
                <View style={[styles.statusDot, selection.NA ? styles.statusDotActive : null]} />
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>PP:</Text>
                <View style={[styles.statusDot, selection.PP ? styles.statusDotActive : null]} />
              </View>
            </View>
            
            <View style={styles.buttonContainer}>
              <ButtonPrimary 
                title="Review & Confirm" 
                onPress={onConfirm}
                icon="checkmark-done-circle"
                disabled={!selection.NA || !selection.PP}
              />
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  content: { flex: 1 },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  headerInfo: {
    marginBottom: SPACING.md,
  },
  instructions: {
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  sectionHeader: {
    backgroundColor: '#F9FAFB', // Match background to look seamless or use slight contrast
    paddingVertical: SPACING.md,
    marginBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.full,
  },
  completedText: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.textInverse,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    marginLeft: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  selectionSummary: {
    flexDirection: 'row',
    marginRight: SPACING.lg,
    gap: SPACING.md,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textSecondary,
    marginRight: SPACING.xs,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.border,
  },
  statusDotActive: {
    backgroundColor: COLORS.success,
  },
  buttonContainer: {
    flex: 1,
  },
});
