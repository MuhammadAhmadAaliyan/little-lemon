import * as React from 'react'
import { Pressable, Text, View, Alert, BackHandler, StyleSheet, ImageBackground, Image } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFonts } from 'expo-font';

const Profile = () => {

  const [fontsLoaded] = useFonts({
    'Markazi-Regular': require('@/assets/fonts/MarkaziText-Regular.ttf'),
    'Markazi-Bold': require('@/assets/fonts/MarkaziText-Bold.ttf'),
    'Karla-Medium': require('@/assets/fonts/Karla-Medium.ttf'),
    'Karla-Regular': require('@/assets/fonts/Karla-Regular.ttf'),
  });

  const [profileImage, setProfileImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  React.useEffect(() => {
    const backAction = () => {
      Alert.alert("", 'Are you sure you want to exit?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        { text: 'YES', onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/lemon-logo.png')}
        resizeMode={'contain'}
        style={styles.backgroundImage}
      >
      </ImageBackground>
        <View style={styles.header}>
          <Pressable style={styles.backButton}>
            <AntDesign
              name={'arrowleft'}
              color={'white'}
              size={18}
            />
          </Pressable>
          <View style={styles.headerTitle}>
            <Image
              source={require('@/assets/images/lemon-logo.png')}
              resizeMode={'contain'}
              style={styles.logo}
            />
            <Text style={styles.headerText}>LITTLE LEMON</Text>
          </View>
          {profileImage ?
            (
              <Image 
              source={{ uri: profileImage }} 
              style={styles.profileImage} 
              resizeMode={'contain'} 
              />
            ) : (
              <Image 
              source={require('@/assets/images/Default Avatar.jpg')} 
              style={styles.profileImage} 
              resizeMode={'contain'}
              />
            )
          }
        </View>
        <View style={styles.border}/>
    </View>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  backgroundImage: {
    position: 'absolute',
    height: 350,
    width: 350,
    top: '50%',
    left: '50%',
    transform: [{ translateX: -175 }, { translateY: -175 }],
    opacity: 0.1,
    zIndex: -1
  },
  // contentContainer: {
  //   flex: 1,
  //   padding: 20,
  // },
  header: {
    padding: '4%',
    paddingVertical: '8%',
    paddingTop: '12%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '4%'
  },
  backButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#495E57',
    backgroundColor: '#495E57',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    flexDirection: 'row',

  },
  logo: {
    width: 38,
    height: 38,
  },
  headerText: {
    color: '#495E57',
    fontSize: 22,
    fontFamily: 'Markazi-Bold',
    letterSpacing: 5,
    paddingTop: '4.5%',
    textAlign: 'center'
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    bottom: '0.8%'
  },
  border: {
    borderWidth: 0.5,
    borderColor: '#cbd2da'
  }
}); 