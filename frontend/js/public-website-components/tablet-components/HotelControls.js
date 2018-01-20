/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import * as connectionActions from '../redux/actions/connection';
import { WebSocketCommunication } from '../../js-api-utils/WebSocketCommunication';

type PropsType = {
    id: string,
    viewType: string,
};

type StateType = {
    service_state: number,
    dnd_state: number,
};

class HotelControls extends React.Component<PropsType, StateType> {
    _unsubscribe: () => null = () => null;

    state = {
        service_state: 0,
        dnd_state: 0,
    };

    componentWillMount() {
        const { store } = this.context;
        this._unsubscribe = store.subscribe(this.onReduxStateChanged.bind(this));
        this.onReduxStateChanged();
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    onReduxStateChanged() {
        const { store } = this.context;
        const reduxState = store.getState();
        const { service_state, dnd_state } = this.state;
        const { id } = this.props;

        if (reduxState && reduxState.connection && reduxState.connection.roomState) {
            const my_redux_state = reduxState.connection.roomState[id];
            if (my_redux_state && my_redux_state.room_service != undefined && my_redux_state.do_not_disturb != undefined) {
                if (my_redux_state.room_service != service_state || my_redux_state.do_not_disturb != dnd_state) {
                    this.setState({
                        service_state: my_redux_state.room_service,
                        dnd_state: my_redux_state.do_not_disturb
                    });
                }
            }
        }
    }

    toggleRoomService() {
        const { id } = this.props;
        var { service_state, dnd_state } = this.state;
        service_state = 1 - service_state;
        dnd_state = 0;

        WebSocketCommunication.sendMessage({
            [this.props.id] : {
                ...this.context.store.getState().connection.roomState[this.props.id],
                room_service: service_state,
                do_not_disturb: dnd_state,
            }
        });
        this.context.store.dispatch(connectionActions.setThingPartialState(this.props.id, {room_service: service_state, do_not_disturb: dnd_state}));
    }

    toggleDoNotDisturb() {
        const { id } = this.props;
        var { service_state, dnd_state } = this.state;
        dnd_state = 1 - dnd_state;
        service_state = 0;

        WebSocketCommunication.sendMessage({
            [this.props.id] : {
                room_service: service_state,
                do_not_disturb: dnd_state,
            }
        });
        this.context.store.dispatch(connectionActions.setThingPartialState(this.props.id, {room_service: service_state, do_not_disturb: dnd_state}));
    }

    render() {
        const { viewType } = this.props;
        const { service_state, dnd_state } = this.state;

        const card_defs = [{
            extra_style: service_state ? styles.card_rs_on : styles.card_rs_off,
            text: viewType === 'detail' ? "Room Service" : "",
            toggler: this.toggleRoomService.bind(this),
        }, {
            extra_style: dnd_state ? styles.card_dnd_on : styles.card_dnd_off,
            text: viewType === 'detail' ? "Do Not Disturb" : "",
            toggler: this.toggleDoNotDisturb.bind(this),
        }];

        var cards = [];

        for (var i = 0; i < 2; i++) {
            var cardStyle = {...styles.card_container, ...card_defs[i].extra_style};
            cards[i] = (
                <div key={'card-'+i} style={cardStyle} onClick={card_defs[i].toggler}>
                    <div style={styles.text_container}>
                        {card_defs[i].text}
                    </div>
                </div>
            );
        }

        return (
            <div style={styles.container}>
                {cards}
            </div>
        );
    }
}
HotelControls.contextTypes = {
    store: PropTypes.object
};

const styles = {
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        height: '100%',
    },
    card_container: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
    },
    card_rs_off: {
        backgroundImage: 'url(' + require('../../../assets/images/room_service_off.png') + ')',
    },
    card_rs_on: {
        backgroundImage: 'url(' + require('../../../assets/images/room_service_on.png') + ')',
    },
    card_dnd_off: {
        backgroundImage: 'url(' + require('../../../assets/images/do_not_disturb_off.png') + ')',
    },
    card_dnd_on: {
        backgroundImage: 'url(' + require('../../../assets/images/do_not_disturb_on.png') + ')',
    },
    text_container: {
        width: 50,
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'center',
    },
};

export { HotelControls };
