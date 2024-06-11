// ThemeContext.js
// import React, { createContext, useContext } from 'react';
// import { useColorScheme } from 'react-native';

// const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const colorScheme = useColorScheme();
//   return (
//     <ThemeContext.Provider value={colorScheme}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = () => useContext(ThemeContext);

// themes.js
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // background: 'white',
    background: '#fffffe',
    text: 'black',
    blue2:'#333399',
    lightBlck:'#8f8f8f',
    lightGray:'#fefefe',
    greyText:'#797979',
    btnColor:'black',
    green:'#0D8319',
    catBox:'white',
    textBase:'#333333',
    blue:'#474ff1',
    skyBlue:'#474ff1'
  },
};

export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: 'black',
    text: 'white',
    blue2:'#474ff1',
    lightBlck:'#8f8f8f',
    greyText:'#cccccc',
    lightGray:'#202020',
    btnColor:'#202020',
    green:'#00ff00',
    catBox:'#e0e0e0',
    textBase:'#f9f9f9',
    // blue:'#1E90FF'
    blue:'#4169E1',
    skyBlue:'#00BFFF',
    // drawerIcon:'#81b0ff',
  },
};

