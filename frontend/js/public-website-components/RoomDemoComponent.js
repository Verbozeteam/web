/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { connect as ReduxConnect } from 'react-redux';

import * as APITypes from '../js-api-utils/APITypes';
import * as ConnectionTypes from '../js-api-utils/ConnectionTypes';

import { PublicWebsiteAPICaller } from '../js-api-utils/PublicWebsiteAPI';

import { WebSocketCommunication } from '../js-api-utils/WebSocketCommunication';

import * as tabletActions from './redux/actions/tabletstate';
import * as connectionActions from './redux/actions/connection';

import { RoomState } from './room-state/RoomState';

import * as Cookies from 'js-cookie';

function mapStateToProps(state) {
    return {
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setConnectionURL: u => dispatch(tabletActions.setCurrentConnectionURL(u)),
        setQrcodeURL: u => dispatch(tabletActions.setCurrentQrcodeURL(u)),
        setThingPartialState: (t, s) => dispatch(connectionActions.setThingPartialState(t, s)),
    };
}

type PropsType = {
    setConnectionURL: (string) => null,
    setQrcodeURL: (string) => null,
    setThingPartialState: (string, Object) => null,
    showControls: boolean
};

type StateType = {
    /**
     * 0: display logo and -> Demo button
     * 1: display logo and -> Demo loading
     * 2: animating towards faded logo and button
     * 3: display tablet controls
     */
    currentStage: number,

    width: number,
    height: number,
};

class RoomDemoComponent extends React.Component<PropsType, StateType> {

    static defaultProps = {
        showControls: true
    };

    state = {
        currentStage: 0,
        width: 1,
        height: 1,
    };

    _isUnmounting = false;
    _apiTimeout = null;
    _navbar_height = 66;

    _logo = require('../../assets/images/verboze_logo_white.png');

    createWebsocketURL(token: string): string {
        var protocol = "ws://";
        if (location.protocol === 'https:')
            protocol = "wss://";
        return protocol + location.host + "/stream/" + token + '/';
    }

    createQrcodeURL(token: string): string {
      return `${location.protocol}//${location.host}/qrcode/${token}/`;
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this._isUnmounting = false;

        /* bind websocket callbacks */
        WebSocketCommunication.setOnConnected(this.onConnected.bind(this));
        WebSocketCommunication.setOnMessage(this.onMessage.bind(this));

        this.startDemo();
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions.bind(this));
    }

    componentWillUnmount() {
        this._isUnmounting = true;
        WebSocketCommunication.disconnect();
        window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
    }

    updateWindowDimensions() {
        this.setState({ width: document.documentElement.clientWidth, height: window.innerHeight });
    }

    /* websocket callback on connect event */
    onConnected() : any {
        this.setState({currentStage: 2});
        setTimeout((() => this.setState({currentStage: 3})).bind(this), 1000);
    }

    /* websocket callback on disconnect event */
    onDisconnected() : any {
        if (!this._isUnmounting) {
            WebSocketCommunication.setOnDisconnected(() => null);
            WebSocketCommunication.reset();
            this.setState({currentStage: 0});
        }
    }

    /* websocket callback on message event */
    onMessage(data: ConnectionTypes.WebSocketDataType) : any {
        const { setThingPartialState } = this.props;
        const { store } = this.context;
        const reduxState = store.getState();

        if ("code" in data && data.code === 0) {
            // phone app sent code 0, reply with config!
            WebSocketCommunication.sendMessage({
                config: reduxState.connection.roomConfig,
                ...reduxState.connection.roomState,
            });
        } else if ("thing" in data) {
            // we have a command
            var thing_id = data.thing;
            delete data.thing;
            setThingPartialState(thing_id, data);
        }
    }

    startDemo() {
        const { setConnectionURL, setQrcodeURL } = this.props;

        if (this.state.currentStage === 0) {
            this.setState({currentStage: 1});

            var csrftoken = Cookies.get('csrftoken');
            PublicWebsiteAPICaller.setCSRFToken(csrftoken);
            PublicWebsiteAPICaller.createToken(((token: APITypes.CreatedToken) => {
                setConnectionURL(this.createWebsocketURL(token.id));
                setQrcodeURL(this.createQrcodeURL(token.id));
                WebSocketCommunication.setOnDisconnected(this.onDisconnected.bind(this));
                WebSocketCommunication.connect(this.createWebsocketURL(token.id));
            }).bind(this), ((error: APITypes.ErrorType) => {
                this.setState({currentStage: 0});
            }).bind(this));
        }
    }

    render() {
        const { showControls } = this.props;
        const { currentStage, width, height } = this.state;

        var dimensions = {width, height};

        if (currentStage === 0)
            this._apiTimeout = setTimeout(this.startDemo.bind(this), 3000);
        else
            clearTimeout(this._apiTimeout);

        return (
            <div style={{...styles.roomContainer, ...dimensions}}>
                <RoomState navbarHeight={(showControls) ? this._navbar_height : 0}
                    opacity={currentStage === 3 ? 1.0 : 0.2}
                    dimensions={dimensions}
                    showControls={showControls}/>
            </div>
        );
    }
};
RoomDemoComponent.contextTypes = {
    store: PropTypes.object
};

const styles = {
    roomContainer: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#1b1c1d',
        MozUserSelect: '-moz-none',
        KhtmlUserSelect: 'none',
        UebkitUserSelect: 'none',
        MsUserSelect: 'none',
        userSelect: 'none',
    },
    logoStaticContainer: {
        position: 'absolute',
        height: 700,
    },
    logoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

        opacity: 1,
    },
    logoContainerFaded: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

        marginTop: -500,
        opacity: 0,
        transition: 'margin-top 1s, opacity 500ms',
    },
    logo: {
        width: 666,
    }
};


module.exports = { RoomDemoComponent: ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomDemoComponent) };
