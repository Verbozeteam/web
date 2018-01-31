/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

type StateType = {
    intensity: number,
};

type PropsType = {
    id: string,
};

class LightSwitch extends React.Component<PropsType, StateType> {
    _unsubscribe: () => null = () => {return null;};

    state = {
        intensity: 0,
    };

    _light_bulb_img_on = require('../../assets/images/lighton.png');
    _light_bulb_img_off = require('../../assets/images/lightoff.png');

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

        if (reduxState && reduxState.things && reduxState.things.things_states) {
            const my_redux_state = reduxState.things.things_states[id];
            if (my_redux_state && my_redux_state.intensity != undefined && my_redux_state.intensity != intensity) {
                this.setState({intensity: my_redux_state.intensity});
            }
        }
    }

    changeIntensity(intensity: number) {
        // SocketCommunication.sendMessage({
        //     thing: this.props.id,
        //     intensity
        // });
        // this.context.store.dispatch(thingsActions.set_thing_partial_state(this.props.id, {intensity}));
    }

    render() {
        const { id } = this.props;
        const { intensity } = this.state;
        const light_bulb_img = intensity ? this._light_bulb_img_on : this._light_bulb_img_off;

        var on_press = (() => this.changeIntensity(1-this.state.intensity)).bind(this);

        return (
            <div style={styles.container}>
                <img style={styles.light_bulb}
                    onClick={on_press}
                    src={light_bulb_img}>
                </img>
            </div>
        );
    }
}
LightSwitch.contextTypes = {
    store: PropTypes.object
};

const styles = {
    container: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    light_bulb: {
        width: 100,
    },
};

export { LightSwitch };
