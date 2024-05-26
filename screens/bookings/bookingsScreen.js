import { SafeAreaView, StatusBar, StyleSheet, Text, View, FlatList, Image, Dimensions } from 'react-native'
import React, { useContext, useState } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { Header } from '../../components/usableComponent/usableComponent'
import { LanguageContext } from '../../languages'
import { AntDesign, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper'

const { width } = Dimensions.get('window');

const bookingsList = [
    {
        id: '1',
        carImage: require('../../assets/images/cars/car2.png'),
        carName: 'Mercedes-Benz',
        bookingId: 'CZ2215',
        address: '2464 Royal Ln. Mesa, New Jersey 45463',
        startDateAndTime: '7 june 2022 , 5:30pm',
        endDateAndTime: '9 june 2022 , 6:30pm',
        paidAmount: 660,
    },
    {
        id: '2',
        carImage: require('../../assets/images/cars/car4.png'),
        carName: 'Mercedes-Benz',
        bookingId: 'CZ2215',
        address: '2464 Royal Ln. Mesa, New Jersey 45463',
        startDateAndTime: '28 june 2022 , 5:30pm',
        endDateAndTime: '30 june 2022 , 6:30pm',
        paidAmount: 660,
    },
];

const BookingsScreen = ({ navigation }) => {

    const { i18n, language } = useContext(LanguageContext);

    const isRtl = (language == 'ar');

    function tr(key) {
        return i18n.t(`bookingsScreen.${key}`)
    }

    const [bookings, setBookings] = useState(bookingsList);
    const [showSnackBar, setShowSnackBar] = useState(false);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                {
                    bookings.length == 0
                        ?
                        noBookingsInfo()
                        :
                        bookingsInfo()
                }
            </View>
            {snackBar()}
        </SafeAreaView>
    )

    function noBookingsInfo() {
        return (
            <View style={{ ...styles.noBookingPageStyle }}>
                <FontAwesome name="ticket" size={48} color={Colors.grayColor} />
                <Text style={{ marginTop: Sizes.fixPadding, ...Fonts.grayColor16SemiBold }}>
                    {tr('noBooking')}
                </Text>
            </View>
        )
    }

    function snackBar() {
        return (
            <Snackbar
                style={{ backgroundColor: Colors.lightBlackColor, elevation: 0.0, }}
                visible={showSnackBar}
                onDismiss={() => setShowSnackBar(false)}
            >
                <Text style={{ ...Fonts.whiteColor12Regular }}>
                    {tr('remove')}
                </Text>
            </Snackbar>
        )
    }

    function changeBookings({ id }) {
        const copyBookings = bookings;
        const newBookings = copyBookings.filter((item) => item.id != id)
        setBookings(newBookings);
        setShowSnackBar(true);
    }

    function bookingsInfo() {
        const renderItem = ({ item }) => (
            <View style={styles.bookingWrapStyle}>
                <AntDesign
                    name="closecircleo"
                    size={18}
                    color={Colors.grayColor}
                    style={{ position: 'absolute', top: 5.0, left: isRtl ? 5.0 : null, right: isRtl ? null : 5.0, }}
                    onPress={() => changeBookings({ id: item.id })}
                />
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', }}>
                    <Image
                        source={item.carImage}
                        style={{ width: width / 3.0, height: width / 5.5, resizeMode: 'stretch' }}
                    />
                    <View style={{ ...styles.carNameAndBookingIdWrapStyle, alignItems: isRtl ? 'flex-end' : 'flex-start', marginLeft: isRtl ? 0.0 : Sizes.fixPadding + 5.0, marginRight: isRtl ? Sizes.fixPadding + 5.0 : 0.0 }}>
                        <Text numberOfLines={1} style={{ lineHeight: 17.0, paddingTop: Sizes.fixPadding - 8.0, ...Fonts.blackColor14Medium }}>
                            {item.carName}
                        </Text>
                        <Text style={{ ...Fonts.grayColor12Medium }}>
                            {tr('bookingId')} {item.bookingId}
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.bookingLocationInfoWrapStyle }}>
                    <MaterialIcons
                        name='location-pin'
                        color={Colors.primaryColor}
                        size={20}
                    />
                    <Text numberOfLines={1} style={{ ...styles.bookingAddressTextStyle }}>
                        {item.address}
                    </Text>
                </View>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', }}>
                    <View style={{ flex: 0.4, }}>
                        <Text numberOfLines={1} style={{ paddingTop: Sizes.fixPadding - 7.0, lineHeight: 17.0, ...Fonts.grayColor14Medium }}>
                            {tr('start')}
                        </Text>
                        <Text style={{ textAlign: isRtl ? 'right' : 'left', ...Fonts.blackColor12Medium }}>
                            {item.startDateAndTime}
                        </Text>
                    </View>
                    <View style={{ marginHorizontal: Sizes.fixPadding, flex: 0.4, }}>
                        <Text numberOfLines={1} style={{ paddingTop: Sizes.fixPadding - 7.0, lineHeight: 17.0, ...Fonts.grayColor14Medium }}>
                            {tr('end')}
                        </Text>
                        <Text style={{ textAlign: isRtl ? 'right' : 'left', ...Fonts.blackColor12Medium }}>
                            {item.endDateAndTime}
                        </Text>
                    </View>
                    <View style={{ flex: 0.2, }}>
                        <Text numberOfLines={1} style={{ paddingTop: Sizes.fixPadding - 7.0, lineHeight: 17.0, ...Fonts.grayColor14Medium }}>
                            {tr('paid')}
                        </Text>
                        <Text style={{ ...Fonts.blackColor12Medium, alignSelf: isRtl ? 'flex-end' : 'flex-start' }}>
                            ${item.paidAmount}
                        </Text>
                    </View>
                </View>
            </View>
        )
        return (
            <FlatList
                data={bookings}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: Sizes.fixPadding - 5.0, }}
            />
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

export default BookingsScreen

const styles = StyleSheet.create({
    bookingAddressTextStyle: {
        lineHeight: 15.0,
        paddingTop: Sizes.fixPadding - 8.0,
        marginHorizontal: Sizes.fixPadding - 5.0,
        ...Fonts.blackColor12Medium
    },
    bookingWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        borderRadius: Sizes.fixPadding,
        borderColor: Colors.shadowColor,
        borderWidth: 1.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 5.0
    },
    bookingLocationInfoWrapStyle: {
        marginVertical: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center'
    },
    carNameAndBookingIdWrapStyle: {
        flex: 1,
        marginTop: Sizes.fixPadding - 5.0,
    },
    noBookingPageStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
    }
})