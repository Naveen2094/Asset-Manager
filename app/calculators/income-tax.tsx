import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';
import { formatCurrency } from '@/lib/formatCurrency';

function calculateTax(income: number): number {
  if (income <= 250000) return 0;

  let tax = 0;
  const slab1 = Math.min(income, 500000) - 250000;
  if (slab1 > 0) tax += slab1 * 0.05;

  const slab2 = Math.min(income, 1000000) - 500000;
  if (slab2 > 0) tax += slab2 * 0.2;

  const slab3 = income - 1000000;
  if (slab3 > 0) tax += slab3 * 0.3;

  return tax;
}

export default function IncomeTaxCalculatorScreen() {
  const { t, i18n } = useTranslation();
  const fonts = useFont();
  const [annualIncome, setAnnualIncome] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const isTamil = i18n.language === 'ta';

  const result = useMemo(() => {
    if (!calculated) return null;

    const income = parseFloat(annualIncome) || 0;
    if (income <= 0) return null;

    const totalTax = calculateTax(income);
    const netIncome = income - totalTax;

    return {
      totalTax: formatCurrency(totalTax),
      netIncome: formatCurrency(netIncome),
    };
  }, [calculated, annualIncome]);

  const handleCalculate = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCalculated(true);
  };

  const clearForm = () => {
    setAnnualIncome('');
    setCalculated(false);
  };

  return (
    <>
      <Stack.Screen options={{ title: t('incomeTaxCalculator'), headerShown: true, headerBackTitle: '' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.infoButtons}>
          <Pressable style={[styles.infoBtn, showInfo && styles.infoBtnActive]} onPress={() => setShowInfo(!showInfo)}>
            <Ionicons name="help-circle-outline" size={18} color={showInfo ? '#fff' : Colors.primary} />
            <Text style={[styles.infoBtnText, { fontFamily: fonts.medium }, showInfo && styles.infoBtnTextActive]}>
              {isTamil ? 'இது என்ன?' : 'What is this?'}
            </Text>
          </Pressable>
        </View>

        {showInfo && (
          <View style={styles.infoCard}>
            <Text style={[styles.infoTitle, { fontFamily: fonts.semiBold }]}>{isTamil ? 'இது என்ன?' : 'What is this?'}</Text>
            <Text style={[styles.infoText, { fontFamily: fonts.regular }]}>
              {isTamil
                ? 'Income Tax கணிப்பான் வருடாந்திர வருமானத்தின் அடிப்படையில் செலுத்த வேண்டிய வரியை கணிக்க உதவுகிறது.'
                : 'An income tax calculator estimates how much tax needs to be paid based on annual income.'}
            </Text>
            <Text style={[styles.infoTitle, { fontFamily: fonts.semiBold, marginTop: 12 }]}>
              {isTamil ? 'இது ஏன் பயனுள்ளது?' : 'Why is it useful?'}
            </Text>
            <Text style={[styles.infoText, { fontFamily: fonts.regular }]}>
              {isTamil
                ? 'இது வருமான வரி பொறுப்பை புரிந்து கொள்ள உதவுகிறது.'
                : 'It helps users understand their tax liability based on income levels.'}
            </Text>
          </View>
        )}

        <View style={styles.inputCard}>
          <InputField label="Annual Income" value={annualIncome} onChange={setAnnualIncome} fonts={fonts} />

          <View style={styles.actionRow}>
            <Pressable style={styles.clearBtn} onPress={clearForm}>
              <Ionicons name="close-circle-outline" size={20} color={Colors.primary} />
              <Text style={[styles.clearBtnText, { fontFamily: fonts.semiBold }]}>Clear</Text>
            </Pressable>
            <Pressable style={styles.calcBtn} onPress={handleCalculate}>
              <Ionicons name="calculator" size={20} color="#fff" />
              <Text style={[styles.calcBtnText, { fontFamily: fonts.semiBold }]}>Calculate</Text>
            </Pressable>
          </View>
        </View>

        {result && (
          <View style={styles.resultCard}>
            <Text style={[styles.resultTitle, { fontFamily: fonts.semiBold }]}>Result</Text>
            <ResultRow label="🧾 Total Tax" value={result.totalTax} fonts={fonts} />
            <ResultRow label="💰 Net Income" value={result.netIncome} fonts={fonts} />
            <View style={styles.insightCard}>
              <Text style={[styles.insightTitle, { fontFamily: fonts.semiBold }]}>💡 Insight</Text>
              <Text style={[styles.insightText, { fontFamily: fonts.regular }]}>
                {isTamil
                  ? `மொத்த வரி ${result.totalTax}; வரிக்குப் பிறகு வருமானம் ${result.netIncome}.`
                  : `Your total tax is ${result.totalTax}, leaving a net income of ${result.netIncome}.`}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
}

function InputField({
  label,
  value,
  onChange,
  fonts,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  fonts: any;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.inputLabel, { fontFamily: fonts.medium }]}>{label}</Text>
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

function ResultRow({ label, value, fonts }: { label: string; value: string; fonts: any }) {
  return (
    <View style={styles.resultRow}>
      <Text style={[styles.resultLabel, { fontFamily: fonts.regular }]}>{label}</Text>
      <Text style={[styles.resultValue, { fontFamily: fonts.bold }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40 },
  infoButtons: { flexDirection: 'row', marginBottom: 16 },
  infoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
  },
  infoBtnActive: { backgroundColor: Colors.primary },
  infoBtnText: { fontSize: 13, color: Colors.primary },
  infoBtnTextActive: { color: '#fff' },
  infoCard: {
    backgroundColor: Colors.accentLight,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  infoTitle: { fontSize: 14, color: Colors.text, marginBottom: 4 },
  infoText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  inputCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 14, color: Colors.textSecondary },
  input: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  clearBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primaryLight,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  clearBtnText: { fontSize: 16, color: Colors.primary },
  calcBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 16,
  },
  calcBtnText: { fontSize: 16, color: '#fff' },
  resultCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 20,
    marginTop: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  resultTitle: { fontSize: 18, color: Colors.primary, marginBottom: 16 },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  resultLabel: { fontSize: 14, color: Colors.textSecondary, flex: 1 },
  resultValue: { fontSize: 18, color: Colors.text },
  insightCard: {
    backgroundColor: '#EEFDF5',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  insightTitle: { fontSize: 14, fontWeight: '600', color: Colors.text },
  insightText: { fontSize: 13, color: '#374151', marginTop: 4, lineHeight: 20 },
});
