import { SafeAreaView, StatusBar, StyleSheet, Text, View, TextInput, ScrollView, BackHandler, TouchableOpacity } from 'react-native'
import React, { useContext, useState, useCallback } from 'react'
import { Colors, Fonts, Sizes } from '../../constants/styles'
import { Button } from '../../components/usableComponent/usableComponent'
import { LanguageContext } from '../../languages'
import { FontAwesome, Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const SigninScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState(false);
    const [error, setError] = useState(null);
    const [token, setToken] = useState("");
    //const navigation = useNavigation();
    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [splashLoading, setSplashLoading] = useState(false);

    const login = () => {
        setIsLoading(true);

        axios
            .post(`https://zzz.center/public/api/login`, {
                email,
                password,
            })
            .then(res => {
                let userInfo = res.data.data;
                setToken(userInfo.token);
                alert(`Welcom Back ${userInfo.name}`);
                //navigation.navigate('Home');
                setUserInfo(userInfo);
                AsyncStorage.setItem('token', JSON.stringify(userInfo.token));
                setIsLoading(false);
                navigation.push('Splash')
            })
            .catch(e => {
                console.log(`login error ${e}`);
                setIsLoading(false);
            });
    };



   

    const { i18n, language } = useContext(LanguageContext);

    const isRtl = (language == 'ar');

    function tr(key) {
        return i18n.t(`signinScreen.${key}`)
    }

    const backAction = () => {
        backClickCount == 1 ? BackHandler.exitApp() : _spring();
        return true;
    }

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
        }, [backAction])
    );

    function _spring() {
        setBackClickCount(1);
        setTimeout(() => {
            setBackClickCount(0)
        }, 1000)
    }

    const [backClickCount, setBackClickCount] = useState(0);
    const [phoneNumber, setPhoneNumber] = useState('');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {signinOptionsInfo()}
                    {phoneNumberInfo()}
                    {signinButton()}
                </ScrollView>
            </View>
            {dontAccountInfo()}
            {exitInfo()}
        </SafeAreaView>
    )

    function exitInfo() {
        return (
            backClickCount == 1
                ?
                <View style={[styles.animatedView]}>
                    <Text style={{ paddingTop: Sizes.fixPadding - 8.0, lineHeight: 15.0, ...Fonts.whiteColor12Medium }}>
                        {tr('exit')}
                    </Text>
                </View>
                :
                null
        )
    }

    function dontAccountInfo() {
        return (
            <Text style={{ textAlign: 'center', marginVertical: Sizes.fixPadding, marginHorizontal: Sizes.fixPadding * 2.0, }}>
                <Text style={{ ...Fonts.grayColor14Medium }}>
                    {tr('dontAccountInfo')} { }
                </Text>
                <Text onPress={() => navigation.push('Signup')} style={{ ...Fonts.primaryColor14Medium }}>
                    {tr('signup')}
                </Text>
            </Text>
        )
    }

    function signinButton() {
        return (
            <Button
                btnText={tr('btnText')}
                btnStyle={styles.signinButtonStyle}
                onPress={login}
                //onPress={() => navigation.push('Signup')}

            />
        )
    }

    function phoneNumberInfo() {
        return (
            <SafeAreaView style={styles.container}>
            



                <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={(text) => setEmail(text)}
                />
                <TextInput style={styles.input} placeholder="Password" value={password} secureTextEntry={true} onChangeText={(text) => setPassword(text)} 
                />

             




            </SafeAreaView>
        )
    }

    function signinOptionsInfo() {
        return (
            <View style={{ marginBottom: Sizes.fixPadding * 4.5, marginTop: Sizes.fixPadding * 2.0, }}>
                <Text style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding, ...Fonts.blackColor16Medium }}>
                    {tr('optionsTitle')}
                </Text>
                <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', marginHorizontal: Sizes.fixPadding }}>
                    <View style={styles.googleAndFacebookIconWrapStyle}>
                        <FontAwesome name="google" size={24} color={Colors.redColor} />
                    </View>
                    <View style={styles.googleAndFacebookIconWrapStyle}>
                        <FontAwesome name="facebook" size={24} color={Colors.blueColor} />
                    </View>
                </View>
            </View>
        )
    }

    function header() {
        return (
            <Text style={styles.headerTextStyle}>
                {tr('signin')}
            </Text>
        )
    }
}

export default SigninScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        margin: 10,
        borderRadius: 1,
        borderColor: "black",

    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
        paddingBottom: 20,

        width: '100%', // عرض الصورة بنسبة 100% لتغطي العرض بالكامل
        height: 800, // ارتفاع الصورة بنسبة 100% لتغطي الارتفاع بالكامل
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    forgotPasswordButton: {
        width: '100%',
        textAlign: 'flex-end',
    },
    forgotPasswordButtonText: {
        color: '#3563E9',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'right'
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        padding: 20,
        marginTop: -490,
        width: '90%',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        width: '100%',
    },
    button: {
        backgroundColor: '#3563E9',
        borderRadius: 5,
        padding: 10,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    createAccountButton: {
        marginTop: 20,
    },
    createAccountButtonText: {
        color: '#3563E9',
        fontSize: 12,
        fontWeight: 'bold',
    },
    text: {
        color: '#C4C4C4',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 15,
    },
    googleAndFacebookIconWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        borderRadius: Sizes.fixPadding,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 3.0,
    },
    textFieldWrapStyle: {
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        borderRadius: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 2.0,
        borderColor: Colors.shadowColor,
        borderWidth: 1.0,
        borderBottomWidth: 0.0,
    },
    signinButtonStyle: {
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding * 4.5,
    },
    headerTextStyle: {
        ...Fonts.blackColor22SemiBold,
        textAlign: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginTop: Sizes.fixPadding * 3.0,
        marginBottom: Sizes.fixPadding
    },
    animatedView: {
        backgroundColor: Colors.lightBlackColor,
        position: "absolute",
        bottom: 20,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding,
        justifyContent: "center",
        alignItems: "center",
    },
})