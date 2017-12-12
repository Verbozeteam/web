/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect as ReduxConnect } from 'react-redux';
import * as ConnectionTypes from '../../api-utils/ConnectionTypes';

import * as connectionActions from '../redux/actions/connection';

function mapStateToProps(state) {
    return {
        roomConfig: state.connection.roomConfig,
    };
}

function mapDispatchToProps(dispatch) {
    return {
    };
}

type PropsType = {
    roomConfig: ConnectionTypes.RoomType,
    width: number,
    height: number,
};

type StateType = {
    currentPanel: number,
};

class RoomGrid extends React.Component<PropsType, StateType> {
    state = {
        currentPanel: -1,
    };

    renderPanel(panel: ConnectionTypes.PanelType,
                left: number,
                top: number,
                width: number,
                height: number) {
        var panelStyle = {
            top,
            left,
            width,
            height,
            ...styles.panel,
        }
        return (
            <div key={"panel-"+panel.name.en} style={panelStyle}>
                {panel.name.en}
            </div>
        );
    }

    renderPresentationView() {
        const { roomConfig, width, height } = this.props;
        var curRoomConfig = roomConfig.rooms[0];

        var renderedPanels = [];

        var panelMargin = curRoomConfig.layout.margin;

        var totalColumnRatios = curRoomConfig.grid.map(c => c.ratio).reduce((a, b) => a + b);
        var totalColumnMargins = panelMargin * (curRoomConfig.grid.length+1);
        var curLeftOffset = panelMargin;

        for (var i = 0; i < curRoomConfig.grid.length; i++) {
            var columnData = curRoomConfig.grid[i];
            var columnRatio = columnData.ratio;

            var totalRowRatios = columnData.panels.map(p => p.ratio).reduce((a, b) => a + b);
            var totalRowMargins = panelMargin * (columnData.panels.length+1);
            var curTopOffset = panelMargin;

            var panelWidth = (columnRatio / totalColumnRatios) * (width-totalColumnMargins);

            for (var j = 0; j < columnData.panels.length; j++) {
                var panelData = columnData.panels[j];
                var rowRatio = panelData.ratio;

                var panelHeight = (rowRatio / totalRowRatios) * (height-totalRowMargins);

                renderedPanels.push(this.renderPanel(panelData, curLeftOffset, curTopOffset, panelWidth, panelHeight));

                curTopOffset += panelHeight + panelMargin;
            }

            curLeftOffset += panelWidth + panelMargin;
        }

        return renderedPanels;
    }

    renderDetailView() {
        const { currentPanel } = this.state;
        const { roomConfig, width, height } = this.props;
        var curRoomConfig = roomConfig.rooms[0];

        var renderedPanels = [];

        var panelMargin = curRoomConfig.layout.margin;
        var collapsedRatio = curRoomConfig.detail.ratio;
        var collapsedSide = curRoomConfig.detail.side;

        return renderedPanels;
    }

    render() {
        const { currentPanel } = this.state;
        var renderedPanels = currentPanel === -1 ? this.renderPresentationView() : this.renderDetailView();

        return (
            <div style={styles.container}>
                {renderedPanels}
            </div>
        );
    }
}
RoomGrid.contextTypes = {
    store: PropTypes.object
};

const styles = {
    container: {
        flex: 1,
    },
    panel: {
        position: 'absolute',
        backgroundColor: 'black',
        borderRadius: 5,
    }
};

module.exports = { RoomGrid: ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomGrid) };
