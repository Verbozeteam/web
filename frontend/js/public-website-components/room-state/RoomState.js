/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

import { connect as ReduxConnect } from 'react-redux';

function mapStateToProps(state) {
    return {
        roomState: state.connection.roomState,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

type PropsType = {
    roomState: Object,
};

type StateType = {
    /*
     * 0: render faded out
     * 1: render full display
     */
    currentStage: number,
};

class RoomState extends React.Component<PropsType, StateType> {
    state = {
        currentStage: 0,
    };

    _images = {
        background: require('../../../assets/images/empty_room.jpg'),
        baseAssets: require('../../../assets/images/base_assets.png'),
        dimmer1: require('../../../assets/images/dimmer_1.png'),
    };

    renderBase() {
        return <div key={"display-base"} style={{...styles.stackStyle, backgroundImage: 'url('+(this._images.baseAssets)+')'}} />
    }

    renderCurtain() {
        return null;
        // return (
        //     <div key={"rendered-curtain"} style={styles.stackStyle}>
        //         <div style={{...styles.stackStyle, backgroundImage: 'url('+(this._images.curtainBase)+')'}} />
        //     </div>
        // )
    }

    renderLighting() {
        const { roomState } = this.props;

        return <div key={"display-lighting"}
            style={{
                ...styles.stackStyle,
                backgroundImage: 'url('+(this._images.dimmer1)+')',
                opacity: roomState["lightswitch-1"].intensity,
            }} />
    }

    animationFrame() {
        const { currentStage } = this.state;
        if (currentStage === 0) {
            this.setState({currentStage: 1});
        }
    };

    render() {
        const { currentStage } = this.state;
        const { roomState } = this.props;

        var containerStyle = {...styles.container};
        containerStyle.backgroundImage = 'url(' + this._images.background + ')';
        if (currentStage === 0) {
            containerStyle.opacity = 0;
            setTimeout(() => requestAnimationFrame(this.animationFrame.bind(this)), 100);
        }

        var stacks = [];

        stacks = stacks
            .concat(this.renderBase())
            .concat(this.renderCurtain())
            .concat(this.renderLighting());

        return (
            <div style={containerStyle}>
                {stacks}
            </div>
        );
    }
}
RoomState.contextTypes = {
    store: PropTypes.object
};

const styles = {
    container: {
        position: 'relative',
        width: '100%',
        height: 700,
        display: 'flex',
        flexDirection: 'row',
        color: 'red',

        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',

        transition: 'opacity 500ms',
        opacity: 1,
    },
    stackStyle: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',

        transition: 'opacity 300ms',
    }
};

module.exports = { RoomState: ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomState) };
