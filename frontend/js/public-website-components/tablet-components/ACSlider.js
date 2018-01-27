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
    enabled?: boolean,
    onChange?: number => null,
};

type StateType = {
    dragging: boolean,
    lastValue: number,
    currentValue: number,
};

class ACSlider extends React.Component<PropsType, StateType> {
    static defaultProps = {
        enabled: true,
        onChange: (n: number) => null,
    };

    state: StateType = {
        dragging: false,
        currentValue: 0,
        lastValue: 0,
    };

    _numDashes: number = 25;
    _minimum: number = 16;
    _maximum: number = 32;
    _hotColor: {r: number, g: number, b: number} = {r: 0xBA, g: 0x37, b: 0x37}; // #BA3737
    _coldColor: {r: number, g: number, b: number} = {r: 43, g: 159, b: 255};

    _container_ref = null;

    getMouseCoordinatesFromEvent(e: Object) {
        var element = ReactDOM.findDOMNode(this._container_ref);
        var bounds = element.getBoundingClientRect();
        return {
            x: e.clientX - bounds.left,
            y: e.clientY - bounds.top,
        };
    }

    getCurrentValueFromXCoord(x: number): number {
        return Math.max(this._minimum, Math.min(this._maximum, this._minimum + (this._maximum-this._minimum) * (x-5) / (this.props.width-10)));
    }

    round(x: number): number {
        return parseInt(x*2) / 2;
    }

    onMouseMove(e: Object) {
        const { onChange } = this.props;
        const { dragging, lastValue } = this.state;
        const { x, y } = this.getMouseCoordinatesFromEvent(e);
        var stateUpdate = {};

        if (dragging) {
            stateUpdate.currentValue = this.getCurrentValueFromXCoord(x);
            if (onChange && Math.abs(this.round(stateUpdate.currentValue)-lastValue) >= 0.4) {
                onChange(this.round(stateUpdate.currentValue));
                stateUpdate.lastValue = stateUpdate.currentValue;
            }
        }

        if (Object.keys(stateUpdate).length > 0)
            this.setState(stateUpdate);
    }

    onMouseDown(e: Object) {
        const { currentValue } = this.state;
        const { x, y } = this.getMouseCoordinatesFromEvent(e);

        if (this.props.enabled) {
            captureMouseEvents(e, this.onMouseMove.bind(this), this.onMouseUp.bind(this));
            this.setState({
                dragging: true,
                lastValue: currentValue,
                currentValue: this.getCurrentValueFromXCoord(x),
            });
        }
    }

    onMouseUp(e: Object) {
        const { onChange, value } = this.props;
        const { dragging, currentValue, lastValue } = this.state;

        if (dragging) {
            if (onChange && Math.abs(this.round(currentValue)-lastValue) >= 0.4)
                onChange(this.round(currentValue));
        }

        this.setState({
            dragging: false,
        });
    }

    render() {
        var { width, height, value, enabled } = this.props;
        const { currentValue, dragging } = this.state;

        if (dragging)
            value = currentValue;

        var margin = 10;
        var barWidth = width - margin;
        var curProgress = barWidth * (value-this._minimum) / (this._maximum-this._minimum);
        var knobY1 = height*(1/5);
        var knobY2 = height*(2/3);

        var lines = [];
        for (var i = 0; i < this._numDashes; i++) {
            var progress = i / (this._numDashes-1);
            var lerp = (v, c) => (this._coldColor[c]+(this._hotColor[c]-this._coldColor[c])*v).toFixed(0);
            var color = 'rgb(' + lerp(progress, 'r') + ',' + lerp(progress, 'g') + ',' + lerp(progress, 'b') + ')';
            if (!enabled)
                color = '#666666';
            var x = progress * (barWidth-2) + 1;
            lines.push(<line key={"svg-line-"+i} x1={x} y1={height*(1/3)} x2={x} y2={height} style={{stroke: color, strokeWidth: 2}} />);
        }

        return (
            <div style={{width, height}}
                 onMouseMove={this.onMouseMove.bind(this)}
                 onMouseDown={this.onMouseDown.bind(this)}
                 onMouseUp={this.onMouseUp.bind(this)}
                 ref={r => this._container_ref = r}>
                <div style={{position: 'relative', width, height: height*(2/3), marginBottom: -height*(1/3)}}>
                    <div style={{...styles.knob, left: curProgress - 5 + margin/2}}>
                        <svg width={10} height={height*(2/3)}>
                            <polygon points={"5,0 10,"+knobY1+" 5,"+knobY2+" 0,"+knobY1} style={{fill:'#ffffff', strokeWidth: 1}} />
                        </svg>
                    </div>
                </div>
                <svg width={barWidth} height={height*(2/3)} style={{marginLeft: margin/2}}>
                    {lines}
                </svg>
            </div>
        );
    }
};

const styles = {
    knob: {
        position: 'absolute',
        width: 10,
    }
};

export { ACSlider };
