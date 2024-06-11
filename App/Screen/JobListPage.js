import { ActivityIndicator, FlatList, Image, Modal, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { appStyles, TextStyles } from '../Constants/Styles'
import NavigationService from '../Services/Navigation'
import { Images } from '../Constants/Images'
import { screenHeight, textSize } from '../Constants/PixelRatio'
import { Colors } from '../Constants/Colors'
import BackHeader from '../Components/BackHeader'
// import { Dropdown } from 'react-native-element-dropdown';
import JobList from '../Components/JobList'
import UseApi from '../ApiConf'
import { useTheme } from '@react-navigation/native'
import { FONTS } from '../Constants/Fonts'
import { useSelector } from 'react-redux'


const JobListPage = ({ route }) => {
    const { type, title, id, typeField, bookmarkList,backPage } = route.params;
    // const [currCategory, setCurrcategory] = useState(id ? id : '');
    const [jobTypes, setJobTypes] = useState([]);
    const [jobs, setJobs] = useState([]);
    const { Request } = UseApi();
    const scrollViewRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [currPage, setCurrPage] = useState(1);
    const [maxPageNum, setMaxPageNum] = useState(1);
    const [scrollCount, setScrollCount] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [currOptions, setCurrOptions] = useState({ ids: id ? id : '', names: '' });
    const { colors } = useTheme();
    const { userData } = useSelector(state => state.User);


    useEffect(() => {
        // console.log('type...',type,'id',id,'title....',title);
        if (type) {
            getJobsByTypes();
        }
    }, []);
    useEffect(() => {
        getJobList(1);
        if (currPage > 1) setCurrPage(1);
    }, [currOptions.ids]);

    // useEffect(() => {
    //     if (scrollCount != 0) {
    //         viewMoreJobs();
    //     }
    // }, [scrollCount]);


    const getJobsByTypes = async () => {
        let data;
        try {
            data = await Request('category', 'POST', { type: type });
        } catch (err) {
            console.log('err...', err);
        }
        // console.log('data...',data);
        if (data?.status) {
            // console.log('data...', data);
            setJobTypes(data.category_list);
            if (id) {
                let category = data.category_list?.filter(itm => itm.id == id);
                setCurrOptions({ ids: category[0].id, names: category[0].name });
                setSelectedOptions({ [category[0].name]: true });
            }
        }
        // setLoading(false);
    }

    const getJobList = async (currpage, viewMore) => {
        setLoading(true);
        let perpage = 20;
        let params = {
            type: bookmarkList ? '3' : '2',
            perPage: `${perpage}`,
            page: currpage ? currpage : 1,
            up_coming: title != 'Upcoming Jobs' ? '0' : '1',
            user_id: userData ? userData.id : ''
        }
        if (typeField) {
            params = { ...params, [typeField]: currOptions.ids }
        }
        let data;
        console.log('params...', params);
        try {
            data = await Request('job-list', 'POST', params);
        } catch (err) {
            console.log('err...', err);
        }
        console.log('data list..', data);
        if (data?.status) {
            // console.log('data...', data);
            if (viewMore) {
                // console.log('view more2....');
                if (data.job_list?.length > 0) {
                    setJobs(pre => [...pre, ...data.job_list]);
                    setMaxPageNum(Math.floor(data.total_job_avail / perpage) + 1);
                }
            } else {
                setJobs(data.job_list);
            }
        }
        setLoading(false);
    }

    const viewMoreJobs = async () => {
        console.log('view more...');
        if (maxPageNum >= currPage) {
            setScrollCount(pre => pre + 1);
            setCurrPage(currPage + 1);
            getJobList(currPage + 1, true);
        }
    }

    // const handleScroll = (event) => {
    //     const { layoutMeasurement, contentOffset, contentSize } = event?.nativeEvent;
    //     const paddingToBottom = 10;
    //     if (layoutMeasurement?.height + contentOffset?.y >= contentSize?.height - paddingToBottom) {
    //         //   viewMoreJobs();
    //         // handleLoadMore();
    //         setScrollCount(pre => pre + 1);
    //         console.log('handlescroll 3....');
    //     }
    // };

    // const debounce = (func, delay) => {
    //     let timeoutId;
    //     return (...args) => {
    //       if (timeoutId) {
    //         clearTimeout(timeoutId);
    //       }
    //       timeoutId = setTimeout(() => {
    //         func(...args);
    //       }, delay);
    //     };
    //   };

    //   const handleLoadMore = useCallback(debounce(() => {
    //     if (!loading) {
    //     //   handleScroll();
    //     viewMoreJobs();
    //     }
    //   }, 300), [loading]);

    const onPressSubmit = () => {
        let nameStr = '';
        let idStr = '';
        jobTypes.forEach((item, index) => {
            if (selectedOptions[item.name]) {
                nameStr = nameStr + (nameStr ? ', ' : '') + item.name;
                idStr = idStr + (idStr ? ',' : '') + item.id;
            }
        });
        setCurrOptions({ ids: idStr, names: nameStr });
        console.log('{ ids: idStr, names: nameStr }..', { ids: idStr, names: nameStr });
        setOpenModal(false);
    }

    return (
        <View style={{ ...appStyles.pageStyle, backgroundColor: colors.background }}>
            <StatusBar
                translucent={true}
                backgroundColor="black"
            />

            <View style={appStyles.pageFrame}>
                <BackHeader title={title ? title : null}
                    onPress={() => backPage?NavigationService.navigate(backPage):NavigationService.navigate('Home')}
                />

                <View style={{ alignSelf: 'center', width: '97%', marginTop: 0, marginBottom: typeField ? 330 : 40 }}>
                    {!bookmarkList &&
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ fontSize: textSize(11), color: colors.greyText }}>Select Category</Text>
                            <Pressable style={{ ...styles.dropdwon, borderColor: colors.greyText, backgroundColor: colors.lightGray }}
                                onPress={() => typeField ? setOpenModal(true) : NavigationService.navigate('JobSearch', { backPage: 'JobListPage', title: title })}
                            >
                                <Text style={{ color: colors.greyText }}>{currOptions.names ? currOptions.names : 'Select'}</Text>
                                <Image
                                    source={Images.dropdwon}
                                    style={{ height: 12, width: 12, tintColor: Colors.greyText }}
                                />
                            </Pressable>
                        </View>}
                    <View style={{ height: screenHeight, paddingBottom: 100, marginTop: 20 }}>
                        <JobList jobList={jobs} loading={loading} viewMore={viewMoreJobs} count={scrollCount} backPage={backPage?backPage:null}/>
                    </View>
                </View>
                {/* <JobList jobList={jobs} loading={loading} viewMore={viewMoreJobs} type={'Upcoming Jobs'} count={scrollCount} /> */}
                <Modal
                    visible={openModal}
                    transparent
                    onRequestClose={() => setOpenModal(false)}
                >
                    <View style={styles.filterModelContainer}>
                        <View style={{ ...styles.filtermodel, backgroundColor: colors.background }}>
                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                <Pressable style={{ paddingHorizontal: 2 }}
                                    onPress={() => setOpenModal(false)}
                                >
                                    <Image
                                        source={Images.backArrow}
                                        style={{ height: 15, width: 10, marginTop: 3, tintColor: colors.greyText }}
                                    />
                                </Pressable>
                                <Text style={{ marginLeft: 10, color: colors.greyText, fontFamily: FONTS.regular }}>Select Category</Text>
                            </View>

                            <FlatList
                                keyExtractor={(itm, index) => index.toString()}
                                data={jobTypes}
                                style={{ height: screenHeight - 400 }}
                                renderItem={({ item }) => {
                                    return (
                                        <Pressable style={{ ...styles.optoinBtn, backgroundColor: colors.lightGray, borderColor: colors.greyText }}
                                            onPress={() => setSelectedOptions(pre => ({ ...pre, [item.name]: !selectedOptions[item.name] }))}
                                        >
                                            <View style={{ flexDirection: 'row', gap: 5, flex: 6 }}>
                                                <Image
                                                    source={{ uri: item.image }}
                                                    style={{ height: 20, width: 20 }}
                                                />
                                                <Text style={{ marginLeft: 10, color: colors.greyText, fontFamily: FONTS.regular }}>{item.name}</Text>
                                            </View>
                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <View style={{ ...styles.circle, borderColor: colors.greyText, backgroundColor: selectedOptions[item.name] ? colors.text : colors.background }}></View>
                                            </View>
                                        </Pressable>
                                    )
                                }} />

                            <Pressable style={{ ...appStyles.btn, backgroundColor: colors.btnColor, borderColor: colors.greyText, marginBottom: 10 }}
                                onPress={onPressSubmit}
                                disabled={loading}
                            >
                                <Text style={{ color: Colors.white, textAlign: 'center', fontSize: textSize(12), fontFamily: FONTS.medium }}>{loading ? 'Precessing...' : 'Submit'}</Text>
                            </Pressable>
                        </View>
                    </View>

                </Modal>
            </View>
        </View>
    )
}

export default JobListPage

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
        borderWidth: 0.5,
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