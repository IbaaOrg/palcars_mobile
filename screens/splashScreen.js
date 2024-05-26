import { SafeAreaView, StatusBar, Text, View, BackHandler } from 'react-native'
import React, { useCallback } from 'react'
import { Colors, Fonts } from '../constants/styles'
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const SplashScreen = ({ navigation }) => {

    const backAction = () => {
        BackHandler.exitApp();
        return true;
    }

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
        }, [backAction])
    );

    setTimeout(() => {
        navigation.push('Onboarding')
    }, 2000);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialIcons name="local-car-wash" size={80} color={Colors.whiteColor} />
                <Text style={{ ...Fonts.whiteColor35SemiBold }}>
                   Palcars Rental Car
                </Text>
            </View>
        </SafeAreaView>
    )

}

export default SplashScreen;