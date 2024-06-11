import { ActivityIndicator, FlatList, Image, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { appStyles } from '../Constants/Styles'
import { Colors } from '../Constants/Colors'
import BackHeader from '../Components/BackHeader'
import { screenHeight, screenWidth, textSize } from '../Constants/PixelRatio'
import { Images } from '../Constants/Images'
import JobList from '../Components/JobList'
import UseApi from '../ApiConf'
import NavigationService from '../Services/Navigation'
import { useTheme } from '@react-navigation/native'
import { FONTS } from '../Constants/Fonts'

// const searchTypes = {
//     category: [
//         { name: 'Bank Jobs', icon: Images.bank },
//         { name: 'SSC Exams', icon: Images.sscLogo },
//         { name: 'Railway Jobs', icon: Images.railway },
//         { name: 'Other Jobs', icon: Images.otherJobs }
//     ],
//     location: [
//         { name: 'Andaman and Nicobar', icon: Images.island },
//         { name: 'Andhra', icon: Images.temple },
//         { name: 'Arunachal Pradesh', icon: Images.temple },
//         { name: 'Assam', icon: Images.temple },
//         { name: 'Bihar', icon: Images.budha },
//         { name: 'Chhattisgarh', icon: Images.temple }
//     ],
//     qualification: [
//         { name: 'Secondary', icon: Images.secondary },
//         { name: 'Deploma', icon: Images.deploma },
//         { name: 'Graduation', icon: Images.graduated },
//         { name: 'Post Graduation', icon: Images.degree },
//     ]
// }

const JobSearch = (props) => {
    // const {backPage} = props?.route?.params;
    const [showSearchList, setShowSearchList] = useState(false);
    // const [openFilterOptions, setOpenFilterOptions] = useState(false);
    const [currFilterType, setCurrFilterType] = useState({ type: '', options: [], open: false, name: '' });
    const [selectedOptions, setSelectedOptoins] = useState({ keyWord: '', category: {}, location: {}, qualification: {}, recruiter: {} });
    const [selectedNameIds, setSelectedNameIds] = useState({ categoryNames: '', categoryIds: '', locationNames: '', locationIds: '', qualificationNames: '', qualificationIds: '', recruiterNames: '', recruiterIds: '' });
    const [searchTypes, setSearchTypes] = useState({ category: [], location: [], qualification: [], recruiter: [] });
    const { Request } = UseApi();
    const scrollViewRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [currPage, setCurrPage] = useState(1);
    const [maxPageNum, setMaxPageNum] = useState(1);
    const [scrollCount, setScrollCount] = useState(0);
    const { colors } = useTheme();



    useEffect(() => {
        getJobsByTypes();
    }, []);

    const getJobsByTypes = async () => {

        let department;
        try {
            department = await Request('category', 'POST', { type: '5' });
        } catch (err) {
            console.log('err...', err);
        }
        if (department?.status) {
            console.log('department...', department);
            setSearchTypes(pre => ({ ...pre, category: department.category_list }));
        }

        let states;
        try {
            states = await Request('category', 'POST', { type: '1' });
        } catch (err) {
            console.log('err...', err);
        }
        if (states?.status) {
            console.log('states...', states);
            setSearchTypes(pre => ({ ...pre, location: states.category_list }));
        }

        let qualification;
        try {
            qualification = await Request('category', 'POST', { type: '4' });
        } catch (err) {
            console.log('err...', err);
        }
        if (qualification?.status) {
            console.log('qualification...', qualification);
            setSearchTypes(pre => ({ ...pre, qualification: qualification.category_list }));
        }
        let recruiter;
        try {
            recruiter = await Request('category', 'POST', { type: '2' });
        } catch (err) {
            console.log('err...', err);
        }
        if (recruiter?.status) {
            console.log('recruiter...', recruiter);
            setSearchTypes(pre => ({ ...pre, recruiter: recruiter.category_list }));
        }
        // setLoading(false);
    }

    const searchJobs = async (currpage, viewMore) => {
        setLoading(true);
        // let categoryStr = '';
        // searchTypes.category.forEach(item => {
        //      if(selectedOptions.category[item.name]){
        //         categoryStr = categoryStr+(categoryStr?',':'')+item.id;
        //      }
        // });
        // let locationStr = '';
        // searchTypes.location.forEach(item => {
        //      if(selectedOptions.location[item.name]){
        //         locationStr = locationStr+(locationStr?',':'')+item.id;
        //      }
        // });
        // let qualificationStr = '';
        // searchTypes.qualification.forEach(item => {
        //      if(selectedOptions.qualification[item.name]){
        //         qualificationStr = qualificationStr+(qualificationStr?',':'')+item.id;
        //      }
        // });
        const perpage = 20;
        let params = {
            type: '2',
            perPage: `${perpage}`,
            page: currpage ? currpage : 1,
            title: selectedOptions.keyWord,
            search_by_state: selectedNameIds.locationIds,
            search_by_qualification: selectedNameIds.qualificationIds,
            search_by_department: selectedNameIds.categoryIds,
            search_by_recruiter: selectedNameIds.recruiterIds
        }

        let data;
        console.log('params...', params);
        try {
            data = await Request('job-list', 'POST', params);
        } catch (err) {
            console.log('err...', err);
        }
        if (data?.status) {
            // console.log('data...', data);
            if (viewMore) {
                if (data.job_list?.length > 0) {
                    setJobs(pre => [...pre, ...data.job_list]);
                    setMaxPageNum(Math.floor(data.total_job_avail / perpage) + 1);
                }
            } else {
                setJobs(data.job_list);
            }
        }
        setShowSearchList(true);
        setLoading(false);
    }

    const onPressSubmit = () => {
        setScrollCount(0);
        setLoading(true);
        let categoryIdStr = '';
        let categoryNameStr = '';
        searchTypes.category.forEach(item => {
            if (selectedOptions.category[item.name]) {
                categoryIdStr = categoryIdStr + (categoryIdStr ? ',' : '') + item.id;
                categoryNameStr = categoryNameStr + (categoryNameStr ? ', ' : '') + item.name;
            }
        });
        let locationIdStr = '';
        let locationNameStr = '';
        searchTypes.location.forEach(item => {
            if (selectedOptions.location[item.name]) {
                locationIdStr = locationIdStr + (locationIdStr ? ',' : '') + item.id;
                locationNameStr = locationNameStr + (locationNameStr ? ', ' : '') + item.name;
            }
        });
        let qualificationIdStr = '';
        let qualificationNameStr = '';
        searchTypes.qualification.forEach(item => {
            if (selectedOptions.qualification[item.name]) {
                qualificationIdStr = qualificationIdStr + (qualificationIdStr ? ',' : '') + item.id;
                qualificationNameStr = qualificationNameStr + (qualificationNameStr ? ', ' : '') + item.name;
            }
        });
        let recruiterIdStr = '';
        let recruiterNameStr = '';
        searchTypes.recruiter.forEach(item => {
            if (selectedOptions.recruiter[item.name]) {
                recruiterIdStr = recruiterIdStr + (recruiterIdStr ? ',' : '') + item.id;
                recruiterNameStr = recruiterNameStr + (recruiterNameStr ? ', ' : '') + item.name;
            }
        });
        setSelectedNameIds({
            categoryNames: categoryNameStr,
            categoryIds: categoryIdStr,
            locationNames: locationNameStr,
            locationIds: locationIdStr,
            qualificationNames: qualificationNameStr,
            qualificationIds: qualificationIdStr,
            recruiterIds: recruiterIdStr,
            recruiterNames: recruiterNameStr
        });
        setLoading(false);
        setCurrFilterType(pre => ({ ...pre, open: false }));
    }

    const viewMore = () => {
        console.log('view more jov search2...');
        if (maxPageNum >= currPage) {
            setScrollCount(pre => pre + 1);
            setCurrPage(currPage + 1);
            searchJobs(currPage + 1, true);
        }
    }

    // const handleScroll = (event) => {
    //     console.log('handle scroll...');
    //     const { layoutMeasurement, contentOffset, contentSize } = event?.nativeEvent;
    //     const paddingToBottom = 10;
    //     if (layoutMeasurement?.height + contentOffset?.y >= contentSize?.height - paddingToBottom) {
    //         if (maxPageNum >= currPage) {
    //             setCurrPage(currPage + 1);
    //             searchJobs(currPage + 1, true);
    //             setScrollCount(pre => pre + 1);
    //         }
    //     }
    // }

    return (
        <View style={{ ...appStyles.pageStyle, backgroundColor: colors.background }}>
            <StatusBar
                translucent={true}
                backgroundColor={'black'}
            />
            {/* if (showSearchList) {
                            if (props?.route?.params?.backPage == 'JobListPage') {
                                NavigationService.navigate(props?.route?.params?.backPage, { type: '', title: props?.route?.params?.title, id: null, typeField: null });
                            }
                            else {
                                NavigationService.navigate('Home')
                            }
                        } else {
                            setShowSearchList(false);
                        } */}
            <View style={appStyles.pageFrame}>
                <BackHeader title={showSearchList ? 'Job List' : 'Job Search'}
                    onPress={() => {
                        if (showSearchList) {
                            setShowSearchList(false);
                        } else {
                            if (props?.route?.params?.backPage == 'JobListPage') {
                                NavigationService.navigate(props?.route?.params?.backPage, { type: '', title: props?.route?.params?.title, id: null, typeField: null });
                            }
                            else {
                                NavigationService.navigate('Home')
                            }
                        }
                        setScrollCount(0);
                        setCurrPage(1);
                        setMaxPageNum(1);
                    }}
                />
                {/* <ScrollView
                    ref={scrollViewRef}
                    style={{ alignSelf: 'center', width: '97%' }}
                    showsVerticalScrollIndicator={false}
                // onScroll={handleScroll}
                // scrollEventThrottle={16}
                >
                </ScrollView> */}
                {showSearchList && <View style={{ alignSelf: 'center', width: '97%', height: screenHeight }}>
                    <JobList jobList={jobs} loading={loading} viewMore={viewMore} backPage={'JobSearch'} count={scrollCount} />
                    {/* {loading && <ActivityIndicator size={28} style={{ marginTop: scrollCount > 0 ? 10 : 150, marginBottom: scrollCount > 0 ? 200 : 0 }} />} */}
                    {/* {loading && <ActivityIndicator size={28} style={{ marginTop: 10, paddingBottom: 20 }} />} */}
                </View>}

                {/* <FlatList
                    ListFooterComponent={() => {
                        return (<>
                        </>
                        )
                    }}
                /> */}

                {!showSearchList && <ScrollView style={{ alignSelf: 'center', width: '97%', marginTop: 20, height: screenHeight - 10 }} showsVerticalScrollIndicator={false}>
                    <View>
                        <Text style={{ fontSize: textSize(11), marginLeft: 5, color: colors.greyText, fontFamily: FONTS.regular }}>Find your dream job by entering either the keyword, location, qualification.</Text>
                        <View style={{ marginTop: 15 }}>
                            <TextInput
                                placeholder='Search By Keyword'
                                placeholderTextColor={colors.greyText}
                                style={{ ...appStyles.intput, backgroundColor: colors.lightGray, borderColor: colors.greyText, fontSize: textSize(10), paddingLeft: 15 }}
                                value={selectedOptions.keyWord}
                                onChangeText={(val) => setSelectedOptoins(pre => ({ ...pre, keyWord: val }))}
                            />
                            <Pressable
                                onPress={searchJobs}
                                style={{ position: 'absolute', top: 12, right: 10, }}>
                                <Image
                                    source={Images.search}
                                    style={{ height: 20, width: 20, tintColor: colors.greyText }}
                                />
                            </Pressable>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ color: colors.greyText, fontFamily: FONTS.regular }}>Select Category</Text>
                            <Pressable style={{ ...styles.dropdwon, backgroundColor: colors.lightGray, borderColor: colors.greyText }}
                                onPress={() => setCurrFilterType(pre => ({ ...pre, type: 'category', options: searchTypes.category, open: true, name: 'Category' }))}
                            >
                                <Text style={{ color: colors.greyText, fontFamily: FONTS.regular, fontFamily: FONTS.regular }}>{selectedNameIds.categoryNames ? selectedNameIds.categoryNames : 'Select'}</Text>
                                <Image
                                    source={Images.dropdwon}
                                    style={{ height: 12, width: 12, tintColor: colors.greyText }}
                                />
                            </Pressable>
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <Text style={{ color: colors.greyText, fontFamily: FONTS.regular }}>Select Location</Text>
                            <Pressable style={{ ...styles.dropdwon, backgroundColor: colors.lightGray, borderColor: colors.greyText }}
                                onPress={() => setCurrFilterType(pre => ({ ...pre, type: 'location', options: searchTypes.location, open: true, name: 'Location' }))}
                            >
                                <Text style={{ color: colors.greyText, fontFamily: FONTS.regular }}>{selectedNameIds.locationNames ? selectedNameIds.locationNames : 'Select'}</Text>
                                <Image
                                    source={Images.dropdwon}
                                    style={{ height: 12, width: 12, tintColor: colors.greyText }}
                                />
                            </Pressable>
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <Text style={{ color: colors.greyText, fontFamily: FONTS.regular }}>Select Qualification</Text>
                            <Pressable style={{ ...styles.dropdwon, backgroundColor: colors.lightGray, borderColor: colors.greyText }}
                                onPress={() => setCurrFilterType(pre => ({ ...pre, type: 'qualification', options: searchTypes.qualification, open: true, name: 'Qualification' }))}
                            >
                                <Text style={{ color: colors.greyText, fontFamily: FONTS.regular }}>{selectedNameIds.qualificationNames ? selectedNameIds.qualificationNames : 'Select'}</Text>
                                <Image
                                    source={Images.dropdwon}
                                    style={{ height: 12, width: 12, tintColor: colors.greyText }}
                                />
                            </Pressable>
                        </View>

                        <View style={{ marginTop: 20 }}>
                            <Text style={{ color: colors.greyText, fontFamily: FONTS.regular }}>Select Recruiter</Text>
                            <Pressable style={{ ...styles.dropdwon, backgroundColor: colors.lightGray, borderColor: colors.greyText }}
                                onPress={() => setCurrFilterType(pre => ({ ...pre, type: 'recruiter', options: searchTypes.recruiter, open: true, name: 'Recruiter' }))}
                            >
                                <Text style={{ color: colors.greyText, fontFamily: FONTS.regular }}>{selectedNameIds.recruiterNames ? selectedNameIds.recruiterNames : 'Select'}</Text>
                                <Image
                                    source={Images.dropdwon}
                                    style={{ height: 12, width: 12, tintColor: colors.greyText }}
                                />
                            </Pressable>
                        </View>

                        <Pressable style={{ ...appStyles.btn, backgroundColor: colors.btnColor, borderColor: colors.greyText, borderWidth: 0.2 }}
                            onPress={() => searchJobs()}
                            disabled={loading}
                        >
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: textSize(12), fontFamily: FONTS.medium }}>{loading ? 'Searching...' : 'Search'}</Text>
                        </Pressable>
                    </View>
                </ScrollView>}
            </View>

            <Modal
                visible={currFilterType.open}
                transparent
                onRequestClose={() => setCurrFilterType(pre => ({ ...pre, open: false }))}
            >
                <View style={styles.filterModelContainer}>
                    <View style={{ ...styles.filtermodel, backgroundColor: colors.background }}>
                        <View style={{ flexDirection: 'row', marginTop: 10 }}>
                            <Pressable style={{ paddingHorizontal: 2 }}
                                onPress={() => setCurrFilterType(pre => ({ ...pre, open: false }))}
                            >
                                <Image
                                    source={Images.backArrow}
                                    style={{ height: 15, width: 10, marginTop: 3, tintColor: colors.greyText }}
                                />
                            </Pressable>
                            <Text style={{ marginLeft: 10, color: colors.greyText }}>Select {currFilterType.name}</Text>
                        </View>
                        <FlatList
                            keyExtractor={(itm, index) => index.toString()}
                            data={currFilterType?.options}
                            style={{ height: screenHeight - 400 }}
                            renderItem={({ item }) => {
                                return (
                                    <Pressable style={{ ...styles.optoinBtn, backgroundColor: colors.lightGray, borderColor: colors.greyText }}
                                        onPress={() => setSelectedOptoins(pre => ({ ...pre, [currFilterType.type]: { ...selectedOptions[currFilterType.type], [item.name]: !selectedOptions[currFilterType.type][item.name] } }))}
                                    >
                                        <View style={{ flexDirection: 'row', gap: 5, flex: 6 }}>
                                            <Image
                                                source={{ uri: item.image }}
                                                style={{ height: 20, width: 20 }}
                                            />
                                            <Text style={{ marginLeft: 10, color: colors.greyText }}>{item.name}</Text>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                            <View style={{ ...styles.circle, borderColor: colors.greyText, backgroundColor: selectedOptions[currFilterType.type][item.name] ? colors.text : colors.background }}></View>
                                        </View>
                                    </Pressable>
                                )
                            }} />

                        <Pressable style={{ ...appStyles.btn, marginBottom: 10, backgroundColor: colors.btnColor, borderColor: colors.greyText, borderWidth: 0.5 }}
                            onPress={onPressSubmit}
                            disabled={loading}
                        >
                            <Text style={{ color: 'white', textAlign: 'center', fontSize: textSize(12) }}>{loading ? 'Precessing...' : 'Submit'}</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default JobSearch

const styles = StyleSheet.create({
    dropdwon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 5,
        borderWidth: 0.2,
        marginTop: 10
    },
    filterModelContainer: {
        height: screenHeight,
        backgroundColor: Colors.semiTransparent,
    },
    filtermodel: {
        minHeight: screenHeight - 30,
        backgroundColor: Colors.white2,
        marginHorizontal: 15,
        marginTop: 15,
        paddingHorizontal: 12
    },
    circle: {
        height: 16,
        width: 16,
        borderRadius: 10,
        borderWidth: 0.7,
        borderColor: Colors.black
    },
    optoinBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15,
        borderRadius: 5,
        borderWidth: 0.2,
        marginTop: 20,
        // flex:10
        // marginHorizontal: 10
    }
})