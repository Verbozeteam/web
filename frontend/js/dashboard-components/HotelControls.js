/* @flow */

import * as React from 'react';

import { RoomConfigManager } from '../js-api-utils/RoomsConfigManager';

import type {
    GroupType,
    ConfigType,
    ThingMetadataType,
    ThingStateType
} from '../js-api-utils/ConfigManager'

type PropsType = {
    id: string,
    roomId: string
};

type StateType = {
    doNotDisturb: boolean,
    housekeeping: boolean,
    cardIn: boolean
};


export default class HotelControls extends React.Component<PropsType, StateType> {
    _unsubscribe: () => any = () => null;

    state = {
        doNotDisturb: false,
        housekeeping: false,
        cardIn: false,
    }

    componentWillMount() {
        this.componentWillReceiveProps(this.props);
    }

    componentWillReceiveProps(newProps: PropsType) {
        this._unsubscribe();
        if (newProps.id && newProps.roomId) {
            this._unsubscribe = RoomConfigManager.getConfigManager(newProps.roomId).registerThingStateChangeCallback(newProps.id, this.onRoomStatusChanged.bind(this));
            if (newProps.id in RoomConfigManager.getConfigManager(newProps.roomId).things)
                this.onRoomStatusChanged(RoomConfigManager.getConfigManager(newProps.roomId).thingMetas[newProps.id], RoomConfigManager.getConfigManager(newProps.roomId).things[newProps.id]);
        }
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    onRoomStatusChanged(meta: ThingMetadataType, roomStatusState: ThingStateType) {
        const { doNotDisturb, housekeeping, cardIn } = this.state;

        if (roomStatusState.room_service == 1 && roomStatusState.do_not_disturb == 0) {
            this.setState({
                doNotDisturb: false,
                housekeeping: true,
            });
        }
        if (roomStatusState.do_not_disturb == 1 && roomStatusState.room_service == 0) {
            this.setState({
                doNotDisturb: true,
                housekeeping: false,
            });
        }
        else if (roomStatusState.do_not_disturb == 0 && roomStatusState.room_service == 0) {
            this.setState({
                doNotDisturb: false,
                housekeeping: false,
            })
        }

        /* setting state of room to occupied or not based on card information */
        this.setState({
            cardIn: roomStatusState.card == 1 ? true : false,
        })

    }

    renderStatusIndicators() {
        const { doNotDisturb, housekeeping, cardIn } = this.state;

        const _occupied = require('../../assets/dashboard_images/occupied.png');
        const _dnd = require('../../assets/dashboard_images/DND.png');
        const _housekeeping = require('../../assets/dashboard_images/housekeeping.png');

        return (
            <div className={'row'} style={ styles.statusIndicators }>
                <div className={'col'}>
                    <img src={ _occupied } style={{ opacity: cardIn ? '1' : '0.15' }} />
                </div>
                <div className={'col'}>
                    <img src={ _dnd } style={{ opacity: doNotDisturb ? '1' : '0.15' }} />
                </div>
                <div className={'col'}>
                    <img src={ _housekeeping } style={{ opacity: housekeeping ? '1' : '0.15' }} />
                </div>
                <div className={'col'}>
                </div>
            </div>
        );
    }

    render(){
        const { id } = this.props;

        return (
            <div>
                { this.renderStatusIndicators() }
            </div>
        )
    }
}

const styles = {
    statusIndicators: {
        paddingTop: '20px'
    }
};
