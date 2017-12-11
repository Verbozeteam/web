/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { Panel } from './Panel';
import { LightsPanelContents } from './LightsPanelContents';

type PropsType = {
    layout: Object,
    roomConfig: Object,
};

type StateType = {
    currentPanel: number,
};

class RoomGrid extends React.Component<PropsType, StateType> {
    _presentation_layout = [];
    _detail_layout = {};
    _collapsed_layout = {};
    _num_panels: number = 0;

    _screen_blocker_timer = undefined;

    state = {
        currentPanel: -1,
    };

    calculatePresentationLayout() {
        const { roomConfig } = this.props;
        const grid = roomConfig.grid;
        const layout = {...this.props.layout, ...roomConfig.layout};

        var right_to_left = false;

        this._presentation_layout = [];
        this._num_panels = 0;

        // stop if grid has no columns
        if (grid.length === 0 ) {
            return;
        }

        // calculate sum of column ratios to calculate single column width
        var { ratio } = grid.reduce((a, b) => ({ratio: a.ratio + b.ratio}));
        const ratio_width = (layout.width - layout.margin * 2) / ratio;

        // calculate panel layouts (height, width, top and left offsets)
        var top = layout.top + layout.margin;
        var left = 0;
        if (right_to_left)  {
          left = layout.width - layout.left - layout.margin;
        } else {
          left = layout.left + layout.margin;
        }
        for (var i = 0; i < grid.length; i++) {
            // calculate column width based on ratio width
            const column_width = grid[i].ratio * ratio_width
                - layout.margin * 2;

            // skip column if has no rows
            if (grid[i].panels.length === 0) {
                // reset top offset and increment left offset
                top = layout.margin;
                if (right_to_left) {
                  left -= column_width + layout.margin * 2;
                } else {
                  left += column_width + layout.margin * 2;
                }
                continue;
            }

            // calculate sum of row ratios to calculate single row width
            var { ratio } = grid[i].panels.reduce((a, b) => ({ratio: a.ratio + b.ratio}));
            const ratio_height = (layout.height - layout.margin * 2) / ratio;

            if (right_to_left) {
              left -= column_width + layout.margin * 2;
            }

            for (var j = 0; j < grid[i].panels.length; j++) {
                // calculate row height based on ratio height
                const row_height = grid[i].panels[j].ratio * ratio_height
                    - layout.margin * 2;

                // add panel's layout to array
                this._presentation_layout.push({
                    position: 'absolute',
                    height: row_height,
                    width: column_width,
                    top,
                    left
                });

                // increment top offset
                top += row_height + layout.margin * 2;
                this._num_panels++;
            }

            // reset top offset and increment left offset
            top = layout.top + layout.margin;
            if (!right_to_left) {
              left += column_width + layout.margin * 2;
            }
        }
    }

    calculateDetailAndCollapsedLayout() {
        const { roomConfig } = this.props;
        const grid = roomConfig.grid;
        const layout = {...this.props.layout, ...roomConfig.layout};
        const detail = roomConfig.detail;

        var right_to_left = false;

        // calculate single column width and single row width for
        // collapsed panels
        const ratio_width = (layout.width - layout.margin * 2) /
            (detail.ratio + 1);
        const ratio_height = (layout.height - layout.margin * 2) /
            (this._num_panels - 1);

        // calculate detail layout for use when panel enters detail view
        this._detail_layout = {
            position: 'absolute',
            height: layout.height - layout.margin * 4,
            width: ratio_width * detail.ratio - layout.margin * 2,
            top: layout.top + layout.margin,
        };

        // calculate collapsed layout for use when panels become collapsed
        this._collapsed_layout = {
            position: 'absolute',
            height: ratio_height - layout.margin * 2,
            width: ratio_width - layout.margin * 2,
        };

        if (right_to_left) {
          this._detail_layout.left = layout.left + layout.margin;
          this._collapsed_layout.left = layout.left + (layout.width - ratio_width) - layout.margin;
        } else {
          this._detail_layout.left = layout.left + ratio_width + layout.margin;
          this._collapsed_layout.left = layout.left + layout.margin;
        }
    }

    setCurrentPanel(i: number) {
        if (i == this.state.currentPanel)
            i = -1;

        this.setState({
            currentPanel: i
        });
    }

    renderPanelContents(viewType: ViewType, layout: LayoutType, panel: PanelType) {
        var things = panel.things;
        if (things.length > 0 && viewType !== 'collapsed') {
            var presets = null;

            switch (things[0].category) {
                case 'dimmers':
                case 'light_switches':
                    return  <LightsPanelContents
                        viewType={viewType}
                        things={things}
                        layout={layout}
                        presets={panel.presets}/>
                // case 'hotel_controls':
                //     return <HotelControlsPanelContents
                //         id={things[0].id}
                //         viewType={viewType}/>;
                // case 'central_acs':
                //     return <CentralAC
                //         id={things[0].id}
                //         layout={layout}
                //         viewType={viewType}/>;
            }
        }
        return null;
    }


    renderPresentationView() {
        const { roomConfig } = this.props;
        const grid = roomConfig.grid;

        this.calculatePresentationLayout();

        var panels = [];
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].panels.length; j++) {
                const index = panels.length;

                // create panel base don presentation view layout and
                // add to array
                const panel = <Panel key={'panel-' + index}
                    name={grid[i].panels[j].name}
                    layout={this._presentation_layout[index]}
                    viewType={'present'}
                    toggleDetail={() => this.setCurrentPanel(index)}>
                    {this.renderPanelContents('present', this._presentation_layout[index], grid[i].panels[j])}
                </Panel>

                panels.push(panel);
            }
        }

        return panels;
    }

    renderDetailWithCollapsedView() {
        const { roomConfig } = this.props;
        const grid = roomConfig.grid;
        const layout = {...this.props.layout, ...roomConfig.layout};
        const { currentPanel } = this.state;

        this.calculateDetailAndCollapsedLayout();

        var panels = [];
        var counter = 0;
        for (var i = 0; i < grid.length; i++) {
            for (var j = 0; j < grid[i].panels.length; j++) {
                const index = panels.length;

                // decide panel layout based on whether detail or collapsed
                var panel_layout: LayoutType = null;
                var view_type = 'collapsed';
                var contents = null;
                if (index === currentPanel) {
                    panel_layout = this._detail_layout;
                    view_type = 'detail';
                    contents = this.renderPanelContents('detail', panel_layout, grid[i].panels[j]);
                } else {
                    panel_layout = {
                        ...this._collapsed_layout,
                        top: (this._collapsed_layout.height + layout.margin * 2)
                            * counter++ + layout.margin + layout.top
                    };
                }

                // create panel and add to array
                const panel = <Panel key={'panel-' + index}
                    layout={panel_layout}
                    viewType={view_type}
                    name={grid[i].panels[j].name}
                    toggleDetail={() => this.setCurrentPanel(index)}>
                    {contents}
                </Panel>;

                panels.push(panel);
            }
        }

        return panels;
    }

    render() {
        const { roomConfig } = this.props;
        const { currentPanel } = this.state;

        if (!roomConfig)
            return <div />

        var content = null;

        if (currentPanel == -1)
            content = this.renderPresentationView();
        else
            content = this.renderDetailWithCollapsedView();

        var layout = JSON.parse(JSON.stringify(styles.container));
        layout = Object.assign(layout, roomConfig.layout || {});

        return (
            <div style={layout}>
                {content}
            </div>
        );
    }
}

RoomGrid.contextTypes = {
    store: PropTypes.object
};

const styles = {
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
    },
};

module.exports = { RoomGrid };
