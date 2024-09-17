import * as React from 'react'
import { Pressable, Text, View, Alert, BackHandler } from "react-native";
import { router} from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {

  React.useEffect(() => {
    const backAction = () => {
      Alert.alert("",'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp()}
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

    let logout = async () => {
        try{
          router.replace('/');
          await AsyncStorage.setItem('onboardingComplete', "false");
        }catch(e){
            console.log("Error while logout");
        }
    }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Profile Page</Text>
      <Pressable style={{paddingVertical: 20}} onPress={() => logout()}>
        <Text style={{fontSize: 30}}>Logout</Text>
      </Pressable>
    </View>
  );
}
