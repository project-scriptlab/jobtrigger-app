//import liraries
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import Profile from '../Components/Profile';
import DrawerNav from './Drawer';
// import AdmissionList from '../Screen/Admission/AdmissionList';



const Stack = createStackNavigator();
// create a component
const AppStack = ({route}) => {
    // const { login_status } = useSelector(state => state.User)
    const {changeDarkMode} = route?.params;
    return (
        <Stack.Navigator
            initialRouteName='DrawerNav'
            screenOptions={{
                headerShown: false,
                // gestureEnabled: true,
                // gestureDirection: 'horizontal',
                // ...TransitionPresets.ModalTransition,
            }}
        >
            <Stack.Screen name="DrawerNav" component={DrawerNav} initialParams={{changeDarkMode}} />
            {/* <Stack.Screen name="AdmissionList" component={AdmissionList} /> */}
           
        </Stack.Navigator>
    );
};

export default AppStack;
