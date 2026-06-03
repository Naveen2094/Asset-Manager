import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';

type CalculatorCard = {
  type: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  titleKey: string;
  route?: string;
  desc?: string;
};

const calculators: CalculatorCard[] = [
  { type: 'sip', icon: 'trending-up', color: '#0D7C5F', titleKey: 'sipCalculator' },
  { type: 'emi', icon: 'card', color: '#DC2626', titleKey: 'emiCalculator' },
  { type: 'compound', icon: 'analytics', color: '#3B82F6', titleKey: 'compoundCalculator' },
  { type: 'savings_goal', icon: 'flag', color: '#F59E0B', titleKey: 'savingsGoal' },
  { type: 'roi', icon: 'stats-chart', color: '#8B5CF6', titleKey: 'roiCalculator' },
  { type: 'rule72', icon: 'time', color: '#14B8A6', titleKey: 'rule72' },
  {
    type: 'fd',
    icon: 'wallet',
    color: '#0F766E',
    titleKey: 'fdCalculator',
    route: '/calculators/fd',
    desc: 'Calculate maturity value for fixed deposit investments.',
  },
  {
    type: 'rd',
    icon: 'calendar',
    color: '#1D4ED8',
    titleKey: 'rdCalculator',
    route: '/calculators/rd',
    desc: 'Estimate recurring deposit maturity and interest earned.',
  },
  {
    type: 'inflation',
    icon: 'trending-up',
    color: '#C2410C',
    titleKey: 'inflationCalculator',
    route: '/calculators/inflation',
    desc: 'Project future cost based on inflation over time.',
  },
  {
    type: 'gst',
    icon: 'receipt',
    color: '#7C3AED',
    titleKey: 'gstCalculator',
    route: '/calculators/gst',
    desc: 'Compute GST amount and final payable amount.',
  },
  {
    type: 'income_tax',
    icon: 'document-text',
    color: '#BE123C',
    titleKey: 'incomeTaxCalculator',
    route: '/calculators/income-tax',
    desc: 'Estimate annual tax using simplified India slabs.',
  },
  {
    type: 'retirement',
    icon: 'hourglass',
    color: '#0369A1',
    titleKey: 'retirementCalculator',
    route: '/calculators/retirement',
    desc: 'Forecast retirement corpus from yearly compounding.',
  },
];

export default function CalculatorsScreen() {
  const { t } = useTranslation();
  const fonts = useFont();
  const insets = useSafeAreaInsets();

  const handlePress = (type: string, route?: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (route) {
      router.push(route as any);
      return;
    }
    router.push({ pathname: '/calculator/[type]', params: { type } });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16),
          paddingBottom: 100,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { fontFamily: fonts.bold }]}>
        {t('calculator.title')}
      </Text>

      <View style={styles.grid}>
        {calculators.map((calc) => (
          <Pressable
            key={calc.type}
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => handlePress(calc.type, calc.route)}
          >
            <View style={[styles.iconBox, { backgroundColor: calc.color + '15' }]}>
              <Ionicons name={calc.icon} size={28} color={calc.color} />
            </View>
            <Text style={[styles.cardTitle, { fontFamily: fonts.semiBold }]}>
              {t(calc.titleKey)}
            </Text>
            <Text style={[styles.cardDesc, { fontFamily: fonts.regular }]} numberOfLines={2}>
              {calc.desc ?? t(`calculator.${calc.type}_desc`)}
            </Text>
            <View style={styles.arrowRow}>
              <Ionicons name="arrow-forward" size={16} color={calc.color} />
            </View>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 20 },
  title: { fontSize: 26, color: Colors.text, marginBottom: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: {
    width: '47%' as any,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardPressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: { fontSize: 15, color: Colors.text },
  cardDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },
  arrowRow: { alignItems: 'flex-end', marginTop: 4 },
});
