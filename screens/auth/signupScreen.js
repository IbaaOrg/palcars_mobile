import React, { useContext, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Colors, Fonts, Sizes } from '../../constants/styles';
import { Button } from '../../components/usableComponent/usableComponent';
import { LanguageContext } from '../../languages';
import { MaterialIcons, FontAwesome, Feather, AntDesign } from '@expo/vector-icons';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Snackbar, Switch } from 'react-native-paper';
import axios from 'axios';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { BottomSheet } from '@rneui/themed';

const SignupScreen = ({ navigation }) => {
    const { i18n, language } = useContext(LanguageContext);
    const isRtl = (language === 'ar');
    function tr(key) { return i18n.t(`signupScreen.${key}`); }

    const { width } = Dimensions.get('window');

    const [snackBarMsg, setSnackBarMsg] = useState('');
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthdate, setBirthdate] = useState(null);
    const [drivingLicenseExpiryDate, setDrivingLicenseExpiryDate] = useState(null);    
    const [role, setRole] = useState('Renter');
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [userPhoto, setUserPhoto] = useState(null);
    const [hasValidDrivingLicense, setHasValidDrivingLicense] = useState(false);
    const [drivingLicensePhoto, setDrivingLicensePhoto] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState(require('../../assets/images/users/user1.jpg'));
    const [drivingPicUrl, setDrivingPicUrl] = useState(require('../../assets/images/users/user2.png'));
    const [showChangeProfilePicSheet, setShowChangeProfilePicSheet] = useState(false);
    const [showChangeDrivingPicSheet, setShowChangeDrivingPicSheet] = useState(false);

    const handleSelectImage = (setImage) => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (!response.didCancel && !response.errorCode) {
                setImage(response.assets[0].uri);
            }
        });
    };

    const handleCaptureImage = (setImage) => {
        launchCamera({ mediaType: 'photo' }, (response) => {
            if (!response.didCancel && !response.errorCode) {
                setImage(response.assets[0].uri);
            }
        });
    };

    const header = () => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Sizes.fixPadding * 2.0 }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color={Colors.primaryColor} />
                </TouchableOpacity>
                <Text style={{ ...Fonts.blackColor18Medium }}>{tr('signup')}</Text>
            </View>
        );
    };

    const handleConfirm = (selectedDate) => {
        if (selectedDate) {
            setBirthdate(selectedDate);
        }
        hideDatePicker();
    };
    const handleConfirm2 = (selectedDate) => {
        if (selectedDate) {
            setDrivingLicenseExpiryDate(selectedDate); 
        }
        hideDatePicker();
    };

    const showDatePickerModal = () => { setDatePickerVisibility(true); };
    const hideDatePicker = () => { setDatePickerVisibility(false); };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {signinOptionsInfo()}
                    {success && (
                        <View style={styles.alertSuccess}>
                            <Text>{success}</Text>
                        </View>
                    )}
                    {emailInfo()}
                    {nameInfo()}
                    {phoneNumberInfo()}
                    {passwordInfo()}
                    {profilePicWithChangeOption()}
                    {drivingLicenseInfo()}
                    {birthdateInfo()}
                    {signupButton()}
                    {snackBar()}
                </ScrollView>
            </View>
            {alreadyAccountInfo()}
            {changeProfilePicOptionsSheet()}
            {changeDrivingPicOptionsSheet()}
        </SafeAreaView>
    );

    function signinOptionsInfo() {
        return (
            <View style={{ marginBottom: Sizes.fixPadding * 4.5, marginTop: Sizes.fixPadding * 2.0 }}>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding, ...Fonts.blackColor16Medium }}>
                    {tr('optionsTitle')}
                </Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', justifyContent: "space-around", alignItems: 'center', marginHorizontal: Sizes.fixPadding }}>
                    <View style={styles.googleAndFacebookIconWrapStyle}>
                        <FontAwesome name="google" size={24} color={Colors.redColor} />
                    </View>
                    <View style={styles.googleAndFacebookIconWrapStyle}>
                        <FontAwesome name="facebook" size={24} color={Colors.blueColor} />
                    </View>
                </View>
            </View>
        );
    }

    function alreadyAccountInfo() {
        return (
            <Text style={{ textAlign: 'center', marginVertical: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.grayColor14Medium }}>{tr('alreadyAccount')}</Text>{' '}
                <Text onPress={() => navigation.push('Signin')} style={{ ...Fonts.primaryColor14Medium }}>{tr('signin')}</Text>
            </Text>
        );
    }

    function signupButton() {
        return (
            <Button btnText={<Text>{tr('btnText')}</Text>} btnStyle={styles.signinButtonStyl } onPress={() => signupProcess()} />
      );
    }

    function signupProcess() {
        const userData = {
            name: name,
            email: email,
            phone: phoneNumber,
            password: password,
            role: role,
            birthdate: birthdate,
            photo_user: profilePicUrl,
            valid: hasValidDrivingLicense,
            expireddate: drivingLicenseExpiryDate,
            photo_drivinglicense: drivingPicUrl,
        };

        axios.post('https://zzz.center/public/api/register', userData)
            .then(response => {
                console.log('Registration successful', response.data);
            })
            .catch(error => {
                setShowSnackBar(true);
                setSnackBarMsg(error.response.data.msg);
            });
    }

    function phoneNumberInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Medium }}>{tr('phoneNumberTitle')}</Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.textFieldWrapStyle }}>
                    <Feather name="phone" size={16} color={phoneNumber ? Colors.primaryColor : Colors.grayColor} />
                    <TextInput
                        placeholder={tr('phoneNumberPlaceHolder')}
                        value={phoneNumber}
                        onChangeText={(value) => setPhoneNumber(value)}
                        keyboardType="phone-pad"
                        style={{ ...Fonts.blackColor14Regular, flex: 1, marginHorizontal: Sizes.fixPadding }}
                        placeholderTextColor={Colors.grayColor}
                        selectionColor={Colors.primaryColor}
                    />
                </View>
            </View>
        );
    }

    function emailInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Medium }}>{tr('emailIdTitle')}</Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.textFieldWrapStyle }}>
                    <MaterialIcons name="email" size={16} color={email ? Colors.primaryColor : Colors.grayColor} />
                    <TextInput
                        placeholder={tr('emailPlaceHolder')}
                        value={email}
                        onChangeText={(value) => setEmail(value)}
                        keyboardType="email-address"
                        style={{ ...Fonts.blackColor14Regular, flex: 1, marginHorizontal: Sizes.fixPadding }}
                        placeholderTextColor={Colors.grayColor}
                        selectionColor={Colors.primaryColor}
                    />
                </View>
            </View>
        );
    }

    function passwordInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Medium }}>{tr('password')}</Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.textFieldWrapStyle }}>
                    <MaterialIcons name="lock" size={16} color={password ? Colors.primaryColor : Colors.grayColor} />
                    <TextInput
                        placeholder={tr('Enteryourpassword')}
                        value={password}
                        onChangeText={(value) => setPassword(value)}
                        secureTextEntry={!showPassword}
                        style={{ ...Fonts.blackColor14Regular, flex: 1, marginHorizontal: Sizes.fixPadding }}
                        placeholderTextColor={Colors.grayColor}
                        selectionColor={Colors.primaryColor}
                    />
                    <Feather
                        name={showPassword ? "eye-off" : "eye"}
                        size={16}
                        color={Colors.grayColor}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                </View>
            </View>
        );
    }

    function nameInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Medium }}>{tr('nameTitle')}</Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.textFieldWrapStyle }}>
                    <MaterialIcons name="person" size={16} color={name ? Colors.primaryColor : Colors.grayColor} />
                    <TextInput
                        placeholder={tr('namePlaceHolder')}
                        value={name}
                        onChangeText={(value) => setName(value)}
                        style={{ ...Fonts.blackColor14Regular, flex: 1, marginHorizontal: Sizes.fixPadding }}
                        placeholderTextColor={Colors.grayColor}
                        selectionColor={Colors.primaryColor}
                    />
                </View>
            </View>
        );
    }

    function birthdateInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Mvedium }}>{tr('birthdate')}</Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.textFieldWrapStyle  }}>
                    <MaterialIcons name="calendar-today" size={16} color={birthdate ? Colors.primaryColor : Colors.grayColor} />
                    <TouchableOpacity onPress={showDatePickerModal}>
                        <Text style={{ ...Fonts.blackColor14Regular, flex: 1, marginHorizontal: Sizes.fixPadding }}>
                            {birthdate ? birthdate.toLocaleDateString() : tr('EnterbirthdatePlaceHolder')}
                        </Text>
                   
                    </TouchableOpacity>
                    <DateTimePicker
                        value={birthdate || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            if (event.type === "set") {
                                handleConfirm(selectedDate);
                            } else {
                                hideDatePicker();
                            }
                        }}
                    />
                </View>
             
            </View>
        );
    }

    function drivingLicenseInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Medium }}>{tr('hasValidDrivingPhotoTitle')}</Text>
                    <Switch
                        value={hasValidDrivingLicense}
                        onValueChange={(value) => setHasValidDrivingLicense(value)}
                        color={Colors.primaryColor}
                    />
                </View>
                {hasValidDrivingLicense && (
                    <>
                        <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.textFieldWrapStyle }}>
                            <MaterialIcons name="calendar-today" size={16} color={drivingLicenseExpiryDate ? Colors.primaryColor : Colors.grayColor} />
                            <TouchableOpacity onPress={showDatePickerModal}>
                                <Text style={{ ...Fonts.blackColor14Regular, flex: 1, marginHorizontal: Sizes.fixPadding }}>
                                    {drivingLicenseExpiryDate ? drivingLicenseExpiryDate.toLocaleDateString() : tr('drivingLicenseExpiryDate')}
                                </Text>
                            </TouchableOpacity>
                            <DateTimePicker
                        value={drivingLicenseExpiryDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            if (event.type === "set") {
                                handleConfirm2(selectedDate);
                            } else {
                                hideDatePicker();
                            }
                        }}
                    />
                        </View>
                        <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', justifyContent: 'center', alignItems: 'center', marginTop: Sizes.fixPadding }}>
                            <TouchableOpacity onPress={() => setShowChangeDrivingPicSheet(true)} style={{ alignItems: 'center' }}>
                                <Image
                                    source={drivingPicUrl}
                                    style={{ width: 80.0, height: 80.0, borderRadius: Sizes.fixPadding, borderColor: Colors.lightGrayColor, borderWidth: 1.0 }}
                                />
                                <Text style={{ marginTop: Sizes.fixPadding - 5.0, ...Fonts.grayColor12Regular }}>
                                    {tr('drivingPhotoTitle')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        );
    }

    function profilePicWithChangeOption() {
        return (
            <View style={{ alignItems: 'center', marginVertical: Sizes.fixPadding * 2.0 }}>
                <TouchableOpacity onPress={() => setShowChangeProfilePicSheet(true)}>
                    <Image
                        source={profilePicUrl}
                        style={{ width: 100.0, height: 100.0, borderRadius: 50.0, borderColor: Colors.lightGrayColor, borderWidth: 1.0 }}
                    />
                    <Text style={{ textAlign: 'center', marginTop: Sizes.fixPadding - 5.0, ...Fonts.grayColor12Regular }}>
                        {tr('userPhotoTitle')}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    function snackBar() {
        return (
            <Snackbar
                visible={showSnackBar}
                onDismiss={() => setShowSnackBar(false)}
                duration={3000}
                style={{ backgroundColor: Colors.blackColor }}
            >
                <Text style={{ ...Fonts.whiteColor16Medium }}>{snackBarMsg}</Text>
            </Snackbar>
        );
    }

    function changeProfilePicOptionsSheet() {
        return (
            <BottomSheet
                isVisible={showChangeProfilePicSheet}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
                onBackdropPress={() => setShowChangeProfilePicSheet(false)}
            >
                <View style={styles.bottomSheetWrapStyle}>
                    <Text style={{ textAlign: 'center', marginVertical: Sizes.fixPadding, ...Fonts.blackColor18Medium }}>
                        {tr('sheetTitle')}
                    </Text>
                    <TouchableOpacity
                        onPress={() => handleSelectImage(setProfilePicUrl)}
                        style={styles.bottomSheetOptionStyle}
                    >
                        <Text style={{ ...Fonts.blackColor16Medium }}>{tr('gallery')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleCaptureImage(setProfilePicUrl)}
                        style={styles.bottomSheetOptionStyle}
                    >
                        <Text style={{ ...Fonts.blackColor16Medium }}>{tr('camera')}</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
        );
    }

    function changeDrivingPicOptionsSheet() {
        return (
            <BottomSheet
                isVisible={showChangeDrivingPicSheet}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
                onBackdropPress={() => setShowChangeDrivingPicSheet(false)}
            >
                <View style={styles.bottomSheetWrapStyle}>
                    <Text style={{ textAlign: 'center', marginVertical: Sizes.fixPadding, ...Fonts.blackColor18Medium }}>
                        {tr('sheetTitle')}
                    </Text>
                    <TouchableOpacity
                        onPress={() => handleSelectImage(setDrivingPicUrl)}
                        style={styles.bottomSheetOptionStyle}
                    >
                        <Text style={{ ...Fonts.blackColor16Medium }}>{tr('gallery')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleCaptureImage(setDrivingPicUrl)}
                        style={styles.bottomSheetOptionStyle}
                    >
                        <Text style={{ ...Fonts.blackColor16Medium }}>{tr('camera')}</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
        );
    }
};

const styles = StyleSheet.create({
    bottomSheetWrapStyle: {
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding,
        backgroundColor: Colors.whiteColor,
    },
    bottomSheetOptionStyle: {
        backgroundColor: Colors.whiteColor,
        paddingVertical: Sizes.fixPadding,
        borderBottomColor: Colors.lightGrayColor,
        borderBottomWidth: 1.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
    },
    signinButtonStyl: {
        marginHorizontal: Sizes.fixPadding * 3.0,
        marginVertical: Sizes.fixPadding *2.0,
    
    },
    alertSuccess: {
        backgroundColor: Colors.greenColor,
        padding: Sizes.fixPadding,
        margin: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding,
    },
    textFieldWrapStyle: {
        borderBottomColor: Colors.lightGrayColor,
        borderBottomWidth: 1.0,
        paddingVertical: Sizes.fixPadding + 5.0,
    }
});

export default SignupScreen;
