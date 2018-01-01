/* @flow */

import {
    SET_CONNECTION_STATE,
    SET_THINGS_STATES,
    SET_THING_STATE,
    SET_THINGS_PARTIAL_STATES,
    SET_THING_PARTIAL_STATE,
} from '../actions/connection';

import * as APITypes from '../../../api-utils/APITypes';
import * as ConnectionTypes from '../../../api-utils/ConnectionTypes';

type StateType = {
    connectionState: 0 | 1 | 2,
    roomConfig: ConnectionTypes.ConfigType,
    roomState: {[string]: Object},
};

const defaultState: StateType = {
    /* 0 - not connected, 1 - connecting, 2 - connected */
    connectionState: 0,
    roomConfig: {
        "id": "1",
        "rooms": [{
            "detail": {"ratio": 4, "side": "left"},
            "grid": [{
                "panels": [{
                    "name": {"en": "Lighting"},
                    "presets": [{
                            "dimmer-1": {"intensity": 0},
                            "lightswitch-1": {"intensity": 0},
                            "lightswitch-2": {"intensity": 0},
                            "lightswitch-3": {"intensity": 0}
                        }, {
                            "dimmer-1": {"intensity": 50},
                            "lightswitch-1": {"intensity": 0},
                            "lightswitch-2": {"intensity": 1},
                            "lightswitch-3": {"intensity": 1}
                        }, {
                            "dimmer-1": {"intensity": 100},
                            "lightswitch-1": {"intensity": 1},
                            "lightswitch-2": {"intensity": 1},
                            "lightswitch-3": {"intensity": 1}
                        }
                    ],
                    "ratio": 5,
                    "things": [{
                        "category": "dimmers",
                        "id": "dimmer-1",
                        "name": {"en": "Bedside"}
                    }, {
                        "category": "light_switches",
                        "id": "lightswitch-1",
                        "name": {"en": "Main"}
                    }, {
                        "category": "light_switches",
                        "id": "lightswitch-2",
                        "name": {"en": "Side"}
                    }, {
                        "category": "light_switches",
                        "id": "lightswitch-3",
                        "name": {"en": "Entrance"}
                    }]
                }, {
                    "name": {"en": "Curtains"},
                    "ratio": 3,
                    "things": [{
                            "category": "curtains",
                            "id": "curtain-1",
                            "name": {"en": "Curtain"}
                        }, {
                            "category": "curtains",
                            "id": "curtain-2",
                            "name": {"en": "Shade"}
                        }
                    ]
                }],
                "ratio": 3
            }, {
                "panels": [{
                    "name": {"en": "Air Conditioning"},
                    "ratio": 5,
                    "things": [{
                            "category": "central_acs",
                            "id": "central-ac-v0-d50",
                            "name": {"en": "Air Conditioning"}
                        }
                    ]
                }, {
                    "name": {"en": "Room Service"},
                    "ratio": 5,
                    "things": [{
                            "category": "hotel_controls",
                            "id": "hotel-controls",
                            "name": {"en": "Room Service"}
                        }
                    ]
                }],
                "ratio": 2
            }],
            "layout": {"margin": 2},
            "name": {"en": "QSTP 1"}
        }]
    },
    roomState: {
        "dimmer-1": {"id": "dimmer-1", "category": "dimmers", "intensity": 0},
        "lightswitch-1": {"id": "lightswitch-1", "category": "light_switches", "intensity": 0},
        "lightswitch-2": {"id": "lightswitch-2", "category": "light_switches", "intensity": 0},
        "lightswitch-3": {"id": "lightswitch-3", "category": "light_switches", "intensity": 0},
        "curtain-1": {"id": "curtain-1", "category": "curtains", "curtain": 0, "moveMaxTime": 10000},
        "curtain-2": {"id": "curtain-2", "category": "curtains", "curtain": 0, "moveMaxTime": 10000},
        "central-ac-v0-d50": {"id": "central-ac-v0-d50", "category": "central_acs", "set_pt": 25.0, "temp": 25.0, "fan": 1},
        "hotel-controls": {"id": "hotel-controls", "category": "hotel_controls", "card": 1, "do_not_disturb": 0, "room_service": 0, "power": 1}
    },
};

module.exports = (state: StateType = defaultState, action: Object) => {
    var new_state: StateType = JSON.parse(JSON.stringify(state));

    switch(action.type) {
        /** set WebSocket connection state */
        case SET_CONNECTION_STATE:
            new_state.connectionState = action.connectionState;
            break;

        /** room state manegement */
        case SET_THING_STATE:
            if (!new_state.roomState)
                new_state.roomState = {};
            new_state.roomState[action.thingId] = action.state;
            break;
        case SET_THINGS_STATES:
            if (!new_state.roomState)
                new_state.roomState = {};
            new_state.roomState = {
                ...new_state.roomState,
                ...action.thingToState
            };
            break;
        case SET_THING_PARTIAL_STATE:
            new_state.roomState[action.thingId] = {
                ...new_state.roomState[action.thingId],
                ...action.state
            };
            break;
        case SET_THINGS_PARTIAL_STATES:
            if (!new_state.roomState)
                new_state.roomState = {};
            for (var k in action.thingToPartialState)
                new_state.roomState[k] = {
                    ...new_state.roomState[k],
                    ...action.thingToPartialState[k]
                };
        break;
    }

    return new_state;
}
