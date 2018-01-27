
import * as THREE from 'three'
import { RenderPass, CopyShader } from 'three-effectcomposer-es6'

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

module.exports = { TexturePass };