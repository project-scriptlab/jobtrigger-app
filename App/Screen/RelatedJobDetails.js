import { ActivityIndicator, Image, Linking, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Images } from '../Constants/Images'
import { screenHeight, screenWidth, textSize } from '../Constants/PixelRatio'
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import { Colors } from '../Constants/Colors';
import { TextStyles, appStyles } from '../Constants/Styles';
import NavigationService from '../Services/Navigation';
import BackHeader from '../Components/BackHeader';
import UseApi from '../ApiConf';
import { useTheme } from '@react-navigation/native';
import { FONTS } from '../Constants/Fonts';
// import BackHeader from './BackHeader';
// import NavigationService from '../Services/Navigation';

const RelatedJobDetails = ({ route }) => {
    const { jobId, id,slug, backPage } = route?.params;
    const { width } = useWindowDimensions();
    const { shareLink, Request } = UseApi();
    const [loading, setLoading] = useState(false);
    // const [detailsList, setDetailsList] = useState([]);
    const [details1, setDetails1] = useState(null);
    const [details2, setDetails2] = useState(null);
    const [relatedJobs, setRelatedJobs] = useState([]);
    const { colors } = useTheme();


    useEffect(() => {
        console.log('id real...', id);
        console.log('jobId real...', jobId);
        console.log('backPage real...', backPage);
        getJobDetails();
        getRelatedJobs();
    }, []);

    const getJobDetails = async () => {
        setLoading(true);
        let params = {
            type: '1',
            // id: Id ? Id : id
            id: `${jobId}`
        }
        let details;
        try {
            details = await Request('job-list', 'POST', params);
        } catch (err) {
            console.log('err2...', err);
        }
        if (details?.status && details.job_details?.length > 0) {
            console.log('details...', details);
            if (details.job_details[0]) {
                setDetails1(details.job_details[0]);
            }
            if (details.job_details[1]) {
                setDetails2(details.job_details[1]?.in_detail);
            }
        }
        setLoading(false);
    }

    const getRelatedJobs = async () => {
        let data;
        try {
            data = await Request('related-jobs', 'POST', { job_id: jobId });
        } catch (err) {
            console.log('err...', err);
        }
        console.log('data...', data);
        if (data?.status) {
            setRelatedJobs(data.related_jobs);
        }
    }

    return (
        <View style={{ ...appStyles.pageStyle, backgroundColor: colors.background }}>
            <StatusBar
                translucent={true}
                backgroundColor="black"
            />
            <View style={{ ...appStyles.pageFrame, marginHorizontal: 5 }}>
                <BackHeader title={'Job Details'} onPress={() => backPage ? NavigationService.navigate(`${backPage}`, { id: id,slug:slug }) : NavigationService.navigate('Home')} />
                <ScrollView style={{ paddingHorizontal: 5, marginTop: 10, marginBottom: 30 }} showsVerticalScrollIndicator={false}>
                    {loading && <ActivityIndicator size={28} style={{ marginTop: 200 }} />}
                    {(!details1 || details1?.in_detail?.length == 0) && (!details2 || details2?.length == 0) && !loading && <Text style={{ marginTop: screenHeight / 3, textAlign: 'center', fontSize: textSize(12), color: colors.greyText }}>Not Found !</Text>}
                    <View style={{ flexDirection: 'row', gap: 5 }}>
                        <Text style={{ ...TextStyles.title2, color: colors.text }}>{details1?.job_title}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', gap: 2 }}>
                            {details1?.locations?.map((itm, ind) => {
                                return (
                                    <>
                                        {ind < 2 && <Text style={{ fontSize: textSize(10), fontWeight: '500', color: colors.skyBlue,fontFamily:FONTS.semibold }}>{itm.name + ','}</Text>}
                                    </>
                                )
                            })}
                            {/* <Text>husdjlknl</Text> */}
                            {details1?.states?.map((itm, ind) => {
                                return (
                                    <>
                                        {ind < 1 && <Text style={{ fontSize: textSize(10), color: colors.skyBlue,fontFamily:FONTS.semibold }}>{itm.name}</Text>}
                                    </>
                                )
                            })}
                        </View>
                        {!(!details1 || details1?.in_detail?.length == 0) && !(!details2 || details2?.length == 0) && <TouchableOpacity
                            style={{ paddingHorizontal: 5, paddingVertical: 5 }}
                            onPress={() => shareLink(`jobdetails/${jobId}`)}
                        >
                            <Image source={Images.share} style={{ width: 18, height: 18, resizeMode: 'contain', tintColor: colors.text }} />
                        </TouchableOpacity>}
                    </View>
                    <Text style={{ ...TextStyles.textBase, color: colors.textBase }}>{details1?.small_description}</Text>
                    {!loading && <View style={{ marginTop: 15 }}>
                        {details1?.date && <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                            <Image source={Images.clock} style={{ height: 17, width: 17, marginTop: 2, opacity: 0.7, tintColor: colors.greyText }} />
                            <Text style={{ fontSize: textSize(10), fontFamily:FONTS.semibold,color:colors.greyText }}>{details1?.date}</Text>
                        </View>}
                        {details1?.qualification && <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                            <Image source={Images.deploma} style={{ height: 22, width: 20, marginTop: 2, tintColor: colors.greyText, opacity: 0.9 }} />
                            <View style={{ flexDirection: 'row' }}>
                                {details1?.qualification?.map((item, index) => { return (<Text style={{ fontSize: textSize(10), fontFamily:FONTS.semibold,color:colors.greyText }}>{item?.name + (details1?.qualification?.length != index + 1 ? ', ' : '')}</Text>) })}
                            </View>
                        </View>}
                        {details1?.departments?.length > 0 && <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                            <Image source={Images.otherJobs} style={{ height: 17, width: 17, marginTop: 2, tintColor: colors.greyText, opacity: 0.7, marginLeft: 2 }} />
                            <View style={{ flexDirection: 'row', gap: 2, flexWrap: 'wrap' }}>
                                {details1?.departments?.map((item, index) => { return (<Text style={{ fontSize: textSize(10), fontWeight: '500',color:colors.greyText,fontFamily:FONTS.semibold }}>{item?.name + (details1?.departments?.length != index + 1 ? ',' : '')}</Text>) })}
                            </View>
                        </View>}
                    </View>}
                    <View style={{ marginTop: 20 }}>
                        {!loading && details1?.table_of_content && <Text style={{...TextStyles.title2,color:colors.text}}>Job Description</Text>}
                        <View>
                            <RenderHtml
                                contentWidth={width}
                                source={{ html: details1?.table_of_content }}
                                baseStyle={{
                                    color: colors.textBase,
                                    marginTop: 10,
                                    fontSize: textSize(11),
                                    textAlign: 'justify',
                                    lineHeight: 25
                                }}
                                tagsStyles={{
                                    p: { ...TextStyles.textBase, color: colors.textBase },
                                    // p: {
                                    //     marginBottom: 20,
                                    //     fontSize: 16,
                                    //     lineHeight: 24,
                                    // },
                                    table: {
                                        width: '100%',
                                        borderWidth: 1,
                                        borderColor: '#000',
                                        borderCollapse: 'collapse',
                                    //    flexDirection:'row'
                                    },
                                    thead: {
                                        backgroundColor: '#f2f2f2',
                                    },
                                    th: {
                                        borderWidth: 1,
                                        borderColor: '#000',
                                        padding: 10,
                                        textAlign: 'left',
                                        fontWeight: 'bold',
                                    },
                                    tr: {
                                        borderWidth: 1,
                                        borderColor: '#000',
                                    },
                                    td: {
                                        borderWidth: 1,
                                        borderColor: '#000',
                                        padding: 10,
                                        textAlign: 'left',
                                    },
                                    figure: {
                                        margin: 0,
                                        padding: 0,
                                    },
                                   
                                }}
                            // source={source}
                            systemFonts={[...defaultSystemFonts, 'Poppins-SemiBold', 'Poppins-Regular', 'Poppins-Light', 'Poppins-Medium']}
                            />
                        </View>
                    </View>
                    <View>
                        <Image source={{ uri: details1?.job_image }} style={{ width: '100%', height: 300, resizeMode: 'contain' }} />
                    </View>
                    <View style={{ marginBottom: 50 }}>
                        {details2?.map((item, index) => {
                            return (
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ ...TextStyles.title2, color: colors.text }}>{item.sub_title}</Text>
                                    <View>
                                        <RenderHtml
                                            contentWidth={width}
                                            source={{ html: item.description }}
                                            tagsStyles={{
                                                p: { ...TextStyles.textBase, color: colors.textBase },
                                                figure: { width: screenWidth - 20, marginHorizontal: 1 },
                                                // figure: { width: '98%', marginHorizontal: 1, borderWidth: 0.3, borderColor: Colors.lightBlck },
                                                thead: { backgroundColor: Colors.blue2, color: Colors.white, borderWidth: 0.2, borderColor: Colors.blue2,fontFamily:FONTS.semibold },
                                                th: {backgroundColor: Colors.blue2, color: Colors.white, borderWidth: 0.2, borderColor: Colors.lightBlck, padding: 2, paddingLeft: 5, paddingVertical: 4, fontFamily:FONTS.semibold},
                                                td: { borderWidth: 0.2, borderColor: Colors.lightBlck3, padding: 2, paddingLeft: 5, paddingVertical: 4, color: colors.textBase,fontFamily:FONTS.regular },
                                                tbody: { paddingHorizontal: 2 },
                                                table: { marginTop: 10 },
                                                strong: {fontFamily:FONTS.semibold},
                                                ul: { ...TextStyles.textBase, marginRight: 5, color: colors.textBase },
                                                h5:{
                                                    fontSize:textSize(11),
                                                    fontFamily:FONTS.semibold
                                                },
                                                li:{...TextStyles.textBase, color: colors.textBase}
                                            }}
                                            systemFonts={[...defaultSystemFonts, 'Poppins-SemiBold', 'Poppins-Regular', 'Poppins-Light', 'Poppins-Medium']}

                                        />
                                    </View>
                                </View>
                            )
                        })}
                        {relatedJobs?.length > 0 && <View style={{ marginTop: 20 }}>
                            <Text style={{ ...TextStyles.title2, color: colors.text }}>Related Jobs</Text>
                            <View>
                                {relatedJobs?.map((item, index) => {
                                    return (
                                        <TouchableOpacity style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}
                                            onPress={() => NavigationService.navigate('JobDetails', { backPage: backPage, id: item.id, jobList: [...relatedJobs] })}
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
                                            <Text style={{ fontSize: textSize(11), fontWeight: '500', color: colors.greyText, flex: 1,fontFamily:FONTS.semibold }}>{item.title}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                        </View>}
                    </View>
                </ScrollView>
            </View>


        </View>
    )
}

export default RelatedJobDetails

const styles = StyleSheet.create({})