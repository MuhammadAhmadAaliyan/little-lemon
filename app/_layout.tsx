import * as React from 'react';
import { router, Stack } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

export default function RootLayout() {

  const [isLoading, setIsLoading] = React.useState(true);

  if(isLoading){
    SplashScreen.preventAutoHideAsync();
  }

  React.useEffect(() => {

    const checkIsOnboardingComplete = async () => {
      try{

        const isOnboardingComplete = await AsyncStorage.getItem('onboardingComplete');
        if(isOnboardingComplete === 'true'){
          router.replace('/Profile');
        }else{
          router.replace('/');
        }
      }catch(e){
        console.log("An error occurred during getting value!!");
      }finally{
        setIsLoading(false);
      }
    }

    checkIsOnboardingComplete();

  }, [])

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName='index'>
      <Stack.Screen name="index" />
      <Stack.Screen name="Onboarding2" />
      <Stack.Screen name="Onboarding3"/>
      <Stack.Screen name="Profile" />
    </Stack>
  );
}
