

//import liraries
import React, { Component, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Linking, Share, Switch } from 'react-native';

import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
// import { Colors, Images } from '../Styles/Theme';
import { moderateScale, screenHeight, textSize } from '../Constants/PixelRatio';
import NavigationService from '../Services/Navigation';
import { FONTS } from '../Constants/Fonts';
// import { logout, setPaymentList, setStudyMeterials } from '../Redux/reducer/User';
// import { useDispatch, useSelector } from 'react-redux';
// import AuthService from '../Services/Auth';
import { Images } from '../Constants/Images';
import { Colors } from '../Constants/Colors';
import { useTheme } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrPageInd } from '../Redux/reducer/User';

const shareLink = async () => {
    try {
        const result = await Share.share({
            message: 'Check out this link: https://www.jobtrigger.in/',
            url: 'https://www.jobtrigger.in/', // URL can be included in the message itself
            title: 'Share via'
        });

        if (result.action === Share.sharedAction) {
            if (result.activityType) {
                // Shared with activity type of result.activityType
                console.log('Shared with activity type:', result.activityType);
            } else {
                // Shared
                console.log('Link shared successfully');
            }
        } else if (result.action === Share.dismissedAction) {
            // Dismissed
            console.log('Share dismissed');
        }
    } catch (error) {
        console.error('Error sharing link:', error.message);
    }
};

const openGmail = () => {
    let email = 'info@jobtrigger.in';
    let subject = 'Subject';
    let body = '';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch(err => console.log('An error occoured!'));
}
const topItems = [

    {
        name: 'Job List', icon: Images.list, style: {},
        onPress: () => NavigationService.navigate('JobListPage', { type: '', title: 'Jobs List', id: null, typeField: null })
    },
    {
        name: 'Upcoming Jobs', icon: Images.upcomming, style: {},
        onPress: () => NavigationService.navigate('JobListPage', { type: '', title: 'Upcoming Jobs', typeField: null })
    },
    {
        name: 'Job Update', icon: Images.update, style: { height: 22, width: 22, opacity: 0.7 },
        onPress: () => NavigationService.navigate('JobUpdate')
    },
    {
        name: 'Admit Card', icon: Images.admit, style: {},
        onPress: () => NavigationService.navigate('OtherJobList', { title: 'Admit Card', id: '611' })
    },
    {
        name: 'Result', icon: Images.result, style: {},
        onPress: () => NavigationService.navigate('OtherJobList', { title: 'Result', id: '612' })
    },
    {
        name: 'Jobs By Category', icon: Images.category, style: {},
        onPress: () => NavigationService.navigate('JobListPage', { type: '5', title: 'Jobs By Category', typeField: 'search_by_department' })
    },
    {
        name: 'Jobs By Location', icon: Images.locationDrawer, style: { height: 19, width: 19 },
        onPress: () => NavigationService.navigate('JobListPage', { type: '1', title: 'Jobs By Location', typeField: 'search_by_state' })
    },
    {
        name: 'Jobs By Qualification', icon: Images.education, style: { height: 19, width: 19 },
        onPress: () => NavigationService.navigate('JobListPage', { type: '4', title: 'Jobs By Qualification', typeField: 'search_by_qualification' })
    },
    {
        name: 'Jobs By Recruiter', icon: Images.recruiter, style: { height: 21, width: 21 },
        onPress: () => NavigationService.navigate('JobListPage', { type: '2', title: 'Jobs By Recruiter', typeField: 'search_by_recruiter' })
    },
    {
        name: 'Recruitment Agencies', icon: Images.recruiter, style: { height: 21, width: 21 },
        onPress: () => NavigationService.navigate('Agencies')
    },
]

const otherMenuItems = [
    // {
    //     name: 'Sign In', icon: Images.user, style: { marginTop: 5 },
    //     onPress: () => NavigationService.navigate('Profile')
    // },
    {
        name: 'Share App', icon: Images.share, style: { marginTop: 5 },
        onPress: shareLink
    },
    {
        name: 'Rate Us', icon: Images.star, style: { height: 22, width: 22 },
        onPress: () => null
    },
    {
        name: 'Web View', icon: Images.web, style: { height: 18, width: 18 },
        onPress: () => Linking.openURL('https://www.jobtrigger.in')
    },
    // {
    //     name: 'Terms and Conditions', icon: Images.termsCondition, style: { height: 17, width: 17 },
    //     onPress: () => Linking.openURL('https://www.jobtrigger.in/terms-and-condition')
    // },
    {
        name: 'Privacy Policy', icon: Images.privacy, style: { height: 22, width: 22 },
        onPress: () => Linking.openURL('https://www.jobtrigger.in/privacy-policy')
    },

    {
        name: 'Contact Us', icon: Images.email, style: { height: 19, width: 19 },
        onPress: openGmail
    },
    // {
    //     name: 'About Us', icon: Images.aboutUs, style: { height: 22, width: 22 },
    //     onPress: () => Linking.openURL('https://www.jobtrigger.in/about-us')
    // },
]

const DrawerContent = (props) => {
    // const [DarkMode, setDarkMode] = useState(darkMode);
    const { colors } = useTheme();
    const [menusItems, setMenusItems] = useState(topItems);
    const { appSetting, userData, } = useSelector(state => state.User);
    const dispatch = useDispatch()

 useEffect(()=>{
      console.log('props.state..',props.state);
      dispatch(setCurrPageInd(props.state.index));
 },[props.state]);

    useEffect(() => {
        setMenusItems([
            {
                name: 'My Saved Jobs', icon: Images.bookmark2, style: {},
                onPress: () => {
                    if (userData) {
                        NavigationService.navigate('JobListPage', { type: '', title: 'My Jobs', id: null, typeField: null, bookmarkList: true, backPage: 'Profile' });
                    } else {
                        Alert.alert('', 'Do you want to Sign in to see saved jobs?', [
                            {
                                text: 'No',
                                onPress: () => console.log('No Pressed'),
                                style: 'No',
                            },
                            { text: 'Yes', onPress:()=>NavigationService.navigate('Profile')},
                        ]);
                    }
                }
            },
            ...topItems
        ]);

    }, [userData]);

    // const logOut = async () => {
    //     dispatch(logout());
    //     AuthService.setToken(null);
    // }



    // const onConfirmLogout = () => {
    //     Alert.alert(
    //         "Are you Sure?",
    //         "You want to Logout",
    //         [
    //             {
    //                 text: "No",
    //                 onPress: () => console.log("Cancel Pressed"),
    //                 style: "cancel"
    //             },
    //             { text: "Yes", onPress: () => logOut() }
    //         ]
    //     );
    // }

    // const shareLink = async () => {
    //     try {
    //         const result = await Share.share({
    //             message: 'Check out this link: https://www.jobtrigger.in/',
    //             url: 'https://www.jobtrigger.in/', // URL can be included in the message itself
    //             title: 'Share via'
    //         });

    //         if (result.action === Share.sharedAction) {
    //             if (result.activityType) {
    //                 // Shared with activity type of result.activityType
    //                 console.log('Shared with activity type:', result.activityType);
    //             } else {
    //                 // Shared
    //                 console.log('Link shared successfully');
    //             }
    //         } else if (result.action === Share.dismissedAction) {
    //             // Dismissed
    //             console.log('Share dismissed');
    //         }
    //     } catch (error) {
    //         console.error('Error sharing link:', error.message);
    //     }
    // };


    return (
        // <DrawerContentScrollView {...props}>
        //     <Pressable style={{ flexDirection: 'row', marginBottom: 20 }}>
        //         <Image
        //             style={styles.profileImage}
        //             source={Images.profileImage}
        //         />
        //         <View style={{ justifyContent: 'center', marginLeft: 15 }}>
        //             <Text style={styles.title}>Rahul Sharma</Text>
        //             <Text>NYCTA-HO-22R-0001</Text>
        //         </View>
        //     </Pressable>
        //     {/* {console.log('state.routes.....')} */}
        //     <DrawerItem
        //         icon={() => (
        //             <Image
        //                 source={Images.dashboard}
        //                 style={{
        //                     height: 20,
        //                     width: 20,
        //                     tintColor: Colors.drawerIconColor
        //                 }}
        //             />
        //         )}
        //         // focused={true}
        //         // activeTintColor={Colors.tangerine}
        //         label={({color})=>(<Text style={{...styles.name,color:color}}>Dashboard</Text>)}
        //     />
        // </DrawerContentScrollView>


        <View style={{ ...styles.container, backgroundColor: colors.background }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, marginBottom: 30, paddingTop: 10 }}>
                <Pressable style={{ ...styles.profileWrapper, backgroundColor: colors.background }}>
                    <Image
                        source={Images.logo}
                        style={{ height: 40, width: '100%', resizeMode: 'contain', backgroundColor: colors.background, tintColor: colors.text }}
                    />
                    {/* <View style={{ justifyContent: 'center', marginLeft: 15 }}>
                        <Text style={styles.title}>Edward Thomas</Text>
                    </View> */}
                </Pressable>
                {/* <View style={{ ...styles.row, paddingLeft: moderateScale(20) }}>
                    <View style={styles.icon}>
                        <View style={{}}>
                            <Image
                                source={Images.darkMode}
                                style={{
                                    height: 22,
                                    width: 22,
                                    resizeMode: 'stretch',
                                    tintColor: colors.skyBlue,
                                }}
                            />
                        </View>
                        <Text style={{
                            // ...styles.name,
                            fontSize: textSize(12),
                            fontWeight: '400',
                            color: colors.text,
                            marginLeft: 15
                        }}>
                            Dark Mode
                        </Text>
                    </View>
                    <Switch
                        style={{}}
                        value={DarkMode}
                        onValueChange={() => {
                            setDarkMode(!DarkMode);
                            changeDarkMode(!DarkMode);
                        }}
                        thumbColor={darkMode ? "#ffffff" : "#f4f3f4"}
                        // trackColor={{ false: "#767577", true: "#81b0ff" }}
                        trackColor={{ false: "#767577", true: colors.skyBlue }}
                    />
                </View> */}
                {/* <View style={{ borderWidth: 0.2, borderColor: Colors.lightBlck, opacity: 0.4, marginBottom: 10, marginTop: 10 }} /> */}

                <View style={{ paddingLeft: moderateScale(20), paddingVertical: 10 }}>
                    {menusItems.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={item.onPress}
                            >
                                <View style={[styles.row]}>
                                    <View style={styles.icon}>
                                        <View style={{ flex: 1 }}>
                                            <Image
                                                source={item.icon}
                                                style={{
                                                    height: 18,
                                                    width: 18,
                                                    resizeMode: 'stretch',
                                                    tintColor: colors.skyBlue,
                                                    ...item.style
                                                }}
                                            />
                                        </View>

                                        <Text style={{
                                            ...styles.name,
                                            color: colors.text
                                        }}>
                                            {item.name}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>

                <View style={{ borderWidth: 0.2, borderColor: Colors.lightBlck, opacity: 0.4, marginBottom: 10, marginTop: 10 }} />

                <View style={{ paddingLeft: moderateScale(20) }}>
                    {otherMenuItems.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={item.onPress}
                            >
                                <View style={[styles.row]}>
                                    <View style={styles.icon}>
                                        <View style={{ flex: 1 }}>
                                            <Image
                                                source={item.icon}
                                                style={{
                                                    height: 18,
                                                    width: 18,
                                                    resizeMode: 'stretch',
                                                    tintColor: colors.skyBlue,
                                                    ...item.style
                                                }}
                                            />
                                        </View>

                                        <Text style={{
                                            ...styles.name,
                                            color: colors.text
                                        }}>
                                            {item.name}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>


                {/* <View style={{borderTopWidth:0.5,borderTopColor:'#a0a0a0',marginTop:30,marginLeft:-moderateScale(20),paddingLeft:moderateScale(20)}}>
                        <Text style={{ marginTop: 10, flex: 1 }}>Version 3.0</Text>
                        <View style={{ flex: 6, backgroundColor: Colors.white2 }}></View>
                    </View> */}

            </ScrollView>

        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.lightGray,
        // marginBottom: 40,
        marginTop: 30
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        // borderBottomWidth:0.8,
        // borderBottomColor:Colors.lightBlck2
    },
    profileWrapper: {
        flexDirection: 'row',
        backgroundColor: Colors.lightGray,
        paddingVertical: 20,
        paddingLeft: 0,
        borderWidth: 0.2,
        borderBottomColor: Colors.lightBlck
    },
    profileImage: {
        width: moderateScale(60),
        height: moderateScale(60),
        borderRadius: moderateScale(60),
        borderColor: '#ffaf8d'
    },
    icon: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    name: {
        color: 'black',
        // color: Colors.blue2,
        fontSize: textSize(12),
        fontWeight: '400',
        flex: 6,
    },

    title: {
        fontSize: moderateScale(15),
        fontWeight: '500',
        color: Colors.black
    },
    circle: {
        height: moderateScale(20),
        width: moderateScale(20),
        borderRadius: moderateScale(22),
        backgroundColor: '#474ff1',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: moderateScale(15)
    },
    notiNumber: {
        fontFamily: FONTS.regular,
        fontSize: moderateScale(12),
        color: Colors.btnText
    }
});

//make this component available to the app
export default DrawerContent;
