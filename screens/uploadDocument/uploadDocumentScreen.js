import { SafeAreaView, StatusBar, StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { Button } from '../../components/usableComponent/usableComponent'
import { LanguageContext } from '../../languages'
import { MaterialIcons } from '@expo/vector-icons';
import { BottomSheet } from '@rneui/themed';

const UploadDocumentScreen = ({ navigation }) => {

    const { i18n, language } = useContext(LanguageContext);

    const isRtl = (language == 'ar');

    function tr(key) {
        return i18n.t(`uploadDocumentScreen.${key}`)
    }

    const [showUploadOptionsSheet, setShowUploadOptionsSheet] = useState(false);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {backArrow()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {uploadDetail()}
                    {uploadIdCardInfo()}
                    {uploadLicenseInfo()}
                </ScrollView>
            </View>
            {continueButton()}
            {uploadOptionsSheet()}
        </SafeAreaView>
    )

    function uploadOptionsSheet() {
        return (
            <BottomSheet
                isVisible={showUploadOptionsSheet}
                onBackdropPress={() => setShowUploadOptionsSheet(false)}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.50, 0, 0.50)' }}
            >
                <View style={styles.sheetWrapStyle}>
                    <Text style={{ textAlign: 'center', ...Fonts.blackColor18SemiBold }}>
                        {tr('sheetTitle')}
                    </Text>
                    <View style={{ marginTop: Sizes.fixPadding, }}>
                        {sheetOptionSort({ icon: require('../../assets/images/icons/camera.png'), option: tr('camera') })}
                        {sheetOptionSort({ icon: require('../../assets/images/icons/gallery.png'), option: tr('gallery') })}
                    </View>
                </View>
            </BottomSheet>
        )
    }

    function sheetOptionSort({ icon, option }) {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => { setShowUploadOptionsSheet(false) }}
                style={{ marginVertical: Sizes.fixPadding, }}
            >
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center' }}>
                    <View style={styles.sheetOptionWrapStyle}>
                        <Image
                            source={icon}
                            style={{ width: 18.0, height: 18.0, resizeMode: 'contain' }}
                        />
                    </View>
                    <Text style={{ marginHorizontal: Sizes.fixPadding + 5.0, ...Fonts.blackColor16Medium }}>
                        {option}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }

    function continueButton() {
        return (
            <Button
                btnText={tr('btnText')}
                btnStyle={{ borderRadius: 0.5, }}
                onPress={() => { navigation.push('Summary') }}
            />
        )
    }

    function uploadLicenseInfo() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowUploadOptionsSheet(true)}
                style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.infoWrapStyle, }}
            >
                <Text style={{ flex: 1, ...Fonts.grayColor14Regular }}>
                    {tr('licensePlaceHolder')}
                </Text>
                <Text style={{ ...Fonts.primaryColor14Medium }}>
                    {tr('upload')}
                </Text>
            </TouchableOpacity>
        )
    }

    function uploadIdCardInfo() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowUploadOptionsSheet(true)}
                style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.infoWrapStyle, }}
            >
                <Text style={{ flex: 1, ...Fonts.grayColor14Regular }}>
                    {tr('idCardPlaceHolder')}
                </Text>
                <Text style={{ ...Fonts.primaryColor14Medium }}>
                    {tr('upload')}
                </Text>
            </TouchableOpacity>
        )
    }

    function uploadDetail() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, textAlign: 'center', ...Fonts.blackColor18SemiBold }}>
                    {tr('title')}
                </Text>
                <Text style={{ ...Fonts.grayColor12Medium }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pretium lobortis dictum turpis aliquam sodales phasellus. Lacus vitae ultrices tincidunt amet. Tellus consectetur in vivamus magna a, nunc tellus, massa. Proin accumsan nunc morbi sed nisl, egestas tincidunt facilisis. Ultricies et at sem porttitor vitae libero.
                </Text>
            </View>
        )
    }

    function backArrow() {
        return (
            <MaterialIcons
                name={isRtl ? "arrow-forward" : "arrow-back"}
                size={24}
                color={Colors.blackColor}
                onPress={() => navigation.pop()}
                style={{ margin: Sizes.fixPadding * 2.0, alignSelf: isRtl ? 'flex-end' : 'flex-start' }}
            />
        )
    }
}

export default UploadDocumentScreen

const styles = StyleSheet.create({
    infoWrapStyle: {
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.whiteColor,
        elevation: 1.0,
        borderRadius: Sizes.fixPadding,
        padding: Sizes.fixPadding,
        borderColor: Colors.shadowColor,
        borderWidth: 1.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
    },
    sheetWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderTopLeftRadius: Sizes.fixPadding,
        borderTopRightRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingTop: Sizes.fixPadding + 5.0,
        paddingBottom: Sizes.fixPadding,
    },
    sheetOptionWrapStyle: {
        width: 40.0,
        height: 40.0,
        borderRadius: 20.0,
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        borderColor: Colors.shadowColor,
        borderWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
})