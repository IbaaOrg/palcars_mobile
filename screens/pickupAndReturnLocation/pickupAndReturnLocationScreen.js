import { SafeAreaView, StatusBar, StyleSheet, Text, View, Dimensions, Image, ActivityIndicator, } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import MapView, { Marker } from "react-native-maps";
import * as Location from 'expo-location';
import { LanguageContext } from '../../languages';
import { MaterialIcons } from '@expo/vector-icons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Key from '../../constants/key';
import { Button } from '../../components/usableComponent/usableComponent';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.30;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

const PickupAndReturnLocationScreen = ({ navigation, route }) => {

    const { i18n, language } = useContext(LanguageContext);

    const isRtl = (language == 'ar');

    function tr(key) {
        return i18n.t(`pickupAndReturnLocationScreen.${key}`)
    }

    const [currentmarker, setCurrentMarker] = useState({
        latitude: LATITUDE - SPACE,
        longitude: LONGITUDE - SPACE,
    });

    const [address, setAddress] = useState('');

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }
            else {
                const location = await Location.getCurrentPositionAsync();
                const userLocation = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                }
                setCurrentMarker(userLocation);
                getAddress({ location: userLocation })
            }
        })();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, justifyContent: 'center' }}>
                {
                    address != ''
                        ?
                        <>
                            {mapView()}
                            {searchFieldWithBackArrow()}
                            {locationInfo()}
                        </>
                        :
                        <ActivityIndicator
                            size={40}
                            color={Colors.primaryColor}
                            style={{}}
                        />
                }
            </View>
            {address != '' ? proceedButton() : null}
        </SafeAreaView>
    )

    function locationInfo() {
        return (
            <View style={{
                flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center',
                ...styles.locationInfoWrapStyle,
            }}>
                <MaterialIcons
                    name='location-pin'
                    color={Colors.primaryColor}
                    size={22}
                />
                <Text numberOfLines={2} style={{ marginHorizontal: Sizes.fixPadding, flex: 1, ...Fonts.blackColor14Regular }}>
                    {address}
                </Text>
            </View>
        )
    }

    function proceedButton() {
        return (
            <Button
                btnText={tr('btnText')}
                btnStyle={{ borderRadius: 0.5, }}
                onPress={() => {
                    navigation.navigate({
                        name: route.params?.fromScreen == 'edit' ? 'Summary' : 'PickupAndReturnDetail',
                        params: { address: address, addressFor: route.params.addressFor },
                        merge: true,
                    });
                }}
            />
        )
    }

    async function setTheMarkerAccordingSearch({ address }) {
        let response = await Location.geocodeAsync(address);
        const userSearchLocation = {
            latitude: response[0].latitude,
            longitude: response[0].longitude,
        }
        setCurrentMarker(userSearchLocation);
        getAddress({ location: userSearchLocation })
    }

    function searchFieldWithBackArrow() {
        return (
            <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.searchFieldWithBackArrowWrapStyle, }}>
                <MaterialIcons
                    name={isRtl ? "arrow-forward" : "arrow-back"}
                    size={24}
                    color={Colors.blackColor}
                    onPress={() => navigation.pop()}
                    style={{ marginRight: isRtl ? 0.0 : Sizes.fixPadding, marginLeft: isRtl ? Sizes.fixPadding : 0.0 }}
                />
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.searchFieldStyle, }}>
                    <MaterialIcons
                        name='search'
                        color={Colors.grayColor}
                        size={20}
                    />
                    <GooglePlacesAutocomplete
                        placeholder={tr('placeHolder')}
                        onPress={async (data,) => {
                            await setTheMarkerAccordingSearch({ address: data.description })
                        }}
                        query={{
                            key: Key.apiKey,
                            language: language,
                        }}
                        styles={{
                            textInputContainer: {
                                height: 27.0,
                                padding: 0.0,
                            },
                            textInput: {
                                height: 33,
                                ...Fonts.grayColor14SemiBold,
                                color: Colors.primaryColor,
                            },
                        }}
                    />
                </View>
            </View>
        )
    }

    function mapView() {
        return (
            <MapView
                style={{ height: '100%' }}
                region={{
                    latitude: currentmarker.latitude,
                    longitude: currentmarker.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }}
                showsUserLocation={true}
                followsUserLocation={true}
            >
                <Marker
                    coordinate={currentmarker}
                    onDragEnd={(e) => {
                        setCurrentMarker(e.nativeEvent.coordinate)
                        getAddress({ location: e.nativeEvent.coordinate })
                    }}
                    draggable
                >
                    <Image
                        source={require('../../assets/images/icons/marker.png')}
                        style={{ width: 30.0, height: 30.0, resizeMode: 'stretch', }}
                    />
                </Marker>
            </MapView>
        )
    }

    async function getAddress({ location }) {
        var streetNo = '';
        var street = '';
        var district = '';
        var postalCode = '';
        var city = '';
        var region = '';
        var country = '';
        let response = await Location.reverseGeocodeAsync(location);
        for (let item of response) {
            if (item.streetNumber != null) {
                streetNo = `${item.streetNumber} `;
            }
            if (item.street != null) {
                street = `${item.street}, `;
            }
            if (item.district != null) {
                district = `${item.district}, `;
            }
            if (item.postalCode != null) {
                postalCode = `${item.postalCode}, `;
            }
            if (item.city != null) {
                city = `${item.city}, `;
            }
            if (item.region != null) {
                region = `${item.region}, `;
            }
            if (item.country != null) {
                country = `${item.country}`;
            }

            let address = `${streetNo}${street}${district}${postalCode}${city}${region}${country}`;
            setAddress(address)
        }
    }
}

export default PickupAndReturnLocationScreen

const styles = StyleSheet.create({
    searchFieldStyle: {
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding,
        flex: 1,
        padding: Sizes.fixPadding,
    },
    searchFieldWithBackArrowWrapStyle: {
        position: 'absolute',
        left: 20.0,
        right: 20.0,
        top: 20.0,
        alignItems: 'center',
    },
    locationInfoWrapStyle: {
        position: 'absolute',
        left: 20.0,
        right: 20.0,
        bottom: 20.0,
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding + 5.0,
    }
})