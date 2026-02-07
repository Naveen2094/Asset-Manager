import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';

const calculators = [
  { type: 'sip', icon: 'trending-up', color: '#0D7C5F' },
  { type: 'emi', icon: 'card', color: '#DC2626' },
  { type: 'compound', icon: 'analytics', color: '#3B82F6' },
  { type: 'savings_goal', icon: 'flag', color: '#F59E0B' },
  { type: 'roi', icon: 'stats-chart', color: '#8B5CF6' },
  { type: 'rule72', icon: 'time', color: '#14B8A6' },
];

export default function CalculatorsScreen() {
  const { t } = useTranslation();
  const fonts = useFont();
  const insets = useSafeAreaInsets();

  const handlePress = (type: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
            onPress={() => handlePress(calc.type)}
          >
            <View style={[styles.iconBox, { backgroundColor: calc.color + '15' }]}>
              <Ionicons name={calc.icon as any} size={28} color={calc.color} />
            </View>
            <Text style={[styles.cardTitle, { fontFamily: fonts.semiBold }]}>
              {t(`calculator.${calc.type}`)}
            </Text>
            <Text style={[styles.cardDesc, { fontFamily: fonts.regular }]} numberOfLines={2}>
              {t(`calculator.${calc.type}_desc`)}
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
