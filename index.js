/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';
import { Provider } from 'react-redux';
import Store from './App/Redux/store';
// import 'react-native-gesture-handler';


messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

messaging().getInitialNotification(async remoteMessage => {
  console.log('Message handled in the Kill state!', remoteMessage);
});

const Main = () => {
  return (
    <Provider
      store={Store}
    >
      <App />
    </Provider>
  )
}

AppRegistry.registerComponent(appName, () => Main);
// AppRegistry.registerComponent(appName, () => App);
