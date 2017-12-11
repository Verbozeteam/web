/* @flow */

import * as React from 'react';

import { PanelHeader } from './PanelHeader';

type PropsType = {
    name?: Object,
    viewType?: string,
    layout?: Object,
    toggleDetail?: () => any,
};

class Panel extends React.Component<PropsType> {

    static defaultProps = {
        name: {en: ""},
        viewType: 'present',
        layout: {},
        toggleDetail: null,
    };

    render() {
        const { viewType, name, toggleDetail } = this.props;
        var { layout } = this.props;
        layout = Object.assign(layout || {}, viewType === 'collapsed' ? styles.container_collapsed : styles.container);

        return (
            <div style={layout}>
                <PanelHeader name={name.en}
                    close={viewType === 'detail' ?
                    () => toggleDetail() : undefined}/>
                {this.props.children}
            </div>
        );
    }
}

const styles = {
    container: {
        display: 'flex',
        flex: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#000000',
    },
    container_collapsed: {
        display: 'flex',
        flex: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#000000',
        alignItems: 'center',
        justifyContent: 'center',
    }
};

module.exports = { Panel };
