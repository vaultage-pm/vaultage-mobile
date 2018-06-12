import color from 'color';
import React, { Component } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';

import style, { BACKGROUND } from '../../style';

export default class LoadingModal extends Component<{
    loading: boolean
}> {

    render() {
        return <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.loading}
                onRequestClose={() => {
                }}>
                <View style={[style.page, {
                    backgroundColor: color(BACKGROUND).desaturate(0.1).darken(0.5).alpha(0.7).toString()
                    }]}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        alignItems: 'center',
                        alignContent: 'center',
                        justifyContent: 'center'
                    }}>
                        <ActivityIndicator size="large" />
                    </View>
                </View>
            </Modal>;
    }
}
