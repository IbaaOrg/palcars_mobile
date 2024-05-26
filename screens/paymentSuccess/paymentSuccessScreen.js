import { SafeAreaView, StatusBar, Text, View, Image, BackHandler } from 'react-native'
import React, { useContext, useCallback } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { LanguageContext } from '../../languages'
import { useFocusEffect } from '@react-navigation/native'

const PaymentSuccessScreen = ({ navigation }) => {

    const { i18n, language } = useContext(LanguageContext);

    const isRtl = (language == 'ar');

    function tr(key) {
        return i18n.t(`paymentSuccessScreen.${key}`)
    }

    const backAction = () => {
        navigation.push('BottomTabBar');
        return true;
    }

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
        }, [backAction])
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    {successIcon()}
                    {successDetail()}
                </View>
                <Text
                    onPress={() => navigation.push('BottomTabBar')}
                    style={{ margin: Sizes.fixPadding, textAlign: 'center', ...Fonts.primaryColor14SemiBold }}
                >
                    {tr('backHome')}
                </Text>
            </View>
        </SafeAreaView>
    )

    function successDetail() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 3.0, alignItems: 'center' }}>
                <Text style={{ marginVertical: Sizes.fixPadding - 5.0, textAlign: 'center', ...Fonts.primaryColor20SemiBold }}>
                    {tr('success')}
                </Text>
                <Text style={{ textAlign: 'center', ...Fonts.grayColor14Medium }}>
                    {tr('description1')} audi A8 L {tr('description2')}
                </Text>
            </View>
        )
    }

    function successIcon() {
        return (
            <Image
                source={require('../../assets/images/icons/success.png')}
                style={{ width: 80.0, height: 80.0, resizeMode: 'contain' }}
            />
        )
    }
}

export default PaymentSuccessScreen;