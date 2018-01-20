/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

const GenericCircularSlider = require('../../react-components/GenericCircularSlider.web');
const GenericToggle = require('../../react-components/GenericToggle.web');
const GenericButton = require('../../react-components/GenericButton.web');

import * as connectionActions from '../redux/actions/connection';
const { WebSocketCommunication } = require('../../js-api-utils/WebSocketCommunication');

type StateType = {
    set_pt: number,
    temp: number,
    fan: number,
    firstRender: boolean,
};

type PropsType = {
    id: string,
    layout: {
        top: number,
        left: number,
        width: number,
        height: number,
    },
    viewType: string,
};

class CentralAC extends React.Component<PropsType, StateType> {
    _unsubscribe: () => null = () => null;

    state = {
        set_pt: 0,
        temp: 0,
        fan: 0,
        firstRender: true,
    };

    _fan_speeds = [
        'Off',
        'Low',
        'High',
    ];

    _fan_icon = require('../../../assets/images/fan.png');

    _fan_actions = [
        () => this.changeFan(0),
        () => this.changeFan(1),
        () => this.changeFan(2)
    ];

    _max_temp: number = 30;
    _min_temp: number = 16;

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
        const { set_pt, temp, fan } = this.state;
        const { id } = this.props;

        if (reduxState && reduxState.connection && reduxState.connection.roomState) {
            const my_redux_state = reduxState.connection.roomState[id];
            if (my_redux_state &&
                ((my_redux_state.set_pt != undefined && my_redux_state.set_pt != set_pt) ||
                 (my_redux_state.temp != undefined && my_redux_state.temp != temp) ||
                 (my_redux_state.fan != undefined && my_redux_state.fan != fan))) {
                this.setState({
                    set_pt: my_redux_state.set_pt,
                    temp: my_redux_state.temp,
                    fan: my_redux_state.fan,
                });
            }
        }
    }

    round(value: number) {
        return (Math.round(value * 2) / 2);
    }

    changeTemperature(send_socket: boolean) {
        return ((new_set_pt: number) => {
            if (send_socket) {
                WebSocketCommunication.sendMessage({
                    [this.props.id]: {
                        ...this.context.store.getState().connection.roomState[this.props.id],
                        set_pt: new_set_pt,
                    }
                });
            }
            this.context.store.dispatch(connectionActions.setThingPartialState(this.props.id, {set_pt: new_set_pt}));
        }).bind(this);
    }

    changeFan(speed: number) {
        WebSocketCommunication.sendMessage({
            [this.props.id]: {
                ...this.context.store.getState().connection.roomState[this.props.id],
                fan: speed,
            }
        });
        this.context.store.dispatch(connectionActions.setThingPartialState(this.props.id, {fan: speed}));
    }


    firstFrameRendered() {
        setTimeout((() => {
            this.setState({
                firstRender: false,
            });
        }).bind(this), 0);
    }

    render() {
        const { id, layout, viewType } = this.props;
        const { set_pt, temp, fan, firstRender } = this.state;

        var slider = null;
        var toggles = null;
        var center_text_main = '';
        var center_text_sub = '';
        var room_temp_text = ' ';
        var hiding_style = {};

        if (viewType === 'detail') {
            if (fan) {
                center_text_main = set_pt.toFixed(1) + '°C';
                center_text_sub = 'Set Temperature';
            } else {
                center_text_main = 'Off';
            }

            room_temp_text = 'Room Temperature' + ' ' + temp.toFixed(1) + '°C';

            slider = (
                <GenericCircularSlider
                    value={set_pt}
                    minimum={this._min_temp} maximum={this._max_temp}
                    round={this.round.bind(this)}
                    onMove={this.changeTemperature(false).bind(this)}
                    onRelease={this.changeTemperature(true).bind(this)}
                    diameter={firstRender ? 1 : layout.height / 1.3}
                    arcWidth={firstRender ? 1 : 15}
                    knobDiameter={firstRender ? 1 : 35}
                    disabled={fan === 0} />
            );

            toggles = (
                <GenericToggle values={this._fan_speeds}
                    icon={this._fan_icon}
                    layout={{height: firstRender ? 0 : 35, width: firstRender ? 0 : layout.width - 150}}
                    actions={this._fan_actions}
                    selected={fan} />
            );
        } else {
            hiding_style = {
                display: 'none'
            };

            center_text_main = temp.toFixed(1) + '°C';
            center_text_sub = 'Room Temperature';
        }

        var toggles_container_style = styles.stack;
        if (viewType === 'detail')
            toggles_container_style = {...toggles_container_style, ...styles.buttons_stack};

        if (firstRender)
            requestAnimationFrame(this.firstFrameRendered.bind(this));

        return (
            <div style={styles.container}>
                <div style={styles.stack}>
                    {slider}
                    <div style={styles.center_text_container}>
                        <div style={styles.center_text_sub}>{center_text_sub}</div>
                        <div style={styles.center_text_main}>{center_text_main}</div>
                    </div>
                </div>

                <div style={styles.minus_container}>
                    <GenericButton
                        disabled={fan === 0 || set_pt == this._min_temp}
                        icon={require('../../../assets/images/minus.png')}
                        style={hiding_style}
                        layout={{width: firstRender ? 0 : 40, height: firstRender ? 0 : 40}}
                        action={() => {
                            this.changeTemperature(true)(Math.max(this._min_temp, this.state.set_pt - 0.5))
                        }} />
                </div>

                <div style={styles.plus_container}>
                    <GenericButton
                        disabled={fan === 0 || set_pt == this._max_temp}
                        icon={require('../../../assets/images/plus.png')}
                        style={hiding_style}
                        layout={{width: firstRender ?  0 : 40, height: firstRender ? 0 : 40}}
                        action={() => {
                            this.changeTemperature(true)(Math.min(this._max_temp, this.state.set_pt + 0.5))
                        }} />
                </div>

                <div style={styles.stack}>
                    {toggles}
                </div>

                <div style={styles.stack}>
                    <div style={styles.room_temperature}>{room_temp_text}</div>
                </div>
            </div>
        );
    }
}

CentralAC.contextTypes = {
  store: PropTypes.object
};

const styles = {
    container: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    center_text_container: {
        pointerEvents: 'none',
        display: 'flex',
        width: '100%',
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    stack: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttons_stack: {
        position: 'relative',
        display: 'flex',
        height: 50,
    },
    minus_container: {
        marginTop: -20,
        display: 'flex',
        position: 'absolute',
        left: 10,
    },
    plus_container: {
        marginTop: -20,
        display: 'flex',
        position: 'absolute',
        right: 10,
    },
    room_temperature: {
        position: 'relative',
        display: 'flex',
        fontSize: 14,
        color: '#aaaaaa',
        backgroundColor: '#00000000',
    },
    center_text_main: {
        fontSize: 28,
        color: '#ffffff',
        backgroundColor: '#00000000',
        alignItems: 'center',
    },
    center_text_sub: {
        fontSize: 12,
        color: '#aaaaaa',
        backgroundColor: '#00000000',
        alignItems: 'center',
    },
};

module.exports = { CentralAC };
