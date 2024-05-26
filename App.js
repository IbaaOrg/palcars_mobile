import React from 'react'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomTabBar from './components/bottomTabBar/bottomTabBar';
import LoadingScreen from './components/loading/loadingScreen';
import { LanguageProvider } from './languages';
import CarDetailScreen from './screens/carDetail/carDetailScreen';
import PickupAndReturnDetailScreen from './screens/pickupAndReturnDetail/pickupAndReturnDetailScreen';
import PickupAndReturnLocationScreen from './screens/pickupAndReturnLocation/pickupAndReturnLocationScreen';
import PickupAndReturnDateAndTimeScreen from './screens/pickupAndReturnDateAndTime/pickupAndReturnDateAndTimeScreen';
import PersonalInformationScreen from './screens/personalInformation/personalInformationScreen';
import UploadDocumentScreen from './screens/uploadDocument/uploadDocumentScreen';
import SummaryScreen from './screens/summary/summaryScreen';
import SelectPaymentMethodScreen from './screens/selectPaymentMethod/selectPaymentMethodScreen';
import PaymentSuccessScreen from './screens/paymentSuccess/paymentSuccessScreen';
import NotificationScreen from './screens/notification/notificationScreen';
import EditProfileScreen from './screens/editProfile/editProfileScreen';
import BookingsScreen from './screens/bookings/bookingsScreen';
import SettingsScreen from './screens/settings/settingsScreen';
import LanguagesScreen from './screens/languages/languagesScreen';
import NotificationSettingsScreen from './screens/notificationSettings/notificationSettingsScreen';
import TermsAndConditionsScreen from './screens/termsAndCondition/termsAndConditionScreen';
import SupportScreen from './screens/support/supportScreen';
import SplashScreen from './screens/splashScreen';
import OnboardingScreen from './screens/onboarding/onboardingScreen';
import SigninScreen from './screens/auth/signinScreen';
import SignupScreen from './screens/auth/signupScreen';
import VerificationScreen from './screens/auth/verificationScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            ...TransitionPresets.SlideFromRightIOS,
          }}
        >
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Splash" component={SplashScreen} options={{ ...TransitionPresets.DefaultTransition }} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Signin" component={SigninScreen} options={{ ...TransitionPresets.DefaultTransition }} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Verification" component={VerificationScreen} />
          <Stack.Screen name="BottomTabBar" component={BottomTabBar} options={{ ...TransitionPresets.DefaultTransition }} />
          <Stack.Screen name="CarDetail" component={CarDetailScreen} />
          <Stack.Screen name="PickupAndReturnDetail" component={PickupAndReturnDetailScreen} />
          <Stack.Screen name="PickupAndReturnLocation" component={PickupAndReturnLocationScreen} />
          <Stack.Screen name="PickupAndReturnDateAndTime" component={PickupAndReturnDateAndTimeScreen} />
          <Stack.Screen name="PersonalInformation" component={PersonalInformationScreen} />
          <Stack.Screen name="UploadDocument" component={UploadDocumentScreen} />
          <Stack.Screen name="Summary" component={SummaryScreen} />
          <Stack.Screen name="SelectPaymentMethod" component={SelectPaymentMethodScreen} />
          <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Bookings" component={BookingsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Languages" component={LanguagesScreen} />
          <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
          <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
          <Stack.Screen name="Support" component={SupportScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LanguageProvider>
  )
}

export default App