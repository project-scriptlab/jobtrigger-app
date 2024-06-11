import { ActivityIndicator, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextStyles, appStyles } from '../Constants/Styles'
import BackHeader from '../Components/BackHeader'
import UseApi from '../ApiConf'
import { textSize } from '../Constants/PixelRatio'
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import { Colors } from '../Constants/Colors'
import NavigationService from '../Services/Navigation'
import { useTheme } from '@react-navigation/native'
import { FONTS } from '../Constants/Fonts'

const OtherJobDetails = (props) => {
    const { id, title } = props.route.params;
    const { width } = useWindowDimensions();
    const { Request } = UseApi();
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState(null);
    const { colors } = useTheme();

    useEffect(() => {
        getDetails();
    }, []);

    const getDetails = async () => {
        setLoading(true)
        let params = {
            id: id
        }
        let details;
        try {
            details = await Request('section-details', 'POST', params);
        } catch (err) {
            console.log('err...', err);
        }
        if (details?.status && details?.section_details?.length > 0) {
            console.log('details...', details);
            setDetails(details?.section_details[0]);
        }
        setLoading(false)
    }
    return (
        <View style={{ ...appStyles.pageStyle, backgroundColor: colors.background }}>
            <StatusBar
                translucent={true}
                backgroundColor="black"
            />
            <View style={{ ...appStyles.pageFrame, paddingBottom: StatusBar.currentHeight + 10 }}>
                <BackHeader title={title ? title : null} />
                {loading && <ActivityIndicator size={28} style={{ marginTop: 200 }} />}
                <ScrollView style={{ marginTop: 10, paddingHorizontal: 10 }}>
                    <Text style={{ ...TextStyles.title2, color: colors.text }}>{details?.title}</Text>
                    <Text style={{ ...TextStyles.textBase, color: colors.textBase }}>{details?.small_description}</Text>
                    <View>
                        <Image source={{ uri: details?.job_image }} style={{ width: '100%', height: 300, resizeMode: 'contain' }} />
                    </View>
                    <View>
                        <RenderHtml
                            contentWidth={width}
                            source={{ html: details?.description }}
                            tagsStyles={{
                                p: { ...TextStyles.textBase, color: colors.textBase },
                                figure: { width: '98%', marginHorizontal: 1, borderWidth: 0.3, borderColor: Colors.lightBlck },
                                thead: { backgroundColor: Colors.blue2, color: Colors.white, borderWidth: 0.2, borderColor: Colors.blue2 },
                                th: { borderWidth: 0.2, borderColor: Colors.white, padding: 2, paddingLeft: 5, paddingVertical: 4, fontWeight: '400', color: colors.text },
                                td: { borderWidth: 0.2, borderColor: Colors.lightBlck2, padding: 2, paddingLeft: 5, paddingVertical: 4, color: colors.textBase },
                                strong: { fontFamily: FONTS.medium },
                                ul: { ...TextStyles.textBase, marginRight: 5, color: colors.textBase }
                            }}
                            systemFonts={[...defaultSystemFonts, 'Poppins-SemiBold', 'Poppins-Regular', 'Poppins-Light', 'Poppins-Medium']}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', gap: 5 }}>
                        <Pressable
                            onPress={() => NavigationService.navigate('JobDetails', { backPage: 'OtherJobDetails', id: `${details?.job_id}`, sectionId: `${id}` })}>
                            <Text style={{ ...TextStyles.title2, marginTop: 10, color: colors.text }}>Post Details: <Text style={{ ...TextStyles.textBase, color: colors.skyBlue, textDecorationLine: 'underline' }}> {details?.job_title}</Text>
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
}

export default OtherJobDetails

const styles = StyleSheet.create({})