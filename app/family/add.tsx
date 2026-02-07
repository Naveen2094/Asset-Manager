import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Platform } from 'react-native';
import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';
import { useApp } from '@/lib/app-context';

const relationships = ['self', 'spouse', 'child', 'parent', 'sibling'];
const occupations = ['farmer', 'student', 'employed', 'self_employed', 'homemaker', 'other'];
const genders = ['male', 'female'];

export default function AddFamilyMemberScreen() {
  const { t } = useTranslation();
  const fonts = useFont();
  const { addFamilyMember } = useApp();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [relationship, setRelationship] = useState('self');
  const [gender, setGender] = useState('');
  const [income, setIncome] = useState('');
  const [occupation, setOccupation] = useState('');

  const isValid = name.trim() && age.trim();

  const handleSave = () => {
    if (!isValid) return;
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addFamilyMember({
      name: name.trim(),
      age: parseInt(age) || 0,
      relationship,
      gender: gender || undefined,
      income: income ? parseInt(income) : undefined,
      occupation: occupation || undefined,
    });
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ title: t('family.add_member') }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontFamily: fonts.medium }]}>{t('family.name')}</Text>
          <TextInput
            style={[styles.input, { fontFamily: fonts.regular }]}
            value={name}
            onChangeText={setName}
            placeholder={t('family.name')}
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontFamily: fonts.medium }]}>{t('family.age')}</Text>
          <TextInput
            style={[styles.input, { fontFamily: fonts.regular }]}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontFamily: fonts.medium }]}>{t('family.relationship')}</Text>
          <View style={styles.chipRow}>
            {relationships.map(r => (
              <Pressable
                key={r}
                style={[styles.chip, relationship === r && styles.chipActive]}
                onPress={() => setRelationship(r)}
              >
                <Text style={[styles.chipText, { fontFamily: fonts.medium }, relationship === r && styles.chipTextActive]}>
                  {t(`family.${r}`)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontFamily: fonts.medium }]}>{t('schemes.gender')}</Text>
          <View style={styles.chipRow}>
            {genders.map(g => (
              <Pressable
                key={g}
                style={[styles.chip, gender === g && styles.chipActive]}
                onPress={() => setGender(g)}
              >
                <Text style={[styles.chipText, { fontFamily: fonts.medium }, gender === g && styles.chipTextActive]}>
                  {t(`schemes.${g}`)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontFamily: fonts.medium }]}>{t('family.income')}</Text>
          <TextInput
            style={[styles.input, { fontFamily: fonts.regular }]}
            value={income}
            onChangeText={setIncome}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={Colors.textTertiary}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { fontFamily: fonts.medium }]}>{t('schemes.occupation')}</Text>
          <View style={styles.chipRow}>
            {occupations.map(o => (
              <Pressable
                key={o}
                style={[styles.chip, occupation === o && styles.chipActive]}
                onPress={() => setOccupation(o)}
              >
                <Text style={[styles.chipText, { fontFamily: fonts.medium }, occupation === o && styles.chipTextActive]}>
                  {t(`schemes.${o}`)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          style={[styles.saveBtn, !isValid && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!isValid}
        >
          <Ionicons name="checkmark" size={20} color="#fff" />
          <Text style={[styles.saveBtnText, { fontFamily: fonts.semiBold }]}>
            {t('family.save')}
          </Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40, gap: 20 },
  inputGroup: { gap: 8 },
  label: { fontSize: 14, color: Colors.textSecondary },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  chipText: { fontSize: 14, color: Colors.textSecondary },
  chipTextActive: { color: Colors.primary },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 18,
    marginTop: 8,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveBtnText: { fontSize: 16, color: '#fff' },
});
