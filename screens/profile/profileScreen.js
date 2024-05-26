import { StyleSheet, Text, View, SafeAreaView, StatusBar, Image, Dimensions, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Fonts, Colors, Sizes } from '../../constants/styles'
import { FontAwesome, MaterialIcons, Ionicons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { Overlay } from '@rneui/themed';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation, isRtl, i18n }) => {
 const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const removeToken = async () => {
        try {
            await AsyncStorage.removeItem('token');
            console.log('Token removed');
        } catch (error) {
            console.error('Failed to remove token:', error);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const cleanedAuthToken = token.replace(/^"(.*)"$/, '$1');

                const response = await axios.get('https://zzz.center/public/api/user', {
                    headers: {
                        Authorization: `Bearer ${cleanedAuthToken}`,
                    },
                });
                setData(response.data.data);
                console.log(response.data.data);

                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    function tr(key) {
        return i18n.t(`profileScreen.${key}`)
    }

    const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
    const [rate1, setRate1] = useState(true);
    const [rate2, setRate2] = useState(true);
    const [rate3, setRate3] = useState(true);
    const [rate4, setRate4] = useState(true);
    const [rate5, setRate5] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false)

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 3.0, }}>
                    {userInfo()}
                    {profileOptions()}
                    {logoutOption()}
                </ScrollView>
            </View>
            {feedbackDialog()}
            {logoutDialog()}
        </SafeAreaView>
    )

    function logoutDialog() {
        return (
            <Overlay
                isVisible={showLogoutDialog}
                onBackdropPress={() => setShowLogoutDialog(false)}
                overlayStyle={{ width: width - 70.0, borderRadius: Sizes.fixPadding - 2.0, padding: 0.0 }}
            >
                <View style={{ margin: Sizes.fixPadding * 2.0, }}>
                    <Text style={{ textAlign: 'center', ...Fonts.blackColor18Medium }}>
                        {tr('logoutSure')}
                    </Text>
                    <View style={{ ...styles.cancelAndLogoutButtonWrapStyle, flexDirection: isRtl ? 'row-reverse' : 'row', }}>
                        <TouchableOpacity
                            activeOpacity={0.99}
                            onPress={() => setShowLogoutDialog(false)}
                            style={{ ...styles.cancelButtonStyle, ...styles.cancelAndLogoutButtonStyle, }}
                        >
                            <Text numberOfLines={1} style={{ ...styles.cancelAndLogoutTextStyle, ...Fonts.grayColor18SemiBold }}>
                                {tr('cancel')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.99}
                            onPress={() => {
                                setShowLogoutDialog(false)
                                navigation.push('Signin')
                            }}
                            style={{ ...styles.logoutButtonStyle, ...styles.cancelAndLogoutButtonStyle, }}
                        >
                            <Text numberOfLines={1} style={{ ...styles.cancelAndLogoutTextStyle, ...Fonts.whiteColor18SemiBold }}>
                                {tr('logout')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
        )
    }

    function feedbackDialog() {
        return (
            <Overlay
                isVisible={showFeedbackDialog}
                overlayStyle={{ width: width - 40.0, borderRadius: Sizes.fixPadding - 2.0, padding: 0.0 }}
                onBackdropPress={() => setShowFeedbackDialog(false)}
            >
                <View style={{ marginVertical: Sizes.fixPadding + 5.0, marginHorizontal: Sizes.fixPadding * 2.0, alignItems: 'center' }}>
                    <Text style={{ ...styles.ratingTitleStyle }}>
                        {tr('rating')}
                    </Text>
                    {rating()}
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => setShowFeedbackDialog(false)}
                        style={styles.sumbitButtonStyle}
                    >
                        <Text style={{ paddingTop: Sizes.fixPadding - 8.0, lineHeight: 21.0, ...Fonts.whiteColor18SemiBold }}>
                            {tr('submit')}
                        </Text>
                    </TouchableOpacity>
                    <Text onPress={() => setShowFeedbackDialog(false)} style={{ marginTop: Sizes.fixPadding, ...Fonts.grayColor14Medium }}>
                        {tr('skip')}
                    </Text>
                </View>
            </Overlay>
        )
    }

    function rating() {
        return (
            <View style={{ ...styles.ratingWrapStyle, flexDirection: isRtl ? 'row-reverse' : 'row', }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        if (rate1) {
                            setRate2(false)
                            setRate3(false)
                            setRate4(false)
                            setRate5(false)
                        }
                        else {
                            setRate1(true)
                        }
                    }}
                >
                    <MaterialIcons
                        name="star"
                        size={width / 8.0}
                        color={rate1 ? Colors.yellowColor : Colors.lightGrayColor}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        if (rate2) {
                            setRate1(true)
                            setRate3(false)
                            setRate4(false)
                            setRate5(false)
                        }
                        else {
                            setRate2(true)
                            setRate1(true)
                        }
                    }}
                >
                    <MaterialIcons
                        name="star"
                        size={width / 8.0}
                        color={rate2 ? Colors.yellowColor : Colors.lightGrayColor}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        if (rate3) {
                            setRate4(false)
                            setRate5(false)
                            setRate2(true)
                        }
                        else {
                            setRate3(true)
                            setRate2(true)
                            setRate1(true)
                        }
                    }}
                >
                    <MaterialIcons
                        name="star"
                        size={width / 8.0}
                        color={rate3 ? Colors.yellowColor : Colors.lightGrayColor}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        if (rate4) {
                            setRate5(false)
                            setRate3(true)
                        }
                        else {
                            setRate4(true)
                            setRate3(true)
                            setRate2(true)
                            setRate1(true)
                        }
                    }}
                >
                    <MaterialIcons
                        name="star"
                        size={width / 8.0}
                        color={rate4 ? Colors.yellowColor : Colors.lightGrayColor}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        if (rate5) {
                            setRate4(true)
                        }
                        else {
                            setRate5(true)
                            setRate4(true)
                            setRate3(true)
                            setRate2(true)
                            setRate1(true)
                        }
                    }}
                >
                    <MaterialIcons
                        name="star"
                        size={width / 8.0}
                        color={rate5 ? Colors.yellowColor : Colors.lightGrayColor}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    function logoutOption() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { setShowLogoutDialog(true) }}
                style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', marginHorizontal: Sizes.fixPadding * 2.0, }}
            >
                <View style={{ width: 20.0, }}>
                    <AntDesign name="logout" size={18} color={Colors.redColor} />
                </View>
                <Text style={{ ...styles.optionTextStyle, ...Fonts.redColor16Regular }}>
                    {tr('logoutOption')}
                </Text>
            </TouchableOpacity>
        )
    }

    function profileOptions() {
        return (
            <View style={{ marginTop: Sizes.fixPadding * 3.0, }}>
                {profileOptionSort({
                    icon: <FontAwesome name="user-o" size={18} color={Colors.blackColor} />,
                    option: tr('editProfileOption'),
                    onPress: () => { navigation.push('EditProfile') }
                })}
                {profileOptionSort({
                    icon: <MaterialCommunityIcons name="ticket-outline" size={19} color={Colors.blackColor} style={{ transform: [{ rotate: '50deg' }] }} />,
                    option: tr('bookingOption'),
                    onPress: () => { navigation.push('Bookings') }
                })}
                {profileOptionSort({
                    icon: <FontAwesome name="bell-o" size={18} color={Colors.blackColor} />,
                    option: tr('notificationOption'),
                    onPress: () => { navigation.push('Notification') }
                })}
                {profileOptionSort({
                    icon: <Ionicons name="settings-outline" size={20} color={Colors.blackColor} />,
                    option: tr('settingOption'),
                    onPress: () => { navigation.push('Settings') }
                })}
                {profileOptionSort({
                    icon: <MaterialIcons name="error-outline" size={20} color={Colors.blackColor} />,
                    option: tr('termsAndConditionOption'),
                    onPress: () => { navigation.push('TermsAndConditions') }
                })}
                {profileOptionSort({
                    icon: <FontAwesome name="question-circle-o" size={20} color={Colors.blackColor} />,
                    option: tr('customerSupportOption'),
                    onPress: () => { navigation.push('Support') }
                })}
                {profileOptionSort({
                    icon: <FontAwesome name="star-o" size={20} color={Colors.blackColor} />,
                    option: tr('rateUsOption'),
                    onPress: () => { setShowFeedbackDialog(true) }
                })}
            </View>
        )
    }

    function profileOptionSort({ icon, option, onPress }) {
        return (
            <>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={onPress}
                    style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.optionWrapStyle }}
                >
                    <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', flex: 1, }}>
                        <View style={{ width: 20.0, }}>
                            {icon}
                        </View>
                        <Text style={styles.optionTextStyle}>
                            {option}
                        </Text>
                    </View>
                    <MaterialIcons
                        name={isRtl ? 'arrow-back-ios' : 'arrow-forward-ios'}
                        color={Colors.blackColor}
                        size={18}
                    />
                </TouchableOpacity>
                <View style={{ backgroundColor: Colors.shadowColor, height: 2.0, margin: Sizes.fixPadding * 2.0 }} />
            </>
        )
    }

    function userInfo() {
        return (
            <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', marginHorizontal: Sizes.fixPadding * 2.0, alignItems: 'center', }}>
                <Image
                    source={{ uri: data.photo_user }}
                    style={{ width: width / 5.0, height: width / 5.0, borderRadius: (width / 5.0) / 2.0 }}
                />
                <View style={{ alignItems: isRtl ? 'flex-end' : 'flex-start', flex: 1, marginHorizontal: Sizes.fixPadding, }}>
                    <Text style={{ ...Fonts.blackColor16Medium }}>
                        {data.name}
                    </Text>
                    <Text style={{ ...Fonts.blackColor14Medium }}>
                        {data.phone}
                    </Text>
                </View>
            </View>
        )
    }

    function header() {
        return (
            <Text style={{ margin: Sizes.fixPadding * 2.0, ...Fonts.blackColor18SemiBold }}>
                {tr('header')}
            </Text>
        )
    }
}

export default ProfileScreen

const styles = StyleSheet.create({
    ratingWrapStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding + 5.0,
    },
    sumbitButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding * 3.5,
        paddingVertical: Sizes.fixPadding + 5.0,
    },
    cancelAndLogoutButtonStyle: {
        elevation: 2.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding - 2.0,
        paddingVertical: Sizes.fixPadding + 2.0,
        flex: 1,
        borderWidth: 1.0,
        borderBottomWidth: 0.0,
        marginHorizontal: Sizes.fixPadding,
    },
    cancelButtonStyle: {
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.shadowColor,
    },
    logoutButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderColor: Colors.primaryColor,
    },
    cancelAndLogoutButtonWrapStyle: {
        marginHorizontal: Sizes.fixPadding,
        marginTop: Sizes.fixPadding * 2.0,
        alignItems: 'center'
    },
    cancelAndLogoutTextStyle: {
        paddingTop: Sizes.fixPadding - 7.0,
        lineHeight: 21.0,
        marginHorizontal: Sizes.fixPadding - 5.0,
    },
    ratingTitleStyle: {
        paddingTop: Sizes.fixPadding - 5.0,
        lineHeight: 21.0,
        ...Fonts.blackColor18Medium
    },
    ratingDescriptionStyle: {
        paddingTop: Sizes.fixPadding - 7.0,
        lineHeight: 17.0,
        textAlign: 'center',
        ...Fonts.grayColor14Medium
    },
    optionWrapStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    optionTextStyle: {
        lineHeight: 19.0,
        paddingTop: Sizes.fixPadding - 7.0,
        ...Fonts.blackColor16Regular,
        marginHorizontal: Sizes.fixPadding,
    }
})