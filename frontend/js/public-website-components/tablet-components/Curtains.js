
import * as React from 'react';
import PropTypes from 'prop-types';

const GenericSlider = require('../../react-components/GenericSlider.web');
const GenericButton = require('../../react-components/GenericButton.web');
import * as connectionActions from '../redux/actions/connection';

import * as ConnectionTypes from '../../api-utils/ConnectionTypes';
import { WebSocketCommunication } from '../../api-utils/WebSocketCommunication';

type PropsType = {
    layout: {
        width: number,
        height: number,
        left: number,
        top: number,
    },
    viewType: 'collapsed' | 'detail' | 'presentation',
    things: Array<ConnectionTypes.GenericThingType>,
};

type StateType = {
    curtains: {
        [string]: number,
    },
};

class Curtains extends React.Component<PropsType, StateType> {
    _unsubscribe: () => null = () => null;

    _down_arrow = require('../../../assets/images/down_arrow.png');
    _up_arrow = require('../../../assets/images/up_arrow.png');
    _close_arrow = require('../../../assets/images/close_arrow.png');
    _open_arrow = require('../../../assets/images/open_arrow.png');
    _stop_button = require('../../../assets/images/stop_button.png');

    _clickState : {[string]: {time: number, autoClearTimeout?: () => null, moveMaxTime: number}}
        = {}; // curtain-id -> time last clicked, a timeout set to auto stop the curtain and the max time needed to clear

    state = {
        curtains: {},
    };

    componentWillMount() {
        const { store } = this.context;
        this._unsubscribe = store.subscribe(this.onReduxStateChanged.bind(this));
        this.onReduxStateChanged();

        var curtains_state = {};
        for (var i = 0; i < this.props.things.length; i++)
            curtains_state[this.props.things[i].id] = 0;
        this.setState({curtains: curtains_state});
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    onReduxStateChanged() {
        const { store } = this.context;
        const reduxState = store.getState();
        const { curtains } = this.state;

        if (reduxState && reduxState.connection && reduxState.connection.roomState) {
            for (var curtain_id in curtains) {
                const my_val = curtains[curtain_id];
                const my_redux_state = reduxState.connection.roomState[curtain_id];
                if (my_redux_state && my_redux_state.curtain != undefined && my_redux_state.curtain != my_val) {
                    if (this._clickState[curtain_id].autoClearTimeout) {
                        clearTimeout(this._clickState[curtain_id].autoClearTimeout);
                        this._clickState[curtain_id].autoClearTimeout = undefined;
                    }
                    if (my_redux_state.moveMaxTime)
                        this._clickState[curtain_id].moveMaxTime = my_redux_state.moveMaxTime;
                    this.setState({curtains: {...this.state.curtains, ...{[curtain_id]: my_redux_state.curtain}}});
                }
            }
        }
    }

    setCurtainValue(curtain: ConnectionTypes.GenericThingType) {
        const curtains = curtain === undefined ? this.props.things : [curtain];

        return ((value: number) => {
            var totalUpdate = {};
            var curTimeMs = (new Date).getTime();
            for (var i = 0; i < curtains.length; i++) {
                if (value !== 0) { // first click, record the time
                    this._clickState[curtains[i].id].time = curTimeMs;
                } else { // ending the click, if too short, then let the curtain auto move
                    if (curTimeMs - this._clickState[curtains[i].id].time < 500) {
                        this._clickState[curtains[i].id].time = 0;
                        const c = curtains[i];
                        const v = value;
                        if (this._clickState[curtains[i].id].autoClearTimeout)
                            clearTimeout(this._clickState[curtains[i].id].autoClearTimeout);
                        this._clickState[curtains[i].id].autoClearTimeout = setTimeout(() => this.setCurtainValue(c)(v), this._clickState[curtains[i].id].moveMaxTime);
                        continue; // don't perform the update on this curtain, auto update will do it
                    }
                }
                totalUpdate[curtains[i].id] = {curtain: value};
            }

            if (Object.keys(totalUpdate).length > 0) {
                WebSocketCommunication.sendMessage(totalUpdate);
                this.context.store.dispatch(connectionActions.setThingsPartialStates(totalUpdate));
            }
        }).bind(this);
    }

    renderCurtain(thing: ConnectionTypes.GenericThingType, isUpDown: boolean) {
        const { things, layout, viewType } = this.props;

        if (thing && !this._clickState[thing.id])
            this._clickState[thing.id] = {time: 0, moveMaxTime: 2000};

        var my_width = layout.width / (things.length + 1);
        var container_layout = {
            height: layout.height, //Math.min(layout.height, my_width),
            width: my_width, //Math.min(layout.height, my_width),
        };

        var thingId = thing !== undefined ? thing.id : "all-curtains";
        var thingName = thing !== undefined ? thing.name.en : "All";
        var content = null;
        if (viewType === 'detail') {
            return (
                <div key={'curtain-'+thingId} style={{...styles.curtain_container, ...container_layout}}>
                    <div style={styles.header}>
                        {thingName}
                    </div>
                    <div style={styles.stack}>
                        <div style={styles.button}>
                            <GenericButton
                                icon={isUpDown ? this._up_arrow : this._open_arrow}
                                layout={{width: container_layout.height*(2/9), height: container_layout.height*(2/9)}}
                                borderRadius={0.4}
                                pressIn={() => this.setCurtainValue(thing)(1)}
                                pressOut={() => this.setCurtainValue(thing)(0)} />
                        </div>
                    </div>
                    <div style={styles.stack}>
                        <div style={styles.button}>
                            <GenericButton
                                icon={this._stop_button}
                                layout={{width: container_layout.height*(2/9), height: container_layout.height*(2/9)}}
                                borderRadius={0.4}
                                pressIn={() => this.setCurtainValue(thing)(0)} />
                        </div>
                    </div>
                    <div style={styles.stack}>
                        <div style={styles.button}>
                            <GenericButton
                                icon={isUpDown ? this._down_arrow : this._close_arrow}
                                layout={{width: container_layout.height*(2/9), height: container_layout.height*(2/9)}}
                                borderRadius={0.4}
                                pressIn={() => this.setCurtainValue(thing)(2)}
                                pressOut={() => this.setCurtainValue(thing)(0)} />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div key={'curtain-'+thingId} style={{...styles.curtain_container, ...container_layout}}>
                    <div style={styles.curtain_img}></div>
                </div>
            );
        }
    }

    render() {
        const { things, layout, viewType } = this.props;

        return (
            <div style={styles.container}>
                {things.map((t, i) => this.renderCurtain(t, i % 2 === 1))}
                {this.renderCurtain(undefined, false)}
            </div>
        );
    }
};
Curtains.contextTypes = {
    store: PropTypes.object
};
const styles = {
    container: {
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    curtain_container: {
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        flex: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stack: {
        flex: 2,
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
    },
    button: {
        display: 'flex',
        flex: 1,
        textAlign: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    curtain_img: {
        width: '100%',
        height: '100%',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(' + require('../../../assets/images/curtain.png') + ')',
    },
};

export { Curtains };
