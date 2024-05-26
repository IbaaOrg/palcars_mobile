import { StyleSheet, Text, View, SafeAreaView, StatusBar, Animated, Image, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Fonts, Sizes, Colors } from '../../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Snackbar } from 'react-native-paper';
import { showRating } from '../../components/usableComponent/usableComponent';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get('window');

const favoritesList = [
    {
        key: '1',
        carImage: require('../../assets/images/cars/car2.png'),
        carName: 'Mercedes-Benz',
        rating: 5.0,
        totalSeat: 5,
        perDayAmount: 220,
    },
    {
        key: '2',
        carImage: require('../../assets/images/cars/car3.png'),
        carName: 'Audi A8 L',
        rating: 5.0,
        totalSeat: 5,
        perDayAmount: 220,
    },
    {
        key: '3',
        carImage: require('../../assets/images/cars/car4.png'),
        carName: 'Kia Carens',
        rating: 5.0,
        totalSeat: 5,
        perDayAmount: 220,
    },
    {
        key: '4',
        carImage: require('../../assets/images/cars/car5.png'),
        carName: 'Toyota glanza',
        rating: 5.0,
        totalSeat: 7,
        perDayAmount: 220,
    },
    {
        key: '5',
        carImage: require('../../assets/images/cars/car2.png'),
        carName: 'Mercedes-Benz',
        rating: 5.0,
        totalSeat: 5,
        perDayAmount: 220,
    },
];

const rowSwipeAnimatedValues = {};

Array(favoritesList.length + 1)
    .fill('')
    .forEach((_, i) => {
        rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
    });


const FavoritesScreen = ({ navigation, isRtl, i18n, }) => {
 const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const cleanedAuthToken = token.replace(/^"(.*)"$/, '$1');

                const response = await axios.get('https://zzz.center/public/api/favorites', {
                    headers: {
                        Authorization: `Bearer ${cleanedAuthToken}`,
                    },
                });
                setListData(response.data.data);
                console.log(response.data.data);

            } catch (error) {
                console.error('Failed to fetch data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    function tr(key) {
        return i18n.t(`favoritesScreen.${key}`)
    }

    const [showSnackBar, setShowSnackBar] = useState(false);

    const [listData, setListData] = useState([]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {listData.length == 0 ?
                    noFavoriteItemsInfo()
                    :
                    <>
                        {header()}
                        {favoriteItems()}
                    </>
                }
                {snackBar()}
            </View>
        </SafeAreaView>
    )

    function favoriteItems() {

        const closeRow = (rowMap, rowKey) => {
            if (rowMap[rowKey]) {
                rowMap[rowKey].closeRow();
            }
        };

        const renderHiddenItem = (data, rowMap) => (
            <View style={{ alignItems: 'center', flex: 1 }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                        ...styles.backDeleteContinerStyle,
                        right: isRtl ? null : 0,
                        left: isRtl ? 0 : null,
                    }}
                    onPress={() => deleteRow(rowMap, data.item.key)}
                >
                   
                      
                </TouchableOpacity>
            </View>
        );

        const deleteRow = (rowMap, rowKey) => {
            closeRow(rowMap, rowKey);
            const newData = [...listData];
            const prevIndex = listData.findIndex(item => item.key === rowKey);
            newData.splice(prevIndex, 1);
            setShowSnackBar(true);
            setListData(newData);
        };

        const onSwipeValueChange = swipeData => {
            const { key, value } = swipeData;
            rowSwipeAnimatedValues[key].setValue(Math.abs(value));
        };

        const renderItem = data => (
            <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.push('CarDetail')}
                    style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.carInfoWrapStyle, }}
                >
                    <Image
                        source={data.item.carImage}
                        style={{ width: width / 3.0, height: width / 5.5, resizeMode: 'stretch' }}
                    />
                    <View style={{ alignItems: isRtl ? 'flex-end' : 'flex-start', flex: 1, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                        <Text numberOfLines={1} style={{ paddingTop: Sizes.fixPadding - 8.0, lineHeight: 19.0, ...Fonts.blackColor16Medium }}>
                            {data.item.car.car_number}
                        </Text>
                        {showRating({ number: data.item.rating, starSize: 13 })}
                        <Text style={{ ...Fonts.grayColor12Medium }}>
                            {data.item.car.seats} {tr('seater')}
                        </Text>
                        <Text>
                            <Text style={{ ...Fonts.primaryColor14SemiBold }}>
                                {data.item.prices}
                            </Text>
                            <Text style={{ ...Fonts.blackColor14Medium }}>
                                /{tr('day')}
                            </Text>
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );

        return (
            <SwipeListView
                data={listData}
                renderItem={renderItem}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={isRtl ? 0 : -50}
                leftOpenValue={isRtl ? 50 : 0}
                onSwipeValueChange={onSwipeValueChange}
                useNativeDriver={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: Sizes.fixPadding - 5.0 }}
            />
        )
    }

    function snackBar() {
        return (
            <Snackbar
                style={{ backgroundColor: Colors.lightBlackColor, elevation: 0.0, }}
                visible={showSnackBar}
                onDismiss={() => setShowSnackBar(false)}
            >
                <Text style={{ paddingTop: Sizes.fixPadding - 8.0, lineHeight: 15.0, ...Fonts.whiteColor12Regular }}>
                    {tr('snackBarMsg')}
                </Text>
            </Snackbar>
        )
    }

    function noFavoriteItemsInfo() {
        return (
            <View style={styles.emptyPageStyle}>
                <MaterialIcons name="favorite" size={40} color={Colors.grayColor} style={{ marginBottom: Sizes.fixPadding - 5.0 }} />
                <Text style={{ ...Fonts.grayColor16SemiBold }}>
                    {tr('emptyTitle')}
                </Text>
                <Text style={{ textAlign: 'center', ...Fonts.grayColor14Medium }}>
                    {tr('emptyDescription')}
                </Text>
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

export default FavoritesScreen

const styles = StyleSheet.create({
    emptyPageStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: Sizes.fixPadding * 2.0,
    },
    backDeleteContinerStyle: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 50,
        backgroundColor: Colors.redColor,
        marginBottom: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding,
    },
    carInfoWrapStyle: {
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        elevation: 2.0,
        paddingVertical: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding * 2.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderColor: Colors.shadowColor,
        borderWidth: 1.0,
    }
})