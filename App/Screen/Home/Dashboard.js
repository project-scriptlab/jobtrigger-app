import { ActivityIndicator, Alert, FlatList, Image, Pressable, ScrollView, Share, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { maxWidth, moderateScale, screenHeight, screenWidth, textSize } from '../../Constants/PixelRatio'
import { Colors } from '../../Constants/Colors'
import NavigationService from '../../Services/Navigation'
import { Images } from '../../Constants/Images'
import { TextStyles, appStyles } from '../../Constants/Styles'
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import JobList from '../../Components/JobList'
import UseApi from '../../ApiConf'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import { useTheme } from '@react-navigation/native'
import { FONTS } from '../../Constants/Fonts'
import { useSelector } from 'react-redux'
// import { GoogleAuth } from 'google-auth-library';
// import privateKey from '../../Components/jobtrigger-57c1a-firebase-adminsdk-l0yns-2204b745a9.json';


// import NavigationService from '../../Services/Navigation'

// const Tab = createMaterialTopTabNavigator();




const Dashboard = () => {
    const [jobType, setJobType] = useState('Latest Jobs');
    const { Request } = UseApi();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jobTypes, setJobTypes] = useState({ categories: [], states: [], qualifications: [] });
    const [viewMoreInds, setViewMoreInds] = useState({ categoryInd: 11, statesInd: 11, qualificationInd: 11 });
    // const [token, setToken] = useState(null);
    const [jobNews, setJobNews] = useState([]);
    const [jobNewsNew, setJobNewsNew] = useState([]);
    const [lastDatesApply, setLastDatesApply] = useState([]);
    const [upcomingJobs, setUpcomingJobs] = useState([]);
    const translateX = useSharedValue(0);
    const { colors } = useTheme();
    const {userData} = useSelector(state=>state.User);


    useEffect(() => {
        translateX.value = withRepeat(
            withTiming(10, {
                duration: 500,
                easing: Easing.linear,
            }),
            -1,
            true
        );
    }, [translateX]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    useEffect(() => {
        getJobNews('1');
        getJobNews('2');
        getJobNews('3');
        getJobs('5');
        getJobs('5', 'up_coming', '1');
        getJobsByTypes();
        // startShake();
    }, []);



    const getJobs = async (perPage, field, id) => {
        setLoading(true);
        let params = {
            type: '2',
            perPage: perPage ? perPage : '',
            // search_by_state: '',
            // search_by_qualification: '',
            // search_by_department: '',
            // search_by_recruiter: ''
        }
        if (field) {
            params = { ...params, [field]: id }
        }

        let jobs;
        try {
            jobs = await Request('job-list', 'POST', params);
        } catch (err) {
            console.log('err...', err);
        }
        if (jobs?.status) {
            console.log('jobs...', jobs);
            if (field != 'up_coming') {
                setJobs(jobs.job_list);
            } else {
                setUpcomingJobs(jobs.job_list);
            }
        }
        setLoading(false)
    }

    const getJobsByTypes = async () => {

        let department;
        try {
            department = await Request('category', 'POST', { type: '5' });
        } catch (err) {
            console.log('err...', err);
        }
        if (department?.status) {
            console.log('department...', department);
            setJobTypes(pre => ({ ...pre, categories: department.category_list }));
        }

        let states;
        try {
            states = await Request('category', 'POST', { type: '1' });
        } catch (err) {
            console.log('err...', err);
        }
        if (states?.status) {
            console.log('states...', states);
            setJobTypes(pre => ({ ...pre, states: states.category_list }));
        }

        let qualification;
        try {
            qualification = await Request('category', 'POST', { type: '4' });
        } catch (err) {
            console.log('err...', err);
        }
        if (qualification?.status) {
            console.log('qualification...', qualification);
            setJobTypes(pre => ({ ...pre, qualifications: qualification.category_list }));
        }
        // setLoading(false);
    }

    const getJobNews = async (type) => {
        setLoading(true);
        let params = {
            type: type,
            // id: id
        }

        let data;
        console.log('params...', params);
        try {
            data = await Request('job-update', 'POST', params);
        } catch (err) {
            console.log('err...', err);
        }
        console.log('data...', data);
        if (data?.status) {
            if (type == '1') {
                setJobNews(data.latest_update_news);
            } else if (type == '2') {
                setJobNewsNew(data.latest_update_news_highlight);
            } else if (type == '3') {
                setLastDatesApply(data.last_date_apply);
            }
        }
        setLoading(false);
    }

    return (
        <View style={{ ...appStyles.pageStyle, backgroundColor: colors.background }}>
            <StatusBar
                translucent={true}
                // backgroundColor="transparent"
                backgroundColor="black"
            // barStyle="light-content"
            />
            <View style={appStyles.pageFrame}>
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                        <Pressable
                            onPress={() => NavigationService.openDrawer()}
                            style={{ paddingRight: 20, paddingLeft: 10, paddingVertical: 8 }}
                        >
                            <Image
                                source={Images.menu}
                                style={{
                                    height: 20,
                                    width: 20,
                                    tintColor: colors.text
                                }}
                            />
                        </Pressable>
                        <Text style={{ fontSize: textSize(13), color: colors.text }}>JOBTRIGGER</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                        <Pressable
                            style={{ paddingHorizontal: 20, paddingVertical: 5 }}
                            onPress={() => NavigationService.navigate('Notification')}
                        >
                            <Image
                                source={Images.notification}
                                style={{
                                    height: 21,
                                    width: 21,
                                    // marginRight: 5
                                    tintColor: colors.text
                                }}
                            />
                        </Pressable>
                        <Pressable
                            onPress={() => NavigationService.navigate('Profile')}
                            style={{ paddingVertical: 5, marginRight: 5 }}
                        >
                            <Image
                                source={userData?{uri:userData.image}: Images.user}
                                style={{
                                    height: 24,
                                    width: 24,
                                    tintColor:userData?null:colors.text,
                                    borderRadius:20
                                    // marginTop: 5
                                }}
                            />
                        </Pressable>
                    </View>
                </View>
                <View style={{ borderTopColor: Colors.white, borderTopWidth: 0.2, marginTop: 15, opacity: 0.4, width: screenWidth, alignSelf: 'center' }} />
                <ScrollView style={{ alignSelf: 'center', width: '97%', paddingTop: 15 }} showsVerticalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%', gap: 2 }}>
                        <TouchableOpacity
                            style={{ paddingHorizontal: 4, paddingVertical: 2, borderBottomWidth: jobType == 'Latest Jobs' ? 1 : 0, borderBottomColor: colors.text }}
                            onPress={() => {
                                setJobType('Latest Jobs');
                                getJobs('5');
                            }}
                        >
                            <Text style={{ fontSize: textSize(10), fontFamily: FONTS.medium, color: jobType == 'Latest Jobs' ? colors.text : colors.greyText }}>Job List</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ paddingHorizontal: 4, paddingVertical: 2, borderBottomWidth: jobType == 'Bank Jobs' ? 1 : 0, borderBottomColor: colors.text }}
                            onPress={() => {
                                setJobType('Bank Jobs');
                                getJobs('', 'search_by_department', '71');
                            }}
                        >
                            <Text style={{ fontSize: textSize(10), fontFamily: FONTS.medium, color: jobType == 'Bank Jobs' ? colors.text : colors.greyText }}>Bank Jobs</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ paddingHorizontal: 4, paddingVertical: 2, borderBottomWidth: jobType == 'SSC Exams' ? 1 : 0, borderBottomColor: colors.text }}
                            onPress={() => {
                                setJobType('SSC Exams');
                                getJobs('', 'search_by_recruiter', '345');
                            }}
                        >
                            <Text style={{ fontSize: textSize(10), fontFamily: FONTS.medium, color: jobType == 'SSC Exams' ? colors.text : colors.greyText }}>SSC Exams</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ paddingHorizontal: 4, paddingVertical: 2, borderBottomWidth: jobType == 'Railway Jobs' ? 1 : 0, borderBottomColor: colors.text }}
                            onPress={() => {
                                setJobType('Railway Jobs');
                                getJobs('', 'search_by_department', '80');
                            }}
                        >
                            <Text style={{ fontSize: textSize(10), fontFamily: FONTS.medium, color: jobType == 'Railway Jobs' ? colors.text : colors.greyText }}>Railway Jobs</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <View style={{ marginTop: 25 }}>
                            <Pressable
                                onPress={() => NavigationService.navigate('JobSearch')}
                            >
                                <TextInput
                                    placeholder='Search Job'
                                    placeholderTextColor={colors.greyText}
                                    style={{
                                        ...appStyles.intput, paddingTop: 9, paddingLeft: 40,
                                        backgroundColor: colors.lightGray, borderColor: colors.greyText
                                    }}
                                    editable={false}
                                />
                            </Pressable>
                            <Image
                                source={Images.search}
                                style={{ height: 20, width: 20, position: 'absolute', top: 12, left: 10, tintColor: colors.greyText }}
                            />
                        </View>
                    </View>

                    {loading && jobNewsNew?.length == 0 && jobNews?.length == 0 && <ActivityIndicator size={28} style={{ marginTop: 150 }} />}
                    {jobType == 'Latest Jobs' && jobNewsNew?.length > 0 && <View style={{ marginTop: 20 }}>
                        <Text style={{ ...TextStyles.title2, color: colors.text }}>Latest Govt News</Text>
                        <View style={{}}>
                            <FlatList
                                data={jobNewsNew}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => {
                                    return (
                                        <Pressable style={{ flexDirection: 'row', gap: 10, marginTop: 10, flex: 10 }}
                                            onPress={() => NavigationService.navigate('JobDetails', { id: item.job_id, jobList: [...jobNewsNew, ...jobNews] })}
                                        >
                                            {/* {console.log('item.job_id...', item.job_id)} */}
                                            <Image
                                                source={Images.arrowNext}
                                                style={{
                                                    height: 15,
                                                    width: 15,
                                                    marginTop: 5,
                                                    // flex: 0.5,
                                                    tintColor: colors.greyText
                                                }}
                                            />
                                            <Text style={{ fontSize: textSize(11), fontFamily: FONTS.semibold, color: colors.greyText, flex: 10 }}>{item?.title?.replace(/&nbsp;/g, ' ')}</Text>
                                            <Animated.View style={animatedStyle}>
                                                <View style={{ position: 'relative' }}>
                                                    <Image
                                                        source={Images.arrowNew}
                                                        style={{
                                                            height: 35,
                                                            width: 40,
                                                            marginRight: 10,
                                                            // flex:0.9,
                                                            tintColor: 'red',
                                                            resizeMode: 'stretch'
                                                        }}
                                                    />
                                                    <Text style={{ position: 'absolute', color: Colors.white, top: 8, left: 10, fontWeight: '500', fontSize: textSize(8) }}>New</Text>
                                                </View>
                                            </Animated.View>
                                        </Pressable>
                                    )
                                }}
                                keyExtractor={(itm, index) => index.toString()}
                            />
                            <FlatList
                                data={jobNews}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item }) => {
                                    return (
                                        <Pressable style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}
                                            onPress={() => NavigationService.navigate('JobDetails', { id: item.job_id, jobList: [...jobNews, ...jobNewsNew] })}
                                        >
                                            {console.log('item.job_id news...', item.job_id)}
                                            <Image
                                                source={Images.arrowNext}
                                                style={{
                                                    height: 15,
                                                    width: 15,
                                                    marginTop: 5,
                                                    tintColor: colors.greyText
                                                }}
                                            />
                                            <Text style={{ fontSize: textSize(11), fontFamily: FONTS.semibold, color: colors.greyText, flex: 1 }}>{item?.title?.replace(/&nbsp;/g, ' ')}</Text>
                                        </Pressable>
                                    )
                                }}
                                keyExtractor={(itm, index) => index.toString()}
                            />
                        </View>
                    </View>}
                    {jobType == 'Latest Jobs' && lastDatesApply.length > 0 && <View style={{ marginTop: 20 }}>
                        <Text style={{ ...TextStyles.title2, marginBottom: 10, color: colors.text }}>Last Dates For Apply</Text>
                        <FlatList
                            data={lastDatesApply}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                return (
                                    <Pressable style={{ flexDirection: 'row', gap: 10 }}
                                        onPress={() => NavigationService.navigate('JobDetails', { id: item.job_id, jobList: [...lastDatesApply] })}
                                    >
                                        <Image
                                            source={Images.arrowNext}
                                            style={{
                                                height: 15,
                                                width: 15,
                                                marginTop: 5,
                                                tintColor: colors.greyText
                                            }}
                                        />
                                        <View style={{ flex: 1 }}>
                                            <RenderHtml
                                                contentWidth={screenWidth}
                                                source={{ html: item.title }}
                                                tagsStyles={{
                                                    p: { ...TextStyles.textBase, marginTop: 0, lineHeight: 20, color: colors.greyText, textAlign: 'auto', fontFamily: FONTS.semibold },
                                                    u: { color: colors.skyBlue, fontFamily: FONTS.regular },
                                                }}
                                                systemFonts={[...defaultSystemFonts, 'Poppins-SemiBold', 'Poppins-Regular']}
                                            />
                                        </View>
                                    </Pressable>
                                )
                            }}
                            keyExtractor={(itm, index) => index.toString()}
                        />
                    </View>}

                    {!loading && jobs.length > 0 && <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}
                        onPress={() => jobType == 'Latest Jobs' ? NavigationService.navigate('JobListPage', { type: '', title: 'Latest Jobs', id: null, typeField: null }) : null}
                    >
                        <Text style={{ ...TextStyles.title2, color: colors.text }}>{jobType}</Text>
                        {jobType == 'Latest Jobs' && <Image
                            source={Images.arrowNext}
                            style={{
                                height: 14,
                                width: 14,
                                resizeMode: 'stretch',
                                marginRight: 5,
                                tintColor: colors.text,
                            }}
                        />}
                    </Pressable>}

                    {(jobs.length > 0 || jobType != 'Latest Jobs') && <View style={{}}>
                        <JobList jobList={jobs} loading={(loading && jobType != 'Latest Jobs')} paddingbottom={30} />
                    </View>}
                    {upcomingJobs.length > 0 && jobType == 'Latest Jobs' && <View style={{}}>
                        <Pressable style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}
                            onPress={() => NavigationService.navigate('JobListPage', { type: '', title: 'Upcoming Jobs', id: null, typeField: null })}
                        >
                            <Text style={{ ...TextStyles.title2, color: colors.text }}>Upcoming Jobs</Text>
                            <Image
                                source={Images.arrowNext}
                                style={{
                                    height: 14,
                                    width: 14,
                                    resizeMode: 'stretch',
                                    marginRight: 5,
                                    tintColor: colors.text,
                                }}
                            />
                        </Pressable>
                        <JobList jobList={upcomingJobs} paddingbottom={30} />
                    </View>}
                    {/* <View style={{marginBottom:200}}/> */}

                    {jobType == 'Latest Jobs' && <View style={{ marginBottom: 40, marginLeft: 5 }}>
                        {(jobTypes.categories.length > 0) && <Text style={{ ...TextStyles.title2, color: colors.text }}>Jobs By Category</Text>}
                        <View style={{ marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', rowGap: 10, columnGap: 5 }}>
                            {jobTypes.categories.map((item, index) => {
                                // {jobCats.map((item, index) => {
                                return (
                                    <>
                                        {index <= viewMoreInds.categoryInd && <Pressable key={index} style={{ width: '24%', alignItems: 'center' }}
                                            onPress={() => NavigationService.navigate('JobListPage', { type: '5', title: 'Jobs By Category', id: item.id, typeField: 'search_by_department' })}
                                        >
                                            <View style={{ ...styles.catBox, backgroundColor: colors.catBox }}>
                                                <Image
                                                    source={{ uri: item.image }}
                                                    // source={item.icon}
                                                    style={{
                                                        height: 30,
                                                        width: 30,
                                                        resizeMode: 'cover',
                                                    }}
                                                />
                                            </View>
                                            <Text style={{ marginTop: 8, alignSelf: 'center', color: colors.text, textAlign: 'center', fontFamily: FONTS.regular }}>{item.name}</Text>
                                        </Pressable>}
                                    </>
                                )
                            })}
                        </View>
                        {jobTypes.categories?.length > 0 && <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, marginHorizontal: 10, marginTop: 20 }}>
                            <TouchableOpacity onPress={() => {
                                if ((viewMoreInds.categoryInd + 1) < jobTypes.categories?.length) {
                                    setViewMoreInds(pre => ({ ...pre, categoryInd: viewMoreInds.categoryInd + 12 }));
                                }
                            }}>{(viewMoreInds.categoryInd + 1) < jobTypes.categories?.length &&
                                <Text style={{ ...TextStyles.title3, textDecorationLine: 'underline', color: colors.text }}>View More</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                if ((viewMoreInds.categoryInd + 1) > 12) {
                                    setViewMoreInds(pre => ({ ...pre, categoryInd: viewMoreInds.categoryInd - 12 }));
                                }
                            }}>{(viewMoreInds.categoryInd + 1) > 12 && <Text style={{ ...TextStyles.title3, textDecorationLine: 'underline', color: colors.text }}>View Less</Text>}</TouchableOpacity>
                        </View>}
                    </View>}

                    {jobType == 'Latest Jobs' && <View style={{ marginBottom: 40, marginLeft: 5 }}>
                        {jobTypes.states.length > 0 && <Text style={{ ...TextStyles.title2, color: colors.text }}>Jobs By Location</Text>}
                        <View style={{ marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', rowGap: 10, columnGap: 5 }}>
                            {jobTypes.states.map((item, index) => {
                                return (
                                    <>
                                        {index < viewMoreInds.statesInd && <Pressable key={index} style={{ width: '24%', alignItems: 'center' }}
                                            onPress={() => NavigationService.navigate('JobListPage', { type: '1', title: 'Jobs By Location', id: item.id, typeField: 'search_by_state' })}
                                        >
                                            <View style={{ ...styles.catBox, backgroundColor: colors.catBox }}>
                                                <Image
                                                    source={{ uri: item.image }}
                                                    // source={item.icon}
                                                    style={{
                                                        height: 30,
                                                        width: 30,
                                                        resizeMode: 'cover',
                                                    }}
                                                />
                                            </View>
                                            <Text style={{ marginTop: 4, alignSelf: 'center', textAlign: 'center', color: colors.text, fontFamily: FONTS.regular }}>{item.name}</Text>
                                        </Pressable>}
                                    </>
                                )
                            })}
                        </View>
                        {jobTypes.states?.length > 0 && <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, marginHorizontal: 10, paddingTop: 20 }}>
                            <TouchableOpacity onPress={() => {
                                if ((viewMoreInds.statesInd + 1) < jobTypes.states?.length) {
                                    setViewMoreInds(pre => ({ ...pre, statesInd: viewMoreInds.statesInd + 12 }));
                                }
                            }}>{(viewMoreInds.statesInd + 1) < jobTypes.states?.length && <Text style={{ ...TextStyles.title3, textDecorationLine: 'underline', color: colors.text }}>View More</Text>}</TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                if ((viewMoreInds.statesInd + 1) > 12) {
                                    setViewMoreInds(pre => ({ ...pre, statesInd: viewMoreInds.statesInd - 12 }));
                                }
                            }}>{(viewMoreInds.statesInd + 1) > 12 && <Text style={{ ...TextStyles.title3, textDecorationLine: 'underline', color: colors.text }}>View Less</Text>}</TouchableOpacity>
                        </View>}
                    </View>}

                    {jobType == 'Latest Jobs' && <View style={{ marginBottom: 100, marginLeft: 5 }}>
                        {(jobTypes.qualifications.length > 0) && <Text style={{ ...TextStyles.title2, color: colors.text }}>Jobs By Qualification</Text>}
                        <View style={{ marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', rowGap: 10, columnGap: 5 }}>
                            {jobTypes.qualifications.map((item, index) => {
                                return (
                                    <>
                                        {index < viewMoreInds.qualificationInd && <Pressable key={index} style={{ width: '24%', alignItems: 'center' }}
                                            onPress={() => NavigationService.navigate('JobListPage', { type: '4', title: 'Jobs By Qualification', id: item.id, typeField: 'search_by_qualification' })}
                                        >
                                            <View style={{ ...styles.catBox, backgroundColor: colors.catBox }}>
                                                <Image
                                                    source={{ uri: item.image }}
                                                    // source={item.icon}
                                                    style={{
                                                        height: 30,
                                                        width: 30,
                                                        resizeMode: 'cover',
                                                    }}
                                                />
                                            </View>
                                            <Text style={{ marginTop: 2, alignSelf: 'center', color: colors.text, textAlign: 'center', fontFamily: FONTS.regular }}>{item.name}</Text>
                                        </Pressable>}
                                    </>
                                )
                            })}
                        </View>
                        {jobTypes.qualifications?.length > 0 && <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 20, marginHorizontal: 10, marginTop: 20 }}>
                            <TouchableOpacity onPress={() => {
                                if ((viewMoreInds.qualificationInd + 1) < jobTypes.qualifications?.length) {
                                    setViewMoreInds(pre => ({ ...pre, qualificationInd: viewMoreInds.qualificationInd + 12 }));
                                }
                            }}>{(viewMoreInds.qualificationInd + 1) < jobTypes.qualifications?.length && <Text style={{ ...TextStyles.title3, textDecorationLine: 'underline', color: colors.text }}>View More</Text>}</TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                if ((viewMoreInds.qualificationInd + 1) > 12) {
                                    setViewMoreInds(pre => ({ ...pre, qualificationInd: viewMoreInds.qualificationInd - 12 }));
                                }
                            }}>{(viewMoreInds.qualificationInd + 1) > 12 && <Text style={{ ...TextStyles.title3, textDecorationLine: 'underline', color: colors.text }}>View Less</Text>}</TouchableOpacity>
                        </View>}
                    </View>}
                </ScrollView>
            </View>
        </View>
    )
}

export default Dashboard

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        alignItems: 'center',
    },
    catBox: {
        height: 60,
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: Colors.white,
        elevation: 4,
        // marginLeft: 10,
        // marginBottom: 5
    }
})