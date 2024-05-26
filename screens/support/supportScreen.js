import { SafeAreaView, StatusBar, StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useContext } from 'react'
import { Colors, Fonts, Sizes, } from '../../constants/styles'
import { Header } from '../../components/usableComponent/usableComponent'
import { LanguageContext } from '../../languages'
import { MaterialIcons, Feather } from '@expo/vector-icons';

const SupportScreen = ({ navigation }) => {

    const { i18n, language } = useContext(LanguageContext);

    const isRtl = (language == 'ar');

    function tr(key) {
        return i18n.t(`supportScreen.${key}`)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {helpInfo()}
                    {supportInfoSort({ icon: "phone", title: tr('phoneNumberTitle'), value: '+972 56809-6370' })}
                    {supportInfoSort({ icon: "mail", title: tr('emailIdTitle'), value: 'palcars@support.com' })}
                </ScrollView>
            </View>
        </SafeAreaView>
    )

    function supportInfoSort({ icon, title, value }) {
        return (
            <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.supportInfoWrapStyle, }}>
                <View style={styles.supportInfoIconWrapStyle}>
                    <Feather name={icon} size={20} color={Colors.primaryColor} />
                </View>
                <View style={{ alignItems: isRtl ? 'flex-end' : 'flex-start', flex: 1, marginHorizontal: Sizes.fixPadding + 3.0 }}>
                    <Text style={{ ...Fonts.blackColor16Medium }}>
                        {title}
                    </Text>
                    <Text style={{ ...Fonts.blackColor14Regular }}>
                        {value}
                    </Text>
                </View>
            </View>
        )
    }

    function helpInfo() {
        return (
            <View style={styles.helpIconWithTitleWrapStyle}>
                <MaterialIcons name="headset-mic" size={64} color={Colors.primaryColor} style={{ marginBottom: Sizes.fixPadding + 3.0 }} />
                <Text style={{ textAlign: 'center', ...Fonts.blackColor20SemiBold }}>
                    {tr('helpTitle')}
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

export default SupportScreen;

const styles = StyleSheet.create({
    helpIconWithTitleWrapStyle: {
        marginTop: Sizes.fixPadding * 3.0,
        marginBottom: Sizes.fixPadding * 5.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    supportInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        elevation: 2.0,
        borderColor: Colors.shadowColor,
        borderWidth: 1.0,
        borderBottomWidth: 0.0,
        alignItems: 'center',
        paddingHorizontal: Sizes.fixPadding + 10.0,
        paddingVertical: Sizes.fixPadding + 5.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    supportInfoIconWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        width: 48.0,
        height: 48.0,
        borderRadius: 24.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.shadowColor,
        borderWidth: 1.0,
    }
})