/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { RoomStateUpdater } from '../utilities/RoomStateUpdater';

import { MagicCircle } from './MagicCircle';
import { ACSlider } from './ACSlider';

type PropsType = {
    width: number,
    height: number,
    slopeX: number,
    isFullscreen: boolean,
};

type StateType = {
    things: Array<Object>,
    highlightButton: number, // -1 no highlight, 0 - button, 1 + button
};

class CentralACStack extends React.Component<PropsType, StateType> {
    _unsubscribe: () => null = () => null;

    _accentColor: string = "#D04F4C";

    state: StateType = {
        things: [],
        highlightButton: -1,
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

        const { things } = this.state;

        if (reduxState && reduxState.connection && reduxState.connection.roomState) {
            var my_things = [];
            for (var key in reduxState.connection.roomState) {
                var thing = reduxState.connection.roomState[key];
                if (thing.category === 'central_acs')
                    my_things.push(thing);
            }
            if (JSON.stringify(my_things) !== JSON.stringify(things)) {
                this.setState({things: my_things});
            }
        }
    }

    setACFan(id: string, fan: number) {
        RoomStateUpdater.update(this.context.store, id, {fan});
    }

    setACTemp(id: string, temp: number) {
        RoomStateUpdater.update(this.context.store, id, {set_pt: temp});
    }

    renderFullscreen() {
        const { things, highlightButton } = this.state;
        var { width, height, slopeX } = this.props;

        var tabWidth = width - slopeX - tabStyles.container.margin*2;

        var settingsView = null;
        var roomTemperatureView = null;

        if (things.length > 0) {
            var ac = things[0];
            var isEnabled = ac.fan !== 0;

            var minusProps = !isEnabled ? {
                style: tabStyles.signsButtonsContainer
            } : {
                onMouseLeave: (() => this.setState({highlightButton: -1})).bind(this),
                onMouseEnter: (() => this.setState({highlightButton: 0})).bind(this),
                onClick: (() => this.setACTemp(ac.id, Math.max(16, ac.set_pt - 0.5))).bind(this),
                style: tabStyles.signsButtonsContainer
            };
            var plusProps = !isEnabled ? {
                style: tabStyles.signsButtonsContainer
            } : {
                onMouseLeave: (() => this.setState({highlightButton: -1})).bind(this),
                onMouseEnter: (() => this.setState({highlightButton: 1})).bind(this),
                onClick: (() => this.setACTemp(ac.id, Math.min(32, ac.set_pt + 0.5))).bind(this),
                style: tabStyles.signsButtonsContainer,
            };

            if (!isEnabled) {
                minusProps.style = {...minusProps.style, ...tabStyles.signsButtonsDisabled};
                plusProps.style = {...plusProps.style, ...tabStyles.signsButtonsDisabled};
            } else if (highlightButton === 0)
                minusProps.style = {...minusProps.style, ...tabStyles.signsButtonsHighlight};
            else if (highlightButton === 1)
                plusProps.style = {...plusProps.style, ...tabStyles.signsButtonsHighlight};

            roomTemperatureView = (
                <div style={tabStyles.roomTempContainer}>
                    <div>{ac.temp.toFixed(1) + " °C"}</div>
                    <div>{"Room temperature"}</div>
                </div>
            );

            settingsView = (
                <div style={tabStyles.settingsContainer}>
                    <div style={tabStyles.settingTemp}>
                        <div style={tabStyles.settingTempButtonsContainer}>
                            <div {...minusProps}>{"-"}</div>
                            <div style={tabStyles.settingTempText}>{ac.set_pt.toFixed(1) + " °C"}</div>
                            <div {...plusProps}>{"+"}</div>
                        </div>
                        <ACSlider width={Math.max(tabWidth/2-40, 185)}
                                  height={30}
                                  value={ac.set_pt}
                                  enabled={isEnabled}
                                  onChange={(t => this.setACTemp(ac.id, t)).bind(this)} />
                    </div>
                    <div style={tabStyles.settingFanContainer}>
                        <MagicCircle width={35}
                                     height={35}
                                     isOn={ac.fan === 0}
                                     text={"Off"}
                                     textColor={"#ffffff"}
                                     glowColor={this._accentColor}
                                     onClick={(() => this.setACFan(ac.id, 0)).bind(this)}
                                     extraStyle={tabStyles.fanButton} />
                        <MagicCircle width={35}
                                     height={35}
                                     isOn={ac.fan === 1}
                                     glowColor={this._accentColor}
                                     onClick={(() => this.setACFan(ac.id, 1)).bind(this)}
                                     text={"Lo"}
                                     textColor={"#ffffff"}
                                     extraStyle={tabStyles.fanButton} />
                        <MagicCircle width={35}
                                     height={35}
                                     isOn={ac.fan === 2}
                                     glowColor={this._accentColor}
                                     onClick={(() => this.setACFan(ac.id, 2)).bind(this)}
                                     text={"Hi"}
                                     textColor={"#ffffff"}
                                     extraStyle={tabStyles.fanButton} />
                    </div>
                </div>
            );
        }

        return (
            <div style={{...tabStyles.container, width: tabWidth, height: height-60 - tabStyles.container.margin*2}}>
                <div style={tabStyles.leftTab}>{settingsView}</div>
                <div style={tabStyles.rightTab}>{roomTemperatureView}</div>
            </div>
        );
    }

    renderStack() {
        const { things } = this.state;
        const { width, height, slopeX } = this.props;

        var temp = "";
        if (things.length > 0)
            temp = things[0].temp.toFixed(1) + " °C";

        return (
            <div style={{...stackStyles.container, width: width-slopeX, height}}>
                <div style={stackStyles.stackContent}>
                    <div style={stackStyles.temperatureNumber}>{temp}</div>
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
CentralACStack.contextTypes = {
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
        paddingBottom: 10,
    },
    leftTab: {
        flex: 2,
        position: 'relative',
        height: '100%',
    },
    rightTab: {
        flex: 2,
        position: 'relative',
        height: '100%',
    },
    roomTempContainer: {
        fontWeight: 'lighter',
        color: '#ffffff',
        fontSize: 16,
        width: 140,
        position: 'absolute',
        bottom: 0,
    },
    settingsContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingTemp: {
        flex: 1,
    },
    settingTempButtonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        fontWeight: 'lighter',
        color: '#ffffff',
        fontSize: 20,
        lineHeight: 3,
        textAlign: 'center',
    },
    signsButtonsContainer: {
        fontSize: 28,
        lineHeight: 2,
        color: '#aaaaaa',
        flex: 1,
    },
    signsButtonsHighlight: {
        color: '#ffffff',
    },
    signsButtonsDisabled: {
        color: '#666666',
    },
    settingTempText: {
        flex: 3
    },
    settingFanContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: 150,
        height: 50,
    },
    fanButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        color: '#ffffff',
        left: 30,
    },
    temperatureNumber: {
        fontWeight: 'lighter',
        fontSize: 20,
    },
};

export { CentralACStack };
