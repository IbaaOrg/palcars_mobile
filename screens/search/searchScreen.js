import { StyleSheet, Text, View, StatusBar, SafeAreaView, TextInput, Image, ScrollView } from 'react-native'
import React, { useState,useEffect } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { BottomSheet } from '@rneui/themed';
import axios from 'axios';

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
        type: 'Convertible',
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
        id: '9',
        type: 'Station Wagon',
        selected: false,
    },
 

    {
        id: '6',
        type: 'Minivan',
        selected: false,
    },
    {
        id: '7',
        type: 'Crossover',
        selected: false,
    },
    {
        id: '8',
        type: 'Pickup trucks',
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
        seat: '8',
        selected: false,
    }];
    const steeringTypesList=[
        {
            id : '1',
            type: 'Manual',
            selected: false,
        },
        {
            id : '2',
            type: 'Automatic',
            selected: false,
        }
    ]
const SearchScreen = ({ navigation, isRtl, i18n }) => {

    function tr(key) {
        return i18n.t(`searchScreen.${key}`)
    }

    const priceFilter = [tr('priceCategory1'), tr('priceCategory2')];

    const [search, setSearch] = useState('');
    const [bodyTypes, setBodyTypes] = useState(bodyTypesList);
    const [showFilterSheet, setShowFilterSheet] = useState(false);
    const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);
    const [seatingCapacities, setSeatingCapities] = useState(seatingCapacitiesList);
    const [steeringTypes, setSteeringTypes] = useState(steeringTypesList);
    const [selectedSteering, setSelectedSteering] = useState(steeringTypesList[0]?.type); 
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSeats, setSelectedSeats] = useState('');
    const [carData, setCarData] = useState([]);
    const [priceSortOrder, setPriceSortOrder] = useState(null);
    const [sortedCarData, setSortedCarData] = useState([]);
    const [filteredCars, setFilteredCars] = useState(sortedCarData);

    const fetchCarData = async () => {
        try {
            // Constructing URL based on selected filters
            let url = 'https://zzz.center/public/api/cars';
    
            const params = [];
            if (selectedCategory) params.push(`category=${selectedCategory}`);
            if (selectedSeats === '') {
                params.push(`seats${selectedSeats}`)
            }
            else {
                params.push(`seats=${selectedSeats}`)

            }
            if (selectedSteering){
                params.push(`steering${selectedSteering}`);
            } else {
                params.push(`steering=${selectedSteering}`);
            }
           
    
            if (params.length > 0) {
                url += `?${params.join('&')}`;
            }
    
            const response = await axios.get(url);
            setCarData(response.data.data);
            setSortedCarData(sortedCarData.length>0?sortedCarData:response.data.data);
        } catch (error) {
            console.error('Error fetching car data:', error);
        }
    };
    
    
    useEffect(() => {
            fetchCarData();  
    }, [selectedCategory, selectedSeats,sortedCarData,search]);
    
    const togglePriceSortOrder = (index) => {
        let sortedData = [...carData]; // Create a copy of carData
    
        // Sort the data based on index
        if (index === 0) {
            sortedData.sort((a, b) => a.prices && a.prices[0] && parseFloat(a.prices[0].price_after_discount) -b.prices&&b.prices[0]&& parseFloat(b.prices&&b.prices[0].price_after_discount));
        } else if (index === 1) {
            sortedData.sort((a, b) =>b.prices&&b.prices[0]&& parseFloat(b.prices&&b.prices[0].price_after_discount) - a.prices && a.prices[0]&&parseFloat(a.prices&&a.prices[0].price_after_discount));
        }
    
        // Update state with the sorted data
        setPriceSortOrder(index); // Update sort order state
        setSortedCarData(sortedData); // Update sorted data state
    };
    
    
    const sortCars = (order, data) => {
        // Sorting function based on price
        return data.sort((a, b) => {
            const priceA = a.prices && a.prices[0] ? parseFloat(a.prices[0].price_after_discount) : 0;
            const priceB = b.prices && b.prices[0] ? parseFloat(b.prices[0].price_after_discount) : 0;
    
            if (order === 'asc') {2
                return priceA - priceB;
            } else {
                return priceB - priceA;
            }
        });
    };
    useEffect(() => {
        let filtered = carData.filter(car =>
            car.make.toLowerCase().includes(search.toLowerCase())
        );
       // Apply sorting based on the current priceSortOrder
    if (priceSortOrder === 0) {
        carData.sort((a, b) => parseFloat(a.prices && a.prices[0].price_after_discount) - parseFloat(b.prices && b.prices[0].price_after_discount));
     filtered=carData;
    } else if (priceSortOrder === 1) {
        carData.sort((a, b) => parseFloat(b.prices && b.prices[0].price_after_discount) - parseFloat(a.prices && a.prices[0].price_after_discount));
        filtered=carData;

    }

    // Update state with filtered and sorted cars
    setSortedCarData(filtered);
    }, [search, carData]);
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
        <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
        <View style={{ flex: 1 }}>
            {header()}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: Sizes.fixPadding - 8.0 }}>
                {searchFieldWithFilterIcon()}
                {bodyTypesInfo()}
                {displayFetchedCars()}
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
                    {steeringTypesInfo()}
                    {seatingCapacityInfo()}
                    {priceInfo()}
                    {cancelAndApplyButton()}
                </View>
            </BottomSheet>
        );
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
                    onPress={() => {
                        setShowFilterSheet(false);
                        fetchCarData(); // Trigger the car data fetch when filters are applied
                    }}
                    style={{ backgroundColor: Colors.primaryColor, ...styles.cancelAndApplyButtonStyle }}
                >
                    <Text style={{ marginVertical: Sizes.fixPadding, ...Fonts.whiteColor18SemiBold }}>
                        {tr('apply')}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
    

    function changeSeatCapacities({ id }) {
        const newCapacity = seatingCapacities.map((item) => {
            if (item.id === id) {
                return { ...item, selected: !item.selected };
            } else {
                return { ...item, selected: false }; // Deselect other seats
            }
        });
    
        setSeatingCapities(newCapacity);
    
        const selected = newCapacity.find((item) => item.selected)?.seat; // Get the selected seat
        setSelectedSeats(selected || ''); // Set the selected seat or empty string if none is selected
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
    function changeSteeringTypes({ id }) {
        const newSteeringTypes = steeringTypes.map((item) => {
            if (item.id === id) {
                return { ...item, selected: true };
            } else {
                return { ...item, selected: false };
            }
        });

        setSteeringTypes(newSteeringTypes);

        const selected = newSteeringTypes.find((item) => item.selected)?.type;
        setSelectedSteering(selected || '');
    }
   
    function priceInfo (){
        return (
            <View style={{ marginVertical: Sizes.fixPadding * 3.5, marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ ...Fonts.blackColor16Medium }}>Price</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                    {priceFilter.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => togglePriceSortOrder(index)}
                            style={{
                                borderColor: priceSortOrder === index ? Colors.primaryColor : Colors.shadowColor,
                                borderBottomWidth: priceSortOrder === index ? 1.0 : 0.0,
                                ...styles.infoWrapStyle,
                            }}>
                            <Text style={{ ...priceSortOrder === index ? Fonts.primaryColor14Medium : Fonts.grayColor14Medium }}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        );
    };


    function changeBodyTypes({ id }) {
        const newBodyTypes = bodyTypes.map((item) => {
            if (item.id === id) {
                return { ...item, selected: true };
            } else {
                return { ...item, selected: false };
            }
        });
    
        setBodyTypes(newBodyTypes);
    
        const selectedBodyType = newBodyTypes.find(item => item.selected);
        setSelectedCategory(selectedBodyType && selectedBodyType.type !== 'All' ? selectedBodyType.type : '');
    }
    
    
    function changeSeatCapacities({ id }) {
        const copyCapacity = seatingCapacities;
        const newCapacity = copyCapacity.map((item) => {
            if (item.id == id) {
                return { ...item, selected: true }
            }else {
                return { ...item, selected: false };
           
            }
        })
        setSeatingCapities(newCapacity);
        const selected = newCapacity.filter(item => item.selected).map(item => item.seat).join(',');
        setSelectedSeats(selected);
    }
    
    function displayFetchedCars() {
        return (
            <View style={{ marginTop: Sizes.fixPadding * 2.0, marginHorizontal: Sizes.fixPadding * 2.0, width: 380.0 }}>
            {sortedCarData.map((car, index) => (
                <View key={index} style={{ padding: Sizes.fixPadding, backgroundColor: Colors.whiteColor, borderRadius: 10, marginBottom: Sizes.fixPadding + 5.0 }}>
                    <Image 
                        source={{ uri: car.sub_images && car.sub_images.length > 0 && car.sub_images[0].photo_car_url ? car.sub_images[0].photo_car_url : 'default_image_url' }}
                        style={{ width: '100%', height: 200.0, resizeMode: 'cover', borderRadius: 10 }} 
                    />
                        <Text style={{ marginHorizontal: Sizes.fixPadding, ...Fonts.grayColor14Medium }}>{car.make} - {car.model}</Text>
                        <Text style={{ ...Fonts.primaryColor14Medium, marginBottom: Sizes.fixPadding }}>
                            {car.prices && car.prices[0] ? `${car.prices[0].price_after_discount}₪/day` : 'Price not available'}
                        </Text>
                    </View>
                ))}
            </View>
        )
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

   
    function steeringTypesInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor16Medium }}>
                     Steering
                </Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                    {steeringTypes.map((item, index) => (
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={() => { changeSteeringTypes({ id: item.id }) }}
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
                    ))}
                </View>
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
        marginHorizontal: Sizes.fixPadding * 2.0,
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