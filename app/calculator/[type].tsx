import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Platform } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';

function formatINR(num: number): string {
  return '₹' + num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export default function CalculatorScreen() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const { t } = useTranslation();
  const fonts = useFont();
  const [showInfo, setShowInfo] = useState(false);
  const [calculated, setCalculated] = useState(false);

  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [annualRate, setAnnualRate] = useState('');
  const [years, setYears] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [tenure, setTenure] = useState('');
  const [principal, setPrincipal] = useState('');
  const [initialInvestment, setInitialInvestment] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  const result = useMemo(() => {
    if (!calculated) return null;

    switch (type) {
      case 'sip': {
        const P = parseFloat(monthlyAmount) || 0;
        const r = (parseFloat(annualRate) || 0) / 100 / 12;
        const n = (parseFloat(years) || 0) * 12;
        if (P <= 0 || r <= 0 || n <= 0) return null;
        const fv = P * (((1 + r) ** n - 1) / r) * (1 + r);
        const invested = P * n;
        return {
          total_investment: formatINR(invested),
          estimated_returns: formatINR(fv - invested),
          total_value: formatINR(fv),
        };
      }
      case 'emi': {
        const P = parseFloat(loanAmount) || 0;
        const r = (parseFloat(annualRate) || 0) / 100 / 12;
        const n = parseFloat(tenure) || 0;
        if (P <= 0 || r <= 0 || n <= 0) return null;
        const emi = (P * r * (1 + r) ** n) / ((1 + r) ** n - 1);
        const totalPayment = emi * n;
        return {
          monthly_emi: formatINR(emi),
          total_interest: formatINR(totalPayment - P),
          total_payment: formatINR(totalPayment),
        };
      }
      case 'compound': {
        const P = parseFloat(principal) || 0;
        const r = (parseFloat(annualRate) || 0) / 100;
        const n = parseFloat(years) || 0;
        if (P <= 0 || r <= 0 || n <= 0) return null;
        const fv = P * (1 + r) ** n;
        return {
          total_investment: formatINR(P),
          estimated_returns: formatINR(fv - P),
          maturity_value: formatINR(fv),
        };
      }
      case 'savings_goal': {
        const target = parseFloat(targetAmount) || 0;
        const r = (parseFloat(annualRate) || 0) / 100 / 12;
        const n = (parseFloat(years) || 0) * 12;
        if (target <= 0 || r <= 0 || n <= 0) return null;
        const monthly = target * r / ((1 + r) ** n - 1);
        return {
          monthly_savings_needed: formatINR(monthly),
          total_investment: formatINR(monthly * n),
          total_value: formatINR(target),
        };
      }
      case 'roi': {
        const initial = parseFloat(initialInvestment) || 0;
        const final_ = parseFloat(finalValue) || 0;
        if (initial <= 0) return null;
        const roi = ((final_ - initial) / initial) * 100;
        return {
          roi_result: roi.toFixed(2) + '%',
          total_investment: formatINR(initial),
          estimated_returns: formatINR(final_ - initial),
        };
      }
      case 'rule72': {
        const r = parseFloat(annualRate) || 0;
        if (r <= 0) return null;
        const doublingYears = 72 / r;
        return {
          doubling_time: doublingYears.toFixed(1) + ` ${t('common.years_label')}`,
          interest_rate: r + '%',
        };
      }
      default:
        return null;
    }
  }, [calculated, type, monthlyAmount, annualRate, years, loanAmount, tenure, principal, initialInvestment, finalValue, targetAmount]);

  const handleCalculate = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCalculated(true);
  };

  const renderInputs = () => {
    switch (type) {
      case 'sip':
        return (
          <>
            <InputField label={t('calculator.monthly_amount')} value={monthlyAmount} onChange={setMonthlyAmount} fonts={fonts} />
            <InputField label={t('calculator.annual_rate')} value={annualRate} onChange={setAnnualRate} fonts={fonts} />
            <InputField label={t('calculator.years')} value={years} onChange={setYears} fonts={fonts} />
          </>
        );
      case 'emi':
        return (
          <>
            <InputField label={t('calculator.loan_amount')} value={loanAmount} onChange={setLoanAmount} fonts={fonts} />
            <InputField label={t('calculator.interest_rate')} value={annualRate} onChange={setAnnualRate} fonts={fonts} />
            <InputField label={t('calculator.tenure')} value={tenure} onChange={setTenure} fonts={fonts} />
          </>
        );
      case 'compound':
        return (
          <>
            <InputField label={t('calculator.principal')} value={principal} onChange={setPrincipal} fonts={fonts} />
            <InputField label={t('calculator.annual_rate')} value={annualRate} onChange={setAnnualRate} fonts={fonts} />
            <InputField label={t('calculator.years')} value={years} onChange={setYears} fonts={fonts} />
          </>
        );
      case 'savings_goal':
        return (
          <>
            <InputField label={t('calculator.target_amount')} value={targetAmount} onChange={setTargetAmount} fonts={fonts} />
            <InputField label={t('calculator.annual_rate')} value={annualRate} onChange={setAnnualRate} fonts={fonts} />
            <InputField label={t('calculator.years')} value={years} onChange={setYears} fonts={fonts} />
          </>
        );
      case 'roi':
        return (
          <>
            <InputField label={t('calculator.initial_investment')} value={initialInvestment} onChange={setInitialInvestment} fonts={fonts} />
            <InputField label={t('calculator.final_value')} value={finalValue} onChange={setFinalValue} fonts={fonts} />
          </>
        );
      case 'rule72':
        return (
          <InputField label={t('calculator.interest_rate')} value={annualRate} onChange={setAnnualRate} fonts={fonts} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: t(`calculator.${type}`) }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoButtons}>
          <Pressable
            style={[styles.infoBtn, showInfo && styles.infoBtnActive]}
            onPress={() => setShowInfo(!showInfo)}
          >
            <Ionicons name="help-circle-outline" size={18} color={showInfo ? '#fff' : Colors.primary} />
            <Text style={[styles.infoBtnText, { fontFamily: fonts.medium }, showInfo && styles.infoBtnTextActive]}>
              {t('calculator.what_is_this')}
            </Text>
          </Pressable>
        </View>

        {showInfo && (
          <View style={styles.infoCard}>
            <Text style={[styles.infoTitle, { fontFamily: fonts.semiBold }]}>
              {t('calculator.what_is_this')}
            </Text>
            <Text style={[styles.infoText, { fontFamily: fonts.regular }]}>
              {t(`calculator.${type}_what`)}
            </Text>
            <Text style={[styles.infoTitle, { fontFamily: fonts.semiBold, marginTop: 12 }]}>
              {t('calculator.why_useful')}
            </Text>
            <Text style={[styles.infoText, { fontFamily: fonts.regular }]}>
              {t(`calculator.${type}_why`)}
            </Text>
          </View>
        )}

        <View style={styles.inputCard}>
          {renderInputs()}
          <Pressable style={styles.calcBtn} onPress={handleCalculate}>
            <Ionicons name="calculator" size={20} color="#fff" />
            <Text style={[styles.calcBtnText, { fontFamily: fonts.semiBold }]}>
              {t('calculator.calculate')}
            </Text>
          </Pressable>
        </View>

        {result && (
          <View style={styles.resultCard}>
            <Text style={[styles.resultTitle, { fontFamily: fonts.semiBold }]}>
              {t('calculator.result')}
            </Text>
            {Object.entries(result).map(([key, value]) => (
              <View key={key} style={styles.resultRow}>
                <Text style={[styles.resultLabel, { fontFamily: fonts.regular }]}>
                  {t(`calculator.${key}`)}
                </Text>
                <Text style={[styles.resultValue, { fontFamily: fonts.bold }]}>
                  {value}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </>
  );
}

function InputField({ label, value, onChange, fonts }: { label: string; value: string; onChange: (v: string) => void; fonts: any }) {
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
  calcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 16,
    marginTop: 4,
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
  resultTitle: {
    fontSize: 18,
    color: Colors.primary,
    marginBottom: 16,
  },
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
});
