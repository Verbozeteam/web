/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

type StateType = {
    intensity: number,
};

type PropsType = {
    id: string,
    layout: Object,
    viewType: string,
};

class LightSwitch extends React.Component<PropsType, StateType> {
    state = {
        intensity: 0,
    };

    _light_bulb_img_on = require('../../../assets/images/lighton.png');
    _light_bulb_img_off = require('../../../assets/images/lightoff.png');

    changeIntensity(intensity: number) {
        // SocketCommunication.sendMessage({
        //     thing: this.props.id,
        //     intensity
        // });
        // this.context.store.dispatch(connectionActions.set_thing_partial_state(this.props.id, {intensity}));
    }

    render() {
        const { id, viewType } = this.props;
        const { intensity } = this.state;

        var layout = this.props.layout;

        var on_press = () => {};
        if (viewType === 'detail')
            on_press = (() => this.changeIntensity(1-this.state.intensity)).bind(this);

        return (
            <div style={styles.container} onClick={on_press}>
                <div style={styles.light_bulb_container}>
                    <img style={Object.assign(layout, styles.light_bulb)}
                            src={intensity ? this._light_bulb_img_on : this._light_bulb_img_off}>
                    </img>
                </div>
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
        flex: 1
    },
    light_bulb_container: {
        display: 'flex',
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%'
    },
    light_bulb: {
        display: 'flex',
        flex: 1,
        width: 50,
        height: 50,
    },
};

module.exports = { LightSwitch };
