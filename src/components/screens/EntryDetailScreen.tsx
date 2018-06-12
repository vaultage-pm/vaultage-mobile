import {
    Body,
    Button,
    Container,
    Content,
    Header,
    Icon,
    Left,
    List,
    ListItem,
    Right,
    Text,
    Title,
    Toast,
} from 'native-base';
import React, { Component } from 'react';
import { Clipboard, Linking } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';

import { beginEntryEditAction } from '../../redux/actions';
import { State } from '../../redux/state';
import { notNull } from '../../utils/assertions';


const mapStateToProps = (state: State) => {
    return {
        entry: notNull(state.vault.selectedEntry)
    };
};

const mapDispatchToProps = {
    beginEntryEditAction
};

class EntryDetailScreen extends Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & NavigationInjectedProps>
{
    state = {
        passwordVisible: false
    };

    render() {
        return <Container>
            <Header>
                <Left>
                    <Button onPress={() => this.props.navigation.goBack()} transparent>
                        <Icon name="arrow-back" />
                    </Button>
                </Left>
                <Body>
                    <Title>{this.props.entry.title}</Title>
                </Body>
                <Right>
                    <Button onPress={this._onRequestEdit} transparent>
                        <Text>Edit</Text>
                    </Button>
                </Right>
            </Header>
            <Content>
                <List>
                    <ListItem itemHeader first>
                        <Text>Data</Text>
                    </ListItem>
                    <ListItem button onPress={this._onPressURL}>
                        <Left>
                            <Text numberOfLines={1}>URL: {this.props.entry.url}</Text>
                        </Left>
                        <Right>
                            <Icon name="arrow-forward" />
                        </Right>
                    </ListItem>
                    <ListItem button onPress={this._onCopyUsername}>
                        <Text>Username: {this.props.entry.login}</Text>
                    </ListItem>
                    <ListItem button onPress={this._onCopyPassword}>
                        <Left>
                            <Text>Password: {this.getPasswordText()}</Text>
                        </Left>
                        <Right>
                            <Button light small onPress={this._onTogglePasswordVisibility}><Icon name="eye" /></Button>
                        </Right>
                    </ListItem>
                </List>
            </Content>
        </Container>;
    }

    private _onRequestEdit = () => {
        this.props.beginEntryEditAction(this.props.entry);
        this.props.navigation.navigate('EditEntry');
    }

    private _onCopyPassword = () => {
        Clipboard.setString(this.props.entry.password);
        Toast.show({
            text: 'Password copied to clipboard!'
        });
    }

    private _onCopyUsername = () => {
        Clipboard.setString(this.props.entry.login);
        Toast.show({
            text: 'Username copied to clipboard!'
        });
    }

    private _onTogglePasswordVisibility = () => {
        this.setState({
            passwordVisible: !this.state.passwordVisible
        });
    }

    private _onPressURL = () => {
        Linking.openURL(this.props.entry.url).catch((e) => {
            Toast.show({
                text: e.toString()
            });
        });
    }

    private getPasswordText() {
        if (this.state.passwordVisible) {
            return this.props.entry.password;
        } else {
            return this.props.entry.password.replace(/./g, '•');
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetailScreen);