//import liraries
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, Alert, PermissionsAndroid, Linking } from 'react-native';
import SplashScreen from './App/Screen/Auth/SplashScreen';
// import AuthStack from './App/Navigation/AuthStack';
import NavigationService from './App/Services/Navigation';
import AppStack from './App/Navigation/AppStack';
// import { Theme } from 'react-native-basic-elements';
// import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UseApi from './App/ApiConf';
import { screenHeight } from './App/Constants/PixelRatio';
import { LightTheme, CustomDarkTheme } from './App/Components/ThemeContext';
import DrawerNav from './App/Navigation/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import { setAppSetting, setuser } from './App/Redux/reducer/User';
// import Notification from './App/Screen/Notification';

const Stack = createStackNavigator();
// create a component
const App = () => {
  // const { login_status,userData } = useSelector(state => state.User)
  // const colorScheme = useColorScheme();
  // const scheme = useColorScheme();
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const { appSetting, userData } = useSelector(state => state.User);
  const { Request } = UseApi();
  // const [darkMode, setDarkMode] = useState(false);
  const dispatch = useDispatch();

  // const theme = scheme === 'dark' ? CustomDarkTheme : LightTheme;
  const theme = appSetting.darkMode ? CustomDarkTheme : LightTheme;
  // const [isDark, setIsDark] = useState(colorScheme == 'dark');

  // const styles = colorScheme === 'dark' ? darkStyles : lightStyles;

  useEffect(() => {
    // setInitialDarkMode();
    requestUserPermission();
    getDeviceToken();
    setTimeout(() => {
      setShowSplashScreen(false);
    }, 3000);
    createNotificationListeners();
    getLocalData();
    // getUrl();
  }, [])

  // const setInitialDarkMode = async () => {
  //   let mode = await AsyncStorage.getItem('darkMode');
  //   if (mode) {
  //     // setDarkMode(JSON.parse(mode));
  //       dispatch(setAppSetting({...appSetting,darkMode:mode}));
  //   }
  // }

  // const changeDarkMode = async (mode) => {
  //   setDarkMode(mode);
  //   await AsyncStorage.setItem('darkMode', JSON.stringify(mode));
  // }

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     console.log('remotemessage....', remoteMessage);
  //     Alert.alert(remoteMessage.notification.body);
  //   })

  //   return unsubscribe;
  // }, [])

  const requestUserPermission = async () => {
    // const authStatus = await messaging().requestPermission();
    // const enabled =
    //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    // if (enabled) {
    //   console.log('Authorization status:', authStatus);
    // } else {
    //   Alert.alert(
    //     'Notification Permission',
    //     'Please enable notifications in the settings to receive updates.',
    //   );
    // }
    let status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    console.log('status............', status);
  }
  const createNotificationListeners = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );
      // NavigationService.navigate('Notification');
      NavigationService.navigate('JobDetails', { backPage: 'Home', id: remoteMessage?.data?.post_id });
    });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
          // NavigationService.navigate('Notification')
          // NavigationService.navigate('JobDetails', { backPage: 'Home', id: remoteMessage?.data?.post_id });
          // Linking.openURL(`https://www.jobtrigger.in/jobdetails/${remoteMessage?.data?.post_id}`);
          console.log('remoteMessage?.data?.slug...',remoteMessage?.data?.slug);
          Linking.openURL(`https://www.jobtrigger.in/${remoteMessage?.data?.slug}`);
          // Linking.openURL(`https://www.jobtrigger.in/app/jobdetails/75`);
        }
      });
    messaging().onMessage(async remoteMessage => {
      console.log('remotemessage....', remoteMessage);
      // if (remoteMessage?.data?.post_id) {
      //   // NavigationService.navigate('Notification');
      //   NavigationService.navigate('JobDetails', { backPage: 'Home', id: remoteMessage?.data?.post_id });
      // }
      // Alert.alert(
      //   remoteMessage.notification.title,
      //   remoteMessage.notification.body,
      // );
    });
  }

  const getDeviceToken = async () => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (fcmToken) {
      console.log('available fcmToken...', fcmToken);
      // sendFcmToken(fcmToken);
    } else {
      const token = await messaging().getToken();
      console.log('Generated fcmToken......', token);
      await AsyncStorage.setItem('fcmToken', token);
      sendFcmToken(token);
    }
  };

  const sendFcmToken = async (fcmToken) => {
    let data;
    try {
      data = await Request('fcm-token', 'POST', { token: fcmToken });
    } catch (err) {
      console.log('err...', err);
    }
    console.log('data...', data);
    if (data?.status) {
      console.log('successfully send fcm token..')
    }
  }

  // const setTokenOnFirebase = async (deviceToken) => {
  //   firestore().collection('users').doc('1').set({
  //     user_id: 1,
  //     device_token: deviceToken,
  //   });
  // }

  const getLocalData = async ()=>{
     let settingData = await AsyncStorage.getItem('appSetting');
     let userdata = await AsyncStorage.getItem('userData');
     if(settingData){
         dispatch(setAppSetting(JSON.parse(settingData)));
     }
     if(userdata){
       dispatch(setuser(JSON.parse(userdata)));
     }
  }

  const linking = {
    // prefixes: [Linking.canOpenURL('/'),'https://www.jobtrigger.in/app'],
    prefixes: ['https://www.jobtrigger.in'],
    // prefixes: ['jobtrigger://','https://www.jobtrigger.in/app'],
    config: {
      screens: {
        // AppStack: {
        //   screens: {

        //   }
        // },
        DrawerNav: {
          screens: {
            Home: '',
            Notification: 'notification',
            JobDetails: ':slug',
            // JobDetails: 'jobdetails/:id',
          }
        }

        // Profile: 'profile/:id',
      }
    }
  };


  return (
    <View
      style={{
        flex: 1
      }}
    >
      <NavigationContainer
        theme={theme}
        ref={r => NavigationService.setTopLevelNavigator(r)}
        linking={linking}
        fallback={<Text style={{ textAlign: 'center', marginTop: screenHeight / 3 }}>Loading...</Text>}
      >
        <Stack.Navigator
          // initialRouteName='AuthStack'
          screenOptions={{
            headerShown: false,
            // gestureEnabled: true,
            // gestureDirection: 'horizontal',
          }}
        >

         
          {showSplashScreen && <Stack.Screen name="SplashScreen" component={SplashScreen} />}
          {/* <Stack.Screen name="AppStack" component={AppStack} initialParams={{changeDarkMode}}/> */}
          <Stack.Screen name="DrawerNav" component={DrawerNav}/>
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default App;
