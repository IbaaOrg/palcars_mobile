import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import * as Font from "expo-font";
import { Colors } from "../../constants/styles";

const LoadingScreen = ({ navigation }) => {
    useEffect(() => {
        (async () => {
            await Font.loadAsync({
                Poppins_Regular: require("../../assets/fonts/Poppins-Regular.ttf"),
                Poppins_Medium: require("../../assets/fonts/Poppins-Medium.ttf"),
                Poppins_SemiBold: require("../../assets/fonts/Poppins-SemiBold.ttf"),
                Poppins_Bold: require("../../assets/fonts/Poppins-Bold.ttf"),
                Poppins_BoldItalic: require("../../assets/fonts/Poppins-BoldItalic.ttf"),
                Poppins_ExtraBold: require("../../assets/fonts/Poppins-ExtraBold.ttf"),
            });
            navigation.navigate('Splash');
        })();
    })

    return (
        <View style={styles.pageStyle}>
            <ActivityIndicator color={Colors.primaryColor} size={56} style={{ alignSelf: 'center' }} />
        </View>
    )
}

export default LoadingScreen;

const styles = StyleSheet.create({
    pageStyle: {
        flex: 1,
        backgroundColor: Colors.whiteColor,
        justifyContent: 'center',
        alignItems: 'center'
    }
})


