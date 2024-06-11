import { ActivityIndicator, FlatList, Image, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
// import { appStyles } from '../Constants/Styles'
import NavigationService from '../Services/Navigation'
// import { Images } from '../Constants/Images'
import { screenHeight, textSize } from '../Constants/PixelRatio'
import { Colors } from '../Constants/Colors'
import BackHeader from '../Components/BackHeader'
// import { Dropdown } from 'react-native-element-dropdown';
// import JobList from '../Components/JobList'
import UseApi from '../ApiConf'
import { appStyles, TextStyles } from '../Constants/Styles'
import { Images } from '../Constants/Images'
import { useTheme } from '@react-navigation/native'
import { FONTS } from '../Constants/Fonts'



const OtherJobList = (props) => {
    const { title, id } = props.route.params;
    const [jobs, setJobs] = useState([]);
    const { Request } = UseApi();
    const [loading, setLoading] = useState(false);
    const {colors} = useTheme();
    const [keyword,setKeyword] = useState('');

  
    useEffect(() => {
        if(keyword != ''){
            const cleartime = setTimeout(() => {
                getJobList();
            }, 600);
            return ()=>clearTimeout(cleartime);
        }else{
            getJobList();
        }
    }, [keyword]);



    const getJobList = async () => {
        setLoading(true);
        let params = {
            type: '6',
            id: id,
            title:keyword
        }

        let data;
        console.log('params...', params);
        try {
            data = await Request('jobmenu', 'POST', params);
        } catch (err) {
            console.log('err...', err);
        }
        console.log('data...', data);
        if (data?.status) {
            setJobs(data.section_list);
        }
        setLoading(false);
    }

    // const viewMoreJobs = async () => {
    //     // console.log('view more...');
    //     if(maxPageNum >= currPage){
    //         setCurrPage(currPage+1);
    //         getJobList(currPage+1,true);
    //     }
    // }

    // const handleScroll = (event) => {
    //     const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    //     const paddingToBottom = 10;
    //     if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
    //         //   loadMoreData();
    //         console.log('handlescroll 3....');
    //     }
    // };


    return (
        <View style={{...appStyles.pageStyle,backgroundColor:colors.background}}>
            <StatusBar
                translucent={true}
                backgroundColor="black"
            />

            <View style={appStyles.pageFrame}>
                <BackHeader title={title ? title : null} />
                {/* <ScrollView
                    ref={scrollViewRef}
                    style={{ alignSelf: 'center', width: '97%', marginTop: 15 }} showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                > */}
                <View style={{ alignSelf: 'center', width: '97%', marginTop: 0, marginBottom: 40 }}>
                    <View style={{ marginTop: 15 }}>
                        <TextInput
                            placeholder='Search By Keyword'
                            placeholderTextColor={colors.greyText}
                            style={{ ...appStyles.intput, backgroundColor:colors.lightGray,borderColor:colors.greyText,color:colors.greyText, fontSize: textSize(10), paddingLeft: 15 }}
                            value={keyword}
                            onChangeText={(val) => setKeyword(val)}
                        />
                        <Image
                            source={Images.search}
                            style={{ height: 20, width: 20, position: 'absolute', top: 12, right: 10, tintColor: colors.greyText }}
                        />
                    </View>
                    <View style={{ marginTop: 35 }}>
                        {(jobs?.length > 0 || !loading) && <FlatList
                            data={jobs}
                            // onEndReached={viewMore?viewMore:()=>null}
                            // onEndReachedThreshold={0}
                            showsVerticalScrollIndicator={false}
                            // onMomentumScrollEnd={()=>console.log('onMomentumScrollEnd...')}
                            renderItem={({ item, index }) => {
                                return (
                                    <Pressable style={{ flexDirection: 'row', gap: 10, flex: 6, marginBottom: 10, borderBottomWidth: 0.5, paddingBottom: 10, borderBottomColor: colors.lightBlck }}
                                        onPress={() => NavigationService.navigate('OtherJobDetails', { id: item.section_id, title: title })}
                                    >
                                        <View style={{ flex: 4.2 }}>
                                            <Text style={{ ...TextStyles.title3, marginBottom: 2,color:colors.text }}>{item.title}</Text>
                                            <Text style={{ marginBottom: 2,color:colors.greyText,fontFamily:FONTS.medium }}>{item.job_title}</Text>
                                        </View>
                                        <View style={{ flex: 1.5 }}>
                                            <Image
                                                // source={Images.jobImageSample}
                                                source={{ uri: item.job_list_image }}
                                                style={{
                                                    width: '100%',
                                                    height: 70,
                                                    resizeMode: 'stretch',
                                                    marginTop: 7
                                                }}
                                            />
                                        </View>
                                    </Pressable>
                                )
                            }}
                            keyExtractor={(itm, index) => index.toString()}
                        />}
                        {loading && <ActivityIndicator size={28} style={{ marginTop: 150 }} />}
                        {jobs.length == 0 && !loading && <Text style={{ textAlign: 'center', marginTop: screenHeight / 3, fontSize: textSize(11),color:colors.greyText }}>No Records Found !</Text>}
                        {/* <Text style={{ textAlign: 'center', marginTop: screenHeight / 3, fontSize: textSize(11),color:colors.greyText }}>No Records Found !</Text> */}
                    </View>
                </View>
                {/* </ScrollView> */}
            </View>
        </View>
    )
}

export default OtherJobList

const styles = StyleSheet.create({

})