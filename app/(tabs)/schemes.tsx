import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Linking } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';
import { schemes } from '@/lib/schemes-data';
import { useApp } from '@/lib/app-context';

const categories = [
  { key: 'all', label_ta: 'அனைத்தும்', label_en: 'All' },
  { key: 'health', label_ta: 'சுகாதாரம்', label_en: 'Health' },
  { key: 'education', label_ta: 'கல்வி', label_en: 'Education' },
  { key: 'women', label_ta: 'பெண்கள்', label_en: 'Women' },
  { key: 'farmer', label_ta: 'விவசாயம்', label_en: 'Farming' },
  { key: 'senior', label_ta: 'மூத்தோர்', label_en: 'Senior' },
  { key: 'savings', label_ta: 'சேமிப்பு', label_en: 'Savings' },
];

export default function SchemesScreen() {
  const { t, i18n } = useTranslation();
  const fonts = useFont();
  const insets = useSafeAreaInsets();
  const { familyMembers } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const isTamil = i18n.language === 'ta';

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return schemes;
    return schemes.filter(s => s.category === activeCategory);
  }, [activeCategory]);

  const handleScheme = (id: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/scheme/[id]', params: { id } });
  };

  const handleOpenLink = (link?: string) => {
    if (link) {
      Linking.openURL(link);
    }
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
        {t('schemes.title')}
      </Text>
      <Text style={[styles.subtitle, { fontFamily: fonts.regular }]}>
        {t('schemes.subtitle')}
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipScroll}
      >
        {categories.map((cat) => (
          <Pressable
            key={cat.key}
            style={[styles.chip, activeCategory === cat.key && styles.chipActive]}
            onPress={() => setActiveCategory(cat.key)}
          >
            <Text style={[
              styles.chipText,
              { fontFamily: fonts.medium },
              activeCategory === cat.key && styles.chipTextActive,
            ]}>
              {isTamil ? cat.label_ta : cat.label_en}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.schemesList}>
        {filtered.map((scheme) => (
          <Pressable
            key={scheme.id}
            style={({ pressed }) => [styles.schemeCard, pressed && styles.schemeCardPressed]}
            onPress={() => handleScheme(scheme.id)}
          >
            <View style={[styles.schemeIcon, { backgroundColor: scheme.color + '15' }]}>
              <Ionicons name={scheme.icon as any} size={24} color={scheme.color} />
            </View>
            <View style={styles.schemeInfo}>
              <Text style={[styles.schemeName, { fontFamily: fonts.semiBold }]} numberOfLines={2}>
                {isTamil ? scheme.name_ta : scheme.name_en}
              </Text>
              <Text style={[styles.schemeBenefit, { fontFamily: fonts.regular }]} numberOfLines={2}>
                {isTamil ? scheme.benefits_ta : scheme.benefits_en}
              </Text>
              <Pressable
                onPress={(event) => {
                  event.stopPropagation?.();
                  handleOpenLink(scheme.link);
                }}
                style={styles.linkButton}
              >
                <Text style={[styles.linkText, { fontFamily: fonts.medium }]}>Visit Official Portal</Text>
              </Pressable>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 20 },
  title: { fontSize: 26, color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4, marginBottom: 16 },
  chipScroll: { marginBottom: 20 },
  chips: { gap: 8, paddingRight: 20 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.textSecondary },
  chipTextActive: { color: '#fff' },
  schemesList: { gap: 10 },
  schemeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  schemeCardPressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  schemeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  schemeInfo: { flex: 1 },
  schemeName: { fontSize: 15, color: Colors.text, marginBottom: 3 },
  schemeBenefit: { fontSize: 12, color: Colors.textSecondary },
  linkButton: {
    marginTop: 8,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  linkText: {
    color: '#2563EB',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});
