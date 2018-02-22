/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { RoomStateUpdater } from '../utilities/RoomStateUpdater';

import { MagicCircle } from './MagicCircle';
import { DimmerSlider } from './DimmerSlider';

type PropsType = {
    width: number,
    height: number,
    slopeX: number,
    isFullscreen: boolean,
};

type StateType = {
    things: Array<Object>,
    presets: Array<Object>,
    currentPresetIndex: number,
    idToName: Object;
};

class LightsStack extends React.Component<PropsType, StateType> {
    _unsubscribe: () => null = () => null;

    _accentColor: string = "#BA3737";

    state: StateType = {
        things: [],
        presets: [],
        currentPresetIndex: -1,
        idToName: {},
    };

    componentWillMount() {
        const { store }= this.context;
        this._unsubscribe = store.subscribe(this.onReduxStateChanged.bind(this));
        this.onReduxStateChanged();
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    onReduxStateChanged() {
        const { store } = this.context;
        const reduxState = store.getState();

        const { things, currentPresetIndex } = this.state;
        var { presets, idToName } = this.state;

        var stateUpdate = {};

        if (reduxState && reduxState.connection && reduxState.connection.roomState) {
            if (Object.keys(idToName).length === 0) {
                var tings = reduxState.connection.roomConfig.rooms[0].groups[0].things; // HACK
                stateUpdate.idToName = {};
                for (var t in tings)
                    stateUpdate.idToName[tings[t].id] = tings[t].name;
            }

            var my_things = [];
            for (var key in reduxState.connection.roomState) {
                var thing = reduxState.connection.roomState[key];
                if (thing.category === 'light_switches' || thing.category === 'dimmers')
                    my_things.push(thing);
            }
            if (JSON.stringify(my_things) !== JSON.stringify(things))
                stateUpdate = {...stateUpdate, things: my_things};
        }

        if (reduxState && reduxState.connection && reduxState.connection.roomConfig) {
            var reduxPresets = reduxState.connection.roomConfig.rooms[0].groups[0].presets; // HACK
            if (JSON.stringify(reduxPresets) !== JSON.stringify(presets)) {
                stateUpdate = {...stateUpdate, presets: reduxPresets};
                presets = reduxPresets;
            }
        }

        var newPreset = this.getCurrentPresetSwitchFromReduxState(reduxState, presets);
        if (newPreset != currentPresetIndex)
            stateUpdate = {...stateUpdate, currentPresetIndex: newPreset};

        if (Object.keys(stateUpdate).length > 0)
            this.setState(stateUpdate);
    }

    computeDistanceToPreset(preset: Object, state: Object) {
        for (var k in preset)
            if (state[k] == undefined)
                delete preset[k];
        var preset_intensity = Object.keys(preset).map((tid) => !preset[tid].intensity ? 0 : (state[tid].category == 'dimmers' ? preset[tid].intensity / 100 : preset[tid].intensity)).reduce((a, b) => a + b);
        var state_intensity = Object.keys(state).filter((k) => k in preset).map((tid) => !state[tid].intensity ? 0 : (state[tid].category == 'dimmers' ? state[tid].intensity / 100 : state[tid].intensity)).reduce((a, b) => a + b);
        return Math.abs(preset_intensity - state_intensity);
    }

    getCurrentPresetSwitchFromReduxState(reduxState: Object, presets: Array<Object>) {
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

        return lowest_dist_index;
    }

    setLightIntensity(id: string, intensity: number) {
        RoomStateUpdater.update(this.context.store, id, {intensity});
    }

    changePreset(new_preset: number) {
        const { presets } = this.state;

        RoomStateUpdater.updateMany(this.context.store, presets[new_preset]);
    }

    renderDimmer(d: Object) {
        const { idToName } = this.state;
        var w = (this.props.width-tabStyles.container.margin*2)/2;
        var h = 40;

        return (
            <div key={"l-"+d.id} style={dimmerStyles.container}>
                <div style={tabStyles.texts}>{idToName[d.id]}</div>
                <DimmerSlider width={w}
                              height={h}
                              value={d.intensity}
                              maxValue={100}
                              glowColor={this._accentColor}
                              increment={10}
                              onChange={(v => this.setLightIntensity(d.id, v)).bind(this)}/>
            </div>
        );
    }

    renderSwitch(s: Object) {
        const { idToName } = this.state;

        return (
            <div key={"s-"+s.id} style={switchStyles.container}>
                <MagicCircle width={35}
                             height={35}
                             extraStyle={{marginRight: 10}}
                             isOn={s.intensity > 0}
                             text={s.intensity ? "On" : ""}
                             textColor={'#ffffff'}
                             glowColor={this._accentColor}
                             onClick={(() => this.setLightIntensity(s.id, 1-s.intensity)).bind(this)}
                             sideText={idToName[s.id]}
                             sideTextStyle={{...tabStyles.texts, marginLeft: 10, lineHeight: '35px'}} />
            </div>
        );
    }

    renderSeparator(index: number) {
        return (
            <div key={"lights-separator-"+index} style={tabStyles.separatorContainer}>
                <div style={tabStyles.separator} />
            </div>
        );
    }

    renderFullscreen() {
        const { things, presets, currentPresetIndex } = this.state;
        var { width, height, slopeX } = this.props;

        var presetsView = null;
        if (presets.length > 0) {
            var presetButtons = [];
            for (var i = 0; i < presets.length; i++) {
                const index = i;
                presetButtons.push(
                    <MagicCircle key={"preset-key-"+i}
                                 width={35}
                                 height={35}
                                 extraStyle={{marginLeft: 10}}
                                 isOn={i === currentPresetIndex}
                                 text={i === 0 ? "Off" : i}
                                 textColor={'#ffffff'}
                                 glowColor={this._accentColor}
                                 onClick={(() => this.changePreset(index)).bind(this)} />
                );
            }
            presetsView = (
                <div style={tabStyles.presetsContainer}>
                    <div style={{...tabStyles.texts, marginBottom: 10, marginLeft: 10}}>{"Presets"}</div>
                    <div style={tabStyles.rowFlexer}>
                        {presetButtons}
                    </div>
                </div>
            );
        }

        var thingsView = null;
        if (things.length > 0) {
            var dimmers = things.filter(t => t.category === 'dimmers').map((t => this.renderDimmer(t)).bind(this));
            var switches = things.filter(t => t.category === 'light_switches').map((t => this.renderSwitch(t)).bind(this));
            thingsView = (
                <div style={tabStyles.columnFlexer}>
                {dimmers}
                {this.renderSeparator()}
                {switches}
                </div>
            );
        }

        return (
            <div style={{...tabStyles.container, width: width-slopeX-tabStyles.container.margin*2, height: height-60-tabStyles.container.margin}}>
                <div style={tabStyles.tab}>{presetsView}</div>
                <div style={tabStyles.tab}>{thingsView}</div>
            </div>
        );
    }

    renderStack() {
        const { things } = this.state;
        const { width, height, slopeX } = this.props;

        var intensitiesIndicators = null;
        if (things.length > 0) {
            var numBars = things.length;
            var numEmptyBars = Math.max(0, numBars-1);
            var totalWidth = 50;
            var barWidth = totalWidth / (numBars + numEmptyBars);
            var bars = [];
            for (var i = 0; i < numBars; i++) {
                if (things[i].intensity)
                    bars.push(<div key={"bar-"+i} style={{...stackStyles.onBar, width: barWidth}} />);
                else
                    bars.push(<div key={"bar-"+i} style={{...stackStyles.offBar, width: barWidth}} />);
                if (i !== numBars - 1)
                    bars.push(<div key={"ebar-"+i} style={{width: barWidth}} />);
            }
            intensitiesIndicators = <div style={stackStyles.intensitiesContainer}>{bars}</div>;
        }

        return (
            <div style={{...stackStyles.container, width: width-slopeX, height}}>
                <div style={stackStyles.stackContent}>
                    {intensitiesIndicators}
                </div>
            </div>
        );
    }

    render() {
        if (this.props.isFullscreen)
            return this.renderFullscreen();
        return this.renderStack();
    }
}
LightsStack.contextTypes = {
    store: PropTypes.object
};

const dimmerStyles = {
    container: {
        flex: 3,
    },
};

const switchStyles = {
    container: {
        flex: 2,
        display: 'flex',
        flexDirection: 'row',
    },
};

const tabStyles = {
    container: {
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'hidden',
        margin: 5,
        marginTop: 60,
        display: 'flex',
        flexDirection: 'row',
    },
    tab: {
        flex: 1,
        position: 'relative',
        height: '100%',
    },
    presetsContainer: {
        width: 160,
        height: 80,
        position: 'absolute',
        bottom: 0,
    },
    separatorContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: '#444444',
    },
    texts: {
        fontWeight: 'lighter',
        color: '#ffffff',
        fontSize: 16,
    },
    rowFlexer: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
    },
    columnFlexer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
    },
};

const stackStyles = {
    container: {
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'hidden',
    },
    stackContent: {
        position: 'absolute',
        bottom: 30,
        left: 45,
    },
    intensitiesContainer: {
        display: 'flex',
        flexDirection: 'row',
        height: 2,
    },
    onBar: {
        height: 2,
        backgroundColor: '#ffffff',
    },
    offBar: {
        height: 1,
        backgroundColor: '#888888',
    },
};

export { LightsStack };
