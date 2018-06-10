import { List, ListItem, Text, Body, Button, Container, Content, Header, Icon, Left, Right, Title, Toast } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, Clipboard } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';
import { IVaultDBEntry } from 'vaultage-client';

import { State } from '../../redux/state';


const mapStateToProps = (state: State) => {
    return {
        entry: state.vault.selectedEntry as IVaultDBEntry
    };
};

const mapDispatchToProps = {
};

const style = StyleSheet.create({
});

class EntryDetailScreen extends Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & NavigationInjectedProps>
{
    state = {
        refreshing: false,
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
                <Right />
            </Header>
            <Content>
                <List>
                    <ListItem itemHeader first>
                        <Text>Data</Text>
                    </ListItem>
                    <ListItem >
                        <Text numberOfLines={1}>URL: {this.props.entry.url}</Text>
                    </ListItem>
                    <ListItem >
                        <Text>Username: {this.props.entry.login}</Text>
                    </ListItem>
                    <ListItem button onPress={this._onPressPassword}>
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

    private _onPressPassword = () => {
        Clipboard.setString(this.props.entry.password);
        Toast.show({
            text: 'Copied to clipboard!'
        });
    }

    private _onTogglePasswordVisibility = () => {
        this.setState({
            passwordVisible: !this.state.passwordVisible
        });
    }

    private getPasswordText() {
        if (this.state.passwordVisible) {
            return this.props.entry.password;
        } else {
            return this.props.entry.password.replace(/./g, '*');
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryDetailScreen);