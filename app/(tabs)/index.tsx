import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';
import { useApp } from '@/lib/app-context';
import { financeTips } from '@/lib/finance-tips';
import { useExpenses } from '@/lib/expense-context';

const quickActions = [
  { key: 'expenses', icon: 'wallet' as const, route: '/expenses', color: '#10B981' },
  { key: 'budget', icon: 'bar-chart' as const, route: '/budget', color: '#8B5CF6' },
  { key: 'calculators', icon: 'calculator' as const, route: '/(tabs)/calculators', color: '#3B82F6' },
  { key: 'govt_schemes', icon: 'document-text' as const, route: '/(tabs)/schemes', color: '#8B5CF6' },
  { key: 'learn_finance', icon: 'book' as const, route: '/(tabs)/learn', color: '#F59E0B' },
  { key: 'family_manage', icon: 'people' as const, route: '/family/', color: '#EC4899' },
];

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const fonts = useFont();
  const insets = useSafeAreaInsets();
  const { familyMembers } = useApp();
  const { getCurrentMonthSummary } = useExpenses();
  const expenseSummary = getCurrentMonthSummary();
  const isTamil = i18n.language === 'ta';

  const totalIncome = expenseSummary.totalIncome;
  const [tip] = useState(() => {
    const randomIndex = Math.floor(Math.random() * financeTips.length);
    return financeTips[randomIndex];
  });
  const tipText = isTamil ? tip.ta : tip.en;

  const handleAction = (route: string) => {
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
      <LinearGradient
        colors={[Colors.cardGradientStart, Colors.cardGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroTop}>
          <View>
            <Text style={[styles.greeting, { fontFamily: fonts.semiBold }]}>
              {t('home.greeting')}
            </Text>
            <Text style={[styles.dashTitle, { fontFamily: fonts.bold }]}>
              {t('home.dashboard_title')}
            </Text>
          </View>
          <Pressable style={styles.settingsBtn} onPress={() => router.push('/settings' as any)}>
            <Ionicons name="settings-outline" size={22} color="rgba(255,255,255,0.8)" />
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={18} color="rgba(255,255,255,0.8)" />
            <Text style={[styles.statValue, { fontFamily: fonts.bold }]}>
              {familyMembers.length}
            </Text>
            <Text style={[styles.statLabel, { fontFamily: fonts.regular }]}>
              {t('home.family_members')}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="wallet-outline" size={18} color="rgba(255,255,255,0.8)" />
            <Text style={[styles.statValue, { fontFamily: fonts.bold }]}>
              {totalIncome > 0 ? `₹${totalIncome.toLocaleString('en-IN')}` : '--'}
            </Text>
            <Text style={[styles.statLabel, { fontFamily: fonts.regular }]}>
              {t('home.total_income')}
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="trending-down-outline" size={18} color="rgba(255,255,255,0.8)" />
            <Text style={[styles.statValue, { fontFamily: fonts.bold }]}>
              {expenseSummary.totalExpenses > 0 ? `₹${expenseSummary.totalExpenses.toLocaleString('en-IN')}` : '--'}
            </Text>
            <Text style={[styles.statLabel, { fontFamily: fonts.regular }]}>
              {i18n.language?.startsWith('ta') ? 'மொத்த செலவு' : 'Expenses'}
            </Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.tipCard}>
        <Text style={[styles.tipTitle, { fontFamily: fonts.semiBold }]}>
          💡 {t('tipOfDay')}
        </Text>
        <Text style={[styles.tipText, { fontFamily: fonts.regular }]}>
          {tipText}
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { fontFamily: fonts.semiBold }]}>
        {t('home.quick_actions')}
      </Text>

      <View style={styles.actionsGrid}>
        {quickActions.map((action) => (
          <Pressable
            key={action.key}
            style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
            onPress={() => handleAction(action.route)}
          >
            <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
              <Ionicons name={action.icon} size={24} color={action.color} />
            </View>
            <Text style={[styles.actionText, { fontFamily: fonts.medium }]}>
              {action.key === 'expenses'
                ? (i18n.language?.startsWith('ta') ? 'வரவு செலவு' : 'Expenses')
                : action.key === 'budget'
                ? (i18n.language?.startsWith('ta') ? 'பட்ஜெட்' : 'Budget')
                : t(`home.${action.key}`)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { fontFamily: fonts.semiBold }]}>
        {t('home.family_members')}
      </Text>

      {familyMembers.length === 0 ? (
        <Pressable style={styles.emptyCard} onPress={() => router.push('/family/' as any)}>
          <Ionicons name="person-add-outline" size={32} color={Colors.textTertiary} />
          <Text style={[styles.emptyText, { fontFamily: fonts.regular }]}>
            {t('home.no_members')}
          </Text>
          <Text style={[styles.emptyAction, { fontFamily: fonts.medium }]}>
            {t('home.add_family')}
          </Text>
        </Pressable>
      ) : (
        <View style={styles.membersList}>
          {familyMembers.slice(0, 4).map((member) => (
            <View key={member.id} style={styles.memberRow}>
              <View style={styles.memberAvatar}>
                <Ionicons name="person" size={18} color={Colors.primary} />
              </View>
              <View style={styles.memberInfo}>
                <Text style={[styles.memberName, { fontFamily: fonts.semiBold }]}>{member.name}</Text>
                <Text style={[styles.memberSub, { fontFamily: fonts.regular }]}>
                  {t(`family.${member.relationship}`)} | {member.age} {t('common.years_label')}
                </Text>
              </View>
              {member.income ? (
                <Text style={[styles.memberIncome, { fontFamily: fonts.medium }]}>
                  ₹{member.income.toLocaleString('en-IN')}
                </Text>
              ) : null}
            </View>
          ))}
          {familyMembers.length > 4 && (
            <Pressable style={styles.viewAllBtn} onPress={() => router.push('/family/' as any)}>
              <Text style={[styles.viewAllText, { fontFamily: fonts.medium }]}>
                +{familyMembers.length - 4} more
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 20 },
  heroCard: {
    borderRadius: 20,
    padding: 22,
    marginBottom: 28,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: { fontSize: 16, color: 'rgba(255,255,255,0.8)' },
  dashTitle: { fontSize: 22, color: '#fff', marginTop: 2 },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    padding: 16,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 12 },
  statValue: { fontSize: 20, color: '#fff' },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  sectionTitle: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 14,
  },
  tipCard: {
    backgroundColor: '#FFF7ED',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FED7AA',
  },
  tipTitle: {
    fontSize: 14,
    color: '#C2410C',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 14,
    color: '#7C2D12',
    lineHeight: 20,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  actionCard: {
    width: '47%' as any,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 18,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  actionCardPressed: { transform: [{ scale: 0.97 }], opacity: 0.9 },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: { fontSize: 14, color: Colors.text },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: { fontSize: 14, color: Colors.textTertiary },
  emptyAction: { fontSize: 15, color: Colors.primary, marginTop: 4 },
  membersList: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInfo: { flex: 1 },
  memberName: { fontSize: 15, color: Colors.text },
  memberSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 1 },
  memberIncome: { fontSize: 14, color: Colors.primary },
  viewAllBtn: { padding: 14, alignItems: 'center' },
  viewAllText: { fontSize: 14, color: Colors.primary },
});
