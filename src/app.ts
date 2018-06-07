import { AppRegistry } from 'react-native';
import { createStore, Store } from 'redux';
import devToolsEnhancer from 'remote-redux-devtools';

import App from './components/App';
import { initContext } from './context';
import { reducer } from './redux/reducer';
import { initialState, State } from './redux/state';
import { AppActions } from './redux/actions';


const store = createStore(reducer, initialState(), devToolsEnhancer()) as Store<State, AppActions>;

initContext(store);

AppRegistry.registerComponent('vaultage', () => App);