import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';

const menuItems = [
  { key: 'family', icon: 'people-outline' as const, route: '/family/', color: '#EC4899' },
  { key: 'settings', icon: 'settings-outline' as const, route: '/settings', color: '#6366F1' },
  { key: 'disclaimer', icon: 'information-circle-outline' as const, route: '/disclaimer', color: '#F59E0B' },
];

export default function MoreScreen() {
  const { t } = useTranslation();
  const fonts = useFont();
  const insets = useSafeAreaInsets();

  const handlePress = (route: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
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
        {t('more.title')}
      </Text>

      <View style={styles.menuCard}>
        {menuItems.map((item, index) => (
          <Pressable
            key={item.key}
            style={[
              styles.menuItem,
              index < menuItems.length - 1 && styles.menuItemBorder,
            ]}
            onPress={() => handlePress(item.route)}
          >
            <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            <Text style={[styles.menuText, { fontFamily: fonts.medium }]}>
              {t(`more.${item.key}`)}
            </Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
          </Pressable>
        ))}
      </View>

      <View style={styles.appInfo}>
        <Ionicons name="wallet" size={32} color={Colors.primary} />
        <Text style={[styles.appName, { fontFamily: fonts.bold }]}>{t('app_name')}</Text>
        <Text style={[styles.version, { fontFamily: fonts.regular }]}>{t('more.version')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 20 },
  title: { fontSize: 26, color: Colors.text, marginBottom: 20 },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    gap: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: { flex: 1, fontSize: 16, color: Colors.text },
  appInfo: {
    alignItems: 'center',
    marginTop: 48,
    gap: 6,
  },
  appName: { fontSize: 20, color: Colors.primary, marginTop: 8 },
  version: { fontSize: 13, color: Colors.textTertiary },
});
