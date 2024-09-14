import * as React from 'react';
import { Stack } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';

export default function RootLayout() {

const[loading, setLoading] = React.useState(true);

if(loading){
  SplashScreen.preventAutoHideAsync();
}

React.useEffect(() => {
  let checkIsOnboardingCompleted = async () => {
    try{

      const onboarding = await AsyncStorage.getItem('onboardingCompleted');
      if(onboarding === 'true') {
        router.replace('/Profile');
      }else{
        router.replace('/');
      }

    }catch(e){
      console.log("Error while checking");
    }finally{
      setLoading(false);
    }
  }
  checkIsOnboardingCompleted();
}, [])

  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="Profile" />
    </Stack>
  );
}
