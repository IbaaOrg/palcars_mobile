import { StyleSheet, Text, View, SafeAreaView, StatusBar, ActivityIndicator, ScrollView } from 'react-native'
import React, { useState, useContext } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import { Overlay } from '@rneui/themed';
import { LanguageContext } from '../../languages';
import { Button } from '../../components/usableComponent/usableComponent';
import OTPTextView from 'react-native-otp-textinput';

const VerificationScreen = ({ navigation }) => {

    const { i18n, language } = useContext(LanguageContext);

    const isRtl = (language == 'ar');

    function tr(key) {
        return i18n.t(`verificationScreen.${key}`)
    }

    const [otpInput, setotpInput] = useState('');
    const [isLoading, setisLoading] = useState(false);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {enterCodeInfo()}
                    {otpFields()}
                    {resendText()}
                    {verifyButton()}
                </ScrollView>
                {loadingDialog()}
            </View>
        </SafeAreaView>
    )

    function loadingDialog() {
        return (
            <Overlay
                isVisible={isLoading}
                overlayStyle={styles.dialogStyle}
            >
                <ActivityIndicator size={35} color={Colors.primaryColor} style={{ alignSelf: 'center' }} />
                <Text style={{ marginTop: Sizes.fixPadding, textAlign: 'center', ...Fonts.blackColor16SemiBold }}>
                    {tr('wait')}
                </Text>
            </Overlay>
        )
    }

    function resendText() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ textAlign: 'center', ...Fonts.grayColor14Medium }}>
                    {tr('notReceive')}
                </Text>
                <Text style={{ textAlign: 'center', ...Fonts.primaryColor14Medium }}>
                    {tr('resend')}
                </Text>
            </View>

        )
    }

    function verifyButton() {
        return (
            <Button
                btnText={tr('btnText')}
                btnStyle={styles.verifyButtonStyle}
                onPress={() => {
                    setisLoading(true)
                    setTimeout(() => {
                        setisLoading(false)
                        navigation.push('BottomTabBar')
                    }, 2000);
                }}
            />
        )
    }

    function otpFields() {
        return (
            <OTPTextView
                containerStyle={{ justifyContent: 'center', marginHorizontal: Sizes.fixPadding, marginVertical: Sizes.fixPadding * 2.5, }}
                handleTextChange={(text) => {
                    setotpInput(text)
                    if (otpInput.length == 3) {
                        setisLoading(true)
                        setTimeout(() => {
                            setisLoading(false)
                            navigation.push('BottomTabBar')
                        }, 2000);
                    }
                }}
                inputCount={4}
                keyboardType="numeric"
                tintColor={Colors.primaryColor}
                offTintColor={Colors.shadowColor}
                textInputStyle={{ ...styles.textFieldStyle }}
            />
        )
    }

    function enterCodeInfo() {
        return (
            <Text style={styles.enterCodeInfoTextStyle}>
                {tr('description')} +9188******10
            </Text>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <Text style={{ ...Fonts.blackColor22SemiBold, textAlign: 'center', }}>
                    {tr('header')}
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

export default VerificationScreen;

const styles = StyleSheet.create({
    verifyButtonStyle: {
        marginTop: Sizes.fixPadding * 6.0,
        marginBottom: Sizes.fixPadding * 2.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding,
    },
    textFieldStyle: {
        width: 40.0,
        height: 40.0,
        borderBottomWidth: null,
        borderRadius: Sizes.fixPadding - 2.0,
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        borderWidth: 1.0,
        ...Fonts.blackColor16Medium,
        lineHeight: 22.0,
    },
    dialogStyle: {
        width: '80%',
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingBottom: Sizes.fixPadding * 3.5,
        paddingTop: Sizes.fixPadding * 3.0,
        elevation: 3.0,
    },
    headerWrapStyle: {
        margin: Sizes.fixPadding * 2.0,
        justifyContent: 'center',
    },
    enterCodeInfoTextStyle: {
        marginTop: Sizes.fixPadding * 2.5,
        marginHorizontal: Sizes.fixPadding * 3.0,
        textAlign: 'center',
        ...Fonts.grayColor14Medium
    }
})