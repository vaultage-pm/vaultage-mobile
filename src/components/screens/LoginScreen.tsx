import color from 'color';
import React, { Component } from 'react';
import { ActivityIndicator, Button, Modal, Text, TextInput, View } from 'react-native';
import { connect } from 'react-redux';

import { getContext } from '../../context';
import { updateCredentialsAction } from '../../redux/actions';
import { State } from '../../redux/state';
import style, { HIGHLIGHT, PRIMARY } from '../../style';


const mapStateToProps = (state: State) => {
    return {
        loading: state.loginLoading,
        error: state.error,
        creds: state.creds
    };
};

const mapDispatchToProps = {
    updateCreds: updateCredentialsAction
};

class LoginScreen extends Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps> {

    render() {
        return (
          <View style={[style.page, style.inverse]}>
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.loading}
                onRequestClose={() => {
                }}>
                <View style={[style.page, style.inverse, {
                    backgroundColor: color(PRIMARY).desaturate(0.1).darken(0.5).alpha(0.6).toString()
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
            </Modal>
            <View style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                alignContent: 'center',
                justifyContent: 'center'
            }}>
                <View style={{flexGrow: 4}}></View>
                <Text style={[style.title]}>
                    Vaultage
                </Text>
                <View style={{flexGrow: 2}}></View>
                <TextInput
                    style={style.bigInput}
                    autoCapitalize='none'
                    placeholder='username'
                    autoFocus={true}
                    autoCorrect={false}
                    onChangeText={(username) => this.props.updateCreds({username})}
                    value={this.props.creds.username}
                />
                <TextInput  
                    style={style.bigInput}
                    secureTextEntry={true}
                    placeholder='password'
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={(password) => this.props.updateCreds({password})}
                    value={this.props.creds.password}
                />
                <TextInput
                    style={style.bigInput}
                    placeholder='host'
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={(host) => this.props.updateCreds({host})}
                    value={this.props.creds.host}
                />
                <View style={{flexGrow: 1}}></View>
                <TextInput
                    style={style.bigInput}
                    placeholder='(optional) HTTP user'
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={(httpUser) => this.props.updateCreds({httpUser})}
                    value={this.props.creds.httpUser}
                />
                <TextInput
                    style={style.bigInput}
                    secureTextEntry={true}
                    placeholder='(optional) HTTP password'
                    autoCapitalize='none'
                    autoCorrect={false}
                    onChangeText={(httpPassword) => this.props.updateCreds({httpPassword})}
                    value={this.props.creds.httpPassword}
                />
                <View style={{flexGrow: 1}}></View>
                <Button color={HIGHLIGHT}
                    onPress={() => this.submit()}
                    title='Login'
                    disabled={this.props.loading}></Button>
                { this.props.error != null ? <Text style={style.error}>{this.props.error}</Text> : undefined }
                <View style={{flexGrow: 7}}></View>
            </View>
          </View>
        );
    }

    submit() {
        const auth =  (this.props.creds.httpUser !== '' && this.props.creds.httpPassword !== '') ?
                { username: this.props.creds.httpUser, password: this.props.creds.httpPassword } : undefined;
        getContext().vaultService.login(this.props.creds, { auth });
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);