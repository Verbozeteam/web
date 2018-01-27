
module.exports = {
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

    curtainVertexShader: `
        varying vec2 vUv;
        varying vec4 uvScreen;

        void main() {
            vUv = uv;
            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            gl_Position = projectionMatrix * modelViewPosition;
            uvScreen = gl_Position;
        }`,

    curtainPixelShader: `
        varying vec2 vUv;
        varying vec4 uvScreen;
        uniform float brightness;
        uniform sampler2D textureSampler;
        uniform sampler2D alphaSampler;

        void main() {
            vec2 screenCoords = (uvScreen.xy / uvScreen.w + vec2(1.0, 1.0)) / 2.0;
            gl_FragColor = texture2D(textureSampler, vUv);
            gl_FragColor.rgb *= brightness;
            gl_FragColor.a *= texture2D(alphaSampler, screenCoords).r;
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