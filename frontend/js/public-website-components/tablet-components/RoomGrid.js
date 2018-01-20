/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import * as ConnectionTypes from '../../js-api-utils/ConnectionTypes';

import { LightsPanel } from './LightsPanel';
import { HotelControls } from './HotelControls';
import { CentralAC } from './CentralAC';
import { Curtains } from './Curtains';

type PropsType = {
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

    renderPanelContents(panel: ConnectionTypes.PanelType,
                left: number,
                top: number,
                width: number,
                height: number,
                viewType: string) {

        if (panel.things.length === 0)
            return <div></div>;

        switch (panel.things[0].category) {
            case "dimmers":
            case "light_switches":
                return (
                    <LightsPanel
                        layout={{left, width, top, height: height-20}}
                        viewType={viewType}
                        things={panel.things}
                        presets={panel.presets}
                    />
                );
            case "central_acs":
                return <CentralAC
                        id={panel.things[0].id}
                        layout={{left, width, top, height:height-20}}
                        viewType={viewType}
                    />
            case "hotel_controls":
                return <HotelControls
                        id={panel.things[0].id}
                        viewType={viewType}
                    />
            case "curtains":
                return <Curtains
                        layout={{left, width, top, height:height-20}}
                        viewType={viewType}
                        things={panel.things}
                    />
        }

        return <div></div>;
    }

    renderPanel(panel: ConnectionTypes.PanelType,
                left: number,
                top: number,
                width: number,
                height: number,
                viewType: string) : PropTypes.ReactComponent<> {

        var panelStyle = {
            top,
            left,
            width,
            height,
            ...styles.panel,
        }

        var panelBodyStyle = {
            ...styles.panelBody,
        }

        var toggleFunction = (() => this.togglePanel(panel)).bind(this);
        var closeButton = null;
        if (viewType === 'detail')
            closeButton = <img  style={styles.closeButton}
                                src={require('../../../assets/images/close.png')}
                                onClick={toggleFunction}/>;
        else
            panelBodyStyle.pointerEvents = 'none';

        var panelContents = null;
        if (viewType !== 'collapsed') {
            panelContents = (
                <div style={panelBodyStyle}>{
                    this.renderPanelContents(
                        panel,
                        left+styles.panelBody.padding,
                        top+styles.panelBody.padding,
                        width-styles.panelBody.padding*2,
                        height-styles.panelBody.padding*2,
                        viewType
                    )
                }</div>
            );
        } else {
            panelStyle.justifyContent = 'center';
        }

        return (
            <div key={"panel-"+panel.name.en} style={panelStyle} onClick={viewType !== 'detail' ? toggleFunction : null}>
                <div style={viewType === 'collapsed' ? styles.panelHeaderCollapsed : styles.panelHeader}>
                    {panel.name.en}
                    {closeButton}
                </div>
                {panelContents}
            </div>
        );
    }

    renderPresentationView() {
        const { width, height } = this.props;
        const roomConfig = this.context.store.getState().connection.roomConfig;
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
        const { width, height } = this.props;
        const roomConfig = this.context.store.getState().connection.roomConfig;
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
        // backgroundColor: 'black',
        background: 'linear-gradient(to bottom right, #1c2f4f, #0f1f3f)',
        borderRadius: 0,
        color: 'white',
        fontSize: 14,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',

        transition: 'left 300ms, top 300ms, right 300ms, bottom 300ms, width 300ms, height 300ms',
    },
    panelHeader: {
        height: 20,
        padding: 3,
    },
    panelHeaderCollapsed: {
        padding: 3,
    },
    closeButton: {
        float: 'right',
        width: 16,
        height: 16,
    },
    panelBody: {
        flex: 1,
        padding: 5,
    }
};

export { RoomGrid };
