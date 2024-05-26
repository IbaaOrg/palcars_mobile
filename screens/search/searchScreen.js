import { StyleSheet, Text, View, StatusBar, SafeAreaView, TextInput, Image, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { BottomSheet } from '@rneui/themed';

const resentSearchesList = [
    {
        id: '1',
        carImage: require('../../assets/images/cars/car2.png'),
        car: 'Mercedes-Benz',
    },
    {
        id: '2',
        carImage: require('../../assets/images/cars/car3.png'),
        car: 'Audi A8 L',
    },
    {
        id: '3',
        carImage: require('../../assets/images/cars/car4.png'),
        car: 'Kia Carens',
    },
    {
        id: '4',
        carImage: require('../../assets/images/cars/car5.png'),
        car: 'Toyota glanza',
    },
];

const bodyTypesList = [
    {
        id: '1',
        type: 'All',
        selected: false,
    },
    {
        id: '2',
        type: 'Hatchback',
        selected: false,
    },
    {
        id: '3',
        type: 'Compact SUV',
        selected: false,
    },
    {
        id: '4',
        type: 'SUV',
        selected: false,
    },
    {
        id: '5',
        type: 'Sedan',
        selected: false,
    },
    {
        id: '6',
        type: 'MPV',
        selected: false,
    },
    {
        id: '7',
        type: 'Luxury',
        selected: false,
    },
];

const seatingCapacitiesList = [
    {
        id: '1',
        seat: '2',
        selected: false,
    },
    {
        id: '2',
        seat: '3',
        selected: false,
    },
    {
        id: '3',
        seat: '4',
        selected: false,
    },
    {
        id: '4',
        seat: '5',
        selected: false,
    },
    {
        id: '5',
        seat: '6',
        selected: false,
    },
    {
        id: '6',
        seat: '7+',
        selected: false,
    }];

const SearchScreen = ({ navigation, isRtl, i18n }) => {

    function tr(key) {
        return i18n.t(`searchScreen.${key}`)
    }

    const priceFilter = [tr('priceCategory1'), tr('priceCategory2')];

    const [search, setSearch] = useState('');
    const [recentSearches, setRecentSearches] = useState(resentSearchesList);
    const [bodyTypes, setBodyTypes] = useState(bodyTypesList);
    const [showFilterSheet, setShowFilterSheet] = useState(false);
    const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);
    const [seatingCapacities, setSeatingCapities] = useState(seatingCapacitiesList);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: Sizes.fixPadding - 8.0 }}>
                    {searchFieldWithFilterIcon()}
                    {recentSearchInfo()}
                    {bodyTypesInfo()}
                </ScrollView>
            </View>
            {filterSheet()}
        </SafeAreaView>
    )

    function filterSheet() {
        return (
            <BottomSheet
                isVisible={showFilterSheet}
                onBackdropPress={() => setShowFilterSheet(false)}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.50, 0, 0.50)' }}
            >
                <View style={styles.sheetWrapStyle}>
                    <Text style={{ marginBottom: Sizes.fixPadding * 2.0, textAlign: 'center', ...Fonts.blackColor18SemiBold }}>
                        {tr('filter')}
                    </Text>
                    {bodyTypesInfo()}
                    {priceInfo()}
                    {seatingCapacityInfo()}
                    {cancelAndApplyButton()}
                </View>
            </BottomSheet>
        )
    }

    function cancelAndApplyButton() {
        return (
            <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.cancelAndApplyButtonWrapStyle, }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowFilterSheet(false)}
                    style={{ backgroundColor: Colors.whiteColor, ...styles.cancelAndApplyButtonStyle }}
                >
                    <Text style={{ marginVertical: Sizes.fixPadding, ...Fonts.blackColor18SemiBold, }}>
                        {tr('cancel')}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowFilterSheet(false)}
                    style={{ backgroundColor: Colors.primaryColor, ...styles.cancelAndApplyButtonStyle }}
                >
                    <Text style={{ marginVertical: Sizes.fixPadding, ...Fonts.whiteColor18SemiBold }}>
                        {tr('apply')}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    function changeSeatCapacities({ id }) {
        const copyCapacity = seatingCapacities;
        const newCapacity = copyCapacity.map((item) => {
            if (item.id == id) {
                return { ...item, selected: !item.selected }
            }
            return item;
        })
        setSeatingCapities(newCapacity);
    }

    function seatingCapacityInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>
                    {tr('seatingTitle')}
                </Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                    {
                        seatingCapacities.map((item, index) => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => { changeSeatCapacities({ id: item.id }) }}
                                key={`${index}`}
                                style={{
                                    borderColor: item.selected ? Colors.primaryColor : Colors.shadowColor,
                                    borderBottomWidth: item.selected ? 1.0 : 0.0,
                                    ...styles.infoWrapStyle,
                                }}
                            >
                                <Text style={{ ...item.selected ? { ...Fonts.primaryColor14Medium } : { ...Fonts.grayColor14Medium } }}>
                                    {item.seat} {tr('seater')}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </View>
        )
    }

    function priceInfo() {
        return (
            <View style={{ marginVertical: Sizes.fixPadding * 3.5, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>
                    {tr('priceTitle')}
                </Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                    {
                        priceFilter.map((item, index) => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => { setSelectedPriceIndex(index) }}
                                key={`${index}`}
                                style={{
                                    borderColor: selectedPriceIndex == index ? Colors.primaryColor : Colors.shadowColor,
                                    borderBottomWidth: selectedPriceIndex == index ? 1.0 : 0.0,
                                    ...styles.infoWrapStyle,
                                }}
                            >
                                <Text style={{ ...selectedPriceIndex == index ? { ...Fonts.primaryColor14Medium } : { ...Fonts.grayColor14Medium } }}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </View>
        )
    }

    function changeBodyTypes({ id, type, selected }) {
        var newTypes;
        const copyBodyTypes = bodyTypes;
        if (((copyBodyTypes.filter((item) => item.selected == false).length) - 1) == 1 && selected == false) {
            newTypes = copyBodyTypes.map((item) => {
                return { ...item, selected: true }
            })
        }
        else {
            if (type == 'All') {
                newTypes = copyBodyTypes.map((item) => {
                    return { ...item, selected: copyBodyTypes[0].selected ? false : true }
                })
            }
            else {
                copyBodyTypes[0].selected
                    ?
                    newTypes = copyBodyTypes.map((item) => {
                        if (item.id == id) {
                            return { ...item, selected: !item.selected }
                        }
                        if (item.type == 'All') {
                            return { ...item, selected: false }
                        }
                        return item;
                    })
                    :
                    newTypes = copyBodyTypes.map((item) => {
                        if (item.id == id) {
                            return { ...item, selected: !item.selected }
                        }
                        return item;
                    })
            }
        }
        setBodyTypes(newTypes);
    }

    function bodyTypesInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Medium }}>
                    {tr('bodyTypeTitle')}
                </Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                    {
                        bodyTypes.map((item, index) => (
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => { changeBodyTypes({ id: item.id, type: item.type, selected: item.selected }) }}
                                key={`${index}`}
                                style={{
                                    borderColor: item.selected ? Colors.primaryColor : Colors.shadowColor,
                                    borderBottomWidth: item.selected ? 1.0 : 0.0,
                                    ...styles.infoWrapStyle,
                                }}
                            >
                                <Text style={{ ...item.selected ? { ...Fonts.primaryColor14Medium } : { ...Fonts.grayColor14Medium } }}>
                                    {item.type}
                                </Text>
                            </TouchableOpacity>
                        ))
                    }
                </View>
            </View>
        )
    }

    function recentSearchInfo() {
        return (
            recentSearches.length == 0
                ?
                null
                :
                <View style={{ marginBottom: Sizes.fixPadding - 5.0, }}>
                    {recentSearchTitle()}
                    {recentSearchesData()}
                </View>
        )
    }

    function recentSearchesData() {
        return (
            <View style={{ marginTop: Sizes.fixPadding + 5.0, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                {recentSearches.map((item) => (
                    <View
                        key={`${item.id}`}
                        style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', marginBottom: Sizes.fixPadding + 5.0, }}
                    >
                        <Image
                            source={item.carImage}
                            style={{ width: 50.0, height: 20.0, resizeMode: 'stretch', }}
                        />
                        <Text style={{ marginHorizontal: Sizes.fixPadding, ...Fonts.grayColor14Medium }}>
                            {item.car}
                        </Text>
                    </View>
                ))}
            </View>
        )
    }

    function recentSearchTitle() {
        return (
            <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.recentSearchTitleWrapStyle, }}>
                <Text style={{ flex: 0.9, ...Fonts.blackColor16Medium }}>
                    {tr('recentSearchTitle')}
                </Text>
                <Text onPress={() => setRecentSearches([])} style={{ ...Fonts.grayColor14Medium }}>
                    {tr('clearAll')}
                </Text>
            </View>
        )
    }

    function searchFieldWithFilterIcon() {
        return (
            <View style={{
                flexDirection: isRtl ? 'row-reverse' : 'row',
                alignItems: 'center',
                marginHorizontal: Sizes.fixPadding * 2.0,
                marginBottom: Sizes.fixPadding * 2.0,
            }}>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.searchFieldWrapStyle }}>
                    <MaterialIcons name="search" size={20} color={Colors.grayColor} />
                    <TextInput
                        value={search}
                        onChangeText={(value) => setSearch(value)}
                        style={{ ...Fonts.blackColor14Medium, flex: 1, marginHorizontal: Sizes.fixPadding - 5.0, }}
                        placeholderTextColor={Colors.grayColor}
                        placeholder={tr('searchPlaceHolder')}
                        selectionColor={Colors.primaryColor}
                    />
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => { setShowFilterSheet(true) }}
                    style={{
                        ...styles.filterIconWrapStyle,
                        marginLeft: isRtl ? 0.0 : Sizes.fixPadding,
                        marginRight: isRtl ? Sizes.fixPadding : 0.0,
                    }}
                >
                    <Image
                        source={require('../../assets/images/icons/filter.png')}
                        style={{ width: 24.0, height: 24.0, resizeMode: 'contain' }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    function header() {
        return (
            <Text style={{ margin: Sizes.fixPadding * 2.0, ...Fonts.blackColor18SemiBold }}>
                {tr('header')}
            </Text>
        )
    }
}

export default SearchScreen;

const styles = StyleSheet.create({
    filterIconWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        borderRadius: Sizes.fixPadding,
        alignItems: 'center', justifyContent: 'center',
        paddingVertical: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding - 5.0,
    },
    searchFieldWrapStyle: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding - 2.0
    },
    recentSearchTitleWrapStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    infoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderWidth: 1.0,
        elevation: 1.50,
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        paddingTop: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding,
        marginRight: Sizes.fixPadding,
        paddingBottom: Sizes.fixPadding - 2.0,
    },
    sheetWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderTopLeftRadius: Sizes.fixPadding,
        borderTopRightRadius: Sizes.fixPadding,
        paddingTop: Sizes.fixPadding + 5.0,
    },
    cancelAndApplyButtonStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelAndApplyButtonWrapStyle: {
        elevation: 3.0,
        borderTopColor: Colors.shadowColor,
        borderTopWidth: 1.5,
        marginTop: Sizes.fixPadding * 3.0,
    }
})