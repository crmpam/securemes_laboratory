import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { ChooseUser } from './ChooseUser';
import { XmppChat } from './XmppChat';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: ChooseUser,
      options: {title: 'Selecciona tu usuario'},
    },
    Profile: {
      screen: XmppChat,
    },
  },
});

export const Navigation = createStaticNavigation(RootStack);
