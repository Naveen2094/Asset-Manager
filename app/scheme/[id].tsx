import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Platform } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';
import { schemes } from '@/lib/schemes-data';

export default function SchemeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const fonts = useFont();
  const isTamil = i18n.language === 'ta';
  const scheme = schemes.find(s => s.id === id);
  const [showChecker, setShowChecker] = useState(false);
  const [age, setAge] = useState('');
  const [income, setIncome] = useState('');
  const [gender, setGender] = useState('');
  const [occupation, setOccupation] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState<boolean | null>(null);

  if (!scheme) return null;

  const handleCheck = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (scheme.eligibilityCheck) {
      const result = scheme.eligibilityCheck({
        age: parseInt(age) || 0,
        income: parseInt(income) || 0,
        gender,
        occupation,
      });
      setEligibilityResult(result);
    }
  };

  const sections = [
    { title: t('schemes.eligibility'), content: isTamil ? scheme.eligibility_ta : scheme.eligibility_en, icon: 'checkmark-circle' },
    { title: t('schemes.benefits'), content: isTamil ? scheme.benefits_ta : scheme.benefits_en, icon: 'gift' },
    { title: t('schemes.estimated_savings'), content: isTamil ? scheme.estimated_savings_ta : scheme.estimated_savings_en, icon: 'wallet' },
    { title: t('schemes.how_to_apply'), content: isTamil ? scheme.how_to_apply_ta : scheme.how_to_apply_en, icon: 'document-text' },
  ];

  const documents = isTamil ? scheme.documents_ta : scheme.documents_en;
  const genders = [
    { key: 'male', label: t('schemes.male') },
    { key: 'female', label: t('schemes.female') },
  ];
  const occupations = [
    { key: 'farmer', label: t('schemes.farmer') },
    { key: 'student', label: t('schemes.student') },
    { key: 'employed', label: t('schemes.employed') },
    { key: 'self_employed', label: t('schemes.self_employed') },
    { key: 'homemaker', label: t('schemes.homemaker') },
    { key: 'other', label: t('schemes.other') },
  ];

  return (
    <>
      <Stack.Screen options={{ title: isTamil ? scheme.name_ta : scheme.name_en }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.headerIcon, { backgroundColor: scheme.color + '15' }]}>
          <Ionicons name={scheme.icon as any} size={36} color={scheme.color} />
        </View>

        <Text style={[styles.schemeName, { fontFamily: fonts.bold }]}>
          {isTamil ? scheme.name_ta : scheme.name_en}
        </Text>

        {sections.map((section, i) => (
          <View key={i} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name={section.icon as any} size={18} color={Colors.primary} />
              <Text style={[styles.sectionTitle, { fontFamily: fonts.semiBold }]}>
                {section.title}
              </Text>
            </View>
            <Text style={[styles.sectionText, { fontFamily: fonts.regular }]}>
              {section.content}
            </Text>
          </View>
        ))}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="folder-open" size={18} color={Colors.primary} />
            <Text style={[styles.sectionTitle, { fontFamily: fonts.semiBold }]}>
              {t('schemes.documents')}
            </Text>
          </View>
          {documents.map((doc, i) => (
            <View key={i} style={styles.docRow}>
              <Ionicons name="document-outline" size={16} color={Colors.textSecondary} />
              <Text style={[styles.docText, { fontFamily: fonts.regular }]}>{doc}</Text>
            </View>
          ))}
        </View>

        {scheme.eligibilityCheck && (
          <>
            <Pressable
              style={[styles.checkBtn, showChecker && styles.checkBtnActive]}
              onPress={() => { setShowChecker(!showChecker); setEligibilityResult(null); }}
            >
              <Ionicons name="shield-checkmark" size={20} color={showChecker ? '#fff' : Colors.primary} />
              <Text style={[styles.checkBtnText, { fontFamily: fonts.semiBold }, showChecker && styles.checkBtnTextActive]}>
                {t('schemes.check_eligibility')}
              </Text>
            </Pressable>

            {showChecker && (
              <View style={styles.checkerCard}>
                <InputField label={t('schemes.age')} value={age} onChange={setAge} fonts={fonts} />
                <InputField label={t('schemes.income')} value={income} onChange={setIncome} fonts={fonts} />

                <Text style={[styles.fieldLabel, { fontFamily: fonts.medium }]}>{t('schemes.gender')}</Text>
                <View style={styles.chipRow}>
                  {genders.map(g => (
                    <Pressable
                      key={g.key}
                      style={[styles.chip, gender === g.key && styles.chipActive]}
                      onPress={() => setGender(g.key)}
                    >
                      <Text style={[styles.chipText, { fontFamily: fonts.medium }, gender === g.key && styles.chipTextActive]}>
                        {g.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={[styles.fieldLabel, { fontFamily: fonts.medium }]}>{t('schemes.occupation')}</Text>
                <View style={styles.chipRow}>
                  {occupations.map(o => (
                    <Pressable
                      key={o.key}
                      style={[styles.chip, occupation === o.key && styles.chipActive]}
                      onPress={() => setOccupation(o.key)}
                    >
                      <Text style={[styles.chipText, { fontFamily: fonts.medium }, occupation === o.key && styles.chipTextActive]}>
                        {o.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Pressable style={styles.submitBtn} onPress={handleCheck}>
                  <Text style={[styles.submitBtnText, { fontFamily: fonts.semiBold }]}>
                    {t('schemes.check_eligibility')}
                  </Text>
                </Pressable>

                {eligibilityResult !== null && (
                  <View style={[styles.resultBanner, eligibilityResult ? styles.resultEligible : styles.resultNotEligible]}>
                    <Ionicons
                      name={eligibilityResult ? 'checkmark-circle' : 'close-circle'}
                      size={24}
                      color={eligibilityResult ? Colors.success : Colors.error}
                    />
                    <Text style={[styles.resultText, { fontFamily: fonts.semiBold, color: eligibilityResult ? Colors.success : Colors.error }]}>
                      {eligibilityResult ? t('schemes.eligible') : t('schemes.not_eligible')}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </>
  );
}

function InputField({ label, value, onChange, fonts }: { label: string; value: string; onChange: (v: string) => void; fonts: any }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.fieldLabel, { fontFamily: fonts.medium }]}>{label}</Text>
      <TextInput
        style={[styles.input, { fontFamily: fonts.regular }]}
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholderTextColor={Colors.textTertiary}
        placeholder="0"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40 },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  schemeName: { fontSize: 20, color: Colors.text, textAlign: 'center', marginBottom: 24 },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionTitle: { fontSize: 15, color: Colors.primary },
  sectionText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  docRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6 },
  docText: { fontSize: 14, color: Colors.textSecondary },
  checkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primaryLight,
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  checkBtnActive: { backgroundColor: Colors.primary },
  checkBtnText: { fontSize: 16, color: Colors.primary },
  checkBtnTextActive: { color: '#fff' },
  checkerCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputGroup: { gap: 6 },
  fieldLabel: { fontSize: 14, color: Colors.textSecondary },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary },
  chipTextActive: { color: Colors.primary },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  submitBtnText: { fontSize: 16, color: '#fff' },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 14,
  },
  resultEligible: { backgroundColor: '#DCFCE7' },
  resultNotEligible: { backgroundColor: '#FEE2E2' },
  resultText: { fontSize: 16 },
});
