/* @flow */

import * as React from 'react';

type PropsType = {
    name: string,
    viewType: string,
    close: () => any,
};

class PanelHeader extends React.Component<PropsType> {

    static defaultProps = {
        viewType: 'present'
    }

    render() {
        const { name, close, viewType } = this.props;

        var header_text = <div key={'panel-header-text'}
            style={viewType === 'collapsed' ?
            styles.name_large : styles.name}>
                {name}
            </div>;

        var close_button = null;
        if (close) {
            close_button = <div key={'panel-header-close-button'}
                hitSlop={{top: 50, bottom: 50, left: 50, right: 50}}
                onTouchStart={() => close()}>
                <img style={styles.close_button}
                  src={require('../../../assets/images/close.png')} />
            </div>;
        }

        var header_items = [];
        header_items.push(header_text);
        header_items.push(close_button);

        return (
            <div style={styles.container}>
                {header_items}
            </div>
        );
    }
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        marginBottom: 20,
    },
    name: {
        display: 'flex',
        flex: 1,
        fontFamily: 'HKNova-MediumR',
        fontSize: 20,
        color: '#FFFFFF'
    },
    name_large: {
        display: 'flex',
        flex: 1,
        fontFamily: 'HKNova-MediumR',
        fontSize: 32,
        color: '#FFFFFF'
    },
    close_button: {
        display: 'flex',
        height: 35,
        width: 35,
    }
};

module.exports = { PanelHeader };
