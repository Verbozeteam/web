/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { connect as ReduxConnect } from 'react-redux';
import * as UIStateActions from './redux/actions/uistate';

import * as APITypes from '../api-utils/APITypes';
import * as ConnectionTypes from '../api-utils/ConnectionTypes';

import { HotelControlsPanelContents } from './HotelControlsPanelContents'
import { LightSwitch } from './LightSwitch'

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {};
}

type PropsType = {
    isSummary: boolean,
    room: APITypes.Room,
    ...any,
};

type StateType = {
    config: ConnectionTypes.ConfigType,
};

class RoomViewBase extends React.Component<PropsType, StateType> {
    _unsubscribe: () => null = () => null;

    state = {
        config: {},
    };

    componentWillMount() {
        const { store } = this.context;
        this._unsubscribe = store.subscribe(this.onReduxStateChanged.bind(this));
        this.onReduxStateChanged();
    }

    componentWillUnmount() {
        this._unsubscribe();
    }

    onReduxStateChanged() {
        const { store } = this.context;
        const reduxState = store.getState();
        const { room } = this.props;
        const { config } = this.state;

        try {
            const my_config = reduxState.connection.roomConfigs[room.id];

            if (JSON.stringify(my_config) !== JSON.stringify(config))
                this.setState({config: my_config});
        } catch (e) {}
    }

    renderPanel(roomConfig: ConnectionTypes.RoomType, panel: ConnectionTypes.PanelType) {
        var panel_contents = null;

        if (panel.things.length > 0) {
            switch (panel.things[0].category) {
                case 'dimmers':
                case 'light_switches':
                    panel_contents = (
                        <div style={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'row',
                            overflow: 'hidden',
                            height: 150,
                            maxWidth: 400,}}>
                            {panel.things.map(t => (
                                <LightSwitch
                                    key={"thing-"+t.id}
                                    id={t.id}
                                    />
                            ))}
                        </div>
                    );
                    // rendered_panel = (
                    //     <LightsPanel
                    //         things={panel.things}
                    //         viewType={viewType}
                    //         layout={{width: Dimensions.get('window').width - (isPressed ? 40 : 60), height: 24}}
                    //         presets={panel.presets} />
                    // );
                    break;
                case 'hotel_controls':
                    panel_contents = (
                        <HotelControlsPanelContents
                            id={panel.things[0].id} />
                    );
                    break;
                case 'central_acs':
                    // rendered_panel = (
                    //     <CentralAC
                    //         id={panel.things[0].id}
                    //         layout={{width: Dimensions.get('window').width - 100, height: Dimensions.get('window').height}}
                    //         viewType={viewType} />
                    // );
                    break;
            }
        }

        return (
            <div key={roomConfig.name.en+"-panel-"+panel.name.en}>
                <h4>{panel.name.en}</h4>
                {panel_contents}
            </div>
        );
    }

    renderRoom(roomConfig: ConnectionTypes.RoomType) {
        const { room } = this.props;

        var panels = [];
        for (var i = 0; i < roomConfig.grid.length; i++)
            for (var j = 0; j < roomConfig.grid[i].panels.length; j++)
                panels.push(roomConfig.grid[i].panels[j]);

        return (
            <div key={"room-"+room.id+"-subroom-"+roomConfig.name.en}
                style={styles.subroom}>
                <h3>
                    {roomConfig.name.en}
                </h3>
                {panels.map(p => this.renderPanel(roomConfig, p))}
            </div>
        );
    }

    renderSummary() {
        return (
            <div>
                {"summary-hay"}
            </div>
        );
    }

    renderFull() {
        const { config } = this.state;

        var room_views = [];
        if (config && config.rooms) {
            for (var i = 0; i < config.rooms.length; i++) {
                room_views.push(this.renderRoom(config.rooms[i]));
            }
        }

        return (
            <div style={styles.container}>
                {room_views}
            </div>
        );
    }

    render() {
        return this.props.isSummary ? this.renderSummary() : this.renderFull();
    }
};
RoomViewBase.contextTypes = {
    store: PropTypes.object
};

const styles = {
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
    },
    subroom: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    }
};



export const RoomView = ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomViewBase);
