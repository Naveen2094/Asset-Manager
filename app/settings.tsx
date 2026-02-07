import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';
import { saveLanguagePreference } from '@/lib/app-context';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const fonts = useFont();

  const switchLanguage = async (lang: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await i18n.changeLanguage(lang);
    await saveLanguagePreference(lang);
  };

  const handleReset = () => {
    Alert.alert(
      t('settings.reset_data'),
      t('settings.reset_confirm'),
      [
        { text: t('family.no'), style: 'cancel' },
        {
          text: t('family.yes'),
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ],
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: t('settings.title') }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { fontFamily: fonts.semiBold }]}>
          {t('settings.language')}
        </Text>

        <View style={styles.langCard}>
          <Pressable
            style={[styles.langOption, i18n.language === 'ta' && styles.langOptionActive]}
            onPress={() => switchLanguage('ta')}
          >
            <Text style={[styles.langFlag, { fontFamily: fonts.bold }]}>த</Text>
            <View style={styles.langInfo}>
              <Text style={[styles.langName, { fontFamily: fonts.semiBold }, i18n.language === 'ta' && styles.langNameActive]}>
                தமிழ்
              </Text>
              <Text style={[styles.langSub, { fontFamily: fonts.regular }]}>Tamil</Text>
            </View>
            {i18n.language === 'ta' && <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />}
          </Pressable>

          <View style={styles.langDivider} />

          <Pressable
            style={[styles.langOption, i18n.language === 'en' && styles.langOptionActive]}
            onPress={() => switchLanguage('en')}
          >
            <Text style={[styles.langFlag, { fontFamily: fonts.bold }]}>A</Text>
            <View style={styles.langInfo}>
              <Text style={[styles.langName, { fontFamily: fonts.semiBold }, i18n.language === 'en' && styles.langNameActive]}>
                English
              </Text>
              <Text style={[styles.langSub, { fontFamily: fonts.regular }]}>ஆங்கிலம்</Text>
            </View>
            {i18n.language === 'en' && <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />}
          </Pressable>
        </View>

        <Pressable style={styles.dangerBtn} onPress={handleReset}>
          <Ionicons name="trash-outline" size={20} color={Colors.error} />
          <Text style={[styles.dangerBtnText, { fontFamily: fonts.medium }]}>
            {t('settings.reset_data')}
          </Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, color: Colors.text, marginBottom: 12 },
  langCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 32,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },
  langOptionActive: { backgroundColor: Colors.primaryLight },
  langDivider: { height: 1, backgroundColor: Colors.borderLight },
  langFlag: {
    fontSize: 20,
    color: Colors.accent,
    width: 40,
    height: 40,
    textAlign: 'center',
    lineHeight: 40,
    backgroundColor: Colors.accentLight,
    borderRadius: 10,
    overflow: 'hidden',
  },
  langInfo: { flex: 1 },
  langName: { fontSize: 16, color: Colors.text },
  langNameActive: { color: Colors.primary },
  langSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 1 },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    padding: 16,
  },
  dangerBtnText: { fontSize: 15, color: Colors.error },
});
