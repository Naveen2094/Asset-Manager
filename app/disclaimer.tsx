import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';

export default function DisclaimerScreen() {
  const { t } = useTranslation();
  const fonts = useFont();

  return (
    <>
      <Stack.Screen options={{ title: t('disclaimer.title') }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconBox}>
          <Ionicons name="information-circle" size={48} color={Colors.warning} />
        </View>
        <Text style={[styles.title, { fontFamily: fonts.bold }]}>
          {t('disclaimer.title')}
        </Text>
        <View style={styles.card}>
          <Text style={[styles.text, { fontFamily: fonts.regular }]}>
            {t('disclaimer.text')}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40, alignItems: 'center' },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.accentLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  title: { fontSize: 22, color: Colors.text, marginBottom: 20 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    width: '100%',
  },
  text: { fontSize: 15, color: Colors.textSecondary, lineHeight: 26 },
});
