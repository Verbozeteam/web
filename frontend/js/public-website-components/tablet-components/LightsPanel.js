/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { LightDimmer } from './LightDimmer';
import { LightSwitch } from './LightSwitch';
import { PresetsSwitch } from './PresetsSwitch';

import * as ConnectionTypes from '../../js-api-utils/ConnectionTypes';

type PropsType = {
    layout: {
        width: number,
        height: number,
        left: number,
        top: number,
    },
    viewType: 'collapsed' | 'detail' | 'presentation',
    things: Array<ConnectionTypes.GenericThingType>,
    presets: Array<Object>,
};

type StateType = {
    firstRender: boolean
};

class LightsPanel extends React.Component<PropsType, StateType> {
    state = {
        firstRender: true,
    };

    renderDimmer(dimmer: ConnectionTypes.GenericThingType) {
        const { firstRender } = this.state;
        const { viewType, layout } = this.props;

        var dimmer_name = '';
        var slider_width = layout.width - 20;
        var slider_height = 30;
        if (viewType == 'detail') {
            dimmer_name = dimmer.name.en;
            slider_height = 40;
        } else if (layout.height <= 100) {
            slider_width *= 0.5;
        }

        if (firstRender) {
            slider_width = 0;
            slider_height = 0;
        }

        return <div
            key={dimmer.id+'-container'}
            style={dimmer_styles.container}>
            <LightDimmer
                key={dimmer.id}
                id={dimmer.id}
                name={dimmer_name}
                layout={{width: slider_width, height: slider_height, top: 0, left: 0}}/>
        </div>;
    }

    renderLightSwitch(light_switch: ConnectionTypes.GenericThingType) {
        const { viewType, layout } = this.props;

        var switch_name = '';

        if (viewType == 'detail') {
            switch_name = light_switch.name.en;
        }

        return <div key={light_switch.id+'-container'}
            style={switch_styles.container}>
            <div key={light_switch.id+'-container-container'}
                style={switch_styles.container_container}>
                <LightSwitch
                    key={light_switch.id}
                    id={light_switch.id}
                    layout={{}}
                    viewType={viewType} />
                <div key={light_switch.id+'-name'}
                    style={switch_styles.name}>
                    {switch_name}
                </div>
            </div>
        </div>;
    }

    renderPresetsSwitch(presets: Array<Object>) {
        const { viewType, layout } = this.props;
        var key = 'presets-'+Object.keys(presets[0]).sort()[0];

        return <div key={key}
            style={switch_styles.container}>
            <div key={key+'-container-container'}
                style={switch_styles.container_container}>
                <PresetsSwitch
                    key={key+'-switch'}
                    presets={presets} />
                <div key={key+'-name'}
                    style={switch_styles.name}>
                    {"Presets"}
                </div>
            </div>
        </div>;
    }

    firstFrameRendered() {
        setTimeout((() => {
            this.setState({
                firstRender: false,
            });
        }).bind(this), 0);
    }

    render() {
        const { firstRender } = this.state;
        const { things, layout, presets, viewType } = this.props;

        var dimmers = [];
        var switches = [];
        for (var i = 0; i < things.length; i++) {
            if (things[i].category === 'dimmers')
                dimmers.push(this.renderDimmer(things[i]));
            else
               switches.push(this.renderLightSwitch(things[i]));
        }

        if (viewType ==='detail' && presets && typeof(presets) == "object" && presets.length > 0 ) {
            switches.push(this.renderPresetsSwitch(presets));
        }

        if (firstRender)
            requestAnimationFrame(this.firstFrameRendered.bind(this));

        return (
            <div style={layout.height > 100 ? styles.container : styles.container_sm}>
                {dimmers}
                <div style={layout.height > 100 ? styles.switches_container : styles.switches_container_sm}>
                    {switches}
                </div>
            </div>
        );
    }
};
LightsPanel.contextTypes = {
    store: PropTypes.object
};
const styles = {
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        height: '100%',
    },
    container_sm: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        height: '100%',
    },
    switches_container: {
        display: 'flex',
        flexDirection: 'row',
        flex: 2,
    },
    switches_container_sm: {
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
    },
};

const dimmer_styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        flex: 1,
    },
    name_container: {
        display: 'flex',
        marginLeft: 0,
        justifyContent: 'center',
        flex: 1,
    },
    name: {
        display: 'flex',
        marginLeft: 20,
        fontSize: 16,
        color: '#FFFFFF',
    },
};

const switch_styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
    },
    container_container: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,

        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
    },
};

export { LightsPanel };
