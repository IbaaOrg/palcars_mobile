import { SafeAreaView, StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Dimensions, ImageBackground, } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles';
import { MaterialIcons } from '@expo/vector-icons';
import { showRating } from '../../components/usableComponent/usableComponent';
import { Snackbar } from 'react-native-paper';

import axios from 'axios';

const { width, height } = Dimensions.get('window');

const categoriesList = [
    {
        id: '1',
        category: 'All',
    },
    {
        id: '2',
        category: 'Hatchback',
    },
    {
        id: '3',
        category: 'Compact SUV',
    },
    {
        id: '4',
        category: 'SUV',
    },
    {
        id: '5',
        category: 'Sedan',
    },
    {
        id: '6',
        category: 'MPV',
    },
    {
        id: '7',
        category: 'Luxury',
    },
];

const availableCarsList = [
   /*  {
        id: '1',
        carImage: require('../../assets/images/cars/car2.png'),
        carName: 'Mercedes-Benz',
        rating: 5.0,
        totalSeat: 5,
        perDayAmount: 220,
        inFavorite: false,
    },
    {
        id: '2',
        carImage: require('../../assets/images/cars/car3.png'),
        carName: 'Audi A8 L',
        rating: 5.0,
        totalSeat: 5,
        perDayAmount: 220,
        inFavorite: false,
    },
    {
        id: '3',
        carImage: require('../../assets/images/cars/car4.png'),
        carName: 'Kia Carens',
        rating: 5.0,
        totalSeat: 5,
        perDayAmount: 220,
        inFavorite: false,
    },
    {
        id: '4',
        carImage: require('../../assets/images/cars/car5.png'),
        carName: 'Toyota glanza',
        rating: 5.0,
        totalSeat: 7,
        perDayAmount: 220,
        inFavorite: false,
    },
    {
        id: '5',
        carImage: require('../../assets/images/cars/car2.png'),
        carName: 'Mercedes-Benz',
        rating: 5.0,
        totalSeat: 5,
        perDayAmount: 220,
        inFavorite: false,
    },
    {
        id: '6',
        carImage: require('../../assets/images/cars/car3.png'),
        carName: 'Audi A8 L',
        rating: 5.0,
        totalSeat: 5,
        perDayAmount: 220,
        inFavorite: false,
    },
    {
        id: '7',
        carImage: require('../../assets/images/cars/car4.png'),
        carName: 'Kia Carens',
        rating: 5.0,
        totalSeat: 5,
        perDayAmount: 220,
        inFavorite: false,
    },
    {
        id: '8',
        carImage: require('../../assets/images/cars/car5.png'),
        carName: 'Toyota glanza',
        rating: 5.0,
        totalSeat: 7,
        perDayAmount: 220,
        inFavorite: false,
    },
    {
        id: '9',
        carImage: require('../../assets/images/cars/car2.png'),
        carName: 'Mercedes-Benz',
        rating: 5.0,
        totalSeat: 5,
        perDayAmount: 220,
        inFavorite: false,
    },
    {
        id: '10',
        carImage: require('../../assets/images/cars/car3.png'),
        carName: 'Audi A8 L',
        rating: 5.0,
        totalSeat: 5,
        perDayAmount: 220,
        inFavorite: false,
    }, */
];

const HomeScreen = ({ navigation, isRtl, i18n }) => {
    const [palcarscars, setPalcarsCars] = useState([]);


  const [selectedImage, setSelectedImage] = useState(null);
 
  const fetchData = async () => {

    try { 
      const response = await axios.get('https://zzz.center/public/api/cars');
    const data = response.data.data;
        console.log(data);

        const formattedData = data.map(car => ({
            ...car,
            imageUrl: car.sub_images.length > 0 ? car.sub_images[0].photo_car_url : 'default_image_url'
        }));

        setCars(formattedData);

        console.log(formattedData);
    } catch (error) {
      console.error(error);
    } 
   
  };
    useEffect(() => {
        fetchData();

    }, []); 
    function tr(key) {
        return i18n.t(`homeScreen.${key}`)
    }

    const [selectedCategory, setSelectedCategory] = useState(categoriesList[0].category);
    const [withDriverSwitch, setWithDriverSwitch] = useState(true);
    const [cars, setCars] = useState([]);
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [snackBarMsg, setSnackBarMsg] = useState('');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <View style={{ flex: 1 }}>
                {addressInfoWithNotificationIcon()}
                <FlatList
                    ListHeaderComponent={
                        <>
                            {banner()}
                            {categoriesInfo()}
                            {availableCarInfo()}
                        </>
                    }
                    showsVerticalScrollIndicator={false}
                />
            </View>
            {snackBar()}
        </SafeAreaView>
    )

    function snackBar() {
        return (
            <Snackbar
                visible={showSnackBar}
                onDismiss={() => setShowSnackBar(false)}
                style={{ elevation: 0.0, backgroundColor: Colors.lightBlackColor }}
            >
                <Text style={{ ...Fonts.whiteColor12Regular, }}>
                    {snackBarMsg}
                </Text>
            </Snackbar>
        )
    }

    function availableCarInfo() {
        return (
            <>
                <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, }}>
                   
                    
                </View>
                {availableCars()}
            </>
        )
    }

    function updateCars({ id }) {
        const copyCars = cars;
        const newCar = copyCars.map((item) => {
            if (item.id == id) {
                setSnackBarMsg(item.inFavorite ? tr('removeFromFav') : tr('addInFav'))
                return { ...item, inFavorite: !item.inFavorite };
            }
            else {
                return item;
            }
        })
        setCars(newCar);
        setShowSnackBar(true);
    }

    function availableCars() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.push('CarDetail')}
                style={styles.availableCarsWrapStyle}
            >
                <MaterialIcons
                    name={item.inFavorite ? "favorite" : "favorite-outline"}
                    size={18}
                    color={item.inFavorite ? Colors.primaryColor : Colors.grayColor}
                    style={{ alignSelf: 'flex-end', margin: Sizes.fixPadding }}
                    onPress={() => updateCars({ id: item.id })}
                />
                <Image
                    source={{ uri: item.imageUrl }}
                    style={{ height: height / 9.0, width: '100%', resizeMode: 'stretch', }}
                />
                <View style={{ marginVertical: Sizes.fixPadding - 5.0, marginHorizontal: Sizes.fixPadding }}>
                    <Text style={{ paddingTop: Sizes.fixPadding - 5.0, lineHeight: 17.0, ...Fonts.blackColor14Medium }}>
                        {item.car_number}
                    </Text>
                    {showRating({ number: 5.0, starSize: 12.0, })}
                    <Text style={{ marginTop: Sizes.fixPadding - 7.0, ...Fonts.grayColor12Medium }}>
                        {item.seats} {tr('seater')}
                    </Text>
                    <Text>
                        <Text style={{ ...Fonts.primaryColor14SemiBold }}>
                            ${item.prices.price}
                        </Text>
                        <Text style={{ ...Fonts.blackColor14Medium }}>
                            /{tr('day')}
                        </Text>
                    </Text>
                </View>
            </TouchableOpacity>
        )
        return (
            <View style={{ marginTop: Sizes.fixPadding + 5.0, marginHorizontal: Sizes.fixPadding }}>
                <FlatList
                    data={cars}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    scrollEnabled={false}
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }

    function availableTitle() {
        return (
            <Text style={{ ...Fonts.blackColor16SemiBold, marginBottom: Sizes.fixPadding - 5.0, }}>
                {tr('availableTitle')}
            </Text>
        )
    }

    function withDriverOrNotInfo() {
        return (
            <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                <Text style={{ ...Fonts.blackColor14Medium }}>
                    {tr('withDriver')}
                </Text>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setWithDriverSwitch(!withDriverSwitch)}
                    style={{ ...styles.switchStyle, backgroundColor: withDriverSwitch ? Colors.primaryColor : Colors.lightGrayColor, }}
                >
                    <View style={{ alignSelf: withDriverSwitch ? 'flex-end' : 'flex-start', ...styles.switchInnerCircleStyle }} />
                </TouchableOpacity>
            </View>
        )
    }

    function categoriesInfo() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedCategory(item.category)}
                style={{
                    backgroundColor: selectedCategory == item.category ? Colors.primaryColor : Colors.whiteColor,
                    borderColor: selectedCategory == item.category ? Colors.primaryColor : Colors.bodyBackColor,
                    ...styles.categoryWrapStyle,
                }}
            >
                <Text style={selectedCategory == item.category ? { ...Fonts.whiteColor16Medium } : { ...Fonts.grayColor16Medium }}>
                    {item.category}
                </Text>
            </TouchableOpacity>
        )
        return (
            <View>
                <FlatList
                    horizontal
                    data={categoriesList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: Sizes.fixPadding + 5.0, paddingVertical: Sizes.fixPadding + 7.0 }}
                    inverted={isRtl}
                />
            </View>
        )
    }

    function banner() {
        return (
            <ImageBackground
                source={require('../../assets/images/other/zzz.png')}
                style={styles.bannerStyle}
                resizeMode="stretch"
                borderRadius={Sizes.fixPadding}
            >
                <View style={{ zIndex: 1, marginHorizontal: Sizes.fixPadding * 2.0, marginVertical: Sizes.fixPadding + 5.0, }}>
                    <Text numberOfLines={3} style={{ maxWidth: width / 2.0, marginBottom: Sizes.fixPadding + 5.0, ...Fonts.whiteColor18BoldItalic }}>
                        {`BEST CAR\nRENTAL DEAL\nTODAY`}
                    </Text>
                  
                </View>
              
            </ImageBackground>
        )
    }

    function addressInfoWithNotificationIcon() {
        return (
            <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.addressInfoWithNotificationIconWrapStyle, }}>
                <View style={{ flex: 1, flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center' }}>
                    
                </View>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => { navigation.push('Notification') }}
                >
                    <MaterialIcons name="notifications" size={30} color={Colors.primaryColor} />

                </TouchableOpacity>
            </View>
        )
    }
}

export default HomeScreen;

const styles = StyleSheet.create({
    addressTextStyle: {
        flex: 1,
        paddingTop: Sizes.fixPadding - 5.0,
        ...Fonts.blackColor14Regular,
        marginHorizontal: Sizes.fixPadding - 5.0,
    },
    addressInfoWithNotificationIconWrapStyle: {
        marginVertical: Sizes.fixPadding + 5.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bannerCarStyle: {
        position: 'absolute',
        right: 5.0,
        width: width / 2.1,
        alignSelf: 'center',
        resizeMode: 'stretch',
        height: 100.0,
    },
    bannerStyle: {
        width: width - 40.0,
        alignSelf: 'center',
        height: 160.0,
        overflow: 'hidden',
        flexDirection: 'row'
    },
    categoryWrapStyle: {
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding - 5.0,
        elevation: 2.0,
        borderRadius: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding - 5.0,
        borderWidth: 1.0,
        borderBottomWidth: 0.0,
    },
    switchStyle: {
        width: 35.0,
        height: 19.0,
        borderRadius: Sizes.fixPadding * 3.0,
        justifyContent: 'center',
    },
    switchInnerCircleStyle: {
        backgroundColor: Colors.whiteColor,
        width: 14.0,
        height: 14.0,
        borderRadius: 7.0,
        marginHorizontal: Sizes.fixPadding - 7.0,
    },
    availableCarsWrapStyle: {
        flex: 1,
        maxWidth: (width / 2.0) - 30.0,
        marginHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.shadowColor,
        borderWidth: 0.50,
        elevation: 3.0,
        borderRadius: Sizes.fixPadding,
    }
})