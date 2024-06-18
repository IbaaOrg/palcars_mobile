import { SafeAreaView, StatusBar, StyleSheet, Text, View, Dimensions, TouchableOpacity, Image, Modal,TextInput, ScrollView } from 'react-native';
import React, { useContext, useState, useEffect } from 'react';
import { Colors, Fonts, Sizes } from '../../constants/styles';
import { Button, Header } from '../../components/usableComponent/usableComponent';
import { LanguageContext } from '../../languages';
import { AntDesign } from '@expo/vector-icons';
import { BottomSheet } from '@rneui/themed';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width } = Dimensions.get('window');

const EditProfileScreen = ({ navigation }) => {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const { i18n, language } = useContext(LanguageContext);
  const isRtl = language === 'ar';

  const [user, setUser] = useState(null);
  const [state, setState] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePicUrl: '', 
    drivingPicUrl: '', 
    showChangeProfilePicSheet: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const cleanedAuthToken = token.replace(/^"(.*)"$/, '$1');

      const response = await axios.get('https://zzz.center/public/api/user', {
        headers: {
          Authorization: `Bearer ${cleanedAuthToken}`,
        },
      });
      const userData = response.data.data;
      setUser(userData);
      setState((prevState) => ({
        ...prevState,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        profilePicUrl: userData.photo_user,
        drivingPicUrl: userData.photo_drivinglicense
      }));
    } catch (error) {
      console.log(error.response.data);
    }
  };
  const handleUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const cleanedAuthToken = token.replace(/^"(.*)"$/, '$1');

      const response = await axios.post(`https://zzz.center/public/api/users/${user.id}`, {
        name: state.name,
        email: state.email,
        phone: state.phone,
        address: state.address,
        photo_user: state.profilePicUrl,
        photo_drivinglicense: state.drivingPicUrl,
      }, {
        headers: {
          Authorization: `Bearer ${cleanedAuthToken}`,
        },
      });

      console.log('Update response:', response.data);
      setSuccessMessageVisible(true);
      // Optionally, you can navigate back or show a success message
    } catch (error) {
      console.log('Update error:', error.response.data);
    }
  };
  function tr(key) {
    return i18n.t(`editProfileScreen.${key}`);
  }

  const updateState = (data) => setState((prevState) => ({ ...prevState, ...data }));

  const {
    name,
    email,
    phone,
    profilePicUrl,
    drivingPicUrl,
    showChangeProfilePicSheet,
  } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar translucent={false} backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {profilePicWithChangeOption()}
          {drivingPicWithChangeOption()}
          {nameInfo()}
          {emailInfo()}
          {phoneNumberInfo()}
        </ScrollView>
       

      </View>
      {updateButton()}
      <Modal
        visible={successMessageVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSuccessMessageVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Profile Updated Successfully!</Text>
            <TouchableOpacity
            style={styles.modalButton}
            onPress={() => setSuccessMessageVisible(false)}
            >
                <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>          
          </View>
        </View>
      </Modal>
      {changeProfilePicOptionsSheet()}
      
    </SafeAreaView>
  );

  function updateButton() {
    return (
      <Button
        btnText={tr('btnText')}
        btnStyle={{ borderRadius: 0.5 }}
        onPress={handleUpdate}
      />
    );
  }

  function changeProfilePicOptionsSheet() {
    return (
      <BottomSheet
        isVisible={showChangeProfilePicSheet}
        onBackdropPress={() => updateState({ showChangeProfilePicSheet: false })}
        containerStyle={{ backgroundColor: 'rgba(0.5, 0.50, 0, 0.50)' }}
      >
        <View style={styles.sheetWrapStyle}>
          <Text style={{ textAlign: 'center', ...Fonts.blackColor18SemiBold }}>
            {tr('sheetTitle')}
          </Text>
          <View style={{ marginTop: Sizes.fixPadding }}>
            {sheetOptionSort({ icon: require('../../assets/images/icons/camera.png'), option: tr('camera') })}
            {sheetOptionSort({ icon: require('../../assets/images/icons/gallery.png'), option: tr('gallery') })}
            {sheetOptionSort({ icon: require('../../assets/images/icons/delete.png'), option: tr('remove') })}
          </View>
        </View>
      </BottomSheet>
    );
  }

  function sheetOptionSort({ icon, option }) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => { updateState({ showChangeProfilePicSheet: false }) }}
        style={{ marginVertical: Sizes.fixPadding }}
      >
        <View style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center' }}>
          <View style={styles.sheetOptionWrapStyle}>
            <Image
              source={icon}
              style={{ width: 18.0, height: 18.0, resizeMode: 'contain' }}
            />
          </View>
          <Text style={{ marginHorizontal: Sizes.fixPadding + 5.0, ...Fonts.blackColor16Medium }}>
            {option}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  

  function phoneNumberInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding + 10.0 }}>
        <Text style={{ marginBottom: Sizes.fixPadding - 8.0, ...Fonts.blackColor16Medium }}>
          {tr('phoneNumberTitle')}
        </Text>
        <TextInput
          value={phone}
          onChangeText={(value) => updateState({ phone: value })}
          style={styles.textFieldStyle}
          selectionColor={Colors.primaryColor}
          keyboardType="phone-pad"
        />
      </View>
    );
  }

  function emailInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding + 10.0 }}>
        <Text style={{ marginBottom: Sizes.fixPadding - 8.0, ...Fonts.blackColor16Medium }}>
          {tr('emailTitle')}
        </Text>
        <TextInput
          value={email}
          onChangeText={(value) => updateState({ email: value })}
          style={styles.textFieldStyle}
          selectionColor={Colors.primaryColor}
          keyboardType="email-address"
        />
      </View>
    );
  }

  function nameInfo() {
    return (
      <View style={{ margin: Sizes.fixPadding * 2.0 }}>
        <Text style={{ marginBottom: Sizes.fixPadding - 8.0, ...Fonts.blackColor16Medium }}>
          {tr('nameTitle')}
        </Text>
        <TextInput
          value={name}
          onChangeText={(value) => updateState({ name: value })}
          style={styles.textFieldStyle}
          selectionColor={Colors.primaryColor}
        />
      </View>
    );
  }

  function profilePicWithChangeOption() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, alignItems: 'center', marginBottom: Sizes.fixPadding }}>
        <Image
          source={{ uri: profilePicUrl }} 
          style={{ width: width / 3.2, height: width / 3.2, borderRadius: (width / 3.2) / 2.0 }}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => updateState({ showChangeProfilePicSheet: true })}
          style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.changeOptionWrapStyle }}
        >
          <AntDesign name="camerao" size={18} color={Colors.whiteColor} />
          <Text style={{
            paddingTop: Sizes.fixPadding - 8.0, lineHeight: 15.0,
            marginLeft: isRtl ? 0.0 : Sizes.fixPadding - 5.0,
            marginRight: isRtl ? Sizes.fixPadding - 5.0 : 0.0,
            ...Fonts.whiteColor12Medium
          }}>
            {tr('change')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  function drivingPicWithChangeOption() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0, alignItems: 'center', marginBottom: Sizes.fixPadding }}>
        <Image
          source= {{ uri: drivingPicUrl }}
          style={{ width: width / 3.2, height: width / 3.2, borderRadius: (width / 3.2) / 2.0 }}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => updateState({ showChangeProfilePicSheet: true })}
          style={{ flexDirection: isRtl ? 'row-reverse' : 'row', ...styles.changeOptionWrapStyle }}
        >
          <AntDesign name="camerao" size={18} color={Colors.whiteColor} />
          <Text style={{
            paddingTop: Sizes.fixPadding - 8.0, lineHeight: 15.0,
            marginLeft: isRtl ? 0.0 : Sizes.fixPadding - 5.0,
            marginRight: isRtl ? Sizes.fixPadding - 5.0 : 0.0,
            ...Fonts.whiteColor12Medium
          }}>
            {tr('change')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  function header() {
    return (
      <Header
        headerText={tr('header')}
        isRtl={isRtl}
        arrowPress={() => navigation.pop()}
      />
    );
  }
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  changeOptionWrapStyle: {
    position: 'absolute',
    bottom: -5.0,
    alignItems: 'center',
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding * 2.0,
    borderColor: Colors.shadowColor,
    borderWidth: 0.50,
    elevation: 2.0,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingVertical: Sizes.fixPadding - 6.0,
  },
  textFieldStyle: {
    ...Fonts.blackColor14Regular,
    backgroundColor: Colors.whiteColor,
    elevation: 2.0,
    borderRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    paddingTop: Sizes.fixPadding,
    paddingBottom: Sizes.fixPadding - 3.0,
  },
  sheetWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderTopLeftRadius: Sizes.fixPadding,
    borderTopRightRadius: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    paddingTop: Sizes.fixPadding + 5.0,
    paddingBottom: Sizes.fixPadding,
  },
  sheetOptionWrapStyle: {
    width: 40.0,
    height: 40.0,
    borderRadius: 20.0,
    backgroundColor: Colors.whiteColor,
    elevation: 2.0,
    borderColor: Colors.shadowColor,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    padding: Sizes.fixPadding * 2,
    alignItems: 'center',
    elevation: 5,
    justifyContent: 'center',
  },
  modalText: {
    ...Fonts.blackColor18SemiBold,
    marginBottom: Sizes.fixPadding * 2,
  },
  modalButton: {
    width: 150,
    height: 40, 
    backgroundColor: Colors.blueColor,
    borderRadius: 10,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  modalButtonText: {
    color: Colors.blackColor,
    fontSize: 16,
    fontWeight: 'bold', 
  },
});