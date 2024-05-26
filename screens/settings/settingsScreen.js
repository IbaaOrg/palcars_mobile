import { SafeAreaView, StatusBar, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { Header } from '../../components/usableComponent/usableComponent'
import { LanguageContext } from '../../languages'
import { MaterialIcons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {

    const { i18n, language } = useContext(LanguageContext);

    const isRtl = (language == 'ar');

    function tr(key) {
        return i18n.t(`settingsScreen.${key}`)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: Sizes.fixPadding - 5.0 }}>
                    {settingOptions()}
                </ScrollView>
            </View>
        </SafeAreaView>
    )

    function settingOptions() {
        return (
            <View>
                {settingOptionSort({ icon: require('../../assets/images/icons/language.png'), option: tr('languages'), navigateTo: 'Languages' })}
                {divider()}
                {settingOptionSort({ icon: require('../../assets/images/icons/notification.png'), option: tr('notification'), navigateTo: 'NotificationSettings' })}
            </View>
        )
    }

    function divider() {
        return (
            <View style={{ backgroundColor: Colors.shadowColor, height: 2.0, margin: Sizes.fixPadding * 2.0, }} />
        )
    }

    function settingOptionSort({ icon, option, navigateTo }) {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.push(navigateTo)}
                style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.optionWrapStyle }}
            >
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', flex: 1, }}>
                    <Image
                        source={icon}
                        style={styles.optionIconStyle}
                    />
                    <Text style={styles.optionTextStyle}>
                        {option}
                    </Text>
                </View>
                <MaterialIcons name={isRtl ? "arrow-back-ios" : 'arrow-forward-ios'} size={20} color={Colors.blackColor} />
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

export default SettingsScreen

const styles = StyleSheet.create({
    optionTextStyle: {
        flex: 1,
        paddingTop: Sizes.fixPadding - 7.0,
        lineHeight: 19.0,
        ...Fonts.blackColor16Regular,
        marginHorizontal: Sizes.fixPadding
    },
    optionWrapStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    optionIconStyle: {
        width: 20.0,
        height: 20.0,
        resizeMode: 'contain',
        tintColor: Colors.blackColor
    }
})