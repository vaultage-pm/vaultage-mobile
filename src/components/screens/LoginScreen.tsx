import { Button, Container, Form, Icon, Input, Item, Text, Toast } from 'native-base';
import React, { Component } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';
import * as vaultage from 'vaultage-client';

import { getContext } from '../../context';
import { loginFailureAction, loginStartAction, loginSuccessAction, updateCredentialsAction } from '../../redux/actions';
import { State } from '../../redux/state';
import { BACKGROUND, FOREGROUND, HINT } from '../../style';
import LoadingModal from '../widgets/LoadingModal';

const background = require('../../../assets/background.png');
const logoImage = require('../../../assets/logo_text_color_downsampled.png');

const mapStateToProps = (state: State) => {
    return {
        loading: state.loginLoading,
        error: state.error,
        creds: state.creds
    };
};

const mapDispatchToProps = {
    updateCredentialsAction,
    loginStartAction,
    loginFailureAction,
    loginSuccessAction
};

const styles = StyleSheet.create({
    logo: {
        width: 350,
        height: 100
    },
    imageContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    advancedCollapse: {
        flex: 1,
        
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    advancedCollapseContainer: {
        height: 40,
        paddingLeft: 10,
        paddingRight: 10
    },
    collapseText: {
        marginLeft: 5,
        color: FOREGROUND
    },
    collapseCaret: {
        marginRight: 2,
        color: FOREGROUND
    },
    basicForm: {
       
    },
    page: {
        backgroundColor: BACKGROUND,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch'
    },
    input: {
        color: FOREGROUND
    },
    spacer: {
        flexGrow: 1
    }
});

class LoginScreen extends Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & NavigationInjectedProps> {

    state = {
        advancedExpanded: false
    };

    render() {
        return (
            <Container style={styles.page}>
                <LoadingModal loading={this.props.loading} />
                <ImageBackground source={background} style={styles.imageContainer}></ImageBackground>
                <View style={styles.spacer}></View>
                <View>
                    <ImageBackground source={logoImage} style={styles.logo} />
                </View>
                <View style={styles.spacer}></View>
                <Form style={styles.basicForm}>
                    <Item>
                        <Input style={styles.input}
                                placeholderTextColor={HINT}
                                placeholder="Username"
                                autoCapitalize='none'
                                onChangeText={(username) => this.props.updateCredentialsAction({username})}
                                value={this.props.creds.username}/>
                    </Item>
                    <Item>
                        <Input style={styles.input}
                                placeholderTextColor={HINT}
                                placeholder="Password"
                                autoCapitalize='none'
                                onChangeText={(password) => this.props.updateCredentialsAction({password})}
                                value={this.props.creds.password}
                                secureTextEntry />
                    </Item>
                    <Item>
                        <Input style={styles.input}
                                placeholderTextColor={HINT}
                                placeholder="https://your-hostname"
                                autoCapitalize='none'
                                onChangeText={(host) => this.props.updateCredentialsAction({host})}
                                value={this.props.creds.host} />
                    </Item>
                </Form>
                <View style={styles.spacer}></View>
                <View style={styles.advancedCollapseContainer}>
                    <TouchableOpacity style={styles.advancedCollapse} onPressIn={() => this.setState({advancedExpanded: !this.state.advancedExpanded})}>
                        <Text style={styles.collapseText}>Advanced settings</Text>
                        <Icon name={this.state.advancedExpanded ? 'arrow-dropdown' : 'arrow-dropright'} style={styles.collapseCaret}/>
                    </TouchableOpacity>
                </View>
                { this.state.advancedExpanded ? 
                <Form>
                    <Item>
                        <Input style={styles.input}
                                placeholderTextColor={HINT}
                                placeholder="HTTP user"
                                autoCapitalize='none'
                                onChangeText={(httpUser) => this.props.updateCredentialsAction({httpUser})}
                                value={this.props.creds.httpUser}/>
                    </Item>
                    <Item>
                        <Input style={styles.input}
                                placeholderTextColor={HINT}
                                placeholder="HTTP password"
                                autoCapitalize='none'
                                onChangeText={(httpPassword) => this.props.updateCredentialsAction({httpPassword})}
                                value={this.props.creds.httpPassword}
                                secureTextEntry />
                    </Item>
                </Form> : undefined
                }
                <View style={styles.spacer}></View>
                <Button block
                        style={{ margin: 15, marginTop: 50 }}
                        disabled={this.props.loading}
                        onPress={() => this.submit()}>
                    <Text>Sign In</Text>
                </Button>
            </Container>
        );
    }

    async submit() {
        const auth =  (this.props.creds.httpUser !== '' && this.props.creds.httpPassword !== '') ?
                { username: this.props.creds.httpUser, password: this.props.creds.httpPassword } : undefined;

        this.props.loginStartAction();

        try {
            const vault = await vaultage.login(
                    this.props.creds.host,
                    this.props.creds.username,
                    this.props.creds.password,
                    { auth });

            const vaultService = getContext().vaultService;
            
            vaultService.login(vault);
            await vaultService.saveCredentials(this.props.creds, auth);

            this.props.loginSuccessAction();
            this.props.navigation.navigate('Home');
        } catch (e) {
            this.props.loginFailureAction(e.toString());
            Toast.show({
                text: e.toString(),
                buttonText: 'Dismiss'
            });
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);