import * as React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TextInput, KeyboardAvoidingView, Platform, Pressable, BackHandler, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';

const Onboarding1 = () => {

    const [firstName, setFirstName] = React.useState<string>("");
    const [lastName, setLastName] = React.useState<string>("");
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

        useFocusEffect(() => {
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
        });

    if (!fontsLoaded) {
        return null;
    }

    const isEmailAndFNameValid = (firstName: string, lastName: string) => {

        const nameRegrex = /^[A-Za-z]+( [A-Za-z]+)*$/;

        return nameRegrex.test(firstName) && nameRegrex.test(lastName);
    }

    const isValid = isEmailAndFNameValid(firstName, lastName);

    let handleButton = async () => {
        try {
            let data: any = [];
            if (firstName) {
                data.push(['user_firstName', firstName]);
            }
            if (firstName) {
                data.push(['user_lastName', lastName]);
            }

            let initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
            data.push(['user_profileInitials', initials]);

            if (data.length > 0) {
                await AsyncStorage.multiSet(data);
            }

            console.log("Onboarding1 data has been saved successfully!!");
            router.push('/Onboarding2');
        } catch (e) {
            console.log("An error occurred while saving data of Onboarding 1 Screen!!");
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}>
                    <ScrollView style={{flex: 1}}>
                <View style={styles.header}>
                    <Image
                        source={require('../assets/images/lemon-logo.png')}
                        resizeMode={'contain'}
                        style={styles.logo}
                    />
                    <Text style={styles.headerTitle}>LITTLE LEMON</Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.bodyText}>Let us get to know you</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>First Name</Text>
                        <TextInput
                            value={firstName}
                            onChangeText={(text) => setFirstName(text)}
                            style={styles.textInput}
                            cursorColor={"#495E57"}
                            selectionColor={'#EDEFEE'}
                            selectionHandleColor={'#495E57'}
                            keyboardType={'default'}
                        />
                        <Text style={styles.text}>Last Name</Text>
                        <TextInput
                            value={lastName}
                            onChangeText={(text) => setLastName(text)}
                            style={styles.textInput}
                            cursorColor={"#495E57"}
                            selectionColor={'#EDEFEE'}
                            selectionHandleColor={'#495E57'}
                            keyboardType={'default'}
                        />
                    </View>
                </View>
                <Pressable
                    style={[styles.button, !isValid && styles.disabledButton]}
                    disabled={!isValid}
                    onPress={() => handleButton()}
                >
                    <Text style={[styles.buttonText, !isValid && styles.disabledButtonText]}>Next</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default Onboarding1;

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
        paddingHorizontal: 33,
        justifyContent: 'center'
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
        paddingTop: '28%',
        paddingBottom: '8%'
    },
    text: {
        fontSize: 30,
        fontFamily: 'Karla-Regular',
        color: '#495E57',
        textAlign: 'center'
    },
    textInput: {
        borderWidth: 1.5,
        borderColor: '#495E57',
        marginVertical: 15,
        marginHorizontal: 40,
        height: 50,
        borderRadius: 10,
        padding: 10,
        fontFamily: 'Karla-Regular',
        fontSize: 30,
        color: '#495E57'
    },
    button: {
        borderWidth: 1,
        borderColor: '#cbd2da',
        backgroundColor: '#cbd2da',
        marginTop: '14%',
        padding: 10,
        marginHorizontal: '32%',
        borderRadius: 10,
        left: '24%',
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
    }
});