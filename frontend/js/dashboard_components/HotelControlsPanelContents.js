/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

type PropsType = {
    id: string,
};

type StateType = {
    service_state: number,
    dnd_state: number,
};

class HotelControlsPanelContents extends React.Component<PropsType, StateType> {
    _unsubscribe: () => null = () => null;

    state = {
        service_state: 0,
        dnd_state: 0,
    };

    _room_service_on_img = require('../../assets/images/room_service_on.png');
    _room_service_off_img = require('../../assets/images/room_service_off.png');
    _do_not_disturb_on_img = require('../../assets/images/do_not_disturb_on.png');
    _do_not_disturb_off_img = require('../../assets/images/do_not_disturb_off.png');

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

        if (reduxState && reduxState.things && reduxState.things.things_states) {
            const my_redux_state = reduxState.things.things_states[id];
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

        // SocketCommunication.sendMessage({
        //     thing: this.props.id,
        //     room_service: service_state,
        //     do_not_disturb: dnd_state,
        // });
        // this.context.store.dispatch(thingsActions.set_thing_partial_state(this.props.id, {room_service: service_state, do_not_disturb: dnd_state}));
    }

    toggleDoNotDisturb() {
        const { id } = this.props;
        var { service_state, dnd_state } = this.state;
        dnd_state = 1 - dnd_state;
        service_state = 0;

        // SocketCommunication.sendMessage({
        //     thing: this.props.id,
        //     room_service: service_state,
        //     do_not_disturb: dnd_state,
        // });
        // this.context.store.dispatch(thingsActions.set_thing_partial_state(this.props.id, {room_service: service_state, do_not_disturb: dnd_state}));
    }

    render() {
        const { service_state, dnd_state } = this.state;

        const card_defs = [{
            on_image: this._room_service_on_img,
            off_image: this._room_service_off_img,
            text: "Room Service",
            toggler: this.toggleRoomService.bind(this),
            state: service_state,
        }, {
            on_image: this._do_not_disturb_on_img,
            off_image: this._do_not_disturb_off_img,
            text: "Do Not Disturb",
            toggler: this.toggleDoNotDisturb.bind(this),
            state: dnd_state,
        }]

        var cards = [];

        for (var i = 0; i < 2; i++) {
            cards[i] = (
                <div style={styles.card_container}
                    key={'card-'+i}>
                    <img style={styles.card}
                        src={(card_defs[i].state) ? card_defs[i].on_image : card_defs[i].off_image}>
                    </img>
                    <div pointerEvents={'none'}
                      style={styles.text_container}>
                        <div style={styles.text}>{card_defs[i].text}</div>
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
HotelControlsPanelContents.contextTypes = {
    store: PropTypes.object
};

const styles = {
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        overflow: 'hidden',
        height: 150,
        maxWidth: 400,
    },
    card_container: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text_container: {
        width: 60,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text_container_sm: {
    },
    text: {
        fontSize: 12,
        fontFamily: 'HKNova-MediumR',
        color: '#FFFFFF',
        textAlign: 'center',
        backgroundColor: '#00000000',
    },
    card: {
        height: 150,
    },
    card_sm: {
    },
};

export { HotelControlsPanelContents };
