/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

const GenericToggle = require('../../react-components/GenericToggle.web');

const connectionActions = require('../redux/actions/connection');
import { WebSocketCommunication } from '../../js-api-utils/WebSocketCommunication';

type StateType = {
    currentPresetIndex: number,
};

type PropsType = {
    presets: Array<Object>,
};

class PresetsSwitch extends React.Component<PropsType, StateType> {
    _unsubscribe: () => null = () => null;

    state = {
        currentPresetIndex: 0,
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
        const { currentPresetIndex } = this.state;
        const { presets } = this.props;

        if (reduxState && reduxState.connection && reduxState.connection.roomState) {
            var distances = [];
            var lowest_dist = 100000;
            var lowest_dist_index = -1;
            for (var i = 0; i < presets.length; i++) {
                distances.push(this.computeDistanceToPreset(presets[i], reduxState.connection.roomState));
                if (distances[i] < lowest_dist) {
                    lowest_dist = distances[i];
                    lowest_dist_index = i;
                }
            }

            if (lowest_dist_index == 0 && distances[0] > 0.01)
                lowest_dist_index++;
            else if (lowest_dist_index == distances.length - 1 && distances[distances.length-1] > 0.01)
                lowest_dist_index--;

            if (lowest_dist_index != currentPresetIndex)
                this.setState({currentPresetIndex: lowest_dist_index});
        }
    }

    computeDistanceToPreset(preset: Object, state: Object) {
        for (var k in preset)
            if (state[k] == undefined)
                delete preset[k];
        var preset_intensity = Object.keys(preset).map((tid) => !preset[tid].intensity ? 0 : (state[tid].category == 'dimmers' ? preset[tid].intensity / 100 : preset[tid].intensity)).reduce((a, b) => a + b);
        var state_intensity = Object.keys(state).filter((k) => k in preset).map((tid) => !state[tid].intensity ? 0 : (state[tid].category == 'dimmers' ? state[tid].intensity / 100 : state[tid].intensity)).reduce((a, b) => a + b);
        return Math.abs(preset_intensity - state_intensity);
    }

    changePreset(new_preset: number) {
        const { presets } = this.props;

        var ws_msg = {};
        for (var k in presets[new_preset]) {
            ws_msg[k] = {
                ...this.context.store.getState().connection.roomState[k],
                ...presets[new_preset][k],
            };
        }
        WebSocketCommunication.sendMessage(ws_msg);

        this.context.store.dispatch(connectionActions.setThingsPartialStates(presets[new_preset]));
    }

    render() {
        const { presets } = this.props;
        const { currentPresetIndex } = this.state;

        var on_press = (() => this.changePreset((this.state.currentPresetIndex + 1) % presets.length)).bind(this);
        var values = presets.map((p, i) => i == 0 ? "Off" : i.toString()).reverse();
        var actions = presets.map((p, i) => ((() => this.changePreset(presets.length-1-i)).bind(this)));

        return (
            <div style={styles.container}>
                <div style={styles.slider_container}>
                    <div style={styles.slider_container_container}>
                        <GenericToggle values={values}
                            orientation={"vertical"}
                            layout={{
                                height: 100,
                                width: 40,
                            }}
                            sameSameValue={true}
                            actions={actions}
                            selected={presets.length-1-currentPresetIndex} />
                    </div>
                </div>
            </div>
        );
    }
}
PresetsSwitch.contextTypes = {
    store: PropTypes.object
};

const styles = {
    container: {
        position: 'relative',
        display: 'flex',
        flex: 1,
        height: undefined,
        width: undefined,
    },
    light_bulb: {
        position: 'relative',
        display: 'flex',
        flex: 1,
        width: undefined,
        height: undefined,
    },
    slider_container: {
        position: 'relative',
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slider_container_container: {
        position: 'absolute',
    }
};

module.exports = { PresetsSwitch };
