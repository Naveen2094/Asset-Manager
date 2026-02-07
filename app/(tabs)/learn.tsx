import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';
import { lessons } from '@/lib/lessons-data';

export default function LearnScreen() {
  const { t, i18n } = useTranslation();
  const fonts = useFont();
  const insets = useSafeAreaInsets();
  const isTamil = i18n.language === 'ta';

  const handleLesson = (id: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/lesson/[id]', params: { id } });
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
        {t('learn.title')}
      </Text>
      <Text style={[styles.subtitle, { fontFamily: fonts.regular }]}>
        {t('learn.subtitle')}
      </Text>

      <View style={styles.lessonsList}>
        {lessons.map((lesson, index) => (
          <Pressable
            key={lesson.id}
            style={({ pressed }) => [styles.lessonCard, pressed && styles.lessonCardPressed]}
            onPress={() => handleLesson(lesson.id)}
          >
            <View style={[styles.lessonIcon, { backgroundColor: lesson.color + '15' }]}>
              <Ionicons name={lesson.icon as any} size={24} color={lesson.color} />
            </View>
            <View style={styles.lessonInfo}>
              <View style={styles.lessonHeader}>
                <Text style={[styles.lessonNum, { fontFamily: fonts.medium }]}>
                  {t('learn.lesson')} {index + 1}
                </Text>
                <View style={styles.beginnerBadge}>
                  <Text style={[styles.beginnerText, { fontFamily: fonts.medium }]}>
                    {t('learn.beginner')}
                  </Text>
                </View>
              </View>
              <Text style={[styles.lessonTitle, { fontFamily: fonts.semiBold }]} numberOfLines={2}>
                {isTamil ? lesson.title_ta : lesson.title_en}
              </Text>
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
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginTop: 4, marginBottom: 20 },
  lessonsList: { gap: 10 },
  lessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  lessonCardPressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  lessonIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lessonInfo: { flex: 1 },
  lessonHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  lessonNum: { fontSize: 12, color: Colors.textTertiary },
  beginnerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: Colors.primaryLight,
  },
  beginnerText: { fontSize: 10, color: Colors.primary },
  lessonTitle: { fontSize: 15, color: Colors.text },
});
