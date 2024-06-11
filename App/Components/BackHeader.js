import { Image, Pressable, Share, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Images } from '../Constants/Images'
import { screenWidth, textSize } from '../Constants/PixelRatio'
import { Colors } from '../Constants/Colors'
import NavigationService from '../Services/Navigation'
import { useTheme } from '@react-navigation/native'
import { FONTS } from '../Constants/Fonts'

const BackHeader = ({ onPress, title, border }) => {
    const {colors} = useTheme();

    return (
        <View style={{backgroundColor:colors.background}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop: 10}}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                    <Pressable
                        onPress={onPress ? onPress : () => NavigationService.navigate('Home')}
                        style={{ marginRight: 14 }}
                    >
                        <Image
                            source={Images.leftArrow}
                            style={{
                                height: 25,
                                width: 25,
                                tintColor:colors.text
                            }}
                        />
                    </Pressable>
                    <Text style={{ fontSize: textSize(13),fontFamily:FONTS.regular, color: colors.text }}>{title ? title : 'JOBTRIGGER'}</Text>
                </View>
                {/* <Pressable
                    onPress={shareLink}
                    style={{marginRight:5}}
                >
                    <Image
                        source={Images.share}
                        style={{
                            height: 18,
                            width: 18,
                            marginTop: 2
                        }}
                    />
                </Pressable> */}
            </View>

            <View style={{ borderTopColor: colors.greyText, borderTopWidth: 0.2, marginTop: 15, opacity: 0.4, width: screenWidth, alignSelf: 'center' }} />
        </View>
    )
}

export default BackHeader

const styles = StyleSheet.create({})