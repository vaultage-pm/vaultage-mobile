import {
    ActionSheet,
    Button,
    Container,
    Content,
    Fab,
    Header,
    Icon,
    Input,
    Item,
    Left,
    List,
    ListItem,
    Right,
    Text,
} from 'native-base';
import React, { Component, PureComponent } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';
import { IVaultDBEntry } from 'vaultage-client';

import { getContext } from '../../context';
import { beginEntryEditAction, selectVaultEntryAction } from '../../redux/actions';
import { State } from '../../redux/state';
import { HINT, PRIMARY } from '../../style';

const mapStateToProps = (state: State) => {
    return {
        vaultVersion: state.vault.version
    };
};

const mapDispatchToProps = {
    selectVaultEntryAction,
    beginEntryEditAction
};

const style = StyleSheet.create({
    hintContainer: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '100%'
    },
    hintText: {
        color: HINT
    },
    username: {
        color: HINT,
        maxWidth: '50%',
    },
    title: {
        maxWidth: '50%'
    }
});

class EntryItem extends PureComponent<{
    entry: IVaultDBEntry;
    onSelect: (entry: IVaultDBEntry) => void;
}> {
    render() {
        return <ListItem button onPress={this._onSelect}>
            <Left>
                <Text numberOfLines={1} style={style.username}>{this.props.entry.login}</Text>
                <Text style={style.hintText}>@</Text>
                <Text numberOfLines={1} style={style.title}>{this.props.entry.title}</Text>
            </Left>
            <Right>
                <Icon name="arrow-forward" />
            </Right>
        </ListItem>;
    }

    private _onSelect = () => {
        this.props.onSelect(this.props.entry);
    }
};

class HomeScreen extends Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & NavigationInjectedProps>
{
    state = {
        refreshing: false,
        query: ''
    };

    render() {
        const entries = this.getEntries();
        return <Container>
            <Header searchBar rounded>
                <Item>
                    <Icon active name="search" />
                    <Input placeholder="Search" 
                        onChangeText={(query) => this.setState({query})}
                        autoCorrect={false} />
                </Item>
                <Button onPress={this._openMenu} transparent>
                    <Icon name="menu" />
                </Button>
            </Header>
            <Content>
                { (entries.length === 0) ?
                        this.renderPlaceholder() :
                        this.renderList(entries)}
            </Content>
            <Fab
                    containerStyle={{}}
                    style={{ backgroundColor: PRIMARY }}
                    position="bottomRight"
                    onPress={this._onRequestCreateEntry}>
                <Icon name="md-add" />
            </Fab>
        </Container>;
    }

    private _onRequestCreateEntry = () => {
        this.props.beginEntryEditAction({
            id: null,
            title: '',
            login: '',
            password: '',
            url: ''
        });
        this.props.navigation.navigate('EditEntry');
    };

    private getEntries() {
        if (this.state.query.length > 2) {
            return getContext().vaultService.access(this.props.vaultVersion).search(this.state.query);
        } else {
            return [];
        }
    }

    private renderList(entries: IVaultDBEntry[]) {
        return <List   dataArray={entries}
                refreshControl={<RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._refresh} />}
                renderRow={(item: IVaultDBEntry) =>
                        <EntryItem entry={item} onSelect={this._onSelectItem} /> }>
        </List>;
    }

    private renderPlaceholder() {
        return <View style={style.hintContainer}>
            <Text style={style.hintText}>Type something in the search bar to get started.</Text>
        </View>;
    }

    private _refresh = () => {
        this.setState({ refreshing: true });
        getContext().vaultService.refresh().catch().then(() => {
            this.setState({
                refreshing: false
            });
        });
    }

    private _openMenu = () => {
        ActionSheet.show(
            {
              options: ['Refresh', 'Log out', 'Close'],
              cancelButtonIndex: 2,
              title: "Menu"
            },
            buttonIndex => {
                switch (buttonIndex) {
                    case 0:
                        getContext().vaultService.refresh();
                        break;
                    case 1:
                        this.props.navigation.goBack();
                        getContext().vaultService.logout();
                        break;   
                }
            }
        );
    }

    private _onSelectItem = (item: IVaultDBEntry) => {
        this.props.selectVaultEntryAction(item);
        this.props.navigation.navigate('Entry');
    };
}



export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);