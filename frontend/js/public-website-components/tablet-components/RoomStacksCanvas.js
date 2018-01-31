/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';

type PropsType = {
    tabletWidth: number,
    tabletHeight: number,
    stackWidths: Array<number>,
    slopeX: number,
};

type StateType = {
};

class RoomStacksCanvas extends React.Component<PropsType, StateType> {
    canvas: ?Object = undefined;
    ctx: any = undefined;

    _images = [{
        fillStyle: "red",
    }, {
        src: require('../../../assets/images/lights_stack.jpg'),
        offsetX: 0,
        offsetY: 0,
        obj: undefined,
        fillStyle: "red",
    }, {
        src: require('../../../assets/images/curtains_stack.jpg'),
        offsetX: 0,
        offsetY: 0,
        obj: undefined,
        fillStyle: "red",
    }, {
        src: require('../../../assets/images/thermostat_stack.jpg'),
        offsetX: 0,
        offsetY: 0,
        obj: undefined,
        fillStyle: "red",
    }, {
        src: require('../../../assets/images/services_stack.jpg'),
        offsetX: 0,
        offsetY: 0,
        obj: undefined,
        fillStyle: "red",
    }, {
        fillStyle: "red",
    }];

    componentDidMount() {
        if (this.canvas && !this.ctx)
            this.ctx = this.canvas.getContext('2d');
        this.updateCanvas();
    }

    updateCanvas() {
        const { tabletWidth, tabletHeight, stackWidths, slopeX } = this.props;
        if (this.canvas) {
            var curOffset = 0;
            for (var i = 0; i < this._images.length; i++) {
                var stackWidth = stackWidths[i];

                this.ctx.save();
                if(i !== 0) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(curOffset + slopeX, 0);
                    this.ctx.lineTo(curOffset + stackWidth, 0);
                    this.ctx.lineTo(curOffset + stackWidth-slopeX, tabletHeight);
                    this.ctx.lineTo(curOffset, tabletHeight);
                    this.ctx.lineTo(curOffset + slopeX, 0);
                    this.ctx.closePath();
                    this.ctx.clip();
                }

                this.ctx.fillStyle = this._images[i].fillStyle;
                this.ctx.clearRect(curOffset, 0, curOffset + stackWidth, tabletHeight);
                if (this._images[i].obj) {
                    this.ctx.drawImage(this._images[i].obj,
                        tabletWidth / 2 - this._images[i].obj.width / 2 + this._images[i].offsetX,
                        tabletHeight / 2 - this._images[i].obj.height / 2 + this._images[i].offsetY,
                        this._images[i].obj.width,
                        this._images[i].obj.height);
                }
                this.ctx.restore();

                curOffset += stackWidth - slopeX;
            }
        }
    }

    render() {
        var { tabletWidth, tabletHeight } = this.props;

        this.updateCanvas();

        return (
            <div style={{...styles.container, minWidth: tabletWidth, height: tabletHeight}}>
                <canvas width={tabletWidth} height={tabletHeight} style={{width: tabletWidth, height: tabletHeight,  ...styles.canvas}} ref={c => this.canvas = c} />
                {this._images.map(((img, i) =>
                    img.src ?
                    <img key={"loading-image-"+img.src}
                      ref={c => this._images[i].obj = c}
                      src={img.src}
                      onLoad={this.updateCanvas.bind(this)}
                      style={{display: 'none'}} />
                        : <div key={"loading-image-"+i}></div>
                ).bind(this))}
            </div>
        );
    }
}

const styles = {
    container: {
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'hidden',
    },
    canvas: {
        position: 'absolute',
    }
};

export { RoomStacksCanvas };
