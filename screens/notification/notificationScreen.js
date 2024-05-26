import React, { useState, useRef, useContext, useEffect } from "react";
import { Dimensions, FlatList, SafeAreaView, Animated, View, StatusBar, StyleSheet, Text, Image } from "react-native";
import { Colors, Fonts, Sizes, } from "../../constants/styles";
import { SwipeListView } from 'react-native-swipe-list-view';
import { Snackbar } from 'react-native-paper';
import { Header } from "../../components/usableComponent/usableComponent";
import { LanguageContext } from "../../languages";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');

/* const todaysNotificatiosList = [
    {
        key: '1',
        title: '40% off today',
        description: 'Hurry Up! Don’t sit at home today.Best car rental deal toady. ',
        time: '3 min ago',
    },
    {
        key: '2',
        title: 'Booking successful',
        description: 'Congratulation.Your audi A8 L booked successfully. ',
        time: '3 min ago',
    },
];

const yesterdaysNotificationsList = [
    {
        key: '1',
        title: '40% off today',
        description: 'Hurry Up! Don’t sit at home today.Best car rental deal toady. ',
        time: '10:45 am',
    },
    {
        key: '2',
        title: 'Booking successful',
        description: 'Congratulation.Your audi A8 L booked successfully. ',
        time: '10:55 am',
    },
    {
        key: '3',
        title: '40% off today',
        description: 'Hurry Up! Don’t sit at home today.Best car rental deal toady. ',
        time: '11:45 am',
    },
    {
        key: '4',
        title: 'Booking successful',
        description: 'Congratulation.Your audi A8 L booked successfully. ',
        time: '10:45 am',
    },
]; */

const rowTranslateAnimatedValues = {};

const NotificationScreen = ({ navigation }) => {

    const { i18n, language } = useContext(LanguageContext);

    const isRtl = (language == 'ar');

    function tr(key) {
        return i18n.t(`notificationScreen.${key}`)
    }

    const [showSnackBar, setShowSnackBar] = useState(false);

    const [snackBarMsg, setSnackBarMsg] = useState('');

    const [listData, setListData] = useState([]);

    const [oldListData, setOldListData] = useState([]);


    const getNotifications = async () => {
        const token = await AsyncStorage.getItem('token');
        const cleanedAuthToken = token.replace(/^"(.*)"$/, '$1');
        
        if (cleanedAuthToken) {
            try {
                const response = await axios.get("https://zzz.center/public/api/notifications", {
                    headers: {
                        Authorization: `Bearer ${cleanedAuthToken}`,
                    },
                });
                const { data } = await response.data; // Assuming response structure is { data: [...] }
                setListData([...data]);
                console.log([...data]);
            } catch (error) { 
                console.error("Error fetching notifications:", error);
            }
        }
    };
    useEffect(() => {
        getNotifications();
}, []);


    Array(listData.length + 1)
        .fill('')
        .forEach((_, i) => {
            rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
        });

    Array(oldListData.length + 1)
        .fill('')
        .forEach((_, i) => {
            rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
        });

    const animationIsRunning = useRef(false);

    const onSwipeValueChange = swipeData => {

        const { key, value } = swipeData;

        if (
            (value > width) || (value < -width) &&
            !animationIsRunning.current
        ) {
            animationIsRunning.current = true;
            Animated.timing(rowTranslateAnimatedValues[key], {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start(() => {

                const newData = [...listData];
                const prevIndex = listData.findIndex(item => item.key === key);
                newData.splice(prevIndex, 1);
                const removedItem = listData.find(item => item.key === key);

                setSnackBarMsg(`${removedItem.title} ${tr('dismiss')}`);

                setListData(newData);

                setShowSnackBar(true);

                animationIsRunning.current = false;
            });
        }
    };

    const renderItem = data => (
        <Animated.View
            style={[
                {
                    height: rowTranslateAnimatedValues[
                        data.item.key
                    ]
                },
            ]}
        >
            <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
                <View style={{ ...styles.notificationWrapStyle, flexDirection: isRtl ? 'row-reverse' : 'row', }}>
                    <View style={{ ...styles.notificationIconWrapStyle, marginRight: isRtl ? null : Sizes.fixPadding + 5.0, marginLeft: isRtl ? Sizes.fixPadding + 5.0 : null }}>
                        <Image
                            source={require('../../assets/images/icons/notification.png')}
                            style={styles.notificationIconStyle}
                        />
                    </View>
                    <View style={{ flex: 1, alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
                        <Text style={{ paddingTop: Sizes.fixPadding - 8.0, lineHeight: 19.0, ...Fonts.blackColor16SemiBold }}>
                            {data.item.data.comment_create}
                        </Text>
                        <Text numberOfLines={2} style={{ ...Fonts.blackColor14Medium }}>
                            {data.item.data.content}
                        </Text>
                        <Text style={{ ...Fonts.grayColor12Medium }}>
                            {data.item.timeago}
                        </Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );

    const renderHiddenItem = () => (
        <View style={styles.rowBack} />
    );

    const oldOnSwipeValueChange = swipeData => {

        const { key, value } = swipeData;

        if (
            (value > width) || (value < -width) &&
            !animationIsRunning.current
        ) {
            animationIsRunning.current = true;
            Animated.timing(rowTranslateAnimatedValues[key], {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start(() => {

                const newData = [...oldListData];
                const prevIndex = oldListData.findIndex(item => item.key === key);
                newData.splice(prevIndex, 1);
                const removedItem = oldListData.find(item => item.key === key);

                setSnackBarMsg(`${removedItem.title} ${tr('dismiss')}`);

                setOldListData(newData);

                setShowSnackBar(true);

                animationIsRunning.current = false;
            });
        }
    };

    const oldRenderItem = data => (
        <Animated.View
            style={[
                {
                    height: rowTranslateAnimatedValues[
                        data.item.key
                    ]
                },
            ]}
        >
            <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
                <View style={{ ...styles.notificationWrapStyle, flexDirection: isRtl ? 'row-reverse' : 'row', }}>
                    <View style={{ ...styles.notificationIconWrapStyle, marginRight: isRtl ? null : Sizes.fixPadding + 5.0, marginLeft: isRtl ? Sizes.fixPadding + 5.0 : null }}>
                        <Image
                            source={require('../../assets/images/icons/notification.png')}
                            style={styles.notificationIconStyle}
                        />
                    </View>
                    <View style={{ flex: 1, alignItems: isRtl ? 'flex-end' : 'flex-start' }}>
                        <Text style={{ paddingTop: Sizes.fixPadding - 8.0, lineHeight: 19.0, ...Fonts.blackColor16SemiBold }}>
                            {data.item.title}
                        </Text>
                        <Text numberOfLines={2} style={{ ...Fonts.blackColor14Medium }}>
                            {data.item.description}
                        </Text>
                        <Text style={{ ...Fonts.grayColor12Medium }}>
                            {data.item.time}
                        </Text>
                    </View>
                </View>
            </View>
        </Animated.View>
    );

    const oldRenderHiddenItem = () => (
        <View style={styles.rowBack} />
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {header()}
                {notifications()}
            </View>
            {snackBar()}
        </SafeAreaView>
    );

    function notifications() {
        return (
            <FlatList
                ListHeaderComponent={
                    <View style={{ flex: 1 }}>
                        {
                            listData.length == 0 && oldListData.length == 0
                                ?
                                noNotoficationInfo()
                                :
                                <>
                                    {todayNotifications()}
                                </>
                        }
                    </View>
                }
                contentContainerStyle={{ paddingBottom: Sizes.fixPadding, }}
                showsVerticalScrollIndicator={false}
            />
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
                    {snackBarMsg}
                </Text>
            </Snackbar>
        )
    }

    function yesterDayNotifications() {
        return (
            oldListData.length == 0
                ?
                null
                :
                <View>
                    <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16SemiBold }}>
                        {tr('yesterday')}
                    </Text>
                    <SwipeListView
                        listKey={`olds`}
                        data={oldListData}
                        renderItem={oldRenderItem}
                        renderHiddenItem={oldRenderHiddenItem}
                        rightOpenValue={-width}
                        leftOpenValue={width}
                        onSwipeValueChange={oldOnSwipeValueChange}
                        useNativeDriver={false}
                        contentContainerStyle={{ paddingVertical: Sizes.fixPadding - 8.0, }}
                        scrollEnabled={false}
                    />
                </View>
        )
    }

    function todayNotifications() {
        return (
            listData.length == 0
                ?
                null
                :
                <View>
                    <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16SemiBold }}>
                       
                    </Text>
                    <SwipeListView
                        listKey={`todays`}
                        data={listData}
                        renderItem={renderItem}
                        renderHiddenItem={renderHiddenItem}
                        rightOpenValue={-width}
                        leftOpenValue={width}
                        onSwipeValueChange={onSwipeValueChange}
                        useNativeDriver={false}
                        contentContainerStyle={{ paddingVertical: Sizes.fixPadding - 8.0, }}
                        scrollEnabled={false}
                    />
                </View>
        )
    }

    function noNotoficationInfo() {
        return (
            <View style={{ height: height - 150, alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    source={require('../../assets/images/icons/noNotification.png')}
                    style={{ width: 50.0, height: 50.0, resizeMode: 'contain' }}
                />
                <Text style={{ ...Fonts.grayColor16Medium, marginTop: Sizes.fixPadding }}>
                    {tr('noNotification')}
                </Text>
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

const styles = StyleSheet.create({
    notificationWrapStyle: {
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        elevation: 1.5,
        borderColor: Colors.shadowColor,
        borderWidth: 1.0,
        borderBottomWidth: 0.0,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding - 2.0,
        paddingHorizontal: Sizes.fixPadding + 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
        flex: 1,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    notificationIconWrapStyle: {
        width: 40.0,
        height: 40.0,
        borderRadius: 20.0,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationIconStyle: {
        width: 20.0,
        height: 20.0,
        resizeMode: 'contain',
        tintColor: Colors.whiteColor
    }
});

export default NotificationScreen;