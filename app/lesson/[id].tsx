import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';
import { lessons } from '@/lib/lessons-data';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const fonts = useFont();
  const isTamil = i18n.language === 'ta';
  const lesson = lessons.find(l => l.id === id);

  if (!lesson) return null;

  const content = isTamil ? lesson.content_ta : lesson.content_en;
  const example = isTamil ? lesson.example_ta : lesson.example_en;

  const handleCalculator = () => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (lesson.relatedCalculator) {
      router.push({ pathname: '/calculator/[type]', params: { type: lesson.relatedCalculator } });
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: isTamil ? lesson.title_ta : lesson.title_en }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.iconBox, { backgroundColor: lesson.color + '15' }]}>
          <Ionicons name={lesson.icon as any} size={36} color={lesson.color} />
        </View>

        <Text style={[styles.title, { fontFamily: fonts.bold }]}>
          {isTamil ? lesson.title_ta : lesson.title_en}
        </Text>

        <View style={styles.contentCard}>
          {content.map((paragraph, i) => (
            <View key={i} style={styles.paragraph}>
              <View style={[styles.bullet, { backgroundColor: lesson.color }]} />
              <Text style={[styles.paragraphText, { fontFamily: fonts.regular }]}>
                {paragraph}
              </Text>
            </View>
          ))}
        </View>

        {example && (
          <View style={[styles.exampleCard, { borderLeftColor: lesson.color }]}>
            <Ionicons name="bulb" size={20} color={lesson.color} />
            <Text style={[styles.exampleText, { fontFamily: fonts.medium }]}>
              {example}
            </Text>
          </View>
        )}

        {lesson.relatedCalculator && (
          <Pressable style={styles.calcBtn} onPress={handleCalculator}>
            <Ionicons name="calculator" size={20} color={Colors.primary} />
            <Text style={[styles.calcBtnText, { fontFamily: fonts.semiBold }]}>
              {t('learn.try_calculator')}
            </Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
          </Pressable>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40 },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 22, color: Colors.text, textAlign: 'center', marginBottom: 24 },
  contentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  paragraph: { flexDirection: 'row', gap: 12 },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
  },
  paragraphText: { fontSize: 15, color: Colors.text, lineHeight: 24, flex: 1 },
  exampleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.accentLight,
    borderRadius: 16,
    padding: 18,
    marginTop: 16,
    borderLeftWidth: 4,
  },
  exampleText: { fontSize: 14, color: Colors.text, lineHeight: 22, flex: 1 },
  calcBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primaryLight,
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
  },
  calcBtnText: { fontSize: 16, color: Colors.primary },
});
