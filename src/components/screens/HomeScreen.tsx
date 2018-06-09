import React, { Component, PureComponent } from 'react';
import { FlatList, Text, View, TextInput, Button, TouchableOpacity, Clipboard } from 'react-native';
import { connect } from 'react-redux';
import { State } from '../../redux/state';

import style from '../../style';
import { getContext } from '../../context';
import { IVaultDBEntry } from 'vaultage-client';


class EntryItem extends PureComponent<{
    entry: IVaultDBEntry;
    passwordVisible: boolean;
    onShowPassword: (entry: IVaultDBEntry) => void;
}> {

    state = {
        copyHintVisible: false
    };

    render() {
        return <TouchableOpacity onPress={() => this.copyToClipboard()}>
            <View style={style.listItem}>
                <Text style={style.listItemText}>{ this.getItemText() }</Text>
                { (this.state.copyHintVisible) ? undefined : <Button
                    onPress={this._onShowPassword}
                    title={ this.props.passwordVisible ? 'Hide' : 'Show'} />
                }
            </View>
        </TouchableOpacity>
    }

    private _onShowPassword = () => {
        this.props.onShowPassword(this.props.entry);
    };

    private getItemText() {
        if (this.state.copyHintVisible) {
            return 'Copied!';
        }
        if (this.props.passwordVisible) {
            return this.props.entry.password;
        }
        return this.props.entry.title;
    }

    private copyToClipboard() {
        Clipboard.setString(this.props.entry.password);
        this.setState({
            copyHintVisible: true
        });
        setTimeout(() => {
            this.setState({ copyHintVisible: false });
        }, 1000);
    }
}


const mapStateToProps = (state: State) => {
    return {
        query: state.get('vault').get('searchQuery'),
        entries: state.get('vault').get('entries')
    };
};

const mapDispatchToProps = {
};

class HomeScreen extends Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps> {

    state = {
        itemWithPasswordVisible: 'null',
        refreshing: false
    };

    render() {
        return (
            <View style={[style.page, {
                flex: 1,
                flexDirection: 'column',
                alignItems: 'stretch',
                alignContent: 'center',
                justifyContent: 'flex-start'
            }]}>
                <View style={{height: 40}}>
                    <View  style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        alignContent: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Button 
                            onPress={() => getContext().vaultService.refresh()}
                            title='Refresh' />
                        <Button 
                            onPress={() => getContext().vaultService.logout()}
                            title='Logout' />
                    </View>
                </View>
                <TextInput
                    style={style.bigInput}
                    placeholder='Search...'
                    autoCapitalize='none'
                    onChangeText={(query) => getContext().vaultService.search(query)}
                    value={this.props.query}
                />
                <FlatList
                    data={this.props.entries}
                    refreshing={this.state.refreshing}
                    onRefresh={() => {
                        this.setState({ refreshing: true });
                        getContext().vaultService.refresh().catch().then(() => {
                            this.setState({
                                refreshing: false
                            });
                        });
                    }}
                    renderItem={({item}) => <EntryItem
                        entry={item}
                        passwordVisible={this.state.itemWithPasswordVisible === item.id}
                        onShowPassword={this._onShowPassword}/>}
                />
            </View>
        );
    }

    private _onShowPassword = (item) => {
        this.setState({
            itemWithPasswordVisible: (this.state.itemWithPasswordVisible === item.id) ? 'null' : item.id
        });
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);