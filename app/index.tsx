import * as React from 'react';
import { ScrollView, View, Text, StyleSheet, Image, TextInput, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { router } from 'expo-router';

const Onboarding = () => {

    const[firstName, setFirstName] = React.useState<string>("");
    const[email, setEmail] = React.useState<string>("");
    const [fontsLoaded] = useFonts({
        'Markazi-Regular': require('@/assets/fonts/MarkaziText-Regular.ttf'),
        'Markazi-Bold' : require('@/assets/fonts/MarkaziText-Bold.ttf'),
        'Karla-Medium' : require('@/assets/fonts/Karla-Medium.ttf'),
        'Karla-Regular' : require('@/assets/fonts/Karla-Regular.ttf'),
    });

    React.useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    const isEmailAndFNameValid = (firstName: string, email: string) => {
        const emailRegrex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const nameRegrex = /^[A-Za-z]+( [A-Za-z]+)*$/;

        return emailRegrex.test(email) && nameRegrex.test(firstName);
    }

    const isValid = isEmailAndFNameValid(firstName, email);

    let completeOnboarding = async () =>{
        try{
            await AsyncStorage.setItem('onboardingCompleted', 'true');
            router.replace('/Profile');
        }catch(e){
            console.log("Error while complete Onboarding");
        }
    }

    return(
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
                   <Text style={styles.text}>Email</Text>
                   <TextInput
                   value={email}
                   onChangeText={(text) => setEmail(text)}
                   style={styles.textInput}
                   cursorColor={"#495E57"}
                   selectionColor={'#EDEFEE'}
                   selectionHandleColor={'#495E57'}
                   keyboardType={"email-address"}
                   />
                </View>
                <TextInput/>
            </View>
            <Pressable 
            style={[styles.button, !isValid && styles.disabledButton]}
             disabled={!isValid}
             onPress={completeOnboarding}
             >
                <Text style={[styles.buttonText, !isValid && styles.disabledButtonText]}>Next</Text>
            </Pressable>
        </ScrollView>
    </KeyboardAvoidingView>
    );
}

export default Onboarding;

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
        paddingHorizontal: 34
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
        paddingTop: '28%'
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