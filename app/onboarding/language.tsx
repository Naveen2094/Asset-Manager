import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { saveLanguagePreference } from '@/lib/app-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function LanguageScreen() {
  const { i18n } = useTranslation();
  const [selected, setSelected] = useState(i18n.language);
  const insets = useSafeAreaInsets();

  const selectLanguage = async (lang: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected(lang);
    await i18n.changeLanguage(lang);
    await saveLanguagePreference(lang);
  };

  const handleContinue = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/welcome');
  };

  return (
    <LinearGradient colors={['#0D7C5F', '#095E48', '#064434']} style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 40) }]}>
        <View style={styles.iconContainer}>
          <Ionicons name="language" size={48} color={Colors.accent} />
        </View>
        <Text style={styles.title}>Choose Language</Text>
        <Text style={styles.titleTamil}>மொழியைத் தேர்வுசெய்க</Text>
        <Text style={styles.subtitle}>You can change anytime / நீங்கள் எந்த நேரத்திலும் மாற்றலாம்</Text>

        <View style={styles.options}>
          <Pressable
            style={[styles.langCard, selected === 'ta' && styles.langCardSelected]}
            onPress={() => selectLanguage('ta')}
          >
            <View style={styles.langContent}>
              <Text style={styles.langFlag}>த</Text>
              <View>
                <Text style={[styles.langName, selected === 'ta' && styles.langNameSelected]}>தமிழ்</Text>
                <Text style={[styles.langSub, selected === 'ta' && styles.langSubSelected]}>Tamil</Text>
              </View>
            </View>
            {selected === 'ta' && <Ionicons name="checkmark-circle" size={28} color={Colors.primary} />}
          </Pressable>

          <Pressable
            style={[styles.langCard, selected === 'en' && styles.langCardSelected]}
            onPress={() => selectLanguage('en')}
          >
            <View style={styles.langContent}>
              <Text style={styles.langFlag}>A</Text>
              <View>
                <Text style={[styles.langName, selected === 'en' && styles.langNameSelected]}>English</Text>
                <Text style={[styles.langSub, selected === 'en' && styles.langSubSelected]}>ஆங்கிலம்</Text>
              </View>
            </View>
            {selected === 'en' && <Ionicons name="checkmark-circle" size={28} color={Colors.primary} />}
          </Pressable>
        </View>

        <Pressable style={styles.continueBtn} onPress={handleContinue}>
          <Text style={styles.continueBtnText}>
            {selected === 'ta' ? 'தொடர்க' : 'Continue'}
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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
    textAlign: 'center',
  },
  titleTamil: {
    fontSize: 24,
    fontFamily: 'NotoSansTamil_700Bold',
    color: Colors.accent,
    textAlign: 'center',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  options: { gap: 16 },
  langCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  langCardSelected: {
    backgroundColor: '#fff',
    borderColor: Colors.accent,
  },
  langContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  langFlag: {
    fontSize: 28,
    fontFamily: 'Inter_700Bold',
    color: Colors.accent,
    width: 44,
    height: 44,
    textAlign: 'center',
    lineHeight: 44,
    backgroundColor: Colors.accentLight,
    borderRadius: 12,
    overflow: 'hidden',
  },
  langName: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
  },
  langNameSelected: { color: Colors.text },
  langSub: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  langSubSelected: { color: Colors.textSecondary },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 16,
    padding: 18,
    marginTop: 40,
  },
  continueBtnText: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
  },
});
