/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { RoomStateUpdater } from '../utilities/RoomStateUpdater';
import { TimeoutHandler } from '../../js-api-utils/TimeoutHandler';

import { MagicCircle } from './MagicCircle';

type PropsType = {
    width: number,
    height: number,
    slopeX: number,
    isFullscreen: boolean,
};

type StateType = {
    curtains: {[string]: Object},
    idToName: Object;
};

class CurtainsStack extends React.Component<PropsType, StateType> {
    _unsubscribe: () => null = () => null;

    _accentColor: string = "#D04F4C";

    _openIcon: string = require('../../../assets/images/open_arrow.png');
    _closeIcon: string = require('../../../assets/images/close_arrow.png');
    _pauseIcon:string = require('../../../assets/images/stop_button.png');

    // curtain-id -> max time needed for curtain to fully open or close
    _curtainMoveMaxTimes : {[string]: number} = {};
    // curtain-id -> time it was clicked
    _curtainClickTimes : {[string]: number} = {};

    state: StateType = {
        curtains: {},
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
        const { curtains, idToName } = this.state;

        var stateUpdate = {};

        if (reduxState && reduxState.connection && reduxState.connection.roomState) {
            if (Object.keys(idToName).length === 0) {
                var tings = reduxState.connection.roomConfig.rooms[0].grid[0].panels[1].things; // HACK
                stateUpdate.idToName = {};
                for (var t in tings)
                    stateUpdate.idToName[tings[t].id] = tings[t].name.en;
            }

            var my_things = [];
            for (var key in reduxState.connection.roomState) {
                var thing = reduxState.connection.roomState[key];
                if (thing.category === 'curtains')
                    my_things.push(thing);
            }

            for (var i = 0; i < my_things.length; i++) {
                if (!(my_things[i].id in curtains) || JSON.stringify(curtains[my_things[i].id]) !== JSON.stringify(my_things[i])) {
                    TimeoutHandler.clearTimeout(my_things[i].id);
                    this._curtainMoveMaxTimes[my_things[i].id] = my_things[i].moveMaxTime || 2000;
                    if (!stateUpdate.curtains)
                        stateUpdate.curtains = curtains;
                    stateUpdate.curtains = {...stateUpdate.curtains, [my_things[i].id]: my_things[i]};
                }
            }
        }

        if (Object.keys(stateUpdate).length > 0)
            this.setState(stateUpdate);
    }

    setCurtainValue(curtain: Object) {
        const curtains = curtain === undefined ? Object.keys(this.state.curtains).map(c => this.state.curtains[c]) : [curtain];

        return ((value: number) => {
            var totalUpdate = {};
            var curTime = (new Date()).getTime();
            for (var i = 0; i < curtains.length; i++) {
                if (value !== 0) { // first click, record the time
                    this._curtainClickTimes[curtains[i].id] = curTime;
                } else { // ending the click, if too short, then let the curtain auto move
                    if (curTime - this._curtainClickTimes[curtains[i].id] < 500) {
                        const c = curtains[i];
                        const v = value;
                        TimeoutHandler.createTimeout(
                            curtains[i].id,
                            this._curtainMoveMaxTimes[curtains[i].id],
                            (() => this.setCurtainValue(c)(0)).bind(this));
                        continue; // don't perform the update on this curtain, auto update will do it
                    }
                }
                totalUpdate[curtains[i].id] = {curtain: value};
                this.state.curtains[curtains[i].id].curtain = value;
            }

            if (Object.keys(totalUpdate).length > 0) {
                this.forceUpdate();
                RoomStateUpdater.updateMany(this.context.store, totalUpdate);
            }
        }).bind(this);
    }

    renderCurtainView(id: string) {
        const { idToName } = this.state;

        var curtain = this.state.curtains[id];
        var text = id === "" ? "All" : idToName[curtain.id];
        var isOpening = curtain ? curtain.curtain === 1 : Object.keys(this.state.curtains).map(c => this.state.curtains[c].curtain).reduce((a, b) => a === 1 && b === 1);
        var isClosing = curtain ? curtain.curtain === 2 : Object.keys(this.state.curtains).map(c => this.state.curtains[c].curtain).reduce((a, b) => a === 2 && b === 2);

        return (
            <div key={"curtain-"+id}>
                <div style={tabStyles.texts}>{text}</div>
                <div style={tabStyles.controlsContainer}>
                    <MagicCircle
                                 width={40}
                                 height={40}
                                 extraStyle={{marginLeft: 0}}
                                 isOn={isOpening}
                                 glowColor={this._accentColor}
                                 onPressIn={() => this.setCurtainValue(curtain)(1)}
                                 onPressOut={() => this.setCurtainValue(curtain)(0)}
                                 icon={this._openIcon} />
                    <MagicCircle
                                 width={40}
                                 height={40}
                                 extraStyle={{marginLeft: 20}}
                                 glowColor={this._accentColor}
                                 onPressIn={() => this.setCurtainValue(curtain)(0)}
                                 icon={this._pauseIcon} />
                    <MagicCircle
                                 width={40}
                                 height={40}
                                 extraStyle={{marginLeft: 20}}
                                 isOn={isClosing}
                                 glowColor={this._accentColor}
                                 onPressIn={() => this.setCurtainValue(curtain)(2)}
                                 onPressOut={() => this.setCurtainValue(curtain)(0)}
                                 icon={this._closeIcon} />
                </div>
            </div>
        );
    }

    renderSeparator(index: number) {
        return (
            <div key={"curtains-separator-"+index} style={tabStyles.separatorContainer}>
                <div style={tabStyles.separator} />
            </div>
        );
    }

    renderFullscreen() {
        const { curtains } = this.state;
        var { width, height, slopeX } = this.props;
        var curtainIds = Object.keys(curtains).sort();
        var numCurtains = curtainIds.length;

        var allView = null;
        if (numCurtains > 0) {
            allView = (
                <div style={tabStyles.allContainer}>
                    {this.renderCurtainView("")}
                </div>
            );
        }

        var thingsView = [];
        if (numCurtains > 0) {
            for (var i = 0; i < numCurtains; i++) {
                thingsView.push(this.renderCurtainView(curtainIds[i]));
                if (i !== numCurtains - 1)
                    thingsView.push(this.renderSeparator(i));
            }
        }

        return (
            <div style={{...tabStyles.container, width: width-slopeX-tabStyles.container.margin*2, height: height-60-tabStyles.container.margin}}>
                <div style={tabStyles.tab}>{allView}</div>
                <div style={{flex: 1}} />
                <div style={{...tabStyles.tab, alignItems: 'flex-end'}}>{thingsView}</div>
            </div>
        );
    }

    renderStack() {
        const { width, height, slopeX } = this.props;

        return (
            <div style={{...stackStyles.container, width: width-slopeX, height}}>
                <div style={stackStyles.stackContent}>
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
CurtainsStack.contextTypes = {
    store: PropTypes.object
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
        padding: 10,
        paddingTop: 0,
    },
    tab: {
        flex: 2,
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    allContainer: {
        position: 'absolute',
        bottom: 0,
    },
    separatorContainer: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: 160,
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
        marginLeft: 5,
    },
    controlsContainer: {
        display: 'flex',
        flexDirection: 'row',
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

export { CurtainsStack };
