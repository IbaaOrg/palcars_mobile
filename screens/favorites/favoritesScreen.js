import { StyleSheet, Text, View, SafeAreaView, StatusBar, Animated, Image, Dimensions, TouchableOpacity, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Fonts, Sizes, Colors } from '../../constants/styles';
import { MaterialIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Snackbar } from 'react-native-paper';
import { showRating } from '../../components/usableComponent/usableComponent';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get('window');

const FavoritesScreen = ({ navigation, isRtl, i18n, }) => {
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [listData, setListData] = useState([]);
    const rowSwipeAnimatedValues = {};

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
            const cleanedAuthToken = token.replace(/^"(.*)"$/, '$1');

            if (!cleanedAuthToken) {
                // Handle case when token is null (not found)
                navigation.replace('Signin');
                return; // Exit the function early
            }

                const response = await axios.get('https://zzz.center/public/api/favorites', {
                    headers: {
                        Authorization: `Bearer ${cleanedAuthToken}`,
                    },
                });
                const data = response.data.data;
                setListData(data);

                data.forEach((item, index) => {
                    rowSwipeAnimatedValues[`${index}`] = new Animated.Value(0);
                });

            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
    }, []);
    const clearFavorites = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const cleanedAuthToken = token.replace(/^"(.*)"$/, '$1');

            await axios.patch('https://zzz.center/public/api/favorites/clear', {}, {
                headers: {
                    Authorization: `Bearer ${cleanedAuthToken}`,
                },
            });

            setListData([]);
            setShowSnackBar(true);

        } catch (error) {
            console.error('Failed to clear favorites:', error);
        }
    };
    function tr(key) {
        return i18n.t(`favoritesScreen.${key}`)
    }

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
                        ...styles.backDeleteContainerStyle,
                        right: isRtl ? null : 0,
                        left: isRtl ? 0 : null,
                    }}
                    onPress={() => deleteRow(rowMap, data.item.key)}
                />
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
            if (rowSwipeAnimatedValues[key]) {
                rowSwipeAnimatedValues[key].setValue(Math.abs(value));
            }
        };

        const renderItem = data => (
            <View style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.push('CarDetail')}
                    style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.carInfoWrapStyle }}
                >
                    <Image
                        source={{ uri: data.item.car.sub_images[0].photo_car_url }}
                        style={{ width: width / 3.0, height: width / 5.5, resizeMode: 'stretch' }}
                    />
                    <View style={{ alignItems: isRtl ? 'flex-end' : 'flex-start', flex: 1, marginHorizontal: Sizes.fixPadding * 2.0 }}>
                        <Text numberOfLines={1} style={{ paddingTop: Sizes.fixPadding - 8.0, lineHeight: 19.0, ...Fonts.blackColor16Medium }}>
                            {data.item.car.car_number}
                        </Text>
                        {showRating({ number: data.item.rating, starSize: 13 })}
                        <Text style={{ ...Fonts.grayColor12Medium }}>
                            {data.item.car.seats} {tr('seater')}
                        </Text>
                        <Text>
                            <Text style={{ ...Fonts.primaryColor14SemiBold }}>
                                {data.item.car.prices && data.item.car.prices.length > 0 && data.item.car.prices[0].price_after_discount}₪
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
        );
    }

    function snackBar() {
        return (
            <Snackbar
                style={{ backgroundColor: Colors.lightBlackColor, elevation: 0.0 }}
                visible={showSnackBar}
                onDismiss={() => setShowSnackBar(false)}
            >
                <Text style={{ paddingTop: Sizes.fixPadding - 8.0, lineHeight: 15.0, ...Fonts.whiteColor12Regular }}>
                    {tr('snackBarMsg')}
                </Text>
            </Snackbar>
        );
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
        );
    }

    function header() {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: Sizes.fixPadding * 2.0 }}>
            <Text style={{ ...Fonts.blackColor18SemiBold }}>
                {tr('header')}
            </Text>
            <Button title="Clear All" onPress={clearFavorites} color={Colors.primaryColor} />
        </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
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
    );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
    emptyPageStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: Sizes.fixPadding * 2.0,
    },
    backDeleteContainerStyle: {
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
});
