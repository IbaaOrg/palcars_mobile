import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, FlatList, TouchableOpacity, Dimensions, ImageBackground } from 'react-native';
import { Colors, Fonts, Sizes } from '../../constants/styles';
import { MaterialIcons } from '@expo/vector-icons';
import { showRating } from '../../components/usableComponent/usableComponent';
import { Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

const categoriesList = [
    { id: '1', category: 'All' },
    { id: '2', category: 'Hatchback' },
    { id: '3', category: 'Compact SUV' },
    { id: '4', category: 'SUV' },
    { id: '5', category: 'Sedan' },
    { id: '6', category: 'MPV' },
    { id: '7', category: 'Luxury' },
];

const HomeScreen = ({ navigation, isRtl, i18n }) => {
    const [category, setCategory] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [cars, setCars] = useState([]);
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [token, setToken] = useState(null);
    const [snackBarMsg, setSnackBarMsg] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(categoriesList[0].category);
    const [withDriverSwitch, setWithDriverSwitch] = useState(true);

    useEffect(() => {
        const getToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                }
                fetchData(storedToken);
            } catch (error) {
                console.error(error);
            }
        };
        getToken();
    }, [category]);

    const fetchData = async (authToken) => {
        const url = `https://zzz.center/public/api/cars?category=${category ? category : ""}`;
        console.log('Fetching data from URL:', url);
        try {
            const response = await axios.get(url);
            const data = response.data.data;
    
            const formattedData = data.map(car => ({
                ...car,
                imageUrl: car.sub_images.length > 0 ? car.sub_images[0].photo_car_url : 'default_image_url',
            }));
    
            if (authToken) {
                const cleanedAuthToken = authToken.replace(/^"(.*)"$/, '$1');
                const favoritesResponse = await axios.get('https://zzz.center/public/api/favorites', {
                    headers: { Authorization: `Bearer ${cleanedAuthToken}` },
                });
                const favorites = favoritesResponse.data.data;
    
                const formattedWithFavorites = formattedData.map(car => ({
                    ...car,
                    inFavorite: favorites.some(fav => fav.car.id === car.id),
                    favoriteId: favorites.find(fav => fav.car.id === car.id)?.id || null,
                }));
    
                setCars(formattedWithFavorites);
            } else {
                setCars(formattedData);
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.error('Resource not found:', error.response.data);
                setSnackBarMsg('Resource not found');
                setShowSnackBar(true);
            } else {
                console.error('Error fetching data:', error);
            }
        }
    };
    

    const updateCars = async ({ id }) => {
        const updatedCars = cars.map((item) => {
            if (item.id === id) {
                const updatedCar = { ...item, inFavorite: !item.inFavorite };
                setSnackBarMsg(item.inFavorite ? tr('removeFromFav') : tr('addInFav'));
                return updatedCar;
            }
            return item;
        });

        const updatedCar = updatedCars.find(car => car.id === id);
        try {
            const storedToken = await AsyncStorage.getItem('token');
            const cleanedAuthToken = storedToken.replace(/^"(.*)"$/, '$1');
            let response;

            if (updatedCar.inFavorite) {
                // Add to favorites
                response = await axios.post('https://zzz.center/public/api/favorites', {
                    car_id: updatedCar.id,
                }, {
                    headers: { Authorization: `Bearer ${cleanedAuthToken}` },
                });

                if (response.status === 200 || response.status === 201) {
                    updatedCar.favoriteId = response.data.id; // Ensure the favorite ID is set correctly
                    setCars(updatedCars);
                    setShowSnackBar(true);
                } else {
                    throw new Error('Failed to add favorite');
                }
            } else {
                // Remove from favorites
                response = await axios.delete(`https://zzz.center/public/api/favorites/${id}`, {
                    headers: { Authorization: `Bearer ${cleanedAuthToken}` },
                });

                if (response.status === 200 || response.status === 204) {
                    updatedCar.favoriteId = null; // Reset the favorite ID
                    setCars(updatedCars);
                    setShowSnackBar(true);
                } else {
                    throw new Error('Failed to remove favorite');
                }
            }
        } catch (error) {
            console.error(error.response.data.msg);
            
            const revertedCars = cars.map((item) => {
                if (item.id === id) {
                    return { ...item, inFavorite: !item.inFavorite };
                }
                return item;
            });
            setCars(revertedCars);
            setSnackBarMsg(tr('removeFromFav'));
            setShowSnackBar(true);
        }
    };

    function tr(key) {
        return i18n.t(`homeScreen.${key}`);
    }

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
    );

    function snackBar() {
        return (
            <Snackbar
                visible={showSnackBar}
                onDismiss={() => setShowSnackBar(false)}
                style={{ elevation: 0.0, backgroundColor: Colors.lightBlackColor }}
            >
                <Text style={{ ...Fonts.whiteColor12Regular }}>
                    {snackBarMsg}
                </Text>
            </Snackbar>
        );
    }

    function availableCarInfo() {
        return (
            <>
                <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }} />
                {availableCars()}
            </>
        );
    }

    function availableCars() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.push('CarDetail', { itemId: item.id })}
                style={styles.availableCarsWrapStyle}
            >
                {token ? (
                    item.inFavorite ? (
                        <MaterialIcons
                            name="favorite"
                            size={18}
                            color={Colors.primaryColor}
                            style={{ alignSelf: 'flex-end', margin: Sizes.fixPadding }}
                            onPress={() => updateCars({ id: item.id })}
                        />
                    ) : (
                        <MaterialIcons
                            name="favorite-outline"
                            size={18}
                            color={Colors.grayColor}
                            style={{ alignSelf: 'flex-end', margin: Sizes.fixPadding }}
                            onPress={() => updateCars({ id: item.id })}
                        />
                    )
                ) : null}
                <Image
                    source={{ uri: item.imageUrl }}
                    style={{ height: height / 9.0, width: '100%', resizeMode: 'stretch' }}
                />
                <View style={{ marginVertical: Sizes.fixPadding - 5.0, marginHorizontal: Sizes.fixPadding }}>
                    <Text style={{ paddingTop: Sizes.fixPadding - 5.0, lineHeight: 17.0, ...Fonts.blackColor14Medium }}>
                        {item.car_number}
                    </Text>
                    {showRating({ number: 5.0, starSize: 12.0 })}
                    <Text style={{ marginTop: Sizes.fixPadding - 7.0, ...Fonts.grayColor12Medium }}>
                        {item.seats} {tr('seater')}
                    </Text>
                    <Text>
                        <Text style={{ ...Fonts.primaryColor14SemiBold }}>
                            {item.prices.length > 0 ? item.prices[0].price : 'N/A'}₪
                        </Text>
                        <Text style={{ ...Fonts.blackColor14Medium }}>
                            /{tr('day')}
                        </Text>
                    </Text>
                </View>
            </TouchableOpacity>
        );

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
        );
    }

    function categoriesInfo() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    setSelectedCategory(item.category);
                    setCategory(item.category === 'All' ? '' : item.category);
                }}
                style={{
                    backgroundColor: selectedCategory === item.category ? Colors.primaryColor : Colors.whiteColor,
                    borderColor: selectedCategory === item.category ? Colors.primaryColor : Colors.bodyBackColor,
                    ...styles.categoryWrapStyle,
                }}
            >
                <Text style={selectedCategory === item.category ? { ...Fonts.whiteColor16Medium } : { ...Fonts.grayColor16Medium }}>
                    {item.category}
                </Text>
            </TouchableOpacity>
        );
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
        );
    }

    function banner() {
        return (
            <ImageBackground
                source={require('../../assets/images/other/zzz.png')}
                style={styles.bannerStyle}
                resizeMode="stretch"
                borderRadius={Sizes.fixPadding}
            >
                <View style={{ zIndex: 1, marginHorizontal: Sizes.fixPadding * 2.0, marginVertical: Sizes.fixPadding + 5.0 }}>
                    <Text numberOfLines={3} style={{ maxWidth: width / 2.0, marginBottom: Sizes.fixPadding + 5.0, ...Fonts.whiteColor18BoldItalic }}>
                        {`BEST CAR\nRENTAL DEAL\nTODAY`}
                    </Text>
                </View>
            </ImageBackground>
        );
    }

    function addressInfoWithNotificationIcon() {
        return (
            <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.addressInfoWithNotificationIconWrapStyle }}>
                <View style={{ flex: 1, flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center' }} />
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.push('Notification')}
                >
                    <MaterialIcons name="notifications" size={30} color={Colors.primaryColor} />
                </TouchableOpacity>
            </View>
        );
    }
};

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
});
