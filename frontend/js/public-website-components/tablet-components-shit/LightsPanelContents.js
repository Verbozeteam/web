/* @flow */

import * as React from 'react';

// const { LightDimmer } = require('./LightDimmer');
import { LightSwitch } from './LightSwitch';
// const { PresetsSwitch } = require('./PresetsSwitch');

type PropsType = {
    things: Array<Object>,
    layout: Object,
    viewType: string,
    presets?: Array<Object>,
};

class LightsPanelContents extends React.Component<PropsType>  {
    renderDimmer(dimmer: GenericThingType) {
        const { viewType, layout } = this.props;

        var dimmer_name = '';
        var slider_width = layout.width - 20;
        var slider_height = 60;
        if (viewType == 'detail') {
            dimmer_name = dimmer.name.en;
            slider_height = 90;
            slider_width *= (3/4);
        } else if (layout.height <= 300) {
            slider_width *= 0.5;
        }

        return <div
            key={dimmer.id+'-container'}
            style={dimmer_styles.container}>
            <LightDimmer
                key={dimmer.id}
                id={dimmer.id}
                layout={{width: slider_width, height: slider_height, top: 0, left: 0}}/>
            <div key={dimmer.id+'-name'}
                style={dimmer_styles.name_container}>
                <div style={dimmer_styles.name}>
                    {dimmer_name}
                </div>
            </div>
        </div>;
    }

    renderLightSwitch(light_switch: GenericThingType) {
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
                    style={Object.assign(viewType === 'detail' ? {height: 100} : {}, switch_styles.name)}>
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
                    presets={presets}
                    viewType={viewType} />
                <div key={key+'-name'}
                    style={Object.assign(viewType === 'detail' ? {height: 100} : {}, switch_styles.name)}>
                    {"Presets"}
                </div>
            </div>
        </div>;
    }

    render() {
        const { things, layout, presets, viewType } = this.props;

        var dimmers = [];
        var switches = [];
        for (var i = 0; i < things.length; i++) {
            if (things[i].category === 'dimmers')
                {}//dimmers.push(this.renderDimmer(things[i]));
            else
               switches.push(this.renderLightSwitch(things[i]));
        }

        // if (viewType ==='detail' && presets && typeof(presets) == "object" && presets.length > 0 ) {
        //     switches.push(this.renderPresetsSwitch(presets));
        // }

        return (
            <div style={layout.height > 300 ? styles.container : styles.container_sm}>
                {dimmers}
                <div style={layout.height > 300 ? styles.switches_container : styles.switches_container_sm}>
                    {switches}
                </div>
            </div>
        );
    }
}

const styles = {
    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
    },
    container_sm: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
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
        fontSize: 20,
        fontFamily: 'HKNova-MediumR',
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
    },
    name: {
        display: 'flex',
        fontSize: 20,
        fontFamily: 'HKNova-MediumR',
        color: '#FFFFFF',
        textAlign: 'center',
    }
};

module.exports = { LightsPanelContents };
