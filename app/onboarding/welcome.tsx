import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';
import { LinearGradient } from 'expo-linear-gradient';

const features = [
  { icon: 'calculator' as const, iconSet: 'ionicons', key: 'purpose_1' },
  { icon: 'file-document-outline' as const, iconSet: 'mci', key: 'purpose_2' },
  { icon: 'school' as const, iconSet: 'ionicons', key: 'purpose_3' },
  { icon: 'people' as const, iconSet: 'ionicons', key: 'purpose_4' },
];

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const fonts = useFont();
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/family-setup');
  };

  return (
    <LinearGradient colors={['#0D7C5F', '#095E48', '#064434']} style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 40) }]}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="wallet" size={40} color={Colors.accent} />
          </View>
          <Text style={[styles.appName, { fontFamily: fonts.bold }]}>
            {t('app_name')}
          </Text>
          <Text style={[styles.title, { fontFamily: fonts.bold }]}>
            {t('onboarding.purpose_title')}
          </Text>
        </View>

        <View style={styles.features}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: `rgba(212, 160, 23, ${0.15 + index * 0.05})` }]}>
                {feature.iconSet === 'mci' ? (
                  <MaterialCommunityIcons name={feature.icon as any} size={24} color={Colors.accent} />
                ) : (
                  <Ionicons name={feature.icon as any} size={24} color={Colors.accent} />
                )}
              </View>
              <Text style={[styles.featureText, { fontFamily: fonts.medium }]}>
                {t(`onboarding.${feature.key}`)}
              </Text>
            </View>
          ))}
        </View>

        <Pressable style={styles.nextBtn} onPress={handleNext}>
          <Text style={[styles.nextBtnText, { fontFamily: fonts.semiBold }]}>
            {t('onboarding.next')}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    color: Colors.accent,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
  },
  features: { gap: 12 },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 18,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 16,
    padding: 18,
    marginTop: 40,
  },
  nextBtnText: {
    fontSize: 18,
    color: '#fff',
  },
});
