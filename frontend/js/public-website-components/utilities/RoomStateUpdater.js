/* @flow */

import * as connectionActions from '../redux/actions/connection';
const { WebSocketCommunication } = require('../../js-api-utils/WebSocketCommunication');

class RoomStateUpdaterImpl {
    _isDemo: boolean = true;

    resetDemo() {
        this._isDemo = true;
    }

    update(store: Object, id:string, partialUpdate: Object, isDemo: boolean) {
        if (!isDemo)
            this._isDemo = false;
        else if (!this._isDemo)
            return; // demo is over, don't do this action!

        WebSocketCommunication.sendMessage({
            [id]: {
                ...store.getState().connection.roomState[id],
                ...partialUpdate
            }
        });
        store.dispatch(connectionActions.setThingPartialState(id, partialUpdate));
    }

    updateMany(store: Object, partialUpdate: Object, isDemo: boolean) {
        if (!isDemo)
            this._isDemo = false;
        else if (!this._isDemo)
            return; // demo is over, don't do this action!

        var ws_msg = {};
        for (var k in partialUpdate) {
            ws_msg[k] = {
                ...store.getState().connection.roomState[k],
                ...partialUpdate[k],
            };
        }

        WebSocketCommunication.sendMessage(ws_msg);
        store.dispatch(connectionActions.setThingsPartialStates(partialUpdate));
    }
};

module.exports = {
    RoomStateUpdater: new RoomStateUpdaterImpl()
};
