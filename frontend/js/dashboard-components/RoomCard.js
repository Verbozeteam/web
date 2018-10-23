/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { connect as ReduxConnect } from 'react-redux';
import * as UIStateActions from './redux/actions/uistate';

import * as APITypes from '../js-api-utils/APITypes';

import { RoomView } from './RoomView';

import { RoomConfigManager } from '../js-api-utils/RoomsConfigManager';
import type { GroupType } from '../js-api-utils/ConfigManager'

import type {
    ThingMetadataType,
    ThingStateType,
} from '../js-api-utils/ConfigManager';

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        setCurrentRoom: (rid: string) => dispatch(UIStateActions.setCurrentRoom(rid)),
    };
}

type PropsType = {
    room: APITypes.Room,
    roomGroups: Array<GroupType>,
    setCurrentRoom: (roomId: string) => {}
};

type StateType = {
};

class RoomCardBase extends React.Component<PropsType, StateType> {
    _unsubscribe: () => any = () => null;

    onClick() {
        this.props.setCurrentRoom(this.props.room.id);
    }

    render() {
        const { room, roomGroups} = this.props;

        return (
            <div style={styles.roomContainer}>
                <div style={styles.roomCard}
                    onClick={this.onClick.bind(this)}>
                    <div style={styles.roomCardContent}>
                        <RoomView room={room} isSummary={true}/>
                    </div>
                    <div style={styles.roomCardTitle}>
                        <div style={styles.roomCardSeparator}></div>
                        <h3>Room {room.name}</h3>
                    </div>
                </div>
            </div>
        );
    }
};
RoomCardBase.contextTypes = {
    store: PropTypes.object
};

const styles = {
    roomContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    roomCard: {
        width: 200,
        height: 200,
        borderRadius: 15,
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        display: 'flex',
        flexDirection: 'column',
    },
    roomCardContent: {
        display: 'flex',
        flexDirection: 'column',
        flex: 3,

        borderRadius: 15,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,

        backgroundColor: 'rgba(250, 250, 250, 0.4)',
        padding: 10,
    },
    roomCardTitle: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,

        borderRadius: 15,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,

        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(250, 250, 250, 0.4)',
    },
    roomCardSeparator: {
        width: '80%',
    },
};



export const RoomCard = ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomCardBase);
