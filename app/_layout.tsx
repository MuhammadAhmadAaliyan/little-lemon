import * as React from 'react';
import { router, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SplashScreen } from 'expo-router';
import { AppDataProvider } from './AppData';

export default function RootLayout() {
  const [isLoading, setIsLoading] = React.useState(true);

  const checkIsOnboardingComplete = async () => {
    if (isLoading) {
      await SplashScreen.preventAutoHideAsync();
    }
    try {
      const isCompleteOnboarding = await AsyncStorage.getItem('onboardingComplete');
      if (isCompleteOnboarding === "true") {
        router.replace('/Profile');
      } else {
        router.replace('/');
      }
    } catch (e) {
      console.log("An error occurred while checking:", e);
    } finally {
      setIsLoading(false);
      await SplashScreen.hideAsync();
    }
  };

  React.useEffect(() => {
    checkIsOnboardingComplete();
  }, []);

  return (
    <AppDataProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="Onboarding2" />
        <Stack.Screen name="Onboarding3" />
        <Stack.Screen name="Profile" />
      </Stack>
    </AppDataProvider>
  );
}
