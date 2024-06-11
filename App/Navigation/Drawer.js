import React from 'react';
// import { Dimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Dashboard from '../Screen/Home/Dashboard';
import { Colors } from '../Constants/Colors';
import { moderateScale } from '../Constants/PixelRatio';
import DrawerContent from '../Components/Drawer';
import JobListPage from '../Screen/JobListPage';
import JobSearch from '../Screen/JobSearch';
import JobDetails from '../Screen/JobDetails';
import OtherJobList from '../Screen/OtherJobList';
import OtherJobDetails from '../Screen/OtherJobDetails';
import JobUpdate from '../Screen/JobUpdate';
import Notification from '../Screen/Notification';
import RelatedJobDetails from '../Screen/RelatedJobDetails';
import Agencies from '../Screen/Agencies';
import Profile from '../Screen/Auth/Profile';
// import Login from '../Screen/Auth/Profile';

// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { NavigationContainer } from '@react-navigation/native';


const Drawer = createDrawerNavigator();
// const NativeStack = createNativeStackNavigator();


// const DrawerStack = () => {
//     return (
//         <NativeStack.Navigator
//             screenOptions={{
//                 headerShown: false
//             }}
//         >
//             <NativeStack.Screen name='AdmissionList' component={AdmissionList} />
//             <NativeStack.Screen name='StudyMeterial' component={StudyMeterial} />
//         </NativeStack.Navigator>
//     )
// }

const DrawerNav = () => {
    // const {changeDarkMode,darkMode} = route?.params;

    return (
        <Drawer.Navigator
            // initialRouteName="Home"

            screenOptions={{
                headerShown: false,
                drawerActiveTintColor: Colors.tangerine,
                drawerInactiveTintColor: "#ffffff",
                unmountOnBlur: true,
                // drawerType:'slide'
            }}

            drawerContent={props => <DrawerContent {...props}/>}
            drawerStyle={{ width: moderateScale(280) }}
            drawerPosition="left"
        >
            <Drawer.Screen name="Home" component={Dashboard} />
            <Drawer.Screen options={{swipeEnabled:false}} name="Profile" component={Profile} />
            <Drawer.Screen options={{swipeEnabled:false}} name="JobListPage" component={JobListPage} />
            <Drawer.Screen options={{swipeEnabled:false}} name="OtherJobList" component={OtherJobList} />
            <Drawer.Screen options={{swipeEnabled:false}} name="JobUpdate" component={JobUpdate} />
            <Drawer.Screen options={{swipeEnabled:false}} name="OtherJobDetails" component={OtherJobDetails} />
            <Drawer.Screen options={{swipeEnabled:false}} name="RelatedJobDetails" component={RelatedJobDetails} />
            <Drawer.Screen options={{swipeEnabled:false}} name="JobSearch" component={JobSearch} />
            <Drawer.Screen options={{swipeEnabled:false}} name="JobDetails" component={JobDetails} />
            <Drawer.Screen options={{swipeEnabled:false}} name="Notification" component={Notification} />
            <Drawer.Screen options={{swipeEnabled:false}} name="Agencies" component={Agencies} />
        </Drawer.Navigator>
    )
}

export default DrawerNav;