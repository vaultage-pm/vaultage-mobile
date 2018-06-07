import HomeScreen from './HomeScreen';
import { createStackNavigator } from 'react-navigation';


export default createStackNavigator({
    Home: {
        screen: HomeScreen
    },
});
