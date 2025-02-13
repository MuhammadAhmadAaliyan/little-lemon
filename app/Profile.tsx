import * as React from 'react'
import { Pressable, Text, View, Alert, BackHandler, StyleSheet, ImageBackground, Image, ScrollView, Modal, TextInput } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Checkbox } from 'react-native-paper'
import { useFonts } from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { MaskedTextInput } from 'react-native-mask-text';

type checkBoxType = {
  orderStatuses: boolean,
  passwordChanges: boolean,
  specialOffers: boolean,
  newsletter: boolean
}

const Profile = () => {

  const [fontsLoaded] = useFonts({
    'Markazi-Regular': require('@/assets/fonts/MarkaziText-Regular.ttf'),
    'Markazi-Bold': require('@/assets/fonts/MarkaziText-Bold.ttf'),
    'Karla-Medium': require('@/assets/fonts/Karla-Medium.ttf'),
    'Karla-Regular': require('@/assets/fonts/Karla-Regular.ttf'),
    'Karla-Bold': require('@/assets/fonts/Karla-Bold.ttf')
  });
  const [profileImage, setProfileImage] = React.useState<string | null | undefined>(null);
  const [firstName, setFirstName] = React.useState<string | undefined>("");
  const [lastName, setLastName] = React.useState<string | undefined>("");
  const [email, setEmail] = React.useState<string | undefined>("");
  const [phoneNumber, setPhoneNumber] = React.useState<string | undefined>("");
  const [checkbox, setCheckbox] = React.useState<checkBoxType>({
    orderStatuses: true,
    passwordChanges: true,
    specialOffers: true,
    newsletter: true
  });
  const [profileInitials, setProfileInitials] = React.useState<string>();
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [field, setField] = React.useState<string>("");
  const [isGlobalModalVisible, setGlobalModalVisible] = React.useState(false);
  const [currentValue, setCurrentValue] = React.useState<any>("");
  const [isAnyChange, setAnyChange] = React.useState<string>("");
  const [isDisabled, setDisalbed] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  let storeNotificationCheckboxStatus = async (data: checkBoxType) => {
    try {
      let jsonData = JSON.stringify(data);
      await AsyncStorage.setItem('notification_checkbox', jsonData);
    } catch (e) {
      console.log("An error while storing status!!");
    }
  }

  let loadNotificationCheckboxStatus = async () => {
    try {
      let jsonData = await AsyncStorage.getItem('notification_checkbox');
      if (jsonData) {
        let parsedData = JSON.parse(jsonData);
        setCheckbox(parsedData);
      }
    } catch (e) {
      console.log("An error occurred while loading status!!");
    }
  }

  let loadDataFromMemory = async () => {
    try{
      let firstName = await AsyncStorage.getItem('user_firstName');
      let lastName = await AsyncStorage.getItem('user_lastName');
      let profileInitials = await AsyncStorage.getItem('user_profileInitials');
      let email = await AsyncStorage.getItem('user_email');
      let phoneNumber = await AsyncStorage.getItem('user_phoneNumber');
      let imageUri = await AsyncStorage.getItem('user_profileImage');

      if(firstName) setFirstName(firstName);
      if(lastName) setLastName(lastName);
      if(profileInitials) setProfileInitials(profileInitials);
      if(email) setEmail(email);
      if(phoneNumber) setPhoneNumber(phoneNumber);
      if(imageUri){
        setProfileImage(imageUri);
      }else{
        setProfileImage(null);
      }

      const checkboxesStatus = await AsyncStorage.getItem('notification_checkbox');
      if(checkboxesStatus){
        await AsyncStorage.setItem('notification_checkbox', checkboxesStatus);
      }else{
        await storeNotificationCheckboxStatus(checkbox);
      }
     
      console.log("Data has been successfully loaded from memory.");
    }catch(e){
      console.log("An error occurred while saving data in memory!!");
    }
  }

  React.useEffect(() => {
    loadDataFromMemory();
    loadNotificationCheckboxStatus();
  }, []);

  React.useEffect(() => {
    switch (field) {
      case 'First name':
        if (currentValue == firstName || currentValue == "") {
          setDisalbed(true);
        } else {
          setDisalbed(false);
        }
        break;
      case 'Last name':
        if (currentValue == lastName || currentValue == "") {
          setDisalbed(true);
        } else {
          setDisalbed(false);
        }
        break;
      case 'Email':
        if (currentValue == email || currentValue == "") {
          setDisalbed(true);
        } else {
          setDisalbed(false);
        }
        break;
      case 'Phone number':
        if (currentValue == phoneNumber || currentValue == "") {
          setDisalbed(true);
        } else {
          setDisalbed(false);
        }
        break;
    }
  }, [currentValue]);

  if (!fontsLoaded) {
    return null;
  }

  let toggleCheckBox = (key: keyof checkBoxType) => {
    setCheckbox((prevCheckbox) => {
      const updatedCheckbox = {
        ...prevCheckbox,
        [key]: !prevCheckbox[key],
      };
      //storeNotificationCheckboxStatus(updatedCheckbox); // Save the updated state
      return updatedCheckbox;
    });
    setAnyChange('true');
  };

  let logOut = async () => {
    try {
      await AsyncStorage.clear();
      router.replace('/');
      setFirstName("");
      setLastName("");
      setEmail("");
      setPhoneNumber("");
      setProfileImage(null);
    } catch (e) {
      console.log("An error occurred during logout!!");
    }
  }

  let takePicture = async () => {
    try {
      let { granted } = await ImagePicker.requestCameraPermissionsAsync();

      if (!granted) {
        Alert.alert("Camera permisson is required in order to take picture!!");
        return;
      }

      let imageResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7
      });

      if (!imageResult.canceled) {
        const profileImage = imageResult.assets[0].uri;
        setProfileImage(profileImage);
        //await AsyncStorage.setItem('user_imageUri', profileImage);
        setAnyChange("Image taked Successfully.")
      }
    } catch (e) {
      console.log("An error occurred while taking picture!!")
    }
  }

  let pickImage = async () => {
    try {

      let { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!granted) {
        Alert.alert("Permisson is required in order to choose picture from gallery!!");
        return;
      }

      let imageResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7
      });

      if (!imageResult.canceled) {
        let profileImage = imageResult.assets[0].uri;
        setProfileImage(profileImage);
        //await AsyncStorage.setItem('user_imageUri', profileImage);
        setAnyChange("Image picked Successfully.")
      }
    } catch (e) {
      console.log("An error occurred while picking image!!");
    }
  }

  let removeProfilePicture = () => {
    Alert.alert("Confirm Deletion:", "Are you sure you want to delete profile picture?", [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => null
      },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            setProfileImage(null);
            //await AsyncStorage.removeItem('user_imageUri');
            setAnyChange('Profile Image has been removed Successfully.')
          } catch (e) {
            console.log("An error occurred while removing profile picture!!");
          }
        }
      },
    ], { cancelable: true });
  }

  let checkIsEmailValid = (email: any) => {
    const emailRegrex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegrex.test(email);
  }

  let handleEditSave = () => {
    switch (field) {
      case 'First name':
        setFirstName(currentValue);
        setGlobalModalVisible(false);
        setAnyChange('true');
        setDisalbed(true);
        break;
      case 'Last name':
        setLastName(currentValue);
        setGlobalModalVisible(false);
        setAnyChange('true');
        setDisalbed(true);
        break;
      case 'Email':
        let validEmail = checkIsEmailValid(currentValue);
        if (validEmail) {
          setEmail(currentValue);
          setGlobalModalVisible(false);
          setAnyChange('true');
          setDisalbed(true);
        } else {
          Alert.alert(`"${currentValue}" is not a valid email. Please entered a valid email!!`);
        }
        break;
      case 'Phone number':
        setPhoneNumber(currentValue);
        setGlobalModalVisible(false);
        setAnyChange('true');
        setDisalbed(true);
        break;
    }
  }

  let saveChanges = async () => {
    try {
      if (firstName)
        await AsyncStorage.setItem('user_firstName', firstName);
      if (lastName)
        await AsyncStorage.setItem('user_lastName', lastName);
      if (email)
        await AsyncStorage.setItem('user_email', email);
      if (phoneNumber)
        await AsyncStorage.setItem('user_phoneNumber', phoneNumber);
      if (profileImage) {
        await AsyncStorage.setItem('user_profileImage', profileImage);
      } else {
        await AsyncStorage.removeItem('user_profileImage');
      }
      if (firstName && lastName) {
        let initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        setProfileInitials(initials);
        await AsyncStorage.setItem('user_profileInitials', initials);
      }

      storeNotificationCheckboxStatus(checkbox);
      Alert.alert("Changes have been saved Successfully.");
      setAnyChange("");
    } catch (e) {
      console.log("An error occurred while saving changes!!")
    }
  }

  let discardChanges = async () => {
    Alert.alert("Confirmation:", "Are you sure you want to discard changes?", [
      {
        text: 'Cancel',
        style: 'cancel',
        onPress: () => null
      },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          loadDataFromMemory();
          loadNotificationCheckboxStatus();
          setAnyChange("");
        }
      },
    ], { cancelable: true });
  }

  return (
    <>
      <View style={styles.container}>
        <ImageBackground
          source={require('@/assets/images/lemon-logo.png')}
          resizeMode={'contain'}
          style={styles.backgroundImage}
        >
        </ImageBackground>
        <View style={styles.header}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
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
              <View style={[styles.profileImage, styles.defaultImage]}>
                <Text style={{ fontFamily: 'Karla-Bold', color: '#fff', fontSize: 18 }}>{profileInitials}</Text>
              </View>
            )
          }
        </View>
        <View style={styles.border} />
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.text}>Personal information</Text>
          <Text style={styles.subText}>Avatar</Text>
          <View style={styles.profileImageArea}>
            {profileImage ?
              (
                <Image source={{ uri: profileImage }} style={styles.avatar} />
              ) :
              (
                <View style={[styles.avatar, styles.defaultImage]}>
                  <Text style={styles.profileInitials}>{profileInitials}</Text>
                </View>
              )
            }
            <Pressable
              style={styles.avatarButtons}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.avatarButtonsText}>Change</Text>
            </Pressable>
            <Pressable
              style={[
                styles.avatarButtons,
                { backgroundColor: '#fff', borderRadius: 5 },
                !profileImage && styles.disabled
              ]}
              disabled={!profileImage}
              onPress={removeProfilePicture}
            >
              <Text style={[styles.avatarButtonsText, { color: '#495E57' }]}>Remove</Text>
            </Pressable>
          </View>
          <Text style={[styles.subText, { paddingTop: '6%' }]}>First name</Text>
          <View style={styles.info}>
            <Text style={styles.infoText}>{firstName}</Text>
            <AntDesign
              name={'edit'}
              size={18}
              color={'#495E57'}
              onPress={() => {
                setField("First name");
                setCurrentValue(firstName);
                setGlobalModalVisible(true);
              }} />
          </View>
          <Text style={[styles.subText, { paddingTop: '6%' }]}>Last name</Text>
          <View style={styles.info}>
            <Text style={styles.infoText}>{lastName}</Text>
            <AntDesign
              name={'edit'}
              size={18}
              color={'#495E57'}
              onPress={() => {
                setField("Last name");
                setCurrentValue(lastName)
                setGlobalModalVisible(true);
              }} />
          </View>
          <Text style={[styles.subText, { paddingTop: '6%' }]}>Email</Text>
          <View style={styles.info}>
            <Text style={styles.infoText}>{email}</Text>
            <AntDesign
              name={'edit'}
              size={18}
              color={'#495E57'}
              onPress={() => {
                setField("Email");
                setCurrentValue(email)
                setGlobalModalVisible(true);
              }} />
          </View>
          <Text style={[styles.subText, { paddingTop: '6%' }]}>Phone number</Text>
          <View style={styles.info}>
            <Text style={styles.infoText}>{phoneNumber}</Text>
            <AntDesign
              name={'edit'}
              size={18}
              color={'#495E57'}
              onPress={() => {
                setField('Phone number');
                setGlobalModalVisible(true);
                setCurrentValue(phoneNumber);
              }}
            />
          </View>
          <Text style={styles.text}>Email notifications</Text>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={checkbox.orderStatuses ? 'checked' : 'unchecked'}
              onPress={() => toggleCheckBox('orderStatuses')}
              color='#495E57'
              uncheckedColor='#495E57'
            />
            <Text style={styles.checkboxText}>Order statuses</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={checkbox.passwordChanges ? 'checked' : 'unchecked'}
              onPress={() => toggleCheckBox('passwordChanges')} color='#495E57'
              uncheckedColor='#495E57'
            />
            <Text style={styles.checkboxText}>Password changes</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={checkbox.specialOffers ? 'checked' : 'unchecked'}
              onPress={() => toggleCheckBox('specialOffers')}
              color='#495E57'
              uncheckedColor='#495E57'
            />
            <Text style={styles.checkboxText}>Special offers</Text>
          </View>
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={checkbox.newsletter ? 'checked' : 'unchecked'}
              onPress={() => toggleCheckBox('newsletter')}
              color='#495E57'
              uncheckedColor='#495E57'
            />
            <Text style={styles.checkboxText}>Newsletter</Text>
          </View>
          <Pressable style={styles.logoutButton} onPress={() => logOut()}>
            <Text style={styles.logoutButtonText}>Log out</Text>
          </Pressable>
          <View style={styles.profileChangesButtonsContainer}>
            <Pressable
              style={[
                styles.profileChangesButton,
                { backgroundColor: '#fff', borderRadius: 5 },
                !isAnyChange && styles.disabled
              ]}
              disabled={!isAnyChange}
              onPress={() => discardChanges()}
            >
              <Text style={[styles.profileChangesButtonText, { color: '#495E57', fontFamily: 'Karla-Regular' }]}>Discard changes</Text>
            </Pressable>
            <Pressable
              style={[
                styles.profileChangesButton,
                !isAnyChange && styles.disabled
              ]}
              disabled={!isAnyChange}
              onPress={() => saveChanges()}
            >
              <Text style={[
                styles.profileChangesButtonText, !currentValue && { color: 'white' }]}>Save changes</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
      <Modal
        style={{ flex: 1 }}
        animationType={'fade'}
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Image From:</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                takePicture();
                setModalVisible(false);
              }
              }
            >
              <Ionicons name={'camera-outline'} size={28} color={'#495E57'} />
              <Text style={styles.modalButtonText}>Take a Picture</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton]}
              onPress={() => {
                pickImage();
                setModalVisible(false);
              }}
            >
              <Ionicons name={'image-outline'} size={28} color={'#495E57'} />
              <Text style={styles.modalButtonText}>Choose from Gallery</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Modal
        style={{ flex: 1 }}
        animationType={'fade'}
        transparent={true}
        visible={isGlobalModalVisible}
        onRequestClose={() => setGlobalModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {field}</Text>
            {field == "Phone number" ? (
              <MaskedTextInput
                mask='+99 999-9999999'
                value={currentValue}
                onChangeText={(masked: string, unmasked: string) => setCurrentValue(masked)}
                placeholder={"+92 3XX-YYYYYYY"}
                placeholderTextColor={"rgba(73, 94, 87, 0.6)"}
                style={styles.textInput}
                cursorColor={"#495E57"}
                selectionColor={'#EDEFEE'}
                selectionHandleColor={'#495E57'}
                keyboardType={"number-pad"}
              />
            ) : (
              <TextInput
                value={currentValue}
                onChangeText={(text: any) => setCurrentValue(text)}
                style={styles.textInput}
                cursorColor={"#495E57"}
                selectionColor={'#EDEFEE'}
                selectionHandleColor={'#495E57'}
                keyboardType={field == "Email" ? 'email-address' : 'default'}
                placeholder={field == "Email" ? 'example@gmail.com' : 'Enter new name'}
                placeholderTextColor={"rgba(73, 94, 87, 0.6)"}
              />
            )}
            <View style={styles.editButtonContainer}>
              <Pressable
                style={styles.editButton}
                onPress={() => setGlobalModalVisible(false)}
              >
                <Text style={styles.editButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.editButton, isDisabled && styles.disabled]}
                onPress={() => {
                  handleEditSave();
                }}
                disabled={isDisabled}
              >
                <Text style={styles.editButtonText}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative'
  },
  backgroundImage: {
    position: 'absolute',
    height: 300,
    width: 300,
    top: '60%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -150 }],
    opacity: 0.1,
    //zIndex: -1
  },
  contentContainer: {
    flex: 1
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
  backButton: {
    width: 40,
    height: 40,
    //bottom: '0.2%',
    borderWidth: 1,
    borderColor: '#495E57',
    backgroundColor: '#495E57',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
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
  border: {
    borderWidth: 0.5,
    borderColor: '#cbd2da'
  },
  text: {
    fontSize: 22,
    fontFamily: 'Karla-Bold',
    padding: '4%',
    paddingVertical: '8%',
    paddingBottom: '4%'

  },
  profileImageArea: {
    paddingHorizontal: '4%',
    flexDirection: 'row'
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 100,
    marginRight: '8%'
  },
  defaultImage: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#64d4c4'
  },
  profileInitials: {
    fontSize: 50,
    fontFamily: 'Karla-Bold',
    color: '#fff',

  },
  subText: {
    paddingLeft: '4%',
    paddingBottom: '2%',
    fontFamily: 'Karla-Regular',
    fontSize: 16,
    color: '#495E57'
  },
  avatarButtons: {
    borderWidth: 1,
    borderColor: '#495E57',
    backgroundColor: '#495E57',
    borderRadius: 8,
    padding: 10,
    height: 45,
    width: 90,
    marginHorizontal: '3%',
    marginVertical: '4%',
    marginTop: '9%',
    justifyContent: 'center'
  },
  avatarButtonsText: {
    color: '#fff',
    fontFamily: 'Karla-Regular',
    fontSize: 18,
    textAlign: 'center'
  },
  info: {
    flexDirection: 'row',
    marginHorizontal: '4%',
    borderWidth: 1,
    borderColor: '#cbd2da',
    padding: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    height: 45,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  infoText: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Karla-Regular',
    color: '#495E57',
    //paddingRight: 6
  },
  checkboxContainer: {
    paddingHorizontal: '2%',
    flexDirection: 'row',
    paddingBottom: '2%'
  },
  checkboxText: {
    fontSize: 20,
    fontFamily: 'Karla-Regular',
    color: '#495E57',
    paddingTop: '2%',
    paddingHorizontal: '2%'
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#F4CE14',
    backgroundColor: '#F4CE14',
    padding: 10,
    marginHorizontal: '4%',
    marginVertical: '10%',
    borderRadius: 10,
    justifyContent: 'center'
  },
  logoutButtonText: {
    fontSize: 20,
    fontFamily: 'Karla-Bold',
    textAlign: 'center',
    color: 'black'
  },
  profileChangesButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: '6%'
  },
  profileChangesButton: {
    borderWidth: 1,
    borderColor: '#495E57',
    backgroundColor: '#495E57',
    padding: 10,
    marginHorizontal: '4%',
    height: 45,
    justifyContent: 'center',
    borderRadius: 10,
  },
  profileChangesButtonText: {
    fontSize: 20,
    fontFamily: 'Karla-Bold',
    textAlign: 'center',
    color: '#fff'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Karla-Bold',
    marginBottom: 15,
  },
  modalButton: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10
  },
  modalButtonText: {
    fontSize: 22,
    fontFamily: 'Karla-Regular',
    color: '#495E57',
    paddingHorizontal: 10
  },
  disabled: {
    opacity: 0.3,
    borderColor: 'rgba(73, 94, 87, 0.6)'
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#495E57',
    marginVertical: 10,
    height: 48,
    borderRadius: 10,
    padding: 8,
    fontFamily: 'Karla-Regular',
    fontSize: 22,
    color: '#495E57'
  },
  editButtonContainer: {
    flexDirection: 'row',
    left: '46%'
  },
  editButton: {
    marginHorizontal: 18,
    marginTop: 25,
  },
  editButtonText: {
    fontSize: 20,
    color: '#495E57'
  }
}); 