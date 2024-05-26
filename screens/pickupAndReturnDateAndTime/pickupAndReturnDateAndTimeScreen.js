import { SafeAreaView, StatusBar, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React, { useContext, useState } from 'react'
import { Colors, Fonts, Sizes, FontStyles } from '../../constants/styles'
import { Header, Button } from '../../components/usableComponent/usableComponent'
import { LanguageContext } from '../../languages'
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker"
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const PickupAndReturnDateAndTimeScreen = ({ navigation, route }) => {

    const { i18n, language } = useContext(LanguageContext);

    const isRtl = (language == 'ar');

    function tr(key) {
        return i18n.t(`pickupAndReturnDateAndTimeScreen.${key}`)
    }

    const selectionFor = route.params.selectionFor;

    const monthsList = [i18n.t('calender.jan'), i18n.t('calender.feb'), i18n.t('calender.mar'), i18n.t('calender.apr'), i18n.t('calender.may'), i18n.t('calender.jun'), i18n.t('calender.jul'), i18n.t('calender.aug'), i18n.t('calender.sep'), i18n.t('calender.oct'), i18n.t('calender.nov'), i18n.t('calender.dec')];

    const [state, setState] = useState({
        selectedTime: '',
        showTimePicker: false,
        defaultDate: new Date().getDate(),
        defaultMonth: new Date().getMonth(),
        defaultYear: new Date().getFullYear(),
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        defaultDate,
        defaultMonth,
        defaultYear,
        selectedTime,
        showTimePicker,
    } = state;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                {calenderInfo()}
                {timeInfo()}
            </View>
            {timePicker()}
            {continueButton()}
        </SafeAreaView>
    )

    function continueButton() {
        return (
            <Button
                btnText={tr('btnText')}
                btnStyle={{ borderRadius: 0.5, }}
                onPress={() => {
                    selectedTime == ''
                        ?
                        navigation.pop()
                        :
                        navigation.navigate({
                            name: route.params?.fromScreen && route.params.fromScreen == 'edit' ? 'Summary' : 'PickupAndReturnDetail',
                            params: {
                                date: `${defaultDate} ${monthsList[defaultMonth]} ${defaultYear}`,
                                time: selectedTime,
                                selectionFor: route.params.selectionFor
                            },
                            merge: true,
                        });
                }}
            />
        )
    }

    function timePicker() {

        const handleConfirm = (e, time) => {
            updateState({
                selectedTime: `${((time.getHours() + 11) % 12 + 1)}:${time.getMinutes()} ${time.getHours() >= 12 ? "PM" : "AM"}`,
                showTimePicker: false
            });
        };

        return (
            showTimePicker && <DateTimePicker
                mode="time"
                value={new Date()}
                onChange={handleConfirm}
            />
        )
    }

    function timeInfo() {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => updateState({ showTimePicker: true })}
                style={{ margin: Sizes.fixPadding * 2.0, }}
            >
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Medium }}>
                    {selectionFor == 'pickup' ? tr('pickupTimeTitle') : tr('returnTimeTitle')}
                </Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.timeInfoWrapStyle, }}>
                    <Text style={{ ...styles.timeTextStyle, ...selectedTime ? { ...Fonts.primaryColor14Regular } : { ...Fonts.grayColor14Regular } }}>
                        {selectedTime ? selectedTime : selectionFor == 'pickup' ? tr('pickupTimePlaceHolder') : tr('returnTimePlaceHolder')}
                    </Text>
                    <MaterialIcons name="access-time" size={18} color={Colors.lightGrayColor} />
                </View>
            </TouchableOpacity>
        )
    }

    function calenderInfo() {
        return (
            <View style={styles.calenderWrapStyle}>
                <Calendar
                    monthFormat={`${defaultDate} MMMM  yyyy`}
                    minDate={Date()}
                    hideExtraDays={true}
                    disableMonthChange={true}
                    firstDay={0}
                    renderArrow={direction => direction == 'left'
                        ?
                        <MaterialIcons name="arrow-back-ios" color={defaultMonth == new Date().getMonth() ? Colors.grayColor : Colors.blackColor} size={20} style={{ marginLeft: -Sizes.fixPadding, bottom: 40.0, }} />
                        :
                        <MaterialIcons name="arrow-forward-ios" color={Colors.blackColor} size={20} style={{ right: 20.0, bottom: 40.0, }} />
                    }
                    renderHeader={date => {
                        return (
                            <Text numberOfLines={1} style={{ ...styles.calenderSelectedDateStyle, maxWidth: width / 2.0, }}>
                                {defaultDate} {monthsList[defaultMonth]} {defaultYear}
                            </Text>
                        )
                    }}
                    dayComponent={({ date, state }) => { return dayComponent({ date, state }) }}
                    theme={{
                        calendarBackground: 'transparent',
                        textSectionTitleColor: Colors.blackColor,
                        textMonthFontFamily: FontStyles.regular,
                        textDayHeaderFontFamily: FontStyles.medium,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 16,
                    }}
                    hideDayNames={true}
                    onPressArrowLeft={subtractMonth => {
                        if (defaultMonth !== new Date().getMonth()) {
                            subtractMonth()
                            updateState({ defaultMonth: defaultMonth - 1 })
                            defaultMonth - 1 == new Date().getMonth()
                                ?
                                updateState({
                                    defaultDate: new Date().getDate(),
                                    defaultMonth: new Date().getMonth(),
                                })
                                :
                                null
                        }
                    }}
                    onPressArrowRight={addMonth => {
                        addMonth()
                        updateState({
                            defaultMonth: defaultMonth + 1,
                        })
                    }}
                    enableSwipeMonths={true}
                    style={{ borderRadius: Sizes.fixPadding + 5.0, paddingTop: Sizes.fixPadding * 4.0, }}
                />
                {calendarDays()}
            </View>
        )
    }

    function dayComponent({ date, state }) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    state == 'disabled'
                        ?
                        null
                        :
                        updateState({
                            defaultDate: date.day,
                            defaultMonth: date.month - 1
                        })
                }}
                style={{
                    ...styles.dayWrapStyle,
                    backgroundColor: state == 'disabled' ? Colors.whiteColor : date.day == defaultDate ? Colors.primaryColor : Colors.whiteColor
                }}
            >
                <Text style={state == 'disabled' ? { ...Fonts.grayColor18Medium } : { ...date.day == defaultDate ? { ...Fonts.whiteColor18Medium } : { ...Fonts.blackColor18Medium } }}>
                    {date.day}
                </Text>
            </TouchableOpacity>
        )
    }

    function calendarDays() {
        return (
            <View style={{ ...styles.dayNameWrapStyle }}>
                {dayNames.map((item, index) => (
                    <Text
                        key={`${index}`}
                        style={{ width: 25.0, ...Fonts.blackColor18SemiBold, textAlign: 'center' }}
                    >
                        {item}
                    </Text>
                ))}
            </View>
        )
    }

    function header() {
        return (
            <Header
                headerText={selectionFor == 'pickup' ? tr('pickupHeader') : tr('returnHeader')}
                isRtl={isRtl}
                arrowPress={() => navigation.pop()}
            />
        )
    }
}

export default PickupAndReturnDateAndTimeScreen

const styles = StyleSheet.create({
    calenderSelectedDateStyle: {
        flex: 1,
        ...Fonts.blackColor18SemiBold,
        paddingTop: Sizes.fixPadding - 5.0,
        lineHeight: 21.0,
        bottom: 30.0,
        left: -100.0,
        position: 'absolute'
    },
    dayWrapStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 35.0,
        height: 35.0,
        paddingTop: Sizes.fixPadding - 8.0,
    },
    dayNameWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        left: 15.0,
        right: 15.0,
        top: 50.0,
    },
    timeInfoWrapStyle: {
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.whiteColor,
        elevation: 1.0,
        borderRadius: Sizes.fixPadding,
        padding: Sizes.fixPadding,
        borderColor: Colors.shadowColor,
        borderWidth: 1.0,
    },
    timeTextStyle: {
        marginHorizontal: Sizes.fixPadding - 5.0,
        lineHeight: 17.0,
        paddingTop: Sizes.fixPadding - 5.0,
        flex: 1,
    },
    calenderWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding,
    }
})