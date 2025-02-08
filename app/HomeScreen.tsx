import * as React from 'react';
import { View, ScrollView, Text, StyleSheet, Image, Pressable, Alert, BackHandler, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFocusEffect } from 'expo-router';
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {

    const [fontsLoaded] = useFonts({
        'Markazi-Regular': require('@/assets/fonts/MarkaziText-Regular.ttf'),
        'Markazi-Bold': require('@/assets/fonts/MarkaziText-Bold.ttf'),
        'Karla-Medium': require('@/assets/fonts/Karla-Medium.ttf'),
        'Karla-Regular': require('@/assets/fonts/Karla-Regular.ttf'),
        'Karla-Bold': require('@/assets/fonts/Karla-Bold.ttf'),
        'Markazi-Medium': require('@/assets/fonts/MarkaziText-Medium.ttf'),
        'Karla-ExtraBold': require('@/assets/fonts/Karla-ExtraBold.ttf')

    });
    const [profileImage, setProfileImage] = React.useState<string | null | undefined>(null);
    const [profileInitials, setProfileInitials] = React.useState<string | undefined>("");
    const [menu, setMenu] = React.useState([]);
    const [categories, setCategories] = React.useState<string[]>([]);
    const [isLoading, setLoading] = React.useState(true);

    const menuAPI = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';
    const BASE_IMG_URL = 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/';

    React.useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

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
    });

    React.useEffect(() => {
        let fetchMenu = async () => {
            try {
                const response = await fetch(menuAPI);
                const data = await response.json();
                const uniqueCategories: any = [...new Set(data.menu.map((item: any) => item.category))];

                setCategories(uniqueCategories);
                setMenu(data.menu);
            } catch (e) {
                console.log("An error occurred while fetching menu from the API.")
            } finally {
                setLoading(false);
            }
        }
        fetchMenu();
    }, []);

    if (!fontsLoaded) {
        return null;
    }

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
            <View style={styles.heroSection}>
                <Text style={styles.heroSectionTitle}>Little Lemon</Text>
                <Text style={styles.heroSectionSubTitle}>Chicago</Text>
                <View style={styles.heroSectionIntroContainer}>
                    <Text style={styles.leadText}>We are a family owned Mediterranean restaurant, focused on traditional recipies served with a modern twist.</Text>
                    <Image
                        source={require('@/assets/images/Hero image.png')}
                        resizeMode={'cover'}
                        style={styles.heroImage}
                    />
                </View>
                <View style={styles.searchBarContainer}>
                    <Ionicons name={'search-sharp'} size={24} color={'#495E57'} />
                </View>
            </View>
            <View style={styles.menuBreakdown}>
                <Text style={styles.sectionTitle}>ORDER FOR DELIVERY!</Text>
                <View style={styles.categoryContainer}>
                    {
                        categories.map((category: any, index: any) => (
                            <TouchableOpacity key={index} style={styles.category}>
                                <Text style={styles.categoryText}>{category}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
                <View style={{ borderWidth: 0.5, borderColor: '#CDCDCD' }} />
                <FlatList
                    data={menu}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }: { item: any }) => (
                        <View style={styles.card}>
                            <View style={styles.details}>
                                <Text style={styles.cardTitle}>{item.name}</Text>
                                <Text style={styles.paragraphText} numberOfLines={2}>{item.description}</Text>
                                <Text style={styles.highlightText}>${item.price}</Text>
                            </View>
                            <Image
                            source={{uri: `${BASE_IMG_URL}${item.image}?raw=true`}}
                            style={styles.itemImage}
                            resizeMode={'cover'}
                            />
                        </View>
                    )}
                />
            </View>
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
        flex: 1,
        padding: 14
    },
    heroSectionTitle: {
        fontSize: 64,
        fontFamily: 'Markazi-Medium',
        color: '#F4CE14',
    },
    heroSectionSubTitle: {
        fontSize: 40,
        fontFamily: 'Markazi-Regular',
        color: '#EDEFEE',
        top: -15
    },
    heroSectionIntroContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    leadText: {
        fontSize: 18,
        width: 200,
        fontFamily: 'Karla-Medium',
        color: '#EDEFEE'
    },
    heroImage: {
        width: 115,
        height: 155,
        borderRadius: 16,
        top: -45
    },
    searchBarContainer: {
        borderWidth: 1,
        borderColor: '#fff',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 8,
        width: 50,
        height: 45,
        justifyContent: 'center'
    },
    menuBreakdown: {
        flex: 1,
        marginVertical: 16,
        padding: 10
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Karla-ExtraBold'
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
    },
    category: {
        borderWidth: 1,
        borderRadius: 18,
        backgroundColor: '#CDCDCD',
        borderColor: '#CDCDCD',
        padding: 10,
        width: 79,
        height: 39,
    },
    categoryText: {
        fontSize: 16,
        fontFamily: 'Karla-ExtraBold',
        textAlign: 'center',
        color: '#495E57'
    },
    card: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    details: {
        paddingVertical: 14
    },
    cardTitle: {
        fontSize: 18,
        fontFamily: 'Karla-Bold',
        color: '#000000'
    },
    paragraphText: {
        fontSize: 16,
        fontFamily: 'Karla-Regular',
        paddingTop: 16,
        paddingVertical: 10,
        color: '#495E57',
        width: 230
    },
    highlightText: {
        fontSize: 16,
        fontFamily: 'Karla-Medium',
        color: '#495E57'
    },
    itemImage: {
        width: 80,
        height: 80,
        marginTop: 14
    }
});