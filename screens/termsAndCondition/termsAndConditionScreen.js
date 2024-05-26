import { SafeAreaView, StatusBar, Text, View, ScrollView } from 'react-native'
import React, { useContext } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { Header } from '../../components/usableComponent/usableComponent'
import { LanguageContext } from '../../languages'

const termsAndConditionList = [
    'Eligibility and Usage: By using our car rental app, users confirm that they are at least 21 years old and hold a valid driver’s license. The apps services are available only within Palestine, and users must comply with all local traffic and safety laws.Rental periods, pricing, and vehicle availability are subject to change and will be confirmed at the time of booking.',
'Payment and Cancellations: Users are required to provide valid payment information at the time of booking. Payments for rentals will be processed through secure transactions, and a deposit may be required. Cancellations made within 24 hours of the rental start time may incur a fee. Refunds, if applicable, will be processed according to our refund policy.',
'Responsibilities and Liabilities: Renters are responsible for the vehicles care and must return it in the same condition as received. Any damage, loss, or traffic violations incurred during the rental period are the responsibility of the renter. The app and its owners are not liable for any accidents, injuries, or damages resulting from the use of the rental vehicle. Users must ensure they have appropriate insurance coverage before renting a vehicle.',
];
const TermsAndConditionsScreen = ({ navigation }) => {

    const { i18n, language } = useContext(LanguageContext);

    const isRtl = (language == 'ar');

    function tr(key) {
        return i18n.t(`termsAndConditionsScreen.${key}`)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                {termsAndConditions()}
            </View>
        </SafeAreaView>
    )

    function termsAndConditions() {
        return (
            <ScrollView showsVerticalScrollIndicator={false}>
                {
                    termsAndConditionList.map((item, index) => (
                        <Text
                            key={`${index}`}
                            style={{ ...Fonts.grayColor14Regular, marginBottom: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0, }}
                        >
                            {item}
                        </Text>
                    ))
                }
            </ScrollView>
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

export default TermsAndConditionsScreen;
