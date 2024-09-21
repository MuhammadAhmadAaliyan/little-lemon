import * as React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';
import { MaskedTextInput } from 'react-native-mask-text';
import { useAppData } from './AppData';

const Onboarding2 = () => {

    const [email, setEmail] = React.useState<string>("");
    const [phoneNumber, setPhoneNumber] = React.useState<string>("");
    const [fontsLoaded] = useFonts({
        'Markazi-Regular': require('@/assets/fonts/MarkaziText-Regular.ttf'),
        'Markazi-Bold': require('@/assets/fonts/MarkaziText-Bold.ttf'),
        'Karla-Medium': require('@/assets/fonts/Karla-Medium.ttf'),
        'Karla-Regular': require('@/assets/fonts/Karla-Regular.ttf'),
    });

    const { updateScreenData } = useAppData();

    React.useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    let checkIsEmailAndPhonenumberValid = (email: string, phoneNumber: string) => {
        const emailRegrex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let validPhoneNumber = false;
        if (phoneNumber.length === 15) {
            validPhoneNumber = true;
            return emailRegrex.test(email) && validPhoneNumber;
        }

    }

    let isValid = checkIsEmailAndPhonenumberValid(email, phoneNumber);

    let handleButton = () => {

        router.push('/Onboarding3');
        updateScreenData('Onboarding2', {email: email, phoneNumber: phoneNumber});
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
                    <Text style={styles.bodyText}>Let us get to know you</Text>
                    <View style={styles.inputContainer}>
                        <Text style={styles.text}>Email</Text>
                        <TextInput
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            placeholder={"example@gmail.com"}
                            placeholderTextColor={"rgba(73, 94, 87, 0.6)"}
                            style={styles.textInput}
                            cursorColor={"#495E57"}
                            selectionColor={'#EDEFEE'}
                            selectionHandleColor={'#495E57'}
                            keyboardType={"email-address"}
                        />
                        <Text style={styles.text}>Phone number</Text>
                        <MaskedTextInput
                            mask='+99 999-9999999'
                            value={phoneNumber}
                            onChangeText={(masked: string, unmasked: string) => setPhoneNumber(masked)}
                            placeholder={"+92 3XX-YYYYYYY"}
                            placeholderTextColor={"rgba(73, 94, 87, 0.6)"}
                            style={styles.textInput}
                            cursorColor={"#495E57"}
                            selectionColor={'#EDEFEE'}
                            selectionHandleColor={'#495E57'}
                            keyboardType={"number-pad"}
                        />
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
                        style={[styles.button, !isValid && styles.disabledButton, {paddingHorizontal: '10%'}]}
                        disabled={!isValid}
                        onPress={() => handleButton()}
                    >
                        <Text style={[styles.buttonText, !isValid && styles.disabledButtonText]}>Next</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default Onboarding2;

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
        //marginHorizontal: '12%',
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
    }
});