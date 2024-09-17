import * as React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, Pressable, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Onboarding3 = () => {

    const [imageUri, setImageUri] = React.useState<string | null>(null);
    const [fontsLoaded] = useFonts({
        'Markazi-Regular': require('@/assets/fonts/MarkaziText-Regular.ttf'),
        'Markazi-Bold': require('@/assets/fonts/MarkaziText-Bold.ttf'),
        'Karla-Medium': require('@/assets/fonts/Karla-Medium.ttf'),
        'Karla-Regular': require('@/assets/fonts/Karla-Regular.ttf'),
    });

    React.useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    const takeImage = async () => {
        try {

            let permission = await ImagePicker.requestCameraPermissionsAsync();
            if (!permission) {
                Alert.alert("Permisson to access the camera is required!!");
            }

            let imageResult = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1
            });

            if (!imageResult.canceled) {
                setImageUri(imageResult.assets[0].uri);
            }
        } catch (e) {
            console.log("Error while taking Picture");
        }
    }

    const pickImage = async () => {
        try {

            let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permission) {
                Alert.alert("Permisson to access the gallery is required!!");
            }

            let imageResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1
            });

            if(!imageResult.canceled){
                setImageUri(imageResult.assets[0].uri);
            }
        } catch (e) {
            console.log("Error while picking Picture");
        }
    }

    let handleButton = async () => {
        try{

            await AsyncStorage.setItem('onboardingComplete', "true");
            router.replace('/Profile');
        }catch(e){
            console.log("An error occurred during saving!!");
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView>
                <View style={styles.header}>
                    <Image
                        source={require('../assets/images/lemon-logo.png')}
                        resizeMode={'contain'}
                        style={styles.logo}
                    />
                    <Text style={styles.headerTitle}>LITTLE LEMON</Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.bodyText}>Choose a Profile Picture</Text>
                    <View style={styles.inputContainer}>
                        {imageUri ?
                            (<Image
                                source={{ uri: imageUri }}
                                resizeMode='contain'
                                style={styles.profileImage}
                            />) :
                            (<Image
                                source={require("@/assets/images/Default Avatar.jpg")}
                                resizeMode='contain'
                                style={styles.profileImage}
                            />)
                        }
                        <Pressable
                            style={styles.profileButton}
                            onPress={() => takeImage()}
                        >
                            <Text style={styles.profileButtonText}>Take a Photo</Text>
                        </Pressable>
                        <Pressable
                            style={styles.profileButton}
                            onPress={() => pickImage()}
                        >
                            <Text style={styles.profileButtonText}>Choose from Gallery</Text>
                        </Pressable>
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <Pressable
                        style={styles.button}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.buttonText}>Previous</Text>
                    </Pressable>
                    <Pressable
                        style={styles.button}
                        onPress={() => handleButton()}
                    >
                        <Text style={styles.buttonText}>Complete</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default Onboarding3;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f7'
    },
    header: {
        flex: 0.1,
        backgroundColor: '#dee3e9',
        padding: 40,
        paddingTop: 45,
        paddingBottom: 28,
        flexDirection: 'row',
        paddingHorizontal: 33
    },
    headerTitle: {
        color: '#495E57',
        fontSize: 38,
        fontFamily: 'Markazi-Bold',
        letterSpacing: 5,
        paddingTop: '6%'
    },
    logo: {
        width: 70,
        height: 70,
    },
    body: {
        backgroundColor: '#cbd2da',
        flex: 0.75,
    },
    bodyText: {
        fontSize: 30,
        fontFamily: 'Karla-Medium',
        color: '#495E57',
        padding: 40,
        paddingTop: 60,
        textAlign: 'center'
    },
    inputContainer: {
        flex: 1,
        paddingBottom: '8%'
    },
    text: {
        fontSize: 30,
        fontFamily: 'Karla-Regular',
        color: '#495E57',
        textAlign: 'center'
    },
    button: {
        borderWidth: 1,
        borderColor: '#cbd2da',
        backgroundColor: '#cbd2da',
        marginTop: '14%',
        padding: 10,
        //marginHorizontal: '32%',
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 25,
        fontFamily: 'Karla-Medium',
        textAlign: 'center',
        color: '#495E57'
    },
    disabledButton: {
        backgroundColor: '#cbd2da',
        borderColor: 'rgba(203, 210, 218, 0.5)',
        opacity: 0.5,

    },
    disabledButtonText: {
        color: '#495E57',
        opacity: 0.5
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '6%'
    },
    profileImage: {
        width: 175,
        height: 175,
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: '#495E57',
        borderRadius: 100,
        marginBottom: 10
    },
    profileButton: {
        borderWidth: 1,
        borderColor: '#495E57',
        backgroundColor: '#495E57',
        padding: 10,
        borderRadius: 10,
        marginHorizontal: '10%',
        marginVertical: 10,
    },
    profileButtonText: {
        fontSize: 25,
        fontFamily: 'Karla-Medium',
        textAlign: 'center',
        color: 'white'
    }
});