import { ActivityIndicator, Alert, Image, Pressable, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextStyles, appStyles } from '../../Constants/Styles';
import { useTheme } from '@react-navigation/native';
import BackHeader from '../../Components/BackHeader';
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { FONTS } from '../../Constants/Fonts';
import { Images } from '../../Constants/Images';
import { screenHeight, textSize } from '../../Constants/PixelRatio';
import { useDispatch, useSelector } from 'react-redux';
import { setDarkMode, setAppSetting, setuser } from '../../Redux/reducer/User';
import UseApi from '../../ApiConf';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationService from '../../Services/Navigation';
import Toast from 'react-native-simple-toast';


const Profile = ({route}) => {
    const {nextToLoginPage ,backParams} = route?.params || {};
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const { Request } = UseApi();
    const { appSetting, userData } = useSelector(state => state.User);
    const [loading, setLoading] = useState(false);
    const [isLoginPage, setIsLoginPage] = useState(nextToLoginPage?true : false);

    useEffect(() => {
        GoogleSignin.configure({ webClientId: '158028135878-hau312lih00epgvsar4ln3jm57al4ld9.apps.googleusercontent.com' });
    }, []);

    const SignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            if (userInfo?.user) {
                // setUserInfo(userInfo?.user);
                Login(userInfo.user);
            }
            console.log('userInfo...', userInfo);
        } catch (error) {
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                        // user cancelled the login flow
                        break;
                    case statusCodes.IN_PROGRESS:
                        // operation (eg. sign in) already in progress
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        // play services not available or outdated
                        break;
                    default:
                    // some other error happened
                }
            }
            else {
                // an error that's not related to google sign in occurred
            }
            console.log('error...', error);
        }
    };

    const Login = async (userdata) => {
        setLoading(true);
        let params = {
            name: userdata?.name,
            email: userdata?.email,
            image: userdata?.photo
        }

        let data;
        console.log('params...', params);
        try {
            data = await Request('user-login', 'POST', params);
        } catch (err) {
            console.log('err...', err);
        }
        console.log('data...', data);
        if (data?.status && data?.data) {
            dispatch(setuser(data.data));
            await AsyncStorage.setItem('userData', JSON.stringify(data?.data));
            if(nextToLoginPage){
                NavigationService.navigate(nextToLoginPage,{...backParams});
            }else{
                setIsLoginPage(false);
            }
            Toast.show('Logged in successfully.');
        }
        setLoading(false);
    }

    const setNotification = async () => {
        // setLoading(true);
        let fcmToken = await AsyncStorage.getItem('fcmToken');

        if (!fcmToken) {
            return;
        }
        let params = {
            type: !appSetting.notification ? '1' : '2',
            fcm_token: fcmToken
        }

        let data;
        console.log('params...', params);
        try {
            data = await Request('add-delete-fcm-token', 'POST', params);
        } catch (err) {
            console.log('err...', err);
        }
        console.log('data...', data);
        if (data?.status) {
            let appsetting = { ...appSetting, notification: !appSetting.notification };
            dispatch(setAppSetting(appsetting));
            await AsyncStorage.setItem('appSetting', JSON.stringify(appsetting));
        }
        // setLoading(false);
    }

    const alertSignOut = () => {
        Alert.alert('Logout Alert !', 'Do you want to logout?', [
            {
                text: 'No',
                onPress: () => console.log('No Pressed'),
                style: 'No',
            },
            { text: 'Yes', onPress: SignOut },
        ]);
    }

    const SignOut = async () => {
        try {
            let data = await GoogleSignin.signOut();
            dispatch(setuser(null));
            await AsyncStorage.setItem('userData', JSON.stringify(null));
            Toast.show('Logged out successfully.');
        } catch (error) {
            console.log('error..', error);

        }
    }

    const setDarkMode = async () => {
        let appsetting = { ...appSetting, darkMode: !appSetting.darkMode }
        dispatch(setAppSetting(appsetting));
        await AsyncStorage.setItem('appSetting', JSON.stringify(appsetting));
    }

    return (
        <View style={{ ...appStyles.pageStyle, backgroundColor: colors.background }}>
            <StatusBar
                translucent={true}
                backgroundColor="black"
            />
            <View style={{ ...appStyles.pageFrame }}>
                {isLoginPage && loading && <ActivityIndicator size={28} style={{ marginTop: screenHeight / 3 }} />}
                {isLoginPage && !loading && <View style={{ paddingHorizontal: 10 }}>
                    <View style={{ marginTop: 100 }}>
                        <Image
                            source={Images.logo}
                            style={{
                                height: 50,
                                width: '100%',
                                resizeMode: 'contain',
                                backgroundColor: colors.background,
                                tintColor: colors.text
                            }}
                        />
                    </View>
                    <View style={{ marginTop: 50 }}>
                        <TouchableOpacity
                            style={{ ...styles.signInBox, borderColor: colors.greyText }}
                            onPress={SignIn}
                        >
                            <Image
                                source={Images.google}
                                style={{
                                    height: 20,
                                    width: 20,
                                    resizeMode: 'contain',
                                    // backgroundColor: colors.background,
                                    // tintColor: colors.text
                                }}
                            />
                            <Text style={{ fontFamily: FONTS.semibold, color: colors.text, fontSize: textSize(12) }}> Sign In with google   </Text>
                        </TouchableOpacity>

                    </View>
                </View>}
                {/* {console.log('userData.id...', userData.id)} */}
                {!isLoginPage && <View>
                    <BackHeader title={'My Profile'} />
                    <View>
                        <View style={{ flexDirection: 'row', gap: 20, marginTop: 30, paddingHorizontal: 15 }}>
                            <View>
                                <Image
                                    source={userData ? { uri: userData?.image } : Images.user}
                                    style={{
                                        height: 50,
                                        width: 50,
                                        resizeMode: 'contain',
                                        // backgroundColor: colors.background,
                                        borderRadius: 50,
                                        tintColor: userData ? null : colors.text
                                    }}
                                />
                            </View>
                            <View>
                                <Text style={{ color: colors.text, fontFamily: FONTS.semibold, fontSize: textSize(12) }}>{userData ? userData.name : 'Guest'}</Text>
                                {userData && <Text style={{ color: colors.text, fontFamily: FONTS.regular, textDecorationLine: 'underline' }}>{userData.email}</Text>}
                                {!userData && <Pressable
                                    onPress={() => setIsLoginPage(true)}
                                >
                                    <Text style={{ color: colors.text, fontFamily: FONTS.medium, fontSize: textSize(12), textDecorationLine: 'underline' }}>Login</Text>
                                </Pressable>}
                            </View>
                        </View>
                        <View style={{ marginTop: 30, paddingHorizontal: 5 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}
                                onPress={() => {
                                    if (userData) {
                                        NavigationService.navigate('JobListPage', { type: '', title: 'My Jobs', id: null, typeField: null, bookmarkList: true, backPage: 'Profile' });
                                    } else {
                                        setIsLoginPage(true);
                                    }
                                }}
                            >
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <Image
                                        source={Images.bookmark}
                                        style={{
                                            height: 19,
                                            width: 19,
                                            resizeMode: 'contain',
                                            backgroundColor: colors.background,
                                            tintColor: colors.text
                                        }}
                                    />
                                    <Text style={{ fontFamily: FONTS.regular, color: colors.text, fontSize: textSize(12) }}>My Saved Jobs</Text>
                                </View>
                                <View>
                                    <Image
                                        source={Images.arrowNext}
                                        style={{
                                            height: 17,
                                            width: 17,
                                            resizeMode: 'contain',
                                            backgroundColor: colors.background,
                                            marginRight: 10,
                                            tintColor: colors.text
                                        }}
                                    />
                                </View>
                            </TouchableOpacity>
                            <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <Image
                                        source={Images.notification}
                                        style={{
                                            height: 22,
                                            width: 22,
                                            resizeMode: 'contain',
                                            // backgroundColor: colors.background,
                                            tintColor: colors.text
                                        }}
                                    />
                                    <Text style={{ fontFamily: FONTS.regular, color: colors.text, fontSize: textSize(12) }}>Notification</Text>
                                </View>
                                <View>
                                    <Switch
                                        style={{}}
                                        value={appSetting.notification}
                                        onValueChange={setNotification}
                                        thumbColor={appSetting.notification ? "#ffffff" : "#f4f3f4"}
                                        // trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        trackColor={{ false: "#767577", true: colors.skyBlue }}
                                    />
                                </View>
                            </Pressable>
                            <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                    <Image
                                        source={Images.darkMode}
                                        style={{
                                            height: 23,
                                            width: 23,
                                            resizeMode: 'contain',
                                            // backgroundColor: colors.background,
                                            tintColor: colors.text
                                        }}
                                    />
                                    <Text style={{ fontFamily: FONTS.regular, color: colors.text, fontSize: textSize(12) }}>Dark Mode</Text>
                                </View>
                                <View>
                                    <Switch
                                        style={{}}
                                        value={appSetting.darkMode}
                                        onValueChange={setDarkMode}
                                        thumbColor={appSetting.darkMode ? "#ffffff" : "#f4f3f4"}
                                        // trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        trackColor={{ false: "#767577", true: colors.skyBlue }}
                                    />
                                </View>
                            </Pressable>

                            {userData && <TouchableOpacity
                                style={{ marginTop: 20, flexDirection: 'row', gap: 10 }}
                                onPress={alertSignOut}
                            >
                                <Image
                                    source={Images.logout}
                                    style={{
                                        height: 23,
                                        width: 23,
                                        resizeMode: 'contain',
                                        backgroundColor: colors.background,
                                        marginTop: 2,
                                        tintColor: colors.text
                                    }}
                                />
                                <Text style={{ fontFamily: FONTS.regular, color: colors.text, fontSize: textSize(12) }}> Logout   </Text>
                            </TouchableOpacity>}
                        </View>
                    </View>

                </View>}
            </View>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    signInBox: {
        marginTop: 100,
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.4,
        // paddingHorizontal:3,
        paddingVertical: 10,
        borderRadius: 5,
        marginHorizontal: 10
    }
})