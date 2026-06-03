import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';
import { saveLanguagePreference } from '@/lib/app-context';
import { useExpenses } from '@/lib/expense-context';

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const fonts = useFont();
  const router = useRouter();
  const isTamil = i18n.language === 'ta';
  const { entries } = useExpenses();

  const switchLanguage = async (lang: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await i18n.changeLanguage(lang);
    await saveLanguagePreference(lang);
  };

  const confirmAction = (title: string, message: string, onConfirm: () => void) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(title, message, [
      { text: isTamil ? 'இல்லை' : 'Cancel', style: 'cancel' },
      { text: isTamil ? 'நீக்கு' : 'Clear', style: 'destructive', onPress: onConfirm },
    ]);
  };

  const handleClearExpenses = () => {
    confirmAction(
      isTamil ? 'செலவுகள் நீக்கவுமா?' : 'Clear Expenses',
      isTamil ? 'அனைத்து வரவு செலவு பதிவுகளும் நீக்கப்படும்.' : 'All income and expense entries will be deleted.',
      async () => {
        await AsyncStorage.removeItem('@nidhi_expenses');
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          isTamil ? 'நீக்கப்பட்டது' : 'Cleared',
          isTamil ? 'செலவு பதிவுகள் நீக்கப்பட்டன.' : 'Expense entries have been cleared.'
        );
      }
    );
  };

  const handleClearChat = () => {
    confirmAction(
      isTamil ? 'அரட்டை வரலாறு நீக்கவுமா?' : 'Clear Chat History',
      isTamil ? 'அனைத்து அரட்டை செய்திகளும் நீக்கப்படும்.' : 'All chat messages will be deleted.',
      async () => {
        await AsyncStorage.removeItem('@nidhi_chat_history');
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          isTamil ? 'நீக்கப்பட்டது' : 'Cleared',
          isTamil ? 'அரட்டை வரலாறு நீக்கப்பட்டது.' : 'Chat history has been cleared.'
        );
      }
    );
  };

  const handleResetApp = () => {
    confirmAction(
      isTamil ? 'முழு ரீசெட்?' : 'Reset App',
      isTamil
        ? 'குடும்பம், செலவுகள், அரட்டை — அனைத்தும் நீக்கப்படும். இது செயல்தவிர்க்க முடியாது.'
        : 'Family members, expenses, chat history — everything will be deleted. This cannot be undone.',
      async () => {
        await AsyncStorage.clear();
        if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/onboarding/language' as any);
      }
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: isTamil ? 'அமைப்புகள்' : 'Settings',
          headerShown: true,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={{ paddingHorizontal: 8 }}>
              <Ionicons name="arrow-back" size={24} color={Colors.primary} />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* Language Section */}
        <Text style={[styles.sectionTitle, { fontFamily: fonts.semiBold }]}>
          {isTamil ? 'மொழி' : 'Language'}
        </Text>
        <View style={styles.card}>
          <Pressable
            style={[styles.langOption, i18n.language === 'ta' && styles.langOptionActive]}
            onPress={() => switchLanguage('ta')}
          >
            <Text style={[styles.langFlag, { fontFamily: fonts.bold }]}>த</Text>
            <View style={styles.langInfo}>
              <Text style={[styles.langName, { fontFamily: fonts.semiBold },
                i18n.language === 'ta' && styles.langNameActive]}>
                தமிழ்
              </Text>
              <Text style={[styles.langSub, { fontFamily: fonts.regular }]}>Tamil</Text>
            </View>
            {i18n.language === 'ta' && <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />}
          </Pressable>
          <View style={styles.divider} />
          <Pressable
            style={[styles.langOption, i18n.language === 'en' && styles.langOptionActive]}
            onPress={() => switchLanguage('en')}
          >
            <Text style={[styles.langFlag, { fontFamily: fonts.bold }]}>A</Text>
            <View style={styles.langInfo}>
              <Text style={[styles.langName, { fontFamily: fonts.semiBold },
                i18n.language === 'en' && styles.langNameActive]}>
                English
              </Text>
              <Text style={[styles.langSub, { fontFamily: fonts.regular }]}>ஆங்கிலம்</Text>
            </View>
            {i18n.language === 'en' && <Ionicons name="checkmark-circle" size={24} color={Colors.primary} />}
          </Pressable>
        </View>

        {/* Data Section */}
        <Text style={[styles.sectionTitle, { fontFamily: fonts.semiBold }]}>
          {isTamil ? 'தரவு நிர்வாகம்' : 'Data Management'}
        </Text>
        <View style={styles.card}>

          {/* Expenses count info */}
          <View style={styles.infoRow}>
            <Ionicons name="wallet-outline" size={20} color={Colors.primary} />
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { fontFamily: fonts.medium }]}>
                {isTamil ? 'சேமித்த பதிவுகள்' : 'Saved Entries'}
              </Text>
              <Text style={[styles.infoValue, { fontFamily: fonts.regular }]}>
                {entries.length} {isTamil ? 'பதிவுகள்' : 'entries'}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />

          <Pressable style={styles.actionRow} onPress={handleClearExpenses}>
            <Ionicons name="wallet-outline" size={20} color={Colors.warning} />
            <View style={styles.actionText}>
              <Text style={[styles.actionLabel, { fontFamily: fonts.medium }]}>
                {isTamil ? 'செலவுகள் நீக்கு' : 'Clear Expenses'}
              </Text>
              <Text style={[styles.actionSub, { fontFamily: fonts.regular }]}>
                {isTamil ? 'அனைத்து வரவு செலவு பதிவுகள்' : 'All income & expense entries'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
          </Pressable>
          <View style={styles.divider} />

          <Pressable style={styles.actionRow} onPress={handleClearChat}>
            <Ionicons name="chatbubble-outline" size={20} color={Colors.warning} />
            <View style={styles.actionText}>
              <Text style={[styles.actionLabel, { fontFamily: fonts.medium }]}>
                {isTamil ? 'அரட்டை வரலாறு நீக்கு' : 'Clear Chat History'}
              </Text>
              <Text style={[styles.actionSub, { fontFamily: fonts.regular }]}>
                {isTamil ? 'சேமித்த அரட்டை செய்திகள்' : 'Saved chat messages'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
          </Pressable>
        </View>

        {/* App Info Section */}
        <Text style={[styles.sectionTitle, { fontFamily: fonts.semiBold }]}>
          {isTamil ? 'பயன்பாடு பற்றி' : 'About'}
        </Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.primary} />
            <View style={styles.infoText}>
              <Text style={[styles.infoLabel, { fontFamily: fonts.medium }]}>
                {isTamil ? 'பதிப்பு' : 'Version'}
              </Text>
              <Text style={[styles.infoValue, { fontFamily: fonts.regular }]}>{APP_VERSION}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <Pressable style={styles.actionRow} onPress={() => router.push('/disclaimer' as any)}>
            <Ionicons name="shield-checkmark-outline" size={20} color={Colors.primary} />
            <View style={styles.actionText}>
              <Text style={[styles.actionLabel, { fontFamily: fonts.medium }]}>
                {isTamil ? 'மறுப்பு' : 'Disclaimer'}
              </Text>
              <Text style={[styles.actionSub, { fontFamily: fonts.regular }]}>
                {isTamil ? 'சட்ட தகவல்' : 'Legal information'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
          </Pressable>
        </View>

        {/* Danger Zone */}
        <Text style={[styles.sectionTitle, { fontFamily: fonts.semiBold, color: Colors.error }]}>
          {isTamil ? 'ஆபத்து மண்டலம்' : 'Danger Zone'}
        </Text>
        <Pressable style={styles.dangerBtn} onPress={handleResetApp}>
          <Ionicons name="refresh-outline" size={20} color={Colors.error} />
          <View style={styles.actionText}>
            <Text style={[styles.dangerLabel, { fontFamily: fonts.semiBold }]}>
              {isTamil ? 'பயன்பாட்டை மீட்டமை' : 'Reset App'}
            </Text>
            <Text style={[styles.actionSub, { fontFamily: fonts.regular }]}>
              {isTamil ? 'அனைத்தையும் நீக்கி மீண்டும் தொடங்கு' : 'Wipe everything and restart'}
            </Text>
          </View>
        </Pressable>

      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 60 },
  sectionTitle: {
    fontSize: 13, color: Colors.textSecondary,
    marginBottom: 10, marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.surface, borderRadius: 18,
    borderWidth: 1, borderColor: Colors.borderLight,
    overflow: 'hidden', marginBottom: 24,
  },
  divider: { height: 1, backgroundColor: Colors.borderLight },
  langOption: {
    flexDirection: 'row', alignItems: 'center',
    padding: 18, gap: 14,
  },
  langOptionActive: { backgroundColor: Colors.primaryLight },
  langFlag: {
    fontSize: 20, color: Colors.accent, width: 40, height: 40,
    textAlign: 'center', lineHeight: 40,
    backgroundColor: Colors.accentLight, borderRadius: 10, overflow: 'hidden',
  },
  langInfo: { flex: 1 },
  langName: { fontSize: 16, color: Colors.text },
  langNameActive: { color: Colors.primary },
  langSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 1 },
  infoRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 18, gap: 14,
  },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 15, color: Colors.text },
  infoValue: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  actionRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 18, gap: 14,
  },
  actionText: { flex: 1 },
  actionLabel: { fontSize: 15, color: Colors.text },
  actionSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  dangerBtn: {
    flexDirection: 'row', alignItems: 'center',
    gap: 14, backgroundColor: '#FEE2E2',
    borderRadius: 18, padding: 18,
    borderWidth: 1, borderColor: '#FECACA',
    marginBottom: 24,
  },
  dangerLabel: { fontSize: 15, color: Colors.error },
});
