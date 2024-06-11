import { Image, ImageBackground, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Images } from '../../Constants/Images'
// import { Colors } from '../Constants/Colors'
import { moderateScale, screenHeight, textSize } from '../../Constants/PixelRatio'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Colors } from '../../Constants/Colors'
import { useTheme } from '@react-navigation/native'

const SplashScreen = () => {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const {colors} = useTheme();

    useEffect(() => {
        let text = 'JOB TRIGGER';
        const typingInterval = setInterval(() => {
            if (currentIndex === text.length) {
                clearInterval(typingInterval);
            } else {
                setDisplayedText(text.substring(0, currentIndex + 1));
                setCurrentIndex(currentIndex + 1);
            }
        }, 80);

        return () => clearInterval(typingInterval);
    }, [currentIndex]);

    const opacity = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            fontSize: 20,
            fontWeight: '600',
            marginTop: 5,
            color:colors.greyText
        };
    });

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 2000 });
    }, [opacity]);

    return (
        <ScrollView style={{ flex: 1, marginBottom: 10 }}>
            {/* <ImageBackground
                source={Images.pageBackgound}
                style={{ flex: 1, backgroundColor: "black" }}
            > */}
            <StatusBar
                translucent={true}
                // backgroundColor="transparent"
                backgroundColor={Colors.black}
                barStyle="light-content"
            />
            <Image
                source={Images.logo}
                style={{
                    // height: moderateScale(50),
                    width: '80%',
                    marginTop: screenHeight / 3.5,
                    alignSelf: 'center',
                    borderRadius: 400,
                    resizeMode: 'contain',
                    tintColor:colors.text,
                    backgroundColor:colors.background
                }}
            />

            <View style={{ alignItems: 'center', marginTop: 20, opacity: 0.6 }}>
                {/* <Text style={{ ...styles.textHead }}>School Management</Text> */}
                <Text style={{ ...styles.textHead,color:colors.skyBlue }}>{displayedText}</Text>
                {/* <Text style={{ ...styles.textHead }}>{animatedText}</Text> */}
                {/* <Text style={{ fontSize: moderateScale(16), fontWeight: '600', marginTop: 5 }}>Department of School Education</Text> */}
                <Animated.Text style={{
                    ...animatedStyles,
                    
                    // fontSize: moderateScale(16),
                    // fontWeight: '600',
                    // marginTop: 5
                }}>
                    Explore
                    Your Perfect Job Match Today!.
                </Animated.Text>
            </View>
            {/* </ImageBackground> */}
        </ScrollView>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    textHead: {
        // color: 'blue',
        color: Colors.deepGreen,
        // color: '#FF8C00',
        fontSize: textSize(25),
        fontWeight: '600'
    }
})