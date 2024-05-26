import { SafeAreaView, StatusBar, StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { Header, Button } from '../../components/usableComponent/usableComponent'
import { LanguageContext } from '../../languages'
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SummaryScreen = ({ navigation, route }) => {

    const { i18n, language } = useContext(LanguageContext);

    const isRtl = (language == 'ar');

    function tr(key) {
        return i18n.t(`summaryScreen.${key}`)
    }

    const defaultTime = '11:27AM';

    useEffect(() => {
        if (route.params?.address) {
            if (route.params.addressFor === 'pickup') {
                setPickupLocation(route.params.address)
            }
            else {
                setReturnLocation(route.params.address)
            }
        }

    }, [route.params?.address]);

    useEffect(() => {
        if (route.params?.selectionFor) {
            if (route.params.selectionFor === 'pickup') {
                setPickupDate(route.params.date)
                setPickupTime(route.params.time)
            }
            else {
                setReturnDate(route.params.date)
                setReturnTime(route.params.time)
            }
        }
    }, [route.params?.selectionFor])

    // useEffect(() => {
    //     if (route.params?.address) {
    //         if (route.params.addressFor === 'pickup') {
    //             setPickupLocation(route.params.address)
    //         }
    //         else {
    //             setReturnLocation(route.params.address)
    //         }
    //     }
    //     if (route.params?.dateTime) {
    //         if (route.params.selectionFor === 'pickup') {
    //             setPickupDate(route.params.dateTime.date)
    //             setPickupTime(route.params.dateTime.time)
    //         }
    //         else {
    //             setReturnDate(route.params.dateTime.date)
    //             setReturnTime(route.params.dateTime.time)
    //         }
    //     }
    // }, [route.params?.address || route.params?.dateTime]);

    const [pickupLocation, setPickupLocation] = useState('2464 Royal Ln. Mesa, New Jersey 45463');
    const [returnLocation, setReturnLocation] = useState('2464 Royal Ln. Mesa, New Jersey 45463');
    const [pickupDate, setPickupDate] = useState('7 Des 2021');
    const [pickupTime, setPickupTime] = useState('11:27AM');
    const [returnDate, setReturnDate] = useState('7 Des 2021');
    const [returnTime, setReturnTime] = useState('11:27AM');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {carInfo()}
                    {pickupLocationInfo()}
                    {returnLocationInfo()}
                    {pickupDateAndTimeInfo()}
                    {returnDateAndTimeInfo()}
                    {divider()}
                    {amountInfo()}
                </ScrollView>
            </View>
            {continueButton()}
        </SafeAreaView>
    )

    function amountInfo() {
        const perDayeCarRent = 220;
        const totalDays = 2;
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0, }}>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ flex: 1, ...Fonts.grayColor14Medium }}>
                        {tr('perDayRent')}
                    </Text>
                    <Text style={{ ...Fonts.grayColor14Medium }}>
                        ${perDayeCarRent}
                    </Text>
                </View>
                <View style={{ marginVertical: Sizes.fixPadding - 5.0, flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ flex: 1, ...Fonts.grayColor14Medium }}>
                        {tr('today')} {totalDays} {tr('day')} {tr('rent')}
                    </Text>
                    <Text style={{ ...Fonts.grayColor14Medium }}>
                        ${perDayeCarRent * totalDays}
                    </Text>
                </View>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ flex: 1, ...Fonts.blackColor16SemiBold }}>
                        {tr('totalPayment')}
                    </Text>
                    <Text style={{ ...Fonts.blackColor16SemiBold }}>
                        ${perDayeCarRent * totalDays}
                    </Text>
                </View>
            </View>
        )
    }

    function divider() {
        return (
            <View style={{ backgroundColor: '#D9D9D9', height: 1.0, marginVertical: Sizes.fixPadding * 2.0, }} />
        )
    }

    function continueButton() {
        return (
            <Button
                btnText={tr('btnText')}
                btnStyle={{ borderRadius: 0.5, }}
                onPress={() => { navigation.push('SelectPaymentMethod') }}
            />
        )
    }

    function returnDateAndTimeInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Medium }}>
                    {tr('returnDateTimeTitle')}
                </Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.PickupAndReturnDetailWrapStyle, }}>
                    <Text style={{ ...Fonts.grayColor14Regular, }}>
                        {`${returnDate} , ${returnTime ? returnTime : defaultTime}`}
                    </Text>
                    <MaterialCommunityIcons
                        name="square-edit-outline"
                        size={20}
                        color={Colors.primaryColor}
                        onPress={() =>
                            navigation.push('PickupAndReturnDateAndTime', { selectionFor: 'return', fromScreen: 'edit' })
                            // navigation.push('PickupAndReturnDateAndTime', {
                            //     selectionFor: 'return',
                            //     OnChange: (date, time) => {
                            //         setReturnDate(date)
                            //         setReturnTime(time)
                            //     }
                            // })
                        }
                    />
                </View>
            </View>
        )
    }

    function pickupDateAndTimeInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Medium }}>
                    {tr('picDateTimeTitle')}
                </Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.PickupAndReturnDetailWrapStyle, }}>
                    <Text style={{ ...Fonts.grayColor14Regular }}>
                        {`${pickupDate} , ${pickupTime ? pickupTime : defaultTime}`}
                    </Text>
                    <MaterialCommunityIcons
                        name="square-edit-outline"
                        size={20}
                        color={Colors.primaryColor}
                        onPress={() =>
                            navigation.push('PickupAndReturnDateAndTime', { selectionFor: 'pickup', fromScreen: 'edit' })
                            // navigation.push('PickupAndReturnDateAndTime', {
                            //     selectionFor: 'pickup',
                            //     OnChange: (date, time) => {
                            //         setPickupDate(date)
                            //         setPickupTime(time)
                            //     }
                            // })
                        }
                    />
                </View>
            </View>
        )
    }

    function returnLocationInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Medium }}>
                    {tr('returnLocTitle')}
                </Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.PickupAndReturnDetailWrapStyle, }}>
                    <Text style={{ flex: 1, ...Fonts.grayColor14Regular }}>
                        {returnLocation}
                    </Text>
                    <MaterialCommunityIcons
                        name="square-edit-outline"
                        size={20}
                        color={Colors.primaryColor}
                        onPress={() => {
                            navigation.push('PickupAndReturnLocation', { addressFor: 'return', fromScreen: 'edit' })
                            // navigation.push('PickupAndReturnLocation',
                            //     { OnChange: (loc) => setReturnLocation(loc) })
                        }}
                    />
                </View>
            </View>
        )
    }

    function pickupLocationInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Medium }}>
                    {tr('pickupLocTitle')}
                </Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.PickupAndReturnDetailWrapStyle, }}>
                    <Text style={{ flex: 1, ...Fonts.grayColor14Regular }}>
                        {pickupLocation}
                    </Text>
                    <MaterialCommunityIcons
                        name="square-edit-outline"
                        size={20}
                        color={Colors.primaryColor}
                        onPress={() => {
                            navigation.push('PickupAndReturnLocation', { addressFor: 'pickup', fromScreen: 'edit' })
                            // navigation.push('PickupAndReturnLocation', { OnChange: (loc) => setPickupLocation(loc) })
                        }}
                    />
                </View>
            </View>
        )
    }

    function carInfo() {
        return (
            <View style={styles.carInfoWrapStyle}>
                <Image
                    source={require('../../assets/images/cars/car3.png')}
                    style={styles.carImageStyle}
                />
                <View style={{ marginHorizontal: Sizes.fixPadding, flex: 1, alignItems: 'center' }}>
                    <Text numberOfLines={1} style={{ ...Fonts.blackColor16SemiBold }}>
                        Audi A8 L
                    </Text>
                    <Text>
                        <Text style={{ ...Fonts.primaryColor16SemiBold }}>
                            $220
                        </Text>
                        <Text style={{ ...Fonts.blackColor16SemiBold }}>
                            /day
                        </Text>
                    </Text>
                </View>
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

export default SummaryScreen

const styles = StyleSheet.create({
    carInfoWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding,
        marginTop: Sizes.fixPadding - 5.0,
    },
    carImageStyle: {
        marginLeft: Sizes.fixPadding * 2.0,
        flex: 0.8,
        height: 73,
        resizeMode: 'contain'
    },
    PickupAndReturnDetailWrapStyle: {
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.shadowColor,
        borderWidth: 1.0,
        elevation: 1.5,
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        paddingTop: Sizes.fixPadding + 2.0,
        paddingBottom: Sizes.fixPadding,
    }
})