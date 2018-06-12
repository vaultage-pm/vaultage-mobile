import LoadingModal from '../widgets/LoadingModal';
import { Body, Button, Container, Content, Form, Header, Input, Item, Label, Left, Right, Text, Title, Toast } from 'native-base';
import React, { Component } from 'react';
import { NavigationInjectedProps } from 'react-navigation';
import { connect } from 'react-redux';

import { getContext } from '../../context';
import { updatePendingEntryAction, entrySavedAction } from '../../redux/actions';
import { State } from '../../redux/state';
import nextTick from '../../utils/nextTick';


const mapStateToProps = (state: State) => {
    return {
        entry: state.pendingEntry
    };
};

const mapDispatchToProps = {
    updatePendingEntryAction,
    entrySavedAction
};

class EditEntryScreen extends Component<ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps & NavigationInjectedProps>
{
    state = {
        passwordVisible: false,
        loading: false
    };

    render() {
        return <Container>
            <LoadingModal loading={this.state.loading} />
            <Header>
                <Left>
                    <Button onPress={this._onCancel} transparent>
                        <Text>Cancel</Text>
                    </Button>
                </Left>
                <Body>
                    <Title>{this.getTitle()}</Title>
                </Body>
                <Right>
                    <Button onPress={this._onSave} transparent>
                        <Text>Save</Text>
                    </Button>
                </Right>
            </Header>
            <Content>
            <Form>
                    <Item floatingLabel>
                        <Label>Title</Label>
                        <Input value={this.props.entry.title}
                                autoCapitalize={'words'}
                                onChangeText={(title) => this.props.updatePendingEntryAction({title})}/>
                    </Item>
                    <Item floatingLabel>
                        <Label>URL</Label>
                        <Input value={this.props.entry.url}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                onChangeText={(url) => this.props.updatePendingEntryAction({url})}/>
                    </Item>
                    <Item floatingLabel>
                        <Label>Username</Label>
                        <Input value={this.props.entry.login}
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                onChangeText={(login) => this.props.updatePendingEntryAction({login})}/>
                    </Item>
                    <Item floatingLabel>
                        <Label>Password</Label>
                        <Input value={this.props.entry.password} 
                                autoCapitalize={'none'}
                                autoCorrect={false}
                                onChangeText={(password) => this.props.updatePendingEntryAction({password})}/>
                    </Item>
                </Form>
                
            </Content>
        </Container>;
    }

    private _onSave = async () => {

        this.setState({
            loading: true
        });
        // Makes sure we display the loader before starting the expensive crypto computation
        await nextTick();

        try {
            await this.saveOrUpdateEntry();
            this.props.navigation.goBack();
        } catch (e) {
            Toast.show({
                type: 'danger',
                text: e.toString()
            });
        } finally {
            this.setState({
                loading: false
            });
        }

    };

    private _onCancel = () => {
        this.props.navigation.goBack();
    };

    private saveOrUpdateEntry() {
        const vaultService = getContext().vaultService;
        if (this.props.entry.id != null) {
            return vaultService.updateEntry(this.props.entry.id, this.props.entry);
        } else {
            return vaultService.addEntry(this.props.entry);
        }
    }

    private getTitle() {
        if (this.props.entry.id != null) {
            return 'Edit entry';
        } else {
            return 'New entry';
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditEntryScreen);