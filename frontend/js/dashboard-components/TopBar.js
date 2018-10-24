
/* @flow */

import * as React from 'react';
import * as Styles from '../constants/Styles';

type PropsType = {};
type StateType = {};

export default class TopBar extends React.Component<PropsType, StateType> {
    _verboze_logo_white = require('../../assets/dashboard_images/verboze_logo_light.png');
    _arrow_down = require('../../assets/dashboard_images/arrow_down.png');

    render() {
        return (
            <div style={ styles.topBarContainer }>
                <div className={'container-fluid'} style={ styles.fluidContainerDiv }>
                    <div className={'row'} style={ styles.rowContainer }>
                        <div className={'col'}>
                            <img className={'float-left'} src={ this._verboze_logo_white } />
                        </div>
                        <div className={'col'}>
                            <img className={'float-right'} src={ this._arrow_down } style={ styles.downArrow } />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    topBarContainer: {
        height: 60,
        backgroundColor: Styles.Colors.blackish,
    },
    downArrow: {
        width: 25,
        height: 25,
    },
    fluidContainerDiv: {
        height: '100%'
    },
    rowContainer: {
        height: '100%',
        alignItems: 'center'
    }
};
