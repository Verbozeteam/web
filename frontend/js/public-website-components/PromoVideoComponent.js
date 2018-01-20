/* @flow */

import * as React from 'react';
import { Player, ControlBar, BigPlayButton } from 'video-react';
import PropTypes from 'prop-types';
import {
    Button,
    Header,
} from 'semantic-ui-react';

type StateType = {
    width: number,
    height: number,
};

class PromoVideoComponent extends React.Component<any, StateType> {
    state = {
        width: 1,
        height: 1,
    };

    constructor(props) {
        super(props);
        this.state = { width: 0, height: 0 };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {
        return (
            <div style={styles.container}>
                <Player
                    ref={c => {this.player = c;}}
                    fluid={false}
                    height={this.state.height-75}
                    width={this.state.width}>
                    <source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
                    <BigPlayButton position="center" />
                </Player>
            </div>
        );
    }
};

const styles = {
    container: {
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100vh - 75px)',
    }
};


module.exports = { PromoVideoComponent };
