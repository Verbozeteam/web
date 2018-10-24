/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import * as Styles from '../constants/Styles';

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
    setCurrentRoom: (roomId: string) => {},
    guestName: string,
};

type StateType = {
};

class RoomCardBase extends React.Component<PropsType, StateType> {
    _unsubscribe: () => any = () => null;

    onClick() {
        this.props.setCurrentRoom(this.props.room.id);
    }

    render() {
        const { room, roomGroups, guestName } = this.props;

        return (
            <div className={'col-12 col-sm-6 col-lg-3'} onClick={this.onClick.bind(this)} style={ styles.roomCardContainer }>
                <div className={'container-fluid'} style={ styles.roomCardContent }>
                    <div style={ styles.roomName }>
                        Room #{room.name}
                    </div>
                    <div style={ styles.guestName }>
                        { guestName ? 'Yahya Alhomsi' : 'No Guest' }
                    </div>
                    <RoomView room={room} isSummary={true}/>
                </div>
            </div>
        );
    }
};
RoomCardBase.contextTypes = {
    store: PropTypes.object
};

const styles = {
    roomCardContainer: {
        paddingTop: '15px',
    },
    roomCardContent: {
        height: '100%',
        minHeight: '175px',
        paddingTop: '15px',
        borderRadius: '5px',
        backgroundColor: Styles.Colors.dark_gray,
        borderBottom: '4px solid',
        borderBottomColor: Styles.Colors.red
    },
    roomName: {
        fontSize: '22px',
        color: Styles.Colors.white,
    },
    guestName: {
        fontSize: '18px',
        color: Styles.Colors.gray,
        fontStyle: 'italic'
    },
    redStrip: {
        borderRadius: '5px',
        backgroundColor: Styles.Colors.red,
    }
};

export const RoomCard = ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomCardBase);
