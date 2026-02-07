import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  relationship: string;
  income?: number;
  occupation?: string;
  gender?: string;
}

interface AppContextValue {
  familyMembers: FamilyMember[];
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateFamilyMember: (id: string, member: Omit<FamilyMember, 'id'>) => void;
  deleteFamilyMember: (id: string) => void;
  hasCompletedOnboarding: boolean;
  setOnboardingComplete: () => void;
  isLoading: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

const FAMILY_KEY = '@nidhi_family';
const ONBOARDING_KEY = '@nidhi_onboarding';
const LANGUAGE_KEY = '@nidhi_language';

export function AppProvider({ children }: { children: ReactNode }) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { i18n } = useTranslation();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [familyData, onboardingData, langData] = await Promise.all([
        AsyncStorage.getItem(FAMILY_KEY),
        AsyncStorage.getItem(ONBOARDING_KEY),
        AsyncStorage.getItem(LANGUAGE_KEY),
      ]);

      if (familyData) setFamilyMembers(JSON.parse(familyData));
      if (onboardingData === 'true') setHasCompletedOnboarding(true);
      if (langData) i18n.changeLanguage(langData);
    } catch (e) {
      console.error('Failed to load data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFamilyMembers = async (members: FamilyMember[]) => {
    try {
      await AsyncStorage.setItem(FAMILY_KEY, JSON.stringify(members));
    } catch (e) {
      console.error('Failed to save family:', e);
    }
  };

  const addFamilyMember = (member: Omit<FamilyMember, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newMember = { ...member, id };
    const updated = [...familyMembers, newMember];
    setFamilyMembers(updated);
    saveFamilyMembers(updated);
  };

  const updateFamilyMember = (id: string, member: Omit<FamilyMember, 'id'>) => {
    const updated = familyMembers.map(m => m.id === id ? { ...member, id } : m);
    setFamilyMembers(updated);
    saveFamilyMembers(updated);
  };

  const deleteFamilyMember = (id: string) => {
    const updated = familyMembers.filter(m => m.id !== id);
    setFamilyMembers(updated);
    saveFamilyMembers(updated);
  };

  const setOnboardingComplete = async () => {
    setHasCompletedOnboarding(true);
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (e) {
      console.error('Failed to save onboarding state:', e);
    }
  };

  const value = useMemo(() => ({
    familyMembers,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    hasCompletedOnboarding,
    setOnboardingComplete,
    isLoading,
  }), [familyMembers, hasCompletedOnboarding, isLoading]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

export async function saveLanguagePreference(lang: string) {
  try {
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  } catch (e) {
    console.error('Failed to save language:', e);
  }
}
