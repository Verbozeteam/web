/* @flow */

import * as React from 'react';

import PropTypes from 'prop-types';

import * as connectionActions from '../redux/actions/connection';
import { WebSocketCommunication } from '../../api-utils/WebSocketCommunication';

type StateType = {
    intensity: number,
};

type PropsType = {
    id: string,
    layout: {
        width: number,
        height: number,
        left: number,
        top: number,
    },
    viewType: string,
};

class LightSwitch extends React.Component<PropsType, StateType> {
    _unsubscribe: () => null = () => null;

    state = {
        intensity: 0,
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
        const { intensity } = this.state;
        const { id } = this.props;

        if (reduxState && reduxState.connection && reduxState.connection.roomState) {
            const my_redux_state = reduxState.connection.roomState[id];
            if (my_redux_state && my_redux_state.intensity != undefined && my_redux_state.intensity != intensity) {
                this.setState({intensity: my_redux_state.intensity});
            }
        }
    }

    changeIntensity(intensity: number) {
        WebSocketCommunication.sendMessage({
            thing: this.props.id,
            intensity
        });
        this.context.store.dispatch(connectionActions.setThingPartialState(this.props.id, {intensity}));
    }

    render() {
        const { id, layout, viewType } = this.props;
        const { intensity } = this.state;

        var on_press = () => {};
        if (viewType === 'detail')
            on_press = (() => this.changeIntensity(1-this.state.intensity)).bind(this);

        var img_style = JSON.parse(JSON.stringify(layout));
        img_style = Object.assign(img_style, styles.container);
        img_style = Object.assign(img_style, intensity === 1 ? styles.light_on : styles.light_off);

        return (
            <div style={img_style} onClick={on_press}>
            </div>
        );
    }
}
LightSwitch.contextTypes = {
    store: PropTypes.object
};

const styles = {
    container: {
        flex: 1,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
    },
    light_on: {
        backgroundImage: 'url(' + require('../../../assets/images/lighton.png') + ')',
    },
    light_off: {
        backgroundImage: 'url(' + require('../../../assets/images/lightoff.png') + ')',
    }
};

module.exports = { LightSwitch };
