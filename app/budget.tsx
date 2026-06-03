import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  TextInput, Modal, Platform, Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';
import { useTranslation } from 'react-i18next';
import { useBudget, BUDGETABLE_CATEGORIES } from '@/lib/budget-context';
import { useExpenses, ExpenseCategory } from '@/lib/expense-context';

const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function BudgetScreen() {
  const fonts = useFont();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';
  const { budgets, setBudget, getBudget } = useBudget();
  const { entries } = useExpenses();

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [editingCategory, setEditingCategory] = useState<ExpenseCategory | null>(null);
  const [inputValue, setInputValue] = useState('');

  // Get actual spending per category for selected month
  const spendingMap = useMemo(() => {
    const map: Partial<Record<ExpenseCategory, number>> = {};
    entries.forEach(e => {
      if (e.type !== 'expense') return;
      const d = new Date(e.date);
      if (d.getFullYear() !== selectedYear || d.getMonth() !== selectedMonth) return;
      map[e.category] = (map[e.category] ?? 0) + e.amount;
    });
    return map;
  }, [entries, selectedYear, selectedMonth]);

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = BUDGETABLE_CATEGORIES.reduce((sum, cat) => sum + (spendingMap[cat.key] ?? 0), 0);
  const totalRemaining = totalBudgeted - totalSpent;

  const prevMonth = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1); }
    else setSelectedMonth(m => m - 1);
  };

  const nextMonth = () => {
    const isCurrentMonth = selectedYear === now.getFullYear() && selectedMonth === now.getMonth();
    if (isCurrentMonth) return;
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1); }
    else setSelectedMonth(m => m + 1);
  };

  const isCurrentMonth = selectedYear === now.getFullYear() && selectedMonth === now.getMonth();

  const openEdit = (category: ExpenseCategory) => {
    const current = getBudget(category);
    setInputValue(current > 0 ? current.toString() : '');
    setEditingCategory(category);
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSave = async () => {
    if (!editingCategory) return;
    const val = parseFloat(inputValue);
    if (isNaN(val) || val < 0) {
      Alert.alert(
        isTamil ? 'தவறான தொகை' : 'Invalid Amount',
        isTamil ? 'சரியான தொகை உள்ளிடவும்.' : 'Please enter a valid amount.'
      );
      return;
    }
    await setBudget(editingCategory, val);
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setEditingCategory(null);
    setInputValue('');
  };

  const getProgressColor = (spent: number, limit: number) => {
    if (limit === 0) return Colors.textTertiary;
    const pct = spent / limit;
    if (pct >= 1) return Colors.error;
    if (pct >= 0.75) return Colors.warning;
    return Colors.success;
  };

  const getProgressWidth = (spent: number, limit: number) => {
    if (limit === 0) return 0;
    return Math.min((spent / limit) * 100, 100);
  };

  const formatAmount = (val: number) => `₹${val.toLocaleString('en-IN')}`;

  const editingCategoryInfo = BUDGETABLE_CATEGORIES.find(c => c.key === editingCategory);

  return (
    <>
      <Stack.Screen
        options={{
          title: isTamil ? 'பட்ஜெட் திட்டமிடல்' : 'Budget Planner',
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
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Month Navigator */}
        <View style={styles.monthNav}>
          <Pressable onPress={prevMonth} style={styles.monthBtn}>
            <Ionicons name="chevron-back" size={22} color={Colors.primary} />
          </Pressable>
          <Text style={[styles.monthLabel, { fontFamily: fonts.semiBold }]}>
            {MONTHS_FULL[selectedMonth]} {selectedYear}
          </Text>
          <Pressable onPress={nextMonth} style={[styles.monthBtn, isCurrentMonth && { opacity: 0.3 }]}>
            <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
          </Pressable>
        </View>

        {/* Overall Summary Card */}
        {totalBudgeted > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { fontFamily: fonts.regular }]}>
                  {isTamil ? 'மொத்த பட்ஜெட்' : 'Total Budget'}
                </Text>
                <Text style={[styles.summaryValue, { fontFamily: fonts.bold, color: Colors.primary }]}>
                  {formatAmount(totalBudgeted)}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { fontFamily: fonts.regular }]}>
                  {isTamil ? 'செலவிட்டது' : 'Spent'}
                </Text>
                <Text style={[styles.summaryValue, { fontFamily: fonts.bold, color: Colors.error }]}>
                  {formatAmount(totalSpent)}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { fontFamily: fonts.regular }]}>
                  {isTamil ? 'மீதம்' : 'Remaining'}
                </Text>
                <Text style={[styles.summaryValue, {
                  fontFamily: fonts.bold,
                  color: totalRemaining >= 0 ? Colors.success : Colors.error
                }]}>
                  {formatAmount(Math.abs(totalRemaining))}
                  {totalRemaining < 0 ? ' ↑' : ''}
                </Text>
              </View>
            </View>

            {/* Overall progress bar */}
            <View style={styles.overallBarBg}>
              <View style={[styles.overallBarFill, {
                width: `${getProgressWidth(totalSpent, totalBudgeted)}%` as any,
                backgroundColor: getProgressColor(totalSpent, totalBudgeted),
              }]} />
            </View>
            <Text style={[styles.overallPct, { fontFamily: fonts.medium }]}>
              {totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0}%
              {' '}{isTamil ? 'செலவிட்டது' : 'used'}
            </Text>
          </View>
        )}

        {/* Hint if no budgets set */}
        {budgets.length === 0 && (
          <View style={styles.hintCard}>
            <Ionicons name="bulb-outline" size={24} color={Colors.accent} />
            <Text style={[styles.hintText, { fontFamily: fonts.regular }]}>
              {isTamil
                ? 'ஒவ்வொரு வகைக்கும் மாதாந்திர வரம்பை அமைக்கவும். வலதுபுறம் உள்ள ✎ ஐ தட்டவும்.'
                : 'Set a monthly limit for each category by tapping the ✎ icon on the right.'}
            </Text>
          </View>
        )}

        {/* Category Budget Rows */}
        <View style={styles.categoryList}>
          {BUDGETABLE_CATEGORIES.map((cat, idx) => {
            const spent = spendingMap[cat.key] ?? 0;
            const limit = getBudget(cat.key);
            const progressColor = getProgressColor(spent, limit);
            const progressWidth = getProgressWidth(spent, limit);
            const isOverBudget = limit > 0 && spent > limit;

            return (
              <View key={cat.key}>
                <View style={styles.categoryRow}>
                  {/* Icon */}
                  <View style={[styles.catIcon, { backgroundColor: cat.color + '15' }]}>
                    <Ionicons name={cat.icon as any} size={20} color={cat.color} />
                  </View>

                  {/* Info */}
                  <View style={styles.catInfo}>
                    <View style={styles.catTopRow}>
                      <Text style={[styles.catName, { fontFamily: fonts.semiBold }]}>
                        {cat.label}
                        {isOverBudget && ' ⚠️'}
                      </Text>
                      <View style={styles.catAmounts}>
                        <Text style={[styles.catSpent, { fontFamily: fonts.bold, color: progressColor }]}>
                          {formatAmount(spent)}
                        </Text>
                        <Text style={[styles.catLimit, { fontFamily: fonts.regular }]}>
                          {limit > 0 ? ` / ${formatAmount(limit)}` : (isTamil ? ' / அமைக்கப்படவில்லை' : ' / not set')}
                        </Text>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressBg}>
                      <View style={[styles.progressFill, {
                        width: `${progressWidth}%` as any,
                        backgroundColor: progressColor,
                      }]} />
                    </View>
                  </View>

                  {/* Edit Button */}
                  <Pressable
                    style={styles.editBtn}
                    onPress={() => openEdit(cat.key)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="pencil-outline" size={16} color={Colors.primary} />
                  </Pressable>
                </View>
                {idx < BUDGETABLE_CATEGORIES.length - 1 && <View style={styles.rowDivider} />}
              </View>
            );
          })}
        </View>

      </ScrollView>

      {/* Edit Budget Modal */}
      <Modal
        visible={editingCategory !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setEditingCategory(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setEditingCategory(null)} />
        <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.modalHandle} />

          {editingCategoryInfo && (
            <View style={styles.modalHeader}>
              <View style={[styles.modalIcon, { backgroundColor: editingCategoryInfo.color + '20' }]}>
                <Ionicons name={editingCategoryInfo.icon as any} size={24} color={editingCategoryInfo.color} />
              </View>
              <Text style={[styles.modalTitle, { fontFamily: fonts.bold }]}>
                {isTamil ? `${editingCategoryInfo.label} பட்ஜெட்` : `${editingCategoryInfo.label} Budget`}
              </Text>
            </View>
          )}

          <Text style={[styles.fieldLabel, { fontFamily: fonts.medium }]}>
            {isTamil ? 'மாதாந்திர வரம்பு (₹)' : 'Monthly Limit (₹)'}
          </Text>
          <TextInput
            style={[styles.amountInput, { fontFamily: fonts.regular }]}
            value={inputValue}
            onChangeText={setInputValue}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={Colors.textTertiary}
            autoFocus
          />
          <Text style={[styles.inputHint, { fontFamily: fonts.regular }]}>
            {isTamil ? '0 உள்ளிட்டால் வரம்பு நீக்கப்படும்' : 'Enter 0 to remove the limit'}
          </Text>

          <Pressable style={styles.saveBtn} onPress={handleSave}>
            <Text style={[styles.saveBtnText, { fontFamily: fonts.bold }]}>
              {isTamil ? 'சேமி' : 'Save Limit'}
            </Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: 20, paddingTop: 16 },
  monthNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.surface, borderRadius: 14, padding: 12,
    marginBottom: 16, borderWidth: 1, borderColor: Colors.borderLight,
  },
  monthBtn: { padding: 8 },
  monthLabel: { fontSize: 16, color: Colors.text },
  summaryCard: {
    backgroundColor: Colors.surface, borderRadius: 18,
    padding: 18, marginBottom: 16,
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  summaryRow: { flexDirection: 'row', marginBottom: 16 },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, backgroundColor: Colors.borderLight },
  summaryLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 6 },
  summaryValue: { fontSize: 15 },
  overallBarBg: {
    height: 8, backgroundColor: Colors.borderLight,
    borderRadius: 4, overflow: 'hidden', marginBottom: 6,
  },
  overallBarFill: { height: '100%', borderRadius: 4 },
  overallPct: { fontSize: 12, color: Colors.textSecondary, textAlign: 'right' },
  hintCard: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    backgroundColor: Colors.accentLight, borderRadius: 14,
    padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#F3D99A',
  },
  hintText: { flex: 1, fontSize: 13, color: Colors.text, lineHeight: 20 },
  categoryList: {
    backgroundColor: Colors.surface, borderRadius: 18,
    borderWidth: 1, borderColor: Colors.borderLight, overflow: 'hidden',
  },
  categoryRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, gap: 12,
  },
  rowDivider: { height: 1, backgroundColor: Colors.borderLight, marginLeft: 68 },
  catIcon: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  catInfo: { flex: 1 },
  catTopRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 8,
  },
  catName: { fontSize: 14, color: Colors.text },
  catAmounts: { flexDirection: 'row', alignItems: 'baseline' },
  catSpent: { fontSize: 14 },
  catLimit: { fontSize: 12, color: Colors.textSecondary },
  progressBg: {
    height: 6, backgroundColor: Colors.borderLight,
    borderRadius: 3, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  editBtn: { padding: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalSheet: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 24, gap: 12,
  },
  modalHandle: {
    width: 40, height: 4, backgroundColor: Colors.border,
    borderRadius: 2, alignSelf: 'center', marginBottom: 8,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  modalIcon: {
    width: 44, height: 44, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  modalTitle: { fontSize: 20, color: Colors.text },
  fieldLabel: { fontSize: 13, color: Colors.textSecondary },
  amountInput: {
    backgroundColor: Colors.background, borderRadius: 12, padding: 14,
    fontSize: 24, color: Colors.text, borderWidth: 1, borderColor: Colors.border,
  },
  inputHint: { fontSize: 12, color: Colors.textTertiary },
  saveBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    padding: 16, alignItems: 'center', marginTop: 8,
  },
  saveBtnText: { fontSize: 16, color: '#fff' },
});
