import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';
import { useApp } from '@/lib/app-context';

const relationships = ['self', 'spouse', 'child', 'parent', 'sibling'];

export default function FamilySetupScreen() {
  const { t } = useTranslation();
  const fonts = useFont();
  const insets = useSafeAreaInsets();
  const { addFamilyMember, setOnboardingComplete, familyMembers } = useApp();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [relationship, setRelationship] = useState('self');
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    if (!name.trim() || !age.trim()) return;
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addFamilyMember({
      name: name.trim(),
      age: parseInt(age) || 0,
      relationship,
    });
    setName('');
    setAge('');
    setRelationship('self');
    setShowForm(false);
  };

  const handleFinish = async () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await setOnboardingComplete();
    router.replace('/(tabs)');
  };

  const handleSkip = async () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await setOnboardingComplete();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 20) }]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="people" size={36} color={Colors.primary} />
          </View>
          <Text style={[styles.title, { fontFamily: fonts.bold }]}>
            {t('onboarding.family_title')}
          </Text>
          <Text style={[styles.subtitle, { fontFamily: fonts.regular }]}>
            {t('onboarding.family_subtitle')}
          </Text>
        </View>

        {familyMembers.map((member) => (
          <View key={member.id} style={styles.memberCard}>
            <View style={styles.memberIcon}>
              <Ionicons name="person" size={20} color={Colors.primary} />
            </View>
            <View style={styles.memberInfo}>
              <Text style={[styles.memberName, { fontFamily: fonts.semiBold }]}>{member.name}</Text>
              <Text style={[styles.memberDetail, { fontFamily: fonts.regular }]}>
                {t(`family.${member.relationship}`)} | {member.age} {t('common.years_label')}
              </Text>
            </View>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
          </View>
        ))}

        {showForm ? (
          <View style={styles.formCard}>
            <TextInput
              style={[styles.input, { fontFamily: fonts.regular }]}
              placeholder={t('family.name')}
              placeholderTextColor={Colors.textTertiary}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={[styles.input, { fontFamily: fonts.regular }]}
              placeholder={t('family.age')}
              placeholderTextColor={Colors.textTertiary}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
            <View style={styles.relRow}>
              {relationships.map((rel) => (
                <Pressable
                  key={rel}
                  style={[styles.relChip, relationship === rel && styles.relChipActive]}
                  onPress={() => setRelationship(rel)}
                >
                  <Text style={[
                    styles.relText,
                    { fontFamily: fonts.medium },
                    relationship === rel && styles.relTextActive
                  ]}>
                    {t(`family.${rel}`)}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.formBtns}>
              <Pressable style={styles.cancelBtn} onPress={() => setShowForm(false)}>
                <Text style={[styles.cancelBtnText, { fontFamily: fonts.medium }]}>{t('family.cancel')}</Text>
              </Pressable>
              <Pressable
                style={[styles.saveBtn, (!name.trim() || !age.trim()) && styles.saveBtnDisabled]}
                onPress={handleAdd}
                disabled={!name.trim() || !age.trim()}
              >
                <Text style={[styles.saveBtnText, { fontFamily: fonts.semiBold }]}>{t('family.save')}</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable style={styles.addBtn} onPress={() => setShowForm(true)}>
            <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
            <Text style={[styles.addBtnText, { fontFamily: fonts.medium }]}>
              {t('onboarding.add_member')}
            </Text>
          </Pressable>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 16) }]}>
        <Pressable style={styles.skipBtn} onPress={handleSkip}>
          <Text style={[styles.skipBtnText, { fontFamily: fonts.medium }]}>
            {t('onboarding.skip_setup')}
          </Text>
        </Pressable>
        {familyMembers.length > 0 && (
          <Pressable style={styles.finishBtn} onPress={handleFinish}>
            <Text style={[styles.finishBtnText, { fontFamily: fonts.semiBold }]}>
              {t('onboarding.next')}
            </Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 120 },
  header: { alignItems: 'center', marginBottom: 32 },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 24, color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginTop: 8 },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  memberIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 16, color: Colors.text },
  memberDetail: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  relRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  relChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  relChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  relText: { fontSize: 13, color: Colors.textSecondary },
  relTextActive: { color: Colors.primary },
  formBtns: { flexDirection: 'row', gap: 12, marginTop: 4 },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, color: Colors.textSecondary },
  saveBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { fontSize: 15, color: '#fff' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 18,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addBtnText: { fontSize: 16, color: Colors.primary },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  skipBtn: { padding: 12 },
  skipBtnText: { fontSize: 15, color: Colors.textSecondary },
  finishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  finishBtnText: { fontSize: 16, color: '#fff' },
});
