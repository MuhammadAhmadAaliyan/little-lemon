import * as React from 'react';
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';

export default function RootLayout() {

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Profile" />
      <Stack.Screen name="Onboarding2" />
    </Stack>
  );
}
