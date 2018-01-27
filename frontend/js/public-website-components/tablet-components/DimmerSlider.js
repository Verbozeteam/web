/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

const EventListenerMode = {capture: true};
var global_lsiteners = {};

function mousemoveListener (e) {
    e.stopPropagation ();
}

function mouseupListener (e) {
    document.removeEventListener ('mouseup',   global_lsiteners.up,   EventListenerMode);
    document.removeEventListener ('mousemove', global_lsiteners.move, EventListenerMode);
    e.stopPropagation ();
}

function captureMouseEvents (e, onmove, onup) {
    global_lsiteners.up = e => {mouseupListener(e); onup(e)};
    global_lsiteners.move = e => {mousemoveListener(e); onmove(e)};
    document.addEventListener ('mouseup',   global_lsiteners.up,   EventListenerMode);
    document.addEventListener ('mousemove', global_lsiteners.move, EventListenerMode);
    e.preventDefault ();
    e.stopPropagation ();
}

type PropsType = {
    width: number,
    height: number,
    value: number,
    maxValue: number,
    increment?: number,
    glowColor?: string,
    onChange?: number => null,
    disabled?: boolean,
    showKnob?: boolean,
};

type StateType = {
    hoverState: number, // -1 no hover, 0 hover on -, 1 hover on knob, 2 hover on +
    dragging: boolean,
    lastValue: number,
    currentValue: number,
};

class DimmerSlider extends React.Component<PropsType, StateType> {
    static defaultProps = {
        glowColor: '#ffffff',
        offColor: '#999999',
        opacity: 1,
        isOn: false,
        text: "",
        textColor: '#000000',
        onChange: (n: number) => null,
        extraStyle: {},
        increment: 1,
        disabled: false,
        showKnob: true,
    };

    state: StateType = {
        hoverState: -1,
        dragging: false,
        currentValue: 0,
        lastValue: 0,
    };

    _sizes = {
        barHeight: 0,
        buttonWidth: 0,
        sliderMargin: 0,
        sliderWidth: 0,
        valueWidth: 0,
        knobSize: 0,
    };
    _container_ref = null;

    getMouseCoordinatesFromEvent(e: Object) {
        var element = ReactDOM.findDOMNode(this._container_ref);
        var bounds = element.getBoundingClientRect();
        return {
            x: e.clientX - bounds.left,
            y: e.clientY - bounds.top,
        };
    }

    getCurrentValueFromXCoord(x: number) {
        const { maxValue } = this.props;
        return Math.max(0, Math.min(maxValue, maxValue*(x-this._sizes.buttonWidth-this._sizes.sliderMargin/2)/this._sizes.sliderWidth));
    }

    onMouseMove(e: Object) {
        const { onChange, disabled } = this.props;
        const { dragging, lastValue } = this.state;
        const { x, y } = this.getMouseCoordinatesFromEvent(e);
        var stateUpdate = {};

        if (disabled)
            return;

        if (!dragging) {
            if (x <= this._sizes.buttonWidth + this._sizes.sliderMargin/2)
                stateUpdate.hoverState = 0;
            else if (x <= this._sizes.buttonWidth + this._sizes.sliderWidth + this._sizes.sliderMargin)
                stateUpdate.hoverState = 1;
            else
                stateUpdate.hoverState = 2;
        } else {
            stateUpdate.currentValue = this.getCurrentValueFromXCoord(x);
            if (onChange && stateUpdate.currentValue !== lastValue) {
                onChange(stateUpdate.currentValue);
                stateUpdate.lastValue = stateUpdate.currentValue;
            }
        }

        if (Object.keys(stateUpdate).length > 0)
            this.setState(stateUpdate);
    }

    onMouseDown(e: Object) {
        const { disabled } = this.props;
        const { hoverState, currentValue } = this.state;
        const { x, y } = this.getMouseCoordinatesFromEvent(e);

        if (disabled)
            return;

        if (hoverState === 1) {
            captureMouseEvents(e, this.onMouseMove.bind(this), this.onMouseUp.bind(this));
            this.setState({
                dragging: true,
                lastValue: currentValue,
                currentValue: this.getCurrentValueFromXCoord(x),
            });
        }
    }

    onMouseUp(e: Object) {
        const { onChange, value, maxValue, increment, disabled } = this.props;
        const { dragging, currentValue, lastValue, hoverState } = this.state;

        if (disabled)
            return;

        if (dragging) {
            if (onChange && currentValue !== lastValue)
                onChange(currentValue);
        } else if (hoverState === 0 || hoverState === 2) {
            var newVal = parseInt(Math.max(0, Math.min(maxValue, value + increment * (hoverState-1))));
            if (onChange && lastValue !== newVal)
                onChange(newVal);
        }

        this.setState({
            dragging: false,
        });
    }

    onMouseLeave(e: Object) {
        if (!this.state.dragging) {
            this.setState({
                hoverState: -1,
            });
        }
    }

    render() {
        const { width, height, value, maxValue, glowColor, onChange, showKnob } = this.props;
        const { hoverState, dragging, currentValue } = this.state;

        var v = dragging ? currentValue : value;
        this._sizes.barHeight = Math.min(height, width / 5);
        this._sizes.buttonWidth = this._sizes.barHeight / 2;
        this._sizes.sliderMargin = this._sizes.barHeight;
        this._sizes.sliderWidth = width - this._sizes.barHeight - this._sizes.sliderMargin;
        this._sizes.valueWidth = (v/maxValue) * this._sizes.sliderWidth; // width of the highlighted bar
        this._sizes.knobSize = this._sizes.barHeight*0.75;
        var sliderGlow = this._sizes.valueWidth === 0 ? {} : {
            boxShadow: '0 0 16px 1px' + glowColor,
            backgroundColor: glowColor,
        };

        var signsStyle = {
            ...styles.signs,
            fontSize: this._sizes.barHeight*0.8,
            width: this._sizes.buttonWidth,
            lineHeight: this._sizes.barHeight+"px",
        };
        var minusStyle = {...signsStyle};
        var plusStyle = {...signsStyle};

        var knobStyle = {
            ...styles.knob,
            width: this._sizes.knobSize,
            height: this._sizes.knobSize,
            left: this._sizes.valueWidth-this._sizes.knobSize/2,
        };
        if (hoverState === 0)
            minusStyle.color = '#ffffff';
        else if (hoverState === 1)
            knobStyle.backgroundColor = '#ffffff';
        else if (hoverState === 2)
            plusStyle.color = '#ffffff';

        var knob = showKnob? <div style={knobStyle} /> : null;
        var plus = showKnob? <div style={plusStyle}>{"+"}</div> : null;
        var minus = showKnob? <div style={minusStyle}>{"-"}</div> : null;

        return (
            <div style={{...styles.container, width, height}}
                 onMouseMove={this.onMouseMove.bind(this)}
                 onMouseDown={this.onMouseDown.bind(this)}
                 onMouseUp={this.onMouseUp.bind(this)}
                 onMouseLeave={this.onMouseLeave.bind(this)}
                 ref={r => this._container_ref = r}>
                {minus}
                <div style={{...styles.sliderContainer, width: this._sizes.sliderWidth, height: this._sizes.barHeight, marginLeft: this._sizes.sliderMargin/2, marginRight: this._sizes.sliderMargin/2}}>
                    <div style={{...styles.sliderInnerContainer, width: this._sizes.valueWidth, ...sliderGlow}} />
                    <div style={{...styles.sliderInnerContainer, width: this._sizes.sliderWidth-this._sizes.valueWidth}} />
                    {knob}
                </div>
                {plus}
            </div>
        );
    }
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row',
    },
    signs: {
        fontWeight: 'lighter',
        color: '#aaaaaa',
        textAlign: 'center',
    },
    sliderContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
    },
    sliderInnerContainer: {
        height: 2,
        backgroundColor: '#999999',
        transition: 'width 300ms',
    },
    knob: {
        position: 'absolute',
        borderRadius: 10000,
        backgroundColor: '#999999',
        border: '2px solid #ffffff',
    },
};

export { DimmerSlider };
