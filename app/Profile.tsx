import { Pressable, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Profile() {

    let logout = async () => {
        try{
            await AsyncStorage.clear();
            router.replace('/');
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
      <Pressable style={{paddingVertical: 20}} onPress={logout}>
        <Text style={{fontSize: 30}}>Logout</Text>
      </Pressable>
    </View>
  );
}
