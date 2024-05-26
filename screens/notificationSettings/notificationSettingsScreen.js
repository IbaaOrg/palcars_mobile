import { SafeAreaView, StatusBar, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { Header } from '../../components/usableComponent/usableComponent'
import { LanguageContext } from '../../languages'

const NotificationSettingsScreen = ({ navigation }) => {

    const { i18n, language } = useContext(LanguageContext);

    const isRtl = (language == 'ar');

    function tr(key) {
        return i18n.t(`notificationSettingsScreen.${key}`)
    }

    const [state, setState] = useState({
        pushNotification: true,
        applicationUpdates: true,
        darkMode: false,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const { pushNotification, applicationUpdates, darkMode } = state

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                {notificationSettings()}
            </View>
        </SafeAreaView>
    )

    function notificationSettings() {
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                {notificationSettingSort({ setting: tr('pushNotificationTitle'), isOn: pushNotification, onPress: () => updateState({ pushNotification: !pushNotification }) })}
                {divider()}
                {notificationSettingSort({ setting: tr('applicationUpdateTitle'), isOn: applicationUpdates, onPress: () => updateState({ applicationUpdates: !applicationUpdates }) })}
                {divider()}
                {notificationSettingSort({ setting: tr('darkModeTitle'), isOn: darkMode, onPress: () => updateState({ darkMode: !darkMode }) })}
            </ScrollView>
        )
    }

    function divider() {
        return (
            <View style={{ backgroundColor: Colors.shadowColor, height: 2.0, marginVertical: Sizes.fixPadding * 2.0, }} />
        )
    }

    function notificationSettingSort({ setting, isOn, onPress }) {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ flex: 1, ...Fonts.blackColor16Medium }}>
                        {setting}
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={onPress}
                        style={{
                            backgroundColor: isOn ? Colors.primaryColor : Colors.lightGrayColor,
                            alignItems: isOn ? 'flex-end' : 'flex-start',
                            ...styles.switchStyle,
                        }}>
                        <View style={styles.selectedSwitchStyle} />
                    </TouchableOpacity>
                </View>
                <Text style={{ ...Fonts.grayColor14Regular }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing Senectus pellentesque justo, quis varius dictumst
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

export default NotificationSettingsScreen

const styles = StyleSheet.create({
    switchStyle: {
        borderRadius: Sizes.fixPadding * 3.0,
        width: 40.0,
        height: 22.0,
        justifyContent: 'center',
    },
    selectedSwitchStyle: {
        width: 16.0,
        height: 16.0,
        borderRadius: 8.0,
        backgroundColor: Colors.whiteColor,
        marginHorizontal: Sizes.fixPadding - 7.0,
    }
})