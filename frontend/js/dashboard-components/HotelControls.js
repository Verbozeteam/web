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
};


export default class HotelControls extends React.Component<PropsType, StateType> {
    _unsubscribe: () => any = () => null;

    state = {
        doNotDisturb: false,
        housekeeping: false
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
        const { doNotDisturb, housekeeping } = this.state;

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
    }

    render(){
        const { id } = this.props;
        const { doNotDisturb, housekeeping } = this.state;

        return (
            <div>
                Room Status: { doNotDisturb ? 'DND' : housekeeping ? 'HK' : 'None'}
            </div>
        )
    }
}
