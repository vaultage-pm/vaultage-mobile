import React from 'react';
import { Provider } from 'react-redux';

import { getContext } from '../context';
import Navigation from './Navigation';

export default class App extends React.Component {
    render() {
        return (
            <Provider store={getContext().store}>
                <Navigation />
            </Provider>
        );
    }
}
