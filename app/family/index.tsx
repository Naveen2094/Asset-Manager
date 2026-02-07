import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform } from 'react-native';
import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';
import { useApp } from '@/lib/app-context';

export default function FamilyScreen() {
  const { t } = useTranslation();
  const fonts = useFont();
  const { familyMembers, deleteFamilyMember } = useApp();

  const handleDelete = (id: string, name: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      t('family.confirm_delete'),
      name,
      [
        { text: t('family.no'), style: 'cancel' },
        {
          text: t('family.yes'),
          style: 'destructive',
          onPress: () => deleteFamilyMember(id),
        },
      ],
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: t('family.title') }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {familyMembers.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={56} color={Colors.textTertiary} />
            <Text style={[styles.emptyTitle, { fontFamily: fonts.semiBold }]}>
              {t('family.no_members')}
            </Text>
            <Text style={[styles.emptyText, { fontFamily: fonts.regular }]}>
              {t('family.add_first')}
            </Text>
          </View>
        ) : (
          <View style={styles.membersList}>
            {familyMembers.map((member) => (
              <View key={member.id} style={styles.memberCard}>
                <View style={styles.memberAvatar}>
                  <Ionicons name="person" size={22} color={Colors.primary} />
                </View>
                <View style={styles.memberInfo}>
                  <Text style={[styles.memberName, { fontFamily: fonts.semiBold }]}>{member.name}</Text>
                  <Text style={[styles.memberDetail, { fontFamily: fonts.regular }]}>
                    {t(`family.${member.relationship}`)} | {member.age} {t('common.years_label')}
                  </Text>
                  {member.income ? (
                    <Text style={[styles.memberIncome, { fontFamily: fonts.medium }]}>
                      ₹{member.income.toLocaleString('en-IN')}{t('common.per_month')}
                    </Text>
                  ) : null}
                  {member.occupation ? (
                    <Text style={[styles.memberOcc, { fontFamily: fonts.regular }]}>
                      {t(`schemes.${member.occupation}`)}
                    </Text>
                  ) : null}
                </View>
                <Pressable
                  onPress={() => handleDelete(member.id, member.name)}
                  hitSlop={12}
                >
                  <Ionicons name="trash-outline" size={20} color={Colors.error} />
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <Pressable
          style={styles.addBtn}
          onPress={() => {
            if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push('/family/add');
          }}
        >
          <Ionicons name="add-circle" size={22} color="#fff" />
          <Text style={[styles.addBtnText, { fontFamily: fonts.semiBold }]}>
            {t('family.add_member')}
          </Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 20, paddingBottom: 40 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  emptyTitle: { fontSize: 18, color: Colors.text, marginTop: 8 },
  emptyText: { fontSize: 14, color: Colors.textTertiary },
  membersList: { gap: 10 },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 16, color: Colors.text },
  memberDetail: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  memberIncome: { fontSize: 13, color: Colors.primary, marginTop: 3 },
  memberOcc: { fontSize: 12, color: Colors.textTertiary, marginTop: 1 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
  },
  addBtnText: { fontSize: 16, color: '#fff' },
});
