/* @flow */

import * as React from 'react';
import * as THREE from 'three'
import PropTypes from 'prop-types';

import ReactResizeDetector from 'react-resize-detector';

import { connect as ReduxConnect } from 'react-redux';

const connectionActions = require('../redux/actions/connection');
import * as tabletActions from '../redux/actions/tabletstate';
import { WebSocketCommunication } from '../../api-utils/WebSocketCommunication';

function mapStateToProps(state) {
    return {
        roomState: state.connection.roomState,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setConnectionURL: u => dispatch(tabletActions.setCurrentConnectionURL(u)),
    };
}

type PropsType = {
    setConnectionURL: (string) => null,

    roomState: Object,
    opacity?: number,
};

type StateType = {
    /*
     * 0: render faded out
     * 1: render full display
     */
    currentStage: number,
    curtainOpenings: {[string]: number}
};

class RoomState extends React.Component<PropsType, StateType> {

    static defaultProps = {
        opacity: 1.0,
    };

    state = {
        currentStage: 0,
        curtainOpenings: {
            ['curtain-1']: 25,
            ['curtain-2']: 15,
        },
        lightIntensities: {
            ['lightswitch-1']: 0,
            ['lightswitch-2']: 0,
            ['lightswitch-3']: 0,
            ['dimmer-1']: 0,
        },
    };

    vertexShader: string = `
        varying vec2 vUv;
        uniform vec3 scale;
        uniform vec3 offset;

        void main() {
            vUv = uv;
            vec4 modelViewPosition = modelViewMatrix * vec4(position * scale + offset, 1.0);
            gl_Position = projectionMatrix * modelViewPosition;
        }`;

    pixelShader: string = `
        varying vec2 vUv;
        uniform float opacity;
        uniform float brightness;
        uniform sampler2D textureSampler;

        void main() {
            gl_FragColor = texture2D(textureSampler, vUv) * vec4(brightness, brightness, brightness, opacity);
        }`;

    flatPixelShader: string = `
        uniform vec4 color;

        void main() {
            gl_FragColor = color;
        }`;

    _imageDimensions: {width: number, height: number}
    = {
        width: 2048,
        height: 2048,
    };

    _images: {
        [string]: {
            image: string,
            z: number,
            texture?: Object,
            material?: Object,
            sprite?: Object,
            blending?: Object,
        }
    } = {
        background: {
            image: require('../../../assets/images/room_state/empty_room.png'),
            z: 5,
        },
        window: {
            image: require('../../../assets/images/room_state/window.png'),
            z: 2,
        },
        curtainLight: {
            image: require('../../../assets/images/room_state/curtain_light.png'),
            z: 8,
            //blending: THREE.AdditiveBlending,
        },
        doha: {
            image: require('../../../assets/images/room_state/doha.jpg'),
            z: 1,
        },
        ['dimmer-1']: {
            image: require('../../../assets/images/room_state/dimmer-1.png'),
            z: 6,
            //blending: THREE.AdditiveBlending,
        },
        ['lightswitch-1']: {
            image: require('../../../assets/images/room_state/lightswitch-1.png'),
            z: 7,
            //blending: THREE.AdditiveBlending,
        },
        ['lightswitch-2']: {
            image: require('../../../assets/images/room_state/lightswitch-2.png'),
            z: 7,
            //blending: THREE.AdditiveBlending,
        },
        ['lightswitch-3']: {
            image: require('../../../assets/images/room_state/lightswitch-3.png'),
            z: 7,
            //blending: THREE.AdditiveBlending,
        },
        ['curtain-1-1']: {
            image: require('../../../assets/images/room_state/curtain_left.png'),
            z: 4,
        },
        ['curtain-1-2']: {
            image: require('../../../assets/images/room_state/curtain_right.png'),
            z: 4,
        },
        ['curtain-2']: {
            image: require('../../../assets/images/room_state/shade.png'),
            z: 3,
        },
    };

    mount: Object;
    cameraOrtho: Object;
    sceneOrtho: Object;
    renderer: Object;
    tempOverlayMaterial: Object = undefined;
    animationTimeout: any = undefined;

    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.cameraOrtho = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, 1, 10 );
        this.cameraOrtho.position.z = 10;
        this.sceneOrtho = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.renderer.setClearColor('#000000');
        this.renderer.setSize(width, height);

        this.mount.appendChild(this.renderer.domElement);

        this.loadAssets();
        this.renderLayers();
    }

    componentWillUnmount() {
        if (this.renderer) {
            this.mount.removeChild(this.renderer.domElement);
            this.renderer = undefined;
        }
    }

    loadTemperatureOverlay() {
        this.tempOverlayMaterial = new THREE.ShaderMaterial({
            uniforms: {
                scale: {value: new THREE.Vector3(1, 1, 1)},
                offset: {value: new THREE.Vector3(0, 0, 0)},
                color: {value: new THREE.Vector4(1, 0, 0, 0)},
            },
            vertexShader: this.vertexShader,
            fragmentShader: this.flatPixelShader,
            blending: THREE.AdditiveBlending,
            transparent: true,
        });
        var sprite = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 0, 0), this.tempOverlayMaterial);
        sprite.renderOrder = 100;
        this.sceneOrtho.add(sprite);
    }

    loadAssets() {
        var textureLoader = new THREE.TextureLoader();
        var promises = [];
        for (var key in this._images) {
            const k = key;
            promises.push(new Promise((success, fail) => textureLoader.load(this._images[k].image, (t) => success({...this._images[k], key: k, texture: t}), fail)));
        }

        Promise.all(promises).then((textures => {
            for (var i = 0; i < textures.length; i++) {
                var img = textures[i].key;
                this._images[img].texture = textures[i].texture;
                this._images[img].material = new THREE.ShaderMaterial({
                    uniforms: {
                        scale: {value: new THREE.Vector3(1, 1, 1)},
                        offset: {value: new THREE.Vector3(0, 0, 0)},
                        opacity: {value: 1},
                        brightness: {value: 1},
                        textureSampler: {type: 't', value: this._images[img].texture},
                    },
                    vertexShader: this.vertexShader,
                    fragmentShader: this.pixelShader,
                    blending: textures[i].blending || THREE.NormalBlending,
                    transparent: true,
                });
                this._images[img].sprite = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 0, 0), this._images[img].material);
                this._images[img].sprite.position.set(0, 0, 1); // center
                this._images[img].sprite.renderOrder = textures[i].z;
                this.sceneOrtho.add(this._images[img].sprite);
            }
            this.loadTemperatureOverlay();
            this.forceUpdate();
        }).bind(this)).catch(((reason) => {
            console.log(reason);
            this.props.setConnectionURL("");
            WebSocketCommunication.disconnect();
        }).bind(this));
    }

    computeCurtainsLight() {
        if (Object.keys(this.state.curtainOpenings).length === 0)
            return 0;

        return (this.state.curtainOpenings['curtain-1']/100) *
            Math.max((this.state.curtainOpenings['curtain-2']/100), 0.2);
    }

    computeLightBrightness() {
        var brightness = 0;
        var num_lights = 0;
        for (var key in this.state.lightIntensities) {
            brightness += this.state.lightIntensities[key] / 100;
            num_lights += 1;
        }
        return Math.min(Math.max((brightness / num_lights + this.computeCurtainsLight()), 0), 1);
    }

    updateThingSprites() {
        const { roomState } = this.props;
        const { curtainOpenings, lightIntensities } = this.state;

        var curtainBrightness = 0.3 + this.computeLightBrightness() * 0.7;
        var windowBrightness = this.computeCurtainsLight();

        if ("curtainLight" in this._images && this._images.curtainLight.material)
            this._images.curtainLight.material.uniforms.opacity.value = windowBrightness * 0.6;

        if ("window" in this._images && this._images.window.material)
            this._images.window.material.uniforms.brightness.value = curtainBrightness * 0.8;

        var needAnimation: boolean = false;
        for (var key in roomState) {
            var thing = roomState[key];
            switch (thing.category) {
                case "light_switches":
                case "dimmers":
                    if (key in this._images && this._images[key].material) {
                        var curIntensity = lightIntensities[key];
                        this._images[key].material.uniforms.opacity.value = curIntensity / 100;
                        if (curIntensity !== thing.intensity)
                            needAnimation = true;
                    }
                    break;
                case "curtains":
                    if (key+"-1" in this._images && key+"-2" in this._images &&
                        this._images[key+"-1"].material && this._images[key+"-2"].material) {
                        var opening = curtainOpenings[thing.id] || 0;
                        this._images[key+"-1"].material.uniforms.offset.value.set(-2-opening*1.8, 0, 1);
                        this._images[key+"-1"].material.uniforms.scale.value.x *= 1 - (opening/200);
                        this._images[key+"-1"].material.uniforms.brightness.value = curtainBrightness;
                        this._images[key+"-2"].material.uniforms.offset.value.set(+2+opening*1.8, 0, 1);
                        this._images[key+"-2"].material.uniforms.scale.value.x *= 1 - (opening/200);
                        this._images[key+"-2"].material.uniforms.brightness.value = curtainBrightness;
                        if (thing.curtain != 0)
                            needAnimation = true;
                    } else if (key in this._images && this._images[key].material) {
                        var opening = curtainOpenings[thing.id] || 0;
                        this._images[key].material.uniforms.offset.value.set(0, 5+opening*2.2, 1);
                        this._images[key].material.uniforms.scale.value.y *= 1 - (opening/200);
                        this._images[key].material.uniforms.brightness.value = curtainBrightness;
                        if (thing.curtain != 0)
                            needAnimation = true;
                    }
                    break;
                case "central_acs":
                    var tempDiff = thing.set_pt - thing.temp;
                    var a = 0, r = 0, g = 0, b = 0;
                    if (Math.abs(tempDiff) > 0.01) {
                        needAnimation = true;
                        a =  Math.min(Math.max(Math.abs(tempDiff) / 30, 0), 0.1);
                        if (tempDiff > 0)
                            r = 1;
                        else
                            b = 1;
                    }
                    if (this.tempOverlayMaterial)
                        this.tempOverlayMaterial.uniforms.color.value.set(r, g, b, a);
                    break;
            }
        }

        if (needAnimation && !this.animationTimeout) {
            this.animationTimeout = setTimeout(() => this.stepAnimation(), 50);
        }
    }

    renderLayers() {
        if (this.renderer) {
            const width = this.mount.clientWidth;
            const height = this.mount.clientHeight;

            this.renderer.setSize(width, height);
            this.cameraOrtho.left = -width / 2;
            this.cameraOrtho.right = width / 2;
            this.cameraOrtho.top = height / 2;
            this.cameraOrtho.bottom = -height / 2;
            this.cameraOrtho.updateProjectionMatrix();

            var scaler = Math.min(width / 1920,
                                  height / 1080);
            var imgWidth = this._imageDimensions.width * scaler;
            var imgHeight = this._imageDimensions.height * scaler;

            for (var key in this._images) {
                if (this._images[key].material) {
                    this._images[key].material.uniforms.offset.value.set(0, 0, 1);
                    this._images[key].material.uniforms.scale.value.set(imgWidth, imgHeight, 1);
                    // this._images[key].sprite.scale.set(imgWidth, imgHeight, 1);
                    // this._images[key].sprite.position.set(0, 0, 1); // center
                }
            }
            if (this.tempOverlayMaterial) {
                this.tempOverlayMaterial.uniforms.offset.value.set(0, 0, 2);
                this.tempOverlayMaterial.uniforms.scale.value.set(imgWidth, imgHeight, 1);
            }

            this.updateThingSprites();

            this.renderer.render(this.sceneOrtho, this.cameraOrtho);
        }
    }

    stepAnimation() {
        const { roomState } = this.props;

        this.animationTimeout = undefined;

        var totalUpdate = {};

        for (var key in roomState) {
            var thing = roomState[key];
            switch (thing.category) {
                case "light_switches":
                case "dimmers":
                    var thingIntensity = thing.category === "dimmers" ? thing.intensity : thing.intensity * 100;
                    var stepSpeed = thing.category === "dimmers" ? 10 : 25;
                    var curVal = this.state.lightIntensities[thing.id] || 0;
                    if (thingIntensity !== curVal) {
                        var diff = thingIntensity - curVal;
                        var absdiff = Math.abs(thingIntensity - curVal);
                        var step = (diff / absdiff) * Math.min(stepSpeed, absdiff);
                        var newVal = Math.min(Math.max(curVal + step, 0), 100);
                        if (newVal != curVal) {
                            if (!totalUpdate.lightIntensities) totalUpdate.lightIntensities = this.state.lightIntensities;
                            totalUpdate.lightIntensities[thing.id] = newVal;
                        }
                    }
                    break;
                case "curtains":
                    var step = thing.curtain === 1 ? 1 : (thing.curtain === 2 ? -1 : 0);
                    var curVal = this.state.curtainOpenings[thing.id] || 0;
                    var newVal = Math.min(Math.max(curVal + step, 0), 100);
                    if (newVal != curVal) {
                        if (!totalUpdate.curtainOpenings) totalUpdate.curtainOpenings = this.state.curtainOpenings;
                        totalUpdate.curtainOpenings[thing.id] = newVal;
                    }
                    break;
                case "central_acs":
                    var step;
                    var tempDiff = thing.set_pt - thing.temp;
                    if (tempDiff > 1 || tempDiff < -1)
                        step = tempDiff * 0.02;
                    else if (tempDiff > 0)
                        step = 0.01;
                    else
                        step = -0.01;
                    var state_update = {
                        temp: Math.abs(tempDiff) < 0.05 ? thing.set_pt : thing.temp + step,
                    };
                    if (Math.abs(state_update.temp - thing.temp) > 0.1) {
                        WebSocketCommunication.sendMessage({
                            [thing.id]: {
                                ...thing,
                                ...state_update,
                            }
                        });
                    }
                    if (Math.abs(state_update.temp - thing.temp) > 0.001)
                        this.context.store.dispatch(connectionActions.setThingPartialState(thing.id, state_update));
                    break;
            }
        }

        if (Object.keys(totalUpdate).length > 0)
            this.setState(totalUpdate);
    }

    render() {
        var { opacity } = this.props;

        var curOpacity = opacity;
        if (!this.tempOverlayMaterial)
            curOpacity = 0;

        requestAnimationFrame(this.renderLayers.bind(this));
        return (
            <div
                style={{...styles.container, opacity: curOpacity}}
                ref={(mount: any) => { this.mount = mount }}>
                <ReactResizeDetector handleWidth handleHeight onResize={this.renderLayers.bind(this)} />
            </div>
        )
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

        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',

        transition: 'opacity 2000ms',
    },
};

module.exports = { RoomState: ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomState) };
