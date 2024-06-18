import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import React, { useContext, useState, useEffect } from 'react';
import CollapsibleToolbar from "react-native-collapsible-toolbar";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { Colors, Sizes, Fonts } from "../../constants/styles";
import { LanguageContext } from "../../languages";
import { Snackbar } from "react-native-paper";

import {
  Button,
  showRating,
} from "../../components/usableComponent/usableComponent";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const { height, width } = Dimensions.get("window");




const CarDetailScreen = ({ navigation }) => {
  const { i18n, language } = useContext(LanguageContext);
  const insets = useSafeAreaInsets();
  const isRtl = language == "ar";
  
  function tr(key) {
    return i18n.t(`carDetailScreen.${key}`);
  }
  
  const route = useRoute();
  const { itemId } = route.params;
  
  const [inFavorite, setInFavorite] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [readMore, setReadMore] = useState(false);
  const [car, setCar] = useState(null); // State for storing car data
  const [carMoreImages, setCarMoreImages] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://zzz.center/public/api/cars/${itemId}`);
       setCar(response.data.data)
       const images = response.data.data.sub_images.map((image, index) => ({
        id: index.toString(),
        image: { uri: image.photo_car_url },
      }));
      setCarMoreImages(images);
       console.log(response.data.data)
      } catch (error) {
        console.log(error.response.data);
      }
    };
    fetchData();
  }, [itemId]); 
  
  const featuresList = [
    {
      id: "1",
      featureIcon: require("../../assets/images/icons/ac.png"),
      feature: "Air conditioning",
    },
    {
      id: "2",
      featureIcon: require("../../assets/images/icons/music.png"),
      feature: "Music",
    },
    {
      id: "3",
      featureIcon: require("../../assets/images/icons/person.png"),
      feature: `${car && car.seats ? car.seats : 'N/A'} Seater`,
    },
    {
      id: "4",
      featureIcon: require("../../assets/images/icons/color.png"),
      feature: `${car && car.year ? car.year : 'N/A'} Year`,

    },
    {
      id: "5",
      featureIcon: require("../../assets/images/icons/doors.png"),
      feature: `${car && car.doors ? car.doors : 'N/A'} doors`,

    },
    {
      id: "6",
      featureIcon: require("../../assets/images/icons/bags.png"),
      feature: `${car && car.bags ? car.bags : 'N/A'} bags`,

    },
   
  ];
  
  // const carMoreImages = [
  //   {
  //     id: "1",
  //     image: require("../../assets/images/carParts/carPart1.png"),
  //   },
  //   {
  //     id: "2",
  //     image: require("../../assets/images/carParts/carPart2.png"),
  //   },
  //   {
  //     id: "3",
  //     image: require("../../assets/images/carParts/carPart3.png"),
  //   },
  //   {
  //     id: "4",
  //     image: require("../../assets/images/carParts/carPart4.png"),
  //   },
    
  // ];

  return (
    <>
      <CollapsibleToolbar
        renderContent={pageContent}
        renderNavBar={header}
        renderToolBar={carImage}
        collapsedNavBarBackgroundColor={Colors.primaryColor}
        translucentStatusBar={false}
        toolBarHeight={height / 3.0}
        showsVerticalScrollIndicator={false}
      />

      {bookNowButton()}
      {snackBar()}
    </>
  );

  function bookNowButton() {
    return (
      <Button
        btnText={tr("btnText")}
        btnStyle={{ borderRadius: 0.5 }}
        onPress={() => {
          navigation.push("PickupAndReturnDetail");
        }}
      />
    );
  }

  function snackBar() {
    return (
      <Snackbar
        visible={showSnackBar}
        onDismiss={() => setShowSnackBar(false)}
        style={{ elevation: 0.0, backgroundColor: Colors.lightBlackColor }}
      >
        <Text style={{ ...Fonts.whiteColor12Regular }}>
          {inFavorite ? tr("addInFav") : tr("removeFromFav")}
        </Text>
      </Snackbar>
    );
  }

  function pageContent() {
    return (
      <View style={{ flex: 1 }}>
        {carInfo()}
        {renterInfo()}
        {specialityInfo()}
        {featuresInfo()}
        {moreImages()}
      </View>
    );
  }

  function moreImages() {
    return (
      <View >
        <Text
          style={{
            paddingTop: Sizes.fixPadding * 3.0,
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginBottom: Sizes.fixPadding,
            ...Fonts.blackColor16SemiBold,
          }}
        >
          {tr("mareImagesTitle")}
        </Text>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding,
            flexDirection: isRtl ? "row-reverse" : "row",
            flexWrap: "wrap",
          }}
        >
          {carMoreImages.map((item) => (
            <Image
              key={`${item.id}`}
              source={item.image}
              style={styles.carPartImagesStyle}
            />
          ))}
        </View>
      </View>
    );
  }

  function descriptionInfo() {
    return (
      <View
        style={{
          marginVertical: Sizes.fixPadding + 5.0,
          marginHorizontal: Sizes.fixPadding * 2.0,
        }}
      >
        <Text
          style={{
            marginBottom: Sizes.fixPadding - 5.0,
            ...Fonts.blackColor16SemiBold,
          }}
        >
          {tr("descriptionTitle")}
        </Text>
        <Text
          numberOfLines={readMore ? 0 : 4}
          style={{ ...Fonts.grayColor14Medium }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ipsum
          praesent egestas commodo enim, porta justo id id vulputate. Ut
          ultrices et neque, faucibus nunc aliquam sagittis.
        </Text>
        <Text
          onPress={() => setReadMore(!readMore)}
          style={{
            textAlign: isRtl ? "left" : "right",
            ...Fonts.primaryColor14Medium,
          }}
        >
          {readMore ? tr("showLess") : tr("readMore")}
        </Text>
      </View>
    );
  }

  function featuresInfo() {
    return (
      <View>
        <Text
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginBottom: Sizes.fixPadding - 5.0,
            ...Fonts.blackColor16SemiBold,
          }}
        >
          {tr("featuresTitle")}
        </Text>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding,
            flexDirection: isRtl ? "row-reverse" : "row",
            flexWrap: "wrap",
          }}
        >
          {featuresList.map((item) => (
            <View
              key={`${item.id}`}
              style={{
                flexDirection: isRtl ? "row-reverse" : "row",
                ...styles.featureWrapStyle,
              }}
            >
              <Image
                source={item.featureIcon}
                style={{ width: 16.0, height: 16.0, resizeMode: "contain" }}
              />
              <Text
                numberOfLines={1}
                style={{
                  textAlign: isRtl ? "right" : "left",
                  flex: 1,
                  marginHorizontal: Sizes.fixPadding - 5.0,
                  ...Fonts.blackColor14Medium,
                }}
              >
                {item.feature}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  function specialityInfo() {
    return (
      <View style={{ marginVertical: Sizes.fixPadding * 2.0 }}>
        <Text
          style={{
            marginHorizontal: Sizes.fixPadding * 2.0,
            marginBottom: Sizes.fixPadding - 5.0,
            ...Fonts.blackColor16SemiBold,
          }}
        >
          {tr("specsTitle")}
        </Text>
        <View
          style={{
            flexDirection: isRtl ? "row-reverse" : "row",
            marginHorizontal: Sizes.fixPadding,
            justifyContent: "space-between",
          }}
        >
       {specialitySort({ title: tr("steering"), value: car && car.steering ? car.steering : 'N/A' })}
{specialitySort({ title: tr("fueltype"), value: car && car.fuel_type ? car.fuel_type : 'N/A' })}
{specialitySort({ title: tr("fuelfull"), value: car && car.fuel_full ? car.fuel_full : 'N/A' })}

        </View>
      </View>
    );
  }

  function specialitySort({ title, value }) {
    return (
      <View style={styles.specialityWrapStyle}>
        <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
          {title}
        </Text>
        <Text
          style={{
            paddingTop: Sizes.fixPadding - 8.0,
            lineHeight: 19.0,
            ...Fonts.blackColor16Medium,
          }}
        >
          {value}
        </Text>
      </View>
    );
  }
  function renterInfo() {
    return (
      <View style={{ marginHorizontal: Sizes.fixPadding * 2.0 }}>
        <Text
          style={{
            marginBottom: Sizes.fixPadding - 5.0,
            ...Fonts.blackColor16SemiBold,
          }}
        >
          {tr("companyTitle")}
        </Text>
        <View
          style={{
            flexDirection: isRtl ? "row-reverse" : "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {car && car.owneruser ? (
            <View
              style={{
                flex: 1,
                flexDirection: isRtl ? "row-reverse" : "row",
                alignItems: "center",
              }}
            >
              <Image
                source={{
                  uri: car.owneruser.photo_user || 'default_photo_uri', // Provide a default photo uri
                }}
                style={{ width: 40.0, height: 40.0, borderRadius: 20.0 }}
              />
              <Text
                style={{
                  textAlign: isRtl ? "right" : "left",
                  flex: 1,
                  marginHorizontal: Sizes.fixPadding,
                  ...Fonts.blackColor14Medium,
                }}
              >
                {car.owneruser.name } Comapny
              </Text>
            </View>
          ) : (
            <Text>Loading...</Text> // Show loading indicator or provide fallback
          )}
          <View
            style={{
              flexDirection: isRtl ? "row-reverse" : "row",
              alignItems: "center",
            }}
          >
            <AntDesign
              name="message1"
              size={18}
              color={Colors.blackColor}
              style={{
                marginRight: isRtl ? 0.0 : Sizes.fixPadding - 3.0,
                marginLeft: isRtl ? Sizes.fixPadding - 3.0 : 0.0,
              }}
            />
            <AntDesign
              name="phone"
              size={18}
              color={Colors.blackColor}
              style={{
                transform: [{ rotate: "90deg" }],
                marginBottom: Sizes.fixPadding - 6.0,
              }}
            />
          </View>
        </View>
      </View>
    );
  }
  
  function carInfo() {
    return (
      <View
        style={{
          flexDirection: isRtl ? "row-reverse" : "row",
          ...styles.carInfoWrapStyle,
        }}
      >
        {car ? (
          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={1}
              style={{
                paddingTop: Sizes.fixPadding - 7.0,
                lineHeight: 21.0,
                ...Fonts.blackColor18SemiBold,
              }}
            >
              {car.make} - {car.model}
            </Text>
            <View style={{ flexDirection: isRtl ? "row-reverse" : "row" }}>
              <Text>Car Number: {car.car_number}</Text>
            </View>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
        <Text>
        <Text style={{ ...Fonts.primaryColor16SemiBold }}>
          {car && car.prices && car.prices[0] && car.prices[0].price_after_discount}
          <Text style={{ ...Fonts.blackColor16Medium }}> ₪/{tr("day")}</Text>
        </Text> 
        </Text>
      </View>
    );
  }
  
  
  function carImage() {
    return (
      <View style={styles.carImageWrapStyle}>
        {car && car.sub_images && car.sub_images.length > 0 && car.sub_images[0].photo_car_url ? (
          <Image
            source={{ uri: car.sub_images[0].photo_car_url }}
            style={{ height: height / 4.0, width: "85%", alignSelf: "center" }}
            resizeMode="contain"
          />
        ) : (
          <Text>No Image Available</Text>
        )}
      </View>
    );
  }
  

  function header() {
    return (
      <View
        style={{
          flexDirection: isRtl ? "row-reverse" : "row",
          ...styles.headerWrapStyle,
        }}
      >
        <MaterialIcons
          name={isRtl ? "arrow-forward" : "arrow-back"}
          color={Colors.blackColor}
          size={22}
          onPress={() => navigation.pop()}
        />
        <View
          style={{
            flexDirection: isRtl ? "row-reverse" : "row",
            alignItems: "center",
          }}
        >
          <MaterialIcons
            name={inFavorite ? "favorite" : "favorite-outline"}
            color={Colors.blackColor}
            size={22}
            style={{
              marginRight: isRtl ? 0.0 : Sizes.fixPadding - 3.0,
              marginLeft: isRtl ? Sizes.fixPadding - 3.0 : 0.0,
            }}
            onPress={() => {
              setInFavorite(!inFavorite);
              setShowSnackBar(true);
            }}
          />
          <MaterialIcons name="share" color={Colors.blackColor} size={22} />
        </View>
      </View>
    );
  }
};

export default CarDetailScreen;

const styles = StyleSheet.create({
  headerWrapStyle: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Sizes.fixPadding + 5.0,
    paddingHorizontal: Sizes.fixPadding * 2.0,
  },
  carImageWrapStyle: {
    height: height / 3.0,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  carInfoWrapStyle: {
    justifyContent: "space-between",
    marginTop: Sizes.fixPadding + 5.0,
    marginBottom: Sizes.fixPadding * 2.0,
    marginHorizontal: Sizes.fixPadding * 2.0,
  },
  specialityWrapStyle: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
    elevation: 2.0,
    borderRadius: Sizes.fixPadding,
    borderColor: Colors.shadowColor,
    borderWidth: 1.0,
    padding: Sizes.fixPadding,
    alignItems: "center",
    marginHorizontal: Sizes.fixPadding,
  },
  featureWrapStyle: {
    alignItems: "center",
    marginHorizontal: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding - 5.0,
    width: width / 2.0 - 30.0,
  },
  carPartImagesStyle: {
    width: width / 2.0 - 30.0,
    height: width / 4.0,
    marginHorizontal: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2.0,
    borderRadius: Sizes.fixPadding,
    resizeMode: "stretch",
  },
});
