import * as React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert, BackHandler } from 'react-native';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const HomeScreen = () => {

    const [profileImage, setProfileImage] = React.useState<string | null | undefined>(null);
    const [profileInitials, setProfileInitials] = React.useState<string | undefined>("");
    //Built-in Back Button action handler.
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
    //Function of loading Profile data from memory.
    let loadProfileDataFromMemory = async () => {
        try {
            let initials = await AsyncStorage.getItem('user_profileInitials');
            let imageUri = await AsyncStorage.getItem('user_profileImage');

            if (initials) setProfileInitials(initials);
            if (imageUri) {
                setProfileImage(imageUri);
            } else {
                setProfileImage(null);
            }
        } catch (e) {
            console.log("An error occurred while loading profile data!!");
        }
    }

    useFocusEffect(() => {
        loadProfileDataFromMemory();
    })

    return (
        <View style={styles.container}>
            <View style={styles.header}>
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
                        <Pressable onPress={() => router.push('/Profile')}>
                            <Image
                                source={{ uri: profileImage }}
                                style={styles.profileImage}
                                resizeMode={'contain'}
                            />
                        </Pressable>
                    ) : (
                        <Pressable style={[styles.profileImage, styles.defaultImage]} onPress={() => router.push('/Profile')}>
                            <Text style={{ fontFamily: 'Karla-Bold', color: '#fff', fontSize: 18 }}>{profileInitials}</Text>
                        </Pressable>
                    )
                }
            </View>
            <View style={styles.heroSection}></View>
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        padding: '4%',
        paddingVertical: '8%',
        paddingTop: '14%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '4%'
    },
    headerTitle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        left: '20%'
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
        textAlign: 'center'
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 50,
        bottom: '0.8%'
    },
    defaultImage: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#64d4c4'
    },
    heroSection: {
        backgroundColor: '#495E57',
        flex: 0.5
    }
});