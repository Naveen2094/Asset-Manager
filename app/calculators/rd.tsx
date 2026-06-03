import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';
import { formatCurrency } from '@/lib/formatCurrency';

export default function RDCalculatorScreen() {
  const { t, i18n } = useTranslation();
  const fonts = useFont();
  const [monthlyDeposit, setMonthlyDeposit] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [years, setYears] = useState('');
  const [calculated, setCalculated] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const isTamil = i18n.language === 'ta';

  const result = useMemo(() => {
    if (!calculated) return null;

    const P = parseFloat(monthlyDeposit) || 0;
    const r = parseFloat(interestRate) || 0;
    const yearsValue = parseFloat(years) || 0;
    const n = yearsValue * 12;
    if (P <= 0 || n <= 0 || r < 0) return null;

    const totalInvested = P * n;
    const interestEarned = (totalInvested * r) / 100;
    const maturityValue = totalInvested + interestEarned;

    return {
      totalInvested: formatCurrency(totalInvested),
      interestEarned: formatCurrency(interestEarned),
      maturityValue: formatCurrency(maturityValue),
    };
  }, [calculated, monthlyDeposit, interestRate, years]);

  const handleCalculate = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCalculated(true);
  };

  const clearForm = () => {
    setMonthlyDeposit('');
    setInterestRate('');
    setYears('');
    setCalculated(false);
  };

  return (
    <>
      <Stack.Screen options={{ title: t('rdCalculator'), headerShown: true, headerBackTitle: '' }} />
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
                ? 'Recurring Deposit கணிப்பான் மாதந்தோறும் சேமிக்கப்படும் தொகை காலப்போக்கில் எவ்வளவு அதிகரிக்கும் என்பதை கணிக்க உதவுகிறது.'
                : 'A Recurring Deposit calculator estimates how your monthly savings grow when deposited regularly in a bank account.'}
            </Text>
            <Text style={[styles.infoTitle, { fontFamily: fonts.semiBold, marginTop: 12 }]}>
              {isTamil ? 'இது ஏன் பயனுள்ளது?' : 'Why is it useful?'}
            </Text>
            <Text style={[styles.infoText, { fontFamily: fonts.regular }]}>
              {isTamil
                ? 'இது ஒழுங்கையான சேமிப்பு பழக்கத்தை உருவாக்க உதவுகிறது.'
                : 'It encourages disciplined monthly savings and helps people plan their future financial goals.'}
            </Text>
          </View>
        )}

        <View style={styles.inputCard}>
          <InputField label="Monthly Deposit" value={monthlyDeposit} onChange={setMonthlyDeposit} fonts={fonts} />
          <InputField label="Interest Rate (%)" value={interestRate} onChange={setInterestRate} fonts={fonts} />
          <InputField label="Years" value={years} onChange={setYears} fonts={fonts} />

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
            <ResultRow label="💰 Total Invested" value={result.totalInvested} fonts={fonts} />
            <ResultRow label="📈 Interest Earned" value={result.interestEarned} fonts={fonts} />
            <ResultRow label="📊 Maturity Value" value={result.maturityValue} fonts={fonts} />
            <View style={styles.insightCard}>
              <Text style={[styles.insightTitle, { fontFamily: fonts.semiBold }]}>💡 Insight</Text>
              <Text style={[styles.insightText, { fontFamily: fonts.regular }]}>
                {isTamil
                  ? `நீங்கள் ${result.totalInvested} முதலீடு செய்து ${result.interestEarned} வருமானம் பெறலாம்.`
                  : `You invested ${result.totalInvested} and may earn ${result.interestEarned} as returns.`}
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
