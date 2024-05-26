import { StyleSheet, Text, View, SafeAreaView, StatusBar, Dimensions, FlatList, Image, BackHandler } from 'react-native'
import React, { useState, useCallback, createRef, useContext } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { useFocusEffect } from '@react-navigation/native';
import { LanguageContext } from '../../languages';
import { Button } from '../../components/usableComponent/usableComponent';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {

    const { i18n, language } = useContext(LanguageContext);

    const isRtl = (language == 'ar');

    function tr(key) {
        return i18n.t(`onboardingScreen.${key}`)
    }

    const onboardingScreenList = [
        {
            id: '1',
            onboardingImage: require('../../assets/images/onboarding/onboarding1.png'),
            onboardingTitle: tr('screen1Title'),
            onboardingDescription: 'Welcome to our car rental app in Palestine, offering a wide range of cars for daily use or special occasions.'

        },
        {
            id: '2',
            onboardingImage: require('../../assets/images/onboarding/onboarding2.png'),
            onboardingTitle: tr('screen2Title'),
            onboardingDescription: 'Book your perfect car anytime, anywhere in Palestine with ease and enjoy 24/7 customer support. '
        },
        {
            id: '3',
            onboardingImage: require('../../assets/images/onboarding/onboarding3.png'),
            onboardingTitle: tr('screen3Title'),
            onboardingDescription: 'Thank you for choosing us; experience a world of comfort and safety with our car rental app!'
        },
    ];
    const backAction = () => {
        backClickCount == 1 ? BackHandler.exitApp() : _spring();
        return true;
    }

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
        }, [backAction])
    );

    function _spring() {
        setBackClickCount(1);
        setTimeout(() => {
            setBackClickCount(0)
        }, 1000)
    }

    const listRef = createRef();
    const [backClickCount, setBackClickCount] = useState(0);
    const [currentScreen, setCurrentScreen] = useState(0);

    const scrollToIndex = ({ index }) => {
        listRef.current.scrollToIndex({ animated: true, index: index });
        setCurrentScreen(index);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {onboardingScreenContent()}
                <View style={{ flex: 0.3, }}>
                    {indicators()}
                    {nextAndGetStartedButton()}
                    {skipText()}
                </View>
            </View>
            {exitInfo()}
        </SafeAreaView>
    )

    function skipText() {
        return (
            currentScreen == 2
                ?
                null
                :
                <Text
                    onPress={() => navigation.push('BottomTabBar')}
                    style={{ textAlign: 'center', ...Fonts.grayColor16Medium }}
                >
                    {tr('skip')}
                </Text>
        )
    }

    function nextAndGetStartedButton() {
        return (
            <Button
                btnText={currentScreen == 2 ? tr('getStarted') : tr('next')}
                btnStyle={styles.nextAndGetStartedButtonStyle}
                onPress={() => { currentScreen == 2 ? navigation.push('BottomTabBar') : scrollToIndex({ index: currentScreen + 1 }) }}
            />
        )
    }

    function indicators() {
        return (
            <View style={{ ...styles.indicatorWrapStyle, }}>
                {
                    onboardingScreenList.map((item, index) => {
                        return (
                            <View
                                key={`${item.id}`}
                                style={{
                                    ...currentScreen == index ? styles.selectedIndicatorStyle : styles.indicatorStyle,
                                }}
                            />
                        )
                    })
                }
            </View>
        )
    }

    function onboardingScreenContent() {
        const renderItem = ({ item }) => {
            return (
                <View style={{ flex: 1, width: width, height: '100%', overflow: 'hidden', }}>
                    <View style={{ flex: 1, justifyContent: 'space-between', marginTop: Sizes.fixPadding * 5.0, alignItems: 'center' }}>
                        <Image
                            source={item.onboardingImage}
                            style={{ width: width - 40.0, height: height / 3.0, resizeMode: 'contain' }}
                        />
                        <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                            <Text style={{ textAlign: 'center', ...Fonts.blackColor20SemiBold }}>
                                {item.onboardingTitle}
                            </Text>
                            <Text style={{ textAlign: 'center', ...Fonts.grayColor14Medium }}>
                                {item.onboardingDescription}
                            </Text>
                        </View>
                    </View>
                </View>
            )
        }
        return (
            <View style={{ flex: 0.7 }}>
                <FlatList
                    ref={listRef}
                    data={onboardingScreenList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    horizontal
                    scrollEventThrottle={32}
                    pagingEnabled
                    onMomentumScrollEnd={onScrollEnd}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    function onScrollEnd(e) {
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;
        let pageNum = Math.floor(contentOffset.x / viewSize.width);
        setCurrentScreen(pageNum);
    }

    function exitInfo() {
        return (
            backClickCount == 1
                ?
                <View style={[styles.animatedView]}>
                    <Text style={{ paddingTop: Sizes.fixPadding - 8.0, lineHeight: 15.0, ...Fonts.whiteColor12Medium }}>
                        {tr('exit')}
                    </Text>
                </View>
                :
                null
        )
    }

}

export default OnboardingScreen;

const styles = StyleSheet.create({
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
    selectedIndicatorStyle: {
        marginHorizontal: Sizes.fixPadding - 7.0,
        width: 12.0,
        height: 12.0,
        borderRadius: 6.0,
        backgroundColor: Colors.primaryColor
    },
    indicatorStyle: {
        marginHorizontal: Sizes.fixPadding - 7.0,
        width: 6.0,
        height: 6.0,
        borderRadius: 3.0,
        backgroundColor: Colors.grayColor
    },
    indicatorWrapStyle: {
        marginTop: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    nextAndGetStartedButtonStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding,
        marginTop: Sizes.fixPadding * 6.0,
        marginBottom: Sizes.fixPadding + 3.0,
    }
})