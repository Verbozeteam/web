
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
                    this.setState({curtains: {...this.state.curtains, ...{[curtain_id]: my_redux_state.curtain}}});
                }
            }
        }
    }

    setCurtainValue(curtain: ConnectionTypes.GenericThingType) {
        return ((value: number) => {
            var state = {curtain: value};
            WebSocketCommunication.sendMessage({
                [curtain.id]: state,
            });
            this.context.store.dispatch(connectionActions.setThingPartialState(curtain.id, state));
        }).bind(this);
    }

    renderCurtain(thing: ConnectionTypes.GenericThingType, isUpDown: boolean) {
        const { things, layout, viewType } = this.props;

        var my_width = layout.width / things.length;
        var container_layout = {
            height: Math.min(layout.height, my_width),
            width: Math.min(layout.height, my_width),
        };

        var content = null;
        if (viewType === 'detail') {
            return (
                <div key={'curtain-'+thing.id} style={{...styles.curtain_container, ...container_layout}}>
                    <div style={styles.header}>
                        {thing.name.en}
                    </div>
                    <div style={styles.stack}>
                        <div style={styles.button}>
                            <GenericButton
                                icon={isUpDown ? this._up_arrow : this._open_arrow}
                                layout={{width: container_layout.width*(2/7), height: container_layout.height*(2/7)}}
                                borderRadius={0.4}
                                pressIn={() => this.setCurtainValue(thing)(1)}
                                pressOut={() => this.setCurtainValue(thing)(0)} />
                        </div>
                    </div>
                    <div style={styles.stack}>
                        <div style={styles.button}>
                            <GenericButton
                                icon={isUpDown ? this._down_arrow : this._close_arrow}
                                layout={{width: container_layout.width*(2/7), height: container_layout.height*(2/7)}}
                                borderRadius={0.4}
                                pressIn={() => this.setCurtainValue(thing)(2)}
                                pressOut={() => this.setCurtainValue(thing)(0)} />
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div key={'curtain-'+thing.id} style={{...styles.curtain_container, ...container_layout}}>
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
