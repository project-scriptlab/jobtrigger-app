import { Alert, Image, Linking, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Images } from '../Constants/Images'
import { screenHeight, screenWidth, textSize } from '../Constants/PixelRatio'
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import { Colors } from '../Constants/Colors';
import { TextStyles } from '../Constants/Styles';
import UseApi from '../ApiConf';
import NavigationService from '../Services/Navigation';
import { useTheme } from '@react-navigation/native';
import { FONTS } from '../Constants/Fonts';
import { useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';

const JobDetailsCard = ({ details1, details2, loading, relatedJobs, id, slug, backPage, bookmark, jobList }) => {
    const { width } = useWindowDimensions();
    const { shareLink, Request } = UseApi();
    const { colors } = useTheme();
    const [bookmarked, setBookMark] = useState(bookmark);
    const [qualifications, setQualifications] = useState('');
    const [departments, setDepartments] = useState('');
    const { userData } = useSelector(state => state.User);

    useEffect(() => {
        // console.log('details2....', details2);
        // console.log('details1....', details1);
        console.log('id...', id);
        // console.log('bookmarked...',bookmarked);
        // console.log('bookmark...',bookmark);
        // setBookMark(bookmark);
        // let str = '';
        // details1?.qualification?.forEach((item,index)=>{
        //   str = item?.name + (details1?.qualification?.length != index + 1 ? ', ' : '');
        // });
        //    setQualifications(str);
        // let str2 = '';
        // details1?.departments?.forEach((item,index)=>{
        //   str2 = item?.name + (details1?.departments?.length != index + 1 ? ', ' : '');
        // });
        //    setDepartments(str2);
    }, []);

    const addBookmark = async () => {
        if (!userData) {
            Alert.alert('','Do you want to Sign in to save your job?', [
                { text: 'No',onPress:()=>console.log('no'), style: 'No' },
                { text: 'Yes', onPress: () => NavigationService.navigate('Profile', { nextToLoginPage: 'JobDetails', backParams: { id: details1?.id, backPage: backPage, jobList: jobList } }) },
            ]);
           
            // return;
        }
        let params = {
            user_email: userData?.email,
            job_id: details1?.id
        }

        let data;
        console.log('params...', params);
        try {
            data = await Request('user-bookmark', 'POST', params);
        } catch (err) {
            console.log('err...', err);
        }
        console.log('data...', data);
        if (data?.status) {
            setBookMark(!bookmarked);
            if (!bookmarked) {
                Toast.show('Job saved successfully.');
            } else {
                Toast.show('Job removed from saved list successfully.');
            }
        }
    }

    return (
        <View>
            <ScrollView style={{ paddingHorizontal: 5, marginTop: 10, marginBottom: 30 }} showsVerticalScrollIndicator={false}>
                {(!details1 || details1?.in_detail?.length == 0) && (!details2 || details2?.length == 0) && <Text style={{ marginTop: screenHeight / 3, textAlign: 'center', fontSize: textSize(12), color: colors.greyText }}>Not Found !</Text>}
                <View style={{ flexDirection: 'row', gap: 5 }}>
                    <Text style={{ ...TextStyles.title2, color: colors.text }}>{details1?.job_title}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', gap: 2 }}>
                        {details1?.locations?.map((itm, ind) => {
                            return (
                                <>
                                    {ind < 2 && <Text style={{ fontSize: textSize(10), fontWeight: '500', color: colors.skyBlue }}>{itm.name + ','}</Text>}
                                </>
                            )
                        })}
                        {details1?.states?.map((itm, ind) => {
                            return (
                                <>
                                    {ind < 1 && <Text style={{ fontSize: textSize(10), fontWeight: '500', color: colors.skyBlue }}>{itm.name}</Text>}
                                </>
                            )
                        })}
                    </View>
                    {!(!details1 || details1?.in_detail?.length == 0) && !(!details2 || details2?.length == 0) &&
                        <View
                            style={{ flexDirection: 'row', gap: 10 }}>
                            <TouchableOpacity
                                style={{ paddingHorizontal: 5, paddingVertical: 5 }}
                                onPress={addBookmark}
                            >
                                <Image source={bookmarked ? Images.bookmark2 : Images.bookmark} style={{ width: 18, height: 18, resizeMode: 'contain', tintColor: colors.text }} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ paddingHorizontal: 5, paddingVertical: 5 }}
                                onPress={() => shareLink(`${slug ? slug : details1?.job_slug}`)}
                            >
                                <Image source={Images.share} style={{ width: 18, height: 18, resizeMode: 'contain', tintColor: colors.text }} />
                            </TouchableOpacity>
                        </View>}
                </View>
                <Text style={{ ...TextStyles.textBase, color: colors.textBase }}>{details1?.small_description}</Text>
                {!loading && <View style={{ marginTop: 15 }}>
                    {details1?.date && <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                        <Image source={Images.clock} style={{ height: 17, width: 17, marginTop: 2, opacity: 0.7, tintColor: colors.greyText }} />
                        <Text style={{ fontSize: textSize(10), fontFamily: FONTS.semibold, color: colors.greyText }}>{details1?.date}</Text>
                    </View>}
                    {details1?.qualification && <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                        <View style={{}}>
                            <Image source={Images.deploma} style={{ height: 22, width: 20, marginTop: 2, opacity: 0.9, tintColor: colors.greyText }} />
                        </View>
                        <View style={{}}>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 5 }}>
                                {details1?.qualification?.map((item, index) => { return (<Text style={{ fontSize: textSize(10), fontFamily: FONTS.semibold, color: colors.greyText }}>{item?.name + (details1?.qualification?.length != index + 1 ? ', ' : '')}</Text>) })}
                            </View>
                        </View>
                    </View>}
                    {details1?.departments?.length > 0 && <View style={{ flexDirection: 'row', gap: 10, marginTop: 5 }}>
                        <Image source={Images.otherJobs} style={{ height: 17, width: 17, marginTop: 2, tintColor: colors.greyText, opacity: 0.7, marginLeft: 2 }} />
                        <View style={{ flexDirection: 'row', columnGap: 5, flexWrap: 'wrap' }}>
                            {details1?.departments?.map((item, index) => { return (<Text style={{ fontSize: textSize(10), fontFamily: FONTS.semibold, color: colors.greyText }}>{item?.name + (details1?.departments?.length != index + 1 ? ',' : '')}</Text>) })}
                        </View>
                    </View>}
                </View>}
                <View style={{ marginTop: 20 }}>
                    {!loading && details1?.table_of_content && <Text style={{ ...TextStyles.title2, color: colors.text }}>Job Description</Text>}
                    <View>
                        <RenderHtml
                            contentWidth={width}
                            source={{ html: details1?.table_of_content }}
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
                                }
                            }}
                            systemFonts={[...defaultSystemFonts, 'Poppins-SemiBold', 'Poppins-Regular', 'Poppins-Light', 'Poppins-Medium']}

                        // source={source}
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
                                        baseStyle={{
                                            color: colors.textBase,
                                            marginTop: 10,
                                            fontSize: textSize(11),
                                            textAlign: 'justify',
                                            lineHeight: 25
                                        }}
                                        tagsStyles={{
                                            p: { ...TextStyles.textBase, color: colors.textBase },
                                            figure: { marginHorizontal: 1, width: screenWidth - 60 },
                                            // figure: { width: '98%', marginHorizontal: 1, borderWidth: 0.3, borderColor: Colors.lightBlck },
                                            thead: { backgroundColor: Colors.blue2, color: Colors.white, borderWidth: 0.2, borderColor: Colors.blue2, fontFamily: FONTS.semibold },
                                            th: { backgroundColor: Colors.blue2, color: Colors.white, borderWidth: 0.2, borderColor: Colors.lightBlck, padding: 2, paddingLeft: 5, paddingVertical: 4, fontFamily: FONTS.medium },
                                            td: { borderWidth: 0.2, borderColor: Colors.lightBlck3, padding: 2, paddingLeft: 5, paddingVertical: 4, color: colors.textBase },
                                            tbody: { paddingHorizontal: 2 },
                                            table: { marginTop: 10 },
                                            strong: { fontWeight: '500' },
                                            ul: { ...TextStyles.textBase, marginRight: 5, color: colors.textBase },
                                            h5: {
                                                fontSize: textSize(11)
                                            },
                                            h4: {
                                                fontSize: textSize(11)
                                            },
                                            li: { lineHeight: 25, fontFamily: FONTS.regular, color: colors.textBase, fontSize: textSize(10) }
                                        }}
                                        systemFonts={[...defaultSystemFonts, 'Poppins-SemiBold', 'Poppins-Regular', 'Poppins-Light', 'Poppins-Medium']}
                                    />
                                </View>
                            </View>
                        )
                    })}
                    {relatedJobs?.length > 0 && <View style={{ marginTop: 20 }}>
                        <Text style={TextStyles.title2}>Related Jobs</Text>
                        <View>
                            {relatedJobs?.map((item, index) => {
                                return (
                                    <TouchableOpacity style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}
                                        onPress={() => NavigationService.navigate('RelatedJobDetails', { backPage: backPage, jobId: item.id, id: id, slug: slug })}
                                    //    onPress={() => onPressRelatedJobs(backPage,item.id,relatedJobs)}
                                    //    onPress={() => {
                                    //     Linking.openURL(`https://www.jobtrigger.in/app/jobdetails/${item.id}`);
                                    //     // console.log('item.id...',item.id);
                                    // }}
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
                                        <Text style={{ fontSize: textSize(11), fontWeight: '500', color: colors.greyText, flex: 1 }}>{item.title}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </View>}
                </View>
            </ScrollView>
        </View>
    )
}

export default JobDetailsCard

const styles = StyleSheet.create({})