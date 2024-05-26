import { SafeAreaView, StatusBar, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { Header, Button } from '../../components/usableComponent/usableComponent'
import { LanguageContext } from '../../languages'

const SelectPaymentMethodScreen = ({ navigation }) => {

    const { i18n, language } = useContext(LanguageContext);

    const isRtl = (language == 'ar');

    function tr(key) {
        return i18n.t(`selectPaymentMethodScreen.${key}`)
    }

    const [state, setState] = useState({
        selectedPaymentIndex: 1,
        cardNumber: "",
        valid: '',
        cvv: '',
        cardholder: '',
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        selectedPaymentIndex,
        cardNumber,
        valid,
        cvv,
        cardholder,
    } = state;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}>
                    {paymentMethods()}
                    {divider()}
                    {creditCardInfo()}
                </ScrollView>
            </View>
            {paymentButton()}
        </SafeAreaView>
    )

    function paymentButton() {
        return (
            <Button
                btnText={tr('btnText')}
                btnStyle={{ borderRadius: 0.5, }}
                onPress={() => { navigation.push('PaymentSuccess') }}
            />
        )
    }

    function creditCardInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding + 5.0, }}>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding, ...Fonts.blackColor16SemiBold }}>
                    {tr('creditCardTitle')}
                </Text>
                {cardNumberInfo()}
                {validThruAndCvvInfo()}
                {cardHolderInfo()}
            </View>
        )
    }

    function cardHolderInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding, }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 8.0, ...Fonts.blackColor16Medium }}>
                    {tr('carHolderNameTitle')}
                </Text>
                <TextInput
                    value={cardholder}
                    onChangeText={(value) => updateState({ cardholder: value })}
                    placeholder={tr('cardHolderNamePlaceHolder')}
                    style={styles.textFieldStyle}
                    placeholderTextColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                />
            </View>
        )
    }

    function validThruAndCvvInfo() {
        return (
            <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.validThruAndCvvInfoWrapStyle, }}>
                <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
                    <Text style={{ marginBottom: Sizes.fixPadding - 8.0, ...Fonts.blackColor16Medium }}>
                        {tr('validThruTitle')}
                    </Text>
                    <TextInput
                        value={valid}
                        onChangeText={(value) => updateState({ valid: value })}
                        placeholder={tr('validThruPlaceHolder')}
                        style={styles.textFieldStyle}
                        placeholderTextColor={Colors.grayColor}
                        selectionColor={Colors.primaryColor}
                        keyboardType="numeric"
                    />
                </View>
                <View style={{ flex: 1, marginHorizontal: Sizes.fixPadding }}>
                    <Text style={{ marginBottom: Sizes.fixPadding - 8.0, ...Fonts.blackColor16Medium }}>
                        {tr('cvvTitle')}
                    </Text>
                    <TextInput
                        value={cvv}
                        onChangeText={(value) => updateState({ cvv: value })}
                        placeholder={tr('cvvPlaceHolder')}
                        style={styles.textFieldStyle}
                        placeholderTextColor={Colors.grayColor}
                        selectionColor={Colors.primaryColor}
                        keyboardType="numeric"
                    />
                </View>
            </View>
        )
    }

    function cardNumberInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding, }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 8.0, ...Fonts.blackColor16Medium }}>
                    {tr('cardNumberTitle')}
                </Text>
                <TextInput
                    value={cardNumber}
                    onChangeText={(value) => updateState({ cardNumber: value })}
                    placeholder={tr('cardNumberPlaceHolder')}
                    style={styles.textFieldStyle}
                    placeholderTextColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                    keyboardType="numeric"
                />
            </View>
        )
    }

    function divider() {
        return (
            <View style={{ backgroundColor: '#D9D9D9', height: 1.0, marginVertical: Sizes.fixPadding - 5.0, }} />
        )
    }

    function paymentMethods() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding, ...Fonts.blackColor16SemiBold }}>
                    {tr('paymentMethodTitle')}
                </Text>
                {paymentMethodSort({ icon: require('../../assets/images/icons/creditCard.png'), type: tr('card'), index: 1, })}
                {paymentMethodSort({ icon: require('../../assets/images/icons/paypal.png'), type: tr('paypal'), index: 2, })}
                {paymentMethodSort({ icon: require('../../assets/images/icons/googlePay.png'), type: tr('googlePay'), index: 3, })}
                {paymentMethodSort({ icon: require('../../assets/images/icons/cash.png'), type: tr('cash'), index: 4, })}
            </View>
        )
    }

    function paymentMethodSort({ icon, type, index }) {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => updateState({ selectedPaymentIndex: index })}
                style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.paymentMethodWrapStyle, }}
            >
                <View style={{ flex: 1, flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center' }}>
                    <Image
                        source={icon}
                        style={{ width: 22.0, height: 22.0, resizeMode: 'contain' }}
                    />
                    <Text style={{ flex: 1, marginHorizontal: Sizes.fixPadding + 2.0, ...Fonts.blackColor14Medium }}>
                        {type}
                    </Text>
                </View>
                <View
                    style={{
                        backgroundColor: selectedPaymentIndex == index ? Colors.primaryColor : Colors.whiteColor,
                        borderColor: selectedPaymentIndex == index ? Colors.primaryColor : Colors.shadowColor,
                        ...styles.radioButtonStyle,
                    }}
                >
                    {
                        selectedPaymentIndex == index
                            ?
                            <View style={{ width: 8.0, height: 8.0, borderRadius: 4.0, backgroundColor: Colors.whiteColor }} />
                            :
                            null
                    }
                </View>
            </TouchableOpacity>
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

export default SelectPaymentMethodScreen

const styles = StyleSheet.create({
    paymentMethodWrapStyle: {
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.shadowColor,
        borderWidth: 1.0,
        elevation: 1.50,
        borderRadius: Sizes.fixPadding,
        padding: Sizes.fixPadding + 5.0,
        marginBottom: Sizes.fixPadding + 5.0,
        borderBottomWidth: 0.0,
    },
    radioButtonStyle: {
        width: 20.0,
        height: 20.0,
        borderRadius: 10.0,
        elevation: 2.0,
        borderWidth: 0.50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textFieldStyle: {
        ...Fonts.blackColor14Regular,
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.shadowColor,
        borderWidth: 1.0,
        elevation: 1.50,
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        paddingTop: Sizes.fixPadding,
        paddingBottom: Sizes.fixPadding - 3.0,
        borderBottomWidth: 0.0,
    },
    validThruAndCvvInfoWrapStyle: {
        alignItems: 'center',
        marginBottom: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding
    }
})