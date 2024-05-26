import { SafeAreaView, StatusBar, StyleSheet, ActivityIndicator, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { Header } from '../../components/usableComponent/usableComponent'
import { LanguageContext } from '../../languages'

const LanguagesScreen = ({ navigation }) => {

    const { i18n, language, changeLanguage } = useContext(LanguageContext);

    const isRtl = (language == 'ar');

    function tr(key) {
        return i18n.t(`languagesScreen.${key}`)
    }

    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const [isLoading, setisLoading] = useState(false);
    const [tapLanguage, settapLanguage] = useState(null);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                {languages()}
            </View>
        </SafeAreaView>
    )

    function languages() {
        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: Sizes.fixPadding - 5.0 }}>
                {languageShort({ language: `${tr('english')}`, lang: 'en' })}
               
                {languageShort({ language: `${tr('arabic')}`, lang: 'ar' })}
            </ScrollView>
        )
    }

    async function onChangeLang(lang) {
        try {
            await changeLanguage(lang);
            setSelectedLanguage(lang)
            setisLoading(false)
        } catch (error) {
            alert('something goes wrong')
        }
    }

    function languageShort({ language, lang }) {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    if (selectedLanguage !== lang) {
                        settapLanguage(lang)
                        setisLoading(true)
                        onChangeLang(lang)
                    }
                }}
                style={{ ...styles.languageWrapStyle, flexDirection: isRtl ? 'row-reverse' : 'row', }}
            >
                <View style={{
                    ...styles.radioButtonStyle,
                    borderColor: selectedLanguage == lang ? Colors.primaryColor : Colors.lightGrayColor,
                    backgroundColor: selectedLanguage == lang ? Colors.primaryColor : Colors.whiteColor,
                }}>
                    <View style={{ backgroundColor: Colors.whiteColor, width: 8.0, height: 8.0, borderRadius: 4.0 }} />
                </View>
                <Text style={{ marginLeft: isRtl ? 0.0 : Sizes.fixPadding, marginRight: isRtl ? Sizes.fixPadding : 0.0, paddingTop: Sizes.fixPadding - 8.0, lineHeight: 20.0, ...Fonts.blackColor16Regular }}>
                    {language}
                </Text>
                {
                    isLoading && (tapLanguage == lang)
                        ?
                        <ActivityIndicator
                            color={Colors.primaryColor}
                            size={20}
                            style={{ position: 'absolute', right: 10.0, }}
                        />
                        :
                        null
                }
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

export default LanguagesScreen

const styles = StyleSheet.create({
    languageWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        borderRadius: Sizes.fixPadding,
        alignItems: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding + 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        borderColor: Colors.shadowColor,
        borderWidth: 1.0,
        borderBottomWidth: 0.0,
    },
    radioButtonStyle: {
        width: 18.0,
        height: 18.0,
        borderRadius: 9.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.0,
    }
})