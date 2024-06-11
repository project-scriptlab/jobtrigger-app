import { ActivityIndicator, FlatList, Image, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextStyles, appStyles } from '../Constants/Styles'
import BackHeader from '../Components/BackHeader'
import UseApi from '../ApiConf'
import { Images } from '../Constants/Images'
import { screenWidth, textSize } from '../Constants/PixelRatio'
import { Colors } from '../Constants/Colors'
import RenderHtml from 'react-native-render-html';
import NavigationService from '../Services/Navigation'
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated'
import { useTheme } from '@react-navigation/native'


const JobUpdate = () => {
    const [loading, setLoading] = useState(false);
    const { Request } = UseApi();
    const [jobNews, setJobNews] = useState([]);
    const [jobNewsNew, setJobNewsNew] = useState([]);
    const [lastDatesApply, setLastDatesApply] = useState([]);
    const [tabType, setTabType] = useState('Latest News');
    const translateX = useSharedValue(0);
    const {colors} = useTheme();



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
    }, []);

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
        <View style={{...appStyles.pageStyle,backgroundColor:colors.background}}>
            <StatusBar
                translucent={true}
                backgroundColor="black"
            />
            <View style={appStyles.pageFrame}>
                <BackHeader title={'Job Updates'} />
                <View style={{ marginHorizontal: 2, marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', gap: 20, marginVertical: 10 }}>
                        <TouchableOpacity
                            style={{ paddingHorizontal: 4, paddingVertical: 2, borderBottomWidth: tabType == 'Latest News' ? 1 : 0, borderBottomColor: colors.text }}
                            onPress={() => {
                                setTabType('Latest News');
                                // getJobs('5');
                            }}
                        >
                            <Text style={{ fontSize: textSize(11), fontWeight: '500', color: tabType == 'Latest News' ? colors.text : colors.greyText }}>Latest News</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ paddingHorizontal: 4, paddingVertical: 2, borderBottomWidth: tabType == 'Last Dates' ? 1 : 0, borderBottomColor: colors.text }}
                            onPress={() => {
                                setTabType('Last Dates');
                                // getJobs('5');
                            }}
                        >
                            <Text style={{ fontSize: textSize(11), fontWeight: '500', color: tabType == 'Last Dates' ? colors.text : colors.greyText }}>Last Dates</Text>
                        </TouchableOpacity>
                    </View>
                    {tabType == 'Latest News' && <View style={{ marginTop: 20 }}>
                        {loading && jobNewsNew?.length == 0 && jobNews?.length == 0 && <ActivityIndicator size={28} style={{ marginTop: 150 }} />}
                        <FlatList
                            data={jobNewsNew}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                return (
                                    <Pressable style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}
                                        onPress={() => NavigationService.navigate('JobDetails', { backPage: 'JobUpdate', id: item.job_id, jobList: [...jobNewsNew, ...jobNews] })}
                                    >
                                        {console.log('item.job_id...', item.job_id)}
                                        <Image
                                            source={Images.arrowNext}
                                            style={{
                                                height: 15,
                                                width: 15,
                                                marginTop: 5,
                                                flex: 0.5,
                                                tintColor:colors.greyText
                                            }}
                                        />
                                        <Text style={{ fontSize: textSize(11), fontWeight: '500', color: colors.greyText, flex: 10 }}>{item?.title?.replace(/&nbsp;/g, ' ')}</Text>
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
                                        onPress={() => NavigationService.navigate('JobDetails', { backPage: 'JobUpdate', id: item.job_id, jobList: [...jobNews, ...jobNewsNew] })}
                                    >
                                        <Image
                                            source={Images.arrowNext}
                                            style={{
                                                height: 15,
                                                width: 15,
                                                marginTop: 5,
                                                tintColor:colors.greyText
                                            }}
                                        />
                                        <Text style={{ fontSize: textSize(11), fontWeight: '500', color: colors.greyText, flex: 1 }}>{item.title}</Text>
                                    </Pressable>
                                )
                            }}
                            keyExtractor={(itm, index) => index.toString()}
                        />
                    </View>}
                    {tabType == 'Last Dates' && <View style={{ marginTop: 20 }}>
                        {loading && lastDatesApply?.length == 0 && <ActivityIndicator size={28} style={{ marginTop: 150 }} />}

                        <FlatList
                            data={lastDatesApply}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => {
                                return (
                                    <Pressable style={{ flexDirection: 'row', gap: 10 }}
                                        onPress={() => NavigationService.navigate('JobDetails', { backPage: 'JobUpdate', id: item.job_id, jobList: [...lastDatesApply] })}
                                    >
                                        <Image
                                            source={Images.arrowNext}
                                            style={{
                                                height: 15,
                                                width: 15,
                                                tintColor:colors.greyText
                                                // flex:1
                                                // marginTop: 15
                                            }}
                                        />
                                        {/* <Text style={{ fontSize: textSize(11), fontWeight: '500', color: Colors.greyText, flex: 1 }}>{item.title}</Text> */}
                                        <View style={{ flex: 1 }}>
                                            <RenderHtml
                                                contentWidth={screenWidth}
                                                source={{ html: item.title }}
                                                tagsStyles={{
                                                    p: { ...TextStyles.textBase, marginTop: 0, lineHeight: 20, fontWeight: '500', color: colors.greyText, textAlign: 'auto' },
                                                    u:{color:colors.skyBlue,fontWeight:'400'}
                                                    // figure: { width: '98%', marginHorizontal: 1 },
                                                    // thead: { backgroundColor: Colors.blue2, color: Colors.white, borderWidth: 0.2, borderColor: Colors.blue2 },
                                                    // th: { borderWidth: 0.2, borderColor: Colors.lightBlck, padding: 2, paddingLeft: 5, paddingVertical: 4, fontWeight: '500' },
                                                    // td: { borderWidth: 0.2, borderColor: Colors.lightBlck3, padding: 2, paddingLeft: 5, paddingVertical: 4 },
                                                    // tbody: { paddingHorizontal: 2 },
                                                    // table: { marginTop: 10 },
                                                    // strong: { fontWeight: '500' },
                                                    // ul: { ...TextStyles.textBase, marginRight: 5 }
                                                }}
                                            />
                                        </View>
                                    </Pressable>
                                )
                            }}
                            keyExtractor={(itm, index) => index.toString()}
                        />
                    </View>}
                </View>
            </View>
        </View>
    )
}

export default JobUpdate

const styles = StyleSheet.create({})