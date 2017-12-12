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
    currentPanel: string,
};

class RoomGrid extends React.Component<PropsType, StateType> {
    state = {
        currentPanel: "",
    };

    togglePanel(panel: ConnectionTypes.PanelType) {
        const { currentPanel } = this.state;
        if (panel.name.en == currentPanel)
            this.setState({currentPanel: ""});
        else
            this.setState({currentPanel: panel.name.en});
    }

    renderPanelContents(panel: ConnectionTypes.PanelType) {
        return <div></div>;
    }

    renderPanel(panel: ConnectionTypes.PanelType,
                left: number,
                top: number,
                width: number,
                height: number,
                layout: string) : PropTypes.ReactComponent<> {

        var panelStyle = {
            top,
            left,
            width,
            height,
            ...styles.panel,
        }

        var toggleFunction = (() => this.togglePanel(panel)).bind(this);
        var closeButton = null;
        if (layout === "detail")
            closeButton = <img  style={styles.closeButton}
                                src={require('../../../assets/images/close.png')}
                                onClick={toggleFunction}/>;

        return (
            <div key={"panel-"+panel.name.en} style={panelStyle} onClick={layout !== 'detail' ? toggleFunction : null}>
                <div style={styles.panelHeader}>
                    {panel.name.en}
                    {closeButton}
                </div>
                <div style={styles.panelBody}>
                    {this.renderPanelContents(panel)}
                </div>
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

                renderedPanels.push(this.renderPanel(panelData, curLeftOffset, curTopOffset, panelWidth, panelHeight, 'presentation'));

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

        var numPanels = curRoomConfig.grid.map(c => c.panels.length).reduce((a, b) => a + b);

        var collapsedWidth = (1/(collapsedRatio+1)) * (width-panelMargin*3);
        var detailWidth = (collapsedRatio/(collapsedRatio+1)) * (width-panelMargin*3);
        var collapsedHeight = (1/(numPanels-1)) * (height-panelMargin*(numPanels));
        var detailHeight = (height-panelMargin*2);

        var collapsedLeft = collapsedSide === 'left' ? panelMargin : (width - collapsedWidth - panelMargin);
        var detailLeft = collapsedSide === 'right' ? panelMargin : (width - detailWidth - panelMargin);
        var detailTop = panelMargin;
        var collapsedTop = panelMargin;

        for (var i = 0; i < curRoomConfig.grid.length; i++) {
            var columnData = curRoomConfig.grid[i];
            for (var j = 0; j < columnData.panels.length; j++) {
                var panelData = columnData.panels[j];

                if (panelData.name.en === currentPanel) {
                    renderedPanels.push(this.renderPanel(panelData, detailLeft, detailTop, detailWidth, detailHeight, 'detail'));
                } else {
                    renderedPanels.push(this.renderPanel(panelData, collapsedLeft, collapsedTop, collapsedWidth, collapsedHeight, 'collapsed'));
                    collapsedTop += panelMargin + collapsedHeight;
                }
            }
        }

        return renderedPanels;
    }

    render() {
        const { currentPanel } = this.state;
        var renderedPanels = currentPanel === "" ? this.renderPresentationView() : this.renderDetailView();

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
        color: 'white',
        fontSize: 14,
        display: 'flex',
        flexDirection: 'column',

        transition: 'left 500ms, top 500ms, width 500ms, height 500ms',
    },
    panelHeader: {
        height: 20,
        padding: 3,
    },
    closeButton: {
        float: 'right',
        width: 16,
        height: 16,
    },
    panelBody: {
        flex: 1,
        padding: 3,
    }
};

module.exports = { RoomGrid: ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomGrid) };
