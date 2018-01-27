/* @flow */
import * as React from 'react';
import * as THREE from 'three';
import EffectComposer, { RenderPass, ShaderPass, CopyShader } from 'three-effectcomposer-es6';
import { TexturePass } from './TexturePass';
import * as Shaders from './Shaders';
import PropTypes from 'prop-types';

import ReactResizeDetector from 'react-resize-detector';

import { connect as ReduxConnect } from 'react-redux';

import { RoomStateUpdater } from '../utilities/RoomStateUpdater';
const connectionActions = require('../redux/actions/connection');
import * as tabletActions from '../redux/actions/tabletstate';
const { WebSocketCommunication } = require('../../js-api-utils/WebSocketCommunication');
import { DimmerSlider } from '../tablet-components/DimmerSlider';

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
    dimensions: {width: number, height: number},
    opacity?: number,
    navbarHeight?: number,
};

type StateType = {
    /*
     * 0: render faded out
     * 1: render full display
     */
    curtainOpenings: {[string]: number},
    lightIntensities: {[string]: number},
    loadingProgress: number, // 0-1, 1 is done
    loadedDemo: boolean,
};

class RoomState extends React.Component<PropsType, StateType> {

    static defaultProps = {
        opacity: 1.0,
        navbarHeight: 0,
    };

    state = {
        loadedDemo: false,
        loadingProgress: 0,
        curtainOpenings: {
            ['curtain-1']: 0,
            ['curtain-2']: 0,
        },
        lightIntensities: {
            ['lightswitch-1']: 0,
            ['lightswitch-2']: 0,
            ['lightswitch-3']: 0,
            ['dimmer-1']: 0,
        },
    };

    _accentColor: string = "#BA3737";

    _rendererDimensions = {width: 0, height: 0};

    _imageDimensions: {width: number, height: number}
    = {
        width: 2048,
        height: 2048,
    };
    _imageInnerDimensions: {width: number, height: number}
    = {
        width: 1920,
        height: 1080,
    };

    _images: {
        [string]: {
            image: string,
            z: number,
            texture?: Object,
            material?: Object,
            sprite?: Object,
            blending?: Object,
            isHelper?: boolean,
            isCurtain?: boolean,
        }
    } = {
        base: {
            image: require('../../../assets/images/room_state/1_alpha.png'),
            z: 5,
        },
        curtainLight: {
            image: require('../../../assets/images/room_state/3_alpha.png'),
            z: 8,
            blending: THREE.AdditiveBlending,
        },
        background: {
            image: require('../../../assets/images/room_state/2_alpha.png'),
            z: 1,
        },
        ['dimmer-1']: {
            image: require('../../../assets/images/room_state/5_alpha.png'),
            z: 6,
            blending: THREE.AdditiveBlending,
        },
        ['lightswitch-1']: {
            image: require('../../../assets/images/room_state/4_alpha.png'),
            z: 7,
            blending: THREE.AdditiveBlending,
        },
        ['lightswitch-2']: {
            image: require('../../../assets/images/room_state/6_alpha.png'),
            z: 7,
            blending: THREE.AdditiveBlending,
        },
        ['lightswitch-3']: {
            image: require('../../../assets/images/room_state/7_alpha.png'),
            z: 7,
            blending: THREE.AdditiveBlending,
        },
        ['curtain-1-1']: {
            image: require('../../../assets/images/room_state/curtain_left.png'),
            z: 5,
            isCurtain: true,
        },
        ['curtain-1-2']: {
            image: require('../../../assets/images/room_state/curtain_right.png'),
            z: 5,
            isCurtain: true,
        },
        ['curtain-2']: {
            image: require('../../../assets/images/room_state/curtain_middle.png'),
            z: 0,
            isCurtain: true,
        },
        curtainMask: {
            image: require('../../../assets/images/room_state/curtain_mask.jpg'),
            isHelper: true,
        }
    };

    mount: Object;
    cameraOrtho: Object;
    curtainCam: Object;
    compositionCam: Object;
    sceneOrtho: Object;
    curtainScene: Object;
    compositionScene: Object;
    renderer: Object;
    composer: Object;
    animationTimeout: ?any;

    _materials: {[string]: Object} = {
        tempOverlay: undefined,
        foregroundRender: undefined,
        backgroundRender: undefined,
    };

    _geometries: {[string]: Object} = {
        paddedPlane: undefined,
    };

    _textures: {[string]: Object} = {
        renderBuffer: undefined,
    };

    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        this.cameraOrtho = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, - height / 2, 1, 10);
        this.cameraOrtho.position.z = 10;
        this.compositionCam = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, - height / 2, 1, 10);
        this.compositionCam.position.z = 10;
        this.curtainCam = new THREE.PerspectiveCamera(73.74,
                                                      this._imageInnerDimensions.width / this._imageInnerDimensions.height,
                                                      1, 15);
        this.sceneOrtho = new THREE.Scene();
        this.curtainScene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha:true, logarithmicDepthBuffer: true});
        this.renderer.setClearColor(0x1b1c1d, 0.0);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(width, height);
        this.renderer.autoClear = false;
        this._rendererDimensions = {width, height};

        this._textures.renderBuffer = new THREE.WebGLRenderTarget(
            width,
            height,
            {
                minFilter: THREE.LinearFilter,
                magFilter: THREE.NearestFilter
            }
        );

        this.mount.appendChild(this.renderer.domElement);

        this.loadGeometries();
        this.prepareComposer();
        this.createFinalComposition();
        this.loadAssets();
    }

    componentWillUnmount() {
        if (this.renderer) {
            this.mount.removeChild(this.renderer.domElement);
            this.renderer = undefined;
        }
    }

    runInitialAnimation() {
        const store = this.context.store;

        this.setState({loadedDemo: true});

        RoomStateUpdater.resetDemo();
        RoomStateUpdater.updateMany(store, {
            'lightswitch-1': {intensity: 0},
            'lightswitch-2': {intensity: 0},
            'lightswitch-3': {intensity: 0},
            'dimmer-1': {intensity: 0},
        }, true);

        setTimeout(() => {
            RoomStateUpdater.update(store, 'lightswitch-1', {intensity: 1}, true);
            setTimeout(() => {
                RoomStateUpdater.update(store, 'dimmer-1', {intensity: 100}, true);
                setTimeout(() => {
                    RoomStateUpdater.update(store, 'lightswitch-2', {intensity: 1}, true);
                    setTimeout(() => {
                        RoomStateUpdater.update(store, 'lightswitch-3', {intensity: 1}, true);
                    }, 1500);
                }, 1500);
            }, 1500);
        }, 2000);
    }

    loadGeometries() {
        this._geometries.paddedPlane = new THREE.Geometry();
        var heightOverWidth = this._imageInnerDimensions.height / this._imageInnerDimensions.width;
        this._geometries.paddedPlane.vertices.push(
            new THREE.Vector3(-0.5,  0.5 * heightOverWidth, 0),
            new THREE.Vector3(-0.5, -0.5 * heightOverWidth, 0),
            new THREE.Vector3( 0.5, -0.5 * heightOverWidth, 0),

            new THREE.Vector3(-0.5,  0.5 * heightOverWidth, 0),
            new THREE.Vector3( 0.5,  0.5 * heightOverWidth, 0),
            new THREE.Vector3( 0.5, -0.5 * heightOverWidth, 0),
        );

        var xOffset = ((this._imageDimensions.width-this._imageInnerDimensions.width)/2)/this._imageDimensions.width;
        var yOffset = ((this._imageDimensions.height-this._imageInnerDimensions.height)/2)/this._imageDimensions.height;

        this._geometries.paddedPlane.faceVertexUvs[0].push([
            new THREE.Vector2(xOffset, 1-yOffset),
            new THREE.Vector2(xOffset, yOffset),
            new THREE.Vector2(1-xOffset, yOffset),
        ]);
        this._geometries.paddedPlane.faceVertexUvs[0].push([
            new THREE.Vector2(1-xOffset, yOffset),
            new THREE.Vector2(1-xOffset, 1-yOffset),
            new THREE.Vector2(xOffset, 1-yOffset),
        ]);

        this._geometries.paddedPlane.faces.push(
            new THREE.Face3(0, 1, 2),
            new THREE.Face3(5, 4, 3),
        );

        this._geometries.paddedPlane.computeBoundingSphere();
    }

    prepareComposer() {
        this.composer = new EffectComposer(this.renderer);
        this.composer.renderTarget2.texture.format = this.composer.renderTarget1.texture.format = THREE.RGBAFormat;

        var blur1Passes = this.createBlurShaderPasses(600, 600);
        var blur2Passes = this.createBlurShaderPasses(300, 300);

        this.composer.addPass(new TexturePass(this._textures.renderBuffer.texture, 1));
        this.composer.addPass(blur1Passes.horizontalPass);
        this.composer.addPass(blur1Passes.verticalPass);
        this.composer.addPass(blur2Passes.horizontalPass);
        this.composer.addPass(blur2Passes.verticalPass);
    }

    createBlurShaderPasses(h: number, v: number) {
        var HBlurShader = {
            uniforms: {
                tDiffuse: { type: "t", value: null },
                h: { type: "f", value: 1.0 / h }
            },
            vertexShader: Shaders.basicVertexShader,
            fragmentShader: Shaders.hBlur,
        };

        var VBlurShader = {
            uniforms: {
                tDiffuse: { type: "t", value: null },
                v: { type: "f", value: 1.0 / v }
            },
            vertexShader: Shaders.basicVertexShader,
            fragmentShader: Shaders.vBlur,
        };

        var HBlur = new ShaderPass(HBlurShader);
        var VBlur = new ShaderPass(VBlurShader);

        return { horizontalPass: HBlur, verticalPass: VBlur };
    }

    createFinalComposition() {
        this.compositionScene = new THREE.Scene();
        this._materials.backgroundRender = new THREE.ShaderMaterial({
            uniforms: {
                scale: {value: new THREE.Vector3(1, 1, 1)},
                offset: {value: new THREE.Vector3(0, 0, 0)},
                opacity: {value: 1},
                brightness: {value: 1.0},
                grayscale: {value: 0},
                textureSampler: {type: 't', value: this.composer.renderTarget1.texture},
            },
            vertexShader: Shaders.posAndUVVertexShader,
            fragmentShader: Shaders.pixelShader,
            transparent: true,
        });
        this._materials.foregroundRender = new THREE.ShaderMaterial({
            uniforms: {
                scale: {value: new THREE.Vector3(1, 1, 1)},
                offset: {value: new THREE.Vector3(0, 0, 0)},
                opacity: {value: 1},
                brightness: {value: 1.0},
                grayscale: {value: 0},
                textureSampler: {type: 't', value: this._textures.renderBuffer.texture},
            },
            vertexShader: Shaders.posAndUVVertexShader,
            fragmentShader: Shaders.pixelShader,
            transparent: true,
        });
        var sprite = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 0, 0), this._materials.backgroundRender);
        sprite.renderOrder = 101;
        this.compositionScene.add(sprite);
        var sprite = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 0, 0), this._materials.foregroundRender);
        sprite.renderOrder = 102;
        this.compositionScene.add(sprite);
    }

    loadTemperatureOverlay() {
        this._materials.tempOverlay = new THREE.ShaderMaterial({
            uniforms: {
                scale: {value: new THREE.Vector3(1, 1, 1)},
                offset: {value: new THREE.Vector3(0, 0, 0)},
                color: {value: new THREE.Vector4(1, 0, 0, 0)},
            },
            vertexShader: Shaders.onlyPosVertexShader,
            fragmentShader: Shaders.flatPixelShader,
            blending: THREE.AdditiveBlending,
            transparent: true,
        });
        var sprite = new THREE.Mesh(this._geometries.paddedPlane, this._materials.tempOverlay);
        sprite.renderOrder = 100;
        this.sceneOrtho.add(sprite);
    }

    loadAssets() {
        var textureLoader = new THREE.TextureLoader();
        var promises = [];
        var curProgress = 0;
        var progress = (() => {
            curProgress += 1;
            this.setState({loadingProgress: curProgress / (Object.keys(this._images).length+1)});
        }).bind(this);

        for (var key in this._images) {
            const k = key;
            promises.push(new Promise((success, fail) => textureLoader.load(this._images[k].image, (t) => {progress(); success({...this._images[k], key: k, texture: t})}, fail)));
        }

        Promise.all(promises).then((textures => {
            for (var i = 0; i < textures.length; i++)
                this._images[textures[i].key].texture = textures[i].texture;

            for (var i = 0; i < textures.length; i++) {
                var img = textures[i].key;
                if (this._images[img].isHelper) continue; // skip
                if (!this._images[img].isCurtain) {
                    this._images[img].material = new THREE.ShaderMaterial({
                        uniforms: {
                            scale: {value: new THREE.Vector3(1, 1, 1)},
                            offset: {value: new THREE.Vector3(0, 0, 0)},
                            opacity: {value: 1},
                            brightness: {value: 1},
                            grayscale: {value: 0},
                            textureSampler: {type: 't', value: this._images[img].texture},
                        },
                        vertexShader: Shaders.posAndUVVertexShader,
                        fragmentShader: Shaders.pixelShader,
                        blending: textures[i].blending || THREE.NormalBlending,
                        transparent: true,
                    });
                    this._images[img].sprite = new THREE.Mesh(this._geometries.paddedPlane, this._images[img].material);
                    this._images[img].sprite.position.set(0, 0, 1); // center
                    this._images[img].sprite.renderOrder = textures[i].z;
                    this.sceneOrtho.add(this._images[img].sprite);
                } else {
                    this._images[img].material = new THREE.ShaderMaterial({
                        uniforms: {
                            lightIntensities: {value: new THREE.Vector4(0, 0, 0, 0)},
                            curtainOpening: {value: 0.0},
                            textureSampler: {type: 't', value: this._images[img].texture},
                            alphaSampler: {type: 't', value: this._images.curtainMask.texture},
                        },
                        vertexShader: Shaders.curtainVertexShader,
                        fragmentShader: Shaders.curtainPixelShader,
                        blending: textures[i].blending || THREE.NormalBlending,
                        transparent: true,
                        depthWrite: false,
                        depthTest: false,
                    });
                    this._images[img].sprite = new THREE.Mesh(this._geometries.paddedPlane, this._images[img].material);
                    this._images[img].sprite.renderOrder = textures[i].z;
                    this.curtainScene.add(this._images[img].sprite);
                }
            }
            this.loadTemperatureOverlay();
            progress();
            console.log("done loading...")
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
        return Math.min(Math.max((brightness / num_lights + this.computeCurtainsLight()/5), 0), 1);
    }

    updateThingSprites(imgWidth: number, imgHeight: number) {
        const { roomState } = this.props;
        const { curtainOpenings, lightIntensities } = this.state;

        var windowBrightness = this.computeCurtainsLight();
        var intensities = Object.keys(lightIntensities).sort().map(k => lightIntensities[k]/100);
        var lightIntensitiesVector = new THREE.Vector4(intensities[0], intensities[1], intensities[2], intensities[3]);

        if ("curtainLight" in this._images && this._images.curtainLight.material)
            this._images.curtainLight.material.uniforms.opacity.value = windowBrightness * 0.6;

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
                        var opening = (curtainOpenings[thing.id] || 0) / 100;
                        this._images[key+"-1"].sprite.position.x += opening*1.5;
                        this._images[key+"-1"].sprite.scale.x *= 1 - (opening/1.8);
                        this._images[key+"-2"].sprite.position.x += -opening*1.5;
                        this._images[key+"-2"].sprite.scale.x *= 1 - (opening/1.8);
                        this._images[key+"-1"].material.uniforms.lightIntensities.value = lightIntensitiesVector;
                        this._images[key+"-1"].material.uniforms.curtainOpening.value = windowBrightness;
                        this._images[key+"-2"].material.uniforms.lightIntensities.value = lightIntensitiesVector;
                        this._images[key+"-2"].material.uniforms.curtainOpening.value = windowBrightness;
                        if (thing.curtain != 0)
                            needAnimation = true;
                    } else if (key in this._images && this._images[key].material) {
                        var opening = (curtainOpenings[thing.id] || 0) / 100;
                        this._images[key].sprite.position.y += opening * 2.1;
                        this._images[key].material.uniforms.lightIntensities.value = lightIntensitiesVector;
                        this._images[key].material.uniforms.curtainOpening.value = windowBrightness;
                        if (thing.curtain != 0)
                            needAnimation = true;
                    }
                    break;
                case "central_acs":
                    var tempDiff = thing.set_pt - thing.temp;
                    var a = 0, r = 0, g = 0, b = 0;
                    if (Math.abs(tempDiff) > 0.01) {
                        needAnimation = true;
                        a =  Math.min(Math.max(Math.abs(tempDiff) / 40, 0), 0.04);
                        if (tempDiff > 0)
                            r = 1;
                        else
                            b = 1;
                    }
                    if (this._materials.tempOverlay)
                        this._materials.tempOverlay.uniforms.color.value.set(r, g, b, a);
                    break;
            }
        }

        if (needAnimation && !this.animationTimeout) {
            this.animationTimeout = setTimeout(() => this.stepAnimation(), 50);
        }
    }

    renderLayers() {
        if (this.composer && this.renderer) {
            const width = this.mount.clientWidth;
            const height = this.mount.clientHeight;

            if (width > 1 && height > 1) {
                const maxRenderedLayerWidth = Math.min(this._imageInnerDimensions.width, width - 50);
                const maxRenderedLayerHeight = Math.min(this._imageInnerDimensions.height, height - this.props.navbarHeight - 50);

                var scaler = Math.min(maxRenderedLayerWidth / this._imageInnerDimensions.width,
                                      maxRenderedLayerHeight / this._imageInnerDimensions.height);
                var imgWidth = this._imageDimensions.width * scaler;
                var imgHeight = this._imageDimensions.height * scaler;
                var renderedLayerWidth = this._imageInnerDimensions.width * imgWidth / this._imageDimensions.width;
                var renderedLayerHeight = this._imageInnerDimensions.height * imgHeight / this._imageDimensions.height;
                var maxRenderedLayerDimension = Math.max(renderedLayerWidth, renderedLayerHeight);

                //
                // Render the room layers to a square texture
                //

                if (width !== this._rendererDimensions.width || height !== this._rendererDimensions.height) {
                    this._rendererDimensions = {width, height};
                    this._textures.renderBuffer.setSize(imgWidth, imgHeight);
                    this.renderer.setSize(width, height);

                    this.cameraOrtho.left = -imgWidth / 2;
                    this.cameraOrtho.right = imgWidth / 2;
                    this.cameraOrtho.top = imgHeight / 2;
                    this.cameraOrtho.bottom = -imgHeight / 2;
                    this.cameraOrtho.updateProjectionMatrix();

                    this.compositionCam.left = -width / 2;
                    this.compositionCam.right = width / 2;
                    this.compositionCam.top = height / 2;
                    this.compositionCam.bottom = -height / 2;
                    this.compositionCam.updateProjectionMatrix();

                    this.curtainCam.position.set(0.471774, 1.206649, -14.328379);
                    this.curtainCam.lookAt(new THREE.Vector3(-4.239123, 1.20665, -5.525542));
                    this.curtainCam.aspect = imgWidth / imgHeight;
                    this.curtainCam.updateProjectionMatrix();
                }

                for (var key in this._images) {
                    if (this._images[key].material && !this._images[key].isCurtain) {
                        this._images[key].material.uniforms.offset.value.set(0, 0, 1);
                        this._images[key].material.uniforms.scale.value.set(maxRenderedLayerDimension, maxRenderedLayerDimension, 1);
                    } else if (this._images[key].material) {
                        this._images[key].sprite.position.set(-1.44469-0.12, 1.389754-0.04, -8.079868);
                        this._images[key].sprite.rotation.y = 180.0 * Math.PI / 180.0;
                        this._images[key].sprite.scale.set(5.0, 5.0, 5.0);
                    }
                }
                if (this._materials.tempOverlay) {
                    this._materials.tempOverlay.uniforms.offset.value.set(0, 0, 2);
                    this._materials.tempOverlay.uniforms.scale.value.set(imgWidth, imgHeight, 1);
                }
                if (this._materials.backgroundRender && this._materials.foregroundRender) {
                    var yOffset = (height-renderedLayerHeight) / 2.0 - this.props.navbarHeight;
                    var scaler = Math.max(width / renderedLayerWidth, height / renderedLayerHeight);
                    this._materials.backgroundRender.uniforms.offset.value.set(0, 0, 2);
                    this._materials.backgroundRender.uniforms.scale.value.set(imgWidth * scaler, imgHeight * scaler, 1);
                    this._materials.foregroundRender.uniforms.offset.value.set(0, yOffset, 2);
                    this._materials.foregroundRender.uniforms.scale.value.set(imgWidth, imgHeight, 1);
                }

                this.updateThingSprites(imgWidth, imgHeight);

                this.renderer.render(this.sceneOrtho, this.cameraOrtho, this._textures.renderBuffer, true);
                this.renderer.render(this.curtainScene, this.curtainCam, this._textures.renderBuffer, false);
                this.composer.render();
                this.renderer.render(this.compositionScene, this.compositionCam);
            }
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

        if (Object.keys(totalUpdate).length > 0 && this.renderer)
            this.setState(totalUpdate);
    }

    render() {
        var { loadingProgress, loadedDemo } = this.state;
        var { opacity, dimensions } = this.props;

        var curOpacity = opacity;
        if (!this._materials.tempOverlay || !loadedDemo)
            curOpacity = 0;

        if (opacity >= 1 && loadingProgress >= 1 && !loadedDemo)
            requestAnimationFrame((() => this.runInitialAnimation()).bind(this));

        if (loadedDemo)
            this.renderLayers();

        return (
            <div style={{...styles.container, ...dimensions}}>
                <div
                    style={{...styles.canvas, opacity: curOpacity}}
                    ref={(mount: any) => { this.mount = mount }}>
                    <ReactResizeDetector handleWidth handleHeight onResize={this.renderLayers.bind(this)} />
                </div>

                <div style={{...styles.loadingContainer, opacity: loadedDemo ? 0 : 1}}>
                    <div style={styles.loadingText}>{"Loading..."}</div>
                    <DimmerSlider width={400}
                                  height={10}
                                  value={loadingProgress}
                                  maxValue={1}
                                  glowColor={this._accentColor}
                                  disabled={true}
                                  showKnob={false}/>
                </div>
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
    },
    canvas: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        transition: 'opacity 2000ms',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'opacity 500ms',
    },
    loadingText: {
        fontWeight: 'lighter',
        color: '#ffffff',
        fontSize: 26,
    }
};

module.exports = { RoomState: ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomState) };