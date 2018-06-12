import EditEntryScreen from './screens/EditEntryScreen';
import React from 'react';
import { Root } from 'native-base';
import { Provider } from 'react-redux';

import { getContext } from '../context';
import { StackNavigator } from 'react-navigation';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import EntryDetailScreen from './screens/EntryDetailScreen';

const Navigation = StackNavigator({
    Login: LoginScreen,
    Home: HomeScreen,
    Entry: EntryDetailScreen,
    EditEntry: EditEntryScreen
}, {
  initialRouteName: "Login",
  headerMode: "none"
});

export default class App extends React.Component {
    render() {
        return (
            <Provider store={getContext().store}>
                <Root>
                    <Navigation />
                </Root>
            </Provider>
        );
    }
}
