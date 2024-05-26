import { SafeAreaView, StatusBar, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { Header, Button } from '../../components/usableComponent/usableComponent'
import { LanguageContext } from '../../languages'

const PersonalInformationScreen = ({ navigation }) => {

    const { i18n, language } = useContext(LanguageContext);

    const isRtl = (language == 'ar');

    function tr(key) {
        return i18n.t(`personalInformationScreen.${key}`)
    }

    const [state, setState] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        name,
        email,
        phone,
        address,
    } = state;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {nameInfo()}
                    {emailInfo()}
                    {phoneNumberInfo()}
                    {addressInfo()}
                </ScrollView>
            </View>
            {continueButton()}
        </SafeAreaView>
    )

    function continueButton() {
        return (
            <Button
                btnText={tr('btnText')}
                btnStyle={{ borderRadius: 0.5, }}
                onPress={() => { navigation.push('UploadDocument') }}
            />
        )
    }

    function addressInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding + 10.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 8.0, ...Fonts.blackColor16Medium }}>
                    {tr('addressTitle')}
                </Text>
                <TextInput
                    value={address}
                    onChangeText={(value) => updateState({ address: value })}
                    placeholder={tr('addressPlaceHolder')}
                    style={styles.textFieldStyle}
                    placeholderTextColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                    multiline={true}
                    numberOfLines={5}
                    textAlignVertical='top'
                />
            </View>
        )
    }

    function phoneNumberInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding + 10.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 8.0, ...Fonts.blackColor16Medium }}>
                    {tr('phoneTitle')}
                </Text>
                <TextInput
                    value={phone}
                    onChangeText={(value) => updateState({ phone: value })}
                    placeholder={tr('phonePlaceHolder')}
                    style={styles.textFieldStyle}
                    placeholderTextColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                    keyboardType="phone-pad"
                />
            </View>
        )
    }

    function emailInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding + 10.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 8.0, ...Fonts.blackColor16Medium }}>
                    {tr('emailTitle')}
                </Text>
                <TextInput
                    value={email}
                    onChangeText={(value) => updateState({ email: value })}
                    placeholder={tr('emailPlaceHolder')}
                    style={styles.textFieldStyle}
                    placeholderTextColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                    keyboardType="email-address"
                />
            </View>
        )
    }

    function nameInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding + 10.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 8.0, ...Fonts.blackColor16Medium }}>
                    {tr('nameTitle')}
                </Text>
                <TextInput
                    value={name}
                    onChangeText={(value) => updateState({ name: value })}
                    placeholder={tr('namePlaceHolder')}
                    style={styles.textFieldStyle}
                    placeholderTextColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                />
            </View>
        )
    }

    function header() {
        return (
            <Header
                headerText={tr('header')}
                isRtl={isRtl}
                arrowPress={() => navigation.pop()}
            />
        )
    }
}

export default PersonalInformationScreen

const styles = StyleSheet.create({
    textFieldStyle: {
        ...Fonts.blackColor14Regular,
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        paddingTop: Sizes.fixPadding,
        paddingBottom: Sizes.fixPadding - 3.0,
    }
})