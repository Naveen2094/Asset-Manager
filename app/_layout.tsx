import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import { AppProvider } from "@/lib/app-context";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { NotoSansTamil_400Regular, NotoSansTamil_500Medium, NotoSansTamil_600SemiBold, NotoSansTamil_700Bold } from "@expo-google-fonts/noto-sans-tamil";
import "@/lib/i18n";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back", headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding/language" />
      <Stack.Screen name="onboarding/welcome" />
      <Stack.Screen name="onboarding/family-setup" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="calculator/[type]" options={{ headerShown: true, headerBackTitle: "" }} />
      <Stack.Screen name="scheme/[id]" options={{ headerShown: true, headerBackTitle: "" }} />
      <Stack.Screen name="lesson/[id]" options={{ headerShown: true, headerBackTitle: "" }} />
      <Stack.Screen name="family/index" options={{ headerShown: true, headerBackTitle: "" }} />
      <Stack.Screen name="family/add" options={{ headerShown: true, headerBackTitle: "", presentation: "modal" }} />
      <Stack.Screen name="settings" options={{ headerShown: true, headerBackTitle: "" }} />
      <Stack.Screen name="disclaimer" options={{ headerShown: true, headerBackTitle: "" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    NotoSansTamil_400Regular,
    NotoSansTamil_500Medium,
    NotoSansTamil_600SemiBold,
    NotoSansTamil_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <KeyboardProvider>
            <AppProvider>
              <RootLayoutNav />
            </AppProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
