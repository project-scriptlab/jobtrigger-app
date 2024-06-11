import { ActivityIndicator, FlatList, Image, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { appStyles } from '../Constants/Styles'
import BackHeader from '../Components/BackHeader'
import UseApi from '../ApiConf'
import { Images } from '../Constants/Images'
import NavigationService from '../Services/Navigation'
import { textSize } from '../Constants/PixelRatio'
import { Colors } from '../Constants/Colors'
import { useTheme } from '@react-navigation/native'
import { FONTS } from '../Constants/Fonts'

const Notification = () => {
    const [loading, setLoading] = useState(false);
    const { Request } = UseApi();
    const [notifications, setNotifications] = useState([]);
    const {colors} = useTheme();
    

    useEffect(() => {
        getNotifications();
    }, []);

    const getNotifications = async () => {
        setLoading(true);
        let params = {
            type: '1',
            // id: id
        }
        try {
            data = await Request('notification', 'POST',params);
        } catch (err) {
            console.log('err...', err);
        }
        console.log('data...', data);
        if (data?.status) {
            setNotifications(data.notifications);
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
                <BackHeader title={'Notifications'} />
                {loading && <ActivityIndicator size={28} style={{ marginTop: 150 }} />}
                <View style={{ marginTop: 5,marginBottom:120 }}>
                    <FlatList
                        data={notifications}
                        showsVerticalScrollIndicator={false}
                        renderItem={({ item }) => {
                            return (
                                <View>
                                    <Pressable style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}
                                        onPress={() => NavigationService.navigate('JobDetails', { backPage: 'Notification', id: item.job_id })}
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
                                        <Text style={{ fontSize: textSize(11), fontWeight: '500', color: colors.text, flex: 1 ,fontFamily:FONTS.semibold}}>{item?.body?.replace(/&nbsp;/g, ' ')}</Text>
                                    </Pressable>
                                    <Text style={{ fontSize: textSize(10), color: colors.textBase,marginLeft:28,marginTop:2,fontFamily:FONTS.medium}}>{item.time}</Text>
                                </View>
                            )
                        }}
                        keyExtractor={(itm, index) => index.toString()}
                    />
                </View>
            </View>
        </View>
    )
}

export default Notification

const styles = StyleSheet.create({})