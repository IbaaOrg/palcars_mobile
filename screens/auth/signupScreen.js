import { SafeAreaView, StatusBar, StyleSheet, Text, View, TextInput, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { Button } from '../../components/usableComponent/usableComponent'
import { LanguageContext } from '../../languages'
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';

const SignupScreen = ({ navigation }) => {

    const { i18n, language } = useContext(LanguageContext);

    const isRtl = (language == 'ar');

    function tr(key) {
        return i18n.t(`signupScreen.${key}`)
    }

    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {signinOptionsInfo()}
                    {nameInfo()}
                    {emailInfo()}
                    {phoneNumberInfo()}
                    {signupButton()}
                </ScrollView>
            </View>
            {alreadyAccountInfo()}
        </SafeAreaView>
    )

    function alreadyAccountInfo() {
        return (
            <Text style={{ textAlign: 'center', marginVertical: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.grayColor14Medium }}>
                    {tr('alreadyAccount')} { }
                </Text>
                <Text onPress={() => navigation.push('Signin')} style={{ ...Fonts.primaryColor14Medium }}>
                    {tr('signin')}
                </Text>
            </Text>
        )
    }

    function signupButton() {
        return (
            <Button
                btnText={tr('btnText')}
                btnStyle={styles.signinButtonStyle}
                onPress={() => navigation.push('Verification')}
            />
        )
    }

    function phoneNumberInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Medium }}>
                    {tr('phoneNumberTitle')}
                </Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.textFieldWrapStyle, }}>
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
        )
    }

    function emailInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding + 5.0 }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Medium }}>
                    {tr('emailIdTitle')}
                </Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.textFieldWrapStyle, }}>
                    <Feather name="mail" size={16} color={email ? Colors.primaryColor : Colors.grayColor} />
                    <TextInput
                        placeholder={tr('emailPlaceHolder')}
                        value={email}
                        onChangeText={(value) => setEmail(value)}
                        style={{ ...Fonts.blackColor14Regular, flex: 1, marginHorizontal: Sizes.fixPadding }}
                        placeholderTextColor={Colors.grayColor}
                        selectionColor={Colors.primaryColor}
                        keyboardType="email-address"
                    />
                </View>
            </View>
        )
    }

    function nameInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding + 5.0 }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Medium }}>
                    {tr('nameTitle')}
                </Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.textFieldWrapStyle, }}>
                    <Feather name="user" size={16} color={name ? Colors.primaryColor : Colors.grayColor} />
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
        )
    }

    function signinOptionsInfo() {
        return (
            <View style={{ marginBottom: Sizes.fixPadding * 2.5, marginTop: Sizes.fixPadding - 5.0, }}>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding, ...Fonts.blackColor16Medium }}>
                    {tr('optionsTitle')}
                </Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', marginHorizontal: Sizes.fixPadding }}>
                    <View style={styles.googleAndFacebookIconWrapStyle}>
                        <FontAwesome name="google" size={24} color={Colors.redColor} />
                    </View>
                    <View style={styles.googleAndFacebookIconWrapStyle}>
                        <FontAwesome name="facebook" size={24} color={Colors.blueColor} />
                    </View>
                </View>
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <Text style={{ ...Fonts.blackColor22SemiBold, textAlign: 'center', }}>
                    {tr('signup')}
                </Text>
                <MaterialIcons
                    name={isRtl ? "arrow-forward" : "arrow-back"}
                    size={20}
                    color={Colors.blackColor}
                    style={{ position: 'absolute', bottom: 10.0, right: isRtl ? 0.0 : null, }}
                    onPress={() => navigation.pop()}
                />
            </View>
        )
    }
}

export default SignupScreen

const styles = StyleSheet.create({
    googleAndFacebookIconWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        borderRadius: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 3.0,
    },
    textFieldWrapStyle: {
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 2.0,
        borderColor: Colors.shadowColor,
        borderWidth: 1.0,
        borderBottomWidth: 0.0,
    },
    signinButtonStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding * 4.5,
    },
    headerWrapStyle: {
        margin: Sizes.fixPadding * 2.0,
        justifyContent: 'center',
    },
    animatedView: {
        backgroundColor: Colors.lightBlackColor,
        position: "absolute",
        bottom: 20,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding,
        justifyContent: "center",
        alignItems: "center",
    },
})