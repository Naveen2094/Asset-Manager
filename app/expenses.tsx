import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
  TextInput, Modal, Platform, Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '@/constants/colors';
import { useFont } from '@/lib/fonts';
import { useExpenses, ExpenseCategory, EntryType } from '@/lib/expense-context';
import { useApp } from '@/lib/app-context';
import { useTranslation } from 'react-i18next';

const INCOME_CATEGORIES: { key: ExpenseCategory; label: string; icon: string; color: string }[] = [
  { key: 'salary',   label: 'Salary',   icon: 'briefcase',           color: '#3B82F6' },
  { key: 'business', label: 'Business', icon: 'storefront',           color: '#8B5CF6' },
  { key: 'other',    label: 'Other',    icon: 'ellipsis-horizontal',  color: '#6B7280' },
];

const EXPENSE_CATEGORIES: { key: ExpenseCategory; label: string; icon: string; color: string }[] = [
  { key: 'food',          label: 'Food',        icon: 'fast-food',           color: '#F97316' },
  { key: 'transport',     label: 'Transport',   icon: 'car',                 color: '#0EA5E9' },
  { key: 'health',        label: 'Health',      icon: 'medkit',              color: '#EF4444' },
  { key: 'education',     label: 'Education',   icon: 'school',              color: '#3B82F6' },
  { key: 'rent',          label: 'Rent',        icon: 'home',                color: '#8B5CF6' },
  { key: 'entertainment', label: 'Fun',         icon: 'musical-notes',       color: '#EC4899' },
  { key: 'shopping',      label: 'Shopping',    icon: 'bag',                 color: '#F59E0B' },
  { key: 'other',         label: 'Other',       icon: 'ellipsis-horizontal', color: '#6B7280' },
];

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

export default function ExpensesScreen() {
  const fonts = useFont();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { i18n } = useTranslation();
  const isTamil = i18n.language === 'ta';
  const { entries, addEntry, deleteEntry, getMonthlySummary } = useExpenses();
  const { familyMembers } = useApp();

  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Form state
  const [entryType, setEntryType] = useState<EntryType>('expense');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>('food');
  const [selectedMemberId, setSelectedMemberId] = useState(
    familyMembers.length > 0 ? familyMembers[0].id : 'self'
  );
  const [note, setNote] = useState('');
  const [entryDate, setEntryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const summary = getMonthlySummary(selectedYear, selectedMonth);

  const monthEntries = useMemo(() => entries.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === selectedYear && d.getMonth() === selectedMonth;
  }), [entries, selectedYear, selectedMonth]);

  // Group entries by date for daily view
  const groupedEntries = useMemo(() => {
    const groups: { date: string; label: string; entries: typeof monthEntries }[] = [];
    const map: Record<string, typeof monthEntries> = {};
    monthEntries.forEach(e => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    Object.keys(map).sort((a, b) => b.localeCompare(a)).forEach(date => {
      const d = new Date(date);
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      let label = '';
      if (date === today) label = isTamil ? 'இன்று' : 'Today';
      else if (date === yesterday) label = isTamil ? 'நேற்று' : 'Yesterday';
      else label = `${d.getDate()} ${MONTHS_FULL[d.getMonth()]}`;
      groups.push({ date, label, entries: map[date] });
    });
    return groups;
  }, [monthEntries, isTamil]);

  const categories = entryType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleAdd = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
    const member = familyMembers.find(m => m.id === selectedMemberId);
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await addEntry({
      type: entryType,
      amount: parseFloat(amount),
      category: selectedCategory,
      memberId: selectedMemberId,
      memberName: member?.name ?? 'Self',
      note: note.trim(),
      date: entryDate.toISOString().split('T')[0],
    });
    setAmount('');
    setNote('');
    setEntryType('expense');
    setSelectedCategory('food');
    setShowAddModal(false);
    setEntryDate(new Date());
  };

  const handleDelete = (id: string, categoryLabel: string) => {
    if (Platform.OS !== 'web') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      isTamil ? 'நீக்கவுமா?' : 'Delete Entry',
      isTamil ? `"${categoryLabel}" நீக்கவுமா?` : `Delete "${categoryLabel}" entry?`,
      [
        { text: isTamil ? 'இல்லை' : 'Cancel', style: 'cancel' },
        { text: isTamil ? 'நீக்கு' : 'Delete', style: 'destructive', onPress: () => deleteEntry(id) },
      ]
    );
  };

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

  const getCategoryInfo = (cat: ExpenseCategory, type: EntryType) => {
    const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    return list.find(c => c.key === cat) ?? EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
  };

  const formatAmount = (val: number) => `₹${val.toLocaleString('en-IN')}`;
  const isCurrentMonth = selectedYear === now.getFullYear() && selectedMonth === now.getMonth();

  return (
    <>
      <Stack.Screen
        options={{
          title: isTamil ? 'வரவு செலவு' : 'Income & Expenses',
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
          <Pressable onPress={() => setShowMonthPicker(true)} style={styles.monthLabelBtn}>
            <Text style={[styles.monthLabel, { fontFamily: fonts.semiBold }]}>
              {MONTHS_FULL[selectedMonth]} {selectedYear}
            </Text>
            <Ionicons name="chevron-down" size={14} color={Colors.primary} />
          </Pressable>
          <Pressable onPress={nextMonth} style={[styles.monthBtn, isCurrentMonth && { opacity: 0.3 }]}>
            <Ionicons name="chevron-forward" size={22} color={Colors.primary} />
          </Pressable>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { borderColor: '#DCFCE7' }]}>
            <Text style={[styles.summaryLabel, { fontFamily: fonts.regular }]}>
              {isTamil ? 'வரவு' : 'Income'}
            </Text>
            <Text style={[styles.summaryValue, { fontFamily: fonts.bold, color: Colors.success }]}>
              {formatAmount(summary.totalIncome)}
            </Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: '#FEE2E2' }]}>
            <Text style={[styles.summaryLabel, { fontFamily: fonts.regular }]}>
              {isTamil ? 'செலவு' : 'Expenses'}
            </Text>
            <Text style={[styles.summaryValue, { fontFamily: fonts.bold, color: Colors.error }]}>
              {formatAmount(summary.totalExpenses)}
            </Text>
          </View>
          <View style={[styles.summaryCard, { borderColor: '#DBEAFE' }]}>
            <Text style={[styles.summaryLabel, { fontFamily: fonts.regular }]}>
              {isTamil ? 'சேமிப்பு' : 'Savings'}
            </Text>
            <Text style={[
              styles.summaryValue,
              { fontFamily: fonts.bold, color: summary.savings >= 0 ? Colors.info : Colors.error }
            ]}>
              {formatAmount(summary.savings)}
            </Text>
          </View>
        </View>

        {/* Add Button */}
        <Pressable style={styles.addBtn} onPress={() => setShowAddModal(true)}>
          <Ionicons name="add-circle" size={22} color="#fff" />
          <Text style={[styles.addBtnText, { fontFamily: fonts.semiBold }]}>
            {isTamil ? 'பதிவு சேர்க்க' : 'Add Entry'}
          </Text>
        </Pressable>

        {/* Daily Grouped Entries */}
        {groupedEntries.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="wallet-outline" size={48} color={Colors.textTertiary} />
            <Text style={[styles.emptyText, { fontFamily: fonts.regular }]}>
              {isTamil ? 'இந்த மாதம் பதிவுகள் இல்லை' : 'No entries this month'}
            </Text>
            <Text style={[styles.emptyHint, { fontFamily: fonts.regular }]}>
              {isTamil ? 'மேலே உள்ள பொத்தானை தட்டி சேர்க்கவும்' : 'Tap "Add Entry" to get started'}
            </Text>
          </View>
        ) : (
          groupedEntries.map(group => (
            <View key={group.date} style={styles.dayGroup}>
              {/* Day header with daily total */}
              <View style={styles.dayHeader}>
                <Text style={[styles.dayLabel, { fontFamily: fonts.semiBold }]}>
                  {group.label}
                </Text>
                <Text style={[styles.dayTotal, { fontFamily: fonts.medium }]}>
                  {formatAmount(
                    group.entries.reduce((sum, e) =>
                      e.type === 'expense' ? sum - e.amount : sum + e.amount, 0)
                  )}
                </Text>
              </View>
              <View style={styles.entriesList}>
                {group.entries.map((entry, idx) => {
                  const catInfo = getCategoryInfo(entry.category, entry.type);
                  return (
                    <Pressable
                      key={entry.id}
                      style={[
                        styles.entryRow,
                        idx < group.entries.length - 1 && styles.entryBorder,
                      ]}
                    >
                      <View style={[styles.entryIcon, { backgroundColor: catInfo.color + '15' }]}>
                        <Ionicons name={catInfo.icon as any} size={20} color={catInfo.color} />
                      </View>
                      <View style={styles.entryInfo}>
                        <Text style={[styles.entryCategory, { fontFamily: fonts.semiBold }]}>
                          {catInfo.label}
                        </Text>
                        <Text style={[styles.entrySub, { fontFamily: fonts.regular }]}>
                          {entry.memberName}{entry.note ? ` · ${entry.note}` : ''}
                        </Text>
                      </View>
                      <View style={styles.entryRight}>
                        <Text style={[
                          styles.entryAmount,
                          { fontFamily: fonts.bold, color: entry.type === 'income' ? Colors.success : Colors.error }
                        ]}>
                          {entry.type === 'income' ? '+' : '-'}{formatAmount(entry.amount)}
                        </Text>
                        <Pressable
                          onPress={() => handleDelete(entry.id, catInfo.label)}
                          style={styles.deleteBtn}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Ionicons name="trash-outline" size={15} color={Colors.error} />
                        </Pressable>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Month Picker Modal */}
      <Modal visible={showMonthPicker} animationType="fade" transparent onRequestClose={() => setShowMonthPicker(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowMonthPicker(false)} />
        <View style={styles.pickerSheet}>
          <Text style={[styles.pickerTitle, { fontFamily: fonts.bold }]}>
            {isTamil ? 'மாதம் தேர்வு' : 'Select Month'}
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {YEARS.map(year => (
              <View key={year}>
                <Text style={[styles.yearLabel, { fontFamily: fonts.semiBold }]}>{year}</Text>
                <View style={styles.monthGrid}>
                  {MONTHS.map((m, idx) => {
                    const isFuture = year > now.getFullYear() ||
                      (year === now.getFullYear() && idx > now.getMonth());
                    const isSelected = year === selectedYear && idx === selectedMonth;
                    return (
                      <Pressable
                        key={m}
                        disabled={isFuture}
                        style={[
                          styles.monthChip,
                          isSelected && styles.monthChipSelected,
                          isFuture && { opacity: 0.3 },
                        ]}
                        onPress={() => {
                          setSelectedYear(year);
                          setSelectedMonth(idx);
                          setShowMonthPicker(false);
                        }}
                      >
                        <Text style={[
                          styles.monthChipText,
                          { fontFamily: fonts.medium },
                          isSelected && styles.monthChipTextSelected,
                        ]}>
                          {m}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {/* Add Entry Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent onRequestClose={() => setShowAddModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowAddModal(false)} />
        <View style={[styles.modalSheet, { paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.modalHandle} />
          <Text style={[styles.modalTitle, { fontFamily: fonts.bold }]}>
            {isTamil ? 'புதிய பதிவு' : 'New Entry'}
          </Text>

          <View style={styles.typeToggle}>
            {(['income', 'expense'] as EntryType[]).map(t => (
              <Pressable
                key={t}
                style={[styles.typeBtn, entryType === t && {
                  backgroundColor: t === 'income' ? Colors.success : Colors.error
                }]}
                onPress={() => {
                  setEntryType(t);
                  setSelectedCategory(t === 'income' ? 'salary' : 'food');
                }}
              >
                <Text style={[
                  styles.typeBtnText, { fontFamily: fonts.semiBold },
                  entryType === t && { color: '#fff' }
                ]}>
                  {t === 'income' ? (isTamil ? 'வரவு' : 'Income') : (isTamil ? 'செலவு' : 'Expense')}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={[styles.fieldLabel, { fontFamily: fonts.medium }]}>
            {isTamil ? 'தொகை (₹)' : 'Amount (₹)'}
          </Text>
          <TextInput
            style={[styles.amountInput, { fontFamily: fonts.regular }]}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={Colors.textTertiary}
            autoFocus
          />

          <Text style={[styles.fieldLabel, { fontFamily: fonts.medium }]}>
            {isTamil ? 'தேதி' : 'Date'}
          </Text>
          <Pressable
            style={styles.datePickerBtn}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={18} color={Colors.primary} />
            <Text style={[styles.datePickerText, { fontFamily: fonts.medium }]}>
              {entryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={entryDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={(event, date) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (date) setEntryDate(date);
              }}
            />
          )}

          <Text style={[styles.fieldLabel, { fontFamily: fonts.medium }]}>
            {isTamil ? 'வகை' : 'Category'}
          </Text>
          <View style={styles.categoryGrid}>
            {categories.map(cat => (
              <Pressable
                key={cat.key}
                style={[styles.catChip, selectedCategory === cat.key && {
                  backgroundColor: cat.color + '20', borderColor: cat.color,
                }]}
                onPress={() => setSelectedCategory(cat.key)}
              >
                <Ionicons name={cat.icon as any} size={16} color={cat.color} />
                <Text style={[
                  styles.catChipText,
                  { fontFamily: fonts.medium, color: selectedCategory === cat.key ? cat.color : Colors.textSecondary }
                ]}>
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {familyMembers.length > 0 && (
            <>
              <Text style={[styles.fieldLabel, { fontFamily: fonts.medium }]}>
                {isTamil ? 'குடும்ப உறுப்பினர்' : 'Family Member'}
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.memberScroll}>
                {familyMembers.map(m => (
                  <Pressable
                    key={m.id}
                    style={[styles.memberChip, selectedMemberId === m.id && styles.memberChipActive]}
                    onPress={() => setSelectedMemberId(m.id)}
                  >
                    <Text style={[
                      styles.memberChipText, { fontFamily: fonts.medium },
                      selectedMemberId === m.id && { color: Colors.primary }
                    ]}>
                      {m.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          )}

          <Text style={[styles.fieldLabel, { fontFamily: fonts.medium }]}>
            {isTamil ? 'குறிப்பு (விருப்பம்)' : 'Note (optional)'}
          </Text>
          <TextInput
            style={[styles.noteInput, { fontFamily: fonts.regular }]}
            value={note}
            onChangeText={setNote}
            placeholder={isTamil ? 'உதா: மளிகை கடை' : 'e.g. Grocery store'}
            placeholderTextColor={Colors.textTertiary}
          />

          <Pressable style={styles.submitBtn} onPress={handleAdd}>
            <Text style={[styles.submitBtnText, { fontFamily: fonts.bold }]}>
              {isTamil ? 'சேமி' : 'Save Entry'}
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
  monthLabelBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  monthLabel: { fontSize: 16, color: Colors.text },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  summaryCard: {
    flex: 1, backgroundColor: Colors.surface, borderRadius: 14,
    padding: 14, alignItems: 'center', borderWidth: 1,
  },
  summaryLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 6 },
  summaryValue: { fontSize: 14 },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: Colors.primary, borderRadius: 14,
    padding: 16, marginBottom: 20,
  },
  addBtnText: { fontSize: 16, color: '#fff' },
  emptyState: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.textSecondary },
  emptyHint: { fontSize: 13, color: Colors.textTertiary },
  dayGroup: { marginBottom: 16 },
  dayHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 4, marginBottom: 8,
  },
  dayLabel: { fontSize: 14, color: Colors.textSecondary },
  dayTotal: { fontSize: 14, color: Colors.text },
  entriesList: {
    backgroundColor: Colors.surface, borderRadius: 16,
    overflow: 'hidden', borderWidth: 1, borderColor: Colors.borderLight,
  },
  entryRow: {
    flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12,
  },
  entryBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  entryIcon: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  entryInfo: { flex: 1 },
  entryCategory: { fontSize: 14, color: Colors.text },
  entrySub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  entryRight: { alignItems: 'flex-end' },
  entryAmount: { fontSize: 15 },
  deleteBtn: {
    marginTop: 4,
    padding: 2,
    alignItems: 'center',
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  datePickerText: {
    fontSize: 15,
    color: Colors.text,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  pickerSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.surface, borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 24, maxHeight: '70%',
  },
  pickerTitle: { fontSize: 18, color: Colors.text, marginBottom: 16 },
  yearLabel: { fontSize: 15, color: Colors.textSecondary, marginBottom: 10, marginTop: 8 },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
  monthChip: {
    width: '22%', paddingVertical: 10, borderRadius: 10, alignItems: 'center',
    backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border,
  },
  monthChipSelected: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  monthChipText: { fontSize: 13, color: Colors.textSecondary },
  monthChipTextSelected: { color: Colors.primary },
  modalSheet: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 24, gap: 12,
  },
  modalHandle: {
    width: 40, height: 4, backgroundColor: Colors.border,
    borderRadius: 2, alignSelf: 'center', marginBottom: 8,
  },
  modalTitle: { fontSize: 20, color: Colors.text, marginBottom: 4 },
  typeToggle: { flexDirection: 'row', gap: 10 },
  typeBtn: {
    flex: 1, padding: 12, borderRadius: 12, alignItems: 'center',
    backgroundColor: Colors.surfaceSecondary,
  },
  typeBtnText: { fontSize: 15, color: Colors.textSecondary },
  fieldLabel: { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },
  amountInput: {
    backgroundColor: Colors.background, borderRadius: 12, padding: 14,
    fontSize: 20, color: Colors.text, borderWidth: 1, borderColor: Colors.border,
  },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border,
  },
  catChipText: { fontSize: 13 },
  memberScroll: { marginBottom: 4 },
  memberChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: Colors.background, borderWidth: 1,
    borderColor: Colors.border, marginRight: 8,
  },
  memberChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  memberChipText: { fontSize: 13, color: Colors.textSecondary },
  noteInput: {
    backgroundColor: Colors.background, borderRadius: 12, padding: 14,
    fontSize: 15, color: Colors.text, borderWidth: 1, borderColor: Colors.border,
  },
  submitBtn: {
    backgroundColor: Colors.primary, borderRadius: 14,
    padding: 16, alignItems: 'center', marginTop: 8,
  },
  submitBtnText: { fontSize: 16, color: '#fff' },
});
