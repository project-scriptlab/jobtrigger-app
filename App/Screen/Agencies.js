import { ActivityIndicator, FlatList, Image, Linking, Modal, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { appStyles } from '../Constants/Styles'
import { useTheme } from '@react-navigation/native';
import BackHeader from '../Components/BackHeader';
import { FONTS } from '../Constants/Fonts';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { screenHeight, textSize } from '../Constants/PixelRatio';
import { Images } from '../Constants/Images';
import UseApi from '../ApiConf';
import { Colors } from '../Constants/Colors';

const tableData = [
    { name: 'Railway Recruitment Board - Siliguri', link: 'https://www.rrbsiliguri.gov.in/public-disclosure-of-non-recommended-willing-candidates.html' },
    { name: 'Railway Recruitment Board - Siliguri', link: 'https://www.rrbsiliguri.gov.in/public-disclosure-of-non-recommended-willing-candidates.html' },
    { name: 'Railway Recruitment Board - Siliguri', link: 'https://www.rrbsiliguri.gov.in/public-disclosure-of-non-recommended-willing-candidates.html' },
    { name: 'Railway Recruitment Board - Siliguri', link: 'https://www.rrbsiliguri.gov.in/public-disclosure-of-non-recommended-willing-candidates.html' },
]

const Agencies = () => {
    const { colors } = useTheme();
    const { Request } = UseApi();
    const [states, setStates] = useState([]);
    const [agnecies, setAgencies] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [currOptions, setCurrOptions] = useState({ ids: '', names: '' });

    useEffect(() => {
        getAgencies();
    }, [currOptions.ids]);

    useEffect(() => {
        getStates();
    }, []);

    const getStates = async () => {
        let data;
        try {
            data = await Request('category', 'POST', { type: '1' });
        } catch (err) {
            console.log('err...', err);
        }
        // console.log('data...',data);
        if (data?.status) {
            console.log('data...', data);
            // setJobTypes(data.category_list);
            setStates(data.category_list);
        }
        // setLoading(false);
    }

    const getAgencies = async () => {
        setLoading(true);
        let data;
        try {
            data = await Request('important-links', 'POST', { state_id: currOptions.ids});
        } catch (err) {
            console.log('err...', err);
        }
        // console.log('data...',data);
        if (data?.status) {
            console.log('data...', data);
          setAgencies(data.important_links);
        }
        setLoading(false);
    }
    const onPressSubmit = () => {
        let nameStr = '';
        let idStr = '';
        states.forEach((item, index) => {
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
            <View style={{ ...appStyles.pageFrame }}>
                <BackHeader title={'Recruitment Agencies'} />
                <View style={{ marginHorizontal: 5 }}>
                    <View style={{ marginTop: 15 }}>
                        {/* <TextInput
                            placeholder='Search By States'
                            placeholderTextColor={colors.greyText}
                            style={{ ...appStyles.intput, backgroundColor: colors.lightGray, borderColor: colors.greyText, fontSize: textSize(10), paddingLeft: 15 }}
                            value={selectedOptions.keyWord}
                            
                        // onChangeText={(val) => setSelectedOptoins(pre => ({ ...pre, keyWord: val }))}
                        /> */}
                        <Text style={{ fontSize: textSize(11), color: colors.greyText }}>Select States</Text>
                        <Pressable style={{ ...styles.dropdwon, borderColor: colors.greyText, backgroundColor: colors.lightGray }}
                            onPress={() => setOpenModal(true)}
                        >
                            <Text style={{ color: colors.greyText }}>{currOptions.names ? currOptions.names : 'Select'}</Text>
                            <Image
                                source={Images.dropdwon}
                                style={{ height: 12, width: 12, tintColor: Colors.greyText }}
                            />
                        </Pressable>
                        {/* <Pressable
                            // onPress={searchJobs}
                            style={{ position: 'absolute', top: 12, right: 10, }}>
                            <Image
                                source={Images.search}
                                style={{ height: 20, width: 20, tintColor: colors.greyText }}
                            />
                        </Pressable> */}
                    </View>
                    {loading  && <ActivityIndicator size={28} style={{ marginTop: screenHeight/3 }} />}
                   {agnecies.length > 0 && !loading && <View style={{ borderColor: colors.greyText, borderWidth: 0.7, marginTop: 30 }}>
                        <View style={{ flexDirection: 'row', gap: 2, backgroundColor: colors.blue }}>
                            <View style={{ flex: 0.8, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: FONTS.semibold, color: colors.text, textAlign: 'left', color: 'white' }}>SL.No</Text>
                            </View>
                            <View style={{ flex: 5, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: FONTS.semibold, color: colors.text, textAlign: 'center', color: 'white' }}> Agency</Text>
                            </View>
                            <View style={{ flex: 0.8, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontFamily: FONTS.semibold, color: colors.text, textAlign: 'center', color: 'white' }}>Link</Text>
                            </View>
                        </View>

                        <View>
                            {agnecies.map((item, index) => {
                                return (
                                    <View key={index} style={{ flexDirection: 'row', gap: 2, borderColor: colors.greyText, borderTopWidth: 0.5 }}>
                                        <View style={{ flex: 0.5, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontFamily: FONTS.regular, color: colors.text, textAlign: 'center' }}>{index + 1}</Text>
                                        </View>
                                        <View style={{ flex: 5, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontFamily: FONTS.regular, color: colors.text, textAlign: 'center' }}> {item.title}</Text>
                                        </View>
                                        <View style={{ flex: 0.8, paddingVertical: 8, alignItems: 'center', justifyContent: 'center' }}>
                                            <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
                                                <Text style={{ fontFamily: FONTS.regular, color: colors.skyBlue, textAlign: 'center' }}>Link</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>

                    </View>}
                </View>
                {agnecies.length == 0 && !loading && <Text style={{ textAlign: 'center', marginTop: screenHeight / 3,color:colors.greyText }}>No Records Found !</Text>}

            </View>
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
                            data={states}
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
    )
}

export default Agencies

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