import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState, useContext } from 'react';
import { BackHandler, StyleSheet, Text, View, Dimensions, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { Colors, Fonts, Sizes, FontStyles } from '../../constants/styles';
import { LanguageContext } from '../../languages';
import FavoritesScreen from '../../screens/favorites/favoritesScreen';
import HomeScreen from '../../screens/home/homeScreen';
import ProfileScreen from '../../screens/profile/profileScreen';
import SearchScreen from '../../screens/search/searchScreen';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const BottomTabBar = ({ navigation }) => {
    const { i18n, language } = useContext(LanguageContext);
    const isRtl = (language == 'ar');

    const [backClickCount, setBackClickCount] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(1);

    function tr(key) {
        return i18n.t(`bottomTabBarScreen.${key}`)
    }

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

    const checkTokenAndNavigate = async (index) => {
        if (index === 3 || index === 4) {
            try {
                const token = await AsyncStorage.getItem('token');
                if (!token) {
                    navigation.navigate('Signin');
                    return;
                }else{
                    setCurrentIndex(index);
                }
            } catch (error) {
                console.error(error);
                return;
            }
        }
        setCurrentIndex(index);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
                {currentIndex == 1 ?
                    <HomeScreen navigation={navigation} i18n={i18n} isRtl={isRtl} />
                    :
                    currentIndex == 2 ?
                        <SearchScreen navigation={navigation} i18n={i18n} isRtl={isRtl} />
                        :
                        currentIndex == 3 ?
                            <FavoritesScreen navigation={navigation} i18n={i18n} isRtl={isRtl} />
                            :
                            <ProfileScreen navigation={navigation} i18n={i18n} isRtl={isRtl} />
                }
                <View style={{ ...styles.bottomTabStyle, flexDirection: isRtl ? 'row-reverse' : 'row', }}>
                    {bottomTabBarItem({
                        index: 1,
                        icon: 'home',
                        tabName: tr('home'),
                    })}
                    {bottomTabBarItem({
                        index: 2,
                        icon: 'search',
                        tabName: tr('search'),
                    })}
                    {bottomTabBarItem({
                        index: 3,
                        icon: 'favorite',
                        tabName: tr('favorites'),
                    })}
                    {bottomTabBarItem({
                        index: 4,
                        icon: 'person',
                        tabName: tr('profile'),
                    })}
                </View>
            </View>
            {exitInfo()}
        </SafeAreaView>
    )

    function bottomTabBarItem({ index, icon, tabName }) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => checkTokenAndNavigate(index)}
                style={{ alignItems: 'center', maxWidth: width / 4.0, }}
            >
                <MaterialIcons name={icon} size={25} color={currentIndex == index ? Colors.primaryColor : Colors.lightGrayColor} />
                <Text
                    numberOfLines={1}
                    style={{
                        lineHeight: 17.0,
                        paddingTop: Sizes.fixPadding - 5.0,
                        ...currentIndex == index ? { ...Fonts.primaryColor14Medium } : { ...Fonts.lightGrayColor14Medium },
                    }}
                >
                    {tabName}
                </Text>
            </TouchableOpacity>
        )
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
    bottomTabStyle: {
        backgroundColor: Colors.whiteColor,
        height: 65.0,
        elevation: 20.0,
        borderTopWidth: 0.20,
        borderTopColor: Colors.grayColor,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding - 5.0,
    },
    bottomTabLabelStyle: {
        fontSize: 14.0,
        fontFamily: FontStyles.semiBold,
        alignSelf: 'center',
    }
})

export default BottomTabBar;
