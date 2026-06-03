import React from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';
import { lessons } from '@/lib/lessons-data';

export default function LessonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { i18n } = useTranslation();
  const fonts = useFont();
  const insets = useSafeAreaInsets();
  const isTamil = i18n.language.startsWith('ta');

  const lesson = lessons.find((l) => l.id === id);

  if (!lesson) {
    return null;
  }

  const title = isTamil ? lesson.title_ta : lesson.title_en;
  const content = isTamil ? lesson.content_ta : lesson.content_en;
  const video = isTamil ? lesson.video_ta : lesson.video_en;
  const videoId = video.url.split('youtu.be/')[1];
  const thumbnail = `https://img.youtube.com/vi/${videoId}/0.jpg`;

  const handleVideoPress = async (url: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title }} />

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
        <Text style={[styles.title, { fontFamily: fonts.bold }]}>{title}</Text>

        <View style={styles.textCard}>
          <Text style={[styles.description, { fontFamily: fonts.regular }]}>{content}</Text>
        </View>

        <Pressable style={styles.videoCard} onPress={() => handleVideoPress(video.url)}>
          <Image source={{ uri: thumbnail }} style={styles.videoThumbnail} />

          <View style={styles.videoInfo}>
            <Text style={[styles.videoTitle, { fontFamily: fonts.semiBold }]}>
              {video.title}
            </Text>
            <Text style={[styles.watchText, { fontFamily: fonts.regular }]}>
              {isTamil ? 'YouTube இல் பார்க்க' : 'Watch on YouTube'}
            </Text>
          </View>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 20 },
  title: { fontSize: 26, color: Colors.text },
  textCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.text,
  },
  videoCard: {
    marginTop: 20,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  videoThumbnail: {
    width: '100%',
    height: 180,
  },
  videoInfo: { flex: 1 },
  videoTitle: {
    fontSize: 16,
    padding: 12,
    color: Colors.text,
  },
  watchText: {
    fontSize: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
    color: Colors.textSecondary,
  },
});
