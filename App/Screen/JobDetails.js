import { ActivityIndicator, FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TextStyles, appStyles } from '../Constants/Styles'
import BackHeader from '../Components/BackHeader'
import NavigationService from '../Services/Navigation'
import UseApi from '../ApiConf'
// import { Colors } from '../Constants/Colors'
import { screenWidth, textSize } from '../Constants/PixelRatio'
// import { Images } from '../Constants/Images'
// import { WebView } from 'react-native-webview';
// import { RenderHTML } from 'react-native-render-html';
// import RenderHtml from 'react-native-render-html';
import JobDetailsCard from '../Components/JobDetailsCard'
import { useTheme } from '@react-navigation/native'
import { useSelector } from 'react-redux'

const JobDetails = ({ route }) => {
    // console.log('route?.params....', route?.params);
    const { slug, id, backPage, sectionId, jobList } = route?.params;
    const [propData, setPropData] = useState({ id: id, backPage: backPage, sectionId: sectionId, jobList: jobList, slug: slug });
    const { Request } = UseApi();
    const [loading, setLoading] = useState(false);
    const [detailsList, setDetailsList] = useState([]);
    const [jobIds, setJobIds] = useState(slug ? [''] : [id]);
    const { colors } = useTheme();
    const { userData } = useSelector(state => state.User);
    // const hasMounted = useRef(false);


    useEffect(() => {
        getJoList();
    }, [propData]);

    // useEffect(() => {
    //     if (hasMounted.current) {
    //         // This code will only run when the dependency changes, not on initial render
    //         // let { slug, id, backPage, sectionId, jobList } = route?.params;
    //         setDetailsList([]);
    //         setJobIds(route?.params?.slug ? [''] : [route?.params?.id]);
    //         setPropData({
    //             id: route?.params?.id,
    //             backPage: route?.params?.backPage,
    //             sectionId: route?.params?.sectionId,
    //             jobList: route?.params?.jobList,
    //             slug: route?.params?.slug
    //         });

    //     } else {
    //         hasMounted.current = true;
    //     }
    //     console.log('route changes.....');

    // }, [route]);


    const getJoList = () => {
        if (propData?.jobList?.length > 0) {
            let list = [];
            propData?.jobList.forEach(itm => {
                if (itm.job_id) {
                    if (itm.job_id != propData.id) {
                        list = [...list, itm.job_id];
                    }
                } else {
                    if (itm.id != propData.id) {
                        list = [...list, itm.id];
                    }
                }
            });
            console.log('jobList...', propData.jobList);
            console.log('list...', list);
            let arr = [...jobIds, ...list]
            console.log('arr...', arr);
            setJobIds(pre => [...pre, ...list]);
            getJobDetails(false, arr, 0);
        } else {
            getJobDetails(false, jobIds, 0, propData.slug);
        }
    }


    const getJobDetails = async (showLoading, arr, currInd, slug) => {
        if (showLoading) {
            setLoading(true)
        }
        let params = {
            type: '1',
            // id: Id ? Id : id
            id: slug ? '' : arr[currInd],
            slug: slug ? slug : '',
            user_id: userData ? userData.id : ''
        }
        let details;
        try {
            details = await Request('job-list', 'POST', params);
        } catch (err) {
            console.log('err...', err);
        }
        if (details?.status && details.job_details?.length > 0) {
            console.log('details...', details);
            let detail = { detail1: null, detail2: null, relatedJobs: [], bookmark: false };
            if (details.job_details[0]) {
                detail.detail1 = details.job_details[0];
            }
            if (details.job_details[1]) {
                detail.detail2 = details.job_details[1]?.in_detail;
            }
            console.log('details.bookmark == 1....', details.bookmark == 1);
            if (details.bookmark == 1) {
                detail.bookmark = true;
            }
            if (detail.detail1) {
                // getRelatedJobs(arr[currInd], detail);
                getRelatedJobs(detail.detail1?.id ? detail.detail1?.id : arr[currInd], detail);
                // setDetailsList(pre => [...pre, detail]);
                if (currInd + 1 < arr.length) {
                    getJobDetails(false, arr, currInd + 1);
                }
            }
        }
        if (showLoading) {
            setLoading(false);
        }
    }

    const getRelatedJobs = async (jobId, detail) => {

        let data;
        try {
            data = await Request('related-jobs', 'POST', { job_id: jobId });
        } catch (err) {
            console.log('err...', err);
        }
        console.log('data...', data);
        if (data?.status) {
            detail.relatedJobs = data.related_jobs
            setDetailsList(pre => [...pre, detail]);
        }
    }

    // const onPressRelatedJobs = (Id, backPage, Joblist) => {
    //     setJobIds([Id]);
    //     setDetailsList([])
    //     setPropData(pre => ({ ...pre, id: Id, backPage: backPage, sectionId: null, jobList: Joblist }));
    //     // getJoList();
    // }

    // const handleScrollEnd = (event) => {
    //     const offsetX = event.nativeEvent.contentOffset.x;
    //     const index = Math.round(offsetX / width);
    //     console.log('index...', index);
    //     // setCurrentIndex(index);
    // };

    // const onPageSliding = ()=>{
    //     console.log('page sliding....');
    // }

    return (
        <View style={{ ...appStyles.pageStyle, backgroundColor: colors.background }}>
            <StatusBar
                translucent={true}
                backgroundColor="black"
            />
            <View style={{}}>
                <View style={{ ...appStyles.pageFrame }}>
                    <BackHeader title={'Job Details'} onPress={() => propData.backPage ? NavigationService.navigate(`${propData.backPage}`, { id: propData.sectionId ? propData.sectionId : propData.id }) : NavigationService.navigate('Home')} />
                </View>
                {loading && <ActivityIndicator size={28} style={{ marginTop: 200 }} />}

                <FlatList
                    // data={detailsList}
                    data={jobIds}
                    horizontal
                    pagingEnabled
                    //  snapToInterval={screenWidth}
                    // onMomentumScrollEnd={handleScrollEnd}
                    // onViewableItemsChanged={onViewRef.current}
                    // viewabilityConfig={viewConfigRef.current}
                    // ref={flatListRef}
                    // viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                        // console.log('detail1...',item)
                        // console.log('detail2...',item.detail2)
                        return (
                            <View style={{ width: screenWidth, paddingHorizontal: 15 }}>
                                {detailsList[index] ? <JobDetailsCard
                                    details1={detailsList[index].detail1}
                                    details2={detailsList[index].detail2}
                                    bookmark={detailsList[index].bookmark}
                                    loading={loading}
                                    relatedJobs={detailsList[index]?.relatedJobs}
                                    id={item}
                                    slug={propData.slug}
                                    backPage={propData.backPage}
                                    jobList={jobList}
                                // onPressRelatedJobs={onPressRelatedJobs}
                                // navigation={navigation}
                                />
                                    :
                                    <>
                                        {!loading && <ActivityIndicator size={28} style={{ marginTop: 200 }} />}
                                    </>
                                }
                            </View>
                        )
                    }}
                />
            </View>
        </View>
    )
}

export default JobDetails

const styles = StyleSheet.create({})