import { StatusBar } from "react-native"
import { Colors } from "./Colors"
import { maxWidth, moderateScale, screenHeight, screenWidth, textSize } from "./PixelRatio"

// styles.js
import { StyleSheet } from 'react-native';
import { FONTS } from "./Fonts";

export const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'black',
  },
});

export const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
  },
});


const TextStyles = {
    title: {
        fontSize: textSize(14),
        color: Colors.black,
        fontWeight: '600',
        marginTop: 15
    },
    title2: {
        fontSize: textSize(12),
        color: Colors.black,
        // fontWeight: '500',
        fontFamily:FONTS.semibold,
    },
    title3: {
        fontSize: textSize(10),
        color: Colors.darkGrey,
        // fontWeight: '500',
        fontFamily:FONTS.semibold
    },
    textBase: {
        color: Colors.darkGrey,
        marginTop:10,
        fontSize:textSize(11),
        textAlign:'justify',
        lineHeight:25,
        fontFamily:FONTS.regular
    }
}

const appStyles = {
    pageFrame: {
        width: screenWidth * 0.95,
        maxWidth: maxWidth,
        alignContent: 'center',
        alignSelf: 'center',
        // marginBottom:200
    },
    pageStyle: { backgroundColor: Colors.white2, minHeight: screenHeight,marginTop:StatusBar.currentHeight||0,flex:1 },
    intput: {
        width: '100%',
        borderWidth: 0.2,
        alignSelf: 'center',
        borderRadius: 5,
        paddingLeft: 20,
        paddingRight: 5,
        paddingVertical: 7,
        fontSize: textSize(12),
        marginBottom: 1,
        backgroundColor: Colors.lightGray,
        fontFamily:FONTS.regular,
    },
    dropdown: {
        marginTop:10,
        height: 40,
        borderColor: Colors.black,
        borderWidth: 0.2,
        borderRadius: 5,
        paddingHorizontal: 15,
      },
      btn: {
        paddingHorizontal: 10,
        paddingVertical: 12,
        backgroundColor: Colors.black,
        borderRadius: 10,
        width: '90%',
        minWidth:200,
        alignSelf: 'center',
        marginTop: 40,
    },
    
}

export {
    TextStyles, appStyles
}