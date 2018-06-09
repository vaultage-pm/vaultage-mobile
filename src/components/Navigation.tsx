import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';

import { Screen, State } from '../redux/state';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';

class Navigation extends React.Component<{screen: Screen}> {

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.page}>
                    { this.getPage() }
                </View>
            </View>
        );
    }

    getPage(): JSX.Element {
        switch (this.props.screen) {
            case 'login':
                return <LoginScreen />
            case 'app':
                return <HomeScreen />
        }
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%'
    },
    page: {
        height: '100%',
        width: '100%'
    }
});

const mapStateToProps = (state: State) => {
    return {
        screen: state.get('currentScreen')
    };
};

const mapDispatchToProps = { };

export default connect(mapStateToProps, mapDispatchToProps)(Navigation);