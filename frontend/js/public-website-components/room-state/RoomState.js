/* @flow */
import * as React from 'react';
import * as THREE from 'three'
import EffectComposer, { RenderPass, ShaderPass, CopyShader } from 'three-effectcomposer-es6'
import PropTypes from 'prop-types';
import { Grid, Progress } from 'semantic-ui-react';

import ReactResizeDetector from 'react-resize-detector';

import { connect as ReduxConnect } from 'react-redux';

const connectionActions = require('../redux/actions/connection');
import * as tabletActions from '../redux/actions/tabletstate';
import { WebSocketCommunication } from '../../js-api-utils/WebSocketCommunication';



var TexturePass = function ( map, opacity ) {

    RenderPass.call( this );

    if ( CopyShader === undefined )
        console.error( "TexturePass relies on CopyShader" );

    var shader = CopyShader;

    this.map = map;
    this.opacity = ( opacity !== undefined ) ? opacity : 1.0;

    this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    this.material = new THREE.ShaderMaterial( {

        uniforms: this.uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader,
        depthTest: false,
        depthWrite: false

    } );

    this.needsSwap = false;

    this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
    this.scene  = new THREE.Scene();

    this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
    this.scene.add( this.quad );

};

TexturePass.prototype = Object.assign( Object.create( RenderPass.prototype ), {

    constructor: TexturePass,

    render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

        var oldAutoClear = renderer.autoClear;
        renderer.autoClear = false;

        this.quad.material = this.material;

        this.uniforms[ "opacity" ].value = this.opacity;
        this.uniforms[ "tDiffuse" ].value = this.map;
        this.material.transparent = ( this.opacity < 1.0 );

        renderer.render( this.scene, this.camera, this.renderToScreen ? null : readBuffer, this.clear );

        renderer.autoClear = oldAutoClear;
    }

} );




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
    currentStage: number,
    curtainOpenings: {[string]: number},
    lightIntensities: {[string]: number},
    loadingProgress: number, // 0-1, 1 is done
};

class RoomState extends React.Component<PropsType, StateType> {

    static defaultProps = {
        opacity: 1.0,
        navbarHeight: 0,
    };

    state = {
        loadingProgress: 0,
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

    _rendererDimensions = {width: 0, height: 0};

    _shaders: {[string]: string} = {
        basicVertexShader: `
            varying vec2 vUv;

            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,

        onlyPosVertexShader: `
            uniform vec3 scale;
            uniform vec3 offset;
            void main() {
                vec4 modelViewPosition = modelViewMatrix * vec4(position * scale + offset, 1.0);
                gl_Position = projectionMatrix * modelViewPosition;
            }
        `,

        posAndUVVertexShader: `
            varying vec2 vUv;
            uniform vec3 scale;
            uniform vec3 offset;

            void main() {
                vUv = uv;
                vec4 modelViewPosition = modelViewMatrix * vec4(position * scale + offset, 1.0);
                gl_Position = projectionMatrix * modelViewPosition;
            }`,

        pixelShader: `
            varying vec2 vUv;
            uniform float opacity;
            uniform float brightness;
            uniform float grayscale;
            uniform sampler2D textureSampler;

            void main() {
                gl_FragColor = texture2D(textureSampler, vUv) * vec4(brightness, brightness, brightness, opacity);
                float avg = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.0;
                gl_FragColor = mix(gl_FragColor, vec4(avg, avg, avg, gl_FragColor.a), grayscale);
            }`,

        flatPixelShader: `
            uniform vec4 color;

            void main() {
                gl_FragColor = color;
            }`,

        compositionShader: `
            uniform sampler2D tDiffuse;

            varying vec2 vUv;

            void main() {
                vec4 blurred = texture2D(tDiffuse, vUv);

                gl_FragColor = blurred;
            }`,

        hBlur: `
            uniform sampler2D tDiffuse;
            uniform float h;

            varying vec2 vUv;

            void main() {
                vec4 sum = vec4( 0.0 );

                vec4 originalSample = texture2D( tDiffuse, vUv );

                sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0540;
                sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.1216;
                sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1945;
                sum += originalSample * 0.2270;
                sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1945;
                sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.1216;
                sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0540;

                gl_FragColor = sum;
            }`,

        vBlur: `
            uniform sampler2D tDiffuse;
            uniform float v;

            varying vec2 vUv;

            void main() {
                vec4 sum = vec4( 0.0 );

                vec4 originalSample = texture2D( tDiffuse, vUv );

                sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0540;
                sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.1216;
                sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1945;
                sum += originalSample * 0.2270;
                sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1945;
                sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.1216;
                sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0540;

                gl_FragColor = sum;
            }
        `,
    };

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
            image: require('../../../assets/images/room_state/doha2.jpg'),
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
        this.sceneOrtho = new THREE.Scene();

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
        this.renderLayers();
    }

    componentWillUnmount() {
        if (this.renderer) {
            this.mount.removeChild(this.renderer.domElement);
            this.renderer = undefined;
        }
    }

    loadGeometries() {
        this._geometries.paddedPlane = new THREE.Geometry();
        this._geometries.paddedPlane.vertices.push(
            new THREE.Vector3(-0.5,  0.5 * (1080/1920), 0),
            new THREE.Vector3(-0.5, -0.5 * (1080/1920), 0),
            new THREE.Vector3( 0.5, -0.5 * (1080/1920), 0),

            new THREE.Vector3(-0.5,  0.5 * (1080/1920), 0),
            new THREE.Vector3( 0.5,  0.5 * (1080/1920), 0),
            new THREE.Vector3( 0.5, -0.5 * (1080/1920), 0),
        );

        this._geometries.paddedPlane.faceVertexUvs[0].push([
            new THREE.Vector2(0.03125, 1-0.236328125),
            new THREE.Vector2(0.03125, 0.236328125),
            new THREE.Vector2(1-0.03125, 0.236328125),
        ]);
        this._geometries.paddedPlane.faceVertexUvs[0].push([
            new THREE.Vector2(1-0.03125, 0.236328125),
            new THREE.Vector2(1-0.03125, 1-0.236328125),
            new THREE.Vector2(0.03125, 1-0.236328125),
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
            vertexShader: this._shaders.basicVertexShader,
            fragmentShader: this._shaders.hBlur,
        };

        var VBlurShader = {
            uniforms: {
                tDiffuse: { type: "t", value: null },
                v: { type: "f", value: 1.0 / v }
            },
            vertexShader: this._shaders.basicVertexShader,
            fragmentShader: this._shaders.vBlur,
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
                brightness: {value: 0.6},
                grayscale: {value: 0},
                textureSampler: {type: 't', value: this.composer.renderTarget1.texture},
            },
            vertexShader: this._shaders.posAndUVVertexShader,
            fragmentShader: this._shaders.pixelShader,
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
            vertexShader: this._shaders.posAndUVVertexShader,
            fragmentShader: this._shaders.pixelShader,
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
            vertexShader: this._shaders.onlyPosVertexShader,
            fragmentShader: this._shaders.flatPixelShader,
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
            if (this.renderer)
                this.setState({loadingProgress: curProgress / Object.keys(this._images).length});
        }).bind(this);

        for (var key in this._images) {
            const k = key;
            promises.push(new Promise((success, fail) => textureLoader.load(this._images[k].image, (t) => {progress(); success({...this._images[k], key: k, texture: t})}, fail)));
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
                        grayscale: {value: 0},
                        textureSampler: {type: 't', value: this._images[img].texture},
                    },
                    vertexShader: this._shaders.posAndUVVertexShader,
                    fragmentShader: this._shaders.pixelShader,
                    blending: textures[i].blending || THREE.NormalBlending,
                    transparent: true,
                });
                this._images[img].sprite = new THREE.Mesh(this._geometries.paddedPlane, this._images[img].material);
                this._images[img].sprite.position.set(0, 0, 1); // center
                this._images[img].sprite.renderOrder = textures[i].z;
                this.sceneOrtho.add(this._images[img].sprite);
            }
            this._images.doha.material.uniforms.grayscale.value = 0.45;
            this.loadTemperatureOverlay();
            if (this.renderer)
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

    updateThingSprites(imgWidth: number, imgHeight: number) {
        const { roomState } = this.props;
        const { curtainOpenings, lightIntensities } = this.state;

        var curtainBrightness = 0.3 + this.computeLightBrightness() * 0.5;
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
                        var opening = (curtainOpenings[thing.id] || 0) / 100;
                        this._images[key+"-1"].material.uniforms.offset.value.x = (-opening * (imgWidth/2)) / 3;
                        this._images[key+"-1"].material.uniforms.scale.value.x *= 1-opening*(1/3);
                        this._images[key+"-1"].material.uniforms.brightness.value = curtainBrightness;

                        this._images[key+"-2"].material.uniforms.offset.value.x = (opening * (imgWidth/2)) / 3;
                        this._images[key+"-2"].material.uniforms.scale.value.x *= 1-opening*(1/3);
                        this._images[key+"-2"].material.uniforms.brightness.value = curtainBrightness;
                        if (thing.curtain != 0)
                            needAnimation = true;
                    } else if (key in this._images && this._images[key].material) {
                        var opening = (curtainOpenings[thing.id] || 0) / 100;
                        this._images[key].material.uniforms.offset.value.y = (opening * (imgHeight/2)) / 3;
                        this._images[key].material.uniforms.scale.value.y *= 1-opening*(1/2);
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
                const maxRenderedLayerWidth = width - 100;
                const maxRenderedLayerHeight = Math.min(height-300, 800);

                var scaler = Math.min(maxRenderedLayerWidth / 1920, maxRenderedLayerHeight / 1080);
                var imgWidth = this._imageDimensions.width * scaler;
                var imgHeight = this._imageDimensions.height * scaler;
                var renderedLayerWidth = 1920 * imgWidth / this._imageDimensions.width;
                var renderedLayerHeight = 1080 * imgHeight / this._imageDimensions.height;

                //
                // Render the room layers to a square texture
                //

                if (width !== this._rendererDimensions.width || height !== this._rendererDimensions.height) {
                    this._rendererDimensions = {width, height};
                    this._textures.renderBuffer.setSize(imgWidth, imgHeight);
                    this.renderer.setSize(width, height);

                    this.cameraOrtho.left = -width / 2;
                    this.cameraOrtho.right = width / 2;
                    this.cameraOrtho.top = height / 2;
                    this.cameraOrtho.bottom = -height / 2;
                    this.cameraOrtho.updateProjectionMatrix();
                }

                for (var key in this._images) {
                    if (this._images[key].material) {
                        this._images[key].material.uniforms.offset.value.set(0, 0, 1);
                        this._images[key].material.uniforms.scale.value.set(imgWidth, imgHeight, 1);
                        // this._images[key].sprite.scale.set(imgWidth, imgHeight, 1);
                        // this._images[key].sprite.position.set(0, 0, 1); // center
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
                    this._materials.backgroundRender.uniforms.scale.value.set(width * scaler, height * scaler, 1);
                    this._materials.foregroundRender.uniforms.offset.value.set(0, yOffset, 2);
                    this._materials.foregroundRender.uniforms.scale.value.set(width, height, 1);
                }

                this.updateThingSprites(imgWidth, imgHeight);

                this.renderer.render(this.sceneOrtho, this.cameraOrtho, this._textures.renderBuffer, true);
                this.composer.render();
                this.renderer.render(this.compositionScene, this.cameraOrtho);
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
        var { loadingProgress } = this.state;
        var { opacity, dimensions } = this.props;

        var curOpacity = opacity;
        if (!this._materials.tempOverlay)
            curOpacity = 0;

        var progress = null;
        if (loadingProgress < 1)
            progress = <Progress style={styles.progress} size={"medium"} percent={Math.floor(loadingProgress * 100)} progress indicating />

        this.renderLayers();
        return (
            <div style={{...styles.container, ...dimensions}}>
                <Grid style={styles.progressContainer} centered columns={1} verticalAlign='middle'>
                    {progress}
                </Grid>
                <div
                    style={{...styles.canvas, opacity: curOpacity}}
                    ref={(mount: any) => { this.mount = mount }}>
                    <ReactResizeDetector handleWidth handleHeight onResize={this.renderLayers.bind(this)} />
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
        transition: 'opacity 2000ms',
    },
    progressContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    progress: {
        width: 300,
    }
};

module.exports = { RoomState: ReduxConnect(mapStateToProps, mapDispatchToProps) (RoomState) };
