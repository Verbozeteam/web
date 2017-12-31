/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { connect as ReduxConnect } from 'react-redux';
import * as UIStateActions from './redux/actions/uistate';

import * as APITypes from '../api-utils/APITypes';

import { RoomView } from './RoomView';

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
    ...any,
};

type StateType = {
};

class RoomCardBase extends React.Component<PropsType, StateType> {
    onClick() {
        this.props.setCurrentRoom(this.props.room.id);
    }

    render() {
        const { room } = this.props;

        return (
            <div style={styles.roomContainer}>
                <div style={styles.roomCard}
                    onClick={this.onClick.bind(this)}>
                    <div style={styles.roomCardContent}>
                        <RoomView room={room} isSummary={true}/>
                    </div>
                    <div style={styles.roomCardTitle}>
                        <div style={styles.roomCardSeparator}></div>
                        <h3>{room.name}</h3>
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
        borderRadius: 20,
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',

        display: 'flex',
        flexDirection: 'column',
    },
    roomCardContent: {
        display: 'flex',
        flexDirection: 'column',
        flex: 3,

        borderRadius: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,

        backgroundColor: 'rgba(250, 250, 250, 255)',
        padding: 10,
    },
    roomCardTitle: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,

        borderRadius: 20,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,

        alignItems: 'center',
        justifyContent: 'center',

        background: '-webkit-linear-gradient(rgba(220, 220, 220, 255), rgba(230, 230, 230, 255))', /* For Safari 5.1 to 6.0 */
        background: '-o-linear-gradient(rgba(220, 220, 220, 255), rgba(230, 230, 230, 255))', /* For Opera 11.1 to 12.0 */
        background: '-moz-linear-gradient(rgba(220, 220, 220, 255), rgba(230, 230, 230, 255))', /* For Firefox 3.6 to 15 */
        background: 'linear-gradient(rgba(220, 220, 220, 255), rgba(230, 230, 230, 255))', /* Standard syntax */
    },
    roomCardSeparator: {
        width: '80%',
    },
};



export const RoomCard = ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomCardBase);
