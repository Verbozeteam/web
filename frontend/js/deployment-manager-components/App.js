import React from 'react';

import ConfigEditor from './ConfigEditor';
import DataManager from './DataManager';
import Status from './Status';

import { DeploymentManagerAPICaller } from '../js-api-utils/DeploymentManagerAPI';
import { WebSocketCommunication } from '../js-api-utils/WebSocketCommunication';

import * as Cookies from 'js-cookie';

export default class App extends React.Component {
    _deregister = undefined;

    state = {
        runningDeployments: [],
    };

    componentWillMount() {
        this.establishWebSocketCommunication();
        DataManager.load();
    }

    componentWillUnmount() {
        WebSocketCommunication.disconnect();
    }

    createWebsocketURL(token) {
        var protocol = 'ws://';
        if (location.protocol === 'https:')
            protocol = 'wss://';
        return protocol + location.host + '/deployment-comm/' + token + '/deployment_manager/';
    }

    establishWebSocketCommunication() {
        /* bind websocket callbacks */
        WebSocketCommunication.setOnConnected(() => this.onConnected());
        WebSocketCommunication.setOnDisconnected(() => this.onDisconnected());
        WebSocketCommunication.setOnMessage((data) => this.onMessage(data));

        var csrftoken = Cookies.get('csrftoken');
        DeploymentManagerAPICaller.setCSRFToken(csrftoken);
        DeploymentManagerAPICaller.requestToken(((token) => {
            WebSocketCommunication.connect(this.createWebsocketURL(token.id));
        }).bind(this), ((error) => {
            console.log('Could not fetch WS Token');
        }).bind(this), {
            deployment_manager: true, /* sending data to api */
            requested_token_type: 'admin_user'
        });
    }

    onConnected() {
        console.log('connnected');
    }

    onMessage(data) {
        /* handle receiving running deployments update */
        if ('running_deployments' in data) {
            this.setState({runningDeployments: data['running_deployments']});
        }
    }

    onDisconnected() {
        console.log('Disconnected');
    }

    onDataChanged() {
        this.setState({runningDeployments: DataManager.serverData.deploymentLocks});
    }

    render() {
        const { runningDeployments } = this.state;

        return (
            <div style={styles.global}>
                <ConfigEditor runningDeployments={runningDeployments} />
            </div>
        );
    }
};

const styles = {
    global: {
        fontFamily: 'Courier New',
        color: 'white',
        display: 'flex',
        flex: 1,
        minHeight: '100vh'
    },
};
